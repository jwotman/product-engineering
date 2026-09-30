# Weekend Render — Supporting artifacts

Weekend Render is the portfolio's strongest example of **technical discovery under uncertainty**.

The core question was simple:

> Can an individual Blender user submit a real project to on-demand cloud GPUs, close Blender, and trust the workflow to finish without learning to operate a render farm?

The artifacts below show how that question was turned into falsifiable experiments, how several assumptions failed, and how the architecture changed in response.

## Artifacts

| Artifact | What it demonstrates |
|---|---|
| [01 — POC acceptance matrix](01-poc-acceptance-matrix.md) | Turning risky assumptions into executable gates against real infrastructure |
| [02 — Durable cloud architecture](02-durable-cloud-architecture.md) | Why Railway owns workflow state and why Blender can disappear after durable acceptance |
| [03 — Evidence-driven architecture changes](03-evidence-driven-architecture-changes.md) | How MQTT, notification/reconciliation, GPU availability, and upload sequencing changed based on evidence |
| [04 — Proven vs active alpha](04-proven-vs-active-alpha.md) | Clear separation between completed POC evidence and current open-branch implementation |

## Evidence posture

Weekend Render uses an unusually strict status vocabulary:

- **PASS** — executed against real infrastructure and evidence recorded;
- **FAIL** — executed and did not meet the gate;
- **UNEXECUTED** — not run.

Configuration alone is not treated as proof.

That distinction is central to this case study because several apparently-correct configurations were wrong in practice.

## Why this project is useful portfolio evidence

The project required work across:

- Blender 5.2 / Cycles;
- Flamenco Manager and workers;
- Shaman/BAT asset transfer;
- RunPod GPU infrastructure;
- Railway workflow orchestration;
- SSH/Paramiko;
- object storage and checksums;
- cost estimation;
- failure recovery;
- Blender add-on behavior.

Most of those technologies were unfamiliar when the project began.

The relevant product-engineering skill is not prior expertise in render farms. It is the ability to identify which unknowns matter, design experiments that can falsify assumptions, and change the product architecture when the results disagree with the plan.

## Private-source evidence

For technical review, the private repository contains the full POC result log, experiment harnesses, real-farm test records, current stacked implementation branches, and PR history.
