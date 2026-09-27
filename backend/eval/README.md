# IS-Recommend Gold-Set Evaluation System

## What the Gold Set Is
The `gold_set.csv` file acts as the ultimate ground-truth reference for our AI Recommendation Engine. It contains manually verified mappings between a natural language procurement query and the strictly correct BIS Indian Standard.

## Why Manually Verified Labels are Required
To ensure we never hallucinate a standard or present dangerous compliance data, our evaluation metrics (Accuracy, Recall) must be checked against human-verified truth, rather than letting an LLM grade its own homework.

## Dataset Columns
- `query`: The natural language string (e.g. "5 hp water pump")
- `expected_is_number`: The exact verified BIS IS number (e.g. "IS 9079") OR `REQUIRES_VERIFICATION`.
- `expected_category`: The general product category.
- `language`: The language of the query ("English" or "Hindi").

## Difference between Gold-Set and Demo Data
- **Demo Data** (`src/data/tenders.ts`): Used strictly for populating the UI with cards to show how the system looks and feels.
- **Gold-Set Data** (`eval/gold_set.csv`): Used strictly for algorithmic testing and regression checking. The UI does not display this data directly; it only runs it through the engine to compute accuracy.

## How to Run Evaluation
1. Navigate to the `/eval` route in the Next.js frontend (e.g. `http://localhost:3000/eval`).
2. Click **Run Evaluation**.
3. View the metrics and download the results as a CSV report!
