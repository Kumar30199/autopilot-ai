import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ResearchMode from "./components/ResearchMode";
import ExecutionMode from "./components/ExecutionMode";
import QuickBuilderMode from "./components/QuickBuilderMode";
import WorkflowPanel from "./components/WorkflowPanel";

const API = "";

export default function App() {
  const [mode, setMode] = useState("research");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [agentLoading, setAgentLoading] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  /* ── Polling ──────────────────────────────────────────────── */
  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch(`${API}/status`);
      if (r.ok) setSystemStatus(await r.json());
    } catch {}
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const r = await fetch(`${API}/history`);
      if (r.ok) {
        const d = await r.json();
        setHistory(d.history || []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
    const id = setInterval(() => { fetchStatus(); fetchHistory(); }, 3000);
    return () => clearInterval(id);
  }, [fetchStatus, fetchHistory]);

  /* ── Dispatch ─────────────────────────────────────────────── */
  const dispatch = async (endpoint, prompt, context = {}) => {
    setAgentLoading(endpoint);
    try {
      const r = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
      });
      const data = await r.json();
      setLastResult(data);
      fetchStatus();
      fetchHistory();
      return data;
    } catch (e) {
      const err = { agent: endpoint, status: "error", result: { error: e.message }, duration_ms: 0 };
      setLastResult(err);
      return err;
    } finally {
      setAgentLoading(null);
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div id="app-shell" className="noise grid-bg flex h-screen flex-col overflow-hidden" style={{ background: "#020617" }}>

      {/* Ambient glow orbs — purely decorative, behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full bg-indigo-600/[0.035] blur-[160px]" />
        <div className="absolute -bottom-64 -right-48 h-[800px] w-[800px] rounded-full bg-cyan-500/[0.025] blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.02] blur-[140px]" />
      </div>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <Navbar mode={mode} setMode={setMode} systemStatus={systemStatus} />

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">

        {/* Sidebar — fixed 260px, never shrinks */}
        <div className="sidebar-fixed">
          <Sidebar
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            history={history}
            systemStatus={systemStatus}
            agentLoading={agentLoading}
          />
        </div>

        {/* Main content area — takes remaining width */}
        <div className="content-area">
          {/* panel-container: max-width 1400px, centered, padded */}
          <div className="panel-container">
            <div key={mode} className="anim-fade-up">

              {mode === "research" && (
                <ResearchMode
                  dispatch={dispatch}
                  agentLoading={agentLoading}
                  lastResult={lastResult}
                  history={history}
                />
              )}

              {mode === "execution" && (
                <ExecutionMode
                  dispatch={dispatch}
                  agentLoading={agentLoading}
                  lastResult={lastResult}
                  history={history}
                  systemStatus={systemStatus}
                />
              )}

              {mode === "builder" && (
                <QuickBuilderMode
                  dispatch={dispatch}
                  agentLoading={agentLoading}
                  lastResult={lastResult}
                />
              )}

              {mode === "workflow" && (
                <WorkflowPanel dispatch={dispatch} />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
