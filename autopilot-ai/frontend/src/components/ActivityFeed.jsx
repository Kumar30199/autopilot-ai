import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function ActivityFeed({ history }) {
  const recent = [...history].reverse().slice(0, 12);

  const timeAgo = (timestamp) => {
    const diff = Math.floor(Date.now() / 1000 - timestamp);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <Clock className="h-4 w-4 text-[var(--text-muted)]" />
        Recent Activity
      </h2>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 rounded-full bg-[var(--bg-primary)] p-4">
            <Clock className="h-6 w-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            No activity yet
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Dispatch an agent to see activity here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((item, i) => (
            <div
              key={i}
              className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-card-hover)]"
            >
              {/* Status icon */}
              {item.status === "success" ? (
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              )}

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {item.agent}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {timeAgo(item.timestamp)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                  {item.prompt}
                </p>
              </div>

              {/* Duration */}
              <span className="shrink-0 rounded-md bg-[var(--bg-primary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                {item.duration_ms}ms
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
