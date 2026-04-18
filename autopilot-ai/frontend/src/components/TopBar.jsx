import { Activity, Clock, Wifi, WifiOff } from "lucide-react";

export default function TopBar({ systemStatus }) {
  const online = !!systemStatus;

  const formatUptime = (seconds) => {
    if (!seconds) return "—";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <header className="flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-secondary)]/80 px-6 py-3 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Activity className="h-4 w-4 text-[var(--accent-indigo)]" />
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Multi-Agent Operating System
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Uptime */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <Clock className="h-3.5 w-3.5" />
          <span>Uptime: {formatUptime(systemStatus?.uptime_seconds)}</span>
        </div>

        {/* Connection */}
        <div className="flex items-center gap-2">
          {online ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">
                Connected
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-xs font-medium text-rose-400">
                Offline
              </span>
            </>
          )}
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-emerald-400 animate-pulse-glow" : "bg-rose-400"
            }`}
          />
        </div>
      </div>
    </header>
  );
}
