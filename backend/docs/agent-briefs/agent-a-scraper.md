ROLE: You are Agent A, responsible for acquiring and structuring the entire
corpus of Indian Standards metadata this project depends on. Nothing else can
be properly tested until you produce real data, so treat speed-to-first-batch
as more important than completeness on day one.

OBJECTIVE
Scrape and structure metadata for Indian Standards from:
1. services.bis.gov.in "Know Your Standards" pages (integer-ID enumerable,
   ~26,000 records) — the legacy portal, covers standards published before
   ~Oct 2025.
2. standards.bis.gov.in — the newer JS-rendered portal covering standards
   published after Oct 2025. Do NOT scrape rendered HTML; inspect Network tab
   and hit the underlying XHR/JSON endpoints directly.
3. archive.org's Public.Resource.Org collection (search prefix "gov.in.is.")
   for full-text scope sections and structured metadata (division, committee,
   amendment count, equivalence, superseding standard) on older editions.

FOR EACH STANDARD, EXTRACT
- IS number + part/section if applicable
- Full title
- Short "Common Man's Title" (critical for vocabulary-mismatch fix — do not skip)
- Edition / year, amendment number and date if any
- Status: live / superseded / withdrawn
- Superseded-by IS number (if withdrawn) and supersedes IS number (if it replaced
  something)
- Cross-referenced Indian Standards ("Referred in following Indian Standards" AND
  the reverse — standards this one references) — this is the normative reference
  graph, extract both directions
- Group / Sub-group / Aspect classification
- ICS code and ITC-HS code if present
- Certification field (whether ISI mark / CRS / Hallmarking applies)
- Relevant Ministry
- Source URL and a retrieved_at timestamp for every record

CONSTRAINTS
- Rate-limit yourself (start conservative — 1 request per 1-2 seconds, back off
  on any 429/503). Checkpoint every N records to a local JSONL file so a crash
  never costs more than a few minutes.
- Do NOT download or store full IS PDF text beyond short scope excerpts (a few
  sentences). We are not redistributing copyrighted standard text.
- Log which portal each record came from — legacy vs new — since the new portal's
  schema may differ slightly.
- Deduplicate: some standards will appear findable via both portals.

OUTPUT FORMAT
Write to /scraper/output/standards.jsonl — one JSON object per line, and a
/scraper/output/edges.jsonl for the graph edges (type: SUPERSEDED_BY,
NORMATIVE_REF, CROSS_REF), each edge tagged with its source_url.

DELIVERABLES
1. Resumable scraper script(s) with checkpointing
2. standards.jsonl + edges.jsonl, committed to the repo (not just left on disk —
   the demo cannot depend on live scraping working on hackathon day)
3. A short README in /scraper describing coverage achieved (e.g. "22,400 / 26,000
   legacy records; 340 new-portal records; 3,100 archive.org full-text matches")
4. Update CHANGELOG.md with the final schema of standards.jsonl / edges.jsonl so
   Agent B can build migrations against it.

DEFINITION OF DONE
A committed, non-empty standards.jsonl covering a meaningfully broad slice of
standards (prioritize categories likely to appear in procurement demos: pumps,
cables, cement, steel, electronics/IT equipment, PPE, construction materials),
plus edges.jsonl with both supersession and normative-reference edges populated.
