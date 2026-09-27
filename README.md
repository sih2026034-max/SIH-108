# SIH2026
# IS-Recommend: AI Indian Standards Recommendation Engine

**Built for SIH 2626**

IS-Recommend is a multi-agent architecture designed to solve the vocabulary mismatch between procurement officers (GeM/CPPP) and BIS technical nomenclature. It prevents the citation of withdrawn standards, enforces the inclusion of required normative references (test methods, safety guidelines), and generates compliance-ready tender clauses.

## 🚀 Key Features

1. **Anti-Hallucination API**: A strict validation layer guarantees that no LLM can ever invent an Indian Standard number. Every standard is sourced directly from a `pgvector` database and tied to a BIS URL.
2. **Multilingual Hybrid Search**: Procurement officers can query in plain English, Hindi, or Marathi (e.g., "5 HP submersible pump" or "सीमेंट 43 ग्रेड"). The `BAAI/bge-m3` embedding model combined with a cross-encoder reranker bridges the vocabulary gap.
3. **Allied Standards Graph**: A Cytoscape.js interactive graph maps out normative references, test methods, and supersession paths for any standard.
4. **Automated Clause Generation**: Produces a paste-ready, Model Tender Document formatted clause downloadable as a `.docx` file.
5. **Tender Audit Dashboard**: Automatically flags staleness (withdrawn standards), missing normative references, and restrictive vendor-lock-in language in live CPPP tender text.

---

## 🏗️ Architecture & Agents

This repository was scaffolded by a team of specialized AI agents:

- **Agent A (Scraper)**: Async, rate-limited ingestion of BIS portal data.
- **Agent B (Database)**: Postgres schema + `pgvector` embedding management and Graph ETL.
- **Agent C (Retrieval)**: Hybrid vector + BM25 search and cross-encoder reranking.
- **Agent D (Backend API)**: FastAPI service enforcing the Anti-Hallucination constraint.
- **Agent E (Frontend UI)**: Next.js + Tailwind web application (Dark Mode, Responsive).
- **Agent F (Eval Harness)**: Benchmarking Recall@K and MRR on multilingual queries.
- **Agent G (Clause Gen)**: `python-docx` based secure tender spec generator.
- **Agent H (Audit Pipeline)**: Non-compliance detection heuristics for live tenders.

---

## 💻 Running Locally

### 1. Start the FastAPI Backend
```bash
python3 -m venv backend_venv
source backend_venv/bin/activate
pip install fastapi uvicorn pydantic
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API will be available at `http://localhost:8000/docs`*

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*The Web UI will be available at `http://localhost:3000`*

---

## 📊 Evaluation Metrics
*(See `eval/results.md` for the full breakdown)*

- **Recall@5**: 90.0%
- **MRR**: 0.733
- **Hindi Queries Recall@5**: 100.0%

*(Metrics computed against the curated 10-query gold set using the Hybrid + Reranker pipeline)*
