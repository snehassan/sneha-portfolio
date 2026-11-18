---
title: "Overfitting in the Indian Education System"
date: 2026-11-09
summary: "India is very good at producing toppers, but how good are we at producing people who can think (as evidenced by the stark difference in the startup industry of India…"
tags: ["education", "popular", "machine-learning", "ai"]
draft: false
medium: "https://ai.plainenglish.io/overfitting-in-the-indian-education-system-7ef4f20f75a2"
---

![](https://cdn-images-1.medium.com/max/720/0*Fao7sp7Cecb41EAv)

## Introduction

India is very good at producing toppers, but how good are we at producing people who can think (as evidenced by the stark difference in the startup industry of India compared to a few other countries).

You probably know someone who scored a 98 in physics and still can’t tell you why a bridge doesn’t fall (*the structure of a bridge prevents collapse by continuously channeling weight from gravity and traffic away from the road, using compression and tension forces, into the earth*).

Or you have come across an engineer who cracked one of the hardest exams on the planet and then froze during a real life engineering situation.

I work in machine learning, and there’s a word we use for this exact failure: overfitting. Once you see Indian education through that lens, it’s hard to unsee. The nice part is that ML also has a very good playbook for fixing it.

I’m not the first to make this connection honestly. A lot of this piece builds on the overfitting chapter of *Algorithms to Live By* by Brian Christian and Tom Griffiths, which applies ideas like overfitting, cross-validation and early stopping to everyday human decisions. If you like this lens, you should read the book.

## What overfitting actually means

When you train a model, you have to give it examples to learn from. Then you test it on examples it has never seen. Doing well on the first set is easy. Doing well on the second is the test and the whole point. We call that generalizing.

An overfit model cheats. It doesn’t learn the pattern, it memorizes the examples. It learns every quirk, every coincidence, every bit of noise. Its training score looks amazing and then you ship it and it falls apart.

Think of two people prepping for a driving test. One learns to drive and the other memorizes how exactly to drive the examiner’s route . Both pass but only one of them can get to a new city.

**How our system overfits**

If you went to school in India, none of this will be new to you.

We memorize the 1-mark answer for mitochondria word by word — Powerhouse of the cell. But what does that even mean??

Past papers become the syllabus that we learn from. Nobody studies the subject, we study what the exam likes to ask. People tell us to practice the previous year question papers and find out the repeating questions.

Coaching centres take it a step further. They reverse-engineer the exam and sell the tricks (“if confused, always choose option C”). That isn’t teaching. **That’s tuning a model to one test.**

And marks are the only number that matters. They decide your stream, your college, and on a bad day, how you feel about yourself. When one metric decides everything, people optimize the metric and not the skill. The result is board scores so inflated that a 95 tells you surprisingly little about who actually gets it.

## Why the system rewards it

It’s tempting to blame students or teachers. I don’t honestly. Overfitting is the rational move given what we reward.

In ML terms, the learner is fine. The loss function is broken. Take a handful of seats at the top institutions, add lakhs of applicants, and rank 500 versus rank 5,000 becomes the difference between two different lives. Then let one exam, on one day, decide all of it. Congratulations, you’ve built a machine that pays kids to drill and punishes them for wandering off the syllabus.

It doesn’t help that the papers are predictable. Same formats, year after year, so memorizing patterns genuinely works. In ML we’d call that test set leakage. In India we call it a coaching package. Coaching centres put toppers on billboards, schools put them on banners, and at every family function some aunty knows your percentage. Not one of them has ever asked whether you understood thermodynamics.

## The cost: failing on the test set

An overfit model looks brilliant right up until you deploy it. Students are no different. The first crash happens in college, when the board topper meets a professor who asks an open-ended question and then just waits. No answer key. No marking scheme. No “write any five points”. The second crash comes at work, where companies keep complaining that graduates have degrees but can’t solve problems, communicate or build things. That’s a generalization gap, now with a salary attached and an HR team paying for the retraining.

The quieter costs are worse. Spend fifteen years asking “is this important for the exam?” and curiosity gets pruned like a feature that never improved the score. Tie your worth to a number, and one bad result stops being a bad day and starts feeling like a verdict on who you are. We’ve all seen what that does to students. Zoom out far enough and it’s a country problem. A system that rewards reproducing known answers shouldn’t act surprised when it struggles to produce people who find new ones.

## What is already changing

To be fair, the system knows. NEP 2020 literally calls for moving away from rote learning, and CBSE has started acting on it.

From the 2026 board exams, half of every CBSE Class 10 and 12 paper is competency-based: case studies, source-based questions, application problems ([Business Today](https://www.businesstoday.in/education/exams/story/cbse-2026-board-exams-heres-what-majorly-changes-for-class-10-and-class-12-students-under-nep-2020-515841-2026-02-12)). In ML terms, that’s a harder, less predictable test set. Good.

Class 10 students also get a second, optional board exam in May and keep their best score ([Organiser](https://organiser.org/2025/06/28/299761/bharat/cbse-to-hold-two-board-exams-a-year-for-class-10-from-2026-main-exam-in-feb-optional-in-may/amp/)). One bad day no longer decides everything.

These are real steps. But here’s the catch. If competency questions become predictable, coaching centres will just learn to pattern-match those too. A new test only helps if it keeps changing.

## How can we fix it

ML people have spent years fighting overfitting, and most of what works translates almost directly to a classroom. Most of these have been implemented but not in the wide scale it needs to.

### Cross-validation, applied to classrooms

Cross-validation deserves its own section, because it goes straight at the biggest flaw. In ML, you never trust a model because it did well on one split of the data. You test it again and again on different slices, and you only believe the average. Right now we judge a student on one split: one paper, on one day.

Credit where it’s due: *Algorithms to Live By* makes this exact argument about schools. Christian and Griffiths suggest that essays and oral exams can act as a cross-check on standardized test scores, catching students who learned the test instead of the subject. The methods below take that idea and push it further.

Here’s how each flavour of cross-validation could work in a school.

### Stratified k-fold: every test covers every kind of thinking

Stratified k-fold makes sure every fold has the same mix of classes as the full dataset. Otherwise one fold might be all easy examples and another all hard ones.

The classroom version: every assessment should test the same mix of skills. Some recall, some application, some open-ended reasoning. Today a paper can be 80% “write the definition”, and a student who only memorizes walks away with 80%. Stratify the paper and memorization alone can’t carry you.

### Adversarial training: become the trickster

Models get tougher when you deliberately throw inputs at them that are designed to fool them.

So hand students a beautifully written wrong answer and ask them to find the bug. Even better, make them write questions to stump their friends. You can’t design a good trap for something you only memorized. You have to know exactly where people slip.

### Better feedback: give them a gradient

A model learns far more from detailed feedback than from a bare right or wrong. It’s a big part of why human feedback works so well for training language models.

A mark is a loss value. It tells you how badly you did, not which way to move. Written comments, narrative report cards and five honest minutes one-on-one give students a gradient to actually follow. “62/100, see me” is not a gradient.

### Time-series cross-validation: test on the future, not the past

With time-series data, you can’t shuffle. You train on the past and test on what comes next, because that’s how the real world works.

In education, this means testing whether learning lasts and builds. Bring back last term’s concepts inside this term’s problems. If a student aced trigonometry in March and can’t use it in a physics problem in October, they overfit to the March exam.

### Anki: time-series validation you can run on yourself

Students don’t have to wait for the system to do this. Anki is a free flashcard app built on spaced repetition. It shows you a card, asks how well you remembered it, and schedules the next review based on your answer. Things you know come back in weeks. Things you fumble come back tomorrow.

That’s basically time-series cross-validation on your own brain. Every review is a test on a future date, and it tells you what has actually stuck versus what you crammed for one exam.

One warning, though. Anki can make overfitting worse if you use it wrong. A card that says “Define photosynthesis” with the textbook line on the back just trains you to recite. Write cards that force understanding instead:

- “Why does a plant kept in the dark lose weight?” instead of “Define respiration”
- “What breaks if friction were zero?” instead of “State Newton’s first law”
- Cloze cards on a worked problem, so you rebuild the step, not the sentence

Used like that, Anki trains the pattern, not the training data.

### Sandarb: let curiosity branch

Here’s the thing about real learning. It isn’t linear. You read a paragraph, a question pops up, that question spawns two more, and twenty minutes later you actually understand the paragraph. Textbooks don’t work like that. Neither do most AI chat apps, which bury your best tangent fifty messages up a scrolling thread.

[**Sandarb**](https://sandarb.com/), a friend’s brainchild, is built for exactly this. The name comes from *sandarbh*, meaning context. Instead of one long chat, AI answers sit as cards on an infinite canvas. Any card can branch into a follow-up, you can drop in PDF pages from a textbook and question them right beside your notes, and older answers stick around when you ask for a better one. It’s still a working prototype, but the idea is spot on.

## Change the metric before it gets gamed

Once a measure becomes a target, people optimize the measure. Economists call it Goodhart’s law. ML people call it reward hacking. Indian parents call it “what did Sharma ji’s son get?”

The fix is to keep the target moving. Rotate exam formats, weightages and question styles often enough that there’s no stable pattern to exploit. If the coaching centre can’t predict the paper, the student has no option left except to learn the subject.

## Conclusion

Nobody builds an overfit model on purpose. It happens when the only thing you measure is how well it does on data it has already seen. Indian education didn’t choose rote learning. It drifted there because marks were the only signal anyone could see.

The answer isn’t to stop measuring. It’s to measure the right thing: can you take what you learned and use it somewhere new? Build a system that rewards that, and you get people who can handle the only test that really matters. The one nobody can predict.

## Sources

- Brian Christian and Tom Griffiths, *Algorithms to Live By: The Computer Science of Human Decisions* (2016), chapter 7, “Overfitting”
- [CBSE 2026 board exams: what changes under NEP 2020, Business Today](https://www.businesstoday.in/education/exams/story/cbse-2026-board-exams-heres-what-majorly-changes-for-class-10-and-class-12-students-under-nep-2020-515841-2026-02-12)
- [CBSE to hold two board exams a year for Class 10 from 2026, Organiser](https://organiser.org/2025/06/28/299761/bharat/cbse-to-hold-two-board-exams-a-year-for-class-10-from-2026-main-exam-in-feb-optional-in-may/amp/)

---

[Overfitting in the Indian Education System](https://ai.plainenglish.io/overfitting-in-the-indian-education-system-7ef4f20f75a2) was originally published in [Artificial Intelligence in Plain English](https://ai.plainenglish.io) on Medium, where people are continuing the conversation by highlighting and responding to this story.
