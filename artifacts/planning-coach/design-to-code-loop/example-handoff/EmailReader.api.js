// EmailReader.api.js — adapter between the Email Reading Surface DCs and the
// repo's /api/v1/email routes (routes_email*.py @ main, read 2026-08-06).
// Pattern: Follow-ups.api.js — live wiring where routes exist, fixture-only
// behind capability flags where they don't. The DCs never see wire shapes.
//
// Wire notes that MUST survive the port:
// - POST /decisions/{id}/actions and /backstop-findings/{id}/actions REQUIRE
//   an Idempotency-Key header (routes_email_actions.py E9A).
// - GET /messages/{id}/reader is a READ: opening the reader records nothing
//   (REVIEW-001). Only POST .../noticings/activate activates (§E.7).
// - subject_capture: render 'absent_in_source'/'not_captured' as "(no subject)";
//   NEVER present a 'captured_undecoded' raw header as the sender's words.
// - count_is_complete=false: never render the badge as a trustworthy zero.

const BASE = '/api/v1/email';
const json = (r) => { if (!r.ok) throw Object.assign(new Error('http ' + r.status), { status: r.status }); return r.json(); };
const get = (p) => fetch(BASE + p).then(json);
const post = (p, body, idem) => fetch(BASE + p, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(idem ? { 'Idempotency-Key': idem } : {}) },
  body: body ? JSON.stringify(body) : undefined
}).then(json);
const idemKey = () => 'dc-' + crypto.randomUUID();

// ---- capability flags: what main can serve today ----------------------------
export const CAPS = {
  queue: true,                 // GET /queue/primary, /queue/ignored, /summary
  readerSource: true,          // GET /messages/{id}/reader (+ /materials)
  decisions: true,             // POST /messages/{id}/decisions, /defer, corrections
  actions: true,               // POST /decisions/{id}/actions (+ retry/cancel/outstanding)
  noticings: true,             // POST .../noticings/activate, GET .../noticings
  backstop: true,              // POST backstop-check, finding decision, finding action
  senderPolicy: true,          // quiet-shelf Hide today ≈ suppression (see mapping note)
  bodySections: false,         // ASK-1: no sectioned-body projection (client-derive interim)
  dateHighlights: false,       // ASK-2: no verbatim-date-span projection (REVIEW-003 tension)
  linkInventory: false,        // ASK-3: no link list/destination facts on the wire
  fileTextRead: true,         // GET /api/v1/materials/{id}/text exists (fidelity pass v1, item 1)
  materialHtml: false,         // ASK-8: no route serves html_sanitized bytes — sections/links/inline images gated on this
  requiredReasonVocab: false   // ASK-5: BackstopDecisionValue has no recognized-reason enum
};

// ---- queue ------------------------------------------------------------------
export async function fetchBadge() {
  const s = await get('/summary'); // EmailSummary
  return {
    count: s.needs_decision_count,
    countTrustworthy: s.count_is_complete,        // false → show state, not "0"
    accounts: s.accounts.map(mapAccount)
  };
}
function mapAccount(a) {
  // EmailAccountStatus → the queue DC's ingestState enum (§C.6 screens)
  let ingestState = 'normal';
  if (a.connection_state !== 'connected') ingestState = 'broken';
  else if (a.last_ingest_status === 'paused_semantic') ingestState = 'paused';
  else if (a.is_stale) ingestState = 'stale';
  return { accountId: a.account_id, provider: a.provider, ingestState,
           lastChecked: a.last_successful_ingest_at, stalenessReason: a.staleness_reason };
}
export async function fetchQueue(cursor) {
  const p = await get('/queue/primary' + (cursor ? '?cursor=' + encodeURIComponent(cursor) : ''));
  return { rows: p.entries.map(mapQueueRow), nextCursor: p.next_cursor };
}
export async function fetchShelf(cursor) { // quiet shelf = Ignored queue (§C.4)
  const p = await get('/queue/ignored' + (cursor ? '?cursor=' + encodeURIComponent(cursor) : ''));
  return { rows: p.entries.map(mapQueueRow), nextCursor: p.next_cursor };
}
function mapQueueRow(m) {
  return {
    id: m.message_id,
    sender: m.sender_address,                     // display name needs ASK-6 (cosmetic)
    subject: m.subject_capture === 'captured' ? m.subject
      : m.subject_capture === 'captured_undecoded' ? { raw: m.subject, undecoded: true }
      : null,                                     // render "(no subject)"
    receivedAt: m.received_at,
    fileCount: m.file_count,                      // attached files only, by contract
    statusChip: mapReviewStatus(m.review_status), // §F.9 vocabulary
    orderingReason: m.routing_reason              // "Why this order?" per-row fact
  };
}
function mapReviewStatus(rs) {
  // Real wire vocabulary (review_service.py ReviewStatus) — corrected fidelity pass v1, item 4.
  // Chip words pending the §F.9f amendment (student-validated 2026-08-05).
  return ({ pending: 'waiting on you', partially_decided: 'partly decided',
            deferred: 'handled for now', resolved_for_reading: 'done' })[rs] ?? rs;
  // 'one thing to check' is client-derived: review status + open backstop findings
  // after a dismissal (fidelity pass v1, item 6) — never a locally-invented status.
}
export const deferMessage = (id) => post(`/messages/${id}/defer`);
export const hideSenderToday = (address, expectedVersion) =>
  post('/senders/ignore', { address, expected_version: expectedVersion });
// NOTE: sender-ignore is a standing policy, not §C.4's day-scoped suppression.
// Until a per-message suppress route exists, Hide today is fixture-only (ASK-7).
export async function fetchOutstandingActions() { // §F.10a "Needs another try"
  const o = await get('/outstanding-actions');
  return o.actions ?? o;
}
export const retryAction = (actionId) => post(`/actions/${actionId}/retry`);
export const cancelAction = (actionId) => post(`/actions/${actionId}/cancel`);

// ---- reader -----------------------------------------------------------------
export async function fetchReader(messageId) {
  const r = await get(`/messages/${messageId}/reader`); // EmailReaderSource
  const primary = r.representations.find(x => x.material_id === r.primary_material_id) ?? null;
  return {
    message: mapQueueRow(r.message),
    body: r.primary_representation === 'none' ? { state: 'unavailable' }
      : { state: 'ready', representation: r.primary_representation,
          materialId: r.primary_material_id, safeToRender: primary?.safe_to_render ?? false },
    files: r.files.map(f => ({
      materialId: f.material_id, name: f.original_filename ?? '(unnamed file)',
      textStatus: f.readable_text_available ? 'Text is ready'
        : f.processing_status === 'pending' ? 'Still reading it — you can decide now'
        : 'Couldn\u2019t read this one — the original still opens',
      originalPath: f.original_path,              // populated in EVERY state (VAULT-002)
      originalAvailable: f.original_available
    })),
    warnings: r.warnings                          // e.g. subject_not_fully_decoded
  };
}
// Sections, date highlights, link inventory: CAPS-gated (ASK-1..3). Interim:
// derive sections client-side from html_sanitized h1–h4 (source-structural,
// no model input) and suppress highlights/link-destinations in live mode.

// ---- decisions + actions ------------------------------------------------------
export const recordDecision = (messageId, { scope = 'message', scopeRefId = null, outcome, note = null, alreadyHandled = null }) =>
  post(`/messages/${messageId}/decisions`, {
    scope, scope_ref_id: scopeRefId, outcome, student_note: note,
    already_handled_object_kind: alreadyHandled?.kind ?? null,
    already_handled_object_id: alreadyHandled?.id ?? null
  });
export const createAction = (decisionId, actionType, payload) =>
  post(`/decisions/${decisionId}/actions`, { action_type: actionType, payload }, idemKey());
// Selection capture (§RD.4): the action adapters REJECT unknown payload keys
// (fidelity pass v1, item 3) — the span is NOT transmitted yet. Interim: the
// selection prefills the form and displays as provenance client-side only.
// ASK-9 adds an evidence field to the action wire (§G.6 wants the span durable).
export const fetchActionTypes = () => get('/action-types'); // never hardcode the set

// ---- noticings (§E.7: opening IS the request) --------------------------------
export async function activateNoticings(messageId) {
  const p = await post(`/messages/${messageId}/noticings/activate`);
  return p.noticings.map(n => ({
    id: n.noticing_id, kind: n.kind,
    statement: n.statement,                       // null when presentation=source_only
    sourceOnly: n.presentation === 'source_only',
    statedChip: n.stated_or_inferred,             // 'stated' | 'inferred' | null
    quote: n.passage.quoted_text,
    uncertainty: n.uncertainty, unsureAbout: n.unsure_about
  }));
}

// ---- finalize backstop (§I) ---------------------------------------------------
export async function runBackstopCheck(messageId) {
  const r = await post(`/messages/${messageId}/backstop-check`);
  return { partialContext: r.context_completeness === 'partial',
           findings: r.findings.map(mapFinding) };
}
function mapFinding(f) {
  return {
    id: f.finding_id,
    required: f.mismatch_type === 'required_action_unaddressed'
           || f.mismatch_type === 'required_attachment_not_reviewed', // §H.4 gate
    materiality: f.materiality,                   // panel orders high→low
    explanation: f.explanation,
    candidateActions: f.candidate_actions,
    decided: f.decision?.decision ?? null
  };
}
export const decideFinding = (findingId, decision, note = null) =>
  // decision: accepted | rejected | unsure | deferred.
  // Required-finding reasons (Already handled / Doesn't apply / That's not
  // right) ride student_note until ASK-5 lands a recognized-reason enum;
  // the DC must still refuse a bare reject on required findings client-side.
  post(`/backstop-findings/${findingId}/decision`, { decision, student_note: note });
export const createFindingAction = (findingId, actionType, payload) =>
  post(`/backstop-findings/${findingId}/actions`, { action_type: actionType, payload }, idemKey());

export const fetchReviewStatus = (messageId) =>
  get(`/messages/${messageId}/review`).then(r => mapReviewStatus(r.review_status ?? r.status));
