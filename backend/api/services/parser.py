import os

# Define supported extensions for a generic tool
SUPPORTED_EXTENSIONS = {
    # Web
    '.js', '.jsx', '.ts', '.tsx', '.html', '.css', 
    # Backend
    '.py', '.java', '.go', '.rb', '.php', '.cs', 
    # Systems
    '.c', '.cpp', '.h', '.rs', 
    # Data/Config
    '.sql', '.graphql', '.json', '.yaml', '.xml'
}

IGNORED_DIRS = {
    'node_modules', 'venv', 'env', '.git', '__pycache__', 'dist', 'build', 'target', 'bin', 'obj'
}

def get_code_structure(path: str) -> str:
    """
    Scans a directory for ALL supported code files and returns a summary of their content.
    It is smart enough to skip huge folders like 'node_modules'.
    """
    if not os.path.exists(path):
        return "Error: Path does not exist."

    structure = []
    file_count = 0
    
    # Walk through the directory
    for root, dirs, files in os.walk(path):
        # 1. Filter out ignored directories (modify dirs in-place)
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            
            if ext in SUPPORTED_EXTENSIONS:
                file_path = os.path.join(root, file)
                # Get relative path for cleaner output (e.g., "src/components/App.tsx")
                rel_path = os.path.relpath(file_path, path)
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                        # Limit content size per file to avoid crashing the AI
                        # We take the first 50 lines or 2000 characters
                        summary = content[:2000]
                        
                        structure.append(f"--- FILE: {rel_path} ---\n{summary}\n")
                        file_count += 1
                        
                except Exception as e:
                    print(f"Skipping {file}: {e}")

    if file_count == 0:
        return "No supported code files found in this directory."

    # Return a massive string containing all the code
    return "\n".join(structure)