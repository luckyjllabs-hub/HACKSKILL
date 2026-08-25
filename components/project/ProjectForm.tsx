"use client";

import React, { useState, useEffect } from "react";
import { Users, Clock, Tag, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
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
  const [description, setDescription] = useState("");
  const [teamSize, setTeamSize] = useState(4);
  const [availability, setAvailability] = useState("Flexible");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (selectedPreset) {
      setDescription(selectedPreset.description);
      setTeamSize(selectedPreset.desiredTeamSize);
      setCategory(selectedPreset.category);
      setAvailability("Flexible");
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
    <div id="project-form-section" className="w-full max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 py-10">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Project Builder
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-1">
              Describe What You're Building
            </h2>
            <p className="text-sm text-secondary mt-1">
              Our AI analyzes your technical requirements and deterministically builds the ideal team.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-secondary font-medium mr-1">Presets:</span>
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectSample(preset)}
                className="px-3 py-1 text-xs rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant font-medium transition-colors"
                title={preset.tagline}
              >
                {preset.title.split(" ")[1] || preset.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Build an AI-powered system that detects plant diseases from smartphone images and recommends treatments. We need a team of 4 with machine learning, mobile, and agritech domain expertise..."
              rows={4}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm text-on-surface bg-surface-container-low border border-outline-variant rounded-xl focus:bg-surface-container-lowest focus:border-primary focus:outline-none transition-all placeholder:text-secondary/60 resize-none"
            />
            <div className="flex justify-between text-[11px] text-secondary mt-1">
              <span>Be as specific as possible about the technical components.</span>
              <span>{description.length} chars</span>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Team Size */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <label className="flex items-center justify-between text-xs font-semibold text-primary mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  Target Team Size
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold">
                  {teamSize} People
                </span>
              </label>
              <input
                type="range"
                min={2}
                max={6}
                step={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                disabled={isLoading}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-secondary mt-1 font-mono">
                <span>2 (Duo)</span>
                <span>4 (Standard)</span>
                <span>6 (Squad)</span>
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                Availability Requirement
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="Flexible">Flexible (Any Sprint Schedule)</option>
                <option value="Weekdays">Weekdays (Daytime / Regular)</option>
                <option value="Evenings">Evenings (Post-Class Sessions)</option>
                <option value="Weekends">Weekends (Hackathon Sprint)</option>
              </select>
              <p className="text-[10px] text-secondary mt-1">Filters out schedule mismatches</p>
            </div>

            {/* Category */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                <Tag className="w-3.5 h-3.5 text-secondary" />
                Category (Optional)
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI / Smart Cities"
                disabled={isLoading}
                className="w-full px-3 py-2 text-xs text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary placeholder:text-secondary/60"
              />
              <p className="text-[10px] text-secondary mt-1">Leave blank for automatic inference</p>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="w-full py-4 px-8 rounded-full font-semibold text-sm text-on-primary bg-primary hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Project & Composing Team...
                </>
              ) : (
                <>
                  <span>Analyze Project & Match Team</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
