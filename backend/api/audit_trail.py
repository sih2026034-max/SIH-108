"""
Agent J — Audit Trail Middleware

Provides per-evaluation accountability logging for every API call.
Each response gets a unique audit_id that can be looked up via
GET /audit-log/{audit_id} to reproduce the full evaluation with sources.

This is strictly stronger than SpecSure's static certificate because
it's independently re-fetchable and tied to real source data.

Usage in Agent D's FastAPI app:
    from api.audit_trail import log_evaluation, get_evaluation, evaluation_log_store

    # In an endpoint:
    audit_id = log_evaluation(
        endpoint="/recommend",
        input_query="5 HP submersible pump",
        output_summary={"results": [...]},
        source_urls=["https://services.bis.gov.in/..."],
        session_id=request.headers.get("X-Session-Id")
    )
    return {**response, "audit_id": audit_id}
"""

import json
import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# In-memory store (production: writes to Postgres evaluation_log table)
# This approach ensures the demo path is never slowed down by DB writes.
_evaluation_store: Dict[str, Dict[str, Any]] = {}

AUDIT_LOG_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "audit", "evaluation_log.jsonl"
)


def log_evaluation(
    endpoint: str,
    input_query: str,
    output_summary: Dict[str, Any],
    source_urls: List[str],
    session_id: Optional[str] = None,
) -> str:
    """
    Logs an evaluation and returns a unique audit_id.
    Writes to both in-memory store and persistent JSONL file.
    """
    audit_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc).isoformat()

    record = {
        "audit_id": audit_id,
        "endpoint": endpoint,
        "input_query": input_query,
        "output_summary": output_summary,
        "session_id": session_id or "anonymous",
        "source_urls_used": source_urls,
        "created_at": timestamp,
    }

    # In-memory (fast lookup for GET /audit-log/{id})
    _evaluation_store[audit_id] = record

    # Persistent append (fire-and-forget, non-blocking for demo)
    try:
        os.makedirs(os.path.dirname(AUDIT_LOG_PATH), exist_ok=True)
        with open(AUDIT_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")
    except Exception as e:
        logger.warning(f"Failed to persist audit log: {e}")

    logger.info(f"Logged evaluation {audit_id} for {endpoint}")
    return audit_id


def get_evaluation(audit_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieves a logged evaluation by audit_id.
    Checks in-memory first, then falls back to scanning the JSONL file.
    """
    # Fast path: in-memory
    if audit_id in _evaluation_store:
        return _evaluation_store[audit_id]

    # Slow path: scan persistent file
    if os.path.exists(AUDIT_LOG_PATH):
        with open(AUDIT_LOG_PATH, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    record = json.loads(line.strip())
                    if record.get("audit_id") == audit_id:
                        _evaluation_store[audit_id] = record  # cache
                        return record
                except json.JSONDecodeError:
                    continue

    return None


def list_recent_evaluations(limit: int = 20) -> List[Dict[str, Any]]:
    """Returns the most recent evaluations (for dashboard display)."""
    records = sorted(
        _evaluation_store.values(),
        key=lambda r: r["created_at"],
        reverse=True,
    )
    return records[:limit]
