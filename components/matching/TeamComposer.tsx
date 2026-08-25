"use client";

import React, { useState } from "react";
import { CandidateMatch, TeamScoreBreakdown, TeamExplanationResult } from "@/types/matching";
import { ProjectAnalysisResult } from "@/types/project";
import { StudentProfile } from "@/types/student";
import {
  Users,
  ShieldCheck,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock,
  Briefcase,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { formatPercent } from "@/lib/utils";

interface TeamComposerProps {
  team: CandidateMatch[];
  teamScore: number;
  breakdown: TeamScoreBreakdown;
  project: ProjectAnalysisResult;
  explanation?: TeamExplanationResult;
  onRemoveMember: (studentId: string) => void;
  onViewProfile: (student: StudentProfile) => void;
}

export const TeamComposer: React.FC<TeamComposerProps> = ({
  team,
  teamScore,
  breakdown,
  project,
  explanation,
  onRemoveMember,
  onViewProfile,
}) => {
  const [showExplanation, setShowExplanation] = useState(true);
  const [copied, setCopied] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopyTeam = () => {
    const text = `🎯 PROJECT AI-X Team for "${project.projectCategory}"\n` +
      `Overall Compatibility: ${teamScore}%\n\n` +
      team
        .map(
          (m, idx) =>
            `${idx + 1}. ${m.student.name} — ${m.assignedRole} (${m.overallScore}% Fit)\n   Skills: ${m.student.skills.map((s) => s.name).join(", ")}`
        )
        .join("\n\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/project/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project,
          team,
          teamScore,
          breakdown,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Score & Metrics */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-outline-variant">
          {/* Title & Score */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center shadow-sm">
              <span className="text-3xl font-bold tracking-tight font-sans">
                {teamScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-on-primary-container">Team Fit</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                  Recommended Team
                </h2>
                <span className="text-xs px-3 py-0.5 rounded-full bg-surface-container text-primary font-semibold border border-outline-variant">
                  Complementary
                </span>
              </div>
              <p className="text-sm text-secondary mt-1 max-w-xl">
                Optimized by deterministic combinatorial scoring to maximize role diversity and minimize redundancy.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-primary bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Saved to Cloud</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                  <span>{isSaving ? "Saving..." : "Save to Cloud"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyTeam}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-primary bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Copied Roster</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-secondary" />
                  <span>Export Team</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Deterministic Metric Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-center justify-between text-xs text-secondary mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Skill Coverage
              </span>
              <span className="font-bold text-primary">{formatPercent(breakdown.skillCoverage)}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${breakdown.skillCoverage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-center justify-between text-xs text-secondary mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Complementarity
              </span>
              <span className="font-bold text-primary">{formatPercent(breakdown.complementarity)}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${breakdown.complementarity}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-center justify-between text-xs text-secondary mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Availability Overlap
              </span>
              <span className="font-bold text-primary">{formatPercent(breakdown.availability)}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${breakdown.availability}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <div className="flex items-center justify-between text-xs text-secondary mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Candidate Quality
              </span>
              <span className="font-bold text-primary">{formatPercent(breakdown.candidateQuality)}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${breakdown.candidateQuality}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            Selected Members ({team.length})
          </h3>
          <span className="text-xs text-secondary">Click remove to test real-time skill gap analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((member) => {
            return (
              <div
                key={member.student.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:border-primary/40 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Avatar & Meta */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={member.student.avatar}
                      alt={member.student.name}
                      className="w-14 h-14 rounded-full object-cover border border-outline-variant"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewProfile(member.student)}
                          className="font-bold text-base text-primary hover:underline transition-colors text-left"
                        >
                          {member.student.name}
                        </button>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                          Yr {member.student.year}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-primary mt-0.5">
                        {member.assignedRole}
                      </div>

                      <p className="text-xs text-secondary truncate max-w-[200px] mt-0.5">
                        {member.student.department}
                      </p>
                    </div>
                  </div>

                  {/* Individual Score & Remove */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary">
                      {member.overallScore}% Fit
                    </div>
                    <button
                      onClick={() => onRemoveMember(member.student.id)}
                      className="text-xs flex items-center gap-1 text-secondary hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-surface-container"
                      title="Remove member to test skill gap detector"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-4 pt-3.5 border-t border-outline-variant">
                  <div className="text-xs font-semibold text-secondary mb-2">Core Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.student.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface border border-outline-variant font-medium"
                      >
                        {s.name} <span className="text-secondary text-[10px]">({s.level})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Relevant Project */}
                {member.student.pastProjects.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-secondary">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span className="truncate">
                      Past: <span className="text-primary font-medium">{member.student.pastProjects[0].title}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* "Why This Team?" Grounded AI Explanation Accordion */}
      {explanation && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
          >
            <div>
              <h3 className="text-base font-bold text-primary">Why This Team? (AI Grounded Explanation)</h3>
              <p className="text-xs text-secondary mt-0.5">
                Gemini-generated rationale strictly citing verified student profile facts.
              </p>
            </div>
            {showExplanation ? (
              <ChevronUp className="w-5 h-5 text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-secondary" />
            )}
          </button>

          {showExplanation && (
            <div className="p-6 pt-0 border-t border-outline-variant space-y-5">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface leading-relaxed mt-4">
                <span className="font-semibold text-primary">Executive Summary: </span>
                {explanation.teamSummary}
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Member Contribution Rationale:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {explanation.members.map((m, idx) => {
                    const student = team.find((t) => t.student.id === m.profileId)?.student;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                        <div className="flex items-center justify-between text-xs font-bold text-primary mb-1">
                          <span>{student?.name || m.profileId}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container border border-outline-variant text-secondary">
                            {m.role}
                          </span>
                        </div>
                        <p className="text-xs text-secondary leading-relaxed mb-2.5">{m.reason}</p>
                        {m.evidence && m.evidence.length > 0 && (
                          <div className="space-y-1">
                            {m.evidence.map((ev, evIdx) => (
                              <div key={evIdx} className="text-[11px] text-primary flex items-start gap-1.5 font-medium">
                                <span className="text-secondary mt-0.5">•</span>
                                <span>{ev}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-on-surface leading-relaxed">
                <span className="font-semibold text-primary">Complementarity Analysis: </span>
                {explanation.complementarityExplanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
