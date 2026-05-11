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
from agents.planner import PlannerAgent
from agents.research_agent import research as research_func
from agents.analysis_agent import analyze as analysis_func
from agents.execution_agent import execute as execution_func
from agents.builder_agent import build_app as builder_func

from llm_router import generate_app as generate_app_func, get_model_availability, check_groq_models, get_provider_availability
from requirement_analyzer import analyze_requirements


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
    selectedProvider: str = Field("groq", description="The specifically chosen AI provider")
    selectedModel: str = Field("auto", description="The specifically chosen open-source model ID")

class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., description="The app idea to analyze")
    architecture: str = Field("auto-detect", description="AI architecture mode: auto-detect, frontend-only, full-stack, python-backend, advanced-custom")
    forceStack: str = Field("", description="Optional explicit stack override")

@app.get("/")
def read_root():
    return {"status": "online", "message": "AutoPilot AI Backend is running"}

@app.on_event("startup")
async def startup_event():
    print("[SYSTEM] Warming up Groq model cache...")
    import asyncio
    asyncio.create_task(check_groq_models())

@app.get("/models-status")
async def handle_models_status():
    """Return which Groq models are currently active for the frontend model selector."""
    try:
        availability = await get_model_availability()
        return {"success": True, "models": availability}
    except Exception as e:
        print(f"[MODELS-STATUS ERROR] {e}")
        return {
            "success": False,
            "models": {
                "llama-instant": True,
                "llama-versatile": True,
                "mixtral": False,
                "gemma": False,
            }
        }

@app.get("/providers-status")
async def handle_providers_status():
    """Return which providers have valid API keys for the frontend to show/hide sections."""
    try:
        providers = get_provider_availability()
        return {"success": True, "providers": providers}
    except Exception as e:
        print(f"[PROVIDERS-STATUS ERROR] {e}")
        return {"success": False, "providers": {"groq": True, "gemini": False, "huggingface": False, "cerebras": False}}

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
    agent = PlannerAgent()
    result = agent.plan(req.prompt)
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Planner", req.prompt, elapsed)
    return {"status": "success", "agent": "Planner", "result": result, "duration_ms": elapsed}

@app.post("/research")
async def handle_research(req: AgentRequest):
    start = time.time()
    result = await research_func(req.prompt)
    elapsed = int((time.time() - start) * 1000)
    log_to_history("Researcher", req.prompt, elapsed)
    return {"status": "success", "agent": "Researcher", "result": result, "duration_ms": elapsed}

@app.post("/analyze")
async def handle_analyze(req: AgentRequest):
    start = time.time()
    result = await analysis_func(req.prompt)
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

@app.post("/analyze-idea")
async def handle_analyze_idea(req: AnalyzeRequest):
    """Hard Agent Decision Engine — Analyze requirements and auto-select stack."""
    try:
        idea = req.prompt
        force_stack = req.forceStack if req.forceStack else None
        
        print(f"[ANALYZER] Analyzing idea: \"{idea[:60]}...\" | forceStack={force_stack}")
        
        result = analyze_requirements(idea, force_stack)
        
        print(f"[ANALYZER] Detected {len(result['features'])} features -> Stack: {result['recommended_stack']} ({result['complexity']})")
        
        return {
            "success": True,
            **result
        }
    except Exception as e:
        print(f"[ANALYZER ERROR] {str(e)}")
        return {
            "success": False,
            "features": [],
            "feature_ids": [],
            "recommended_stack": "MERN",
            "stack_label": "MERN Stack",
            "stack_reason": f"Analysis failed ({str(e)}) — defaulting to MERN.",
            "complexity": "standard",
            "is_overridden": False,
            "project_name": "new-app"
        }

@app.post("/generate-app")
async def handle_generate_app(req: AgentRequest):
    """Real live connection to Open-Source LLMs for building apps."""
    try:
        start = time.time()
        idea = req.prompt
        stack = req.context.get("tech_stack", "MERN")
        architecture = req.context.get("architecture", "auto-detect")
        complexity = req.context.get("complexity", "standard")
        model_id = req.selectedModel
        normal_mode = req.context.get("normal_mode", "")
        detected_features = req.context.get("detected_features", [])
        stack_reason = req.context.get("stack_reason", "")
        preferences = req.context.get("preferences", {})
        
        # Map high-level architecture to concrete stack when not using manual override
        ARCH_TO_STACK = {
            "frontend-only": "Next.js",
            "full-stack": "MERN",
            "python-backend": "Flask",
        }
        if architecture in ARCH_TO_STACK:
            stack = ARCH_TO_STACK[architecture]
        
        print(f"[DEBUG] Backend Received: prompt=\"{idea[:30]}...\", arch={architecture}, stack={stack}, mode={complexity}, model={model_id}, features={len(detected_features)}")

        # Fetch live JSON layout asynchronously — pass feature context for smarter generation
        response_payload = await generate_app_func(idea, stack, complexity, model_id, detected_features, stack_reason, preferences, normal_mode)
        
        elapsed = int((time.time() - start) * 1000)
        
        if not response_payload.get("success"):
            log_to_history("Live Generator", f"Failed: {idea} via {response_payload.get('provider')}", elapsed, status="error")
            # Return the error response as normal JSON to the frontend
            return response_payload

        log_to_history("Live Generator", f"Live Build {idea} via {response_payload.get('model')}", elapsed)

        return response_payload
    except Exception as e:
        print(f"[CRITICAL ERROR] Python backend exception: {str(e)}")
        return {
            "success": False,
            "provider": "unknown",
            "model": req.selectedModel,
            "error": str(e)
        }

@app.get("/debug-models")
async def handle_debug_models():
    """Runs tests for Minimal, Standard, and Advanced Groq flows using valid model IDs."""
    models_to_test = {
        "minimal": "llama-instant",
        "standard": "llama-versatile",
        "advanced": "auto"
    }
    
    idea = "A simple HTML hello world app"
    stack = "React"
    
    model_status = {}
    is_groq_working = True
    
    for complexity, model_val in models_to_test.items():
        try:
            print(f"[DEBUG-MODELS] Testing {complexity} layer via {model_val}...")
            res = await generate_app_func(idea, stack, complexity, model_val) 
            is_success = res.get("success", False)
            
            if is_success:
                model_status[complexity] = f"working (model: {res.get('model', 'unknown')})"
            else:
                model_status[complexity] = f"error: {res.get('error')}"
                is_groq_working = False
        except Exception as e:
            model_status[complexity] = f"critical exception: {str(e)}"
            is_groq_working = False

    # Also include live availability
    availability = await get_model_availability()

    return {
        "provider": "groq",
        "status": "working" if is_groq_working else "error",
        "models": model_status,
        "availability": availability
    }

if __name__ == "__main__":
    import uvicorn
    print("[DEBUG] AutoPilot AI Backend starting on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
