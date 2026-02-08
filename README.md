# CodeAtlas - Enterprise AI Architecture Visualizer

> **Turn any codebase into live architecture diagrams instantly.**
> *Powered by React, Django, LangChain, and Mermaid.js.*

## Overview
CodeAtlas is an automated documentation tool that helps developers understand complex codebases in seconds. 

Unlike static documentation, CodeAtlas uses **Static Analysis (AST)** combined with **Generative AI (LLMs)** to read source code and generate live, accurate UML diagrams (Sequence, Class, Flowchart, etc.).

It solves the "Documentation Rot" problem by generating visuals directly from the current code state.

## Key Features
* **Universal Code Parsing:** Supports Python, JavaScript, TypeScript, Java, Go, and C++.
* **AI-Driven Visualization:** Uses OpenAI (GPT-3.5/4) or Groq (Llama 3) to infer logical relationships.
* **Context-Aware Generation:** Dynamically retrieves relevant file content to ground LLM responses in reality.
* **Interactive Diagrams:** Renders editable Mermaid.js diagrams for Sequence, Class, State, and Entity-Relationship views.
* **Smart Caching:** Prevents redundant API calls by hashing file contents.
* **Enterprise Security:** Runs locally; source code is analyzed in-memory and never stored on third-party servers.

---

## AI & Architecture Logic
CodeAtlas utilizes a sophisticated **Context-Retrieval Pipeline** rather than simple text generation:

1.  **Ingestion:** The system scans the local directory using Python's `os` and `ast` modules.
2.  **Filtering:** It identifies high-value code files (ignoring `node_modules`, `venv`, etc.).
3.  **Context Construction:** Relevant code snippets are extracted and structured into a prompt context window.
4.  **LLM Inference:** The **OpenAI API** (or Groq) processes this context to generate strict Mermaid.js syntax.
5.  **Rendering:** The frontend visualizes the returned syntax into interactive diagrams.

---

## Gallery

CodeAtlas can generate multiple types of diagrams to view your system from different angles.

### 1. Use Case Diagram
Visualizes the high-level functional requirements and how actors (users, admins) interact with the system.
![Use Case Diagram](screenshots/use_case_diagram.png)

### 2. Sequence Diagram
Details the chronological flow of messages between objects, APIs, and services during a specific process.
![Sequence Diagram](screenshots/sequence_diagram.png)

### 3. State Diagram
Tracks the lifecycle of a specific object (e.g., a "User Request") as it transitions from pending to completed or failed.
![State Diagram](screenshots/state_diagram.png)

### 4. Flowchart
Maps out the complex decision logic, loops, and conditional branches within specific functions.
![Flowchart](screenshots/flowchart.png)

### 5. Requirement Diagram
Visualizes the system's functional and non-functional requirements and their traceability.
![Requirement Diagram](screenshots/requirement_diagram.png)

### 6. Entity Relationship Diagram (ERD)
Displays the database schema, including tables, columns, and the relationships (One-to-Many, Many-to-Many) between them.
![ER Diagram](screenshots/er_diagram.png)

---

## Tech Stack

### Frontend (Client)
* **React + TypeScript:** Type-safe, component-based UI.
* **Vite:** Blazing fast build tool.
* **Mermaid.js:** Real-time diagram rendering engine.
* **Tailwind CSS:** Modern, responsive styling.

### Backend (Server)
* **Django REST Framework:** Robust API handling.
* **LangChain:** Framework for managing LLM prompts and chains.
* **OpenAI API / Groq:** Large Language Models for logic inference.
* **Tree-Sitter / AST:** Parses raw code into abstract syntax trees for the AI.
* **PostgreSQL:** Relational database for storing user request history.

---

## Getting Started

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)
* PostgreSQL (optional, defaults to SQLite for dev)

### 1. Clone the Repository
```bash
git clone [https://github.com/Onkar97/code-atlas.git](https://github.com/Onkar97/code-atlas.git)
cd code-atlas
