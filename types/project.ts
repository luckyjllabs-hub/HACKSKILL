export interface ProjectAnalysisInput {
  description: string;
  desiredTeamSize: number;
  category?: string;
  deadline?: string;
  availability?: string;
}

export interface ProjectAnalysisResult {
  projectCategory: string;
  domain: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  roles: string[];
  recommendedTeamSize: number;
  experienceRequirements: string[];
  availabilityRequirement?: string;
  normalizedSkills?: {
    original: string;
    canonical: string | null;
    confidence: number;
  }[];
  isFallback?: boolean;
}

export interface DemoPreset {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  desiredTeamSize: number;
  domains: string[];
  expectedRoles: string[];
  demoNotes: string;
}
