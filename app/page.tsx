"use client";

import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { ProjectForm } from "@/components/project/ProjectForm";
import { AnalysisProgress } from "@/components/project/AnalysisProgress";
import { ProjectRequirementsCard } from "@/components/matching/ProjectRequirementsCard";
import { TeamComposer } from "@/components/matching/TeamComposer";
import { TeamHealthPanel } from "@/components/matching/TeamHealthPanel";

const MissingTeammateModal = dynamic(
  () => import("@/components/matching/MissingTeammateModal").then((mod) => mod.MissingTeammateModal),
  { ssr: false }
);
const TalentDirectory = dynamic(
  () => import("@/components/talent/TalentDirectory").then((mod) => mod.TalentDirectory),
  { ssr: false }
);
const ProfileDrawer = dynamic(
  () => import("@/components/talent/ProfileDrawer").then((mod) => mod.ProfileDrawer),
  { ssr: false }
);
import {
  ProjectAnalysisInput,
  ProjectAnalysisResult,
  DemoPreset,
} from "@/types/project";
import {
  CandidateMatch,
  TeamScoreBreakdown,
  TeamHealthReport,
  TeamExplanationResult,
  MissingTeammateRecommendation,
} from "@/types/matching";
import { StudentProfile } from "@/types/student";
import { evaluateTeamScore } from "@/lib/matching/team-optimizer";
import { analyzeTeamHealth } from "@/lib/matching/team-health";
import { AlertCircle } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Project & Match State
  const [project, setProject] = useState<ProjectAnalysisResult | null>(null);
  const [team, setTeam] = useState<CandidateMatch[]>([]);
  const [teamScore, setTeamScore] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<TeamScoreBreakdown | null>(null);
  const [teamHealth, setTeamHealth] = useState<TeamHealthReport | null>(null);
  const [explanation, setExplanation] = useState<TeamExplanationResult | undefined>();
  const [rankedCandidates, setRankedCandidates] = useState<CandidateMatch[]>([]);

  // Missing Teammate State
  const [isFindingTeammate, setIsFindingTeammate] = useState(false);
  const [missingRecommendation, setMissingRecommendation] = useState<MissingTeammateRecommendation | null>(null);
  const [isMissingModalOpen, setIsMissingModalOpen] = useState(false);

  // Drawer / Directory state
  const [isTalentOpen, setIsTalentOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<StudentProfile | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<DemoPreset | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    const el = document.getElementById("project-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById("features-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setSelectedPreset(preset);
    scrollToForm();
  };

  // Submit Project for AI Analysis & Matching
  const handleAnalyzeProject = async (input: ProjectAnalysisInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/project/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze project and compose team");
      }

      const data = await res.json();
      setProject(data.project);
      setTeam(data.team);
      setTeamScore(data.teamScore);
      setBreakdown(data.breakdown);
      setTeamHealth(data.teamHealth);
      setExplanation(data.explanation);
      setRankedCandidates(data.rankedCandidates);

      // Scroll to results smoothly
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Something went wrong while connecting to the matching engine.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a member from the team (Triggers real-time skill gap recalculation & DB sync)
  const handleRemoveMember = (studentId: string) => {
    if (!project) return;

    const newTeam = team.filter((m) => m.student.id !== studentId);
    setTeam(newTeam);

    // Recalculate deterministic team score
    const newScoreResult = evaluateTeamScore(newTeam, project);
    setTeamScore(newScoreResult.teamScore);
    setBreakdown(newScoreResult.breakdown);

    // Recalculate real-time team health & critical gaps
    const newHealth = analyzeTeamHealth(newTeam, project);
    setTeamHealth(newHealth);

    // Automatically update database record
    fetch("/api/project/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project,
        team: newTeam,
        teamScore: newScoreResult.teamScore,
        breakdown: newScoreResult.breakdown,
        teamHealth: newHealth,
      }),
    }).catch((err) => console.warn("[DB Sync]:", err));
  };

  // Trigger Find Missing Teammate
  const handleFindMissingTeammate = async (targetSkill?: string) => {
    if (!project || team.length === 0) return;

    setIsFindingTeammate(true);
    try {
      const res = await fetch("/api/team/gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTeam: team,
          project,
          targetSkill,
        }),
      });

      if (!res.ok) {
        throw new Error("Could not find candidate to fill the gap");
      }

      const data = await res.json();
      setMissingRecommendation(data.recommendation);
      setIsMissingModalOpen(true);
    } catch (err: any) {
      console.error("Gap finder error:", err);
    } finally {
      setIsFindingTeammate(false);
    }
  };

  // Accept recommended missing teammate & auto-sync to DB
  const handleAcceptRecommendation = (rec: MissingTeammateRecommendation) => {
    if (!project) return;

    const newCandidateMatch: CandidateMatch = {
      student: rec.candidate,
      overallScore: rec.fitScore,
      assignedRole: rec.assignedRole,
      breakdown: {
        skillMatch: 90,
        interestAlignment: 85,
        availability: 95,
        experience: 80,
        pastProjectRelevance: 85,
        collaborationFit: 80,
      },
      matchedRequiredSkills: [rec.criticalSkill],
      matchedPreferredSkills: [],
      matchedInterests: project.domain,
      matchedProjects: rec.candidate.pastProjects.map((p) => p.title),
    };

    const updatedTeam = [...team, newCandidateMatch];
    setTeam(updatedTeam);

    const newScoreResult = evaluateTeamScore(updatedTeam, project);
    setTeamScore(newScoreResult.teamScore);
    setBreakdown(newScoreResult.breakdown);

    const newHealth = analyzeTeamHealth(updatedTeam, project);
    setTeamHealth(newHealth);

    // Automatically update database record
    fetch("/api/project/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project,
        team: updatedTeam,
        teamScore: newScoreResult.teamScore,
        breakdown: newScoreResult.breakdown,
        teamHealth: newHealth,
      }),
    }).catch((err) => console.warn("[DB Sync]:", err));

    setIsMissingModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-background">
      {/* TopAppBar */}
      <Navbar
        onOpenTalent={() => setIsTalentOpen(true)}
        onScrollToBuilder={scrollToForm}
        onScrollToFeatures={scrollToFeatures}
      />

      <main id="main-content" className="flex-grow" role="main" aria-label="Main application content">
        {/* Hero, Stats & Bento Grid Section */}
        <Hero
          onSelectPreset={handleSelectPreset}
          onScrollToForm={scrollToForm}
          onOpenTalent={() => setIsTalentOpen(true)}
        />

        {/* Project Input Form Section */}
        <section ref={formRef} className="pt-2">
          <ProjectForm
            onSubmit={handleAnalyzeProject}
            isLoading={isLoading}
            selectedPreset={selectedPreset}
          />
        </section>

        {/* AI Progress Sequence Display */}
        {isLoading && <AnalysisProgress />}

        {/* Error Notification */}
        {error && (
          <div role="alert" aria-live="assertive" className="max-w-2xl mx-auto my-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold"
              aria-label="Dismiss error message"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Section */}
        {project && breakdown && teamHealth && !isLoading && (
          <section ref={resultsRef} aria-label="AI matching results" className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16 py-12 space-y-8 animate-fadeIn">
            {/* 1. Structured AI Requirements Card */}
            <ProjectRequirementsCard project={project} />

            {/* 2. Team Health & Skill Gap Detector (The WOW Feature) */}
            <TeamHealthPanel
              teamHealth={teamHealth}
              onFindMissingTeammate={handleFindMissingTeammate}
              isFindingTeammate={isFindingTeammate}
            />

            {/* 3. Composed Team Roster & Why This Team */}
            <TeamComposer
              team={team}
              teamScore={teamScore}
              breakdown={breakdown}
              project={project}
              explanation={explanation}
              onRemoveMember={handleRemoveMember}
              onViewProfile={(student) => setActiveProfile(student)}
            />
          </section>
        )}
      </main>

      {/* Footer Component */}
      <footer role="contentinfo" aria-label="Site footer" className="bg-surface-container-lowest w-full py-16 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto gap-8 text-xs">
        <div>
          <span className="text-xl font-bold text-primary">PROJECT AI-X</span>
        </div>
        <div className="text-secondary flex gap-6">
          <a className="hover:text-primary transition-colors hover:underline" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors hover:underline" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-colors hover:underline" href="#">Contact Support</a>
        </div>
        <div className="text-secondary">
          © 2024 PROJECT AI-X. All rights reserved.
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MissingTeammateModal
        isOpen={isMissingModalOpen}
        recommendation={missingRecommendation}
        onClose={() => setIsMissingModalOpen(false)}
        onAcceptRecommendation={handleAcceptRecommendation}
      />

      <TalentDirectory
        isOpen={isTalentOpen}
        onClose={() => setIsTalentOpen(false)}
        onSelectStudent={(student) => {
          setActiveProfile(student);
          setIsTalentOpen(false);
        }}
      />

      <ProfileDrawer
        student={activeProfile}
        isOpen={Boolean(activeProfile)}
        onClose={() => setActiveProfile(null)}
      />
    </div>
  );
}
