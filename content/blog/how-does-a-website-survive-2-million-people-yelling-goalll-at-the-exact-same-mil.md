---
title: "How does a website survive 2 million people yelling “GOALLL” at the exact same millisecond?"
date: 2026-07-10
summary: "Picture this. It’s the 89th minute. Messi gets the ball, dances past two defenders like they’re cones in a parking lot, and buries it in the top corner. Your living room…"
tags: ["system-design-interview", "systems-thinking", "system-design-concepts", "twitter"]
draft: false
medium: "https://snehassan123.medium.com/how-does-a-website-survive-2-million-people-yelling-goalll-at-the-exact-same-millisecond-0efd4e57951f"
---

Picture this. It’s the 89th minute. Messi gets the ball, dances past two defenders like they’re cones in a parking lot, and buries it in the top corner. Your living room erupts. And somewhere, at the exact same instant, so do about two million other living rooms, all reaching for their phones to do the same thing: type some version of “GOALLL” and hit post.

From where you’re sitting, this feels like a normal tweet. From Twitter’s servers’ point of view, this feels like getting punched in the face by the entire internet at once. So how does the app not just fall over?

Let’s break it down into 2 main problems.

![](https://cdn-images-1.medium.com/max/900/1*SXWSzHlVbr4fpakOPhCb3w.png)

## Problem one: everyone is writing at the same time

Here’s the basic thing about databases: they’re a bit like an overworked barista. They can handle a steady stream of orders just fine(usually). What they can’t handle is 2 million people showing up at 9:00am sharp and shouting their order simultaneously.

Twitter’s trick is to never make you wait for the barista directly. When you hit “Tweet,” your post doesn’t go straight into some giant central database that instantly gets crushed. Instead, it goes into something called a **queue**, think of it as a conveyor belt. Your tweet gets placed on the belt, you immediately get a “done!” confirmation, and then the actual hard work of saving it, indexing it, and sending it to your followers happens a few milliseconds later, off in the background, at whatever pace the system can handle.

This is the single biggest trick in the whole system: **you don’t need to finish the work to tell the user it’s done.** The user just needs to believe it happened. Everything else can catch up.

> Now in tech terms it usually means that the request initially hits a load balancer, then an API gateway which does the auth and the per-user rate limiting. The rate limiting matters a lot, as it is what prevents the backend from a single huge spike. Then the tweet goes into a Kafka message queue asap and the client get an acknowledgement. ID’s are generated with something like Snowflake(timestamp, shard, sequence) and the writes are basically spread across multiple nodes(shards) instead of just hammering into one db.

## Problem two: getting the tweet to your followers

Okay, your tweet is saved. Now it needs to show up in your followers’ timelines. This sounds simple until you remember that some accounts (looking at you, actual footballers) have 100 million followers.

There are two honest ways to do this:

**Option A: Deliver it the moment it’s posted.** The instant you tweet, the system goes and inserts a copy into every single follower’s timeline (usually a Redis-backed cache), like a newspaper delivery kid sprinting to 100 million doors.

**Option B: Assemble it when someone checks.** Don’t deliver anything in advance. When a follower opens the app, the system quickly gathers tweets from everyone they follow and builds the timeline on the spot, like making a smoothie fresh instead of pre-bottling millions of them. Cheap to “post,” but slower and more work every single time someone opens the app.

Twitter does both, depending on who you are. Regular accounts get the newspaper-delivery treatment, since delivering to your 400 followers is cheap. Massive accounts get the smoothie treatment, their tweets get pulled in on demand instead of blasted out to everyone. Your app quietly stitches both together so you never notice the seam.

## Extra Problem: the live “12,482 people are tweeting about this” number

Cause, when does problems end at just what we had specified.

The “12,000 tweets about that goal in 10 seconds” ticker isn’t computed by counting rows in a database. Actually counting 2 million things happening across hundreds of servers, precisely, in real time, is absurdly expensive.

So instead, the system uses **clever approximation**. It samples the flood of tweets going by, keeps rough-but-statistically-solid running totals, and updates the number every few seconds. It might say 12,482 when the real number is 12,447. Nobody cares. The goal was never precision, the goal was to make you feel like you’re part of something huge, happening right now. Being off by half a percent doesn’t cost anything. Making you wait five extra seconds for a perfectly accurate number would.

> Basically, a classic hot key problem. Tweets are going to flow through a stream processor which does real time aggregation over sliding windows. Counts are approximate at scale, using structures like Count-Min Sketch or HyperLogLog rather than exact counts, because exact global counting across a distributed system in real time is expensive and unnecessary. The “trending” and live score overlays get updated on a short cadence (every few seconds) into a cache, and clients poll or get pushed that cached value, they don’t hit any live aggregation path directly.

## Another extra problem?!!

Last one I promise:)

**Search/discovery :**

Twitter’s real-time search index (called Earlybird) is a separate, sharded, in-memory inverted index optimized for recency over completeness, tuned for what’s happening right now rather than exhaustive historical search.

## TLDR:

The whole architecture basically just boils down to one very simple idea: **don’t make anyone wait for something they don’t actually need right away.**

Messi still scored the same goal either way. Twitter just made sure two million people could celebrate it without breaking the internet.
