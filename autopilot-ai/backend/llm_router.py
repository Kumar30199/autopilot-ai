import os
import httpx
import json
import asyncio
import re
from pathlib import Path
from dotenv import load_dotenv

# ENV Loading
try:
    load_dotenv(Path(__file__).parent / ".env")
except:
    pass
try:
    load_dotenv(Path(__file__).parent.parent / ".env")
except:
    pass

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "").strip()
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY", "").strip()

def print_key_status(name, key):
    if key and len(key) > 8:
        masked = key[:4] + "..." + key[-4:]
        print(f"[ENV] {name}=loaded {masked}")
    else:
        print(f"[ENV] {name}=missing")

print_key_status("GROQ", GROQ_API_KEY)
print_key_status("GOOGLE", GOOGLE_API_KEY)
print_key_status("HUGGINGFACE", HUGGINGFACE_API_KEY)
print_key_status("CEREBRAS", CEREBRAS_API_KEY)

# ── Model Registry: frontend ID → actual Groq model ID ────────────
GROQ_MODEL_REGISTRY = {
    "llama-instant": "llama-3.1-8b-instant",
    "llama-versatile": "llama-3.3-70b-versatile",
    "mixtral": "mixtral-8x7b-32768",
    "gemma": "gemma2-9b-it",
    "deepseek-r1-distill-llama-70b": "deepseek-r1-distill-llama-70b",
    "llama-3.3-70b-specdec": "llama-3.3-70b-specdec",
    "llama3-8b-8192": "llama3-8b-8192",
    "llama3-70b-8192": "llama3-70b-8192",
}

# ── New Provider Model Registries ──────────────────────────────
GEMINI_MODEL_REGISTRY = {
    "gemini-2.5-flash": "gemini-2.5-flash",
    "gemini-2.0-flash": "gemini-2.0-flash",
    "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
}

HUGGINGFACE_MODEL_REGISTRY = {
    "hf-qwen-2.5-72b": "Qwen/Qwen2.5-72B-Instruct",
    "hf-llama-3.3-70b": "meta-llama/Llama-3.3-70B-Instruct",
    "hf-mistral-nemo": "mistralai/Mistral-Nemo-Instruct-2407",
}

CEREBRAS_MODEL_REGISTRY = {
    "cerebras-llama-3.3-70b": "llama-3.3-70b",
    "cerebras-llama4-scout": "llama-4-scout-17b-16e-instruct",
    "cerebras-qwen-3-32b": "qwen-3-32b",
}

# Strongest-first ordering for auto-advanced model selection
STRONGEST_MODEL_ORDER = [
    "deepseek-r1-distill-llama-70b",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
    "llama-3.1-8b-instant",
]

# In-memory cache for active models (refreshes every 5 minutes)
_active_models_cache = {"models": set(), "timestamp": 0}

async def check_groq_models() -> set:
    """Probe Groq /v1/models endpoint to discover currently active models."""
    import time as _time
    now = _time.time()

    if now - _active_models_cache["timestamp"] < 300 and _active_models_cache["models"]:
        return _active_models_cache["models"]

    if not GROQ_API_KEY:
        return {"llama-3.1-8b-instant", "llama-3.3-70b-versatile"}

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.groq.com/openai/v1/models",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                model_ids = {m["id"] for m in data.get("data", [])}
                _active_models_cache["models"] = model_ids
                _active_models_cache["timestamp"] = now
                print(f"[GROQ] Discovered {len(model_ids)} active models")
                return model_ids
            else:
                print(f"[GROQ] Models API returned HTTP {response.status_code}")
    except Exception as e:
        print(f"[GROQ] Failed to fetch models list: {e}")

    return {"llama-3.1-8b-instant", "llama-3.3-70b-versatile"}

async def get_model_availability() -> dict:
    """Return per-card availability for the frontend model selector."""
    active = await check_groq_models()
    return {fid: (gid in active) for fid, gid in GROQ_MODEL_REGISTRY.items()}

# ── Model-Specific System Prompts ─────────────────────────────────
MODEL_SYSTEM_PROMPTS = {
    "gemini": """You are an elite UI/UX engineer specializing in premium React applications.
Your strength is VISUAL EXCELLENCE: stunning layouts, smooth animations, modern design patterns, glassmorphism, gradients, micro-interactions.
Prioritize: beautiful hero sections, polished component design, responsive layouts, dark/light themes, Tailwind CSS mastery.
Every app you build should look like a $10M startup product.""",

    "qwen-72b": """You are an expert full-stack software architect specializing in robust React applications.
Your strength is CODE QUALITY: clean architecture, proper state management, reusable components, scalable patterns.
Prioritize: well-structured hooks, context providers, proper data flow, error handling, TypeScript-ready patterns, DRY code.
Every app you build should be production-grade with excellent code organization.""",

    "llama-instant": """You are a fast, efficient React developer who builds clean working MVPs.
Your strength is SPEED + RELIABILITY: deliver a complete working app with zero broken code.
Prioritize: single-file simplicity when possible, working useState/useEffect hooks, clean JSX, visible UI on first render.
Keep scope tight. Avoid over-engineering. Every component must render real content immediately.""",

    "llama-versatile": """You are a versatile full-stack React developer who builds reliable, complete applications.
Your strength is BALANCE: good architecture + good UI + consistent output.
Prioritize: multi-component structure, proper imports/exports, working CRUD operations, clean layout, consistent styling.
Every app should be well-rounded with no weak areas.""",

    "mistral": """You are a clean-code specialist who builds well-structured React applications.
Your strength is READABILITY: clear naming, reusable components, logical file organization, minimal complexity.
Prioritize: descriptive variable names, small focused components, clear prop interfaces, consistent code style.
Every app should be easy to read, maintain, and extend.""",

    "qwen-32b": """You are a reasoning-focused developer who builds smart, logic-heavy React applications.
Your strength is LOGIC: complex state machines, data transformations, workflow engines, dashboard analytics.
Prioritize: proper data modeling, computed values, filtering/sorting logic, chart-ready data, smart defaults.
Every app should demonstrate strong problem-solving and intelligent feature design.""",

    "scout": """You are a modern UI developer who builds fast, visually appealing React applications.
Your strength is MODERN UI + SPEED: trendy layouts, good typography, fast generation.
Prioritize: modern card layouts, clean navigation, responsive grids, subtle animations, contemporary color palettes.
Every app should look current and professional.""",

    "default": """You are a skilled React developer who builds complete, functional applications.
Your strength is RELIABILITY: every app compiles, renders visible content, and has working interactions.
Prioritize: working code over fancy features, complete implementations over partial ones, visible UI on first render."""
}

def get_model_system_prompt(model_id: str) -> str:
    """Select the best system prompt based on the resolved model ID."""
    mid = model_id.lower()
    if "gemini" in mid:
        key = "gemini"
    elif "qwen2.5-72b" in mid or "qwen-2.5-72b" in mid:
        key = "qwen-72b"
    elif "instant" in mid or "8b" in mid:
        key = "llama-instant"
    elif "versatile" in mid or ("llama" in mid and "70b" in mid and "scout" not in mid):
        key = "llama-versatile"
    elif "mistral" in mid or "nemo" in mid:
        key = "mistral"
    elif "qwen" in mid and ("32b" in mid or "3-32b" in mid):
        key = "qwen-32b"
    elif "scout" in mid:
        key = "scout"
    else:
        key = "default"
    print(f"[PROMPT] Model '{model_id}' -> system prompt profile: {key}")
    return MODEL_SYSTEM_PROMPTS[key]


GLOBAL_OUTPUT_RULES = """

CRITICAL OUTPUT RULES (MANDATORY FOR ALL MODELS):
1. Return ONLY valid code. No markdown explanations outside the JSON block.
2. Every .jsx file MUST have: import React, a default export, a return() with JSX.
3. App.jsx MUST render visible UI immediately — headings, content, interactive elements. NO EMPTY DIVS.
4. Include real styling (inline, CSS file, or Tailwind classes). No unstyled raw HTML.
5. All useState/useEffect hooks must be properly imported and used.
6. No placeholder text like 'TODO', 'insert code here', 'content goes here'.
7. No undefined variables or missing imports.
8. All JSX tags must be properly closed and balanced.
9. Use meaningful sample data (names, descriptions, numbers) — never empty arrays/objects as final state.
10. Code must compile and render without errors on first try.

JSON OUTPUT FORMAT:
First write a brief 3-line plan, then output ONE valid JSON block:
```json
{
  "project_name": "app-name",
  "files": [
    { "path": "src/App.jsx", "code": "...complete React code..." },
    { "path": "src/App.css", "code": "...complete CSS..." }
  ],
  "preview": {}
}
```
IMPORTANT: Every file MUST have both "path" and "code" as non-empty strings.
Always escape quotes correctly. Always close all JSON brackets.
"""

def format_features_context(detected_features: list, stack_reason: str) -> str:
    """Build a rich context string from the detected features for the LLM."""
    if not detected_features:
        return ""
    
    feature_labels = [f.get("label", f.get("id", "unknown")) if isinstance(f, dict) else str(f) for f in detected_features]
    features_str = ", ".join(feature_labels)
    
    context = f"\n\nDETECTED REQUIREMENTS (build these features!):\n{features_str}"
    
    if stack_reason:
        context += f"\n\nARCHITECTURE RATIONALE: {stack_reason}"
    
    context += "\n\nYou MUST implement working UI and logic for ALL of the detected requirements above. Do not skip any feature."
    
    return context


def get_mode_prompt(idea: str, stack: str, complexity: str, detected_features: list = None, stack_reason: str = "", preferences: dict = None, resolved_model_id: str = "") -> str:
    features_context = format_features_context(detected_features or [], stack_reason)
    
    if preferences:
        prefs_str = f"""
USER PREFERENCES:
- UI Style: {preferences.get('uiStyle', 'modern')}
- Database: {preferences.get('database', 'auto')}
- Deployment: {preferences.get('deployTarget', 'auto')}
- Authentication: {'Required' if preferences.get('auth') else 'Not required'}
- Realtime Features: {'Required' if preferences.get('realtime') else 'Not required'}
"""
        features_context += f"\n{prefs_str}"

    model_opt = ""
    res_lower = resolved_model_id.lower()
    if "gemini" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at premium UI design.
- Use Tailwind CSS with custom gradients, shadows, and hover animations.
- Build hero sections, feature grids, testimonial cards with real content.
- Add micro-interactions (hover scales, transitions, smooth scrolling).
- Use a cohesive color palette (dark mode preferred).
- Make every section visually distinct and polished."""
    elif "instant" in res_lower or "8b" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at fast, clean MVPs.
- Keep to 1-3 files maximum. Single App.jsx is fine for minimal.
- Focus on ONE core feature working perfectly.
- Use inline styles or a single CSS file — avoid complex setups.
- Ensure the app renders immediately with visible content.
- Include at least 3-5 items of realistic sample data."""
    elif "versatile" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at balanced, reliable apps.
- Build 3-5 well-structured components with clear responsibilities.
- Implement proper useState for all interactive features.
- Include a header/nav, main content area, and footer.
- Use consistent styling throughout all components.
- Make all buttons and inputs functional."""
    elif "qwen2.5-72b" in res_lower or "qwen-2.5" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at code-heavy architecture.
- Build proper component hierarchy with clear data flow.
- Use Context API or prop drilling correctly.
- Implement complete CRUD operations with useState.
- Add filtering, sorting, or search functionality.
- Write clean, DRY code with reusable utility functions."""
    elif "qwen" in res_lower and "32b" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at reasoning and logic.
- Build dashboard-style apps with computed metrics.
- Implement data transformations, aggregations, charts-ready data.
- Add workflow steps, status tracking, or state machines.
- Include smart defaults and intelligent form validation.
- Make the app feel like a productivity tool."""
    elif "scout" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at modern UI + fast output.
- Use modern card-based layouts with clean grid systems.
- Add smooth transitions between states.
- Use contemporary design patterns (floating labels, skeleton loaders).
- Include responsive breakpoints.
- Make the app feel trendy and current."""
    elif "mistral" in res_lower or "nemo" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: You excel at clean, readable code.
- Use descriptive component and variable names.
- Keep each component focused on one responsibility.
- Add JSDoc-style comments for complex logic.
- Use consistent patterns across all files.
- Make the codebase easy to understand and extend."""
    elif "gemma" in res_lower or "lite" in res_lower:
        model_opt = """LEVERAGE YOUR STRENGTHS: Keep it simple and polished.
- Build a single-page app with maximum 2 files.
- Focus on beautiful styling over feature count.
- Use gradients, shadows, and modern CSS.
- Include minimal but working interactivity.
- Make it look premium despite small scope."""
        
    base = f"Create a world-class, premium React application for: '{idea}'."
    if model_opt:
        base += f"\n\nMODEL-SPECIFIC OPTIMIZATION TARGET:\n{model_opt}"
    
    if complexity == "minimal":
        return f"""{base} Goal: Build a fast, lightweight Single-Page Application using React with hooks (useState, useEffect).
MUST include at minimum:
- src/App.jsx (main component with ALL UI and logic using useState/useEffect hooks, export default function App)
- src/App.css (styles — use modern dark theme with gradients)
Use Tailwind CSS classes for layout. Make the UI beautiful with proper spacing, colors, hover effects.
All business logic (CRUD operations, state, filters) must be fully implemented with React hooks.
Do NOT output plain HTML files. Output React JSX components ONLY.{features_context}"""
    elif complexity == "standard":
        return f"""{base} Goal: Build a structured multi-component React app (4-8 files).
MUST include:
- src/App.jsx (root component with routing/layout)
- src/components/*.jsx (modular child components, each with export default)
- src/App.css (global styles)
Include attractive dashboard UI, modular components, reusable logic, and proper local state management with useState/useEffect.
Every component must use React hooks and export default. No placeholders. All features must have real working logic.{features_context}"""
    else:
        return f"""{base} Goal: Build an elite, production-grade React architecture (6-10 files).
MUST include:
- src/App.jsx (root with context providers and layout)
- src/components/*.jsx (Dashboard, Sidebar, Header, Forms, Tables, etc.)
- src/context/*.jsx (AuthContext or AppContext with createContext)
- src/App.css (premium styles)
Include scalable folder structure, premium dashboard UI with charts/forms/tables, and deep business logic.
Make it look like a multi-million-dollar SaaS product. NO PLACEHOLDERS. Every file must be complete.{features_context}"""

def route_to_provider(model_id: str, complexity: str, prompt: str = ""):
    """Map a frontend model ID to a concrete provider API model and endpoint."""
    # ── Check Gemini models ──
    if model_id in GEMINI_MODEL_REGISTRY:
        return {
            "url": "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            "token": GOOGLE_API_KEY, "model": GEMINI_MODEL_REGISTRY[model_id], "provider": "gemini"
        }
    # ── Check HuggingFace models ──
    if model_id in HUGGINGFACE_MODEL_REGISTRY:
        return {
            "url": "https://router.huggingface.co/v1/chat/completions",
            "token": HUGGINGFACE_API_KEY, "model": HUGGINGFACE_MODEL_REGISTRY[model_id], "provider": "huggingface"
        }
    # ── Check Cerebras models ──
    if model_id in CEREBRAS_MODEL_REGISTRY:
        return {
            "url": "https://api.cerebras.ai/v1/chat/completions",
            "token": CEREBRAS_API_KEY, "model": CEREBRAS_MODEL_REGISTRY[model_id], "provider": "cerebras"
        }

    # ── Keyword-Based Auto Routing Logic ──
    if model_id == "auto":
        lower = prompt.lower()
        if any(k in lower for k in ["landing", "portfolio", "marketing"]):
            groq_model = "llama-3.1-8b-instant"
        elif any(k in lower for k in ["backend", "auth", "api", "database"]):
            if HUGGINGFACE_API_KEY:
                return {"url": "https://router.huggingface.co/v1/chat/completions", "token": HUGGINGFACE_API_KEY, "model": HUGGINGFACE_MODEL_REGISTRY["hf-qwen-2.5-72b"], "provider": "huggingface"}
            groq_model = "llama-3.3-70b-versatile"
        elif any(k in lower for k in ["automation", "workflow", "ai tool", "agent"]):
            if CEREBRAS_API_KEY:
                return {"url": "https://api.cerebras.ai/v1/chat/completions", "token": CEREBRAS_API_KEY, "model": CEREBRAS_MODEL_REGISTRY["cerebras-qwen-3-32b"], "provider": "cerebras"}
            groq_model = "llama-3.3-70b-versatile"
        elif any(k in lower for k in ["clean", "structured", "refactor"]):
            if HUGGINGFACE_API_KEY:
                return {"url": "https://router.huggingface.co/v1/chat/completions", "token": HUGGINGFACE_API_KEY, "model": HUGGINGFACE_MODEL_REGISTRY["hf-mistral-nemo"], "provider": "huggingface"}
            groq_model = "llama-3.1-8b-instant"
        elif any(k in lower for k in ["small", "basic", "simple", "tiny"]):
            groq_model = "gemma2-9b-it"
        else:
            # Default fallback for Full App / Dashboard / SaaS
            groq_model = "llama-3.3-70b-versatile"
    else:
        model_id = model_id.lower()
        groq_model = GROQ_MODEL_REGISTRY.get(model_id)
        if not groq_model:
            all_groq_ids = set(GROQ_MODEL_REGISTRY.values())
            groq_model = model_id if model_id in all_groq_ids else "llama-3.3-70b-versatile"

    return {"url": "https://api.groq.com/openai/v1/chat/completions", "token": GROQ_API_KEY, "model": groq_model, "provider": "groq"}



def classify_prompt(prompt: str) -> str:
    """Analyze prompt to pick the best normal mode for Auto routing."""
    lower = prompt.lower()
    ui_keywords = ["ui", "design", "beautiful", "landing page", "portfolio", "animation", "css", "theme", "stylish", "creative", "visual", "gradient", "aesthetic"]
    power_keywords = ["complex", "enterprise", "multi-tenant", "microservice", "scalable", "advanced", "production", "auth", "database", "api", "backend", "full-stack", "real-time", "websocket"]
    fast_keywords = ["simple", "hello world", "basic", "quick", "minimal", "tiny", "small", "test"]

    ui_score = sum(1 for k in ui_keywords if k in lower)
    power_score = sum(1 for k in power_keywords if k in lower)
    fast_score = sum(1 for k in fast_keywords if k in lower)

    if fast_score > ui_score and fast_score > power_score:
        return "fast"
    if ui_score >= 2 or (ui_score > power_score):
        return "creative-ui"
    if power_score >= 2:
        return "powerful"
    return "balanced"


def route_normal_mode(mode_label: str, complexity: str, prompt: str = ""):
    """Route based on Normal Mode labels (Auto/Fast/Balanced/Powerful/Creative UI)."""
    if mode_label == "auto":
        mode_label = classify_prompt(prompt)
        print(f"[AUTO-MODE] Prompt classified as: {mode_label}")

    if mode_label == "fast":
        return route_to_provider("auto", "minimal")  # Groq instant

    if mode_label == "balanced":
        return route_to_provider("auto", complexity)  # Groq versatile

    if mode_label == "powerful":
        if CEREBRAS_API_KEY:
            return route_to_provider("cerebras-llama-3.3-70b", complexity)
        if GOOGLE_API_KEY:
            return route_to_provider("gemini-2.5-flash", complexity)
        return route_to_provider("auto", complexity)  # Groq fallback

    if mode_label == "creative-ui":
        if GOOGLE_API_KEY:
            return route_to_provider("gemini-2.5-flash", complexity)
        return route_to_provider("auto", complexity)  # Groq fallback

    return route_to_provider("auto", complexity)


def get_provider_availability() -> dict:
    """Return which providers are available based on API key presence."""
    return {
        "groq": bool(GROQ_API_KEY),
        "gemini": bool(GOOGLE_API_KEY),
        "huggingface": bool(HUGGINGFACE_API_KEY),
        "cerebras": bool(CEREBRAS_API_KEY),
    }

def extract_json(raw_content: str) -> dict:
    # Clean possible trailing texts
    raw_content = raw_content.strip()
    
    def try_parse(text):
        text = text.strip()
        try:
            return json.loads(text, strict=False)
        except json.JSONDecodeError as e:
            # Auto-fix trailing commas
            fixed_text = re.sub(r',\s*([\]}])', r'\1', text)
            try:
                return json.loads(fixed_text, strict=False)
            except:
                pass
            raise e
            
    # Strategy 1: Natively valid JSON (no markdown, no text)
    try:
        return try_parse(raw_content)
    except:
        pass
    
    # Strategy 2: Extract from ```json or ``` block
    blocks = re.findall(r'```(?:json)?\s*(.*?)\s*```', raw_content, re.DOTALL)
    if blocks:
        # Search backwards in case there are multiple code blocks (usually the last one is the JSON)
        for block in reversed(blocks):
            try:
                if "{" in block:
                    return try_parse(block)
            except:
                continue

    # Strategy 2.5: Unclosed markdown block
    match = re.search(r'```(?:json)?\s*(\{.*)', raw_content, re.DOTALL)
    if match:
        try:
            text = match.group(1)
            last_brace = text.rfind('}')
            if last_brace != -1:
                return try_parse(text[:last_brace+1])
            return try_parse(text)
        except:
            pass

    # Strategy 3: Find the signature JSON block directly (avoiding early `{` braces from text planning)
    match = re.search(r'(\{\s*"(?:project_name|files)".*\})', raw_content, re.DOTALL)
    if match:
        try:
            return try_parse(match.group(1))
        except:
            pass
            
    # Strategy 4: Ultimate aggressive fallback: from FIRST { to LAST }
    first_brace = raw_content.find('{')
    last_brace = raw_content.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            return try_parse(raw_content[first_brace:last_brace+1])
        except:
            pass
            
    raise ValueError("Could not extract valid JSON output from provider response.")


async def _execute_provider_call(provider, messages):
    # Base headers
    headers = {
        "Authorization": f"Bearer {provider['token']}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": provider["model"],
        "messages": messages,
        "temperature": 0.3
    }

    async with httpx.AsyncClient() as client:
        try:
            print(f"[DEBUG] -> Calling Provider: {provider['provider']} | Model: {provider['model']}")
            
            response = await client.post(
                provider["url"],
                headers=headers,
                json=payload,
                timeout=45.0
            )

            if response.status_code == 401:
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": "401 Invalid API Key"}
            elif response.status_code == 429:
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": "429 Rate limit exceeded"}
            elif response.status_code != 200:
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": f"HTTP {response.status_code}: {response.text[:100]}"}

            data = response.json()
            
            # ── Null-safe raw_content extraction ──
            choices = data.get("choices") or []
            if not choices or not isinstance(choices, list) or len(choices) == 0:
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": "Empty choices array from provider"}
            
            message = choices[0].get("message") or {}
            raw_content = message.get("content")
            
            if not raw_content or not isinstance(raw_content, str):
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": "Provider returned empty/null content"}
                
            try:
                json_payload = extract_json(raw_content)
                
                # ── Null-safe Code Sanitization & Format Mapping ──
                sanitized_files = []
                files_payload = json_payload.get("files", [])
                
                if isinstance(files_payload, dict):
                    if "code" not in files_payload and "path" not in files_payload:
                        files_payload = [{"path": k, "code": v} for k, v in files_payload.items()]
                    else:
                        files_payload = [files_payload]
                elif not isinstance(files_payload, list):
                    if "code" in json_payload:
                        files_payload = [json_payload]
                    else:
                        files_payload = []

                for f in files_payload:
                    # Skip completely invalid entries
                    if not f or not isinstance(f, dict):
                        continue
                    
                    # Ensure path exists and is a string
                    file_path = f.get("path")
                    if not file_path or not isinstance(file_path, str):
                        continue
                    f["path"] = file_path.strip()
                    
                    # Normalize "content" -> "code" mapping
                    if "content" in f and "code" not in f:
                        f["code"] = f["content"]
                    
                    # Guard code against None/non-string values
                    code_val = f.get("code")
                    if code_val is None or not isinstance(code_val, str):
                        f["code"] = ""
                    else:
                        # Strip broken code fences that LLMs sometimes inject
                        c = str(code_val)
                        if c.startswith("```") and "```" in c[3:]:
                            c = re.sub(r'^```[a-zA-Z]*\n?', '', c)
                            c = re.sub(r'\n?```$', '', c)
                        c = c.replace("```javascript", "").replace("```jsx", "").replace("```tsx", "").replace("```python", "").replace("```json", "").replace("```html", "").replace("```css", "").replace("```yaml", "").replace("```", "")
                        f["code"] = c.strip()
                    
                    sanitized_files.append(f)
                        
                return {
                    "success": True,
                    "provider": provider["provider"],
                    "model": provider["model"],
                    "files": sanitized_files
                }
            except Exception as e:
                snippet = raw_content[:200] if raw_content else "(empty)"
                print(f"[ERROR] Parser fail body snippet: {snippet}")
                return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": f"Parsing Failed: {str(e)}"}
        
        except httpx.ReadTimeout:
            print(f"[ERROR] Provider timeout for {provider['provider']}")
            return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": "Timeout"}
        except Exception as e:
            print(f"[ERROR] Exception during {provider['provider']} call: {str(e)}")
            return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": str(e)}

def validate_and_repair_react(files: list) -> tuple:
    """
    Validates generated files and auto-repairs common React issues.
    Returns (is_valid: bool, reason: str, repaired_files: list, quality_score: int).
    quality_score: 0-100, used to decide if retry with enhanced prompt is needed.
    """
    if not files or not isinstance(files, list):
        return False, "No files generated", files, 0
    
    valid_files = [f for f in files if f and isinstance(f, dict)]
    if not valid_files:
        return False, "Files array is empty or malformed", valid_files, 0
        
    app_jsx = next((f for f in valid_files if f.get("path") in ["src/App.jsx", "src/main.jsx", "App.jsx"]), None)
    
    if not app_jsx:
        return False, "Missing App.jsx entry point", valid_files, 0
        
    code = str(app_jsx.get("code", ""))
    if not code.strip():
        return False, "App.jsx is empty", valid_files, 0

    code_length = sum(len(str(f.get("code", "") or "")) for f in valid_files)
    if code_length < 150:
        return False, f"Output too short ({code_length} chars). Probable truncation.", valid_files, 5

    # Placeholders check
    concatenated_code = " ".join([str(f.get("code", "") or "") for f in valid_files]).lower()
    placeholders = ["// todo", "/* todo", "<!-- todo", "insert code here", "rest of code", "logic goes here", "implement later", "real runnable code here", "sample code only", "content goes here", "attach webcontainer", "add your", "replace with"]
    if any(p in concatenated_code for p in placeholders):
        return False, "Placeholder found in code.", valid_files, 10

    # Phase 2: React Safety Checks
    has_return = any(x in code for x in ["return ", "return(", "return<", "return\n", "=> (", "=><", "=> <"])
    if not has_return:
        return False, "App.jsx missing return statement.", valid_files, 15
    
    if "<" not in code:
        return False, "App.jsx missing visible JSX.", valid_files, 15

    # Phase 2.5: JSX Balance Check
    jsx_files_code = " ".join([str(f.get("code", "")) for f in valid_files if str(f.get("path", "")).endswith((".jsx", ".tsx"))])
    open_tags = len(re.findall(r'<[A-Za-z][^/]*?>', jsx_files_code))
    close_tags = len(re.findall(r'</[A-Za-z][^>]*>', jsx_files_code))
    self_close = len(re.findall(r'<[A-Za-z][^>]*/\s*>', jsx_files_code))
    if open_tags > 0 and close_tags == 0 and self_close == 0:
        return False, "JSX tags severely unbalanced — no closing tags found.", valid_files, 20

    # Phase 2.6: Check for plain text outside JSX (common bad output)
    lines = code.split('\n')
    non_code_lines = 0
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith(('import ', 'export ', 'const ', 'let ', 'var ', 'function ', 'return', '//', '/*', '*', '<', '{', '}', '(', ')', ']', '[', '.', "'", '"', '`')):
            if len(stripped) > 40 and not any(c in stripped for c in ['=', ';', ':', '=>', '{', '}', '<', '>', '(', ')']):
                non_code_lines += 1
    if non_code_lines > 5:
        return False, f"App.jsx contains {non_code_lines} lines of plain text — not valid code.", valid_files, 15

    # Phase 3: Auto Repair Common Errors
    repaired_files = []
    for f in valid_files:
        path = f.get("path", "")
        fcode = str(f.get("code", ""))
        
        if path.endswith(".jsx") or path.endswith(".js"):
            # 1. Missing import React
            if "React" not in fcode and ("useState" in fcode or "useEffect" in fcode or "<" in fcode):
                if "import React" not in fcode and "import { React" not in fcode:
                    fcode = "import React, { useState, useEffect } from 'react';\n" + fcode
            
            # 2. Missing hook imports
            if "useState" in fcode and "import" in fcode and "useState" not in fcode.split('\n')[0] and "{ useState" not in fcode[:200]:
                fcode = re.sub(r"import React from 'react'", "import React, { useState, useEffect } from 'react'", fcode)
            
            # 3. Bad className mapping
            fcode = fcode.replace(" class=", " className=")
            
            # 4. Missing export default in App.jsx
            if path in ["src/App.jsx", "App.jsx"]:
                if "export default" not in fcode:
                    if "function App" in fcode:
                        fcode = fcode.replace("function App", "export default function App")
                    elif "const App" in fcode:
                        fcode += "\nexport default App;\n"
                    elif "export default" not in fcode:
                        fcode += "\nexport default App;\n"
            
            # 5. Fix unclosed JSX self-closing tags
            fcode = re.sub(r'<(img|input|br|hr|meta|link)(\s[^>]*?)(?<!/)>', r'<\1\2 />', fcode)
        
        f["code"] = fcode
        repaired_files.append(f)

    # Phase 4: Quality Score
    score = 30  # base
    if code_length > 500: score += 10
    if code_length > 1500: score += 10
    if code_length > 3000: score += 10
    if len(valid_files) >= 2: score += 5
    if len(valid_files) >= 4: score += 5
    if "useState" in concatenated_code: score += 5
    if "useEffect" in concatenated_code: score += 5
    if "className" in concatenated_code: score += 5
    if any(x in concatenated_code for x in ["hover", "transition", "animation", "gradient"]): score += 5
    if any(x in concatenated_code for x in ["onclick", "onchange", "onsubmit", "onclick", "handleclick", "handlechange"]): score += 5
    if "flex" in concatenated_code or "grid" in concatenated_code: score += 5
    score = min(score, 100)

    return True, "Valid", repaired_files, score

async def generate_app(idea: str, stack: str, complexity: str, model_id: str, detected_features: list = None, stack_reason: str = "", preferences: dict = None, normal_mode: str = ""):
    # ── Normal Mode routing (if frontend sends a mode label) ──
    if normal_mode and normal_mode in ("auto", "fast", "balanced", "powerful", "creative-ui"):
        provider = route_normal_mode(normal_mode, complexity, idea)
        print(f"[NORMAL-MODE] Routed '{normal_mode}' → {provider['provider']}:{provider['model']}")
    else:
        provider = route_to_provider(model_id, complexity, idea)

    # ── Auto-Advanced: override with strongest active model ──
    if model_id == "auto" and complexity == "advanced" and not normal_mode:
        try:
            active = await check_groq_models()
            for candidate in STRONGEST_MODEL_ORDER:
                if candidate in active:
                    provider["model"] = candidate
                    print(f"[AUTO] Advanced complexity → strongest active: {candidate}")
                    break
        except Exception:
            pass

    if not provider["token"]:
        return {"success": False, "provider": provider['provider'], "model": provider['model'], "error": f"Missing API Key for {provider['provider']}"}

    # SMART RETRY LOGIC (Phase 7): Attempt generation up to 3 times with fallback models
    # Retry order: Original -> gemini-2.5-flash -> llama-3.3-70b-versatile -> hf-qwen-2.5-72b
    retry_chain = [provider]
    if GOOGLE_API_KEY:
        retry_chain.append({"url": "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", "token": GOOGLE_API_KEY, "model": "gemini-2.5-flash", "provider": "gemini"})
    retry_chain.append({"url": "https://api.groq.com/openai/v1/chat/completions", "token": GROQ_API_KEY, "model": "llama-3.3-70b-versatile", "provider": "groq"})
    if HUGGINGFACE_API_KEY:
        retry_chain.append({"url": "https://router.huggingface.co/v1/chat/completions", "token": HUGGINGFACE_API_KEY, "model": "Qwen/Qwen2.5-72B-Instruct", "provider": "huggingface"})
    
    # Dedup the chain keeping order
    seen = set()
    unique_chain = []
    for p in retry_chain:
        if p["model"] not in seen:
            seen.add(p["model"])
            unique_chain.append(p)
            
    # Cap to max 3 attempts
    unique_chain = unique_chain[:3]
    
    result = None
    last_quality_score = 0
    for attempt, current_provider in enumerate(unique_chain):
        print(f"\n[BUILD ATTEMPT {attempt+1}/{len(unique_chain)}] Using {current_provider['provider']}:{current_provider['model']}")
        
        # Build model-specific system prompt
        model_sys_prompt = get_model_system_prompt(current_provider["model"])
        full_system = model_sys_prompt + GLOBAL_OUTPUT_RULES
        
        user_prompt = get_mode_prompt(idea, stack, complexity, detected_features, stack_reason, preferences, current_provider["model"])
        
        if attempt > 0:
            full_system += f"\n\nCRITICAL RETRY: Previous attempt failed (score={last_quality_score}/100). You MUST output a COMPLETE, VALID React application. Ensure your JSON starts with {{ and ends with }}. Include real content, real styling, real interactivity. No shortcuts."
            user_prompt += "\n\nIMPORTANT: Previous generation was rejected. Make this output SIGNIFICANTLY better: more code, more features, better UI, complete implementation."
            
        messages = [
            {"role": "system", "content": full_system},
            {"role": "user", "content": user_prompt}
        ]
            
        result = await _execute_provider_call(current_provider, messages)
        
        if result.get("success"):
            is_valid, reason, repaired_files, quality_score = validate_and_repair_react(result.get("files", []))
            last_quality_score = quality_score
            print(f"[QUALITY] Score: {quality_score}/100 | Valid: {is_valid} | Reason: {reason}")
            
            if is_valid and quality_score >= 30:
                result["files"] = repaired_files
                result["quality_score"] = quality_score
                return result
            elif is_valid and quality_score < 30:
                print(f"[QUALITY] Output too weak (score {quality_score}). Retrying with enhanced prompt...")
                result["success"] = False
                result["error"] = f"Output quality too low (score: {quality_score}/100)"
            else:
                print(f"[DEBUG] Generation failed quality check! Reason: {reason}")
                result["success"] = False
                result["error"] = f"Validation Failed: {reason}"
        else:
            print(f"[DEBUG] API Call failed: {result.get('error')}")
            last_quality_score = 0

    # ------------------------------
    # 5. MINIMAL FALLBACK (if all retries failed)
    # ------------------------------
    print(f"[DEBUG] ALL BUILD ATTEMPTS FAILED! Returning minimal starter fallback.")
    return {
        "success": True,
        "provider": provider["provider"],
        "model": provider["model"],
        "project_name": "fallback-app",
        "files": [
            {
                "path": "src/App.jsx",
                "code": "import React from 'react';\nimport './App.css';\n\nexport default function App() {\n  return (\n    <div className=\"app-container\">\n      <h1>App Generation Failed</h1>\n      <p>The AI failed to generate valid code after 3 attempts.</p>\n    </div>\n  );\n}"
            },
            {
                "path": "src/App.css",
                "code": ".app-container { padding: 40px; font-family: sans-serif; text-align: center; color: white; background: #111; min-height: 100vh; }"
            }
        ],
        "preview": {}
    }
