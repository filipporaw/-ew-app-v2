"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', backgroundColor: '#fef2f2', border: '2px solid #ef4444', margin: '40px', borderRadius: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '16px' }}>Something went wrong.</h1>
          <pre style={{ color: '#b91c1c', fontSize: '14px', whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '500px', backgroundColor: '#fff', padding: '20px', border: '1px solid #fee2e2' }}>
            {this.state.error?.stack || this.state.error?.message || "Unknown error"}
          </pre>
          <button
            style={{ marginTop: '16px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
