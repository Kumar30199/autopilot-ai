import { useState, useEffect, useCallback } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Planner from "./components/Planner";
import ResearchMode from "./components/ResearchMode";
import ExecutionMode from "./components/ExecutionMode";
import QuickBuilderMode from "./components/QuickBuilderMode";
import WorkflowPanel from "./components/WorkflowPanel";

const API = "";

export default function App() {

  const [mode, setMode] = useState("planner");

  const [systemStatus, setSystemStatus] = useState(null);

  const [history, setHistory] = useState([]);

  const [agentLoading, setAgentLoading] = useState(null);

  const [lastResult, setLastResult] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch(`${API}/status`);
      if (r.ok) setSystemStatus(await r.json());
    } catch { }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const r = await fetch(`${API}/history`);
      if (r.ok) {
        const d = await r.json();
        setHistory(d.history || []);
      }
    } catch { }
  }, []);

  useEffect(() => {

    fetchStatus();
    fetchHistory();

    const id = setInterval(() => {
      fetchStatus();
      fetchHistory();
    }, 3000);

    return () => clearInterval(id);

  }, [fetchStatus, fetchHistory]);

  const dispatch = async (endpoint, prompt, context = {}) => {

    setAgentLoading(endpoint);

    try {

      const r = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          context
        })
      });

      const data = await r.json();

      setLastResult(data);

      fetchStatus();
      fetchHistory();

      return data;

    } catch (e) {

      return {
        error: e.message
      };

    } finally {
      setAgentLoading(null);
    }
  };

  return (
    <div className="app-shell">

      <Navbar systemStatus={systemStatus} />

      <div className="main-layout">

        <Sidebar
          mode={mode}
          setMode={setMode}
        />

        <div className="content-area">

          <div className="hero">

            <div className="hero-left">

              <h1 className="hero-title">
                Multi-Agent AI Workspace
              </h1>

              <p className="hero-sub">
                Plan, research, execute and build complete workflows
                with intelligent AI agents working together inside
                one unified operating system.
              </p>

            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-label">
                  Tasks Completed
                </div>

                <div className="stat-value">
                  {systemStatus?.tasks_completed || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  Total Tasks
                </div>

                <div className="stat-value">
                  {systemStatus?.total_tasks || 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  System Status
                </div>

                <div className="stat-value">
                  Online
                </div>
              </div>

            </div>

          </div>

          {mode === "planner" && (
            <Planner
              dispatch={dispatch}
              agentLoading={agentLoading}
              lastResult={lastResult}
            />
          )}

          {mode === "research" && (
            <ResearchMode
              dispatch={dispatch}
              agentLoading={agentLoading}
              lastResult={lastResult}
            />
          )}

          {mode === "execution" && (
            <ExecutionMode
              dispatch={dispatch}
              agentLoading={agentLoading}
              lastResult={lastResult}
              history={history}
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
  );
}