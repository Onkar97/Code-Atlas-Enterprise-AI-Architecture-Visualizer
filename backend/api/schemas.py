from ninja import Schema
from typing import Optional

class DiagramRequest(Schema):
    repo_path: str
    query: str

class DiagramResponse(Schema):
    mermaid_code: str
    nodes_analyzed: int
    error: Optional[str] = None
    