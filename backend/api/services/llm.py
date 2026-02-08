import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# --- UPGRADED PROMPT FOR BETTER DIAGRAMS ---
SYSTEM_PROMPT = """
You are a Senior Technical Architect and an expert in Mermaid.js syntax.
Your goal is to visualize code structures based on the user's query.

You will receive code from ANY language (Python, JS, Java, Go, etc.). 
Analyze the syntax accordingly.

STRICT OUTPUT RULES:
1. Return ONLY the raw Mermaid code. No markdown (no ```mermaid).
2. Do not include any explanations.

DIAGRAM RULES:
- **Class Diagram:** Visualize classes/interfaces and their relationships.
- **Sequence Diagram:** Visualize function calls or API flows.
- **Flowchart:** Visualize logic paths (if/else/loops).
- **State Diagram:** Visualize state changes.

Analyze the code provided in the context. Infer relationships based on imports, class inheritance, and function calls.
"""
# (The rest of the file stays the same)

def generate_mermaid(structure_context: str, user_query: str) -> str:
    # Fail fast check
    if "No Python files found" in structure_context:
        return "graph TD; A[Error] --> B[No Python Files Found];"

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Code Context:\n{structure_context}\n\nUser Query: {user_query}"}
            ],
            temperature=0.1, # Low temperature for consistent syntax
        )
        
        raw_code = response.choices[0].message.content.strip()
        
        # Cleanup routine
        if raw_code.startswith("```mermaid"):
            raw_code = raw_code.replace("```mermaid", "").replace("```", "")
        elif raw_code.startswith("```"):
            raw_code = raw_code.replace("```", "")
            
        return raw_code.strip()

    except Exception as e:
        print(f"LLM Error: {e}")
        return f"graph TD; A[Error] --> B[{str(e).replace(':', '')}];"