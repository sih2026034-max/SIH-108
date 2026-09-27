import json
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

# Mocked DB standards status for the audit checks
MOCK_DB_STATE = {
    "IS 325:1996": {"status": "withdrawn", "superseded_by": "IS 325:2020"},
    "IS 2925:1984": {"status": "live", "superseded_by": None},
    "IS 4984:2016": {"status": "live", "superseded_by": None},
    "IS 8034:2018": {"status": "live", "superseded_by": None}
}

# Mocked graph edges for normative reference checks
MOCK_GRAPH_EDGES = {
    "IS 8034:2018": ["IS 1500:2019", "IS 2062:2011"]
}

def analyze_tender(tender_text: str):
    issues = []
    
    # 1. Staleness Check
    for is_number, metadata in MOCK_DB_STATE.items():
        if is_number in tender_text and metadata["status"] == "withdrawn":
            issues.append({
                "type": "STALENESS",
                "severity": "HIGH",
                "description": f"Tender cites {is_number} which is withdrawn. It was superseded by {metadata['superseded_by']}.",
                "source_url": "https://services.bis.gov.in"
            })
            
    # 2. Missing Normative References Check
    # E.g. If IS 8034 is mentioned, IS 1500 must be mentioned.
    for main_std, required_refs in MOCK_GRAPH_EDGES.items():
        if main_std in tender_text:
            for ref in required_refs:
                if ref not in tender_text:
                    issues.append({
                        "type": "MISSING_NORMATIVE_REF",
                        "severity": "MEDIUM",
                        "description": f"Tender specifies {main_std} but omits the normatively required allied standard {ref}.",
                        "source_url": "https://services.bis.gov.in"
                    })
                    
    # 3. Restrictive Specification Heuristic
    lower_text = tender_text.lower()
    if "equivalent to" in lower_text or "similar to" in lower_text:
        # A crude heuristic for the mock
        if "model" in lower_text or "brand" in lower_text or "crompton" in lower_text:
            issues.append({
                "type": "RESTRICTIVE_SPEC",
                "severity": "LOW",
                "description": "(Heuristic) Tender contains brand-specific language ('equivalent to... model'). This may restrict competition to a single manufacturer."
            })
            
    return issues

def run_audit_pipeline():
    input_path = os.path.join(os.path.dirname(__file__), "raw_tenders.json")
    if not os.path.exists(input_path):
        logger.error(f"Missing {input_path}. Run fetch_tenders.py first.")
        return
        
    with open(input_path, "r") as f:
        tenders = json.load(f)
        
    total_audited = len(tenders)
    tenders_with_staleness = 0
    tenders_with_missing_refs = 0
    
    for tender in tenders:
        issues = analyze_tender(tender['text'])
        
        # Save to DB (mocked as print here)
        logger.info(f"Audited {tender['id']} - Found {len(issues)} issues.")
        
        has_staleness = any(i['type'] == 'STALENESS' for i in issues)
        has_missing = any(i['type'] == 'MISSING_NORMATIVE_REF' for i in issues)
        
        if has_staleness: tenders_with_staleness += 1
        if has_missing: tenders_with_missing_refs += 1
        
    # Generate Summary Stats
    pct_stale = round((tenders_with_staleness / total_audited) * 100, 1)
    pct_missing = round((tenders_with_missing_refs / total_audited) * 100, 1)
    
    summary_path = os.path.join(os.path.dirname(__file__), "summary_stats.md")
    with open(summary_path, "w") as f:
        f.write(f"# CPPP Tender Audit Summary\n\n")
        f.write(f"- **Total Tenders Audited**: {total_audited}\n")
        f.write(f"- **Tenders Citing Withdrawn Standards**: {pct_stale}%\n")
        f.write(f"- **Tenders Omitting Normative References**: {pct_missing}%\n\n")
        f.write(f"*Note: These metrics are derived from the hand-curated fallback set demonstrating the pipeline's capabilities for the hackathon pitch.*")
        
    logger.info(f"\nAudit complete. Stats saved to {summary_path}")

if __name__ == "__main__":
    run_audit_pipeline()
