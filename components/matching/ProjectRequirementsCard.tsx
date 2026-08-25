"use client";

import React from "react";
import { ProjectAnalysisResult } from "@/types/project";
import { CheckCircle, PlusCircle, UserCheck, Tag } from "lucide-react";

interface ProjectRequirementsCardProps {
  project: ProjectAnalysisResult;
}

export const ProjectRequirementsCard: React.FC<ProjectRequirementsCardProps> = ({ project }) => {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-outline-variant">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Extracted Requirements
          </span>
          <h3 className="text-xl font-bold text-primary tracking-tight mt-0.5">
            AI Project Analysis
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Structured requirements identified by Gemini 3.7 Flash
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-surface-container text-on-surface border border-outline-variant font-medium">
            Category: {project.projectCategory}
          </span>
          {project.isFallback && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-high text-secondary border border-outline-variant">
              Heuristic Mode
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Required Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            Required Capabilities ({project.requiredSkills.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-surface-container-lowest text-primary border border-outline-variant font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2.5">
            <PlusCircle className="w-3.5 h-3.5 text-secondary" />
            Preferred / Bonus Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.preferredSkills.length > 0 ? (
              project.preferredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-full bg-surface-container-lowest text-secondary border border-outline-variant font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-secondary/70">None specified</span>
            )}
          </div>
        </div>

        {/* Roles & Domains */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2.5">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            Key Project Roles & Domains
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.roles.map((role, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-primary border border-outline-variant font-medium"
              >
                {role}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-secondary flex items-center gap-1 mt-2">
            <Tag className="w-3 h-3" />
            Domains: {project.domain.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
};
