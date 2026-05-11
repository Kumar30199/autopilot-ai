import { useState } from "react";
import { Search } from "lucide-react";

export default function ResearchMode({
  dispatch,
  agentLoading,
  lastResult,
  history
}) {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    await dispatch("research", query);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">

      {/* SEARCH BAR */}
      <div className="card flex items-center gap-2">
        <Search size={16} className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          className="bg-transparent outline-none w-full text-sm"
        />

        <button
          onClick={handleSearch}
          className="btn btn-cyan"
        >
          {agentLoading === "research" ? "Searching..." : "Search"}
        </button>
      </div>

      {/* RESULT */}
      {lastResult?.agent === "Researcher" && (
        <div className="mt-4 card space-y-2">
          <h3 className="text-sm font-semibold">Results</h3>

          <div className="text-xs text-gray-300 leading-relaxed">
            {lastResult.result}
          </div>
        </div>
      )}

      {/* HISTORY */}
      <div className="mt-4">
        <h3 className="text-xs text-gray-400 mb-2">Recent Searches</h3>

        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
          {history
            .filter((h) => h.agent === "Researcher")
            .slice(-6)
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="card text-xs text-gray-300 truncate cursor-pointer hover:bg-white/5"
                onClick={() => setQuery(item.prompt)}
              >
                {item.prompt}
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}