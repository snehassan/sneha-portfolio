---
title: "I Tried It: Deploying My First Charm with Juju 4"
date: 2026-11-18
summary: "Over two evenings I put Juju 4.0's two-command promise to the test, starting from an empty cloud account and zero Juju experience."
tags: ["juju", "kubernetes", "canonical", "devops"]
draft: true
---

Juju promises that deploying a database and wiring it to your app takes a couple of commands. Over two evenings I put that promise to the test with Juju 4.0, Canonical's brand-new major release, starting from an empty cloud account and zero Juju experience.

**Spoiler: the promise is real.** Getting to it was the adventure. I hit a Kubernetes that would not start, a tutorial that cannot run on the version it documents, and a database that deadlocked itself after a restart. By the end, I had shipped two of my own apps.

This is the honest first-timer's log: what I did, what broke, and how I got it working.

## Juju in one paragraph

Juju installs and runs software for you. You say what you want ("deploy a database", "connect it to my app", "run two copies"), and packaged automation called **charms** handles the how. A charm is an expert operator turned into code: it knows how to install its app, configure it, connect it to other apps and keep it healthy. Juju keeps track of everything through a **controller**, and groups related apps into **models**, one workspace per project.

## Renting a machine

Juju, Kubernetes and their friends want a clean Linux box they can take over, so I skipped my laptop and rented one. I went with Google Cloud: a 4 vCPU, 16 GB Ubuntu 24.04 VM in Mumbai, the closest region to me. My Google AI Pro plan had quietly banked a few months of $10 Google Cloud credits, which covered the whole experiment. (Claiming them took two timeouts and a refresh. Google's credit page clearly has its own opinions :/.)

One click on SSH and I had a terminal on a computer 800 km away. Time to build.

## Act 1: The Kubernetes that would not start

Juju needs somewhere to run apps, and the easiest local option is MicroK8s, Canonical's single-machine Kubernetes. Install it, enable a few add-ons, done. Or so I thought.

The MetalLB add-on (which hands out network addresses) sat there printing the same line, over and over, for ten minutes:

```
error: timed out waiting for the condition on deployments/controller
MetalLB controller is still not ready
```

The natural move is to blame MetalLB. But listing every pod in the cluster told a different story: Kubernetes' own DNS and networking pods were crash-looping too. Their logs had the real clue:

```
dial tcp 10.152.183.1:443: socket: permission denied
```

Not "connection refused", not "timeout". **Permission denied.** The system pods were not even allowed to open a network socket. That pointed away from networking and toward security policy: most likely the strict (sandboxed) MicroK8s snap clashing with Ubuntu 24.04's AppArmor rules, possibly made worse by the system update I had just run.

A reboot did not help. Swapping strict MicroK8s for the classic (unsandboxed) version did, and every pod came up healthy.

There was one side effect. Strict snaps discover each other through approved sandbox connections, so Juju (also strict) could no longer see MicroK8s on its own. The fix was to hand it the cluster's credentials by hand:

```bash
microk8s config > ~/.kube/config
juju add-k8s mk8s --client
```

> Lesson one: the first error you see is often not the error you have.

## Act 2: Juju 4 at last, and a tutorial that could not run

`sudo snap install juju` finished in seconds. Then `juju version` said **3.6.29**.

The snap store's default channel is still Juju 3.6, the long-term-support release, even though the "latest" documentation is written for 4.0. If you are not paying attention, you follow Juju 4 docs on a Juju 3 client. One explicit channel fixed it:

```bash
sudo snap refresh juju --channel 4.0/stable   # 4.0.16
```

The controller bootstrapped first time, which felt great. Then I followed the official getting-started tutorial: deploy Mattermost (a Slack-like chat app) backed by PostgreSQL. Mattermost deployed. PostgreSQL did not:

```
ERROR not supported Charm cannot be deployed because:
  - charm requires Juju version < 4.0.0, model has version 4.0.16
```

The tutorial pins PostgreSQL 14, whose charm does not support Juju 4. The obvious fix is PostgreSQL 16, but that charm dropped the legacy `db` endpoint that the old Mattermost charm needs to connect. So on Juju 4, there is no PostgreSQL the tutorial's app can talk to. **The getting-started tutorial cannot run as written on the version it documents.**

Even PostgreSQL 16 refused Juju 4 at first, with the same version error. Adding `--force` (which skips the compatibility check) got it deployed, and it ran fine. I dropped Mattermost and moved on.

## Act 3: The magic moment, and the deadlock

With PostgreSQL 16 running, I deployed `data-integrator`, a tiny charm whose whole job is to ask for a database. Then the command Juju is famous for:

```bash
juju integrate data-integrator postgresql-k8s
```

No output. About two minutes later, both apps were `active`, connected over the `postgresql_client` interface, and `juju run data-integrator/leader get-credentials` printed a database, a user and a password that PostgreSQL had created on its own. No config files, no copying passwords around. This is the part of Juju that sells itself.

I scaled PostgreSQL to two units with `juju add-unit`, watched the second one join as a replica, and went to bed happy.

### The next evening

I started the VM again and ran `juju status`. PostgreSQL was not happy:

```
postgresql-k8s/0   waiting   awaiting for member to start
postgresql-k8s/1*  blocked   Failed to create pre-defined roles
```

The `*` marks the **leader**, the unit Juju picks to coordinate an app. During the restart, leadership had moved from `/0` to `/1`. The charm's log told the rest of the story: as the new leader, `/1` decided to initialise the database cluster again, tried to connect to the primary, and got `Connection refused`, because the primary was waiting for `/1`. Each unit was waiting for the other. A textbook deadlock.

Instead of deleting everything, I tried a targeted fix: scale down to one unit, which removes the confused leader.

```bash
juju scale-application postgresql-k8s 1
```

For a few nerve-racking minutes, the removed unit lingered as `agent lost` and still held leadership. Then Juju cleaned it up, handed leadership back to `/0`, and it came back `active` and `Primary`. Nothing lost, nothing redeployed.

One honest caveat: this charm was force-deployed on Juju 4, which it does not officially support yet. This may be a compatibility gap rather than a bug in Juju or the charm, but it is exactly the kind of thing a new user hits on day two.

## Act 4: Charming my own apps

Deploying other people's charms is half the story. The other half is shipping your own code, and Canonical's tooling for a FastAPI app goes through three tools:

1. **Rockcraft** packages the app into a container image (a "rock").
2. **A registry** stores the image so Kubernetes can pull it (MicroK8s has one built in).
3. **Charmcraft** builds the charm: the code that tells Juju how to run, configure and connect the app.

The secret weapon is the `fastapi-framework` profile. `rockcraft init --profile fastapi-framework` and `charmcraft init --profile fastapi-framework` generate nearly everything, as long as your app follows the conventions: a file called `app.py` with an object called `app`, served on port 8080.

## What I learned, and what I would fix

### What delighted me

- **Integration really is one command.** Two apps that know nothing about each other agreed on a database, a user and a password in about two minutes.
- **Recovery was possible with Juju's own tools.** A targeted scale-down untangled a deadlocked database cluster without touching the data.
- **The FastAPI profiles remove most of the boilerplate.** Two init commands and I had a deployable app.
- **Caching makes iteration fast.** A 15-minute first build became a seconds-long rebuild.

### What I would fix first, as a new user

- **Make the getting-started tutorial work on Juju 4.** Swap PostgreSQL 14 and Mattermost for a Juju 4 ready stack, and run the tutorial in release testing so it cannot silently break again.
- **Close the version gap.** `snap install juju` gives 3.6 while the latest docs teach 4.0. Change the default or put the channel step at the very top of the tutorial.
- **Show Juju 4 readiness on Charmhub.** Needing `--force` for Canonical's own flagship database charm is a scary first impression. A clear "works with Juju 4" badge would tell users what to expect before they try.
- **Make errors point at the fix.** `debug-log` rejected `--lines` with `--replay` and with `--no-tail` without saying which combinations are valid, and the refresh error named endpoints that clearly existed. Errors are the docs people actually read.

## The verdict

Juju 4's core idea, that operational knowledge should ship as code alongside the app, held up every time I got to use it. What got in the way was everything around the core: defaults, docs and charms that have not caught up with the new release yet. Those are fixable, and for a .0 release they are not surprising.

Would I use it again? **Yes.** Next on my list: shipping a v0.2 of `greet-api` with `juju attach-resource`, and sharing one database across models with cross-model relations.

## Cheat sheet

| Goal | Command |
|---|---|
| Install Juju 4 | `sudo snap install juju --channel 4.0/stable` |
| Install classic MicroK8s | `sudo snap install microk8s --classic --channel 1.31/stable` |
| Register MicroK8s with Juju | `microk8s config > ~/.kube/config` then `juju add-k8s mk8s --client` |
| Create a controller | `juju bootstrap mk8s my-first-juju-controller` |
| New workspace | `juju add-model <name>` |
| Deploy PostgreSQL 16 on Juju 4 | `juju deploy postgresql-k8s --channel 16/stable --trust --force` |
| Connect two apps | `juju integrate <app-a> <app-b>` |
| Scale | `juju add-unit <app>` or `juju scale-application <app> <n>` |
| Watch everything | `watch -n 2 --color juju status --relations --color` |
| Read a unit's logs | `juju debug-log --include <unit> --replay --no-tail \| tail -40` |
| Build an image | `rockcraft init --profile fastapi-framework` then `rockcraft pack` |
| Build a charm | `charmcraft init --profile fastapi-framework --name <app> --author "<you>"`, `charmcraft fetch-libs`, `charmcraft pack` |
| Deploy your own charm | `juju deploy ./<app>_amd64.charm <app> --resource app-image=localhost:32000/<app>:0.1` |

*Setup: Google Cloud e2-standard-4 VM, Ubuntu 24.04, MicroK8s 1.31 (classic), Juju 4.0.16, November 2026.*
