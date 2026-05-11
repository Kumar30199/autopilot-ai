export function generateAppTemplate(idea, stack, complexity) {
  const normalizedStack = stack.toLowerCase();
  
  const files = [];
  let compileHtml = "";
  let previewError = null;

  // ─────────────────────────────────────────────────────────────
  // MINIMAL MODE
  // ─────────────────────────────────────────────────────────────
  if (complexity === "minimal") {
    
    // Convert generic layout into highly contextual functional mock based on prompt
    const lowerIdea = idea.toLowerCase();
    let dynamicUI = `<p>This is a minimal scaffolding for your application.</p><button onclick="alert('Action triggered!')">Get Started</button>`;
    
    if (lowerIdea.includes("ecommerce") || lowerIdea.includes("shop") || lowerIdea.includes("store")) {
       dynamicUI = `
         <div style="display:flex; justify-content:space-between; width: 100%; border-bottom: 1px solid #334155; padding-bottom: 1rem; margin-bottom: 1rem;">
           <strong style="color:white;font-size:18px;">${idea.split(" ")[0]} Shop</strong>
           <button style="margin: 0;">Cart (0)</button>
         </div>
         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width:100%;">
           <div style="background: #334155; padding: 1rem; border-radius: 8px;">Product 1 <br> <span style="color:#38bdf8">$29.99</span> <br><button style="width:100%;padding:4px;">Add</button></div>
           <div style="background: #334155; padding: 1rem; border-radius: 8px;">Product 2 <br> <span style="color:#38bdf8">$49.99</span> <br><button style="width:100%;padding:4px;">Add</button></div>
         </div>
       `;
    } else if (lowerIdea.includes("task") || lowerIdea.includes("todo") || lowerIdea.includes("board")) {
       dynamicUI = `
         <div style="width: 100%; text-align: left;">
           <input type="text" placeholder="New Task..." style="width: 100%; padding: 8px; margin-bottom: 1rem; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color: white;" />
           <ul style="list-style: none; padding: 0; margin: 0;">
             <li style="padding: 10px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between;"><span>Design DB schema</span> <input type="checkbox" checked/></li>
             <li style="padding: 10px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between;"><span>Setup Auth</span> <input type="checkbox"/></li>
           </ul>
         </div>
       `;
    } else if (lowerIdea.includes("chat") || lowerIdea.includes("message")) {
       dynamicUI = `
         <div style="width: 100%; display: flex; flex-direction: column; height: 300px;">
           <div style="flex: 1; border: 1px solid #334155; border-radius: 8px; margin-bottom: 1rem; padding: 1rem; text-align: left; overflow-y: auto;">
             <div style="background: #38bdf8; color: #0f172a; padding: 8px; border-radius: 8px; width: max-content; margin-bottom: 8px;">Hello!</div>
             <div style="background: #334155; padding: 8px; border-radius: 8px; width: max-content; margin-left: auto;">Hi, how can I help with ${idea}?</div>
           </div>
           <div style="display: flex; gap: 8px;">
             <input style="flex:1; padding: 8px; border-radius: 4px; border: 1px solid #334155; background: #0f172a; color:white;" placeholder="Message..." />
             <button style="margin: 0;">Send</button>
           </div>
         </div>
       `;
    }

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
    .card { background: #1e293b; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); border: 1px solid #334155; max-width: 400px; width: 100%; }
    h1 { margin-top: 0; color: #38bdf8; font-size:24px; }
    button { background: #38bdf8; color: #0f172a; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 1rem; }
    button:hover { background: #7dd3fc; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${idea}</h1>
    ${dynamicUI}
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
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100">
  <div id="root"></div>
</body>
</html>`
      },
      {
        path: "src/App.jsx",
        language: "javascript",
        code: `import React, { useState } from "react";
import { Layout } from "./Layout";
import { Dashboard } from "./Dashboard";

export default function App() {
  return (
    <Layout>
      <Dashboard title="${idea}" />
    </Layout>
  );
}`
      },
      {
        path: "src/Layout.jsx",
        language: "javascript",
        code: `import React from "react";

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 font-sans">
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-slate-900 mr-3">A</div>
          <span className="font-bold tracking-wide">Builder App</span>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <div className="px-4 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-500/20 cursor-pointer">Dashboard</div>
          <div className="px-4 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors cursor-pointer">Analytics</div>
          <div className="px-4 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors cursor-pointer">Settings</div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-slate-500">admin@system.io</div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex justify-between items-center px-8 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
          <div className="md:hidden font-bold text-emerald-400">Builder App</div>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
             <div className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">Alerts</div>
             <button className="px-4 py-1.5 border border-slate-700 hover:border-slate-500 rounded-md font-medium text-sm transition-colors">Sign Out</button>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}`
      },
      {
        path: "src/Dashboard.jsx",
        language: "javascript",
        code: `import React from "react";

export function Dashboard({ title }) {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-slate-400 mt-1">Monitor your key metrics and recent interactions.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-500/20">
          Create New Report
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Revenue</h3>
          <div className="text-3xl font-bold text-white">$124,563.00</div>
          <div className="text-emerald-400 text-sm mt-2 font-medium">+14.5% from last month</div>
        </div>
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-white">12,492</div>
          <div className="text-emerald-400 text-sm mt-2 font-medium">+8.2% from last month</div>
        </div>
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-800/40 shadow-xl">
          <h3 className="text-slate-400 text-sm font-medium mb-2">Server Uptime</h3>
          <div className="text-3xl font-bold text-white">99.99%</div>
          <div className="text-slate-500 text-sm mt-2 font-medium">All systems operational</div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
            <div>
              <div className="font-medium text-white">New User Registered</div>
              <div className="text-sm text-slate-400">admin@example.com joined the platform</div>
            </div>
            <div className="text-sm text-slate-500">2 mins ago</div>
          </div>
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
            <div>
              <div className="font-medium text-white">Server Deployment</div>
              <div className="text-sm text-slate-400">Production build v2.4.1 completed</div>
            </div>
            <div className="text-sm text-slate-500">1 hour ago</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Database Backup</div>
              <div className="text-sm text-slate-400">Automated snapshot created successfully</div>
            </div>
            <div className="text-sm text-slate-500">12 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}`
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
      { path: "frontend/tailwind.config.ts", language: "typescript", code: `export default {\n  content: ["./src/**/*.{js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n}` },
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
export function sanitizeTemplates(files) {
  if (!Array.isArray(files)) return;
  
  files.forEach(file => {
    // Null-safe: skip malformed file entries entirely
    if (!file || typeof file !== "object") return;
    if (!file.path || typeof file.path !== "string") return;
    
    // Guard code against null/undefined — coerce to empty string
    if (file.code === null || file.code === undefined) {
      file.code = "";
    }
    if (typeof file.code !== "string") {
      file.code = String(file.code);
    }
    
    if (file.language === "javascript" || file.language === "typescript") {
      let code = file.code;
      
      // Skip empty/trivial code blocks
      if (!code || code.trim().length < 10) {
        file.code = code;
        return;
      }

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

export function generateStructure(paths) {
  if (!Array.isArray(paths)) return [];
  const result = [];
  
  paths.filter(Boolean).forEach(path => {
    if (typeof path !== "string") return;
    const parts = path.split('/');
    let currentLevel = result;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      
      let existingNode = currentLevel.find(node => node.name === part);
      
      if (!existingNode) {
        existingNode = {
          name: part,
          path: isFile ? path : undefined,
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
