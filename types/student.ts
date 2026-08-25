export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type AvailabilityOption = "Weekdays" | "Weekends" | "Evenings" | "Flexible";

export interface StudentSkill {
  name: string;
  level: SkillLevel;
  category?: string;
}

export interface PastProject {
  title: string;
  category: string;
  description?: string;
  skills: string[];
  role?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  department: string;
  year: number;
  bio: string;
  experienceLevel: ExperienceLevel;
  collaborationStyle: "Agile / Fast-Paced" | "Structured & Methodical" | "Creative / Exploratory" | "Balanced";
  preferredTeamSize: number;
  skills: StudentSkill[];
  interests: string[];
  availability: AvailabilityOption[];
  pastProjects: PastProject[];
  preferredRoles: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}
