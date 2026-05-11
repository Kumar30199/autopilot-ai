"""
AutoPilot AI — Requirement Analyzer (Hard Agent Decision Engine)

Analyzes a raw app idea string and returns:
  - Detected features / requirements
  - Recommended tech stack
  - Reasoning for the selection
  - Suggested complexity level

Uses fast, local keyword-based classification (no API cost, instant response).
"""

import re
from typing import Dict, List, Any


# ═══════════════════════════════════════════════════════════════
# FEATURE DETECTION RULES
# Each rule: (feature_id, display_label, category, keywords[])
# ═══════════════════════════════════════════════════════════════
FEATURE_RULES = [
    # ── Core Web Features ──
    ("landing_page",   "Landing Page",        "basic",    ["landing page", "portfolio", "personal site", "homepage", "hero section", "one page", "single page", "brochure"]),
    ("static_site",    "Static Website",       "basic",    ["static", "informational", "company website", "business site"]),
    ("blog",           "Blog / Content",       "content",  ["blog", "article", "content management", "cms", "publishing", "posts", "magazine", "news"]),
    ("seo",            "SEO Required",         "content",  ["seo", "search engine", "meta tags", "sitemap", "server-side render", "ssr", "server side"]),
    
    # ── Dashboard / Admin ──
    ("dashboard",      "Dashboard",            "data",     ["dashboard", "admin panel", "control panel", "analytics", "monitoring", "metrics", "overview", "reporting", "stats"]),
    ("crud",           "CRUD Operations",      "data",     ["crud", "create read update delete", "data management", "records", "entries", "manage items", "add edit delete", "form submission"]),
    ("tables",         "Data Tables",          "data",     ["table", "data grid", "spreadsheet", "list view", "sortable", "filterable", "pagination"]),
    
    # ── Authentication & Users ──
    ("auth",           "Authentication",       "security", ["login", "signup", "sign up", "sign in", "register", "authentication", "auth", "password", "session", "oauth", "sso", "google login", "jwt", "token"]),
    ("user_mgmt",      "User Management",      "security", ["user profile", "account", "user management", "roles", "permissions", "admin user", "user settings"]),
    
    # ── Payments & Commerce ──
    ("payments",       "Payments",             "commerce", ["payment", "stripe", "checkout", "billing", "subscription", "pricing", "plan", "invoice", "paypal", "credit card"]),
    ("ecommerce",      "E-Commerce",           "commerce", ["ecommerce", "e-commerce", "shop", "store", "product", "cart", "order", "catalog", "inventory", "marketplace"]),
    
    # ── Realtime & Communication ──
    ("realtime",       "Realtime Features",    "advanced", ["realtime", "real-time", "real time", "live", "websocket", "socket", "push notification", "live update"]),
    ("chat",           "Chat / Messaging",     "advanced", ["chat", "messaging", "message", "conversation", "inbox", "direct message", "dm"]),
    ("collaboration",  "Collaboration",        "advanced", ["collaboration", "collaborative", "shared", "team", "workspace", "multi-user", "concurrent"]),
    ("notifications",  "Notifications",        "advanced", ["notification", "alert", "reminder", "push"]),
    
    # ── AI & Data Science ──
    ("ai",             "AI Integration",       "ai",       ["ai", "artificial intelligence", "machine learning", "ml", "gpt", "llm", "chatbot", "openai", "neural", "model training", "nlp", "computer vision", "deep learning"]),
    ("data_science",   "Data / ML Tools",      "ai",       ["data analysis", "data science", "pandas", "numpy", "jupyter", "visualization", "chart", "graph", "plot", "statistics"]),
    ("automation",     "Automation",           "ai",       ["automation", "automate", "script", "cron", "scheduled", "pipeline", "workflow engine", "batch"]),
    
    # ── Database & API ──
    ("database",       "Database",             "infra",    ["database", "db", "mongodb", "postgres", "mysql", "sqlite", "storage", "persistent", "data store", "sql", "nosql"]),
    ("api",            "REST / API",           "infra",    ["api", "rest", "endpoint", "backend", "server", "microservice", "graphql"]),
    ("external_api",   "External APIs",        "infra",    ["third party", "3rd party", "external api", "integration", "webhook", "api integration", "fetch data from"]),
    ("file_upload",    "File Upload",          "infra",    ["file upload", "image upload", "attachment", "media upload", "document upload", "drag and drop file"]),
    
    # ── Mobile & Scale ──
    ("mobile_first",   "Mobile-First Design",  "ux",       ["mobile", "responsive", "mobile-first", "pwa", "progressive web app", "touch", "swipe"]),
    ("enterprise",     "Enterprise Scale",     "scale",    ["enterprise", "large scale", "scalable", "microservices", "distributed", "high availability", "load balancing", "kubernetes", "docker"]),
    
    # ── Specialized ──
    ("maps",           "Maps / Location",      "special",  ["map", "location", "geolocation", "gps", "directions", "places"]),
    ("search",         "Search",               "special",  ["search", "full text search", "elastic", "algolia", "filter"]),
    ("social",         "Social Features",      "special",  ["social", "follow", "like", "comment", "share", "feed", "timeline", "friends"]),
    ("calendar",       "Calendar / Scheduling","special",  ["calendar", "schedule", "booking", "appointment", "event", "date picker"]),
    ("email",          "Email",                "special",  ["email", "newsletter", "mail", "sendgrid", "smtp"]),
]


# ═══════════════════════════════════════════════════════════════
# AUTO STACK SELECTION RULES
# Priority-ordered: first match wins
# ═══════════════════════════════════════════════════════════════
STACK_RULES = [
    {
        "id": "flask_ml",
        "stack": "Flask",
        "label": "Flask (Python)",
        "match": lambda feats: any(f in feats for f in ["data_science", "automation"]) and "ai" in feats,
        "reason": "Python automation and machine learning tools detected — Flask provides the best ecosystem for data science with pandas, scikit-learn, and Jupyter integration.",
    },
    {
        "id": "flask_python",
        "stack": "Flask",
        "label": "Flask (Python)",
        "match": lambda feats: any(f in feats for f in ["data_science", "automation"]) and not any(f in feats for f in ["dashboard", "auth", "ecommerce"]),
        "reason": "Python-centric tooling requirements detected — Flask is ideal for lightweight Python automation and data processing.",
    },
    {
        "id": "mern_realtime",
        "stack": "MERN",
        "label": "MERN + Socket.IO",
        "match": lambda feats: any(f in feats for f in ["realtime", "chat", "collaboration"]),
        "reason": "Realtime features like chat, live updates, or collaboration detected — MERN Stack with Socket.IO provides the best realtime infrastructure with Node.js event-driven architecture.",
    },
    {
        "id": "nextjs_seo",
        "stack": "Next.js",
        "label": "Next.js (SSR)",
        "match": lambda feats: any(f in feats for f in ["seo", "blog"]) and not any(f in feats for f in ["dashboard", "auth", "crud"]),
        "reason": "SEO-critical content platform detected — Next.js with server-side rendering provides optimal search engine visibility and fast page loads.",
    },
    {
        "id": "nextjs_ai_saas",
        "stack": "Next.js",
        "label": "Next.js + Node API",
        "match": lambda feats: "ai" in feats and any(f in feats for f in ["api", "payments", "auth"]),
        "reason": "AI SaaS product with API and business logic detected — Next.js with API routes provides a unified full-stack framework ideal for AI-powered startup products.",
    },
    {
        "id": "enterprise",
        "stack": "MERN",
        "label": "Modular Full Stack",
        "match": lambda feats: "enterprise" in feats,
        "reason": "Enterprise-scale system detected — Modular Full Stack architecture with MERN provides the scalable, maintainable foundation needed for large systems.",
    },
    {
        "id": "mern_dashboard",
        "stack": "MERN",
        "label": "MERN Stack",
        "match": lambda feats: any(f in feats for f in ["dashboard", "crud", "auth", "user_mgmt", "ecommerce", "payments"]),
        "reason": "Dashboard, CRUD operations, and/or authentication detected — MERN Stack (MongoDB, Express, React, Node.js) is the proven architecture for data-driven web applications with user management.",
    },
    {
        "id": "react_landing",
        "stack": "MERN",
        "label": "React + Vite",
        "match": lambda feats: any(f in feats for f in ["landing_page", "static_site"]) and len(feats) <= 3,
        "reason": "Landing page or static website detected with minimal backend needs — React with Vite provides the fastest development experience for beautiful, interactive frontends.",
    },
    {
        "id": "mern_default",
        "stack": "MERN",
        "label": "MERN Stack",
        "match": lambda feats: True,  # Always matches — final fallback
        "reason": "Based on the requirements analysis, MERN Stack provides the most versatile full-stack foundation — React for the UI, Express/Node for the API, and MongoDB for flexible data storage.",
    },
]


# ═══════════════════════════════════════════════════════════════
# COMPLEXITY AUTO-DETECTION
# ═══════════════════════════════════════════════════════════════

def _detect_complexity(features: List[str]) -> str:
    """Auto-detect appropriate complexity based on feature count and types."""
    advanced_signals = {"enterprise", "realtime", "collaboration", "payments", "ai", "data_science"}
    standard_signals = {"dashboard", "crud", "auth", "user_mgmt", "ecommerce", "api", "database", "chat", "notifications"}
    
    has_advanced = len(set(features) & advanced_signals)
    has_standard = len(set(features) & standard_signals)
    
    if has_advanced >= 2 or len(features) >= 7:
        return "advanced"
    elif has_standard >= 2 or len(features) >= 4:
        return "standard"
    else:
        return "minimal"


# ═══════════════════════════════════════════════════════════════
# MAIN ANALYSIS FUNCTION
# ═══════════════════════════════════════════════════════════════

def analyze_requirements(idea: str, force_stack: str = None) -> Dict[str, Any]:
    """
    Analyze an app idea and return detected features, recommended stack,
    complexity assessment, and reasoning.

    Args:
        idea:        Raw text description of the app idea.
        force_stack: Optional — if provided, overrides the auto-selected stack.

    Returns:
        {
            "features":          [{"id": "auth", "label": "Authentication", "category": "security"}, ...],
            "feature_ids":       ["auth", "dashboard", ...],
            "recommended_stack": "MERN",
            "stack_label":       "MERN Stack",
            "stack_reason":      "Dashboard and auth detected...",
            "complexity":        "standard",
            "is_overridden":     False,
            "project_name":      "task-manager-app"
        }
    """
    if not idea or not isinstance(idea, str):
        return _fallback_result(idea, force_stack)
    
    idea_lower = idea.lower().strip()
    
    # ── Step 1: Detect Features ──
    detected = []
    for feat_id, label, category, keywords in FEATURE_RULES:
        for kw in keywords:
            if kw in idea_lower:
                detected.append({"id": feat_id, "label": label, "category": category})
                break  # Only match once per feature rule

    feature_ids = [f["id"] for f in detected]
    
    # ── Step 2: If no features detected, infer from general language ──
    if not feature_ids:
        # Try to infer basic features from generic descriptions
        if any(w in idea_lower for w in ["app", "application", "platform", "system", "tool"]):
            detected.append({"id": "crud", "label": "CRUD Operations", "category": "data"})
            detected.append({"id": "api", "label": "REST / API", "category": "infra"})
            feature_ids = [f["id"] for f in detected]

    # ── Step 3: Select Stack ──
    is_overridden = False
    if force_stack and force_stack.strip():
        # User explicitly requested a stack — respect that
        recommended_stack = force_stack.strip()
        stack_label = force_stack.strip()
        stack_reason = f"User explicitly selected {force_stack} — respecting user preference."
        is_overridden = True
    else:
        # Auto-select using priority rules
        recommended_stack = "MERN"
        stack_label = "MERN Stack"
        stack_reason = "Default full-stack selection."
        
        for rule in STACK_RULES:
            if rule["match"](feature_ids):
                recommended_stack = rule["stack"]
                stack_label = rule["label"]
                stack_reason = rule["reason"]
                break

    # ── Step 4: Detect Complexity ──
    complexity = _detect_complexity(feature_ids)

    # ── Step 5: Generate project name ──
    project_name = _generate_project_name(idea)

    return {
        "features": detected,
        "feature_ids": feature_ids,
        "recommended_stack": recommended_stack,
        "stack_label": stack_label,
        "stack_reason": stack_reason,
        "complexity": complexity,
        "is_overridden": is_overridden,
        "project_name": project_name,
    }


def _fallback_result(idea: str, force_stack: str = None) -> Dict[str, Any]:
    """Return a safe default when the idea is empty or invalid."""
    return {
        "features": [],
        "feature_ids": [],
        "recommended_stack": force_stack or "MERN",
        "stack_label": force_stack or "MERN Stack",
        "stack_reason": "No clear requirements detected — defaulting to MERN Stack as the most versatile full-stack option.",
        "complexity": "standard",
        "is_overridden": bool(force_stack),
        "project_name": "new-app",
    }


def _generate_project_name(idea: str) -> str:
    """Generate a slug-style project name from the idea text."""
    if not idea:
        return "new-app"
    # Take first 4-5 meaningful words, slugify
    words = re.sub(r'[^a-zA-Z0-9\s]', '', idea.lower()).split()
    # Remove filler words
    stopwords = {"a", "an", "the", "with", "and", "or", "for", "to", "that", "this", "in", "on", "of", "is", "it", "my", "i", "we"}
    meaningful = [w for w in words if w not in stopwords and len(w) > 1][:4]
    if not meaningful:
        meaningful = words[:3]
    slug = "-".join(meaningful) if meaningful else "new-app"
    return slug[:40]  # Cap length
