"use client";

import React from "react";
import { StudentProfile } from "@/types/student";
import { X, Clock, Award, BookOpen, Layers, Briefcase } from "lucide-react";

interface ProfileDrawerProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container-lowest border-l border-outline-variant h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <span className="text-xs uppercase font-bold text-secondary tracking-wider">
            Student Profile Details
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-start gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover border border-outline-variant shadow-sm"
          />
          <div>
            <h3 className="text-xl font-bold text-primary">{student.name}</h3>
            <p className="text-xs text-primary font-semibold mt-0.5">{student.preferredRoles.join(" • ")}</p>
            <p className="text-xs text-secondary mt-0.5">
              {student.department} • Year {student.year}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs text-secondary leading-relaxed">
          {student.bio}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <span className="text-secondary flex items-center gap-1 mb-1 font-medium">
              <Award className="w-3.5 h-3.5" />
              Experience Level
            </span>
            <span className="font-bold text-primary">{student.experienceLevel}</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
            <span className="text-secondary flex items-center gap-1 mb-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Availability
            </span>
            <span className="font-bold text-primary">{student.availability.join(", ")}</span>
          </div>
        </div>

        {/* Verified Skills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            Verified Skills ({student.skills.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {student.skills.map((s, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant text-primary font-medium"
              >
                {s.name} <span className="text-secondary text-[10px]">({s.level})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            Domain Interests
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {student.interests.map((interest, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-0.5 rounded-full bg-surface-container border border-outline-variant text-secondary"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Past Projects */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            Past Projects ({student.pastProjects.length})
          </h4>
          <div className="space-y-3">
            {student.pastProjects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-bold text-primary">
                  <span>{proj.title}</span>
                  <span className="text-[10px] text-secondary">{proj.category}</span>
                </div>
                {proj.description && (
                  <p className="text-secondary text-xs leading-relaxed">
                    {proj.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.skills.map((sk, skIdx) => (
                    <span
                      key={skIdx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-lowest border border-outline-variant text-secondary"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
