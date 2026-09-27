import asyncio
import httpx
import json
import logging
import os
from bs4 import BeautifulSoup
from datetime import datetime, timezone

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "output")
STANDARDS_FILE = os.path.join(OUTPUT_DIR, "standards.jsonl")
EDGES_FILE = os.path.join(OUTPUT_DIR, "edges.jsonl")

# Constants
CHECKPOINT_INTERVAL = 50
RATE_LIMIT_DELAY = 1.5  # Seconds between requests
MAX_LEGACY_ID = 26000 # Example upper bound for enumerable IDs
CONCURRENCY_LIMIT = 3 # Conservative to avoid 429s

class BISScraper:
    def __init__(self):
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        self.seen_ids = self._load_checkpoints()
        self.standards_buffer = []
        self.edges_buffer = []
        self.semaphore = asyncio.Semaphore(CONCURRENCY_LIMIT)

    def _load_checkpoints(self):
        seen = set()
        if os.path.exists(STANDARDS_FILE):
            with open(STANDARDS_FILE, "r") as f:
                for line in f:
                    try:
                        record = json.loads(line)
                        if "id" in record:
                            seen.add(record["id"])
                    except Exception:
                        pass
        logger.info(f"Loaded {len(seen)} existing records from checkpoint.")
        return seen

    def _flush_buffers(self):
        if self.standards_buffer:
            with open(STANDARDS_FILE, "a") as f:
                for record in self.standards_buffer:
                    f.write(json.dumps(record) + "\n")
            self.standards_buffer = []
            
        if self.edges_buffer:
            with open(EDGES_FILE, "a") as f:
                for edge in self.edges_buffer:
                    f.write(json.dumps(edge) + "\n")
            self.edges_buffer = []
            
        logger.info("Checkpointed data to disk.")

    async def fetch_legacy_standard(self, client: httpx.AsyncClient, record_id: int):
        # This is a mocked structure representing the expected scraping logic
        url = f"https://services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/is_details/{record_id}"
        
        async with self.semaphore:
            await asyncio.sleep(RATE_LIMIT_DELAY)
            try:
                # In reality, this would be a real GET/POST depending on the BIS legacy portal
                # response = await client.get(url, timeout=10.0)
                # if response.status_code != 200:
                #     return None
                
                # Mock response parsing (replace with actual BeautifulSoup logic against live HTML)
                # soup = BeautifulSoup(response.text, 'html.parser')
                
                # Mocked Data for demonstration
                is_num = f"IS {1000 + record_id}:2020"
                standard_data = {
                    "id": f"legacy_{record_id}",
                    "is_number": is_num,
                    "title": f"Specification for Test Product {record_id}",
                    "common_title": f"Test Product {record_id}",
                    "edition": "2020",
                    "amendment_no": "1",
                    "amendment_date": "2022-01-01",
                    "status": "live",
                    "superseded_by": None,
                    "supersedes": None,
                    "group": "Mechanical",
                    "subgroup": "Pumps",
                    "ics_code": "23.080",
                    "itc_hs_code": "8413",
                    "certification_type": "ISI Mark",
                    "relevant_ministry": "Ministry of Jal Shakti",
                    "source_url": url,
                    "retrieved_at": datetime.now(timezone.utc).isoformat(),
                    "scope_excerpt": f"This standard covers the requirements for test product {record_id}..."
                }

                # Normative references (mocked edges)
                edges = []
                if record_id % 5 == 0:
                    edges.append({
                        "from_is_number": is_num,
                        "to_is_number": f"IS {1000 + record_id - 1}:2019",
                        "edge_type": "NORMATIVE_REF",
                        "source_url": url
                    })

                return standard_data, edges

            except httpx.HTTPError as e:
                logger.error(f"HTTP error fetching legacy record {record_id}: {e}")
                return None, None
            except Exception as e:
                logger.error(f"Error parsing legacy record {record_id}: {e}")
                return None, None

    async def fetch_new_standard(self, client: httpx.AsyncClient, is_number: str):
        # Logic for new portal (standards.bis.gov.in) XHR endpoint
        # The exact endpoint needs to be reversed from the Network tab
        endpoint = "https://standards.bis.gov.in/api/v1/standards/search"
        
        async with self.semaphore:
            await asyncio.sleep(RATE_LIMIT_DELAY)
            # Implemented with Mock for now
            logger.debug(f"Fetching from new portal API: {is_number}")
            return None, None

    async def scrape_legacy(self):
        async with httpx.AsyncClient(verify=False) as client:
            tasks = []
            count = 0
            # Test with a small batch first
            for record_id in range(1, 101):
                if f"legacy_{record_id}" in self.seen_ids:
                    continue
                
                std, edges = await self.fetch_legacy_standard(client, record_id)
                if std:
                    self.standards_buffer.append(std)
                    if edges:
                        self.edges_buffer.extend(edges)
                    self.seen_ids.add(std["id"])
                    count += 1
                
                if count >= CHECKPOINT_INTERVAL:
                    self._flush_buffers()
                    count = 0
                    
            self._flush_buffers()

    async def run(self):
        logger.info("Starting BIS Metadata Scraper...")
        await self.scrape_legacy()
        # await self.scrape_new_portal()
        logger.info("Scraping completed.")

if __name__ == "__main__":
    scraper = BISScraper()
    asyncio.run(scraper.run())
