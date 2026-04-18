export function generateAppTemplate(idea, stack, complexity) {
  const normalizedStack = stack.toLowerCase();
  
  const files = [];
  let compileHtml = "";
  let previewError = null;

  // ─────────────────────────────────────────────────────────────
  // MINIMAL MODE
  // ─────────────────────────────────────────────────────────────
  if (complexity === "minimal") {
    files.push({
      path: "index.html",
      language: "html",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${idea}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border: 1px solid #334155; max-width: 400px; }
    h1 { margin-top: 0; color: #38bdf8; }
    button { background: #38bdf8; color: #0f172a; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 1rem; }
    button:hover { background: #7dd3fc; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MVP: ${idea}</h1>
    <p>This is a minimal scaffolding for your application.</p>
    <button onclick="alert('Action triggered!')">Get Started</button>
  </div>
</body>
</html>`
    });
    
    if (normalizedStack === "next.js" || normalizedStack === "mern") {
      files.push({
        path: "package.json",
        language: "json",
        code: `{\n  "name": "minimal-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}`
      });
    }

    compileHtml = files.find(f => f.path === "index.html").code;
  }
  
  // ─────────────────────────────────────────────────────────────
  // STANDARD MODE
  // ─────────────────────────────────────────────────────────────
  else if (complexity === "standard") {
    // Return a solid multi-component mock
    files.push(
      {
        path: "index.html",
        language: "html",
        code: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body class="bg-slate-900 text-slate-100">\n  <div id="root"></div>\n</body>\n</html>`
      },
      {
        path: "src/App.jsx",
        language: "javascript",
        code: `import React, { useState } from "react";\nimport { Layout } from "./Layout";\nimport { Dashboard } from "./Dashboard";\n\nexport default function App() {\n  return (\n    <Layout>\n      <Dashboard title="${idea}" />\n    </Layout>\n  );\n}`
      },
      {
        path: "src/Layout.jsx",
        language: "javascript",
        code: `export function Layout({ children }) {\n  return (\n    <div className="min-h-screen flex flex-col bg-slate-900">\n      <nav className="p-4 border-b border-slate-800 flex justify-between bg-slate-900/50 backdrop-blur">\n        <strong className="text-emerald-400">App Builder</strong>\n        <button className="px-4 py-1.5 bg-emerald-500 text-slate-900 rounded-md font-bold text-sm">Login</button>\n      </nav>\n      <main className="flex-1 p-8">{children}</main>\n    </div>\n  );\n}`
      },
      {
        path: "src/Dashboard.jsx",
        language: "javascript",
        code: `export function Dashboard({ title }) {\n  return (\n    <div className="max-w-4xl mx-auto">\n      <h1 className="text-3xl font-bold mb-6">{title}</h1>\n      <div className="grid grid-cols-2 gap-4">\n        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50">\n          <h3 className="font-semibold mb-2">Metrics Overview</h3>\n          <p className="text-slate-400 text-sm">Loading data streams...</p>\n        </div>\n        <div className="p-6 rounded-xl border border-slate-800 bg-slate-800/50">\n          <h3 className="font-semibold mb-2">Recent Activity</h3>\n          <p className="text-slate-400 text-sm">System initialized successfully.</p>\n        </div>\n      </div>\n    </div>\n  );\n}`
      },
      {
        path: "package.json",
        language: "json",
        code: `{\n  "name": "standard-app",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "lucide-react": "latest",\n    "tailwindcss": "latest"\n  }\n}`
      }
    );

    // Render an HTML version of the React code above for the preview iframe
    compileHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { margin: 0; font-family: system-ui; background: #0f172a; color: white; }</style>
      </head>
      <body>
        <div class="min-h-screen flex flex-col bg-slate-900">
          <nav class="p-4 border-b border-slate-800 flex justify-between bg-slate-900/50 backdrop-blur">
            <strong class="text-emerald-400">App Builder</strong>
            <button class="px-4 py-1.5 bg-emerald-500 text-slate-900 rounded-md font-bold text-sm">Login</button>
          </nav>
          <main class="flex-1 p-8">
            <div class="max-w-4xl mx-auto">
              <h1 class="text-3xl font-bold mb-6">${idea}</h1>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-6 rounded-xl border border-slate-800 bg-slate-800/50">
                  <h3 class="font-semibold mb-2 text-xl">Metrics Overview</h3>
                  <div class="mt-4 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-400 w-2/3"></div>
                  </div>
                </div>
                <div class="p-6 rounded-xl border border-slate-800 bg-slate-800/50">
                  <h3 class="font-semibold mb-2 text-xl">Recent Activity</h3>
                  <p class="text-slate-400 text-sm">✔ Components mapped</p>
                  <p class="text-slate-400 text-sm mt-1">✔ Layout established</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
      </html>
    `;
  }
  
  // ─────────────────────────────────────────────────────────────
  // ADVANCED MODE
  // ─────────────────────────────────────────────────────────────
  else {
    files.push(
      { path: "frontend/index.html", language: "html", code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${idea}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>` },
      { path: "frontend/src/App.tsx", language: "typescript", code: `import { RouterProvider } from "react-router-dom";\nimport { AuthProvider } from "./context/AuthContext";\nimport { MainLayout } from "./layouts/MainLayout";\n\nexport default function App() {\n  return (\n    <AuthProvider>\n      <MainLayout>\n        <div>Enterprise App Routes Here</div>\n      </MainLayout>\n    </AuthProvider>\n  );\n}` },
      { path: "frontend/src/components/Sidebar.tsx", language: "typescript", code: `export function Sidebar() {\n  return (\n    <aside className="w-64 border-r">\n      <nav>Sidebar Navigation</nav>\n    </aside>\n  );\n}` },
      { path: "frontend/src/store/index.ts", language: "typescript", code: `import { create } from "zustand";\n\nexport const useAppStore = create((set) => ({\n  user: null,\n  setUser: (user) => set({ user }),\n}));` },
      { path: "frontend/tailwind.config.ts", language: "typescript", code: `module.exports = {\n  content: ["./src/**/*.{js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n}` },
      { path: "frontend/package.json", language: "json", code: `{\n  "name": "enterprise-frontend",\n  "scripts": { "dev": "vite" }\n}` },
      { path: "backend/main.py", language: "python", code: `from fastapi import FastAPI, Depends\nfrom sqlalchemy.orm import Session\n\napp = FastAPI()\n\n@app.get("/api/health")\ndef health_check():\n    return {"status": "ok"}\n` },
      { path: "backend/models/user.py", language: "python", code: `from sqlalchemy import Column, Integer, String\nfrom .database import Base\n\nclass User(Base):\n    __tablename__ = "users"\n    id = Column(Integer, primary_key=True, index=True)\n    email = Column(String, unique=True, index=True)\n    hashed_password = Column(String)\n` },
      { path: "backend/requirements.txt", language: "text", code: `fastapi\nuvicorn\nsqlalchemy\npsycopg2-binary\npasslib\npython-jose` },
      { path: "docker-compose.yml", language: "yaml", code: `version: "3.8"\nservices:\n  frontend:\n    build: ./frontend\n    ports: ["3000:3000"]\n  backend:\n    build: ./backend\n    ports: ["8000:8000"]\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n` },
      { path: ".github/workflows/ci.yml", language: "yaml", code: `name: CI Pipeline\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: npm install\n      - run: npm test` }
    );

    compileHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>body { margin: 0; font-family: 'Inter', sans-serif; background: #020617; color: #f8fafc; }</style>
      </head>
      <body>
        <div class="flex h-screen overflow-hidden bg-slate-950">
          <!-- Sidebar -->
          <aside class="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col hidden sm:flex">
            <div class="h-16 flex items-center px-6 border-b border-slate-800">
              <span class="w-8 h-8 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold mr-3 shadow-[0_0_15px_rgba(139,92,246,0.5)]">E</span>
              <span class="font-bold tracking-wide">Enterprise UI</span>
            </div>
            <nav class="p-4 space-y-1">
              <div class="px-3 py-2 bg-violet-500/10 text-violet-400 rounded-lg text-sm font-medium border border-violet-500/20">Dashboard</div>
              <div class="px-3 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium">Analytics</div>
              <div class="px-3 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium">Settings</div>
            </nav>
          </aside>
          <!-- Main -->
          <main class="flex-1 flex flex-col min-w-0">
            <!-- Header -->
            <header class="h-16 border-b border-slate-800 flex justify-between items-center px-6 bg-slate-900/20 backdrop-blur-md">
              <div class="font-medium text-slate-300 truncate">${idea}</div>
              <div class="flex items-center gap-4">
                <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <div class="w-8 h-8 border border-slate-700 rounded-full bg-slate-800"></div>
              </div>
            </header>
            <!-- Content -->
            <div class="flex-1 overflow-auto p-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div class="text-slate-400 text-xs mb-2">Total Revenue</div>
                  <div class="text-3xl font-bold">$124,563</div>
                  <div class="text-emerald-400 text-xs mt-2">+14.5% vs last month</div>
                </div>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div class="text-slate-400 text-xs mb-2">Active Users</div>
                  <div class="text-3xl font-bold">12,492</div>
                  <div class="text-emerald-400 text-xs mt-2">+8.2% vs last month</div>
                </div>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div class="text-slate-400 text-xs mb-2">Server Uptime</div>
                  <div class="text-3xl font-bold">99.99%</div>
                  <div class="text-slate-500 text-xs mt-2">All systems operational</div>
                </div>
              </div>
              <div class="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl h-64 flex items-center justify-center p-6">
                 <!-- Fake chart -->
                 <div class="w-full h-full flex items-end gap-2 px-4 pb-4 border-b border-slate-800 relative">
                   <div class="absolute top-0 left-0 text-slate-500 text-xs text-center w-full uppercase tracking-wider font-bold">Data visualization scaffold</div>
                   <div class="w-full bg-indigo-500/80 rounded-t h-1/4 hover:h-2/4 transition-all"></div>
                   <div class="w-full bg-indigo-500/80 rounded-t h-2/4 hover:h-3/4 transition-all"></div>
                   <div class="w-full bg-indigo-500/80 rounded-t h-3/5 hover:h-4/5 transition-all"></div>
                   <div class="w-full bg-violet-500   rounded-t h-4/5 hover:h-full transition-all relative"><div class="absolute -top-3 w-full border-t border-dashed border-violet-400"></div></div>
                   <div class="w-full bg-indigo-500/80 rounded-t h-2/5 hover:h-3/5 transition-all"></div>
                 </div>
              </div>
            </div>
          </main>
        </div>
      </body>
      </html>
    `;
  }

  // ─────────────────────────────────────────────────────────────
  // SANITIZATION AND STRUCTURING
  // ─────────────────────────────────────────────────────────────
  try {
    sanitizeTemplates(files);
  } catch (err) {
    // If sanitization fails, catch it so the UI can display the error state instead of a broken iframe
    previewError = err.message;
    compileHtml = `<!DOCTYPE html><html><body>Critical Build Error: ${err.message}</body></html>`;
  }

  // Generate hierarchical structure function
  const structure = generateStructure(files.map(f => f.path));

  return { files, structure, previewHtml: compileHtml, previewError };
}

/**
 * Validates and auto-fixes the generated templates. Ensures that React code is 
 * not missing return statements, trailing closures, or raw pseudo-code.
 */
function sanitizeTemplates(files) {
  files.forEach(file => {
    if (file.language === "javascript" || file.language === "typescript") {
      let code = file.code;

      // 1. Missing Imports check
      if (code.includes("<") && !code.includes("import React") && !code.includes("from 'react'") && !code.includes("from \"react\"")) {
         // Auto-fix: prepend React import
         code = `import React from "react";\n${code}`;
      }

      // 2. Return newline bug (e.g. `return \n <div...`) causes undefined render
      // Auto-fix: Wrap returning JSX in parens if missing
      code = code.replace(/return\s*\n\s*(<[\s\S]+?)\s*}/, "return (\n  $1\n  );\n}");

      // 3. No pseudo-code arrays/strings with ... inside components
      if (code.includes("...") && !code.includes("{...")) { // Ignore spread syntax
         throw new Error(`Syntax Validation Failed in ${file.path}: Found unhandled pseudo-code '...' placeholders. Templates must be complete.`);
      }

      // 4. Validate existence of export
      if (!code.includes("export default") && !code.includes("export const") && !code.includes("export function")) {
         throw new Error(`Syntax Validation Failed in ${file.path}: Missing valid export block. Every component must export.`);
      }

      // 5. Missing closing tags validation (basic check for common mis-matched div/tags)
      const openDivs = (code.match(/<div/g) || []).length;
      const closeDivs = (code.match(/<\/div>/g) || []).length;
      if (openDivs !== closeDivs) {
         // Auto-fix by appending closing divs before the last brace
         const diff = openDivs - closeDivs;
         if (diff > 0) {
            code = code.replace(/(\s*)\}\s*$/, `\n${"  </div>\n".repeat(diff)}$1}`);
         } else {
            throw new Error(`Syntax Validation Failed in ${file.path}: Mismatched HTML/JSX closing tags.`);
         }
      }

      file.code = code;
    }
  });
}

function generateStructure(paths) {
  const result = [];
  
  paths.forEach(path => {
    const parts = path.split('/');
    let currentLevel = result;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      
      let existingNode = currentLevel.find(node => node.name === part);
      
      if (!existingNode) {
        existingNode = {
          name: part,
          type: isFile ? "file" : "dir",
          children: isFile ? undefined : []
        };
        currentLevel.push(existingNode);
      }
      
      if (!isFile) {
        currentLevel = existingNode.children;
      }
    });
  });
  
  return result;
}
