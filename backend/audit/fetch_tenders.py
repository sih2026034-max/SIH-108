import json
import logging
import os

logger = logging.getLogger(__name__)

# Fallback curated set as requested in Agent H's brief, since live scraping 
# CPPP PDFs requires complex OCR/parsing that is fragile during a live demo.
CURATED_TENDERS = [
    {
        "id": "tender_cppp_101",
        "title": "Supply of Submersible Pump Sets",
        "source_url": "https://eprocure.gov.in/eprocure/app?mock=101",
        "text": "The pump set shall conform to IS 8034:2018 or equivalent. The motor shall conform to IS 325:1996 (Three Phase Induction Motors). Material of construction: Steel as per IS 2062. The pump should be equivalent to Crompton Greaves model XYZ or similar. Testing shall be done as per manufacturer's internal standards."
    },
    {
        "id": "tender_cppp_102",
        "title": "Procurement of Safety Helmets",
        "source_url": "https://eprocure.gov.in/eprocure/app?mock=102",
        "text": "Industrial safety helmets made of HDPE. Must comply with IS 2925:1984. Minimum order quantity is 5000 units. Vendor must supply within 30 days."
    },
    {
        "id": "tender_cppp_103",
        "title": "Laying of HDPE Water Pipes",
        "source_url": "https://eprocure.gov.in/eprocure/app?mock=103",
        "text": "Contractor shall supply and lay HDPE pipes as per IS 4984:2016 for water supply scheme. Pipes must bear ISI mark."
    }
]

def fetch_tenders():
    """
    Simulates fetching and parsing technical specifications from published CPPP tenders.
    Outputs to a local JSON for the audit pipeline to consume.
    """
    output_path = os.path.join(os.path.dirname(__file__), "raw_tenders.json")
    with open(output_path, "w") as f:
        json.dump(CURATED_TENDERS, f, indent=2)
        
    logger.info(f"Fetched {len(CURATED_TENDERS)} tenders. Saved to {output_path}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    fetch_tenders()
