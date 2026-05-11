import { useState } from "react";
import { RefreshCcw, Target, Rocket, BarChart, Code } from "lucide-react";

export default function Planner({ dispatch, agentLoading }) {
  const [goal, setGoal] = useState("");

  const handlePlan = async () => {
    if (!goal.trim()) return;
    await dispatch("plan", goal);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Planner Agent
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-1">
            Turn goals into actionable step-by-step plans
          </p>
        </div>

        <button
          onClick={() => goal.trim() && dispatch("plan", goal)}
          className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap self-start sm:self-auto"
        >
          <RefreshCcw size={13} />
          Regenerate
        </button>
      </div>

      {/* INPUT CARD */}
      <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-5 md:p-6 space-y-4">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-white mb-1">
            What do you want to achieve?
          </h3>
          <p className="text-xs md:text-sm text-gray-400">
            Describe your goal in detail for better planning.
          </p>
        </div>

        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="E.g. I want to launch an AI SaaS product..."
          maxLength={2000}
          className="w-full min-h-[160px] md:min-h-[200px] bg-black/30 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 rounded-lg p-4 text-sm text-white placeholder-gray-500 resize-y outline-none transition-all duration-200"
        />

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Better input = better plan</span>
          <span>{goal.length}/2000</span>
        </div>

        <button
          onClick={handlePlan}
          disabled={agentLoading === "plan" || !goal.trim()}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
        >
          {agentLoading === "plan" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Plan"
          )}
        </button>
      </div>

      {/* TEMPLATE SECTION */}
      <div className="space-y-4">
        <h3 className="text-sm md:text-base font-semibold text-white">
          Or try a template
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <TemplateCard
            icon={Target}
            title="Go-to-Market Plan"
            desc="Create a complete go-to-market strategy."
            onClick={() => setGoal("Create a complete go-to-market strategy for my product.")}
          />
          <TemplateCard
            icon={Rocket}
            title="Product Launch Plan"
            desc="Plan the launch of a new product."
            onClick={() => setGoal("Plan a detailed product launch for a new software tool.")}
          />
          <TemplateCard
            icon={BarChart}
            title="Business Plan"
            desc="Build a solid business plan from scratch."
            onClick={() => setGoal("Build a comprehensive business plan for a new startup.")}
          />
          <TemplateCard
            icon={Code}
            title="Project Plan"
            desc="Plan and execute your projects efficiently."
            onClick={() => setGoal("Create a detailed project plan for a web development project.")}
          />
        </div>
      </div>

      {/* TIPS SECTION */}
      <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-5 md:p-6">
        <h3 className="text-sm md:text-base font-semibold text-white mb-4">
          Tips for better plans
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Be specific about your goal",
            "Mention your target audience",
            "Include context and constraints",
            "Add timelines or deadlines",
            "Specify resources or budget",
            "Include success metrics",
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
              <span className="text-cyan-400 font-bold flex-shrink-0">✓</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* TEMPLATE CARD */
function TemplateCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 border border-white/10 hover:border-cyan-500/30 rounded-xl bg-[#0a0f2a]/80 hover:bg-[#0d1235] cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/10 group"
    >
      <Icon
        size={18}
        className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform duration-200"
      />
      <div className="text-sm font-semibold text-white mb-1">{title}</div>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </button>
  );
}