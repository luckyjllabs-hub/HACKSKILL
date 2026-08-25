import { describe, it, expect } from 'vitest';
import { findMissingTeammate } from '@/lib/matching/missing-teammate';
import { scoreCandidate } from '@/lib/matching/candidate-scorer';
import { StudentProfile } from '@/types/student';
import { ProjectAnalysisResult } from '@/types/project';

function createStudent(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return {
    id: 'student-test-001',
    name: 'Test Student',
    avatar: '',
    department: 'Computer Science',
    year: 3,
    bio: 'Test bio',
    experienceLevel: 'Advanced',
    collaborationStyle: 'Balanced',
    preferredTeamSize: 4,
    skills: [
      { name: 'Machine Learning', level: 'Advanced' },
      { name: 'Python', level: 'Expert' },
    ],
    interests: ['Artificial Intelligence'],
    availability: ['Flexible'],
    pastProjects: [
      {
        title: 'Smart Waste Classifier',
        category: 'Sustainability',
        description: 'Built a CV waste classifier',
        skills: ['Computer Vision', 'Python'],
      },
    ],
    preferredRoles: ['ML Engineer'],
    ...overrides,
  };
}

function createProject(overrides: Partial<ProjectAnalysisResult> = {}): ProjectAnalysisResult {
  return {
    projectCategory: 'AI / Sustainability',
    domain: ['Sustainability', 'Smart Cities'],
    requiredSkills: ['Machine Learning', 'Computer Vision', 'Sustainability'],
    preferredSkills: ['Frontend', 'UI/UX'],
    roles: ['ML Engineer', 'CV Lead', 'Sustainability Lead'],
    recommendedTeamSize: 4,
    experienceRequirements: ['Project-level execution experience'],
    availabilityRequirement: 'Flexible',
    ...overrides,
  };
}

describe('findMissingTeammate', () => {
  it('should recommend a candidate who covers the missing skill', () => {
    const project = createProject();

    // Team only has ML — missing CV and Sustainability
    const currentTeam = [
      scoreCandidate(
        createStudent({
          id: 'ml',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
    ];

    const allStudents = [
      createStudent({
        id: 'ml',
        skills: [{ name: 'Machine Learning', level: 'Expert' }],
      }),
      createStudent({
        id: 'cv-candidate',
        name: 'CV Candidate',
        skills: [
          { name: 'Computer Vision', level: 'Expert' },
          { name: 'Deep Learning', level: 'Advanced' },
        ],
        preferredRoles: ['Computer Vision Lead'],
      }),
      createStudent({
        id: 'sus-candidate',
        name: 'Sustainability Expert',
        skills: [{ name: 'Sustainability', level: 'Expert' }],
        interests: ['Sustainability'],
        preferredRoles: ['Sustainability Lead'],
      }),
    ];

    const recommendation = findMissingTeammate(currentTeam, allStudents, project);

    expect(recommendation).not.toBeNull();
    expect(recommendation!.candidate.id).not.toBe('ml');
    expect(recommendation!.criticalSkill).toBeDefined();
    expect(recommendation!.fitScore).toBeGreaterThan(0);
  });

  it('should find the candidate that maximizes team score improvement', () => {
    const project = createProject();

    const currentTeam = [
      scoreCandidate(
        createStudent({
          id: 'ml',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
    ];

    const allStudents = [
      createStudent({ id: 'ml', skills: [{ name: 'Machine Learning', level: 'Expert' }] }),
      createStudent({
        id: 'good-fit',
        name: 'Good Fit',
        skills: [
          { name: 'Computer Vision', level: 'Expert' },
          { name: 'Sustainability', level: 'Advanced' },
        ],
        interests: ['Sustainability'],
      }),
      createStudent({
        id: 'bad-fit',
        name: 'Bad Fit',
        skills: [{ name: 'Frontend', level: 'Beginner' }],
        interests: [],
      }),
    ];

    const recommendation = findMissingTeammate(currentTeam, allStudents, project);

    expect(recommendation).not.toBeNull();
    expect(recommendation!.newTeamScore).toBeGreaterThan(0);
  });

  it('should return null when there are no available candidates', () => {
    const project = createProject();

    const currentTeam = [
      scoreCandidate(
        createStudent({ id: 'only' }),
        project
      ),
    ];

    // Only student in pool is already on the team
    const allStudents = [createStudent({ id: 'only' })];

    const recommendation = findMissingTeammate(currentTeam, allStudents, project);
    expect(recommendation).toBeNull();
  });

  it('should target the specified skill when targetSkill is provided', () => {
    const project = createProject();

    const currentTeam = [
      scoreCandidate(
        createStudent({
          id: 'ml',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
    ];

    const allStudents = [
      createStudent({ id: 'ml', skills: [{ name: 'Machine Learning', level: 'Expert' }] }),
      createStudent({
        id: 'sus',
        name: 'Sustainability Expert',
        skills: [{ name: 'Sustainability', level: 'Expert' }],
        interests: ['Sustainability'],
      }),
    ];

    const recommendation = findMissingTeammate(currentTeam, allStudents, project, 'Sustainability');

    expect(recommendation).not.toBeNull();
    expect(recommendation!.criticalSkill).toBe('Sustainability');
  });

  it('should include evidence strings for the recommended candidate', () => {
    const project = createProject();
    const currentTeam = [
      scoreCandidate(createStudent({ id: 'ml', skills: [{ name: 'Machine Learning', level: 'Expert' }] }), project),
    ];

    const allStudents = [
      createStudent({ id: 'ml' }),
      createStudent({
        id: 'cv-candidate',
        skills: [{ name: 'Computer Vision', level: 'Expert' }],
        pastProjects: [{ title: 'Vision App', category: 'CV', skills: ['Computer Vision'], description: 'A CV app' }],
      }),
    ];

    const recommendation = findMissingTeammate(currentTeam, allStudents, project);

    expect(recommendation).not.toBeNull();
    expect(recommendation!.candidateEvidence.length).toBeGreaterThan(0);
    expect(recommendation!.gapSummary).toBeTruthy();
    expect(recommendation!.recommendationReason).toBeTruthy();
  });
});
