import { useState, useEffect, useRef } from "react";
import {
  Map, Search, BarChart3, Play, Hammer,
  CheckCircle, Loader2, Clock, XCircle,
  ChevronDown, ChevronUp, Zap, Activity,
  ArrowDown, TerminalSquare, RotateCcw,
} from "lucide-react";

/* ── Agent Definition ─────────────────────────────────────────── */
const AGENTS = [
  {
    id: "plan",
    endpoint: "plan",
    name: "Planning Agent",
    role: "Decomposes your goal into ordered steps",
    icon: Map,
    color: { text: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.28)", glow: "rgba(99,102,241,0.2)" },
    outputKey: "result",
    buildLog: ["Parsing goal intent...", "Mapping sub-tasks...", "Ordering execution steps..."],
  },
  {
    id: "research",
    endpoint: "research",
    name: "Research Agent",
    role: "Gathers key intelligence and references",
    icon: Search,
    color: { text: "#22d3ee", bg: "rgba(0,240,255,0.07)", border: "rgba(0,240,255,0.28)", glow: "rgba(0,240,255,0.15)" },
    outputKey: "result",
    buildLog: ["Querying knowledge base...", "Fetching references...", "Compiling findings..."],
  },
  {
    id: "analyze",
    endpoint: "analyze",
    name: "Analysis Agent",
    role: "Extracts insights through deep reasoning",
    icon: BarChart3,
    color: { text: "#c084fc", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.28)", glow: "rgba(168,85,247,0.15)" },
    outputKey: "result",
    buildLog: ["Correlating data patterns...", "Running risk assessment...", "Generating insights..."],
  },
  {
    id: "execute",
    endpoint: "execute",
    name: "Execution Agent",
    role: "Processes and completes each planned step",
    icon: Play,
    color: { text: "#34d399", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.28)", glow: "rgba(16,185,129,0.15)" },
    outputKey: "result",
    buildLog: ["Initializing runtime...", "Processing tasks sequentially...", "Validating outputs..."],
  },
  {
    id: "build",
    endpoint: "build",
    name: "Builder Agent",
    role: "Scaffolds code, files, and project output",
    icon: Hammer,
    color: { text: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.28)", glow: "rgba(245,158,11,0.15)" },
    outputKey: "result",
    buildLog: ["Selecting tech stack...", "Generating file structure...", "Writing boilerplate code..."],
  },
];

/* ── Status constants ─────────────────────────────────────────── */
const STATUS = { IDLE: "idle", RUNNING: "running", DONE: "done", ERROR: "error" };

/* ════════════════════════════════════════════════════════════════
   WORKFLOW PANEL
   ════════════════════════════════════════════════════════════════ */
export default function WorkflowPanel({ dispatch }) {
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [agentStates, setAgentStates] = useState(
    () => Object.fromEntries(AGENTS.map((a) => [a.id, { status: STATUS.IDLE, output: null, log: [], expanded: false }]))
  );
  const [activeAgent, setActiveAgent] = useState(null);
  const [done, setDone] = useState(false);
  const logRefs = useRef({});

  /* auto-scroll logs */
  useEffect(() => {
    Object.entries(logRefs.current).forEach(([id, el]) => {
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [agentStates]);

  /* ── Update a single agent's state ────────────────────────── */
  const updateAgent = (id, patch) =>
    setAgentStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  /* ── Stream fake log lines for an agent ───────────────────── */
  const streamLogs = (agentDef) =>
    new Promise((resolve) => {
      const lines = agentDef.buildLog;
      let i = 0;
      const iv = setInterval(() => {
        if (i < lines.length) {
          updateAgent(agentDef.id, { log: agentDef.buildLog.slice(0, i + 1) });
          i++;
        } else {
          clearInterval(iv);
          resolve();
        }
      }, 350);
    });

  /* ── Run the full pipeline sequentially ───────────────────── */
  const runPipeline = async () => {
    if (!goal.trim()) return;
    setRunning(true);
    setDone(false);

    // Reset all agent states
    setAgentStates(
      Object.fromEntries(AGENTS.map((a) => [a.id, { status: STATUS.IDLE, output: null, log: [], expanded: false }]))
    );

    let sharedContext = {};

    for (const agent of AGENTS) {
      setActiveAgent(agent.id);
      updateAgent(agent.id, { status: STATUS.RUNNING, log: [] });

      // Stream fake logs in parallel with the real request
      const [, response] = await Promise.all([
        streamLogs(agent),
        dispatch(agent.endpoint, goal, sharedContext),
      ]);

      // Append final backend log
      const finalLog = response?.status === "success"
        ? `✓ ${agent.name} completed successfully`
        : `✗ ${agent.name} encountered an error`;

      if (response?.status === "success") {
        sharedContext = { ...sharedContext, ...response.result };
        updateAgent(agent.id, {
          status: STATUS.DONE,
          output: response.result,
          log: [...agent.buildLog, finalLog],
          expanded: false,
        });
      } else {
        updateAgent(agent.id, {
          status: STATUS.ERROR,
          output: response,
          log: [...agent.buildLog, finalLog],
        });
        break;
      }
    }

    setActiveAgent(null);
    setRunning(false);
    setDone(true);
  };

  /* ── Reset ─────────────────────────────────────────────────── */
  const reset = () => {
    setGoal("");
    setRunning(false);
    setDone(false);
    setActiveAgent(null);
    setAgentStates(
      Object.fromEntries(AGENTS.map((a) => [a.id, { status: STATUS.IDLE, output: null, log: [], expanded: false }]))
    );
  };

  const completedCount = Object.values(agentStates).filter((s) => s.status === STATUS.DONE).length;

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div className="section-stack">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="mode-header glass neon-border-cyan">
        <div className="mode-header__orb-1" style={{ background: "rgba(0,240,255,0.06)" }} />
        <div className="mode-header__orb-2" style={{ background: "rgba(168,85,247,0.05)" }} />
        <div className="mode-header__content">
          <div className="mode-header__icon anim-float" style={{ background: "rgba(0,240,255,0.12)", border: "1px solid rgba(0,240,255,0.25)" }}>
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
          <div className="mode-header__text" style={{ flex: 1 }}>
            <h1>Agent <span className="neon-text-cyan">Workflow</span></h1>
            <p>Run all 5 agents in sequence — watch the pipeline animate step-by-step in real time.</p>
          </div>
          {/* Global progress */}
          {running && (
            <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {completedCount} / {AGENTS.length}
            </div>
          )}
          {done && (
            <button onClick={reset} className="btn-ghost" style={{ height: "36px", fontSize: "11px" }}>
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>

        {/* Overall progress bar */}
        {(running || done) && (
          <div className="relative mt-6 h-1.5 w-full rounded-full bg-[var(--bg-void)] overflow-hidden">
            <div
              className="h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${(completedCount / AGENTS.length) * 100}%`,
                background: "linear-gradient(90deg, #6366f1, #00f0ff, #10b981)",
                boxShadow: "0 0 14px rgba(0,240,255,0.4)",
              }}
            />
            {running && <div className="absolute inset-0 anim-shimmer rounded-full" />}
          </div>
        )}
      </div>

      {/* ── Goal Input ──────────────────────────────────────── */}
      {!running && !done && (
        <div className="panel anim-fade-up">
          <label className="section-label">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            Pipeline Goal
          </label>
          <textarea
            id="workflow-goal-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={"Enter your goal and all 5 agents will process it sequentially...\n\nExample: Build a real-time analytics dashboard with user authentication."}
            rows={4}
            className="input-base input-glow"
            style={{ height: "auto", padding: "14px 16px", resize: "none", lineHeight: 1.6 }}
          />
          <div className="mt-4 flex justify-end">
            <button
              id="btn-run-pipeline"
              onClick={runPipeline}
              disabled={!goal.trim()}
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 hover:brightness-110 active:scale-[0.97] disabled:opacity-35 disabled:cursor-not-allowed disabled:saturate-50"
            >
              <Activity className="h-4 w-4 transition-transform group-hover:scale-110" />
              Run Full Pipeline
            </button>
          </div>
        </div>
      )}

      {/* ── Pipeline Cards ──────────────────────────────────── */}
      <div className="section-stack-tight">
        {AGENTS.map((agent, idx) => {
          const state = agentStates[agent.id];
          const Icon = agent.icon;
          const isActive = activeAgent === agent.id;
          const isDone = state.status === STATUS.DONE;
          const isError = state.status === STATUS.ERROR;
          const isIdle = state.status === STATUS.IDLE;

          return (
            <div key={agent.id} className="anim-fade-up" style={{ animationDelay: `${idx * 80}ms`, opacity: 0 }}>
              {/* ── Agent Card ─────────────────────────────── */}
              <div
                id={`workflow-agent-${agent.id}`}
                className="relative overflow-hidden rounded-2xl border transition-all duration-500"
                style={{
                  background: isActive
                    ? agent.color.bg
                    : isDone
                    ? agent.color.bg
                    : "var(--bg-inset)",
                  borderColor: isActive
                    ? agent.color.border
                    : isDone
                    ? `${agent.color.border}88`
                    : isError
                    ? "rgba(244,63,94,0.28)"
                    : "var(--border-dim)",
                  boxShadow: isActive ? `0 0 28px ${agent.color.glow}` : isDone ? `0 0 14px ${agent.color.glow}66` : "none",
                }}
              >
                {/* Shimmer overlay when running */}
                {isActive && <div className="absolute inset-0 anim-shimmer pointer-events-none" />}

                {/* Card Header */}
                <div className="flex items-center gap-4" style={{ padding: "20px" }}>
                  {/* Step number + icon */}
                  <div className="relative shrink-0">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-500"
                      style={{
                        background: isDone || isActive ? agent.color.bg : "var(--bg-surface)",
                        border: `1px solid ${isDone || isActive ? agent.color.border : "var(--border-dim)"}`,
                      }}
                    >
                      {isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: agent.color.text }} />
                      ) : isDone ? (
                        <CheckCircle className="h-5 w-5" style={{ color: agent.color.text }} />
                      ) : isError ? (
                        <XCircle className="h-5 w-5 text-rose-400" />
                      ) : (
                        <Icon className="h-5 w-5" style={{ color: isIdle ? "var(--text-muted)" : agent.color.text }} />
                      )}
                    </div>
                    {/* Ping ring when active */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-xl anim-ping"
                        style={{ color: agent.color.text, border: `1px solid currentColor` }}
                      />
                    )}
                  </div>

                  {/* Agent info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="text-[13.5px] font-bold"
                        style={{ color: isActive || isDone ? agent.color.text : isIdle ? "var(--text-secondary)" : "var(--text-white)" }}
                      >
                        {agent.name}
                      </span>
                      <StatusBadge status={state.status} color={agent.color.text} />
                    </div>
                    <p className="text-[11.5px] mt-1" style={{ color: "var(--text-secondary)" }}>{agent.role}</p>

                    {/* Log stream when active */}
                    {isActive && state.log.length > 0 && (
                      <p className="mt-2 text-[10.5px] font-mono text-cyan-400/90 anim-fade-in">
                        ▸ {state.log[state.log.length - 1]}
                      </p>
                    )}
                  </div>

                  {/* Right side: expand toggle (only when done) */}
                  {isDone && (
                    <button
                      id={`workflow-expand-${agent.id}`}
                      onClick={() => updateAgent(agent.id, { expanded: !state.expanded })}
                      className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[var(--border-dim)] px-3 py-2 text-[10.5px] font-medium transition-all"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-white)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-dim)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      {state.expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {state.expanded ? "Hide" : "Output"}
                    </button>
                  )}
                </div>

                {/* ── Progress bar while running ──────────── */}
                {isActive && (
                  <div style={{ padding: "0 20px 12px" }}>
                    <div className="h-1 w-full rounded-full bg-[var(--bg-void)] overflow-hidden">
                      <div
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: `${(state.log.length / agent.buildLog.length) * 100}%`,
                          background: agent.color.text,
                          boxShadow: `0 0 10px ${agent.color.text}`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* ── Log Terminal (always visible when active) ─ */}
                {isActive && (
                  <div
                    ref={(el) => (logRefs.current[agent.id] = el)}
                    className="mx-5 mb-5 rounded-xl overflow-hidden border border-[var(--border-dim)]"
                  >
                    <div className="terminal-header">
                      <div className="terminal-dots">
                        <span /><span /><span />
                      </div>
                      <span className="terminal-title">{agent.id}-agent — stdout</span>
                    </div>
                    <div className="max-h-28 overflow-y-auto" style={{ padding: "12px", background: "rgba(3,5,15,0.5)" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {state.log.map((line, i) => (
                          <div key={i} className="flex items-start gap-2 anim-fade-in">
                            <span className="text-[9px] font-mono select-none w-3 text-right" style={{ color: "rgba(107,112,160,0.5)" }}>{i + 1}</span>
                            <span className="text-[9px] font-mono select-none" style={{ color: "rgba(107,112,160,0.6)" }}>$</span>
                            <span className={`text-[10.5px] font-mono ${line.includes("✓") || line.includes("✗") ? "" : ""}`}
                              style={{ color: line.includes("✓") ? agent.color.text : line.includes("✗") ? "#f43f5e" : "var(--text-secondary)" }}
                            >
                              {line}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <span className="w-3" />
                          <span className="inline-block h-3 w-1 anim-pulse" style={{ background: agent.color.text }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Expanded Output Panel ────────────────── */}
                {state.expanded && isDone && state.output && (
                  <div className="border-t border-[var(--border-dim)]">
                    <OutputPanel data={state.output} color={agent.color} agentId={agent.id} />
                  </div>
                )}
              </div>

              {/* ── Connector Arrow ─────────────────────────── */}
              {idx < AGENTS.length - 1 && (
                <div className="flex justify-center" style={{ margin: "4px 0" }}>
                  <ConnectorLine active={isActive || isDone} color={agent.color.text} nextActive={activeAgent === AGENTS[idx + 1]?.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Done Banner ─────────────────────────────────────── */}
      {done && (
        <div className="panel neon-border-emerald anim-fade-up">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white">Pipeline Complete!</h3>
              <p className="text-[12.5px] mt-1" style={{ color: "var(--text-secondary)" }}>
                All {AGENTS.length} agents executed successfully. Expand any agent card to view its output.
              </p>
            </div>
            <button
              onClick={reset}
              className="ml-auto btn-ghost"
              style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.25)", color: "#34d399" }}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Run Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ── Status Badge ─────────────────────────────────────────────── */
function StatusBadge({ status, color }) {
  const config = {
    [STATUS.IDLE]:    { label: "Idle",      bg: "rgba(107,112,160,0.15)",  textColor: "var(--text-muted)" },
    [STATUS.RUNNING]: { label: "Running",   bg: "rgba(0,240,255,0.1)",    textColor: "#22d3ee" },
    [STATUS.DONE]:    { label: "Completed", bg: "rgba(16,185,129,0.12)",  textColor: "#34d399" },
    [STATUS.ERROR]:   { label: "Error",     bg: "rgba(244,63,94,0.12)",   textColor: "#f43f5e" },
  }[status] || {};

  return (
    <span
      className="badge"
      style={{ background: config.bg, color: config.textColor, fontSize: "9px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}
    >
      {status === STATUS.RUNNING && <span className="inline-block h-1.5 w-1.5 rounded-full anim-pulse" style={{ background: "#22d3ee" }} />}
      {status === STATUS.DONE && <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#34d399" }} />}
      {config.label}
    </span>
  );
}


/* ── Connector Line with animated data particle ───────────────── */
function ConnectorLine({ active, color, nextActive }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative h-8 w-px overflow-visible">
        {/* Static line */}
        <div
          className="absolute inset-0 w-px rounded-full transition-colors duration-500"
          style={{ background: active ? `${color}70` : "var(--border-dim)" }}
        />
        {/* Flowing particle */}
        {(active || nextActive) && (
          <div
            className="absolute left-1/2 -translate-x-1/2 h-3 w-px rounded-full anim-flow"
            style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
          />
        )}
      </div>
      <ArrowDown
        className="h-3 w-3 transition-colors duration-500"
        style={{ color: active ? color : "var(--text-muted)", opacity: active ? 0.7 : 0.3 }}
      />
    </div>
  );
}


/* ── Expanded Output Panel ────────────────────────────────────── */
function OutputPanel({ data, color, agentId }) {
  if (!data) return null;

  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return (
        <ul style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
          {val.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[11.5px]" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: color.text }} className="shrink-0">▸</span>
              <span>{typeof item === "object" ? JSON.stringify(item) : String(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (typeof val === "object" && val !== null) {
      return (
        <pre className="text-[10.5px] font-mono whitespace-pre-wrap leading-relaxed mt-1 max-h-32 overflow-y-auto" style={{ color: "var(--text-secondary)" }}>
          {JSON.stringify(val, null, 2)}
        </pre>
      );
    }
    return <p className="text-[11.5px] mt-1" style={{ color: "var(--text-secondary)" }}>{String(val)}</p>;
  };

  return (
    <div className="anim-fade-up" style={{ padding: "20px" }}>
      <div className="flex items-center gap-2 mb-4">
        <TerminalSquare className="h-3.5 w-3.5" style={{ color: color.text }} />
        <span className="text-xs font-bold" style={{ color: color.text }}>Agent Output</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(data).map(([key, val]) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border-dim)] bg-[var(--bg-inset)]"
            style={{ padding: "14px" }}
          >
            <p
              className="text-[9.5px] font-bold uppercase tracking-widest"
              style={{ color: color.text, marginBottom: "6px" }}
            >
              {key.replace(/_/g, " ")}
            </p>
            {renderValue(val)}
          </div>
        ))}
      </div>
    </div>
  );
}
