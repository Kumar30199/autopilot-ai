import { useState } from "react";
import {
  Map,
  Search,
  BarChart3,
  Play,
  Hammer,
  Send,
  Loader2,
} from "lucide-react";

const AGENTS = [
  {
    id: "plan",
    name: "Planner",
    description: "Breaks down goals into structured, sequential action plans.",
    icon: Map,
    color: "indigo",
    gradient: "from-indigo-600 to-indigo-400",
    bg: "bg-indigo-500/10",
    border: "hover:border-indigo-500/40",
    glow: "shadow-indigo-500/10",
    placeholder: "e.g. Build a SaaS product with auth, billing, and dashboard",
  },
  {
    id: "research",
    name: "Researcher",
    description: "Gathers intel, references, and contextual data on any topic.",
    icon: Search,
    color: "cyan",
    gradient: "from-cyan-600 to-cyan-400",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/40",
    glow: "shadow-cyan-500/10",
    placeholder: "e.g. Best practices for microservice architecture",
  },
  {
    id: "analyze",
    name: "Analyzer",
    description: "Deep analysis, risk assessment, and optimization insights.",
    icon: BarChart3,
    color: "violet",
    gradient: "from-violet-600 to-violet-400",
    bg: "bg-violet-500/10",
    border: "hover:border-violet-500/40",
    glow: "shadow-violet-500/10",
    placeholder: "e.g. Evaluate performance of current API layer",
  },
  {
    id: "execute",
    name: "Executor",
    description: "Runs tasks, scripts, and orchestrates system operations.",
    icon: Play,
    color: "emerald",
    gradient: "from-emerald-600 to-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/40",
    glow: "shadow-emerald-500/10",
    placeholder: "e.g. Deploy staging environment and run integration tests",
  },
  {
    id: "build",
    name: "Builder",
    description: "Scaffolds code, projects, and deployable artifacts.",
    icon: Hammer,
    color: "amber",
    gradient: "from-amber-600 to-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/40",
    glow: "shadow-amber-500/10",
    placeholder: "e.g. Create a REST API with CRUD endpoints for users",
  },
];

export default function AgentPanel({ dispatchAgent, agentLoading, expanded }) {
  const [prompts, setPrompts] = useState({});

  const handleSubmit = (agentId) => {
    const prompt = (prompts[agentId] || "").trim();
    if (!prompt) return;
    dispatchAgent(agentId, prompt);
    setPrompts((p) => ({ ...p, [agentId]: "" }));
  };

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse-glow" />
        Agent Quick Launch
      </h2>

      <div className={`grid gap-4 ${expanded ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isLoading = agentLoading === agent.id;

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 transition-all duration-300 ${agent.border} hover:shadow-xl ${agent.glow}`}
            >
              {/* Top glow line */}
              <div
                className={`absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r ${agent.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              {/* Agent header */}
              <div className="mb-3 flex items-center gap-3">
                <div className={`rounded-lg ${agent.bg} p-2`}>
                  <Icon className={`h-4 w-4 text-${agent.color}-400`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Input + Send */}
              <div className="flex gap-2">
                <input
                  id={`agent-input-${agent.id}`}
                  type="text"
                  placeholder={agent.placeholder}
                  value={prompts[agent.id] || ""}
                  onChange={(e) =>
                    setPrompts((p) => ({ ...p, [agent.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(agent.id)}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-glow)] focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50 transition-colors"
                />
                <button
                  id={`agent-send-${agent.id}`}
                  onClick={() => handleSubmit(agent.id)}
                  disabled={isLoading || !(prompts[agent.id] || "").trim()}
                  className={`flex items-center justify-center rounded-xl bg-gradient-to-r ${agent.gradient} px-3.5 py-2 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
