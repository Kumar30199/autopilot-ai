/**
 * PreviewCompiler — Transforms LLM-generated React/JSX files into a single
 * runnable HTML document using CDN React + Babel standalone for in-browser compilation.
 */

const ICON_STUBS = `
const _ic = (d) => (p) => React.createElement("svg", {
  xmlns:"http://www.w3.org/2000/svg", width:p?.size||20, height:p?.size||20,
  viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"2",
  strokeLinecap:"round", strokeLinejoin:"round", className:p?.className||"",
  style:p?.style, onClick:p?.onClick
}, React.createElement("path",{d}));
const Plus=_ic("M12 5v14M5 12h14");
const Trash2=_ic("M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6");
const Edit=_ic("M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z");
const Check=_ic("M20 6L9 17l-5-5");
const X=_ic("M18 6L6 18M6 6l12 12");
const Search=_ic("M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5");
const Home=_ic("M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z");
const User=_ic("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z");
const Settings=_ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 8v4M12 16h.01");
const LogOut=_ic("M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9");
const Menu=_ic("M3 12h18M3 6h18M3 18h18");
const Star=_ic("M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z");
const Heart=_ic("M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z");
const Bell=_ic("M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0");
const Calendar=_ic("M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18");
const Clock=_ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 6v6l4 2");
const Filter=_ic("M22 3H2l8 9.46V19l4 2v-8.54L22 3z");
const ArrowLeft=_ic("M19 12H5M12 19l-7-7 7-7");
const ArrowRight=_ic("M5 12h14M12 5l7 7-7 7");
const BarChart=_ic("M12 20V10M18 20V4M6 20v-4");
const Eye=_ic("M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z");
const AlertCircle=_ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM12 8v4M12 16h.01");
const CheckCircle=_ic("M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3");
const Loader=_ic("M21 12a9 9 0 11-6.22-8.56");
const Save=_ic("M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8");
const Zap=_ic("M13 2L3 14h9l-1 8 10-12h-9l1-8z");
const Moon=_ic("M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z");
const Sun=_ic("M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42");
const ShoppingCart=_ic("M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6");
const Tag=_ic("M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01");
const Mail=_ic("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6");
const Lock=_ic("M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4");
const Globe=_ic("M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zM2 12h20");
const Layers=_ic("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5");
const Database=_ic("M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z");
const Terminal=_ic("M4 17l6-6-6-6M12 19h8");
const Code=_ic("M16 18l6-6-6-6M8 6l-6 6 6 6");
const Activity=_ic("M22 12h-4l-3 9L9 3l-3 9H2");
const Send=_ic("M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z");
const Copy=_ic("M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1");
const Download=_ic("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3");
const Upload=_ic("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12");
const Folder=_ic("M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z");
const File=_ic("M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7");
const Trash=Trash2; const Pencil=Edit; const ChevronRight=ArrowRight; const ChevronDown=_ic("M6 9l6 6 6-6");
const ChevronLeft=ArrowLeft; const ChevronUp=_ic("M18 15l-6-6-6 6");
const MoreHorizontal=_ic("M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z");
const MoreVertical=_ic("M12 13a1 1 0 100-2 1 1 0 000 2zM12 6a1 1 0 100-2 1 1 0 000 2zM12 20a1 1 0 100-2 1 1 0 000 2z");
const ExternalLink=_ic("M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3");
const TrendingUp=_ic("M23 6l-9.5 9.5-5-5L1 18M17 6h6v6");
const DollarSign=_ic("M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6");
const MessageSquare=_ic("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z");
const Shield=_ic("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z");
const Award=_ic("M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12");
const Package=_ic("M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z");
const Layout=_ic("M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM3 9h18M9 21V9");
const Server=_ic("M2 4h20v5H2zM2 15h20v5H2zM6 7h.01M6 18h.01");
const PieChart=_ic("M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z");
const CreditCard=_ic("M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22");
const Image=_ic("M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21");
const Inbox=_ic("M22 12h-6l-2 3H10l-2-3H2");
const RefreshCw=_ic("M23 4v6h-6M1 20v-6h6");
const Bookmark=_ic("M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z");
const MapPin=_ic("M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 7a3 3 0 100 6 3 3 0 000-6z");
const Phone=_ic("M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72");
const Clipboard=_ic("M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2");
const Gift=_ic("M20 12v10H4V12M2 7h20v5H2zM12 22V7");
const Truck=_ic("M1 3h15v13H1zM16 8h4l3 3v5h-7V8z");
const Info=AlertCircle; const Spinner=Loader; const Delete=Trash2; const Close=X;
const Add=Plus; const Remove=X; const Expand=ChevronDown; const Collapse=ChevronUp;
`;

/**
 * Strip import/export statements from a JSX code string.
 * Returns clean component code that can run in a shared scope.
 */
function stripImportsExports(code) {
  if (!code || typeof code !== "string") return "";

  let result = code;

  // Remove import lines (handles multi-line imports by joining lines first)
  // Match: import ... from "..."  |  import "..."  |  const X = require("...")
  const lines = result.split("\n");
  const filtered = [];
  let inImport = false;
  for (const line of lines) {
    const trimmed = line.trim();
    // Detect start of import statement
    if (trimmed.startsWith("import ") || trimmed.startsWith("import{")) {
      // If the line contains "from" and ends with ; or quote, it's a single-line import
      if (trimmed.includes(" from ") && (trimmed.endsWith(";") || trimmed.endsWith("'") || trimmed.endsWith('"'))) {
        continue; // Skip single-line import
      }
      if (trimmed.endsWith(";") || trimmed.endsWith("'") || trimmed.endsWith('"')) {
        continue; // Side-effect import like import "./style.css";
      }
      // Otherwise start of multi-line import
      inImport = true;
      continue;
    }
    if (inImport) {
      // End of multi-line import
      if (trimmed.includes(" from ") || trimmed.endsWith(";")) {
        inImport = false;
        continue;
      }
      continue; // Still inside multi-line import
    }
    // Skip require statements
    if (/^const\s+\w+\s*=\s*require\(/.test(trimmed)) continue;

    filtered.push(line);
  }
  result = filtered.join("\n");

  // Convert "export default function X" -> "function X"
  result = result.replace(/export\s+default\s+function\s+/g, "function ");
  // Convert "export default class X" -> "class X"
  result = result.replace(/export\s+default\s+class\s+/g, "class ");
  // Remove standalone "export default X;"
  result = result.replace(/export\s+default\s+\w+\s*;?\s*$/gm, "");
  // Convert "export function" -> "function"
  result = result.replace(/export\s+function\s+/g, "function ");
  // Convert "export const" -> "const"
  result = result.replace(/export\s+const\s+/g, "const ");
  // Convert "export class" -> "class"
  result = result.replace(/export\s+class\s+/g, "class ");
  // Remove export { ... }
  result = result.replace(/export\s*\{[^}]*\}\s*;?/g, "");

  return result.trim();
}

/**
 * Sort files so that leaf components come before the files that import them.
 * The App file is always last.
 */
function sortByDependency(jsFiles) {
  const appFile = jsFiles.find(f =>
    f.path.toLowerCase().includes("app.jsx") ||
    f.path.toLowerCase().includes("app.tsx") ||
    f.path.toLowerCase().includes("app.js")
  );

  const mainFile = jsFiles.find(f =>
    f.path.toLowerCase().includes("main.jsx") ||
    f.path.toLowerCase().includes("main.tsx") ||
    f.path.toLowerCase().includes("index.jsx") ||
    f.path.toLowerCase().includes("index.js")
  );

  const others = jsFiles.filter(f => f !== appFile && f !== mainFile);

  // Simple heuristic: files with fewer import lines go first
  others.sort((a, b) => {
    const importsA = ((a.code || "").match(/^import\s/gm) || []).length;
    const importsB = ((b.code || "").match(/^import\s/gm) || []).length;
    return importsA - importsB;
  });

  const sorted = [...others];
  if (appFile) sorted.push(appFile);
  // Skip main/index entry files — we provide our own render call
  return sorted;
}

/**
 * Compile an array of generated files into a single runnable HTML document.
 */
export function compileToPreviewHtml(files) {
  if (!Array.isArray(files) || files.length === 0) return null;

  // 1. Extract CSS
  const cssFiles = files.filter(f =>
    f?.path?.endsWith(".css") && typeof f.code === "string"
  );
  const cssContent = cssFiles.map(f => f.code).join("\n");

  // 2. Extract JS/JSX/TS/TSX files (skip configs, tests, package.json, etc)
  const jsFiles = files.filter(f => {
    const p = (f?.path || "").toLowerCase();
    return (
      (p.endsWith(".jsx") || p.endsWith(".tsx") || p.endsWith(".js") || p.endsWith(".ts")) &&
      !p.includes("config") &&
      !p.includes("test") &&
      !p.includes("spec") &&
      !p.includes("vite.") &&
      !p.includes("tailwind.") &&
      !p.includes("postcss") &&
      !p.includes("babel") &&
      typeof f.code === "string" &&
      f.code.trim().length > 5
    );
  });

  if (jsFiles.length === 0) {
    // Fallback: if LLM returned only HTML files, use the first HTML file directly
    const htmlFile = files.find(f => 
      f?.path?.endsWith(".html") && typeof f.code === "string" && f.code.trim().length > 20
    );
    if (htmlFile) {
      // Inject Tailwind and Inter font if missing
      let html = htmlFile.code;
      if (!html.includes("tailwindcss")) {
        html = html.replace("</head>", '<script src="https://cdn.tailwindcss.com"></script>\n</head>');
      }
      if (!html.includes("Inter")) {
        html = html.replace("</head>", '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n</head>');
      }
      return html;
    }
    return null;
  }

  // 3. Sort files by dependency order
  const sorted = sortByDependency(jsFiles);

  // 4. Process each file — strip imports/exports
  const processedBlocks = sorted.map(f => {
    const cleaned = stripImportsExports(f.code);
    return `// ── ${f.path} ──\n${cleaned}`;
  });

  // 5. Find the root component name (usually App)
  let rootComponent = "App";
  const appFile = sorted.find(f => f.path.toLowerCase().includes("app."));
  if (appFile) {
    const match = appFile.code.match(/(?:function|class)\s+(\w+)/);
    if (match) rootComponent = match[1];
  }

  // 6. Build the final HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    // Failsafe Error Boundary (Phase 4 & 6)
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      document.body.innerHTML = \`
        <div style="font-family: 'Inter', system-ui, sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; padding: 20px;">
          <div style="background: #1e1b4b; border: 1px solid #4338ca; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <h2 style="margin: 0; color: #e0e7ff; font-size: 20px; font-weight: 600;">Build Recovered</h2>
            </div>
            <p style="color: #a5b4fc; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">The generated UI encountered a rendering error. This usually happens when the AI uses undefined variables or malformed JSX syntax.</p>
            <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid #1e293b; overflow: auto;">
              <code style="color: #f87171; font-size: 12px; font-family: monospace;">\${msg}</code>
            </div>
          </div>
        </div>
      \`;
      return false;
    };
  </script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    #root { min-height: 100vh; }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    // React hooks available globally
    const { useState, useEffect, useRef, useCallback, useMemo, useContext,
            createContext, useReducer, Fragment } = React;

    // UUID shim
    const uuidv4 = () => crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const v4 = uuidv4;

    // react-router-dom stubs — render ALL route elements (preview mode)
    const BrowserRouter = ({children}) => React.createElement(Fragment, null, children);
    const HashRouter = BrowserRouter;
    const Router = BrowserRouter;
    const Routes = ({children}) => {
      // In preview, render all Route elements so users can see the full app
      const routes = React.Children.toArray(children);
      if (routes.length === 0) return null;
      // Find the "/" root route, or fall back to first route
      const rootRoute = routes.find(r => r?.props?.path === "/" || r?.props?.index) || routes[0];
      return rootRoute?.props?.element || React.createElement(Fragment, null, children);
    };
    const Route = ({element, children}) => element || children || null;
    const Switch = Routes;
    const Link = ({to, children, className, style, onClick, ...rest}) => React.createElement("a", {href:"#", className, style, onClick: (e) => { e.preventDefault(); onClick?.(e); }, ...rest}, children);
    const NavLink = Link;
    const Navigate = () => null;
    const useNavigate = () => (path) => console.log("Navigate to:", path);
    const useParams = () => ({});
    const useLocation = () => ({ pathname: "/", search: "", hash: "" });
    const useSearchParams = () => [new URLSearchParams(), () => {}];
    const Outlet = ({children}) => children || null;
    const RouterProvider = ({children}) => React.createElement(Fragment, null, children);

    // Auth context stub
    const AuthContext = createContext({ user: null, login: ()=>{}, logout: ()=>{}, isAuthenticated: false });
    const AuthProvider = ({children}) => {
      const [user, setUser] = useState(null);
      const login = (u) => setUser(u || {name:"User",email:"user@app.com"});
      const logout = () => setUser(null);
      return React.createElement(AuthContext.Provider, {value:{user, login, logout, isAuthenticated:!!user}}, children);
    };
    const useAuth = () => useContext(AuthContext);

    // Axios/fetch stub
    const axios = { get: async(u)=>({data:[]}), post: async(u,d)=>({data:d}), put: async(u,d)=>({data:d}), delete: async(u)=>({data:{}}) };

    // Zustand stub
    const create = (fn) => {
      let state = fn((partial) => { state = {...state, ...partial}; });
      return () => state;
    };

    // toast stub
    const toast = { success: (m) => console.log("Toast:", m), error: (m) => console.error("Toast:", m), info: (m) => console.log("Toast:", m) };

    // Lucide icon stubs
    ${ICON_STUBS}

    // ════════════════════════════════════════════
    // GENERATED COMPONENTS
    // ════════════════════════════════════════════
    ${processedBlocks.join("\n\n")}

    // ════════════════════════════════════════════
    // MOUNT
    // ════════════════════════════════════════════
    try {
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(React.createElement(${rootComponent}));
    } catch(e) {
      document.getElementById("root").innerHTML =
        '<div style="padding:2rem;color:#f87171;font-family:monospace;background:#1e1e2e;min-height:100vh">' +
        '<h2 style="color:#f472b6;margin-bottom:1rem">⚠ Runtime Error</h2>' +
        '<pre style="white-space:pre-wrap;color:#fca5a5">' + e.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
}
