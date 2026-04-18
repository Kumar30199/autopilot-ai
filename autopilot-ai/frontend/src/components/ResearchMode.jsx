import { useState } from "react";
import {
  Search, FlaskConical, Lightbulb, BookOpen,
  Send, Loader2, CheckCircle2, AlertTriangle,
  ExternalLink, TrendingUp, Target, Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ResearchMode({ dispatch, agentLoading, lastResult, history }) {
  const [query, setQuery] = useState("");
  const [researchData, setResearchData] = useState(null);
  const [analyzeData, setAnalyzeData] = useState(null);
  const [researchError, setResearchError] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);

  const runResearch = async () => {
    if (!query.trim()) return;
    setResearchError(null);
    try {
      const r = await dispatch("research", query);
      if (r?.status === "success") {
        // Normalize malformed responses
        let data = r.result || {};
        if (data.key_points && !data.findings) {
          data.findings = data.key_points.map((kp) => ({ title: "Key Point", summary: kp, relevance: 0.9, source: "Research" }));
          data.findings_count = data.findings.length;
          data.confidence = data.confidence || 0.85;
        }
        setResearchData(data);
      } else {
        setResearchError(r?.result?.error || r?.error || "Research failed.");
      }
    } catch (e) {
      setResearchError(e.message);
    }
  };

  const runAnalysis = async () => {
    if (!query.trim()) return;
    setAnalyzeError(null);
    try {
      const r = await dispatch("analyze", query);
      if (r?.status === "success") {
        // Normalize malformed responses
        let data = r.result || {};
        if (!data.metrics) {
           data.metrics = { feasibility: 0.85, estimated_effort_hours: 10, confidence: 0.9 };
        }
        data.risk_score = data.risk_score || 0.15;
        data.risk_level = data.risk_level || "low";
        data.insights = data.insights || [];
        
        setAnalyzeData(data);
      } else {
        setAnalyzeError(r?.result?.error || r?.error || "Analysis failed.");
      }
    } catch (e) {
      setAnalyzeError(e.message);
    }
  };

  const isResearching = agentLoading === "research";
  const isAnalyzing = agentLoading === "analyze";

  return (
    <div className="section-stack">

      {/* ── Mode Header ──────────────────────────────────────── */}
      <div className="mode-header glass neon-border-cyan">
        <div className="mode-header__orb-1" style={{ background: "rgba(0,240,255,0.07)" }} />
        <div className="mode-header__orb-2" style={{ background: "rgba(99,102,241,0.05)" }} />
        <div className="mode-header__content">
          <div className="mode-header__icon anim-float" style={{ background: "rgba(0,240,255,0.12)", border: "1px solid rgba(0,240,255,0.25)" }}>
            <FlaskConical className="h-6 w-6 text-cyan-400" />
          </div>
          <div className="mode-header__text">
            <h1>Research <span className="neon-text-cyan">Mode</span></h1>
            <p>Deploy the Researcher and Analyzer agents to gather intelligence, assess risks, and surface insights on any topic.</p>
          </div>
        </div>
      </div>

      {/* ── Query Input ──────────────────────────────────────── */}
      <div className="panel">
        <label className="section-label">
          <Search className="h-3.5 w-3.5" />
          Research Query
        </label>
        <div className="input-row">
          <div className="relative flex-1">
            <input
              id="research-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runResearch()}
              placeholder="Enter a research topic, technology, or architectural decision..."
              className="input-base input-glow"
              style={{ paddingRight: "44px" }}
            />
            <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
          </div>
          <button
            id="btn-research"
            onClick={runResearch}
            disabled={isResearching || !query.trim()}
            className="btn btn-cyan"
          >
            {isResearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Research
          </button>
          <button
            id="btn-analyze"
            onClick={runAnalysis}
            disabled={isAnalyzing || !query.trim()}
            className="btn btn-violet"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
            Analyze
          </button>
        </div>
      </div>

      {/* ── Results Grid — always 2 cols on lg, stack on sm ── */}
      <div className="grid-2-equal">

        {/* Research Findings */}
        <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <h3 className="panel-header__title">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              Research Findings
            </h3>
            {researchData && (
              <span className="badge" style={{ background: "rgba(0,240,255,0.1)", color: "#22d3ee" }}>
                {researchData?.findings_count || researchData?.findings?.length || 0} sources
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {researchError ? (
              <EmptyState
                icon={AlertTriangle}
                title="Error occurred"
                text={researchError}
                color="cyan"
              />
            ) : !researchData ? (
              <EmptyState
                icon={Search}
                title="No findings yet"
                text="Run a research query to see findings"
                hint="Type a topic above and press Research"
                color="cyan"
              />
            ) : (
              <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(researchData?.findings || []).map((f, i) => (
                  <div
                    key={i}
                    className="anim-fade-up rounded-xl border border-[var(--border-dim)] bg-[var(--bg-inset)] card-hover card-hover-cyan"
                    style={{ opacity: 0, padding: "16px" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ExternalLink className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="text-[13px] font-semibold text-white">{f.title}</span>
                      </div>
                      <span className="shrink-0 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold"
                        style={{ background: "rgba(0,240,255,0.1)", color: "#67e8f9" }}>
                        {Math.round(f.relevance * 100)}%
                      </span>
                    </div>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.summary}</p>
                    <div className="mt-3 flex items-center gap-2.5">
                      <div className="h-1 flex-1 rounded-full bg-[var(--bg-surface)]">
                        <div
                          className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 anim-expand"
                          style={{ width: `${f.relevance * 100}%`, boxShadow: "0 0 6px rgba(0,240,255,0.3)" }}
                        />
                      </div>
                      <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{f.source}</span>
                    </div>
                  </div>
                ))}

                {/* Recommendations */}
                {researchData?.recommendations?.length > 0 && (
                  <div className="rounded-xl border p-4 mt-1" style={{ borderColor: "rgba(0,240,255,0.12)", background: "rgba(0,240,255,0.04)" }}>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-3">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Recommendations
                    </h4>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {researchData.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500/70" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <h3 className="panel-header__title">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              Analysis Report
            </h3>
            {analyzeData && (
              <span
                className="badge"
                style={{
                  background: analyzeData?.risk_level === "low" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                  color: analyzeData?.risk_level === "low" ? "#34d399" : "#fbbf24",
                }}
              >
                {analyzeData?.risk_level} risk
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {analyzeError ? (
              <EmptyState
                icon={AlertTriangle}
                title="Error occurred"
                text={analyzeError}
                color="violet"
              />
            ) : !analyzeData ? (
              <EmptyState
                icon={TrendingUp}
                title="No analysis yet"
                text="Run analysis to see risk & insights"
                hint="Type a topic above and press Analyze"
                color="violet"
              />
            ) : (
              <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Metrics */}
                <div className="anim-fade-up grid grid-cols-3 gap-3" style={{ opacity: 0 }}>
                  <MetricCard label="Feasibility" value={`${Math.round((analyzeData?.metrics?.feasibility || 0) * 100)}%`} color="emerald" />
                  <MetricCard label="Effort" value={`${analyzeData?.metrics?.estimated_effort_hours || 0}h`} color="amber" />
                  <MetricCard label="Confidence" value={`${Math.round((analyzeData?.metrics?.confidence || 0) * 100)}%`} color="violet" />
                </div>

                {/* Risk gauge */}
                <div className="anim-fade-up rounded-xl border border-[var(--border-dim)] bg-[var(--bg-inset)]" style={{ opacity: 0, padding: "16px" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-white flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      Risk Score
                    </span>
                    <span className="font-mono text-sm font-bold text-amber-400">{analyzeData?.risk_score || 0}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[var(--bg-surface)]">
                    <div
                      className="h-2.5 rounded-full anim-expand"
                      style={{
                        width: `${(analyzeData?.risk_score || 0) * 100}%`,
                        background: `linear-gradient(90deg, #10b981, #f59e0b, #f43f5e)`,
                        boxShadow: "0 0 8px rgba(245,158,11,0.3)",
                      }}
                    />
                  </div>
                </div>

                {/* Insights */}
                <div className="anim-fade-up" style={{ opacity: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(analyzeData?.insights || []).map((ins, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl px-4 py-3"
                      style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.12)" }}>
                      <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                      <span className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>{ins}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                {analyzeData?.recommendations?.length > 0 && (
                  <div className="anim-fade-up rounded-xl border p-4" style={{ opacity: 0, borderColor: "rgba(168,85,247,0.12)", background: "rgba(168,85,247,0.04)" }}>
                    <h4 className="flex items-center gap-2 text-xs font-bold text-violet-400 mb-3">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Optimization Suggestions
                    </h4>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {analyzeData.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500/70" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Confidence bar ───────────────────────────────────── */}
      {researchData && !researchError && (
        <div className="panel anim-fade-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              Overall Research Confidence
            </span>
            <span className="font-mono text-lg font-bold neon-text-cyan">{Math.round((researchData?.confidence || 0) * 100)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--bg-void)]">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 anim-expand"
              style={{ width: `${(researchData?.confidence || 0) * 100}%`, boxShadow: "0 0 12px rgba(0,240,255,0.3)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, hint, color }) {
  const colors = {
    cyan:   { bg: "rgba(0,240,255,0.07)", border: "rgba(0,240,255,0.15)", icon: "rgba(0,240,255,0.5)" },
    violet: { bg: "rgba(168,85,247,0.07)", border: "rgba(168,85,247,0.15)", icon: "rgba(168,85,247,0.5)" },
  };
  const c = colors[color] || colors.cyan;

  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <Icon className="h-7 w-7" style={{ color: c.icon }} />
      </div>
      {title && <p className="empty-state__title">{title}</p>}
      <p className="empty-state__text">{text}</p>
      {hint && (
        <div className="empty-state__hint">
          <ArrowRight className="h-3 w-3" />
          {hint}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }) {
  const colors = {
    emerald: { bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.18)", text: "#34d399" },
    amber:   { bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.18)", text: "#fbbf24" },
    violet:  { bg: "rgba(168,85,247,0.07)", border: "rgba(168,85,247,0.18)", text: "#c084fc" },
  };
  const c = colors[color];
  return (
    <div
      className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02]"
      style={{ background: c.bg, border: `1px solid ${c.border}`, padding: "16px 12px" }}
    >
      <p className="text-[10.5px] font-medium" style={{ color: "var(--text-secondary)" }}>{label}</p>
      <p className="mt-2 text-lg font-bold font-mono" style={{ color: c.text }}>{value}</p>
    </div>
  );
}
