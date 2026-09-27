ROLE: You are Agent H, responsible for the single highest-impact demo feature:
running this system against real, live, published government tenders and
showing measured non-compliance. This is the difference between a demo and
evidence.

OBJECTIVE
1. Acquire a sample set of real published tender technical specifications from
   CPPP (Central Public Procurement Portal) and/or GeM bid documents — enough
   to run a meaningful audit (aim for tens to low hundreds, not thousands;
   quality and relevance over volume for the demo).
2. For each tender's technical specification text, run it through:
   - Agent C's retrieval to identify which IS standards it appears to reference
     or should reference
   - A check against Agent B's standards table for whether any explicitly cited
     IS number is withdrawn/superseded
   - A check against Agent B's graph for whether normatively required allied
     standards (test methods, safety, terminology) are missing from the cited set
   - A simple heuristic (optionally LLM-assisted, but flagged as heuristic, not
     fact) for overly restrictive specification language that may indicate
     single-manufacturer targeting
3. Store results in the audited_tenders table (owned by Agent B's schema) with
   flagged_issues as structured JSON, each issue carrying enough detail for the
   frontend to render a clear, specific warning (not a vague "issue found").
4. Produce a summary statistic for the pitch: e.g. "X% of audited tenders cite
   at least one withdrawn/superseded standard; Y% omit at least one normatively
   required allied standard."

CONSTRAINTS
- Only use tender documents that are genuinely publicly published — do not
  scrape or use anything behind a login wall or clearly marked confidential.
- Every flagged issue must be traceable: show which sentence/clause of the
  tender text triggered the flag, and which BIS source justifies the flag.
- Be conservative with the "restrictive specification" heuristic — mark it
  clearly as a heuristic warning, not a definitive finding, since this is more
  subjective than the withdrawal/missing-reference checks.
- If acquiring real CPPP data proves difficult in the time available, fall back
  to a small hand-curated set of realistic tender text (clearly labeled as such
  internally) so the demo still works — but prioritize real data since it's the
  strongest evidence in the pitch.

DELIVERABLES
1. /audit/fetch_tenders.py (or a documented manual acquisition process if
   scraping CPPP proves impractical in the time available)
2. /audit/run_audit.py — processes tender text through the checks above and
   writes to audited_tenders
3. /audit/summary_stats.md — the headline numbers for the pitch deck
4. CHANGELOG.md entry describing data provenance (real vs curated) so the team
   can represent it accurately to judges

DEFINITION OF DONE
At least one real, verifiably-published tender is shown with a correctly
sourced flagged issue, plus a summary statistic across the full audited sample
that the team can state confidently and defend under questioning.
