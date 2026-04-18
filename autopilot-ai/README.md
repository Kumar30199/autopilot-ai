# AutoPilot AI — Multi-Agent Operating System

A full-stack multi-agent operating system with a dark futuristic system dashboard.

## Project Structure

```
autopilot-ai/
├── frontend/          React + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   ├── SystemMetrics.jsx
│   │   │   ├── AgentPanel.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   └── AgentResultModal.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/           Python FastAPI
│   ├── main.py
│   └── requirements.txt
│
├── agents/            Python Agent Modules
│   ├── __init__.py
│   ├── base_agent.py
│   ├── planner.py
│   ├── researcher.py
│   ├── analyzer.py
│   ├── executor.py
│   └── builder.py
│
├── assets/            Logos, images
│   └── README.md
│
└── README.md
```

## Quick Start

### 1. Backend (FastAPI)

```bash
cd autopilot-ai/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (React + Vite)

```bash
cd autopilot-ai/frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend on `http://localhost:8000`.

## API Endpoints

| Method | Endpoint     | Description                                     |
|--------|--------------|-------------------------------------------------|
| GET    | `/status`    | Returns system status, uptime, active agents    |
| GET    | `/history`   | Returns recent task execution history           |
| POST   | `/plan`      | Dispatches the Planner agent                    |
| POST   | `/research`  | Dispatches the Researcher agent                 |
| POST   | `/analyze`   | Dispatches the Analyzer agent                   |
| POST   | `/execute`   | Dispatches the Executor agent                   |
| POST   | `/build`     | Dispatches the Builder agent                    |

### Request Body (POST endpoints)

```json
{
  "prompt": "Your task description here",
  "context": {}
}
```

## Agents

| Agent        | Purpose                                          |
|--------------|--------------------------------------------------|
| **Planner**  | Breaks goals into structured action plans        |
| **Researcher** | Gathers data, references, and intelligence     |
| **Analyzer** | Risk assessment, metrics, optimization insights  |
| **Executor** | Runs tasks and orchestrates operations           |
| **Builder**  | Scaffolds code, projects, and build artifacts    |

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Lucide React
- **Backend**: Python, FastAPI, Uvicorn, Pydantic
- **Design**: Dark futuristic theme, glassmorphism, micro-animations
