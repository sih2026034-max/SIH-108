# Recommendation Engine Architecture

This document describes the Recommendation Engine built on top of the Semantic Vector Search for the IS-Recommend system.

## 1. Candidate Retrieval
When a query is received, the engine retrieves the top 20 candidates from the FAISS semantic vector store. 

## 2. Re-Ranking & Scoring Formula
The semantic candidates are passed through a custom scoring algorithm that blends dense vector similarity with lexical (title) overlap and metadata presence. 

**Scoring Formula:**
`Final Score = (Semantic * W1) + (Title Relevance * W2) + (Category Match * W3) + (Department Match * W4) + (Metadata Completeness * W5)`

**Configurable Weights:**
- Semantic (`W1`): 0.5
- Title Relevance (`W2`): 0.3
- Category Match (`W3`): 0.05
- Department Match (`W4`): 0.05
- Metadata Relevance (`W5`): 0.1

## 3. Thresholds and Relevance Levels
Standards are categorized dynamically based on their `Final Score`:
- **HIGH**: >= 0.75
- **MEDIUM**: >= 0.60
- **LOW**: < 0.60
- **NO_CONFIDENT_MATCH**: < 0.40 (Triggers an empty state if no standard passes)

*Note: We strictly use "Relevance Level" instead of "Confidence Score" because this algorithm relies on heuristics, not a calibrated statistical model.*

## 4. Known Limitations
- The system currently does not extract deep normative relationships because 96% of the base JSON lacks `cross_references`.
- Zero LLM generation is permitted at this stage, so all "Explanations" are deterministic algorithm traces (e.g., "Semantic Score: X, Title Relevance: Y").
- The system heavily relies on `title` overlap due to missing `scope` and `description` fields.
