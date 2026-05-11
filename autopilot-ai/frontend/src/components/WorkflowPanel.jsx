export default function WorkflowPanel() {
  const nodes = [
    { id: 1, name: "Planner",    color: "cyan" },
    { id: 2, name: "Researcher", color: "violet" },
    { id: 3, name: "Analyzer",   color: "blue" },
    { id: 4, name: "Executor",   color: "emerald" },
    { id: 5, name: "Builder",    color: "amber" },
  ];

  const colorMap = {
    cyan:    "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-cyan-500/10",
    violet:  "border-violet-500/40 bg-violet-500/10 text-violet-400 shadow-violet-500/10",
    blue:    "border-blue-500/40 bg-blue-500/10 text-blue-400 shadow-blue-500/10",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10",
    amber:   "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-amber-500/10",
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Workflow System</h1>
        <p className="text-sm text-gray-400 mt-1">
          Multi-agent pipeline — each agent processes tasks sequentially
        </p>
      </div>

      {/* PIPELINE CARD */}
      <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-6 md:p-8">

        {/* FLOW DIAGRAM */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-3 md:gap-4">
              <div
                className={`
                  px-4 py-2.5 rounded-xl border text-xs font-semibold
                  min-w-[90px] md:min-w-[100px] text-center
                  shadow-lg transition-all duration-200 hover:scale-105
                  ${colorMap[node.color]}
                `}
              >
                {node.name}
              </div>

              {i !== nodes.length - 1 && (
                <div className="text-gray-600 text-sm font-bold flex-shrink-0">→</div>
              )}
            </div>
          ))}
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs md:text-sm text-gray-400 text-center mt-6 max-w-lg mx-auto leading-relaxed">
          Each agent in the pipeline handles a specific role — from planning and research through
          analysis and execution to final code building.
        </p>
      </div>

      {/* AGENT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`
              border rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]
              ${colorMap[node.color]}
            `}
          >
            <div className="text-sm font-semibold mb-1">{node.name}</div>
            <div className="text-xs opacity-70">
              Agent #{node.id} · Ready
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}