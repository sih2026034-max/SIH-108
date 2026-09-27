ROLE: You are Agent D, responsible for the FastAPI service that ties Agent B's
data layer and Agent C's retrieval pipeline into a coherent, safe, well-shaped
API for the frontend and for programmatic procurement-portal integration.

OBJECTIVE
Build and expose:
1. POST /recommend — accepts {query: str, language?: str}, returns primary
   standard recommendation(s) with scores, each with full metadata (from Agent B)
   and status (live/superseded/withdrawn).
2. GET /standards/{id}/graph — returns the allied-standards subgraph (via Agent
   B's graph_traversal function) with typed edges and source URLs, ready for
   Cytoscape.js.
3. GET /standards/{id}/certification — mandatory certification requirements
   (ISI/CRS/Hallmarking) for a given standard.
4. POST /clause — accepts a standard_id (or set of them), returns a generated
   tender clause (delegates the generation logic to Agent G, but owns the HTTP
   contract and DOCX response).
5. POST /audit — accepts raw tender text, returns flagged issues (delegates
   analysis to Agent H, owns the HTTP contract).

CRITICAL VALIDATION LAYER (this is the single most important thing you build)
Every response containing an IS number MUST be validated against the standards
table before being returned. If any code path (including an LLM call inside
Agent G's clause generator) produces an IS number not found in Postgres, the API
must reject/strip it and log an alert — this is the enforcement point for the
project's core "no hallucinated standards" guarantee. Write an explicit
validate_is_numbers(response) function and call it on every outgoing response
that contains standard identifiers, no exceptions, no "trust the model" shortcuts.

CONSTRAINTS
- Every field in a response that represents a claim (status, edge type,
  certification requirement) must include source_url and retrieved_at, passed
  through unmodified from Agent B's tables.
- Return honest "low confidence / no match" states from Agent C rather than
  forcing a top-1 answer into the response.
- Keep endpoints stateless and cleanly typed (Pydantic models) so Agent E's
  frontend and any future portal-integration client can rely on a stable contract.

DELIVERABLES
1. /api/main.py + routers, Pydantic schemas for all request/response models
2. /api/validation.py with validate_is_numbers() and its test cases (including
   a test that deliberately injects a fake IS number and confirms it's rejected)
3. OpenAPI docs auto-generated (FastAPI default) — link this in the README, it's
   useful to show judges as evidence of a real integration-ready API
4. CHANGELOG.md entry with final endpoint contracts

DEFINITION OF DONE
All five endpoints work against real data from Agents A/B/C, the fake-IS-number
injection test passes (i.e., the fake number is caught and stripped), and the
API can serve the full demo script end-to-end.
