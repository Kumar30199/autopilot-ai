import { useState } from "react";
import { Play } from "lucide-react";

export default function ExecutionMode({
  dispatch,
  agentLoading,
  lastResult,
  history,
  systemStatus
}) {
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);

  const handleExecute = async () => {
    if (!task.trim()) return;

    await dispatch("execution", task);

    setSteps([
      { name: "Planning", status: "done" },
      { name: "Research", status: "done" },
      { name: "Analysis", status: "running" },
      { name: "Execution", status: "pending" },
    ]);
  };

  const getColor = (status) => {
    if (status === "done") return "bg-green-500";
    if (status === "running") return "bg-yellow-400";
    return "bg-gray-600";
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Execution Mode</h1>
        <p className="text-sm text-gray-400 mt-1">Run tasks through the full agent pipeline</p>
      </div>

      {/* INPUT */}
      <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-4 md:p-5 flex items-center gap-3">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleExecute()}
          placeholder="Enter task to execute..."
          className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-500"
        />

        <button
          onClick={handleExecute}
          disabled={agentLoading === "execution" || !task.trim()}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
        >
          <Play size={13} />
          {agentLoading === "execution" ? "Running..." : "Run"}
        </button>
      </div>

      {/* PIPELINE */}
      {steps.length > 0 && (
        <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-4 md:p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Execution Pipeline</h3>

          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getColor(step.status)}`} />
              <div className="text-xs text-gray-300 w-20 flex-shrink-0">{step.name}</div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${getColor(step.status)} ${
                    step.status === "done" ? "w-full"
                    : step.status === "running" ? "w-1/2"
                    : "w-1/4"
                  }`}
                />
              </div>
              <div className="text-[10px] text-gray-400 capitalize w-14 text-right flex-shrink-0">
                {step.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESULT */}
      {lastResult?.agent === "Executor" && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 md:p-5 text-xs text-green-400 font-mono">
          {lastResult.result}
        </div>
      )}

      {/* HISTORY */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold tracking-widest text-gray-500 uppercase">Recent Executions</h3>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {history
            .filter((h) => h.agent === "Executor")
            .slice(-6)
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="bg-[#0a0f2a]/80 border border-white/10 hover:border-white/20 rounded-xl p-3 text-xs text-gray-300 truncate cursor-pointer hover:bg-white/5 transition-all duration-200"
                onClick={() => setTask(item.prompt)}
                title={item.prompt}
              >
                {item.prompt}
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}