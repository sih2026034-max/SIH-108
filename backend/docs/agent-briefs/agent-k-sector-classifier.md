# Agent K — Sector Auto-Classifier Agent

## Role
Replaces a competitor's manual "one-click sector preset" buttons with automatic sector detection, so the user gets the same speed benefit without an extra click.

## Objective
1. Define a fixed sector taxonomy (construction, water supply, solar/renewable, machinery/industrial, fire safety, electrical/electronics, PPE/safety-wear — extend based on Agent A's actual corpus coverage).
2. Build a lightweight classifier: start with zero-shot classification via Gemini Flash; only invest in fine-tuning a small model if Flash's zero-shot accuracy is unsatisfactory.
3. Expose `classify_sector(query: str) -> (sector: str, confidence: float)`, called by Agent D before retrieval so results can be pre-filtered/boosted toward the detected sector.

## Constraints
- This is an assistive filter, not a hard gate — if sector confidence is low, Agent C's retrieval should still run unfiltered across the full corpus.
- Keep this fast (single Flash call, sub-second) since it runs on every query.

## Deliverables
- `/retrieval/sector_classifier.py`
- Short accuracy note against ~20 hand-labeled example queries per sector
- CHANGELOG.md entry with function signature

## Definition of Done
`classify_sector()` correctly tags at least 8/10 hand-tried queries per sector category, and Agent D uses it to pre-filter/boost results without ever hard-excluding valid matches.
