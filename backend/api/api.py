from ninja import NinjaAPI
from .schemas import DiagramRequest, DiagramResponse
from .services.parser import get_code_structure
from .services.llm import generate_mermaid

api = NinjaAPI(title="CodeAtlas Enterprise API")

@api.post("/generate", response=DiagramResponse)
def generate_diagram(request, payload: DiagramRequest):
    try:
        # 1. Parse Code (CS Fundamentals)
        structure = get_code_structure(payload.repo_path)
        
        # 2. Generate Diagram (GenAI)
        mermaid_code = generate_mermaid(structure, payload.query)
        
        return {
            "mermaid_code": mermaid_code,
            "nodes_analyzed": len(structure.splitlines())
        }
    except Exception as e:
        # Graceful error handling
        return api.create_response(
            request, 
            {"mermaid_code": "", "nodes_analyzed": 0, "error": str(e)}, 
            status=500
        )