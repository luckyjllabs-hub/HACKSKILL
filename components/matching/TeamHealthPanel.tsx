"use client";

import React from "react";
import { TeamHealthReport } from "@/types/matching";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface TeamHealthPanelProps {
  teamHealth: TeamHealthReport;
  onFindMissingTeammate: (targetSkill?: string) => void;
  isFindingTeammate?: boolean;
}

export const TeamHealthPanel: React.FC<TeamHealthPanelProps> = ({
  teamHealth,
  onFindMissingTeammate,
  isFindingTeammate = false,
}) => {
  const getStatusBadge = () => {
    if (teamHealth.missingSkills.length > 0) {
      return {
        label: `CRITICAL GAPS (${teamHealth.healthScore}%)`,
        className: "border-[#ef4444] text-[#dc2626] bg-[#fee2e2]/40",
      };
    }
    if (teamHealth.weakSkills.length > 0) {
      return {
        label: `NEEDS ATTENTION (${teamHealth.healthScore}%)`,
        className: "border-[#f59e0b] text-[#d97706] bg-[#fef3c7]/40",
      };
    }
    return {
      label: `OPTIMAL (${teamHealth.healthScore}%)`,
      className: "border-[#10b981] text-[#059669] bg-[#d1fae5]/40",
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-white border border-[#e2e2e2] rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6 hover-lift">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f3f3f4] flex items-center justify-center text-black">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Team Health & Skill Gap Detector
              </h3>
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#747878] mt-1 font-normal">
              Live capability audit across all project required and preferred milestones.
            </p>
          </div>
        </div>

        {/* 1-Click Gap Solver Action */}
        {teamHealth.missingSkills.length > 0 && (
          <button
            onClick={() => onFindMissingTeammate(teamHealth.missingSkills[0]?.skill)}
            disabled={isFindingTeammate}
            className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center gap-2 btn-press whitespace-nowrap shadow-sm"
          >
            {isFindingTeammate ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Finding Candidate...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resolve Missing Gap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#e8e8e8] my-6" />

      {/* 2x2 Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Covered Card */}
        <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Covered ({teamHealth.coveredSkills.length})</span>
            </div>
            <span className="text-xs text-[#747878] font-medium">✓ Strong</span>
          </div>

          <div className="space-y-2.5">
            {teamHealth.coveredSkills.length > 0 ? (
              teamHealth.coveredSkills.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e2e2e2] rounded-full px-5 py-3 flex items-center justify-between shadow-2xs"
                >
                  <span className="font-bold text-xs text-black">{c.skill}</span>
                  <span className="text-xs text-[#747878] font-medium">
                    {c.coveredBy.map((s) => s.studentName.split(" ")[0]).join(", ")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#747878] italic pt-1">No covered skills</p>
            )}
          </div>
        </div>

        {/* 2. Weak Card */}
        <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Weak ({teamHealth.weakSkills.length})</span>
            </div>
            <span className="text-xs text-[#747878] font-medium">⚠ Low Depth</span>
          </div>

          <div className="space-y-2.5">
            {teamHealth.weakSkills.length > 0 ? (
              teamHealth.weakSkills.map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e2e2e2] rounded-full px-5 py-3 flex items-center justify-between shadow-2xs"
                >
                  <span className="font-bold text-xs text-black">{w.skill}</span>
                  <span className="text-xs text-[#747878] font-medium">No Expert</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#747878] italic pt-1">No weak skill bottlenecks</p>
            )}
          </div>
        </div>

        {/* 3. Missing Card */}
        <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>Missing ({teamHealth.missingSkills.length})</span>
            </div>
            <span className="text-xs text-[#747878] font-medium">✕ Unmet</span>
          </div>

          <div className="space-y-2.5">
            {teamHealth.missingSkills.length > 0 ? (
              teamHealth.missingSkills.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#ef4444]/40 rounded-full px-5 py-2.5 flex items-center justify-between shadow-2xs"
                >
                  <span className="font-bold text-xs text-red-600">{m.skill}</span>
                  <button
                    onClick={() => onFindMissingTeammate(m.skill)}
                    disabled={isFindingTeammate}
                    className="bg-black text-white text-[11px] font-semibold px-3 py-1 rounded-full hover:opacity-90 transition-all flex items-center gap-1 btn-press"
                  >
                    <span>Resolve Gap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#747878] italic pt-1">No missing required skills</p>
            )}
          </div>
        </div>

        {/* 4. Overlaps Card */}
        <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-sm font-bold text-black">
              <Users className="w-4 h-4 text-black" />
              <span>Overlaps ({teamHealth.redundantSkills.length})</span>
            </div>
            <span className="text-xs text-[#747878] font-medium">3+ Members</span>
          </div>

          <div className="space-y-2.5">
            {teamHealth.redundantSkills.length > 0 ? (
              teamHealth.redundantSkills.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#e2e2e2] rounded-full px-5 py-3 flex items-center justify-between shadow-2xs"
                >
                  <span className="font-bold text-xs text-black">{r.skill}</span>
                  <span className="text-xs text-[#747878] font-medium">
                    {r.coveredBy.length} Members
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#747878] italic pt-1">No excessive redundancy</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
