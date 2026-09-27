import logging
from typing import Any, List

logger = logging.getLogger(__name__)

# This is a mocked local cache for validation. In a real environment, this would
# query the Postgres `standards` table or a Redis cache to ensure existence.
VALID_IS_NUMBERS_CACHE = {
    "IS 1000:2020",
    "IS 1001:2019"
}

def is_valid_is_number(is_number: str) -> bool:
    """
    Checks the database to ensure the IS number actually exists in our corpus.
    """
    # mock: return True if in cache, else False
    return is_number in VALID_IS_NUMBERS_CACHE

def validate_is_numbers(data: Any) -> Any:
    """
    Recursively scans the response data structure (dicts, lists) and strips out
    any IS numbers that do not exist in the database, logging a hallucination alert.
    
    This is the core enforcement mechanism for the non-negotiable rule #1.
    """
    if isinstance(data, dict):
        validated_dict = {}
        for k, v in data.items():
            # If the key itself implies an IS number field, validate the value
            if k in ["is_number", "from_is_number", "to_is_number", "correct_is_number"]:
                if isinstance(v, str) and not is_valid_is_number(v):
                    logger.error(f"HALLUCINATION ALERT: Attempted to return invalid IS number '{v}'. Stripping from response.")
                    validated_dict[k] = None # Or strip entirely depending on strictness
                else:
                    validated_dict[k] = validate_is_numbers(v)
            else:
                validated_dict[k] = validate_is_numbers(v)
        return validated_dict
        
    elif isinstance(data, list):
        return [validate_is_numbers(item) for item in data]
        
    else:
        return data

# Simple test runner for validation logic
if __name__ == "__main__":
    test_response = {
        "recommendation": {
            "is_number": "IS 1000:2020",
            "title": "Valid Standard"
        },
        "allied_standards": [
            {"is_number": "IS 1001:2019"},
            {"is_number": "IS 9999:2050"} # Fake / Hallucinated
        ]
    }
    
    logger.info("Running validation test...")
    clean = validate_is_numbers(test_response)
    
    assert clean["recommendation"]["is_number"] == "IS 1000:2020"
    assert clean["allied_standards"][0]["is_number"] == "IS 1001:2019"
    assert clean["allied_standards"][1]["is_number"] is None
    logger.info("Validation test passed: Hallucinated IS number was successfully stripped.")
