"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Runtime Error]:", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-screen flex items-center justify-center p-6 bg-surface text-on-background"
    >
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#e2e2e2] shadow-sm text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary">Something went wrong</h2>
          <p className="text-sm text-secondary mt-2">
            An unexpected error occurred. You can safely try resetting the application state.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          aria-label="Retry loading application"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
