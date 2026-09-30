# 04 — Proven vs active alpha

Weekend Render has two different kinds of evidence and they should not be blurred.

## Proven on merged POC evidence

The completed POC established the underlying feasibility of:

- remote Flamenco control;
- shared farm storage;
- real GPU Cycles rendering;
- external project dependencies through the transfer path;
- disconnecting the submission host after acceptance;
- job completion without an active local control connection;
- worker-loss recovery;
- replacement-worker continuation;
- measured local/cloud timing and cost;
- checksum-verified output retrieval.

Those claims are backed by executed POC cases in the merged repository.

## Proven on active implementation branches

The stacked alpha work goes beyond the original POC.

Open branches contain evidence for things such as:

- Railway-driven estimate/decision/render/retrieval orchestration;
- private object-storage output handling;
- local loopback real-component farm tests;
- Blender add-on core/state machine;
- multiple still-image formats;
- frame-step handling;
- real Paramiko/Shaman/R2 paths;
- upload-first signed object-storage grants and accepted-source staging.

These are meaningful implementation results.

They are still **open-branch evidence**, not production deployment.

## Currently active / incomplete

The upload-first branch explicitly remains incomplete.

At the current recorded state, later work still includes portions of:

- GPU qualification/selection behavior;
- broader capacity handling;
- notification/preview control;
- add-on packaging;
- final live acceptance of the upload-first path.

The branch itself states that it is not deployed.

## Why status discipline matters

A portfolio can easily turn an active branch into a false “shipped” story by compressing all development history into one paragraph.

Weekend Render is more useful if the boundaries stay visible:

| Claim | Portfolio wording |
|---|---|
| POC executed on real infrastructure | **Proven** |
| Local/live component test on an open branch | **Implemented/tested in active alpha** |
| Architecture approved but implementation incomplete | **In development** |
| Idea or future direction only | **Planned / under evaluation** |

## Example: upload-first

It is accurate to say:

> The active alpha is moving source acceptance ahead of farm startup so the user can close Blender before GPU capacity is available.

It is not yet accurate to say:

> Weekend Render production already behaves this way.

That distinction is part of the engineering discipline, not a weakness in the portfolio.

## What I would show privately

For a deeper technical review:

- the full POC acceptance matrix;
- the FAIL→PASS GPU-device evidence;
- worker-loss/replacement logs;
- output-integrity/retrieval evidence;
- the webhook/polling spike;
- current P6/P4/UF branch tests and evidence records;
- open PR history showing how architecture decisions changed.
