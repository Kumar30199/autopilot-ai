import { X, CheckCircle, XCircle, Clock, Code } from "lucide-react";

export default function AgentResultModal({ data, onClose }) {
  if (!data) return null;

  const isSuccess = data.status === "success";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative m-4 w-full max-w-2xl animate-fade-in-up rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-2xl shadow-indigo-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top glow */}
        <div
          className={`absolute top-0 left-0 h-[2px] w-full rounded-t-2xl ${
            isSuccess
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
              : "bg-gradient-to-r from-rose-500 to-amber-500"
          }`}
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-400" />
            )}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {data.agent} — Result
              </h3>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {data.duration_ms}ms
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isSuccess
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {data.status}
                </span>
              </div>
            </div>
          </div>
          <button
            id="modal-close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-4 w-4 text-[var(--text-muted)]" />
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Response Data
            </span>
          </div>
          <pre className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] p-4 text-xs leading-relaxed text-[var(--text-secondary)] overflow-x-auto font-[var(--font-mono)]">
            {JSON.stringify(data.result, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[var(--border-default)] px-6 py-3">
          <button
            id="modal-dismiss"
            onClick={onClose}
            className="rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
