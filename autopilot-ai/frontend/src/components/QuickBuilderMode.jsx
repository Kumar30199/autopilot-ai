import { useState, useEffect, useRef } from "react";
import {
  Hammer, Loader2, CheckCircle, FileCode2, Sparkles,
  FolderTree, Rocket, RotateCcw, Copy, Check,
  Terminal, ChevronRight, Folder, File,
  Gauge, Code2, ArrowRight, Layers, Zap, Settings,
  CircleDot, Monitor, Box, Wrench, X, Eye, Play, AlertCircle
} from "lucide-react";
import { generateAppTemplate } from "../utils/TemplateGenerator";
import { ErrorBoundary } from "./ui/ErrorBoundary";

/* ── Tech Stack Options ──────────────────────────────────────── */
const STACKS = [
  {
    id: "MERN",
    label: "MERN Stack",
    desc: "MongoDB · Express · React · Node.js",
    icon: Layers,
    tags: ["MongoDB", "Express", "React", "Node.js"],
    color: { bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.28)", text: "#34d399", glow: "rgba(16,185,129,0.15)" },
  },
  {
    id: "Next.js",
    label: "Next.js",
    desc: "React framework with SSR & API routes",
    icon: Monitor,
    tags: ["React", "TypeScript", "Tailwind", "Vercel"],
    color: { bg: "rgba(99,102,241,0.07)", border: "rgba(99,102,241,0.28)", text: "#818cf8", glow: "rgba(99,102,241,0.15)" },
  },
  {
    id: "Flask",
    label: "Flask",
    desc: "Python micro-framework for web apps",
    icon: Box,
    tags: ["Python", "SQLAlchemy", "Jinja2"],
    color: { bg: "rgba(0,240,255,0.07)", border: "rgba(0,240,255,0.28)", text: "#22d3ee", glow: "rgba(0,240,255,0.15)" },
  },
];

/* ── Complexity Options ──────────────────────────────────────── */
const COMPLEXITY = [
  { id: "minimal",  label: "Minimal",  desc: "Core files only — fast start", icon: "⚡" },
  { id: "standard", label: "Standard", desc: "Full project — production ready", icon: "📦" },
  { id: "advanced", label: "Advanced", desc: "CI/CD, Docker, docs included", icon: "🔧" },
];

/* ── Build Log Steps ─────────────────────────────────────────── */
const BUILD_STEPS = [
  "Validating architectural requirements...",
  "Allocating environment resources...",
  "Generating project scaffold...",
  "Synthesizing core components...",
  "Wiring routing and state logic...",
  "Compiling frontend assets...",
  "Deploying live preview container...",
  "Finalizing build artifacts ✓",
];

/* ════════════════════════════════════════════════════════════════
   QUICK BUILDER MODE
   ════════════════════════════════════════════════════════════════ */
export default function QuickBuilderMode({ dispatch }) {
  const [idea, setIdea] = useState("");
  const [stack, setStack] = useState("MERN");
  const [complexity, setComplexity] = useState("standard");
  const [stage, setStage] = useState("input"); // input | building | done

  // Generated app data
  const [appData, setAppData] = useState(null);
  
  // Animation states
  const [progress, setProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState([]);
  const [visibleFiles, setVisibleFiles] = useState([]);
  
  // Deployment simulation states
  const [deployPhase, setDeployPhase] = useState("");
  const [appPort, setAppPort] = useState(3000);
  const [cspBlocked, setCspBlocked] = useState(false);

  // Viewer states
  const [activeFile, setActiveFile] = useState(null);
  const [copiedCmd, setCopiedCmd] = useState(null);
  const logRef = useRef(null);

  /* ── Simulated build sequence ───────────────────────────── */
  useEffect(() => {
    if (stage !== "building" || !appData) return;
    
    setBuildLogs([]);
    setVisibleFiles([]);
    setProgress(0);

    const totalSteps = BUILD_STEPS.length;
    const filesToGen = appData.files;
    let currentStep = 0;
    let currentFileIdx = 0;

    const interval = setInterval(() => {
      // 1. Advance logs
      if (currentStep < totalSteps) {
        setBuildLogs(prev => [...prev, BUILD_STEPS[currentStep]]);
        currentStep++;
      }
      
      // 2. Advance files
      if (currentStep > 2 && currentFileIdx < filesToGen.length) {
        setVisibleFiles(prev => [...prev, filesToGen[currentFileIdx]]);
        setActiveFile(filesToGen[currentFileIdx]); // Auto-open latest file
        currentFileIdx++;
      }

      // 3. Update Progress
      const newProgress = Math.min(
        ((currentStep / totalSteps) * 50) + ((currentFileIdx / filesToGen.length) * 50),
        100
      );
      setProgress(newProgress);

      // 4. Check completion
      if (currentStep >= totalSteps && currentFileIdx >= filesToGen.length) {
        clearInterval(interval);
        setTimeout(() => setStage("deploying"), 600); // Shift to new deployment pipeline mode
      }
    }, 450);

    return () => clearInterval(interval);
  }, [stage, appData]);

  /* ── Simulated deployment pipeline (Port -> Install -> Start -> Ready) ── */
  useEffect(() => {
    if (stage !== "deploying") return;

    // Simulate startup commands dynamically based on stack
    const depInstall = stack === "Flask" ? "Creating venv & pip install -r requirements.txt..." : 
                       stack === "Next.js" ? "Running npm install..." : "Running npm install...";
    
    const startCmd = stack === "Flask" ? "Starting Flask runtime (python run.py)..." : 
                     stack === "Next.js" ? "Starting Next dev server (npm run dev)..." : "Starting Express (node server/index.js)...";

    const steps = [
      { msg: "Detecting free port automatically...", delay: 800 },
      { msg: `Previous port conflict resolved. Assigned free port: 300${Math.floor(Math.random() * 9) + 1}`, delay: 700, action: () => setAppPort(3000 + Math.floor(Math.random() * 9) + 1) },
      { msg: depInstall, delay: 1800 },
      { msg: startCmd, delay: 1200 },
      { msg: "Polling health endpoint /api/health...", delay: 1200 },
      { msg: "App startup successful!", delay: 600 }
    ];

    let current = 0;
    const processDeploy = () => {
      if (current >= steps.length) {
        setStage("done");
        // Simulate X-Frame-Options/CSP block to trigger the exact external preview fallback requested
        setCspBlocked(true); 
        return;
      }
      setDeployPhase(steps[current].msg);
      if (steps[current].action) steps[current].action();
      
      setBuildLogs(prev => [...prev, `[DEPLOY] ${steps[current].msg}`]);

      current++;
      setTimeout(processDeploy, steps[current-1].delay);
    };

    processDeploy();
  }, [stage, stack]);

  /* scroll logs to bottom */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [buildLogs]);

  /* ── Build dispatcher ───────────────────────────────────── */
  const startBuild = async () => {
    if (!idea.trim()) return;
    
    // Fake the backend dispatch to register it in history if needed,
    // but we use our TemplateGenerator for the real UI simulation.
    dispatch?.("build", idea, { tech_stack: stack, complexity }).catch(() => {});
    
    const generated = generateAppTemplate(idea, stack, complexity);
    setAppData(generated);
    setStage("building");
  };

  const reset = () => {
    setStage("input");
    setAppData(null);
    setIdea("");
    setBuildLogs([]);
    setVisibleFiles([]);
    setActiveFile(null);
    setProgress(0);
    setCspBlocked(false);
  };

  const openExternalFallback = () => {
    const blob = new Blob([appData.previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const copyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd("code");
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const selectedStack = STACKS.find((s) => s.id === stack);

  // Generate structure for currently visible files
  const currentStructure = appData ? generateStructure(visibleFiles.map(f => f.path)) : [];


  /* ════════════════════════════════════════════════════════════
     RENDER: INPUT STAGE (Original Mode)
     ════════════════════════════════════════════════════════════ */
  if (stage === "input") {
    return (
      <div className="section-stack anim-fade-up">
        {/* Header */}
        <div className="mode-header glass neon-border-emerald">
          <div className="mode-header__orb-1" style={{ background: "rgba(16,185,129,0.07)" }} />
          <div className="mode-header__orb-2" style={{ background: "rgba(0,240,255,0.05)" }} />
          <div className="mode-header__content">
            <div className="mode-header__icon anim-float" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <Hammer className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="mode-header__text">
              <h1>Quick Builder <span className="neon-text-emerald">Mode</span></h1>
              <p>Describe your app, choose a stack, set complexity — then watch the Builder agent scaffold your entire project.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="panel">
          <label className="section-label">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> App Idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder={"Describe your app idea in detail...\n\nExample: A task management app with user authentication, project boards, drag-and-drop cards, real-time collaboration, and a REST API backend."}
            rows={5}
            className="input-base input-glow-emerald"
            style={{ height: "auto", padding: "14px 16px", resize: "none", lineHeight: 1.6 }}
          />
        </div>

        <div className="panel">
          <label className="section-label">
            <Settings className="h-3.5 w-3.5 text-cyan-400" /> Tech Stack
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-1">
            {STACKS.map((s) => {
              const active = stack === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStack(s.id)}
                  className="group relative flex items-start gap-3 rounded-xl border text-left transition-all duration-300"
                  style={{
                    padding: "16px", background: active ? s.color.bg : "var(--bg-inset)",
                    borderColor: active ? s.color.border : "var(--border-dim)", boxShadow: active ? `0 0 24px ${s.color.glow}` : "none",
                  }}
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300"
                    style={{ borderColor: active ? s.color.text : "var(--text-muted)" }}>
                    {active && <div className="h-2.5 w-2.5 rounded-full anim-fade-in" style={{ background: s.color.text, boxShadow: `0 0 6px ${s.color.text}` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <s.icon className="h-4 w-4" style={{ color: active ? s.color.text : "var(--text-muted)" }} />
                      <span className="text-sm font-bold" style={{ color: active ? s.color.text : "var(--text-white)" }}>{s.label}</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <label className="section-label">
            <Gauge className="h-3.5 w-3.5 text-violet-400" /> Complexity
          </label>
          <div className="grid grid-cols-3 gap-3 mt-1">
            {COMPLEXITY.map((c) => {
              const active = complexity === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setComplexity(c.id)}
                  className="relative flex flex-col items-center gap-3 rounded-xl border text-center transition-all duration-300"
                  style={{
                    padding: "20px 16px", borderColor: active ? "rgba(168,85,247,0.35)" : "var(--border-dim)",
                    background: active ? "rgba(168,85,247,0.07)" : "var(--bg-inset)", boxShadow: active ? "0 0 24px rgba(168,85,247,0.12)" : "none",
                  }}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className={`text-xs font-bold ${active ? "text-violet-400" : "text-white"}`}>{c.label}</span>
                  <span className="text-[10.5px] leading-snug" style={{ color: "var(--text-secondary)" }}>{c.desc}</span>
                  {active && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-violet-400 anim-pulse" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
            <CircleDot className="h-3.5 w-3.5 text-emerald-400" />
            <span><strong className="text-white">{selectedStack?.label}</strong> · {complexity} complexity</span>
          </div>
          <button
            onClick={startBuild}
            disabled={!idea.trim()}
            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:brightness-110 active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:saturate-50"
          >
            <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-8deg]" />
            🚀 Build App
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     RENDER: REAL-TIME BUILDER DASHBOARD (building / done)
     ════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-[85vh] rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-void)] shadow-2xl overflow-hidden anim-fade-in relative z-10">
      
      {/* ── Dashboard Top Bar ─────────────────────────────── */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border-dim)] bg-[var(--bg-surface)]/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <Hammer className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-white truncate max-w-[200px]">{idea}</span>
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {selectedStack?.label} · {complexity}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: "var(--text-secondary)" }}>
              {stage === "building" ? "Generating Application..." : stage === "deploying" ? "Deploying Application..." : "Application Ready"}
            </span>
            <span className="text-[10px] font-mono" style={{ color: stage === "done" ? "#34d399" : stage === "deploying" ? "#06b6d4" : "var(--text-muted)" }}>
              {stage === "deploying" ? "99%" : Math.round(progress) + "%"}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
             <div className="h-full rounded-full transition-all duration-300 ease-out"
               style={{ 
                 width: stage === "deploying" ? "99%" : `${progress}%`,
                 background: stage === "done" ? "#34d399" : "linear-gradient(90deg, #10b981, #06b6d4)",
                 boxShadow: stage === "done" ? "0 0 8px rgba(52,211,153,0.4)" : "0 0 10px rgba(6,182,212,0.4)" 
               }} 
             />
          </div>
        </div>

        <div>
          <button onClick={reset} className="btn-ghost flex items-center gap-2 px-3 py-1.5 text-[11.5px]">
            <X className="h-3 w-3" /> Close
          </button>
        </div>
      </div>

      {/* ── Three Panel Layout ─────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: File Tree & Steps (25%) */}
        <div className="w-64 flex flex-col border-r border-[var(--border-dim)] bg-[var(--bg-inset)]">
          {/* File Tree */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[var(--border-dim)] shrink-0">
              <FolderTree className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white">Files</span>
              <span className="ml-auto text-[10px] font-mono text-emerald-500/70">{visibleFiles.length} / {appData.files.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <FileTree 
                 nodes={currentStructure} 
                 activeFilePath={activeFile?.path}
                 onSelect={(path) => {
                   const f = visibleFiles.find(file => file.path === path);
                   if (f) setActiveFile(f);
                 }}
              />
            </div>
          </div>
          
          {/* Logs Terminal (Bottom Left) */}
          <div className="h-48 flex flex-col border-t border-[var(--border-dim)] bg-[#03050f]/80 shrink-0">
            <div className="px-4 py-2 border-b border-[var(--border-dim)] flex items-center gap-2">
              <Terminal className="h-3 w-3 text-cyan-400" />
              <span className="text-[10px] font-mono text-white">builder_logs.sh</span>
            </div>
            <div ref={logRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
              {buildLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 anim-fade-in text-[10.5px] font-mono" style={{ color: log.includes("✓") || log.includes("successful") ? "#34d399" : "var(--text-secondary)" }}>
                  <span style={{ color: "rgba(107,112,160,0.5)" }}>&gt;</span>
                  {log}
                </div>
              ))}
              {(stage === "building" || stage === "deploying") && (
                <div className="flex items-center gap-2 text-[10.5px] font-mono">
                  <span style={{ color: "rgba(107,112,160,0.5)" }}>&gt;</span>
                  <span className="inline-block h-3 w-1.5 bg-emerald-400 anim-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Code Editor (40%) */}
        <div className="flex-1 flex flex-col min-w-[300px] border-r border-[var(--border-dim)] bg-[#0A0D15]">
          {/* Editor Header */}
          <div className="flex items-center px-4 py-2.5 border-b border-[var(--border-dim)] bg-[#06080D]">
            <Code2 className="h-4 w-4 text-cyan-400 mr-2" />
            <span className="text-xs font-mono text-white mr-auto">{activeFile ? activeFile.path : "Awaiting agent..."}</span>
            {activeFile && (
              <button onClick={() => copyCmd(activeFile.code)} className="p-1 hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>
                 {copiedCmd ? <Check className="h-3.5 w-3.5 text-emerald-400"/> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
          {/* Editor Body */}
          <div className="flex-1 overflow-y-auto p-4 code-scroll">
            {activeFile ? (
              <pre className="text-[12px] leading-relaxed font-mono">
                {activeFile.code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    <span className="inline-block w-8 shrink-0 text-right pr-4 select-none" style={{ color: "rgba(107,112,160,0.3)" }}>
                      {i + 1}
                    </span>
                    <CodeLine line={line} />
                  </div>
                ))}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                <FileCode2 className="h-10 w-10 mb-3" />
                <p className="font-mono text-[11px]">System is mapping file architecture...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Preview (35%) */}
        <div className="flex-1 min-w-[300px] flex flex-col bg-slate-900 relative">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e293b] bg-slate-900 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="ml-3 flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1 border border-slate-700">
                <Monitor className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] font-mono text-slate-300">localhost:{appPort}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#34d399] flex items-center gap-1.5">
                 {stage === "done" ? <><div className="h-1.5 w-1.5 rounded-full bg-[#34d399]"></div> Live Preview</> : <Loader2 className="h-3 w-3 animate-spin"/>}
               </span>
            </div>
          </div>
          
          <div className="flex-1 relative bg-[var(--bg-void)] overflow-hidden">
            {stage === "deploying" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                 <div className="relative mb-6">
                   <div className="absolute inset-0 bg-cyan-500/20 blur-[30px] rounded-full animate-pulse" />
                   <Loader2 className="h-12 w-12 text-cyan-500/50 relative z-10 animate-spin" />
                 </div>
                 <p className="text-sm font-medium text-white">{deployPhase}</p>
                 <div className="mt-4 flex gap-1">
                   {[...Array(3)].map((_, i) => (
                     <div key={i} className="h-1.5 w-1.5 rounded-full bg-cyan-500/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                   ))}
                 </div>
              </div>
            ) : stage === "done" ? (
              appData.previewError ? (
                <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 p-6 text-center shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                    <AlertCircle className="h-8 w-8 text-rose-500" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Build Pipeline Error</h2>
                  <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                    The builder encountered a fatal syntax issue or incomplete component generation.
                    <br/><br/>
                    <span className="font-mono text-rose-400 bg-rose-500/5 px-2 py-1.5 rounded inline-block text-left text-xs">
                      {appData.previewError}
                    </span>
                  </p>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Builder
                  </button>
                </div>
              ) : cspBlocked ? (
                <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 p-6 text-center shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Embedded preview blocked</h2>
                  <p className="text-sm text-slate-400 max-w-md mb-7 leading-relaxed">
                    The generated Dev Server on port <strong>{appPort}</strong> rejects embedded rendering due to strict `X-Frame-Options` or Content Security Policy rules.
                  </p>
                  <button
                    onClick={openExternalFallback}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/25"
                  >
                    <Eye className="h-4 w-4" />
                    Open external preview
                  </button>
                </div>
              ) : (
                <ErrorBoundary onRetry={reset}>
                  <iframe 
                    srcDoc={appData.previewHtml} 
                    className="w-full h-full border-none anim-fade-up bg-white" 
                    title="Live Preview"
                  />
                </ErrorBoundary>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                 <div className="relative mb-6">
                   <div className="absolute inset-0 bg-violet-500/20 blur-[30px] rounded-full animate-pulse" />
                   <Code2 className="h-12 w-12 text-violet-400/50 relative z-10" />
                 </div>
                 <p className="text-sm font-medium text-slate-400">Builder engine inactive</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Utilities ────────────────────────────────────────────────── */

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
          path: isFile ? path : undefined, // Attach path so we can click
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

function FileTree({ nodes, depth = 0, activeFilePath, onSelect }) {
  return (
    <div className={depth > 0 ? "ml-4 border-l border-[var(--border-dim)] pl-3" : ""}>
      {nodes.map((node, i) => (
        <div key={i}>
          <div 
            className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors group
              ${activeFilePath === node.path ? "bg-emerald-500/10" : "hover:bg-[var(--bg-surface)]"}
            `}
            onClick={() => node.type === "file" && onSelect(node.path)}
          >
            {node.type === "dir" ? (
              <>
                <ChevronRight className="h-3 w-3 shrink-0" style={{ color: "var(--text-muted)" }} />
                <Folder className="h-3.5 w-3.5 shrink-0 text-amber-400/80" />
                <span className="text-[11.5px] text-amber-100/90 font-medium truncate">{node.name}</span>
              </>
            ) : (
              <>
                <span className="w-3 shrink-0" />
                <File className="h-3 w-3 shrink-0" style={{ color: activeFilePath === node.path ? "#34d399" : "var(--text-muted)" }} />
                <span className={`text-[11px] truncate transition-colors font-mono
                  ${activeFilePath === node.path ? "text-emerald-400" : "text-[var(--text-secondary)] group-hover:text-emerald-200"}
                `}>
                  {node.name}
                </span>
              </>
            )}
          </div>
          {node.children && node.children.length > 0 && (
            <FileTree nodes={node.children} depth={depth + 1} activeFilePath={activeFilePath} onSelect={onSelect} />
          )}
        </div>
      ))}
    </div>
  );
}

function CodeLine({ line }) {
  const highlighted = line
    .replace(/(\/\/.*)$/gm, '<span style="color:#6b70a0">$1</span>')
    .replace(/(#.*)$/gm, '<span style="color:#6b70a0">$1</span>')
    .replace(/('[^']*')/g, '<span style="color:#34d399">$1</span>')
    .replace(/("[^"]*")/g, '<span style="color:#34d399">$1</span>')
    .replace(/(`[^`]*`)/g, '<span style="color:#34d399">$1</span>')
    .replace(/\b(const|let|var|function|return|import|from|export|default|class|def|if|else|for|while|try|catch|async|await|require|version|services|build|ports|environment|image)\b/g, '<span style="color:#c084fc">$1</span>')
    .replace(/\b(app|console|process|self|True|False|None)\b/g, '<span style="color:#22d3ee">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/(&lt;[a-zA-Z0-9]+)/g, '<span style="color:#22d3ee">$1</span>')
    .replace(/(&lt;\/[a-zA-Z0-9]+&gt;)/g, '<span style="color:#22d3ee">$1</span>');

  return (
    <span
      style={{ color: "#E2E8F0" }}
      dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
    />
  );
}
