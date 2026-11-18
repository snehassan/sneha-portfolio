---
title: "The Packet Was Sealed. That Was the Entire Promise."
date: 2026-07-21
summary: "Two years of my life belong to NEET."
tags: ["leak-detection", "cryptography", "neet", "data-leak"]
draft: false
medium: "https://snehassan123.medium.com/the-packet-was-sealed-that-was-the-entire-promise-501b3096d6e9"
---

Two years of my life belong to NEET.

I remember the timetable better than I remember most things from that period. Waking up at 4am to do Chemistry first, because it was the hardest and mornings were when I honestly still had some fight in me. A NCERT biology textbook highlighted so many times that it looked like a painting more than something to study. The specific flavour of despair that is Rotational Mechanics at eleven at night. A number on the wall that only ever went down.

And I remember the exam hall. The invigilator holding the sealed packet up so the room could see it was sealed. That small piece of theatre where the system tells you, look, we are being careful with this. We know what it is worth to you.

I did not end up in medicine. Plenty of people I sat that exam with did, and they earned it in a way that is genuinely hard to explain to anyone who has not watched somebody do it up close.

**Which is why the last two months have been hard to look at.**

![](https://cdn-images-1.medium.com/max/1024/1*VF-nE99fPCbEU7n7R9FTHg.jpeg)

## First, the part that is not a puzzle

On 3 May 2026, about 2.27 million students sat NEET-UG. On 12 May it was cancelled, after investigators found that a guess paper circulating beforehand overlapped with the real thing. There is a CBI probe. There have been arrests, including a coaching institute owner. Investigators now think the same network got to the 2025 paper too.

Since 6 June there have been protests at Jantar Mantar. On 28 June, Sonam Wangchuk started an indefinite hunger strike.

I want to be straight about something before I get to the technical part. What follows is an engineering idea, and engineering ideas are the easiest thing in the world to post during a crisis. They make a person sound calm and clever while other people are standing in the sun being angry and hurt.

The anger is not the unsophisticated response here. If you are a youngster and you have now lost a year, or two, to somebody else’s racket, the accurate emotional reaction is rage, and no amount of coding is owed a hearing before that. This is a real fight and other people are having it better than I could.

What I can do is one narrow thing. So here is one narrow thing.

## The question nobody asks

Everybody asks: how do we stop the paper from leaking?

Wrong question. Or rather, it is the question we have been losing at for a decade. The paper is printed weeks early. It moves through presses, trucks, district treasuries, bank strongrooms, and roughly 4,750 exam centres. Thousands of people touch it, many of them on daily wages of a few hundred rupees, being offered bribes worth lakhs. In 2024 the Supreme Court noted that at one centre the rear door of a strongroom was simply opened and unauthorised people got at the papers. It also asked whether question papers should maybe stop travelling in open e-rickshaws.

That is not a cryptography problem. That is a gap in the entire boundary that you can drive through.

So I tried a different question: when it leaks, how fast can we tell exactly where it leaked from?

Right now the answer is nine months, a CBI team, and a lot of luck.

*It could be thirty seconds.*

## Four versions, and why that is useless

NEET already prints multiple versions of the paper. Set A, Set B, Set C, Set D. These are the same questions, shuffled around, so the person next to you cannot copy off your sheet.

Now imagine a leaked paper shows up on Telegram at 6am on exam day. You look at it. You can tell it is Set C.

Yayy congrats. You have narrowed it down to about six lakh people. What now?

Here is the shift, and it really is pretty simple: **stop printing four versions and start printing fifty thousand.** One per room.

## How you get fifty thousand versions without changing the test

Some simple math. You shuffle the answer options. That is it.

Take one question with four options. How many ways can you order them? Four choices for what goes first, three left for second, two for third, and the last one has nowhere else to be. So 4 x 3 x 2 x 1 = **24**. Twenty four different-looking versions of a single question that are all the same question.

Now stack questions, because each one multiplies the last:

- 1 question: 24
- 2 questions: 24 x 24 = 576
- 3 questions: 13,824
- **4 questions: 331,776**

We needed 50,000. Four questions got us more than six times that, and NEET has 180.

For fun, if you shuffled all 180, you would have 24 to the power of 180. That number has 249 digits. You are not going to run out of room numbers.

Nothing about the test changes. Same questions. Same difficulty. Same answer key for everyone, everywhere. A student in Kota and a student in Kozhikode sit the identical exam. The only difference is the seating order of the options.

Room 4127’s paper is arranged one way. Room 4128’s is arranged another. The arrangement is generated from a secret key, so you cannot look at two leaked papers and work out the pattern.

Now the Telegram leak arrives. You glance at the option ordering. It belongs to exactly one room. You know the centre, you know the shift, and you know the names of the four people who were in that room with the sealed packet.

Before the exam has even started.

## The three details that make it actually work

**It has to survive being retyped.** Watermarks are the obvious answer and the obvious answer is wrong. Invisible dots, weird kerning, microscopic printing marks: all of it dies the second someone types the questions into a WhatsApp message, and a gang making lakhs per buyer will absolutely retype. But option ordering survives retyping, because the ordering *is* the content. If they carry the questions, they carry the signature. There is no way to pass on the paper without passing on the fingerprint.

**A torn corner should still be enough.** You do not need 180 questions to encode a room number. You need about four. So spread it across all 180 anyway, redundantly, the way a QR code still scans with a coffee ring on it. Then a blurry photo of one page still names the room. This is the part I find actually satisfying: the leak does not have to be complete to be traceable. It just has to exist.

**Rooms, not students.** My first instinct was one unique paper per candidate, all 2.27 million and honestly it does not seem very feasible. It means every booklet has to reach one specific desk, which means seat assignments must be locked before printing, which means one clerical slip scores somebody against the wrong key and ends a career. Room-level keeps sealed packets of identical booklets, changes nothing operationally, and still takes you from “somewhere among six lakh people” to “this room, this invigilator, today.” Almost all of the value, almost none of the risk.

## What this does not do

I am going to be annoying and undersell my own idea, because the alternative is being the person who claims a weekend project would have saved everyone.

**It would not have prevented this leak. It is not prevention at all.** It is attribution, which matters only because the current attribution is so catastrophically slow that the racket keeps operating across years, on the same exam, apparently with the same people.

It is blind to a leak that happens upstream, before the room versions exist. If the press is compromised, the fingerprint has not been applied yet and none of this helps.

And a determined gang could beat it by paraphrasing every question and alphabetising every option before selling. That costs them hours of manual work per leak, which is the entire point, but it is not zero.

> **Most importantly: none of this touches why the leak is worth so much. There are about 1.1 lakh MBBS seats and 22.7 lakh people who want one. A leaked paper is worth a house. No security system in history has survived that kind of pressure indefinitely, and every scheme in this article is just a way of raising the price of attack. The actual fix is more seats, or admissions that do not hang on one morning in May. Neither is an engineering problem, which is probably why we keep trying to solve it with engineering.**

## The thing I would actually worry about next

The government has said NEET moves to computer-based testing from 2027. Good. It removes the printed paper, which removes most of what I have written about here.

It also opens a door nobody is talking about. In 2021, a JEE Main racket was caught solving papers remotely through screen-sharing software while candidates sat in the centre. Go digital and the paper leak becomes an impersonation problem, a remote-access problem, and a centre-operator problem. Different fence, same gap, and we get to discover it the expensive way in about ten months.

I would rather we discussed that now than in June 2027.

## Coda

I built a small prototype and I don’t expect it to change the present crisis. I built it because concrete proposals are easier to evaluate than abstract suggestions. It is on [GitHub](https://github.com/snehassan/exam-fingerprint).

None of this fixes anything for the students in India right now. I know that. This is a thing I could build, offered to a problem I could not otherwise do anything about, sitting so far away, and I would rather put it somewhere useful than sit on it feeling clever.

If you work anywhere near this system and want the code, take it. No credit needed:)
