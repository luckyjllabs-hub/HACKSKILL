import React from "react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading application"
      className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-background gap-4"
    >
      <div className="w-10 h-10 border-3 border-outline-variant border-t-primary rounded-full animate-spin" />
      <span className="text-xs font-semibold text-secondary tracking-wide uppercase">
        Loading PROJECT AI-X...
      </span>
    </div>
  );
}
