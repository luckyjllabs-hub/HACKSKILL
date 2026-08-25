"use client";

import React from "react";
import { TeamHealthReport } from "@/types/matching";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface TeamHealthPanelProps {
  teamHealth: TeamHealthReport;
  onFindMissingTeammate: (skill?: string) => void;
  isFindingTeammate: boolean;
}

export const TeamHealthPanel: React.FC<TeamHealthPanelProps> = ({
  teamHealth,
  onFindMissingTeammate,
  isFindingTeammate,
}) => {
  const isOptimal = teamHealth.overallHealth === "Optimal";
  const hasCriticalGaps =
    teamHealth.overallHealth === "Critical Gaps" ||
    teamHealth.missingSkills.length > 0;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-primary tracking-tight">Team Health & Skill Gap Detector</h3>
              <span
                className={`text-xs px-3 py-0.5 rounded-full font-bold uppercase ${
                  hasCriticalGaps
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : isOptimal
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {teamHealth.overallHealth} ({teamHealth.healthScore}%)
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Live capability audit across all project required and preferred milestones.
            </p>
          </div>
        </div>

        {/* Action Button if gaps exist */}
        {hasCriticalGaps && (
          <button
            onClick={() =>
              onFindMissingTeammate(teamHealth.criticalGapDetected || undefined)
            }
            disabled={isFindingTeammate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-on-primary bg-primary hover:opacity-90 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isFindingTeammate ? "Solving Gap..." : "Find Missing Teammate"}
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Critical Gap Banner if detected */}
      {hasCriticalGaps && teamHealth.criticalGapDetected && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-red-700">
                CRITICAL SKILL GAP DETECTED: {teamHealth.criticalGapDetected}
              </div>
              <p className="text-xs text-secondary mt-0.5">
                The current team lacks verified expertise in{" "}
                <span className="font-semibold text-primary">
                  {teamHealth.criticalGapDetected}
                </span>
                . This creates execution risk for core project milestones.
              </p>
            </div>
          </div>

          <button
            onClick={() => onFindMissingTeammate(teamHealth.criticalGapDetected!)}
            disabled={isFindingTeammate}
            className="px-4 py-2 rounded-full text-xs font-bold text-on-primary bg-primary hover:opacity-90 shrink-0 transition-colors"
          >
            Resolve Gap
          </button>
        </div>
      )}

      {/* Skill Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Covered Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center justify-between text-xs font-bold text-primary mb-2.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Covered ({teamHealth.coveredSkills.length})
            </span>
            <span className="text-[10px] text-secondary">✓ Strong</span>
          </div>
          <div className="space-y-1.5">
            {teamHealth.coveredSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-primary">{item.skill}</span>
                <span className="text-[10px] text-secondary">
                  {item.coveredBy.map((c) => c.studentName.split(" ")[0]).join(", ")}
                </span>
              </div>
            ))}
            {teamHealth.coveredSkills.length === 0 && (
              <span className="text-xs text-secondary italic">No skills covered</span>
            )}
          </div>
        </div>

        {/* Weak Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center justify-between text-xs font-bold text-primary mb-2.5">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Weak ({teamHealth.weakSkills.length})
            </span>
            <span className="text-[10px] text-secondary">⚠ Low Depth</span>
          </div>
          <div className="space-y-1.5">
            {teamHealth.weakSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-primary">{item.skill}</span>
                <span className="text-[10px] text-secondary">
                  {item.coveredBy.length > 0
                    ? item.coveredBy.map((c) => c.studentName.split(" ")[0]).join(", ")
                    : "No Expert"}
                </span>
              </div>
            ))}
            {teamHealth.weakSkills.length === 0 && (
              <span className="text-xs text-secondary italic">No weak skills</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center justify-between text-xs font-bold text-primary mb-2.5">
            <span className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              Missing ({teamHealth.missingSkills.length})
            </span>
            <span className="text-[10px] text-red-600 font-semibold">✕ Unmet</span>
          </div>
          <div className="space-y-1.5">
            {teamHealth.missingSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-container-lowest border border-red-200 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-primary">{item.skill}</span>
                <button
                  onClick={() => onFindMissingTeammate(item.skill)}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  Find Solver →
                </button>
              </div>
            ))}
            {teamHealth.missingSkills.length === 0 && (
              <span className="text-xs text-secondary italic">No missing required skills</span>
            )}
          </div>
        </div>

        {/* Redundant Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center justify-between text-xs font-bold text-primary mb-2.5">
            <span className="flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-secondary" />
              Overlaps ({teamHealth.redundantSkills.length})
            </span>
            <span className="text-[10px] text-secondary">3+ Members</span>
          </div>
          <div className="space-y-1.5">
            {teamHealth.redundantSkills.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-primary">{item.skill}</span>
                <span className="text-[10px] text-secondary font-mono">
                  {item.coveredBy.length}x duplicate
                </span>
              </div>
            ))}
            {teamHealth.redundantSkills.length === 0 && (
              <span className="text-xs text-secondary italic">No excessive redundancy</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
