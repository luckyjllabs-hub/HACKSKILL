"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-[#f9f9f9] text-[#1a1c1c] font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#e2e2e2] text-center space-y-6">
          <h2 className="text-xl font-bold">Critical Error</h2>
          <p className="text-sm text-[#5d5f5f]">
            A critical system error occurred. Please reload the application.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3.5 px-6 rounded-full bg-black text-white font-semibold text-sm hover:opacity-90 transition-all"
            aria-label="Reload application"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
