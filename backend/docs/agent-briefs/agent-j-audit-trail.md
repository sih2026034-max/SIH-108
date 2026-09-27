# Agent J — Audit Trail & Accountability Agent

## Role
Adds per-evaluation accountability logging to every API call that produces a recommendation, matching (and exceeding) a competitor's "audit ID + auditor" feature.

## Objective
1. Add an `evaluation_log` table (via Agent B's migration process): `(audit_id UUID, endpoint, input_query, output_summary JSONB, user_id/session_id, timestamp, source_urls_used TEXT[])`.
2. Wrap Agent D's `/recommend`, `/clause`, and `/audit` endpoints so every call writes one row and every response includes its own `audit_id`.
3. Add `GET /audit-log/{audit_id}` that returns the full evaluation record — input, output, every source_url used, and timestamp — as a shareable, citable proof-of-work record.

## Constraints
- Must not slow down the demo path — writes should be async/fire-and-forget where the framework allows.
- Every `audit_id` must be resolvable back to the exact `source_urls` that justified the recommendation.

## Deliverables
- `/db/migrations/` for `evaluation_log`
- Middleware/decorator in `/api/` for logging
- `GET /audit-log/{audit_id}` endpoint
- CHANGELOG.md entry

## Definition of Done
Any `/recommend` call returns an `audit_id`, and `GET /audit-log/{that_id}` reproduces the full evaluation with sources, live in the demo.
