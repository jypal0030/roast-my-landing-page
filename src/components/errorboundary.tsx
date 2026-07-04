"use client";

import { Component, ReactNode } from "react";
import { Flame, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-ash-900">
          <div className="text-center max-w-md">
            <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4 animate-pulse" />
            <h1 className="font-display text-3xl text-white mb-2">Something Burned Out</h1>
            <p className="text-ash-400 mb-2 text-sm">
              {this.state.error?.message || "An unexpected error roasted this page."}
            </p>
            <p className="text-ash-600 text-xs mb-6">
              Don&apos;t worry — your data is safe. This is just a temporary hiccup.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-fire-600 transition-all"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
