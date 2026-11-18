---
title: "I Let My Sleep Tracker Rearrange My Calendar. Here’s How I Wired It Up."
date: 2026-07-27
summary: "A field guide to the WHOOP API, written by someone who read the docs so you get to skip the confusing parts."
tags: ["api", "software-development", "health", "api-development", "whoops"]
draft: false
medium: "https://snehassan123.medium.com/i-let-my-sleep-tracker-rearrange-my-calendar-heres-how-i-wired-it-up-4d803d475075"
---

*A field guide to the WHOOP API, written by someone who read the docs so you get to skip the confusing parts.*

![How it looks when you run it, I have removed the text under each blocks, but usually there’s text there.](https://cdn-images-1.medium.com/max/1024/1*4iLi7RRe3du7ib2V05Y2sA.png "How it looks when you run it, I have removed the text under each blocks, but usually there’s text there.")

There is a specific flavor of stubbornness where you decide the problem isn’t *you*, it’s that your calendar refuses to acknowledge you’re a human being with a nervous system.

I have a WHOOP (and ADHD). Every morning it hands me a recovery score, a number from 0 to 100 that quietly summarizes whether my body is ready to do things or would prefer to be left alone. And every morning I would look at that number, nod thoughtfully, and then proceed to run the exact same 8am-to-late schedule regardless of whether I’d slept like a baby or like someone being haunted.

So I built a thing. It’s called **daily-os**, and it’s small: it pulls my recovery score over the WHOOP API, figures out what kind of day I’m allowed to have, and reshapes my schedule to match. Green recovery, pack the hard stuff in early. Red recovery, the calendar quietly stops trying to kill me. Woke up at 11 instead of 8? Every block slides down to match reality instead of judging me for it.

This post is the guide I wish I’d had when I started: how to actually talk to the WHOOP API, where the docs are great, and the two or three spots where I lost an hour so you don’t have to.

## The 30-second mental model

Before any code, here’s the shape of the thing, because the WHOOP API is refreshingly boring once you see it, and boring is a compliment in infrastructure.

- Everything lives under one base URL: [https://api.prod.whoop.com.](https://api.prod.whoop.com.)
- Every request needs a **Bearer token**, which you get through an **OAuth 2.0 authorization-code flow**. There is no API-key shortcut. WHOOP data is somebody’s body, so you have to ask the human first.
- You request **scopes** -read:recovery, read:sleep, read:cycles-and the user grants them. Ask for exactly what you need and nothing more. Nobody wants to click "allow" on an app demanding their whole life.
- Data comes back **paginated and sorted newest-first**, which is the single nicest design decision for my use case, and I’ll explain why later.

That’s it. Auth, scopes, paginated reads. Let’s wire it up.

## Step 1: The OAuth dance (the part I dreaded the most)

OAuth has a reputation for being a tough nut to crack. It isn’t, really. It’s four steps, and only two of them are interesting.

First, register an app in the **WHOOP Developer Dashboard**. You get a client_id, a client_secret, and you register a **Redirect URL** , the place WHOOP sends the user back to after they say "yes, this app can see my sleep." Register the redirect URL *exactly*, trailing slashes and all. This is confusing-error-message spot number one: a mismatched redirect URL fails in a way that does not clearly say "your redirect URL is mismatched."

Then you send the user to WHOOP’s authorization URL with your client_id, your scopes, and a state parameter. That state value isn't decoration , it's your CSRF guard. Generate a random string, stash it, and check it comes back unchanged. Skip it and you've left a door open; WHOOP's docs are refreshingly stern about this, and they're right to be.

The user approves, WHOOP redirects back to you with a short-lived **authorization code**, and you trade that code for tokens at the token endpoint:

```
POST https://api.prod.whoop.com/oauth/oauth2/token
```

You send the code, your client credentials, and the grant type; you get back an access_token and a refresh_token. The access token is your key to everything. The refresh token is the thing you will forget about and then remember at the worst possible moment.

**The honest advice:** don’t do this on your own. Use an OAuth library for your language: I used a standard one and let it manage the redirect and token exchange. The WHOOP docs even point you toward recommended libraries, which is what saved me an afternoon(or more, IDK honestly).

## Step 2: Asking for the recovery score

Once you’re holding an access token, the actual data part is almost anticlimactic. Every read is the same move: a GET request with your token in the Authorization header.

Here’s the shape of it:

```
const res = await fetch(
  "https://api.prod.whoop.com/developer/v2/recovery",
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
```

```
const data = await res.json();
```

The recovery endpoint hands back a paginated list of recovery records, newest first. Each record carries the three numbers I actually care about: the **recovery score** (0–100), **heart rate variability (HRV)**, and **resting heart rate (RHR)**. HRV up and RHR down is your body saying “let’s go.” HRV down and RHR up is your body filing a formal complaint.

Because the list is sorted newest-first, getting *today’s* recovery is just: take the first element. No date filtering, no querying, no “give me the record where date equals today” gymnastics. The API’s default sort order *is* the query I wanted. This is the part I meant about paginated-newest-first being a gift , for a “what’s my status right now” app, the most recent record is always index zero.

## Step 3: Turning a number into a day

This is the part that isn’t really WHOOP-specific , it’s my decision, which is the bestpart anyway.

A raw recovery score is useless until you decide what it *means*. So daily-os buckets it into three day-modes:

- **Green (recovery high):** front-load the day. Hard, focus-heavy work goes in the morning while the tank is full. Ambition is allowed.
- **Yellow (recovery middling):** a normal day. Nothing heroic, nothing lazy.
- **Red (recovery low):** protect the human. Lighter blocks, more breaks, and the schedule stops pretending today is a day for greatness.

Then there’s the second input that made this feel genuinely mine: **actual wake time**, which you can pull from the sleep endpoint (read:sleep scope). Most schedulers assume you wake at a fixed hour and then silently shame you when you don't. daily-os reads when I *actually* woke up and shifts every downstream block to match. Slept in two hours? The whole day slides two hours. The calendar bends around the body instead of the other way round.

That’s the entire thesis of the project in one sentence, and it took a 0-to-100 integer and one timestamp to build.

## Step 4: The gotcha that will get you: token expiry

Here’s the hour I lost, gift-wrapped for you.

Access tokens expire. This is correct and good security design and also the thing that will make your app mysteriously start returning 401s a few hours after it was working perfectly. You’ll stare at code you didn’t change, wondering what broke. Nothing broke. The token just aged out, the way tokens are supposed to.

The fix is the refresh_token you got back in Step 1 and promptly ignored. When a request comes back unauthorized, you use the refresh token to quietly mint a new access token and retry, no human required. Build this in *before* you need it, because you will need it, and you'll need it at 8am when you're trying to find out whether you're allowed to have a hard day.

**Developer-experience footnote for the WHOOP team, since I’m being honest:** the docs are genuinely strong on the initial flow, but the refresh-token lifecycle is the spot where a slightly louder “hey, wire this up now” callout would save people that exact hour. Everything up to the first successful token felt guided. The “keep it alive” part I had to learn by watching it break.

## What I actually learned

The WHOOP API is a well-designed boring machine, and I mean that as high praise. One base URL. One auth flow. Scoped, paginated, newest-first reads. Once the OAuth handshake clicks, the rest is just polite GET requests to something that already sorted the data the way you wanted.

The lesson that stuck wasn’t really about WHOOP. It was that the interesting part of an integration is almost never the API. It’s the small product decision on top, deciding that a recovery score should *do* something, that a wake time should bend a calendar. The API just has to get out of the way, and this one does.

Now if you’ll excuse me, my recovery is red today, and my calendar has already cleared the afternoon for me (you sentient being)

*daily-os is on my*[*GitHub*](https://github.com/snehassan/daily-os)*if you want to poke at it. It reads your WHOOP recovery, detects your wake time and day-mode, and reshapes your schedule or you can skip the integration and drive it manually. Built with TypeScript and a mild grudge against fixed schedules.*
