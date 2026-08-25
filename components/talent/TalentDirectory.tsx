"use client";

import React, { useState, useMemo } from "react";
import { StudentProfile } from "@/types/student";
import { Users, Search, X } from "lucide-react";
import { SEEDED_STUDENTS } from "@/data/seed/students";

interface TalentDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: StudentProfile) => void;
}

export const TalentDirectory: React.FC<TalentDirectoryProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
}) => {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredStudents = useMemo(() => {
    return SEEDED_STUDENTS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.some((sk) => sk.name.toLowerCase().includes(search.toLowerCase())) ||
        s.department.toLowerCase().includes(search.toLowerCase()) ||
        s.interests.some((i) => i.toLowerCase().includes(search.toLowerCase()));

      if (selectedFilter === "All") return matchSearch;
      if (selectedFilter === "AI/ML") {
        return (
          matchSearch &&
          s.skills.some((sk) =>
            ["Machine Learning", "Computer Vision", "Natural Language Processing", "Python"].includes(
              sk.name
            )
          )
        );
      }
      if (selectedFilter === "Web & Backend") {
        return (
          matchSearch &&
          s.skills.some((sk) =>
            ["Full Stack", "Frontend", "Backend", "React", "APIs"].includes(sk.name)
          )
        );
      }
      if (selectedFilter === "Design") {
        return (
          matchSearch &&
          s.skills.some((sk) => ["UI/UX", "Product Design"].includes(sk.name))
        );
      }
      if (selectedFilter === "Domain Specialists") {
        return (
          matchSearch &&
          s.skills.some((sk) =>
            [
              "Sustainability",
              "Domain Expertise",
              "Healthcare",
              "FinTech",
              "Agriculture",
              "Geospatial Data",
            ].includes(sk.name)
          )
        );
      }
      return matchSearch;
    });
  }, [search, selectedFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary tracking-tight">Student Talent Pool ({SEEDED_STUDENTS.length})</h3>
              <p className="text-xs text-secondary">
                Verified candidate dataset across engineering, AI/ML, design, and domain specialties.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="py-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill (e.g. Computer Vision, Sustainability, React), or department..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-on-surface bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "AI/ML", "Web & Backend", "Design", "Domain Specialists"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap font-medium ${
                    selectedFilter === filter
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-low text-secondary hover:text-primary border border-outline-variant"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary/40 cursor-pointer transition-all hover:shadow-md group"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover border border-outline-variant"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-primary group-hover:underline truncate">
                        {student.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                        Yr {student.year}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-primary mt-0.5 truncate">
                      {student.preferredRoles[0] || student.department}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {student.skills.slice(0, 3).map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-low text-secondary border border-outline-variant"
                        >
                          {sk.name}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-[10px] text-secondary font-medium self-center">
                          +{student.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-12 text-center text-xs text-secondary">
              No students matched your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
