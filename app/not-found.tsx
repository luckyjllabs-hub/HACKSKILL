import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface text-on-background">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#e2e2e2] text-center space-y-6">
        <span className="text-4xl font-extrabold text-primary">404</span>
        <div>
          <h2 className="text-xl font-bold text-primary">Page Not Found</h2>
          <p className="text-sm text-secondary mt-2">
            The page or resource you are looking for does not exist.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-all"
          aria-label="Return to PROJECT AI-X home"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
