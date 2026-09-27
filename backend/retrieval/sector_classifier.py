"""
Agent K — Sector Auto-Classifier

Replaces manual sector-preset buttons with automatic detection.
Uses keyword-based classification (zero-shot ready for Gemini Flash upgrade).

Interface for Agent D:
    classify_sector(query: str) -> dict  # {"sector": str, "confidence": float}
"""

import logging
import re
from typing import Dict

logger = logging.getLogger(__name__)

# Fixed sector taxonomy with keyword patterns
# Each sector maps to a list of (pattern, weight) tuples
SECTOR_TAXONOMY: Dict[str, list] = {
    "construction": [
        (r"\b(cement|concrete|steel|rebar|tmt|bar|brick|aggregate|sand|tile|grout)\b", 1.0),
        (r"\b(structural|building|construction|masonry|plaster|mortar)\b", 0.8),
        (r"\b(सीमेंट|ईंट|स्टील|निर्माण|भवन)\b", 1.0),
        (r"\bIS\s*(?:269|456|383|2062|1786|516|1489)\b", 1.2),
    ],
    "water_supply": [
        (r"\b(pipe|pump|valve|fitting|water|sewage|plumbing|hdpe|pvc|submersible)\b", 1.0),
        (r"\b(borewell|tubewell|hand\s*pump|water\s*supply|drainage)\b", 0.9),
        (r"\b(पानी|पाइप|पंप|नल|जल)\b", 1.0),
        (r"\bIS\s*(?:8034|4984|4985|1500|15778)\b", 1.2),
    ],
    "electrical_electronics": [
        (r"\b(motor|transformer|cable|wire|wiring|switchgear|circuit|breaker|panel)\b", 1.0),
        (r"\b(pvc\s*cable|house\s*wiring|sq\s*mm)\b", 1.2),
        (r"\b(led|light|lamp|luminaire|inverter|ups|battery|solar)\b", 0.8),
        (r"\b(मोटर|केबल|तार|बिजली|विद्युत)\b", 1.0),
        (r"\bIS\s*(?:325|694|1554|3043|16107)\b", 1.2),
    ],
    "solar_renewable": [
        (r"\b(solar|photovoltaic|pv\s*module|inverter|renewable|wind\s*turbine)\b", 1.0),
        (r"\b(solar\s*panel|battery\s*storage|off[\-\s]grid|on[\-\s]grid)\b", 0.9),
        (r"\b(सौर|सोलर)\b", 1.0),
        (r"\bIS\s*(?:14286|16169)\b", 1.2),
    ],
    "machinery_industrial": [
        (r"\b(pump|compressor|engine|gear|bearing|crane|hoist|conveyor)\b", 0.8),
        (r"\b(boiler|pressure\s*vessel|hydraulic|pneumatic|machine\s*tool)\b", 1.0),
        (r"\b(मशीन|उपकरण|यंत्र)\b", 1.0),
        (r"\bIS\s*(?:2825|803|4722)\b", 1.2),
    ],
    "fire_safety": [
        (r"\b(fire|extinguisher|sprinkler|hydrant|alarm|smoke\s*detector)\b", 1.0),
        (r"\b(fire\s*resistant|flame\s*retardant|fire\s*escape)\b", 0.9),
        (r"\b(अग्नि|आग|बुझाने)\b", 1.0),
        (r"\bIS\s*(?:2190|15683|2878|1641)\b", 1.2),
    ],
    "ppe_safety_wear": [
        (r"\b(helmet|helmets|glove|gloves|goggle|goggles|boot|boots|shoe|shoes|mask|respirator|harness)\b", 1.0),
        (r"\b(ppe|safety\s*wear|protective|hi[\-\s]vis|vest|apron|industrial\s*safety)\b", 0.9),
        (r"\b(हेलमेट|दस्ताने|जूते|सुरक्षा|रबर)\b", 1.0),
        (r"\bIS\s*(?:2925|4770|5983|9167|17423)\b", 1.2),
    ],
}

# Minimum confidence to report a sector (below this, return "general")
CONFIDENCE_THRESHOLD = 0.25


def classify_sector(query: str) -> Dict[str, object]:
    """
    Classifies a query into one of the fixed sector categories.
    
    Returns:
        {"sector": str, "confidence": float, "method": "keyword_classifier"}
    
    If confidence is below threshold, returns sector="general" so Agent C
    runs unfiltered retrieval (assistive filter, never a hard gate).
    """
    query_lower = query.lower()
    scores: Dict[str, float] = {}

    for sector, patterns in SECTOR_TAXONOMY.items():
        sector_score = 0.0
        for pattern, weight in patterns:
            matches = re.findall(pattern, query_lower, re.IGNORECASE | re.UNICODE)
            sector_score += len(matches) * weight
        scores[sector] = sector_score

    total = sum(scores.values())
    if total == 0:
        return {"sector": "general", "confidence": 0.0, "method": "keyword_classifier"}

    best_sector = max(scores, key=scores.get)  # type: ignore
    confidence = round(scores[best_sector] / max(total, 1.0), 4)

    if confidence < CONFIDENCE_THRESHOLD:
        return {"sector": "general", "confidence": confidence, "method": "keyword_classifier"}

    return {
        "sector": best_sector,
        "confidence": confidence,
        "method": "keyword_classifier",
    }


# Hand-labeled accuracy test cases
TEST_CASES = [
    # Construction
    ("OPC 43 grade cement bags", "construction"),
    ("TMT bar Fe 500D", "construction"),
    ("High tensile steel structural", "construction"),
    ("सीमेंट 43 ग्रेड", "construction"),
    # Water Supply
    ("5 HP submersible pump for borewell", "water_supply"),
    ("पीने के पानी का पाइप", "water_supply"),
    ("HDPE pipe 110mm water supply", "water_supply"),
    # Electrical
    ("PVC cable for house wiring 1 sq mm", "electrical_electronics"),
    ("LED street light fixture", "electrical_electronics"),
    ("तीन फेज वाली मोटर", "electrical_electronics"),
    # PPE
    ("PPE kit for hospital staff", "ppe_safety_wear"),
    ("रबर के दस्ताने", "ppe_safety_wear"),
    ("Industrial safety helmets", "ppe_safety_wear"),
    # Fire Safety
    ("ABC type fire extinguisher", "fire_safety"),
    ("Fire alarm system for building", "fire_safety"),
    # Solar
    ("Solar PV module 300W", "solar_renewable"),
    # Machinery
    ("Hydraulic press 50 ton", "machinery_industrial"),
    # General (should NOT match a specific sector)
    ("office supplies", "general"),
    ("computer peripherals", "general"),
]


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(message)s")

    correct = 0
    total = len(TEST_CASES)

    print("--- Sector Classification Accuracy Test ---\n")
    print(f"{'Query':<45} {'Expected':<25} {'Got':<25} {'Conf':>6} {'✓/✗'}")
    print("-" * 110)

    for query, expected in TEST_CASES:
        result = classify_sector(query)
        got = result["sector"]
        conf = result["confidence"]
        match = "✓" if got == expected else "✗"
        if got == expected:
            correct += 1
        print(f"{query:<45} {expected:<25} {got:<25} {conf:>6.2f} {match}")

    print(f"\nAccuracy: {correct}/{total} ({round(correct/total*100, 1)}%)")
