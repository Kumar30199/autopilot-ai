"""Builder Agent — Scaffolds code, projects, and deployable artifacts."""

from __future__ import annotations
import time
import random
from typing import Any
from agents.base_agent import BaseAgent


# ── Stack-specific scaffolding data ──────────────────────────────
STACK_DATA = {
    "MERN": {
        "files": [
            {"path": "server/index.js",        "type": "file", "lang": "javascript"},
            {"path": "server/routes/api.js",    "type": "file", "lang": "javascript"},
            {"path": "server/models/User.js",   "type": "file", "lang": "javascript"},
            {"path": "server/middleware/auth.js","type": "file", "lang": "javascript"},
            {"path": "server/config/db.js",     "type": "file", "lang": "javascript"},
            {"path": "client/src/App.jsx",      "type": "file", "lang": "jsx"},
            {"path": "client/src/index.js",     "type": "file", "lang": "javascript"},
            {"path": "client/src/components/Dashboard.jsx", "type": "file", "lang": "jsx"},
            {"path": "client/src/hooks/useAuth.js",         "type": "file", "lang": "javascript"},
            {"path": "client/public/index.html","type": "file", "lang": "html"},
            {"path": "package.json",            "type": "file", "lang": "json"},
            {"path": ".env.example",            "type": "file", "lang": "env"},
            {"path": "README.md",               "type": "file", "lang": "markdown"},
        ],
        "structure": [
            {"name": "server/",   "type": "dir", "children": [
                {"name": "index.js",     "type": "file"},
                {"name": "routes/",      "type": "dir", "children": [{"name": "api.js", "type": "file"}]},
                {"name": "models/",      "type": "dir", "children": [{"name": "User.js", "type": "file"}]},
                {"name": "middleware/",  "type": "dir", "children": [{"name": "auth.js", "type": "file"}]},
                {"name": "config/",      "type": "dir", "children": [{"name": "db.js", "type": "file"}]},
            ]},
            {"name": "client/",   "type": "dir", "children": [
                {"name": "src/",  "type": "dir", "children": [
                    {"name": "App.jsx",       "type": "file"},
                    {"name": "index.js",      "type": "file"},
                    {"name": "components/",   "type": "dir", "children": [{"name": "Dashboard.jsx", "type": "file"}]},
                    {"name": "hooks/",        "type": "dir", "children": [{"name": "useAuth.js", "type": "file"}]},
                ]},
                {"name": "public/", "type": "dir", "children": [{"name": "index.html", "type": "file"}]},
            ]},
            {"name": "package.json",  "type": "file"},
            {"name": ".env.example",  "type": "file"},
            {"name": "README.md",     "type": "file"},
        ],
        "code_preview": {
            "filename": "server/index.js",
            "language": "javascript",
            "code": '''const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB Error:', err));

// Routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});'''
        },
        "instructions": [
            {"step": 1, "title": "Install Dependencies", "cmd": "npm install", "desc": "Installs Express, Mongoose, React, and all dependencies"},
            {"step": 2, "title": "Configure Environment", "cmd": "cp .env.example .env", "desc": "Copy env template and set MONGO_URI, JWT_SECRET"},
            {"step": 3, "title": "Start MongoDB", "cmd": "mongod --dbpath ./data", "desc": "Ensure MongoDB is running locally or use Atlas URI"},
            {"step": 4, "title": "Run Development Server", "cmd": "npm run dev", "desc": "Starts both Express backend and React frontend concurrently"},
            {"step": 5, "title": "Run Tests", "cmd": "npm test", "desc": "Executes the test suite with Jest"},
        ],
        "entry_point": "server/index.js",
        "dev_cmd": "npm run dev",
        "build_cmd": "npm run build",
        "test_cmd": "npm test",
    },

    "Next.js": {
        "files": [
            {"path": "app/layout.tsx",           "type": "file", "lang": "tsx"},
            {"path": "app/page.tsx",             "type": "file", "lang": "tsx"},
            {"path": "app/api/route.ts",         "type": "file", "lang": "typescript"},
            {"path": "app/dashboard/page.tsx",   "type": "file", "lang": "tsx"},
            {"path": "components/ui/Button.tsx", "type": "file", "lang": "tsx"},
            {"path": "components/ui/Card.tsx",   "type": "file", "lang": "tsx"},
            {"path": "lib/utils.ts",             "type": "file", "lang": "typescript"},
            {"path": "lib/db.ts",                "type": "file", "lang": "typescript"},
            {"path": "next.config.js",           "type": "file", "lang": "javascript"},
            {"path": "tailwind.config.ts",       "type": "file", "lang": "typescript"},
            {"path": "package.json",             "type": "file", "lang": "json"},
            {"path": "tsconfig.json",            "type": "file", "lang": "json"},
            {"path": ".env.local",               "type": "file", "lang": "env"},
            {"path": "README.md",                "type": "file", "lang": "markdown"},
        ],
        "structure": [
            {"name": "app/",        "type": "dir", "children": [
                {"name": "layout.tsx",   "type": "file"},
                {"name": "page.tsx",     "type": "file"},
                {"name": "api/",         "type": "dir",  "children": [{"name": "route.ts", "type": "file"}]},
                {"name": "dashboard/",   "type": "dir",  "children": [{"name": "page.tsx", "type": "file"}]},
            ]},
            {"name": "components/",  "type": "dir", "children": [
                {"name": "ui/", "type": "dir", "children": [
                    {"name": "Button.tsx", "type": "file"},
                    {"name": "Card.tsx",   "type": "file"},
                ]},
            ]},
            {"name": "lib/",         "type": "dir", "children": [
                {"name": "utils.ts",  "type": "file"},
                {"name": "db.ts",     "type": "file"},
            ]},
            {"name": "next.config.js",    "type": "file"},
            {"name": "tailwind.config.ts","type": "file"},
            {"name": "package.json",      "type": "file"},
            {"name": "tsconfig.json",     "type": "file"},
            {"name": ".env.local",        "type": "file"},
            {"name": "README.md",         "type": "file"},
        ],
        "code_preview": {
            "filename": "app/page.tsx",
            "language": "tsx",
            "code": '''import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-400 to-violet-400">
            Welcome to Your App
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Built with Next.js 14, TypeScript, and Tailwind CSS.
            Production-ready with API routes and authentication.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button variant="primary" href="/dashboard">
              Open Dashboard
            </Button>
            <Button variant="outline" href="/api">
              API Docs
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}'''
        },
        "instructions": [
            {"step": 1, "title": "Install Dependencies", "cmd": "npm install", "desc": "Installs Next.js, React, TypeScript, Tailwind CSS"},
            {"step": 2, "title": "Configure Environment", "cmd": "cp .env.local.example .env.local", "desc": "Set DATABASE_URL, NEXTAUTH_SECRET, API keys"},
            {"step": 3, "title": "Run Development", "cmd": "npm run dev", "desc": "Starts Next.js dev server with hot reload on port 3000"},
            {"step": 4, "title": "Build for Production", "cmd": "npm run build", "desc": "Creates optimized production build"},
            {"step": 5, "title": "Deploy", "cmd": "npx vercel deploy", "desc": "Deploy to Vercel or your preferred hosting platform"},
        ],
        "entry_point": "app/page.tsx",
        "dev_cmd": "npm run dev",
        "build_cmd": "npm run build",
        "test_cmd": "npm test",
    },

    "Flask": {
        "files": [
            {"path": "app/__init__.py",      "type": "file", "lang": "python"},
            {"path": "app/routes.py",        "type": "file", "lang": "python"},
            {"path": "app/models.py",        "type": "file", "lang": "python"},
            {"path": "app/auth.py",          "type": "file", "lang": "python"},
            {"path": "app/config.py",        "type": "file", "lang": "python"},
            {"path": "app/templates/base.html",  "type": "file", "lang": "html"},
            {"path": "app/templates/index.html", "type": "file", "lang": "html"},
            {"path": "app/static/css/style.css", "type": "file", "lang": "css"},
            {"path": "migrations/",          "type": "dir",  "lang": ""},
            {"path": "tests/test_routes.py", "type": "file", "lang": "python"},
            {"path": "requirements.txt",     "type": "file", "lang": "text"},
            {"path": "run.py",               "type": "file", "lang": "python"},
            {"path": ".env",                 "type": "file", "lang": "env"},
            {"path": "README.md",            "type": "file", "lang": "markdown"},
        ],
        "structure": [
            {"name": "app/",        "type": "dir", "children": [
                {"name": "__init__.py", "type": "file"},
                {"name": "routes.py",   "type": "file"},
                {"name": "models.py",   "type": "file"},
                {"name": "auth.py",     "type": "file"},
                {"name": "config.py",   "type": "file"},
                {"name": "templates/",  "type": "dir", "children": [
                    {"name": "base.html",  "type": "file"},
                    {"name": "index.html", "type": "file"},
                ]},
                {"name": "static/", "type": "dir", "children": [
                    {"name": "css/", "type": "dir", "children": [{"name": "style.css", "type": "file"}]},
                ]},
            ]},
            {"name": "migrations/",       "type": "dir",  "children": []},
            {"name": "tests/",            "type": "dir",  "children": [{"name": "test_routes.py", "type": "file"}]},
            {"name": "requirements.txt",  "type": "file"},
            {"name": "run.py",            "type": "file"},
            {"name": ".env",              "type": "file"},
            {"name": "README.md",         "type": "file"},
        ],
        "code_preview": {
            "filename": "app/__init__.py",
            "language": "python",
            "code": '''from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from app.config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Register blueprints
    from app.routes import main_bp
    from app.auth import auth_bp

    app.register_blueprint(main_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/health")
    def health():
        return {"status": "ok", "version": "1.0.0"}

    return app'''
        },
        "instructions": [
            {"step": 1, "title": "Create Virtual Environment", "cmd": "python -m venv venv && source venv/bin/activate", "desc": "Isolate Python dependencies in a virtual environment"},
            {"step": 2, "title": "Install Dependencies", "cmd": "pip install -r requirements.txt", "desc": "Installs Flask, SQLAlchemy, Migrate, CORS, and more"},
            {"step": 3, "title": "Configure Database", "cmd": "flask db init && flask db migrate", "desc": "Initialize and run database migrations"},
            {"step": 4, "title": "Run Development Server", "cmd": "python run.py", "desc": "Starts Flask dev server with debug mode on port 5000"},
            {"step": 5, "title": "Run Tests", "cmd": "pytest tests/", "desc": "Execute the test suite with pytest"},
        ],
        "entry_point": "run.py",
        "dev_cmd": "python run.py",
        "build_cmd": "pip install -e .",
        "test_cmd": "pytest tests/",
    },
}


class BuilderAgent(BaseAgent):
    name = "Builder"
    description = "Generates code scaffolds, project structures, and build artifacts."

    def run(self, prompt: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        context = context or {}
        tech_stack = context.get("tech_stack", "Flask")
        complexity = context.get("complexity", "standard")

        time.sleep(0.8)  # simulate build time

        data = STACK_DATA.get(tech_stack, STACK_DATA["Flask"])

        # Adjust file count by complexity
        files = list(data["files"])
        if complexity == "minimal":
            files = files[:6]
        elif complexity == "advanced":
            extra = [
                {"path": "docker-compose.yml", "type": "file", "lang": "yaml"},
                {"path": "Dockerfile",         "type": "file", "lang": "dockerfile"},
                {"path": ".github/workflows/ci.yml", "type": "file", "lang": "yaml"},
                {"path": "docs/API.md",        "type": "file", "lang": "markdown"},
            ]
            files.extend(extra)

        for f in files:
            if f["type"] == "file":
                f["lines"] = random.randint(20, 180)
                f["status"] = "created"

        total_lines = sum(f.get("lines", 0) for f in files)

        return {
            "project": prompt[:120],
            "build_status": "success",
            "tech_stack": tech_stack,
            "complexity": complexity,
            "files_generated": files,
            "total_files": len(files),
            "total_lines": total_lines,
            "project_structure": data["structure"],
            "code_preview": data["code_preview"],
            "instructions": data["instructions"],
            "build_config": {
                "entry_point": data["entry_point"],
                "dev_command": data["dev_cmd"],
                "build_command": data["build_cmd"],
                "test_command": data["test_cmd"],
            },
        }
