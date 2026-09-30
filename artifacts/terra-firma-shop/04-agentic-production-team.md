# 04 — Agentic production team

As the launch workload expanded, the bottleneck stopped being “can an agent execute this script?”

The bottleneck became **coordination**.

## Why parallel agents needed structure

The launch workload included:

- render and texture production;
- generative storefront imagery;
- deterministic compositing;
- image derivatives;
- Shopify theme work;
- product/collection metadata;
- storefront QA.

Running several agents without ownership boundaries would create obvious risks:

- two agents editing the same manifest row;
- one track consuming incomplete output from another;
- duplicate API writes;
- rate-limit contention;
- theme changes landing during QA;
- unclear responsibility for a failed artifact.

## Four-track model

~~~mermaid
flowchart LR
    T1["Track 1<br/>Render & texture pipeline"] --> T3["Track 3<br/>Theme & compositing"]
    T2["Track 2<br/>Storefront image production"] --> T3
    T3 --> T4["Track 4<br/>Storefront upload & QA"]
    T1 --> T4
~~~

### Track 1 — Render & texture

Owns:

- render outputs;
- render manifest rows;
- watercolor/vintage production;
- render QA.

### Track 2 — Storefront image production

Owns:

- room scenes;
- flat-lay surfaces;
- other generative storefront assets;
- image-generation winner logs.

It can run in parallel with rendering because it writes different state.

### Track 3 — Theme & compositing

Owns:

- deterministic PDP compositing;
- image derivatives;
- theme sections;
- collection/deep-dive pages;
- theme deployment/mirror sync.

It consumes outputs from Tracks 1 and 2.

### Track 4 — Storefront upload & QA

Owns:

- Shopify Admin mutations;
- image upload;
- metafields;
- mirror/live QA verdicts.

It is downstream of the production tracks and protects the shared external API budget.

## Explicit locks

The plan introduced a lockfile convention so a track must claim its state scope before mutating it.

Conceptually:

~~~text
track = renders
owner = process / agent
scope = specific manifest rows or output directory
acquired_at = timestamp
~~~

If another track already owns that scope, the second process refuses to start.

This is a small mechanism with an important effect: agent concurrency becomes explicit rather than hopeful.

## Human gates

The automation plan intentionally leaves certain decisions with the operator.

Examples include:

- whether a watercolor treatment is aesthetically acceptable;
- whether a new visual treatment represents the brand;
- final print quality;
- high-impact commercial/launch choices.

Agents can:

- generate;
- measure;
- compare;
- render;
- composite;
- upload after approval;
- prepare evidence.

The operator owns high-judgment acceptance.

## Reusable skills

The project converted repeatable workflows into skills for areas such as:

- render QA;
- watercolor generation/evaluation;
- storefront image work;
- Shopify deploy/upload;
- storefront QA;
- neighborhood evaluation.

The purpose of a skill is not merely to shorten a prompt.

A useful skill packages:

- the relevant source files;
- execution steps;
- decision rules;
- expected artifacts;
- failure/stop conditions.

That makes agent behavior more like a production procedure.

## Status discipline

The multi-agent plan includes both implemented skills/scripts and planned extensions.

The public artifact therefore demonstrates the operating model without claiming that every proposed spin-up/automation capability is already complete.
