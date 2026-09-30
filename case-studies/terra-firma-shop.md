# Terra Firma Shop

## Owning a commercial product across strategy, production engineering, AI-assisted design, and storefront delivery

**Role:** Product owner, product engineer, and operator  
**Implementation model:** AI-native development using Claude Code skills and headless agent workflows, with human judgment gates for brand, visual quality, and commercial decisions  
**Stack:** Python, GeoPandas, Shapely, Matplotlib/Cairo, Pillow/OpenCV, Gemini-assisted visual workflows, Shopify, Playwright, Remotion, YAML/config-driven production systems  
**Status:** Pre-launch commercial product; core production pipeline and storefront tooling are substantially implemented, with launch work still active

---

## The product problem

Terra Firma began with a commercial question:

> Could neighborhood map art be produced with enough visual quality and local specificity to feel designed, while using software to make a broad catalog economically feasible?

A one-off art print is straightforward.

A product catalog is not.

To make the idea commercially viable, I had to decide:

- which neighborhoods were worth producing;
- which visual styles worked for which places;
- how much of each print should be generated deterministically;
- where an image model added value and where it damaged cartographic truth;
- how to produce print, listing, and storefront assets consistently;
- how broad the launch catalog should be;
- how pricing and merchandising should work;
- how the storefront should present the work on mobile and desktop;
- how to automate production without automating away the judgment that made the product distinctive.

The result became more than a rendering script. It became a small production system spanning product strategy, geospatial data, AI-assisted creative work, e-commerce, QA, and launch operations.

---

## What I owned

I worked across the full product chain:

- market and catalog strategy;
- neighborhood selection and scoring;
- style strategy and style/location pairing;
- pricing and product structure;
- render-pipeline architecture;
- visual-quality criteria;
- AI-assisted image workflows;
- Shopify information architecture and storefront presentation;
- mobile and browser QA;
- multi-agent production workflows;
- launch sequencing and operator gates.

The project is useful portfolio evidence because the boundaries between "product," "design," "engineering," and "operations" were artificial.

A decision about the visual promise of a style could change the renderer.

A mobile storefront finding could change the merchandising strategy.

A limitation in an image model could require a new deterministic evaluator.

A production bottleneck could justify a new Claude skill rather than another manual checklist.

---

## 1. From a commercial question to a configurable production system

I did not begin by deciding to build a generic map renderer.

The first product question was whether a pre-generated catalog made sense at all.

I built a neighborhood-scoring approach around signals such as:

- local identity;
- residential density;
- real-estate/commercial signal;
- search demand;
- tourism/visitor interest;
- social signal;
- visual/pipeline fit.

AI could accelerate research and initial scoring, but the process separated higher-confidence evidence from inference and required operator calibration for uncertain inputs.

The product decision was then reflected in the production architecture:

**location × style × output treatment** became a configurable matrix rather than a collection of hand-authored files.

The pipeline reads location and style configuration, fetches and caches map data, prepares geometry, applies style rules, renders, labels, applies deterministic finishing passes, writes multiple output formats, and records the result in a persistent manifest.

The same architecture supports one exploratory render or a large catalog run.

### Why configuration mattered

The goal was not merely code reuse.

A config-driven system made product decisions inspectable.

For example:

- one neighborhood can use a tighter crop for a particular style;
- a style can change draw order without branching the renderer;
- a location/style pairing can be skipped because the geography does not support the visual idea;
- aging and finishing treatment can vary without forking the core pipeline;
- launch priority can be represented separately from render priority.

Artistic and merchandising choices therefore remain explicit product data rather than slowly becoming hidden special-case code.

---

## 2. I separated deterministic truth from generative treatment

One of the core architecture decisions was that AI should not be responsible for the map's underlying geography.

The deterministic pipeline owns:

- source geospatial data;
- geometry;
- projection and crop;
- roads, buildings, water, parks, rail, and other mapped features;
- style rules that can be expressed programmatically;
- labels and structural layout;
- output sizing and file identity.

Generative image work is used selectively as a **treatment layer**, particularly for effects such as watercolor.

That boundary became increasingly important as the product matured.

An image model is good at material character and visual texture.

It is much less trustworthy as the authority for whether a street, bridge, shoreline, or building should exist.

### The operating principle

> **Use AI where variation is valuable; keep deterministic ownership where fidelity matters.**

That principle shaped both the renderer and the QA system.

---

## 3. Visual QA became an engineering problem

Some of the most useful Terra Firma engineering work started when a human noticed a visual problem before the automated system did.

For watercolor, I built a workflow around:

1. deterministic source/intermediate render;
2. controlled Gemini transformation;
3. compositing back into the product format;
4. automated evaluation;
5. operator review;
6. targeted repair or regeneration.

The evaluation system combines deterministic image checks with model-based judgment for softer aesthetic properties.

### When the evaluator itself was wrong

A historical-shoreline concept for Tribeca exposed an important failure.

The design intentionally showed former shoreline/water zones over areas that are land today.

A deterministic "water hallucination" check used current OSM water as truth.

That meant the better the historical concept worked, the worse that metric scored it.

Separately, soft visual judges were penalizing intentional cool/blue historical treatment because they were comparing the print against the canonical warm watercolor baseline.

Instead of accepting the aggregate score, I investigated the reasons behind it.

The response was to make the evaluators **concept-aware**:

- load the concept-specific design/prompt authority;
- tell soft judges which departures from the canonical style are intentional;
- continue scoring genuine palette and quality failures inside the concept;
- preserve the known deterministic false-positive as an explicit unresolved issue instead of pretending the metric was valid.

The same iteration led to source-color changes after measured color differences showed that the image model was collapsing pale water zones together.

This produced a broader rule for the product:

> **Evaluation is part of the product. If the evaluator rewards the wrong thing, optimizing against it makes the product worse.**

---

## 4. Product decisions changed when the real storefront contradicted assumptions

Terra Firma has a long decision history, and I intentionally kept corrections rather than cleaning them out of the record.

### A mobile concern was retracted after inspecting the real implementation

An early strategy discussion raised a concern that room-scene product imagery would make the print too small to understand on mobile.

The actual storefront contradicted that assumption.

The print occupied roughly 80% of the mobile viewport, so the concern was materially wrong.

The decision record explicitly retracted the concern and reduced the priority of a proposed A/B test.

That is a small example, but it reflects the way I want product decisions made: **inspect the product, then change the decision when the evidence changes.**

### Homepage merchandising changed as the visual system became clearer

The homepage evolved from a broader neighborhood-tile approach toward a smaller **"Four Ways of Seeing"** style-led presentation.

That was not simply a copy change.

It reflected a clearer product hierarchy:

- **style/surface** communicates the visual interpretation;
- **place photography** communicates neighborhood identity;
- **props/context** communicate audience and use.

The production architecture changed with it.

Instead of generating unique lifestyle imagery for every product, the system moved toward reusable style-based surface imagery plus deterministic compositing.

That reduced production cost and made the brand system more coherent.

### Collection pages did not inherit the homepage rotator

The homepage already had a rotating hero.

For collection pages, I chose a static editorial header instead of reusing the rotator everywhere.

The reasoning combined:

- higher-intent browsing behavior;
- faster access to the product grid;
- SEO copy near the top of the page;
- simpler accessibility and maintenance;
- preserving the rotator as a homepage-specific brand device.

This is representative of the product: many important decisions sit between conversion, brand, content, UX, and implementation rather than belonging neatly to one discipline.

---

## 5. I treated the storefront as software, not just merchandising

The Shopify work was not limited to uploading products.

I created a mobile-first QA path using Playwright.

The automated storefront checks include:

- homepage reachability;
- locked hero copy;
- core merchandising sections;
- style collection pages;
- sampled product detail pages;
- product images;
- Open Graph metadata;
- Product structured data;
- console errors;
- mobile horizontal overflow;
- mobile navigation;
- minimum tap-target sizing.

The routine path runs against an unpublished theme mirror so an agent can validate the current storefront without requiring the password-protected live shop to be exposed.

A separate pre-launch live-window mode is designed to exercise real DNS/CDN and live-site behavior when the operator deliberately opens the storefront.

### Why mobile is first

The QA system runs mobile viewports before desktop.

That is a product choice, not only a testing preference.

The storefront's visual product has to survive the smallest and most constrained primary shopping surface. A desktop-perfect page with unreadable product art, horizontal overflow, or undersized controls on mobile is not a passing implementation.

---

## 6. AI image generation became a controlled production capability

Terra Firma uses AI image generation for work that would otherwise become a large manual production bottleneck: material treatments, room scenes, storefront imagery, and selected visual experiments.

But the workflow does not treat "the model returned an image" as completion.

I built reusable skills and process around:

- generation prompts tied to a specific visual contract;
- reference-image use;
- deterministic source images;
- style/location-specific constraints;
- automated and human QA;
- repair workflows;
- saved evaluation reports;
- known-good exemplars;
- repeatable derivative generation.

The important distinction is between **creative generation** and **production acceptance**.

The model can create candidate material.

The production system decides whether that candidate belongs in the product.

---

## 7. I built agentic production tooling around the real bottlenecks

As the launch workload grew, manually invoking scripts one by one stopped being the right abstraction.

I created and planned a set of Claude Code skills around repeatable product operations, including capabilities for:

- neighborhood evaluation;
- render QA;
- watercolor generation and evaluation;
- aging prescriptions;
- image derivatives;
- Shopify deployment;
- Shopify image upload;
- live storefront QA;
- research into new styles, locations, techniques, and data sources.

The point of a skill was not to make a prompt shorter.

A useful skill packages the relevant sources, rules, workflow, expected artifacts, and stopping conditions so an agent can execute a known production procedure repeatedly.

### Example: separating judgment from repeatable work

Some decisions remained deliberately human:

- whether a visual treatment is good enough to represent the brand;
- whether an unusual neighborhood/style pairing should ship;
- physical print quality;
- final commercial direction.

The repetitive work around those decisions can be automated:

- generate candidates;
- produce derivatives;
- run deterministic checks;
- collect evidence;
- prepare comparison material;
- update state;
- deploy after approval.

This creates a useful division:

**agents prepare and execute; the operator owns high-consequence judgment.**

---

## 8. I designed a small agentic "production team"

The multi-agent launch plan formalized that operating model.

Instead of having several agents touch the same repository indiscriminately, the launch work was divided into distinct tracks such as:

- render and texture pipeline;
- storefront image production;
- theme and compositing;
- Shopify upload and QA.

Each track had explicit ownership of its files/state and known dependencies on other tracks.

A lock convention was designed to prevent two agents from mutating the same production state concurrently.

The launch plan also identified the points where parallelism should stop and a human gate was required.

### Why this mattered

AI makes it easy to create more simultaneous work than the product can safely absorb.

The production problem becomes coordination:

- which agent owns which state;
- which work is actually independent;
- when downstream work is allowed to start;
- which outputs require human approval;
- how rate limits and shared external APIs are protected;
- how a later agent knows what an earlier agent actually did.

The multi-agent plan was an attempt to treat those as production-design questions rather than improvising every session.

---

## 9. The project joined commercial reasoning and engineering reasoning

Terra Firma is also where I worked most directly on questions that are clearly commercial rather than purely technical.

Examples include:

- catalog breadth;
- launch neighborhood selection;
- style/location pairing;
- pricing and margin;
- product imagery strategy;
- print substrate choices;
- homepage information architecture;
- collection-page SEO;
- which assets deserved expensive generative work;
- which production steps could be reused across many SKUs;
- how much pre-generation made sense versus future customization.

Those decisions frequently changed what should be built.

For example, the shift toward reusable style-based room scenes plus deterministic product compositing was simultaneously:

- a brand-system decision;
- a cost decision;
- a production-throughput decision;
- an implementation decision.

That cross-functional compression is one reason I enjoy product-engineering roles.

---

## 10. A separate R&D path let product exploration stay cheap

Not every idea deserved production architecture.

For example, I used Remotion to prototype a vocabulary for animated map storytelling and created a short Collect Pond/Five Points story experiment.

The purpose was explicitly exploratory: determine how far 2D/2.5D techniques could go before something heavier such as Blender was justified.

That branch included deterministic frame-based animations, geospatial layers, historical geometry, and a short narrative composition.

It was kept separate from the launch pipeline.

That separation matters to me:

> **A prototype should answer a question cheaply before the product inherits the prototype's complexity.**

---

## 11. What is proven versus still in progress

### Implemented / demonstrated

The private repository contains:

- a substantial deterministic geospatial render pipeline;
- configuration-driven location/style production;
- programmatic aging and texture passes;
- multiple output formats;
- persistent render state/manifest handling;
- AI-assisted watercolor workflows;
- visual evaluation tooling;
- synthetic and regression-oriented QA artifacts;
- Shopify production tooling;
- mobile-first Playwright storefront QA;
- numerous reusable Claude Code skills;
- a multi-agent launch/production design;
- a Remotion-based map-animation POC.

### Still in progress

The product remains pre-launch.

Some launch and automation work in the repository is explicitly planned rather than completed, including portions of the broader spin-up framework, marketing distribution, fulfillment automation, and recurring architecture/research workflows.

I do not treat those planned capabilities as shipped evidence.

---

## 12. What I would show in a technical/product review

I would walk through:

1. **The render pipeline** — configuration → OSM/geospatial preparation → style → render → finishing → outputs → manifest.
2. **A style/location decision** — showing how product/art judgment becomes configuration rather than a code fork.
3. **The Tribeca watercolor/evaluator failure** — because it demonstrates that I debug the evaluation system rather than optimize blindly against a score.
4. **A storefront product-decision correction** — mobile hero or homepage architecture.
5. **The Playwright storefront QA path** — customer-facing product behavior translated into automated acceptance.
6. **The Claude skill inventory and multi-agent launch plan** — how repeatable work was converted into operating infrastructure.
7. **The Remotion experiment** — a bounded example of prototyping a new product capability without prematurely integrating it.

Private source access can be provided for technical review.

---

## What this case study is meant to demonstrate

Planning Coach shows my deepest work in sensitive-data product architecture and AI governance.

Weekend Render shows rapid technical investigation and evidence-driven infrastructure decisions.

Terra Firma demonstrates **breadth**.

It shows that I can take a commercial product across:

**market question → product strategy → system design → production code → AI-assisted creative workflow → customer-facing storefront → QA → launch operations**

without requiring each boundary to become a separate handoff to another discipline.

It also demonstrates a recurring pattern across my work:

- use AI agents aggressively for throughput;
- give them bounded, explicit jobs;
- keep source-of-truth state inspectable;
- automate repeatable evaluation;
- reserve human judgment for the decisions where judgment is actually the product.
