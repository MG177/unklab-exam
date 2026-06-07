import React from 'react';

/**
 * Catches uncaught render errors anywhere in the tree and shows a fallback
 * instead of unmounting the whole SPA to a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface to the console (and any future error-reporting hook).
    console.error('Uncaught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col w-screen h-screen justify-center items-center gap-4 text-center p-6">
          <h1 className="text-3xl font-bold text-accent2">
            Something went wrong
          </h1>
          <p className="text-lg text-[#37474F]">
            An unexpected error occurred. Please reload the page and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-accent1 text-white font-semibold"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
