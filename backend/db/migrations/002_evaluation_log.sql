-- Agent J — Evaluation Log Table
-- Provides per-evaluation accountability with audit IDs.
-- Every /recommend, /clause, and /audit API call writes one row.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS evaluation_log (
    audit_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint       TEXT NOT NULL,
    input_query    TEXT NOT NULL,
    output_summary JSONB NOT NULL DEFAULT '{}',
    session_id     TEXT,
    source_urls    TEXT[] NOT NULL DEFAULT '{}',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eval_log_created ON evaluation_log (created_at DESC);
CREATE INDEX idx_eval_log_session ON evaluation_log (session_id);

COMMENT ON TABLE evaluation_log IS 'Per-evaluation audit trail. Every API call that produces a recommendation writes one row and returns its audit_id to the caller. GET /audit-log/{audit_id} resolves the full provenance chain.';
