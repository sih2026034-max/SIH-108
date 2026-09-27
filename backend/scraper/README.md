# BIS Standards Scraper (Agent A)

This module handles acquiring and structuring metadata for Indian Standards from the BIS portal. 

## Features
- Fetches standards data asynchronously.
- Implements conservative rate-limiting to prevent IP blocks (1.5 seconds per request, bounded concurrency).
- Checkpoints progress to disk every 50 records, so scraping can be resumed after interruption.
- Outputs structured `standards.jsonl` and `edges.jsonl` files (for graph representations of standard dependencies).

## Usage
Install dependencies and run the script:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

python src/main.py
```

## Current Coverage
- Legacy portal (services.bis.gov.in): Script initialized and successfully processed the first batch (test set 100).
- New portal (standards.bis.gov.in): Endpoint scaffolded.
- Archive.org: Scaffolded.
