# 06 — How the method evolved

The design-to-code process itself changed as Planning Coach learned where the earlier workflow was weak.

## The early Email convention

Email Reading Surface v2 used capability flags for some design controls that did not yet have full live backend support.

The original handoff allowed a pattern roughly like:

> build the control in the component, but gate it in live mode so it can “light up” later.

That made sense as a way to avoid redoing visual work.

But it also created a bad incentive.

A live product could accumulate attractive controls or states whose real capability did not yet exist.

## The later rule

When Planning Coach generalized the Email process into its standing design-first delivery method, it explicitly **superseded** that convention for new surfaces.

The later rule became:

> **No dormant attractive control in the live application merely to save future frontend work.**

If the backend or product authority is absent:

- future-state behavior may exist in Design artifacts or Storybook stories;
- the live application must omit it;
- the gap stays explicit until real capability exists.

## Why the change mattered

This is a small process correction with a large product consequence.

The original optimization prioritized **future implementation efficiency**.

The revised method prioritized **truthful current product behavior**.

That is particularly important in an AI-assisted development environment, where an implementation agent can make a future idea look deceptively complete very quickly.

## Other formalizations added later

The standing process also made several lessons explicit:

- API evidence must precede Design;
- Design returns a port-ready component, not only pictures;
- Code must not independently redesign the component;
- test IDs are load-bearing review infrastructure;
- Storybook/in-app validation is an implementation gate;
- fidelity history is stored durably;
- absent/partial/stale/error states are part of acceptance;
- Design review happens before the independent engineering review board.

## Why keep the evolution visible?

A portfolio process that appears perfect from day one is usually less informative than one that shows what failed.

The design-first method was not invented as a static methodology.

It emerged from actual Design ↔ Code work, and then the repo tightened the process when the first implementation revealed where ambiguity or premature UI could creep in.

That evolution is part of the evidence.
