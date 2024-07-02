import React, { Component, ErrorInfo, ReactNode, Suspense, startTransition } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode; // Ensure children prop is defined
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
    // Handle or log errors here
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      return <div>Something went wrong. Please refresh the page or try again later.</div>;
    }

    return this.props.children; // Access children prop here
  }
}

export default ErrorBoundary;
