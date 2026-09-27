import logging

logger = logging.getLogger(__name__)

def get_standard_subgraph(is_number: str, hops: int = 2):
    """
    Given a starting standard (is_number), returns its full allied-standards 
    subgraph up to `hops` depth.
    
    This function acts as the interface for Agent D (API Layer) to import
    and query the graph layer.
    
    Returns:
        dict: A Cytoscape.js compatible JSON structure containing:
            - nodes: [{data: {id, title, status, cert_required}}, ...]
            - edges: [{data: {source, target, edge_type, source_url}}, ...]
    """
    logger.info(f"Querying graph for {is_number} with max depth {hops}")
    
    # In reality, this would execute a recursive CTE query against Postgres:
    query = """
    WITH RECURSIVE standard_graph AS (
        -- Base case: the requested standard's outbound edges
        SELECT from_is_number, to_is_number, edge_type, source_url, 1 AS depth
        FROM standard_edges
        WHERE from_is_number = %s
        
        UNION
        
        -- Recursive case: outbound edges of the targets we found
        SELECT e.from_is_number, e.to_is_number, e.edge_type, e.source_url, sg.depth + 1
        FROM standard_edges e
        INNER JOIN standard_graph sg ON e.from_is_number = sg.to_is_number
        WHERE sg.depth < %s
    )
    SELECT * FROM standard_graph;
    """
    
    # For now, return a mocked structure so Agent D can build the API safely.
    mock_nodes = [
        {"data": {"id": is_number, "title": "Primary Standard", "status": "live", "cert_required": "ISI Mark"}},
        {"data": {"id": "IS 1000:2019", "title": "Test Methods for Primary", "status": "live", "cert_required": None}}
    ]
    
    mock_edges = [
        {
            "data": {
                "source": is_number, 
                "target": "IS 1000:2019", 
                "edge_type": "TEST_METHOD_FOR",
                "source_url": "https://services.bis.gov.in/example"
            }
        }
    ]
    
    return {
        "nodes": mock_nodes,
        "edges": mock_edges
    }
