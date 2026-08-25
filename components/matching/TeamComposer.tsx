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
  Sparkles,
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
    <div id="team-composer-section" className="space-y-6">
      {/* Top Banner: Score & Metrics */}
      <div className="bg-white border border-[#e2e2e2] rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover-lift">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#e8e8e8]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878] block">
              OPTIMIZED ROSTER
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Recommended Team Composition
            </h2>
            <p className="text-xs sm:text-sm text-[#5d5f5f]">
              Mathematically balanced for maximum capability coverage, role distribution, and schedule overlap.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-[#f3f3f4] hover:bg-[#eaeaea] border border-[#e2e2e2] transition-colors btn-press"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-black bg-[#f3f3f4] hover:bg-[#eaeaea] border border-[#e2e2e2] transition-colors btn-press"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Copied Roster</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#5d5f5f]" />
                  <span>Export Team</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Deterministic Metric Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e8e8e8]">
            <div className="flex items-center justify-between text-xs text-[#5d5f5f] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-black" />
                Skill Coverage
              </span>
              <span className="font-bold text-black">{formatPercent(breakdown.skillCoverage)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#e2e2e2] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${breakdown.skillCoverage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e8e8e8]">
            <div className="flex items-center justify-between text-xs text-[#5d5f5f] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                Complementarity
              </span>
              <span className="font-bold text-black">{formatPercent(breakdown.complementarity)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#e2e2e2] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${breakdown.complementarity}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e8e8e8]">
            <div className="flex items-center justify-between text-xs text-[#5d5f5f] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black" />
                Availability Overlap
              </span>
              <span className="font-bold text-black">{formatPercent(breakdown.availability)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#e2e2e2] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${breakdown.availability}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#e8e8e8]">
            <div className="flex items-center justify-between text-xs text-[#5d5f5f] mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-black" />
                Candidate Quality
              </span>
              <span className="font-bold text-black">{formatPercent(breakdown.candidateQuality)}</span>
            </div>
            <div className="w-full h-1.5 bg-[#e2e2e2] rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                style={{ width: `${breakdown.candidateQuality}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#5d5f5f] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-black" />
            Selected Members ({team.length})
          </h3>
          <span className="text-xs text-[#747878]">Click remove to test real-time skill gap analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((member) => {
            return (
              <div
                key={member.student.id}
                className="bg-white border border-[#e2e2e2] rounded-2xl p-6 hover:border-black/40 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative hover-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Avatar & Meta */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={member.student.avatar}
                      alt={member.student.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#e2e2e2]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewProfile(member.student)}
                          className="font-bold text-base text-black hover:underline transition-colors text-left"
                        >
                          {member.student.name}
                        </button>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f3f3f4] text-[#5d5f5f]">
                          Yr {member.student.year}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-black mt-0.5">
                        {member.assignedRole}
                      </div>

                      <p className="text-xs text-[#747878] truncate max-w-[200px] mt-0.5">
                        {member.student.department}
                      </p>
                    </div>
                  </div>

                  {/* Individual Score & Remove */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white">
                      {member.overallScore}% Fit
                    </div>
                    <button
                      onClick={() => onRemoveMember(member.student.id)}
                      className="text-xs flex items-center gap-1 text-[#747878] hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-[#f3f3f4]"
                      title="Remove member to test skill gap detector"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-4 pt-3.5 border-t border-[#f0f0f0]">
                  <div className="text-xs font-semibold text-[#5d5f5f] mb-2">Core Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.student.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#f8f9fa] text-black border border-[#e2e2e2] font-medium"
                      >
                        {s.name} <span className="text-[#747878] text-[10px]">({s.level})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Relevant Project */}
                {member.student.pastProjects.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#5d5f5f]">
                    <Briefcase className="w-3.5 h-3.5 text-black" />
                    <span className="truncate">
                      Past: <span className="text-black font-medium">{member.student.pastProjects[0].title}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* "Why This Team?" (AI Grounded Explanation) Widget */}
      {explanation && (
        <div className="bg-white border border-[#e2e2e2] rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                Why This Team? (AI Grounded Explanation)
              </h3>
              <p className="text-xs sm:text-sm text-[#747878] font-normal flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Gemini-generated rationale strictly citing verified student profile facts.
              </p>
            </div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="p-2 rounded-full hover:bg-[#f3f3f4] text-[#747878] transition-colors"
            >
              {showExplanation ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="w-full h-px bg-[#e8e8e8]" />

          {showExplanation && (
            <div className="space-y-6 animate-fadeIn">
              {/* Executive Summary Box */}
              <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl sm:rounded-full px-6 py-4 text-xs sm:text-sm text-[#444748] leading-relaxed">
                <span className="font-bold text-black">Executive Summary: </span>
                {explanation.teamSummary ||
                  `This ${team.length}-member team was formulated to maximize complementary skill coverage for ${project.projectCategory}. It balances technical execution with domain requirements.`}
              </div>

              {/* Member Contribution Rationale */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#747878] mb-3 block">
                  MEMBER CONTRIBUTION RATIONALE:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {explanation.members.map((m, idx) => {
                    const student = team.find((t) => t.student.id === m.profileId)?.student;
                    const studentName = student?.name || m.profileId;
                    const skillsList = student?.skills.slice(0, 3).map((s) => s.name).join(", ") || "";
                    const pastProj = student?.pastProjects[0];

                    return (
                      <div
                        key={idx}
                        className="bg-white border border-[#e2e2e2] rounded-2xl p-6 space-y-4 shadow-2xs hover-lift"
                      >
                        {/* Top inside card */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-black">{studentName}</h4>
                          <span className="bg-[#f3f3f4] text-[#5d5f5f] text-xs px-3 py-0.5 rounded-full font-medium border border-[#e8e8e8]">
                            {m.role}
                          </span>
                        </div>

                        {/* Rationale description */}
                        <p className="text-xs text-[#5d5f5f] leading-relaxed">
                          {studentName} provides vital {m.role} execution capabilities, covering key project requirements.
                        </p>

                        {/* Bullets */}
                        <div className="space-y-2 pt-1 border-t border-[#f0f0f0]">
                          {pastProj && (
                            <div className="text-xs text-[#333536] leading-relaxed flex items-start gap-2">
                              <span className="text-black font-bold">•</span>
                              <span>
                                Completed &quot;{pastProj.title}&quot; in {pastProj.category || project.projectCategory}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-[#333536] leading-relaxed flex items-start gap-2">
                            <span className="text-black font-bold">•</span>
                            <span>
                              Advanced proficiency with {skillsList}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Complementarity Analysis Box */}
              <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-5 text-xs sm:text-sm text-[#444748] leading-relaxed">
                <span className="font-bold text-black">Complementarity Analysis: </span>
                {explanation.complementarityExplanation ||
                  `Each member fulfills distinct roles (${team.map((m) => m.assignedRole).join(", ")}) minimizing redundancy and providing complete coverage across required capabilities.`}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
