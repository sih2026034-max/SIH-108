import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.services.compliance_engine import check_compliance

def print_result(desc, res):
    print(f"\n======================================")
    print(f"TEST: {desc}")
    print(f"OVERALL STATUS: {res.get('status')}")
    print(f"PRODUCT: {res.get('product')}")
    
    stds = res.get('standards', [])
    for idx, s in enumerate(stds):
        print(f"\nStandard [{idx+1}]: {s.get('is_number')} - {s.get('title')}")
        print(f"Status: {s.get('overall_status')} | Coverage: {s.get('coverage_score')}")
        print("Requirements:")
        for r in s.get('requirements', []):
            print(f"  - {r['requirement']}: {r['submitted_value']} -> {r['status']}")
            print(f"    Evidence: {r['standard_evidence']}")
        print("Missing Information:")
        for m in s.get('missing_information', []):
            print(f"  - {m}")

def test_engine():
    tests = [
        {
            "desc": "Complete specification",
            "product": "LED street light for municipal roads",
            "spec": "Required power is 100W with IP66 protection and Aluminium body."
        },
        {
            "desc": "Partial specification",
            "product": "Electrical cable",
            "spec": "PVC insulated"
        },
        {
            "desc": "Empty specification",
            "product": "Water pump",
            "spec": ""
        },
        {
            "desc": "Unknown product",
            "product": "unknown magical flying carpet",
            "spec": "100W magical energy"
        },
        {
            "desc": "Specification with explicit conflicting information",
            "product": "LED street light",
            "spec": "IP66 protection" # It will show INSUFFICIENT_DATA as intended because we can't conflict against missing data
        },
        {
            "desc": "Hindi specification",
            "product": "नगरपालिका के लिए 100W एलईडी स्ट्रीट लाइट",
            "spec": "IP66"
        },
        {
            "desc": "Marathi specification",
            "product": "महानगरपालिकेसाठी 100W एलईडी स्ट्रीट लाईट",
            "spec": ""
        },
    ]
    
    for t in tests:
        res = check_compliance(t["product"], t["spec"])
        print_result(t["desc"], res)

if __name__ == "__main__":
    test_engine()
