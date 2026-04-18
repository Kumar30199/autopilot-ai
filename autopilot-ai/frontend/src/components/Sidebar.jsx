import {
  Map, Search, BarChart3, Play, Hammer,
  Activity, CheckCircle, XCircle, ChevronRight,
} from "lucide-react";

const AGENTS = [
  { id: "plan",     name: "Planner",    icon: Map,       color: "indigo",  desc: "Strategic planning" },
  { id: "research", name: "Researcher", icon: Search,    color: "cyan",    desc: "Data intelligence" },
  { id: "analyze",  name: "Analyzer",   icon: BarChart3, color: "violet",  desc: "Risk & insights" },
  { id: "execute",  name: "Executor",   icon: Play,      color: "emerald", desc: "Task operations" },
  { id: "build",    name: "Builder",    icon: Hammer,    color: "amber",   desc: "Code generation" },
];

const COLOR_MAP = {
  indigo:  { bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.3)",   text: "#818cf8", dot: "#6366f1", activeBg: "rgba(99,102,241,0.06)" },
  cyan:    { bg: "rgba(0,240,255,0.08)",   border: "rgba(0,240,255,0.3)",    text: "#22d3ee", dot: "#00f0ff", activeBg: "rgba(0,240,255,0.05)" },
  violet:  { bg: "rgba(168,85,247,0.1)",   border: "rgba(168,85,247,0.3)",   text: "#c084fc", dot: "#a855f7", activeBg: "rgba(168,85,247,0.06)" },
  emerald: { bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.3)",   text: "#34d399", dot: "#10b981", activeBg: "rgba(16,185,129,0.06)" },
  amber:   { bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.3)",   text: "#fbbf24", dot: "#f59e0b", activeBg: "rgba(245,158,11,0.06)" },
};

export default function Sidebar({ selectedAgent, setSelectedAgent, history, systemStatus, agentLoading }) {
  const recentByAgent = {};
  history.forEach((h) => { recentByAgent[h.agent] = h; });

  return (
    <aside
      className="flex h-full w-full flex-col border-r border-[var(--border-dim)]"
      style={{ background: "rgba(6,8,26,0.92)", backdropFilter: "blur(24px)" }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 16px" }} className="border-b border-[var(--border-dim)]">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: "rgba(0,240,255,0.08)", border: "1px solid rgba(0,240,255,0.15)" }}
          >
            <Activity className="h-3 w-3 text-[var(--neon-cyan)]" />
          </div>
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Agent Registry
          </h2>
        </div>
      </div>

      {/* ── Agent List ────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: "12px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          const c = COLOR_MAP[agent.color];
          const active = selectedAgent === agent.id;
          const loading = agentLoading === agent.id;
          const last = recentByAgent[agent.name];

          return (
            <button
              key={agent.id}
              id={`sidebar-agent-${agent.id}`}
              onClick={() => setSelectedAgent(active ? null : agent.id)}
              className="anim-fade-up group flex w-full items-center gap-3 rounded-xl text-left transition-all duration-300"
              style={{
                opacity: 0,
                animationDelay: `${idx * 60}ms`,
                padding: "10px 12px",
                background: active ? c.activeBg : "transparent",
                border: `1px solid ${active ? c.border : "transparent"}`,
                boxShadow: active ? `0 0 20px ${c.activeBg}, inset 0 0 0 0.5px ${c.border}` : "none",
                position: "relative",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              {/* Active accent bar */}
              {active && (
                <div
                  className="anim-expand"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: "3px",
                    borderRadius: "0 3px 3px 0",
                    background: c.text,
                    boxShadow: `0 0 8px ${c.text}`,
                  }}
                />
              )}

              {/* Icon */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
                style={{
                  background: c.bg,
                  border: `1px solid ${active ? c.border : "rgba(255,255,255,0.05)"}`,
                }}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent"
                    style={{ borderTopColor: c.text }} />
                ) : (
                  <Icon className="h-4 w-4" style={{ color: active ? c.text : "var(--text-muted)" }} />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold" style={{ color: active ? c.text : "var(--text-white)" }}>
                  {agent.name}
                </p>
                <p className="text-[10.5px] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {agent.desc}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5">
                {last && (
                  last.status === "success"
                    ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    : <XCircle className="h-3.5 w-3.5 text-rose-400" />
                )}
                <ChevronRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  style={{ color: active ? c.text : "var(--text-muted)" }}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* ── System Metrics ────────────────────────────────── */}
      <div className="border-t border-[var(--border-dim)]" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] anim-pulse" />
          System
        </p>
        <StatusBar label="Active Agents"  value={systemStatus?.active_agents ?? 0}    max={5}   color="var(--neon-cyan)" />
        <StatusBar label="Tasks Complete" value={systemStatus?.tasks_completed ?? 0}   max={Math.max(systemStatus?.total_tasks ?? 1, 1)} color="var(--neon-emerald)" />
        <StatusBar label="Total Tasks"    value={systemStatus?.total_tasks ?? 0}       max={100} color="var(--neon-violet)" />
      </div>
    </aside>
  );
}

function StatusBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: "7px" }}>
        <span className="text-[10.5px] font-medium" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="text-[10.5px] font-bold font-mono" style={{ color }}>{value}</span>
      </div>
      <div className="h-[4px] w-full rounded-full" style={{ background: "rgba(99,102,241,0.08)" }}>
        <div
          className="h-[4px] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}
