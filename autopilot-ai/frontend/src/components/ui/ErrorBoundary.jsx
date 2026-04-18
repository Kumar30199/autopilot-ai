import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Preview Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-slate-950 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <AlertCircle className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Build Preview Crashed</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            The generated code encountered a fatal runtime exception during compilation.
            <br/><br/>
            <span className="font-mono text-rose-400 bg-rose-500/5 px-2 py-1 rounded inline-block">
              {this.state.error?.message || "Unknown rendering exception"}
            </span>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onRetry) this.props.onRetry();
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Compilation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
