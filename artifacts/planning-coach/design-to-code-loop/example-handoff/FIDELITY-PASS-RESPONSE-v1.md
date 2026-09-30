# Fidelity Pass Response v1 — Email Reading Surface v2

Reviewed: `uploads/DIVERGENCES.md` (branch `claude/email-reader-v2-uhazpc`, `web/client/src/features/email/v2/DIVERGENCES.md`) + Storybook screenshots (queue normal, queue broken, reader desktop, reader mobile). 2026-08-06.

**Overall: the port is faithful.** All four screenshots match the DCs in layout, tokens, type, and copy. No visual adjustments requested on what was shown. Item-by-item rulings below; package updated where the tree corrected the gap analysis (adapter `CAPS`, review-status vocabulary, GAP-ANALYSIS asks).

## Corrections accepted — package updated

1. **ASK-4 partially closed — accepted with thanks.** `CAPS.fileTextRead` flipped to `true` in `EmailReader.api.js`; ASK-4 in GAP-ANALYSIS.md now only covers honest-transcription framing copy.
2. **No html-serving route — accepted.** Live mode renders one section per §RD.2 (a body without reachable headings is one section — conformant, not a downgrade). The ask is now **ASK-8: `GET /api/v1/materials/{id}/html`**; sections/link-inventory/inline-images light up when it lands.
3. **`payload.evidence` rejected by adapters — accepted; my header note was wrong.** Interim (prefill + displayed provenance, span not transmitted) is right. Escalated as **ASK-9: an evidence field on the action wire** — §G.6 wants the span durable on the created object, so this ask is contract-grounded, not cosmetic. Adapter comment corrected.
4. **Review-status vocabulary — accepted; adapter fixed** to the real `pending | deferred | partially_decided | resolved_for_reading` and your derived-chip approach.

## Contract questions — rulings

5. **§F.9f words vs DC chips: ship the DC's words; I'll draft the amendment.** The DC copy was student-validated on 2026-08-05, which outranks unvalidated contract wording as a matter of fact-on-the-ground — but the contract must say so, not be quietly contradicted. A §F.9f amendment ("partly decided" for *partly done*; "handled for now · back {day}" for *back {when}*) goes to the owner with the student-validation provenance attached. Until ratified you are correctly shipping the validated words with this flag on record.
6. **Client-worded "one thing to check" — confirmed acceptable.** It derives from two server facts and invents no status; §F.9a is satisfied as long as precedence comes from the server facts, which it does. Long-term the derivation belongs server-side; folded into the §F.9 asks, no action for you.
7. **No quote on backstop findings — accepted interim.** Render `explanation` only but keep the quote slot in the card layout (empty, not collapsed) so the composition doesn't reflow when **ASK-10: a passage/evidence span on `BackstopFindingResponse`** lands. §I.5 wants the quoted passage; this ask is also contract-grounded.
8. **No `returns_at` on deferred rows — accepted interim.** "handled for now" without the day is honest. **ASK-11: `returns_at` on the queue row.** Do not cache the `DeferResponse` value client-side across sessions — a stale "back Friday" is worse than none.

## Gated controls — all gating accepted

9. **Date highlights** — correct per ASK-2. Keep `openHighlightCapture` wired to fixtures so Storybook still demonstrates the flow.
10. **Hide today** — correct per ASK-7.
11. **Use as a reference** — the missing target-picker is a **design gap, mine**: the flow is select passage/file → pick an existing Date/Commitment/Follow-up (the `/references` + already-handled-candidates shape) → link with provenance. I owe a DC for the picker; keep the chip honest-inert until it arrives. Don't invent a picker.
12. **Reconnect email** — accepted; the connect flow is out of this package's scope. The honest "isn't wired" message is right.
13. **Noticing Keep visible / Not needed** — your reading is correct: the DC buttons were display-level. Intended wire: *Keep visible* = a scoped Reading Decision (`scope=noticing`, outcome keep-visible → light Follow-up per §D.5); *Not needed* = scoped decision with outcome not-needed. If `DecisionCreate.scope` accepts a noticing ref today, wire it; if the outcome vocabulary lacks these members, that's **ASK-12** and the buttons stay honest-inert.
14. **MoreV2 menu** — provisionally accepted (carrying the flows forward was right). Send a screenshot of the open menu in the next round; it has no DC frame, so it gets reviewed from your render.

## Small mechanical — all accepted

15. Current-year parse: correct for production (the 2026 fixture was fixture).
16. Generic section counts: accepted pending ASK-1 (server sections list should carry per-section facts).
17. Address-only sender line: accepted pending ASK-6.
18. Chip availability logic (`file_count` always; `sent only to you` from `routing_reason`): exactly right; link-count chip waits on ASK-8/ASK-1.
19. **Token near-misses: use the DC values verbatim on this surface (as you did).** `v2/tokens.ts` is the right shape. Whether tokens.css adopts the v2 values globally is a repo decision outside this surface — flag it in your PR, don't reconcile unilaterally.

## Next round
No visual adjustments requested. Outstanding for round 2: the MoreV2 menu screenshot (item 14) and, if cheap, one screenshot of the backstop panel with a required finding (it wasn't in this set). If item 13's scoped-decision wire works, show the Keep visible flow too. After that, expect sign-off for cutover.

## Owner-decision queue (Design side, no action for Code)
- §F.9f vocabulary amendment (item 5, with student-validation provenance).
- "Goes to:" characterization (§RD.5.3, still open).
- Reference-picker DC (item 11) — Design deliverable.
