import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Automatically reload on chunk load errors (common in Vite dev during live edits)
    if (
      error.message.includes("fetch dynamically imported module") || 
      error.message.includes("Failed to fetch") || 
      error.message.includes("dynamically imported module") ||
      error.name === "ChunkLoadError"
    ) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
          <h1 className="text-xl font-bold text-gray-800">Updating application...</h1>
          <p className="text-gray-500 text-sm mt-2">Refreshing to apply the latest live code changes.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm font-medium"
          >
            Refresh Now
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
