# 02 — Debugging the evaluator

One of the most useful Terra Firma failures was not a bad image.

It was a **bad evaluator**.

## The concept

A Tribeca historical-shoreline print intentionally visualized several former-water zones across areas that are land today.

The visual treatment was deliberate: the print was meant to express temporal change.

## What the evaluator did

The deterministic water-hallucination check compared blue/tinted regions against **current OpenStreetMap water polygons**.

That logic works for an ordinary contemporary map.

For a historical-shoreline concept, it creates the wrong incentive.

~~~text
concept does a better job showing historical water
                 ↓
more “blue over current land”
                 ↓
water-hallucination metric gets worse
~~~

The automated system was effectively penalizing the product for succeeding.

## A second mismatch

The soft palette/greenery judges were also comparing the print against the canonical watercolor style.

They treated the deliberately cool historical zones as palette drift.

Again, the evaluator was scoring against the wrong authority.

## The investigation

The response was not to tune the aggregate score until the image passed.

Instead, the failure was decomposed.

The project identified:

- a real visual failure: adjacent historical zones were collapsing together;
- a deterministic false positive: current-water truth was invalid for the concept;
- a soft-judge context problem: intentional concept treatment was being scored as style error;
- a consequence: optimizing blindly against the score could destroy the intended print.

## Fixes

### Concept-aware soft judges

The evaluator was extended so concept-specific authority could be loaded and supplied to the soft judges.

That let the judge distinguish:

- intentional cool/historical treatment;
from
- actual unwanted palette/style drift.

### Source-treatment change

Measured color differences showed the image model compressed two pale zones until they were nearly indistinguishable.

Instead of asking the evaluator to tolerate that, the deterministic substrate colors were widened so the generated output had more room to preserve the intended distinction.

### Known deterministic false positive left explicit

The current-water hallucination criterion was not quietly relabeled as “pass.”

It stayed recorded as a known problem until the deterministic mask could be extended to include the historical-shoreline geometry.

That matters because unresolved evaluator defects should remain visible.

## General rule

This produced a broader product-engineering principle:

> **Evaluation is part of the product. If the evaluator rewards the wrong thing, optimizing against it makes the product worse.**

This is especially important in AI-assisted systems, where “the judge says 8.3” can easily acquire more authority than it deserves.

## Why this is strong evidence

The sequence shows several distinct skills:

- diagnosing an aggregate score;
- separating true product defects from evaluator defects;
- using deterministic measurement where possible;
- contextualizing model-based judgment;
- refusing to hide a known false positive;
- changing both generation inputs and evaluation logic when evidence required it.
