"use client";

import React from "react";
import { MissingTeammateRecommendation } from "@/types/matching";
import { Sparkles, UserPlus, X, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface MissingTeammateModalProps {
  isOpen: boolean;
  recommendation: MissingTeammateRecommendation | null;
  onClose: () => void;
  onAcceptRecommendation: (rec: MissingTeammateRecommendation) => void;
}

export const MissingTeammateModal: React.FC<MissingTeammateModalProps> = ({
  isOpen,
  recommendation,
  onClose,
  onAcceptRecommendation,
}) => {
  if (!isOpen || !recommendation) return null;

  const handleAdd = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onAcceptRecommendation(recommendation);
  };

  const { candidate } = recommendation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="missing-teammate-title">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 sm:p-8 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors"
          aria-label="Close recommendation modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-outline-variant">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="missing-teammate-title" className="text-xl font-bold text-primary tracking-tight">Missing Teammate Recommendation</h3>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-surface-container border border-outline-variant text-primary">
                Optimal Solver
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Identified to resolve critical gap:{" "}
              <span className="text-primary font-bold">{recommendation.criticalSkill}</span>
            </p>
          </div>
        </div>

        {/* Gap Summary */}
        <div className="mt-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface leading-relaxed">
          <span className="font-semibold text-primary">Why It Matters: </span>
          {recommendation.gapSummary}
        </div>

        {/* Candidate Profile Card */}
        <div className="mt-4 p-5 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-14 h-14 rounded-full object-cover border border-outline-variant"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-primary">{candidate.name}</h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                    Yr {candidate.year}
                  </span>
                </div>
                <div className="text-xs font-semibold text-primary mt-0.5">
                  {recommendation.assignedRole}
                </div>
                <p className="text-xs text-secondary mt-0.5">{candidate.department}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary">
                {recommendation.fitScore}% Individual Fit
              </div>
              <div className="text-[11px] text-secondary mt-1">
                New Team Fit: <span className="text-primary font-bold">{recommendation.newTeamScore}%</span>
              </div>
            </div>
          </div>

          {/* AI Grounded Reason */}
          <div className="p-3.5 rounded-lg bg-surface-container-low text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary">AI Grounded Rationale: </span>
            {recommendation.recommendationReason}
          </div>

          {/* Profile Facts & Evidence */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Verified Candidate Evidence:
            </div>
            {recommendation.candidateEvidence.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-primary font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span>{ev}</span>
              </div>
            ))}
          </div>

          {/* Skills Badges */}
          <div className="pt-2 border-t border-outline-variant flex flex-wrap gap-1.5">
            {candidate.skills.map((s, idx) => (
              <span
                key={idx}
                className={`text-xs px-2.5 py-0.5 rounded-full ${
                  s.name.toLowerCase() === recommendation.criticalSkill.toLowerCase()
                    ? "bg-primary text-on-primary font-bold"
                    : "bg-surface-container text-secondary border border-outline-variant"
                }`}
              >
                {s.name} ({s.level})
              </span>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-secondary hover:text-primary transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-on-primary bg-primary hover:opacity-90 transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add {candidate.name.split(" ")[0]} to Team & Heal Gap
          </button>
        </div>
      </div>
    </div>
  );
};
