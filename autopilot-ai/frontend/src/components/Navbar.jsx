import { FlaskConical, Play, Hammer, Wifi, WifiOff, Clock, Activity } from "lucide-react";

const MODES = [
  { id: "research",  label: "Research",       icon: FlaskConical, color: "cyan",    neon: "neon-text-cyan" },
  { id: "execution", label: "Execution",      icon: Play,         color: "violet",  neon: "neon-text-violet" },
  { id: "builder",   label: "Quick Builder",   icon: Hammer,       color: "emerald", neon: "neon-text-emerald" },
  { id: "workflow",  label: "Workflow",        icon: Activity,     color: "cyan",    neon: "neon-text-cyan" },
];

export default function Navbar({ mode, setMode, systemStatus }) {
  const online = !!systemStatus;

  const fmtUptime = (s) => {
    if (!s) return "—";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <header
      className="relative z-20 flex items-center justify-between border-b border-[var(--border-dim)] glass-strong"
      style={{ height: "var(--navbar-height)", minHeight: "var(--navbar-height)", padding: "0 24px" }}
    >
      {/* ── Left: Logo ──────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div className="relative flex h-9 w-9 items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 blur-sm" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--neon-cyan)" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wide text-[var(--text-white)]">
            Auto<span className="neon-text-cyan">Pilot</span> AI
          </h1>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>
            Control Center
          </p>
        </div>
      </div>

      {/* ── Center: Mode Switcher ───────────────────────────── */}
      <nav className="flex items-center gap-1 rounded-2xl border border-[var(--border-dim)] bg-[var(--bg-void)]/60 p-1">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              id={`mode-${m.id}`}
              onClick={() => setMode(m.id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300
                ${active
                  ? `glass ${m.neon} neon-border-${m.color} mode-indicator`
                  : "text-[var(--text-muted)] hover:text-[var(--text-white)] hover:bg-[var(--bg-surface)]/50"
                }`}
              style={{
                /* ensure active buttons feel clickable */
                cursor: "pointer",
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Right: Status ───────────────────────────────────── */}
      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 sm:flex" style={{ fontSize: "10.5px", color: "var(--text-secondary)" }}>
          <Clock className="h-3 w-3" />
          {fmtUptime(systemStatus?.uptime_seconds)}
        </div>

        <div className="flex items-center gap-2.5">
          {online ? (
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-rose-400" />
          )}
          <span className={`status-dot ${online ? "status-dot--online" : "status-dot--offline"}`} />
          <span className={`font-semibold ${online ? "text-emerald-400" : "text-rose-400"}`} style={{ fontSize: "10.5px", letterSpacing: "0.06em" }}>
            {online ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
}
