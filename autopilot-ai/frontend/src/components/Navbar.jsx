export default function Navbar({ systemStatus }) {

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="logo">

        <div className="logo-badge">
          AI
        </div>

        <div>
          <h2>AutoPilot AI</h2>

          <p>
            Multi-Agent Operating System
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px"
      }}>

        <button className="btn btn-secondary">
          {systemStatus ? "● System Online" : "● Connecting"}
        </button>

        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "14px",
          background: "linear-gradient(135deg,#6ea8fe,#7c5cff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          color: "white"
        }}>
          AK
        </div>

      </div>

    </div>
  );
}