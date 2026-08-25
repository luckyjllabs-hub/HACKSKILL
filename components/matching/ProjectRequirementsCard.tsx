"use client";

import React from "react";
import { ProjectAnalysisResult } from "@/types/project";
import {
  Cpu,
  Layout,
  Database,
  Terminal,
} from "lucide-react";

interface ProjectRequirementsCardProps {
  project: ProjectAnalysisResult;
  onScrollToTeam?: () => void;
}

export const ProjectRequirementsCard: React.FC<ProjectRequirementsCardProps> = ({
  project,
  onScrollToTeam,
}) => {
  const rolesList = project.suggestedRoles || project.roles || [];

  const getRoleIcon = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower.includes("ml") || lower.includes("ai") || lower.includes("vision") || lower.includes("model")) {
      return <Cpu className="w-4 h-4 text-black" />;
    }
    if (lower.includes("front") || lower.includes("ui") || lower.includes("ux") || lower.includes("design")) {
      return <Layout className="w-4 h-4 text-black" />;
    }
    if (lower.includes("data") || lower.includes("architect") || lower.includes("backend") || lower.includes("cloud")) {
      return <Database className="w-4 h-4 text-black" />;
    }
    return <Terminal className="w-4 h-4 text-black" />;
  };

  // Helper to partition required and preferred skills across suggested roles
  const getRoleSkills = (index: number) => {
    const totalRequired = project.requiredSkills;
    const totalPreferred = project.preferredSkills;

    const reqSlice = totalRequired.slice(index * 2, index * 2 + 2);
    const prefSlice = totalPreferred.slice(index, index + 1);

    return {
      required: reqSlice.length > 0 ? reqSlice : totalRequired.slice(0, 2),
      preferred: prefSlice.length > 0 ? prefSlice : totalPreferred.slice(0, 1),
    };
  };

  const summaryText =
    project.summary ||
    `The proposed platform requires a robust backend capable of real-time data processing and advanced predictive modeling. Key challenges include maintaining low-latency responses while processing high volumes of transactional data. The front-end needs to present complex financial analytics in an intuitive, accessible dashboard format.`;

  return (
    <section className="space-y-6 animate-fadeInUp">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
            AI Analysis Complete
          </h2>
          <p className="text-xs sm:text-sm text-[#5d5f5f] mt-1 font-normal">
            Review the insights generated for your new project brief.
          </p>
        </div>

        <div>
          <button
            onClick={() => {
              if (onScrollToTeam) {
                onScrollToTeam();
              } else {
                const el = document.getElementById("team-composer-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollBy({ top: 500, behavior: "smooth" });
                }
              }
            }}
            className="bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all btn-press shadow-sm flex items-center gap-1.5"
          >
            <span>Build My Team</span>
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Project Overview & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Project Overview (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 bg-white border border-[#e2e2e2] rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-start hover-lift">
          {/* Top Row: Title & Domain Chips */}
          <div className="flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-[#f0f0f0]">
            <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
              Project Overview
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {project.domain.map((dom, idx) => (
                <span
                  key={idx}
                  className="bg-[#f3f3f4] text-[#5d5f5f] text-xs px-3 py-1 rounded-full font-medium border border-[#e8e8e8]"
                >
                  {dom}
                </span>
              ))}
            </div>
          </div>

          {/* AI Summary Moved Directly to the Top with Bigger, Legible Typography */}
          <div className="pt-6 space-y-3">
            <span className="text-[11px] font-bold tracking-wider text-[#747878] uppercase block">
              AI SUMMARY
            </span>
            <p className="text-base sm:text-lg text-[#333536] leading-relaxed font-normal">
              {summaryText}
            </p>
          </div>
        </div>

        {/* Right Card: Parameters (Spans 1 col on lg) */}
        <div className="bg-white border border-[#e2e2e2] rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-4 hover-lift">
          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-2">
            Parameters
          </h3>

          {/* Sub-card 1: Recommended Team Size */}
          <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-4 sm:p-5 space-y-1">
            <span className="text-[10px] text-[#747878] font-medium block">
              Recommended Team Size
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              {project.recommendedTeamSize} - {project.recommendedTeamSize + 2} Members
            </p>
          </div>

          {/* Sub-card 2: Experience Level */}
          <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-4 sm:p-5 space-y-1">
            <span className="text-[10px] text-[#747878] font-medium block">
              Experience Level
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              Senior / Lead
            </p>
            <p className="text-[11px] text-[#747878] leading-relaxed pt-1">
              Due to technical core components, balanced expertise is advised for domain & core engineering roles.
            </p>
          </div>

          {/* Sub-card 3: Estimated Timeline */}
          <div className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-4 sm:p-5 space-y-1">
            <span className="text-[10px] text-[#747878] font-medium block">
              Estimated Timeline
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-black tracking-tight">
              12 - 16 Weeks
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Card: Suggested Roles */}
      <div className="bg-white border border-[#e2e2e2] rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover-lift">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
            Suggested Roles
          </h3>
          <span className="text-[10px] text-[#747878] font-medium">
            Based on Skill Requirements
          </span>
        </div>

        {/* 3 Roles Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rolesList.slice(0, 3).map((role, idx) => {
            const roleSkills = getRoleSkills(idx);

            return (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-[#e8e8e8] rounded-2xl p-5 space-y-4 hover:border-black/30 transition-all"
              >
                {/* Role Header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#e2e2e2] flex items-center justify-center">
                    {getRoleIcon(role)}
                  </div>
                  <h4 className="font-bold text-sm text-black tracking-tight">
                    {role}
                  </h4>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#747878] block">
                    Required
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleSkills.required.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-white border border-[#e2e2e2] text-black text-xs px-2.5 py-1 rounded-md font-medium shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {roleSkills.preferred.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#747878] block">
                      Preferred
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {roleSkills.preferred.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-white border border-[#e2e2e2] text-[#5d5f5f] text-xs px-2.5 py-1 rounded-md font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
