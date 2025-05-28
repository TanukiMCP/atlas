import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: string) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null
    });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack || '');
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center mb-4">
            <span className="text-red-500 mr-3 text-xl">⚠️</span>
            <div>
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Something went wrong
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300">
                An unexpected error occurred in this component
              </p>
            </div>
          </div>

          {this.state.error && (
            <div className="mb-4">
              <details className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded p-3">
                <summary className="cursor-pointer text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Error Details
                </summary>
                <div className="text-xs text-red-700 dark:text-red-300 space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs bg-red-200 dark:bg-red-900/60 p-2 rounded overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-xs bg-red-200 dark:bg-red-900/60 p-2 rounded overflow-auto max-h-32">
                        {this.state.errorInfo}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Troubleshooting:</strong> This error might be caused by:
            </p>
            <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 ml-4 list-disc">
              <li>Network connectivity issues</li>
              <li>Missing or unavailable services</li>
              <li>Corrupted application state</li>
              <li>Browser compatibility issues</li>
            </ul>
            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-2">
              If the problem persists, try refreshing the page or restarting the application.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 