import { StudentProfile } from "./student";

export interface CandidateScoreBreakdown {
  skillMatch: number; // 0-100 (weight: 0.40)
  interestAlignment: number; // 0-100 (weight: 0.20)
  availability: number; // 0-100 (weight: 0.15)
  experience: number; // 0-100 (weight: 0.10)
  pastProjectRelevance: number; // 0-100 (weight: 0.10)
  collaborationFit: number; // 0-100 (weight: 0.05)
}

export interface CandidateMatch {
  student: StudentProfile;
  overallScore: number; // 0-100
  assignedRole: string;
  breakdown: CandidateScoreBreakdown;
  matchedRequiredSkills: string[];
  matchedPreferredSkills: string[];
  matchedInterests: string[];
  matchedProjects: string[];
  isRedundant?: boolean;
}

export interface TeamScoreBreakdown {
  skillCoverage: number; // 0-100 (weight: 0.35)
  complementarity: number; // 0-100 (weight: 0.25)
  candidateQuality: number; // 0-100 (weight: 0.15)
  interestAlignment: number; // 0-100 (weight: 0.10)
  availability: number; // 0-100 (weight: 0.10)
  experienceRelevance: number; // 0-100 (weight: 0.05)
}

export interface SkillHealthItem {
  skill: string;
  status: "strong" | "weak" | "missing" | "redundant";
  coveragePercent: number;
  coveredBy: {
    studentId: string;
    studentName: string;
    level: string;
  }[];
}

export interface TeamHealthReport {
  overallHealth: "Optimal" | "Good" | "Needs Attention" | "Critical Gaps";
  healthScore: number;
  coveredSkills: SkillHealthItem[];
  weakSkills: SkillHealthItem[];
  missingSkills: SkillHealthItem[];
  redundantSkills: SkillHealthItem[];
  availabilityOverlapPercent: number;
  criticalGapDetected: string | null;
}

export interface TeamMemberExplanation {
  profileId: string;
  role: string;
  reason: string;
  skillsFilled: string[];
  evidence: string[];
}

export interface TeamExplanationResult {
  teamSummary: string;
  members: TeamMemberExplanation[];
  complementarityExplanation: string;
  remainingGaps: string[];
}

export interface MissingTeammateRecommendation {
  candidate: StudentProfile;
  assignedRole: string;
  criticalSkill: string;
  gapSummary: string;
  recommendationReason: string;
  candidateEvidence: string[];
  fitScore: number;
  newTeamScore: number;
}

export interface ComposedTeamResult {
  team: CandidateMatch[];
  teamScore: number;
  breakdown: TeamScoreBreakdown;
  teamHealth: TeamHealthReport;
  explanation?: TeamExplanationResult;
  rankedCandidates: CandidateMatch[];
}
