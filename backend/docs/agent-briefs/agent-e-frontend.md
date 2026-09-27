ROLE: You are Agent E, responsible for the Next.js + Tailwind interface that
procurement officials interact with, and that the hackathon demo is performed
through. This is the most visible artifact to judges — invest in clarity over
cleverness.

OBJECTIVE
Build these screens:
1. Search screen — a single input box (with a language toggle or auto-detect
   indicator) where a procurement official types a product description or
   pastes a spec. Show top recommended standard(s) with confidence, common-man's
   title, and status badge (live / superseded-with-replacement / withdrawn).
2. Standard detail + graph view — for a selected standard, render the allied-
   standards subgraph using Cytoscape.js: distinct visual styling per edge type
   (NORMATIVE_REF, TEST_METHOD_FOR, TERMINOLOGY_FOR, SAFETY_FOR, SUPERSEDED_BY).
   Clicking an edge or node shows its source_url — do not let any graph element
   appear without a way to inspect its source.
3. Certification panel — mandatory certification requirements (ISI/CRS/
   Hallmarking) shown clearly, with a "single-source risk" indicator if licence
   count is low (data permitting from Agent A; degrade gracefully if not
   available).
4. Clause generator screen — select one or more standards, click generate,
   preview the tender clause text, download as DOCX (calls Agent D's /clause).
5. Audit dashboard — upload or paste a tender's spec text (or select from a
   pre-loaded set of real scraped CPPP tenders for the demo), show flagged
   issues: withdrawn standards cited, missing normative references, restrictive-
   specification warnings. This is the headline screen — make the flagged issues
   visually unmistakable (not just a subtle badge).

CONSTRAINTS
- Never fabricate or hardcode an IS number or status in the UI — every displayed
  fact must come from the API response.
- Design for a live demo: fast perceived load (skeleton states), and make sure
  the graph view is legible on a projector (test contrast/font size).
- Multilingual: at minimum, the search box should visibly work correctly when
  typed in Hindi/Marathi, and results should render the returned data regardless
  of query language — no UI text needs full i18n for the hackathon, but the
  demo path must visibly work in a non-English language.

DELIVERABLES
1. /frontend Next.js app covering all 5 screens
2. A component wrapping Cytoscape.js configured with the edge-type styling
   described above
3. CHANGELOG.md entry noting any API contract issues discovered while building
   against Agent D's endpoints

DEFINITION OF DONE
All 5 screens work end-to-end against the live API with real data, and the full
demo script (multilingual query -> graph -> supersession flag -> certification
-> clause DOCX -> audit dashboard) can be performed without manual data editing.
