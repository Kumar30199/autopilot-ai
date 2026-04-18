import { useState } from "react";
import {
  Play, Map, Loader2, CheckCircle, XCircle,
  Clock, ArrowRight, Zap, RotateCcw,
  ChevronDown, ChevronRight, Terminal, Layers,
} from "lucide-react";

const PIPELINE = [
  { id: "plan",    label: "Plan",    endpoint: "plan",    color: "#818cf8", bg: "rgba(99,102,241,0.07)" },
  { id: "execute", label: "Execute", endpoint: "execute", color: "#34d399", bg: "rgba(16,185,129,0.07)" },
];

export default function ExecutionMode({ dispatch, agentLoading, lastResult, history, systemStatus }) {
  const [task, setTask] = useState("");
  const [pipelineResults, setPipelineResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [expandedStep, setExpandedStep] = useState(null);

  const runPipeline = async () => {
    if (!task.trim()) return;
    setRunning(true);
    setPipelineResults([]);

    const results = [];
    for (let i = 0; i < PIPELINE.length; i++) {
      setCurrentStep(i);
      const step = PIPELINE[i];
      const context = results.length > 0 ? { previous: results[results.length - 1] } : {};
      const r = await dispatch(step.endpoint, task, context);
      results.push({ ...step, result: r, timestamp: Date.now() });
      setPipelineResults([...results]);
    }

    setCurrentStep(-1);
    setRunning(false);
  };

  const resetPipeline = () => {
    setPipelineResults([]);
    setCurrentStep(-1);
    setTask("");
  };

  const pendingExec = running && currentStep >= 0 ? {
    id: "pending",
    agent: PIPELINE[currentStep]?.label === "Plan" ? "Planner" : "Executor",
    status: "running",
    prompt: task,
    duration_ms: "—",
    timestamp: Date.now()
  } : null;

  const resolvedExecs = history.filter(h => h.agent === "Executor" || h.agent === "Planner").reverse();
  const recentExecs = pendingExec ? [pendingExec, ...resolvedExecs].slice(0, 5) : resolvedExecs.slice(0, 5);

  return (
    <div className="section-stack">

      {/* ── Mode Header ──────────────────────────────────────── */}
      <div className="mode-header glass neon-border-violet">
        <div className="mode-header__orb-1" style={{ background: "rgba(168,85,247,0.07)" }} />
        <div className="mode-header__orb-2" style={{ background: "rgba(16,185,129,0.05)" }} />
        <div className="mode-header__content">
          <div className="mode-header__icon anim-float" style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)" }}>
            <Play className="h-6 w-6 text-violet-400" />
          </div>
          <div className="mode-header__text">
            <h1>Execution <span className="neon-text-violet">Mode</span></h1>
            <p>Run multi-step agent pipelines. The Planner creates a strategy, then the Executor carries it out.</p>
          </div>
        </div>
      </div>

      {/* ── Task + Pipeline ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5" style={{ alignItems: "start" }}>

        {/* Left: Input + Pipeline */}
        <div className="xl:col-span-3 section-stack">

          {/* Input */}
          <div className="panel">
            <label className="section-label">
              <Terminal className="h-3.5 w-3.5" />
              Task Description
            </label>
            <div className="input-row">
              <input
                id="execution-input"
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runPipeline()}
                placeholder="Describe the task to plan and execute..."
                disabled={running}
                className="flex-1 input-base input-glow-violet"
              />
              <button
                id="btn-run-pipeline"
                onClick={runPipeline}
                disabled={running || !task.trim()}
                className="btn btn-violet"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                Execute Pipeline
              </button>
              {pipelineResults.length > 0 && !running && (
                <button
                  id="btn-reset-pipeline"
                  onClick={resetPipeline}
                  className="btn-ghost"
                  style={{ padding: "0 14px" }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="panel">
            <div className="panel-header" style={{ borderBottom: "none", paddingBottom: "8px", marginBottom: "16px" }}>
              <h3 className="panel-header__title">
                <Layers className="h-4 w-4 text-violet-400" />
                Pipeline
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {PIPELINE.map((step, i) => {
                const result = pipelineResults[i];
                const isCurrent = currentStep === i;
                const isComplete = !!result;
                const isSuccess = result?.result?.status === "success";

                return (
                  <div key={step.id}>
                    {/* Step card */}
                    <div
                      className={`relative rounded-xl border transition-all duration-500 ${
                        isCurrent
                          ? "border-violet-500/40 bg-violet-500/[0.05] shadow-lg shadow-violet-500/10 anim-border-glow"
                          : isComplete
                            ? isSuccess
                              ? "border-emerald-500/25 bg-emerald-500/[0.03]"
                              : "border-rose-500/25 bg-rose-500/[0.03]"
                            : "border-[var(--border-dim)] bg-[var(--bg-inset)]"
                      }`}
                      style={{ padding: "16px" }}
                    >
                      <div className="flex items-center gap-3">
                        {/* Step number */}
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold shrink-0"
                          style={{
                            background: isCurrent ? "rgba(168,85,247,0.15)" : step.bg,
                            color: step.color,
                            border: `1px solid ${isCurrent ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.04)"}`,
                          }}
                        >
                          {isCurrent ? (
                            <Loader2 className="h-4 w-4 animate-spin" style={{ color: step.color }} />
                          ) : isComplete ? (
                            isSuccess ? (
                              <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4.5 w-4.5 text-rose-400" />
                            )
                          ) : (
                            i + 1
                          )}
                        </div>

                        {/* Step info */}
                        <div className="flex-1">
                          <p className="text-[13.5px] font-semibold text-white">{step.label} Agent</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            {isCurrent ? "Running..." : isComplete ? `Completed in ${result.result.duration_ms}ms` : "Pending"}
                          </p>
                        </div>

                        {/* Duration */}
                        {isComplete && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
                            <span className="font-mono text-[10.5px]" style={{ color: "var(--text-muted)" }}>{result.result.duration_ms}ms</span>
                          </div>
                        )}

                        {/* Expand */}
                        {isComplete && (
                          <button
                            onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                            className="rounded-lg p-2 transition-all duration-200 hover:bg-[var(--bg-surface)]"
                            style={{ color: "var(--text-muted)" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-white)"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                          >
                            {expandedStep === i ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        )}
                       </div>

                      {/* Expanded result */}
                      {expandedStep === i && result && (
                        <div className="mt-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-void)] p-4 anim-fade-up">
                          <pre className="text-[11px] leading-relaxed overflow-x-auto" style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                            {JSON.stringify(result.result.result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Connector */}
                    {i < PIPELINE.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="flex flex-col items-center">
                          <div className={`h-4 w-px ${isComplete ? "bg-emerald-500/40" : "bg-[var(--border-dim)]"}`} />
                          <ArrowRight className={`h-3 w-3 rotate-90 ${isComplete ? "text-emerald-400/50" : "text-[var(--text-muted)]"}`} style={{ opacity: 0.5 }} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="xl:col-span-2">
          <div className="panel sticky top-6" style={{ display: "flex", flexDirection: "column" }}>
            <div className="panel-header">
              <h3 className="panel-header__title">
                <Clock className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
                Recent Executions
              </h3>
            </div>
            {recentExecs.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 24px" }}>
                <div className="empty-state__icon" style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.15)" }}>
                  <Play className="h-7 w-7" style={{ color: "rgba(168,85,247,0.5)" }} />
                </div>
                <p className="empty-state__title">No executions yet</p>
                <p className="empty-state__text">Run a pipeline to see execution history</p>
              </div>
            ) : (
              <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {recentExecs.map((h, i) => (
                  <div key={h.id || i} className="anim-fade-up flex items-center gap-3 rounded-xl border border-[var(--border-dim)] bg-[var(--bg-inset)] px-4 py-3.5 transition-all hover:border-[var(--border-subtle)]" style={{ opacity: 0 }}>
                    {h.status === "running" ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 text-violet-400 animate-spin" />
                    ) : h.status === "success" ? (
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-white">{h.agent}</p>
                      <p className="truncate text-[10.5px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{h.prompt}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {h.duration_ms}{h.status !== "running" ? "ms" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
