import { useState } from "react";
import { Wand2, Copy, CheckCheck } from "lucide-react";

export default function QuickBuilderMode({
  dispatch,
  agentLoading,
  lastResult
}) {
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    await dispatch("build", prompt);
  };

  const copyToClipboard = () => {
    if (!lastResult?.result) return;
    navigator.clipboard.writeText(lastResult.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">AI Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Describe what you want to build and watch it come to life</p>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">

        {/* LEFT → INPUT */}
        <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-4 md:p-5 flex flex-col gap-4">

          <h2 className="text-sm font-semibold text-white">Your Prompt</h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            className="w-full min-h-[160px] md:min-h-[220px] bg-black/30 border border-white/10 hover:border-white/20 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 rounded-lg p-4 text-sm text-white placeholder-gray-500 resize-y outline-none transition-all duration-200"
          />

          <button
            onClick={handleBuild}
            disabled={agentLoading === "build" || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/20"
          >
            <Wand2 size={14} />
            {agentLoading === "build" ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : "Generate"}
          </button>

        </div>

        {/* RIGHT → OUTPUT */}
        <div className="bg-[#0a0f2a]/80 backdrop-blur border border-white/10 rounded-xl p-4 md:p-5 flex flex-col gap-4">

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Output</h2>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-2.5 py-1.5 rounded-lg transition-all duration-200"
            >
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono overflow-auto min-h-[160px] md:min-h-[220px] max-h-[400px] whitespace-pre-wrap text-gray-300 leading-relaxed">
            {lastResult?.agent === "Builder"
              ? lastResult.result
              : (
                <span className="text-gray-600 italic">Generated output will appear here...</span>
              )}
          </div>

        </div>

      </div>

    </div>
  );
}