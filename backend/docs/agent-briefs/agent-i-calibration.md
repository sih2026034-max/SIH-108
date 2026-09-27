# Agent I — Confidence Calibration Agent

## Role
Takes Agent C's raw retrieval/rerank scores and turns them into a statistically defensible confidence percentage — directly neutralizing a competitor's unsupported "92% precision" claim.

## Objective
1. Using Agent F's gold-set (query → correct IS number pairs) as calibration data, fit a calibration model (Platt scaling via logistic regression, or isotonic regression if enough gold-set points) mapping Agent C's raw cross-encoder rerank score → P(this is the correct standard).
2. Expose `calibrate(raw_score: float) -> float`, imported by Agent D's `/recommend` response as the "confidence" field shown to the user.
3. Re-fit whenever Agent F's gold set grows — do not hardcode on a tiny sample.

## Constraints
- Never present an uncalibrated raw similarity score as if it were a probability. If the gold set is too small to calibrate reliably (fewer than ~40 labeled points), say so explicitly in CHANGELOG.md and fall back to reporting the raw rerank score labeled as "similarity score," not "confidence" or "%precision."
- Document the calibration method and sample size in `/eval/results.md` so it can be defended in a judge Q&A.

## Deliverables
- `/retrieval/calibrate.py`
- Calibration curve plot for the pitch deck
- CHANGELOG.md entry with function signature for Agent D

## Definition of Done
`/recommend` returns a calibrated confidence score with a one-line documented methodology, verified against at least 40 gold-set points.
