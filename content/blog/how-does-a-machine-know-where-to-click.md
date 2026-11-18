---
title: "How Does a Machine Know Where to Click?"
date: 2026-06-22
summary: "Picture this: you hand an AI agent control of your screen for the first time. It has never seen this exact app, this exact layout, this exact shade of blue on the…"
tags: ["ai-agent", "ai"]
draft: false
medium: "https://snehassan123.medium.com/how-does-a-machine-know-where-to-click-f4d39017d45c"
---

Picture this: you hand an AI agent control of your screen for the first time. It has never seen this exact app, this exact layout, this exact shade of blue on the “Submit” button. And yet, a heartbeat later, the cursor glides to the right spot and clicks. Not roughly right. Exactly right.

It feels like magic right. The first time I pondered over it, I was like this isn’t traditional CV pipelines. 
It isn’t. It’s something better: generalization.

## The Tempting Wrong Answer

The easy explanation is that the AI memorized a map. Somewhere in its training, it saw this exact screen before, and it’s just replaying the move, like a chess engine recalling an opening line.

But that can’t be true, because screens are infinite. Every app, every theme, every browser zoom level, every monitor resolution creates a slightly different arrangement of pixels. No lookup table could possibly hold them all. If the model were memorizing positions, it would shatter the moment someone changed their font size.

So the model isn’t remembering where buttons are. It’s recognizing what a button is.

## Learning to See “Button-ness”

Think about how you recognize a chair. Not a specific chair you’ve memorized, but the category itself: four legs (sometimes), a seat, something built for sitting. You can spot a chair shaped like a giant baseball glove and still know it’s a chair. Your brain learned the abstract shape of “chair,” not a catalog of every chair you’ve met.

AI agents that click on screens learn the same way, except the category is “clickable thing.” Across millions of screenshots, certain patterns repeat: rounded rectangles with padding, a word sitting centered inside a shaded box, a slight color shift when something is interactive, an icon shaped like a trash can or a gear. None of these patterns belong to one app. They are conventions, a visual grammar that designers everywhere quietly agree on, often without realizing it.

The model absorbs that grammar. Then it applies it to whatever is in front of it, the way you’d recognize a chair you’ve never seen before.

## Reading Is Cheating (in the Best Way)

Here’s the part that makes the trick even sturdier: most buttons have words on them. “Submit.” “Cancel.” “Next.”

If the instruction is “click Submit,” the model doesn’t need deep visual intuition at all. It just needs to read the screen, find the text that says “Submit,” and report where that text lives. Reading is a skill that transfers perfectly across every interface on Earth, because text doesn’t care what app it’s rendered in.

So a huge amount of what looks like uncanny visual intelligence is really just literacy, applied to pictures instead of pages.

## Position Is Relative, Not Absolute

The last piece: the model rarely thinks in raw coordinates. It thinks in relationships. The checkbox sits to the left of its label. The “Next” button sits below the form. The close icon lives in a corner.

Relationships like these survive no matter how the layout shifts. A button can move from the top of the screen to the bottom, and the relationship (“next to its label,” “below the last field”) still holds. That’s the difference between memorizing a photograph and understanding a sentence. Sentences can be rearranged and still make sense, because meaning lives in structure, not position.

## The Loop That Keeps It Honest

None of this is perfect on the first try. So the agent doesn’t click blind and walk away. It clicks, then looks again. A fresh screenshot comes back, and the model checks: did that work? Did the page change the way I expected?

It’s less like a sharpshooter and more like someone feeling their way through a dark room, hand outstretched, adjusting with every step. The accuracy isn’t really in any single click. It’s in the willingness to keep checking. And sometimes it is a long tedious process.

The AI doesn’t know your screen. It knows what screens are made of.
