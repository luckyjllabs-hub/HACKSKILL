"use client";

import React, { useState, useEffect } from "react";
import { Users, Clock, Tag, RefreshCw, ArrowRight } from "lucide-react";
import { DEMO_PRESETS } from "@/data/seed/demo-presets";
import { DemoPreset, ProjectAnalysisInput } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (input: ProjectAnalysisInput) => void;
  isLoading: boolean;
  selectedPreset?: DemoPreset | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isLoading,
  selectedPreset,
}) => {
  const [description, setDescription] = useState(DEMO_PRESETS[0].description);
  const [teamSize, setTeamSize] = useState(4);
  const [availability, setAvailability] = useState("Flexible (Any Sprint Schedule)");
  const [category, setCategory] = useState("AI / Sustainability");

  useEffect(() => {
    if (selectedPreset) {
      setDescription(selectedPreset.description);
      setTeamSize(selectedPreset.desiredTeamSize);
      setCategory(selectedPreset.category);
      setAvailability("Flexible (Any Sprint Schedule)");
    }
  }, [selectedPreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    onSubmit({
      description: description.trim(),
      desiredTeamSize: teamSize,
      category: category.trim() || undefined,
      availability,
    });
  };

  const handleSelectSample = (preset: DemoPreset) => {
    setDescription(preset.description);
    setTeamSize(preset.desiredTeamSize);
    setCategory(preset.category);
  };

  return (
    <div id="project-form-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 py-6">
      <div className="bg-white border border-[#e2e2e2] rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878] block mb-2">
              PROJECT BUILDER
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight leading-[1.05] max-w-sm">
              Describe<br />
              What<br />
              You&apos;re<br />
              Building
            </h2>
            <p className="text-xs sm:text-sm text-[#5d5f5f] mt-4 max-w-xs leading-relaxed font-normal">
              Our AI analyzes your technical requirements and deterministically builds the ideal team.
            </p>
          </div>

          {/* Quick Preset Selector Pills */}
          <div className="flex items-center gap-2 flex-wrap md:justify-end pt-1">
            <span className="text-xs text-[#5d5f5f] font-medium mr-1">Presets:</span>
            {DEMO_PRESETS.map((preset) => {
              const label =
                preset.id === "preset-waste-ai"
                  ? "Campus"
                  : preset.id === "preset-pothole-cv"
                  ? "Pothole"
                  : preset.id === "preset-agritech-drone"
                  ? "Agritech"
                  : preset.id === "preset-mental-wellness"
                  ? "Mental"
                  : "Micro-Lending";

              const isActive = description === preset.description;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectSample(preset)}
                  className={`px-3.5 py-1 text-xs rounded-full border transition-all font-medium ${
                    isActive
                      ? "bg-black text-white border-black"
                      : "bg-white text-[#444748] border-[#c4c7c7] hover:border-black hover:text-black"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#e8e8e8] my-8" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Project analysis form">
          {/* Project Description Block */}
          <div>
            <label htmlFor="project-description" className="block text-[11px] font-bold uppercase tracking-wider text-[#1a1c1c] mb-3">
              PROJECT DESCRIPTION <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <div className="bg-[#f3f3f4] rounded-2xl p-4 sm:p-5 border border-transparent focus-within:border-black focus-within:bg-white transition-all">
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="We are building an AI-powered system..."
                rows={4}
                required
                aria-required="true"
                aria-describedby="desc-hint"
                disabled={isLoading}
                className="w-full text-sm text-[#1a1c1c] bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-[#858383] resize-none leading-relaxed p-0"
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#747878] mt-2 px-1">
              <span id="desc-hint">Be as specific as possible about the technical components.</span>
              <span className="font-mono">{description.length} chars</span>
            </div>
          </div>

          {/* 3 Parameter Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* 1. Target Team Size */}
            <div className="bg-[#f3f3f4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1c]">
                    <Users className="w-4 h-4 text-[#5d5f5f]" />
                    Target Team Size
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold">
                    {teamSize} People
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={6}
                  step={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  disabled={isLoading}
                  className="w-full accent-black cursor-pointer h-1.5 bg-[#e2e2e2] rounded-lg"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#747878] mt-2 font-mono">
                <span>2 (Duo)</span>
                <span>4 (Standard)</span>
                <span>6 (Squad)</span>
              </div>
            </div>

            {/* 2. Availability Requirement */}
            <div className="bg-[#f3f3f4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1c] mb-2.5">
                  <Clock className="w-4 h-4 text-[#5d5f5f]" />
                  Availability Requirement
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2 text-xs text-[#1a1c1c] bg-white border border-[#c4c7c7] rounded-full focus:outline-none focus:border-black font-medium"
                >
                  <option value="Flexible (Any Sprint Schedule)">Flexible (Any Sprint Schedule)</option>
                  <option value="Weekdays (Daytime / Regular)">Weekdays (Daytime / Regular)</option>
                  <option value="Evenings (Post-Class Sessions)">Evenings (Post-Class Sessions)</option>
                  <option value="Weekends (Hackathon Sprint)">Weekends (Hackathon Sprint)</option>
                </select>
              </div>
              <p className="text-[10px] text-[#747878] mt-2">Filters out schedule mismatches</p>
            </div>

            {/* 3. Category (Optional) */}
            <div className="bg-[#f3f3f4] rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[140px]">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1c] mb-2.5">
                  <Tag className="w-4 h-4 text-[#5d5f5f]" />
                  Category (Optional)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. AI / Sustainability"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2 text-xs text-[#1a1c1c] bg-white border border-[#c4c7c7] rounded-full focus:outline-none focus:border-black font-medium placeholder:text-[#858383]"
                />
              </div>
              <p className="text-[10px] text-[#747878] mt-2">Leave blank for automatic inference</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="w-full py-4 px-8 rounded-full font-bold text-sm text-white bg-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Project & Matching Team...</span>
                </>
              ) : (
                <>
                  <span>Analyze Project & Match Team</span>
                  <span className="text-base font-normal">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
