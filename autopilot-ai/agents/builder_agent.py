"""
Builder Agent — Scaffolds specific project structures based on stack and complexity.
"""

from __future__ import annotations
from typing import Dict, List


def build_app(idea: str, stack: str, complexity: str) -> Dict[str, any]:
    """
    Generates a full-stack project scaffold based on the provided idea.
    
    Args:
        idea: The description of the app to build.
        stack: The technology stack (e.g., 'MERN', 'Next.js', 'Flask').
        complexity: The level of detail ('minimal', 'standard', 'advanced').
        
    Returns:
        A dictionary containing the project structure, file contents, and setup commands.
    """
    
    # Define file templates based on stack
    if stack.lower() == "flask":
        structure = [
            "app/",
            "app/__init__.py",
            "app/routes.py",
            "app/models.py",
            "requirements.txt",
            "run.py",
            "README.md"
        ]
        files = {
            "run.py": "from app import create_app\n\napp = create_app()\nif __name__ == '__main__':\n    app.run(debug=True)",
            "app/__init__.py": "from flask import Flask\n\ndef create_app():\n    app = Flask(__name__)\n    return app",
            "requirements.txt": "flask\nflask-sqlalchemy\npython-dotenv"
        }
        instructions = ["python -m venv venv", "source venv/bin/activate", "pip install -r requirements.txt", "python run.py"]
        
    elif stack.lower() == "next.js":
        structure = [
            "app/",
            "app/layout.tsx",
            "app/page.tsx",
            "components/",
            "components/Header.tsx",
            "package.json",
            "tailwind.config.ts"
        ]
        files = {
            "app/page.tsx": "export default function Home() {\n  return <h1>Welcome to " + idea + "</h1>\n}",
            "package.json": '{\n  "name": "project",\n  "dependencies": {\n    "next": "latest",\n    "react": "latest"\n  }\n}'
        }
        instructions = ["npm install", "npm run dev"]
        
    else: # Defaulting to MERN-style if not specified
        structure = [
            "client/",
            "server/",
            "server/index.js",
            "package.json",
            "README.md"
        ]
        files = {
            "server/index.js": "const express = require('express');\nconst app = express();\napp.listen(5000, () => console.log('Server running on 5000'));",
            "README.md": f"# {idea}\n\nBuilt with {stack} stack."
        }
        instructions = ["npm install", "npm start"]

    # Adjust for complexity (simulated)
    if complexity.lower() == "advanced":
        structure.extend(["tests/", "docker-compose.yml", ".github/workflows/ci.yml"])
        files["docker-compose.yml"] = "version: '3.8'\nservices:\n  web:\n    build: ."
        instructions.append("docker-compose up")

    return {
        "structure": structure,
        "files": files,
        "instructions": instructions
    }


if __name__ == "__main__":
    # Example usage
    example_idea = "A simple Todo App"
    result = build_app(example_idea, "Flask", "standard")
    
    print(f"Building: {example_idea}")
    print("\nPROJECT STRUCTURE:")
    for item in result["structure"]:
        print(f"  - {item}")
        
    print("\nINSTRUCTIONS:")
    for cmd in result["instructions"]:
        print(f"  $ {cmd}")
