import Link from "next/link";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static defaultProps = {
    fallback: (
      <div className="w-full min-h-screen text-black flex flex-col items-center justify-center">
        <h4 className="text-center text-h3 text-4e7dd9 mb-4">
          Something went wrong.
        </h4>
        <div className="flex gap-2 items-center">
          <button
            className="rounded-lg p-2 bg-4e7dd9 m-2 text-white"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <Link href={"/"}>
            <a className="rounded-lg border border-4e7dd9 p-2 bg-white">
              Back To Home
            </a>
          </Link>
        </div>
      </div>
    ),
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    console.log("error", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    console.log("here", this.state.error ? "errror" : "no");
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
