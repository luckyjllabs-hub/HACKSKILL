"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Step {
  id: number;
  label: string;
  sublabel: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Understanding Project Objective", sublabel: "Parsing natural-language scope & intent with Gemini" },
  { id: 2, label: "Extracting Required Capabilities", sublabel: "Identifying core technical & domain skill requirements" },
  { id: 3, label: "Normalizing Canonical Taxonomy", sublabel: "Mapping semantic terms to verified skill vocabulary" },
  { id: 4, label: "Deterministic Candidate Scoring", sublabel: "Evaluating 6-factor mathematical profile matrix" },
  { id: 5, label: "Combinatorial Complementary Optimization", sublabel: "Balancing role coverage and penalizing redundant overlaps" },
  { id: 6, label: "Evaluating Team Health & Explanations", sublabel: "Checking skill gaps and generating grounded rationale" },
];

export const AnalysisProgress: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div>
          <h3 className="text-base font-bold text-primary">AI Matching Pipeline</h3>
          <p className="text-xs text-secondary">Gemini 3.7 Flash + Deterministic Optimization Engine</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1 rounded-full bg-surface-container border border-outline-variant">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Processing</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="mt-5 space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? "bg-surface-container-low border border-primary/20"
                  : isDone
                  ? "opacity-90"
                  : "opacity-40"
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-outline" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-primary font-bold" : isDone ? "text-primary" : "text-secondary"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-secondary mt-0.5">{step.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
