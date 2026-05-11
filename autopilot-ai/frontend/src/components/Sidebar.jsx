export default function Sidebar({
  mode,
  setMode,
  history = [],
  systemStatus,
  agentLoading
}) {

  const navItems = [
    {
      key: "planner",
      label: "Planner"
    },
    {
      key: "research",
      label: "Research"
    },
    {
      key: "execution",
      label: "Execution"
    },
    {
      key: "builder",
      label: "Builder"
    },
    {
      key: "workflow",
      label: "Workflow"
    }
  ];

  return (

    <div className="sidebar">

      {/* TOP */}
      <div className="sidebar-section">

        <div className="sidebar-title">
          Workspace
        </div>

        {navItems.map((item) => (

          <button
            key={item.key}
            onClick={() => setMode(item.key)}
            className={`sidebar-item ${mode === item.key ? "active" : ""
              }`}
          >

            <span>
              {item.label}
            </span>

            {mode === item.key && (
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#6ea8fe"
              }} />
            )}

          </button>

        ))}

      </div>

      {/* SYSTEM STATUS */}
      <div className="sidebar-section">

        <div className="sidebar-title">
          System
        </div>

        <div className="card">

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "14px"
          }}>

            <span style={{
              color: "var(--muted)"
            }}>
              Status
            </span>

            <span style={{
              color: "#22c55e",
              fontWeight: "600"
            }}>
              Online
            </span>

          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "14px"
          }}>

            <span style={{
              color: "var(--muted)"
            }}>
              Active Agent
            </span>

            <span>
              {agentLoading || "Idle"}
            </span>

          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between"
          }}>

            <span style={{
              color: "var(--muted)"
            }}>
              Total Tasks
            </span>

            <span>
              {systemStatus?.total_tasks || 0}
            </span>

          </div>

        </div>

      </div>

      {/* RECENT TASKS */}
      <div className="sidebar-section">

        <div className="sidebar-title">
          Recent Tasks
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>

          {history.length === 0 && (

            <div className="card">

              <div style={{
                color: "var(--muted)",
                fontSize: "14px"
              }}>
                No recent activity
              </div>

            </div>

          )}

          {history.slice(-5).reverse().map((task, index) => (

            <div
              key={index}
              className="card"
              style={{
                padding: "16px",
                borderRadius: "20px"
              }}
            >

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px"
              }}>

                <strong>
                  {task.agent}
                </strong>

                <span style={{
                  fontSize: "12px",
                  color: "var(--muted)"
                }}>
                  #{task.id}
                </span>

              </div>

              <div style={{
                fontSize: "13px",
                color: "var(--muted)",
                lineHeight: "1.5"
              }}>
                {task.prompt}
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* BOTTOM USER */}
      <div style={{
        marginTop: "auto"
      }}>

        <div className="card" style={{
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>

          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "linear-gradient(135deg,#6ea8fe,#7c5cff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "700"
          }}>
            AK
          </div>

          <div>

            <div style={{
              fontWeight: "600"
            }}>
              Akash Kumar
            </div>

            <div style={{
              fontSize: "13px",
              color: "var(--muted)"
            }}>
              AI Workspace Owner
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}