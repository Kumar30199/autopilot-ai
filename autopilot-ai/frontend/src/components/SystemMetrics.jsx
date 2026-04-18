import {
  Activity,
  CheckCircle,
  Layers,
  Zap,
} from "lucide-react";

const METRICS = [
  {
    label: "Active Agents",
    key: "active_agents",
    icon: Activity,
    color: "indigo",
    gradient: "from-indigo-500/10 to-indigo-500/5",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    valueColor: "text-indigo-300",
  },
  {
    label: "Tasks Completed",
    key: "tasks_completed",
    icon: CheckCircle,
    color: "emerald",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-300",
  },
  {
    label: "Total Tasks",
    key: "total_tasks",
    icon: Layers,
    color: "violet",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    valueColor: "text-violet-300",
  },
  {
    label: "System Load",
    key: null,
    icon: Zap,
    color: "amber",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    valueColor: "text-amber-300",
    compute: (s) => (s ? `${Math.min(s.active_agents * 20, 100)}%` : "0%"),
  },
];

export default function SystemMetrics({ systemStatus }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {METRICS.map((m, i) => {
        const Icon = m.icon;
        const value = m.compute
          ? m.compute(systemStatus)
          : systemStatus?.[m.key] ?? "—";

        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-gradient-to-br ${m.gradient} p-5 transition-all duration-300 hover:border-[var(--border-glow)] hover:shadow-lg hover:shadow-indigo-500/5`}
          >
            {/* Shimmer overlay on hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {m.label}
                </p>
                <p className={`mt-2 text-3xl font-bold tracking-tight ${m.valueColor}`}>
                  {value}
                </p>
              </div>
              <div className={`rounded-xl ${m.iconBg} p-2.5`}>
                <Icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
