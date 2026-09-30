# 01 — Product interaction before UI

## The first question was not “what should this screen look like?”

For a new Planning Coach feature, the first design problem was how it fit into the larger product.

The owner worked with GPT as a reasoning partner on questions such as:

- Which capability owns this behavior?
- Which existing capability already owns the underlying truth?
- What state is durable versus only projected?
- Does this feature create a new action path or only expose an existing one?
- Where does the student enter and where do they return?
- What does the feature explicitly **not** own?
- How does it interact with Board, Feed, Check-in, Email, Work Blocks, and external surfaces?

The owner remained the decision-maker. GPT's role was to help pressure-test system coherence before the decision became an interaction contract or implementation plan.

## Design had to prove understanding

Claude Design's first useful artifact was an interaction contract / behavioral model rather than a polished screen.

The sequence was intentionally:

```text
product meaning
   ↓
ownership
   ↓
states + transitions
   ↓
authorized actions
   ↓
surface behavior
   ↓
visual composition
```

A visually attractive design was not enough if the ownership model was wrong.

## State came before polish

Depending on the feature, Design had to account for:

- loading;
- empty;
- partial/degraded;
- failure/retry;
- stale/conflict;
- long content;
- mutation preview;
- mutation success;
- mutation failure;
- mobile/narrow;
- desktop;
- permission or authority absence.

The point was to expose product meaning under stress before Code had to improvise it.

## Email Reading Surface v2 example

The Email surface carried behavioral rules such as:

- opening the reader is a pure read;
- uncertain badge data must not render as a confident zero;
- semantic noticings activate only on explicit open;
- actions use the server's registered action set rather than a client-invented list;
- only sanitized content is renderable;
- mobile and desktop express the same decisions through different compositions.

Those are product/interaction decisions first and implementation details second.

## What this prevented

Without this stage, an implementation agent could easily:

- make “open” count as “read”;
- treat missing data as zero;
- prefetch content the product intentionally gates;
- invent a local action taxonomy;
- silently change domain ownership while simplifying the UI.

The interaction pass makes those changes explicit product decisions instead of side effects.
