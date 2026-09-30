# 05 — Product decisions corrected by evidence

Terra Firma keeps a long strategy/decision record.

One useful feature of that record is that incorrect assumptions are **retracted**, not quietly rewritten.

## Example 1 — mobile product-image concern

A strategy discussion raised the concern that room-scene product photography might make the print too small to understand on mobile.

That would have implied a meaningful merchandising problem and potentially justified a different mobile image strategy.

The real storefront was inspected.

The print occupied roughly **80% of the mobile viewport**.

The concern was wrong.

### Decision change

The record explicitly retracts the earlier concern and lowers the priority of the proposed room-scene-vs-flat-lay A/B test.

The practical rule is:

> **Inspect the implementation before creating a roadmap item to fix an assumed problem.**

---

## Example 2 — homepage architecture changed

The homepage evolved from a larger neighborhood-focused tile system toward a smaller style-led **Four Ways of Seeing** presentation.

The change reflected a clearer product hierarchy:

- style/surface communicates the artistic interpretation;
- place imagery communicates neighborhood identity;
- props/context communicate audience/use.

The production system changed with it.

Rather than generating unique lifestyle imagery for every SKU, the project moved toward reusable style-based scenes plus deterministic compositing.

That one product decision changed:

- brand consistency;
- production cost;
- AI image-generation volume;
- compositing architecture;
- launch throughput.

---

## Example 3 — collection pages did not reuse the homepage rotator

The homepage already used a rotating hero.

It would have been technically easy to make that a general page pattern.

The collection-page decision instead used a static editorial header.

The reasons crossed several disciplines:

- higher-intent visitors should reach the catalog faster;
- a static header can carry SEO-relevant copy near the top;
- accessibility/maintenance complexity is lower;
- the homepage rotator remains a distinctive brand surface rather than a generic template.

## Why these examples matter

None of these are “engineering optimizations” in isolation.

They combine:

- user behavior;
- visual product judgment;
- conversion;
- SEO;
- accessibility;
- production cost;
- implementation complexity.

That is the kind of boundary-crossing work Terra Firma is meant to demonstrate.

## The pattern

~~~text
assumption
   ↓
inspect / test real product
   ↓
evidence disagrees
   ↓
record correction
   ↓
change product / production plan
~~~

Keeping the correction history makes the product reasoning more credible than a polished narrative that pretends the right answer was obvious from the start.
