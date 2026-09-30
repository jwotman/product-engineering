# 01 — Configurable production pipeline

The product problem was not simply “draw a map.”

It was:

> Can a broad neighborhood-art catalog be produced consistently enough to sell, while keeping the visual and commercial decisions inspectable?

That led to a configuration-driven production system rather than a collection of one-off scripts.

## Product matrix

The core model is:

~~~text
location × style × shape/output treatment
~~~

A location defines geographic scope and metadata.

A style defines the rendering treatment and production branch.

The executor combines those decisions into an asset run and records the result in persistent state.

## Pipeline

~~~mermaid
flowchart LR
    C["Location + style config"] --> O["OSM / geospatial source"]
    O --> G["Geometry processing<br/>clip · classify · project"]
    G --> S["Style engine<br/>palette · draw order · rules"]
    S --> R["Deterministic render"]
    R --> T{"Treatment branch"}
    T -->|"programmatic"| P["Programmatic texture / aging"]
    T -->|"generative"| A["Controlled AI treatment"]
    P --> Q["QA / evaluation"]
    A --> Q
    Q --> F["Listing / print / derivative outputs"]
    F --> M["Persistent manifest / storefront production"]
~~~

## Why configuration mattered

Configuration was not only a code-reuse technique.

It made product choices inspectable.

Examples include:

- a neighborhood-specific bbox;
- a style-specific crop;
- style/location pairing;
- render priority;
- feature draw order;
- aging parameters;
- historical-shoreline treatment;
- whether a style/location combination should be skipped;
- product-image role.

Instead of hiding those decisions inside a renderer branch, the product can represent them as data.

## Deterministic truth vs. generative treatment

A load-bearing architectural boundary is:

> **The underlying map geometry remains deterministic.**

The programmatic system owns:

- geographic source data;
- roads/buildings/water/parks/rail;
- crop and projection;
- geometry ordering;
- structural labels;
- output sizing and identity.

Generative image work is used only where visual variation is useful, such as material/watercolor treatment.

That prevents a texture model from becoming the authority for whether a street, shoreline, bridge, or building exists.

## Why this matters commercially

The architecture supports several product needs at once:

- broad catalog production;
- reproducibility;
- per-neighborhood curation;
- style consistency;
- cheaper regeneration;
- inspectable QA;
- selective use of expensive AI image generation.

A commercial product needs all of those more than it needs a clever one-off image.

## Current-state caveat

The repository's earliest architecture documents list a wider exploratory style matrix than the launch product ultimately used.

The stable artifact is the **config-driven pipeline model**, not the exact early style list.

The production system evolved as style pairings, visual branches, and storefront strategy were narrowed.
