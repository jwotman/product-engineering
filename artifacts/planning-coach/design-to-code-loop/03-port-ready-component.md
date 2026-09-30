# 03 — Port-ready component

The handoff from Design to Code was intentionally more concrete than a mockup.

## Not “here is a picture”

Claude Design was expected to produce a **port-ready component package**.

For Email Reading Surface v2, the package included:

- behavioral reference components;
- an adapter mapping design concepts to the real wire;
- a gap analysis;
- state examples;
- desktop and mobile treatments;
- interaction behavior;
- controlling contracts/addenda;
- port instructions.

The private instructions divided responsibilities explicitly.

**Claude Design owned**
- composition;
- interaction behavior;
- visual fidelity;
- contract conformance.

**Claude Code owned**
- the real repository;
- wiring;
- tests;
- build integration;
- cutover.

Neither side was supposed to silently take over the other's job.

## What a port-ready handoff carries

The later formalized method requires, as applicable:

- component source and dependencies;
- state/prop contract;
- canonical state examples;
- action inventory;
- responsive behavior;
- loading/empty/error/partial/stale states;
- mutation-result states;
- accessibility expectations;
- token/asset usage;
- explicit unresolved backend dependencies.

## API-shaped fixtures

Fixtures are allowed, but they must reflect the actual wire shape.

This gives Design a controlled environment for exploring state without severing the component from implementation truth.

## Why componentization matters

A screenshot can be recreated many ways.

A component communicates:

- hierarchy;
- interaction;
- responsive behavior;
- state behavior;
- component boundaries;
- stable review/test identifiers.

The Code task becomes:

> **put this accepted interaction into the real application and wire it to verified seams**

rather than:

> **look at this image and build what you think it means.**

## Authority still outranks the component

The component does not authorize behavior that the product contract or governing architecture forbids.

If the reference conflicts with stronger authority, the conflict is surfaced rather than faithfully implementing the wrong thing.

## Email v2 example

The design package carried requirements for five distinct ingest states, badge honesty, pure-read reader open, fetch-on-open semantic details, idempotent actions, mobile/desktop decision treatments, and backstop/error states.

The package therefore carried a meaningful state machine, not only presentation.
