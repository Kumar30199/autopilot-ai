"""
AutoPilot AI — FastAPI Backend Server
Orchestrates multiple agents for research, planning, analysis, and building.
"""

import sys
import os
import time
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Ensure the 'agents' directory is in the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Import simple agent functions
from agents.planning_agent import plan as planning_func
from agents.research_agent import research as research_func
from agents.analysis_agent import analyze as analysis_func
from agents.execution_agent import execute as execution_func
from agents.builder_agent import build_app as builder_func

app = FastAPI(title="AutoPilot AI Backend")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared system state for monitoring
system_state = {
    "active_agents": 0,
    "tasks_completed": 0,
    "total_tasks": 0,
    "logs": [],
    "history": []
}

class AgentRequest(BaseModel):
    prompt: str = Field(..., description="Main input for the agent")
    context: Dict[str, Any] = Field(default_factory=dict, description="Metadata like stack or complexity")

@app.get("/")
def read_root():
    return {"status": "online", "message": "AutoPilot AI Backend is running"}

@app.get("/status")
def get_status():
    return {
        "active_agents": system_state["active_agents"],
        "tasks_completed": system_state["tasks_completed"],
        "total_tasks": system_state["total_tasks"],
        "recent_logs": system_state["logs"][-10:]
    }

@app.get("/history")
def get_history():
    return {"history": system_state["history"]}

def log_to_history(agent_name: str, prompt: str, elapsed: int, status: str = "success"):
    task_id = str(uuid.uuid4())[:8]
    system_state["total_tasks"] += 1
    if status == "success":
        system_state["tasks_completed"] += 1
    system_state["history"].append({
        "id": task_id,
        "agent": agent_name,
        "status": status,
        "prompt": prompt,
        "duration_ms": elapsed,
        "timestamp": time.time()
    })

@app.post("/plan")
def handle_plan(req: AgentRequest):
    start = time.time()
    result = planning_func(req.prompt)
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Planner", req.prompt, elapsed)
    return {"status": "success", "agent": "Planner", "result": result, "duration_ms": elapsed}

@app.post("/research")
def handle_research(req: AgentRequest):
    start = time.time()
    result = research_func(req.prompt)
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Researcher", req.prompt, elapsed)
    return {"status": "success", "agent": "Researcher", "result": result, "duration_ms": elapsed}

@app.post("/analyze")
def handle_analyze(req: AgentRequest):
    start = time.time()
    # Analysis expects a dict of data, we pass context or dummy for now
    result = analysis_func(req.context.get("data", {"key_points": [req.prompt]}))
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Analyzer", req.prompt, elapsed)
    return {"status": "success", "agent": "Analyzer", "result": result, "duration_ms": elapsed}

@app.post("/execute")
def handle_execute(req: AgentRequest):
    start = time.time()
    # Execution expects a list, we wrap prompt if not in context
    result = execution_func(req.context.get("plan", [req.prompt]))
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Executor", req.prompt, elapsed)
    return {"status": "success", "agent": "Executor", "result": result, "duration_ms": elapsed}

@app.post("/build")
def handle_build(req: AgentRequest):
    start = time.time()
    # Builder expects (idea, stack, complexity)
    idea = req.prompt
    stack = req.context.get("tech_stack", "Next.js")
    complexity = req.context.get("complexity", "standard")
    
    result = builder_func(idea, stack, complexity)
    elapsed = int((time.time() - start) * 1000)
    
    # Update local history for dashboard visibility
    log_to_history("Builder", f"Building {idea} ({stack})", elapsed)
    
    return {
        "status": "success", 
        "agent": "Builder", 
        "result": result, 
        "duration_ms": elapsed
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
