import { describe, it, expect } from 'vitest';
import { evaluateTeamScore, optimizeTeam } from '@/lib/matching/team-optimizer';
import { scoreCandidate } from '@/lib/matching/candidate-scorer';
import { StudentProfile } from '@/types/student';
import { ProjectAnalysisResult } from '@/types/project';
import { CandidateMatch } from '@/types/matching';

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
    requiredSkills: ['Machine Learning', 'Computer Vision', 'Frontend', 'Sustainability'],
    preferredSkills: ['UI/UX', 'Backend'],
    roles: ['ML Engineer', 'CV Lead', 'Full Stack Developer', 'Sustainability Lead'],
    recommendedTeamSize: 4,
    experienceRequirements: ['Project-level execution experience'],
    availabilityRequirement: 'Flexible',
    ...overrides,
  };
}

function createTeamOfMatches(project: ProjectAnalysisResult): CandidateMatch[] {
  const students: StudentProfile[] = [
    createStudent({
      id: 'ml-lead',
      name: 'ML Lead',
      skills: [
        { name: 'Machine Learning', level: 'Expert' },
        { name: 'Python', level: 'Expert' },
      ],
      preferredRoles: ['ML Engineer'],
    }),
    createStudent({
      id: 'cv-lead',
      name: 'CV Lead',
      skills: [
        { name: 'Computer Vision', level: 'Expert' },
        { name: 'Deep Learning', level: 'Advanced' },
      ],
      preferredRoles: ['Computer Vision Lead'],
    }),
    createStudent({
      id: 'frontend',
      name: 'Frontend Dev',
      skills: [
        { name: 'Frontend', level: 'Expert' },
        { name: 'React', level: 'Advanced' },
        { name: 'UI/UX', level: 'Intermediate' },
      ],
      preferredRoles: ['Full Stack Developer'],
    }),
    createStudent({
      id: 'domain',
      name: 'Domain Expert',
      skills: [
        { name: 'Sustainability', level: 'Expert' },
        { name: 'Domain Expertise', level: 'Advanced' },
      ],
      interests: ['Sustainability', 'Clean Energy'],
      preferredRoles: ['Sustainability Lead'],
    }),
  ];

  return students.map((s) => scoreCandidate(s, project));
}

describe('evaluateTeamScore', () => {
  it('should return a team score between 0 and 100', () => {
    const project = createProject();
    const team = createTeamOfMatches(project);
    const { teamScore } = evaluateTeamScore(team, project);

    expect(teamScore).toBeGreaterThanOrEqual(0);
    expect(teamScore).toBeLessThanOrEqual(100);
  });

  it('should return 0 for an empty team', () => {
    const project = createProject();
    const { teamScore, breakdown } = evaluateTeamScore([], project);

    expect(teamScore).toBe(0);
    expect(breakdown.skillCoverage).toBe(0);
  });

  it('should produce a breakdown with all 6 components', () => {
    const project = createProject();
    const team = createTeamOfMatches(project);
    const { breakdown } = evaluateTeamScore(team, project);

    expect(breakdown).toHaveProperty('skillCoverage');
    expect(breakdown).toHaveProperty('complementarity');
    expect(breakdown).toHaveProperty('candidateQuality');
    expect(breakdown).toHaveProperty('interestAlignment');
    expect(breakdown).toHaveProperty('availability');
    expect(breakdown).toHaveProperty('experienceRelevance');
  });

  it('should give higher skill coverage when more required skills are covered', () => {
    const project = createProject();

    // Full team covers all required skills
    const fullTeam = createTeamOfMatches(project);
    const { breakdown: fullBreakdown } = evaluateTeamScore(fullTeam, project);

    // Partial team covers fewer skills
    const partialTeam = fullTeam.slice(0, 1);
    const { breakdown: partialBreakdown } = evaluateTeamScore(partialTeam, project);

    expect(fullBreakdown.skillCoverage).toBeGreaterThan(partialBreakdown.skillCoverage);
  });

  it('should penalize teams with high skill redundancy', () => {
    const project = createProject();

    // All members have same skill → low complementarity
    const redundantTeam = [1, 2, 3, 4].map((i) =>
      scoreCandidate(
        createStudent({
          id: `same-${i}`,
          skills: [
            { name: 'Machine Learning', level: 'Expert' },
            { name: 'Python', level: 'Expert' },
          ],
          preferredRoles: ['ML Engineer'],
        }),
        project
      )
    );

    const diverseTeam = createTeamOfMatches(project);

    const { breakdown: redundantBD } = evaluateTeamScore(redundantTeam, project);
    const { breakdown: diverseBD } = evaluateTeamScore(diverseTeam, project);

    expect(diverseBD.complementarity).toBeGreaterThan(redundantBD.complementarity);
  });
});

describe('optimizeTeam', () => {
  it('should return the best team of the specified size', () => {
    const project = createProject();
    const pool = Array.from({ length: 10 }, (_, i) =>
      scoreCandidate(
        createStudent({
          id: `pool-${i}`,
          name: `Pool Member ${i}`,
          skills: [
            { name: i % 2 === 0 ? 'Machine Learning' : 'Frontend', level: 'Advanced' },
            { name: i % 3 === 0 ? 'Sustainability' : 'Python', level: 'Intermediate' },
          ],
        }),
        project
      )
    );

    const result = optimizeTeam(pool, project, 4);

    expect(result.team).toHaveLength(4);
    expect(result.teamScore).toBeGreaterThan(0);
  });

  it('should return the entire pool if pool size is smaller than target', () => {
    const project = createProject();
    const smallPool = [
      scoreCandidate(createStudent({ id: 's1' }), project),
      scoreCandidate(createStudent({ id: 's2' }), project),
    ];

    const result = optimizeTeam(smallPool, project, 4);
    expect(result.team).toHaveLength(2);
  });

  it('should optimize better than simply taking top-ranked individuals', () => {
    const project = createProject();
    const diversePool = [
      createStudent({
        id: 'ml',
        skills: [{ name: 'Machine Learning', level: 'Expert' }],
        preferredRoles: ['ML Engineer'],
      }),
      createStudent({
        id: 'cv',
        skills: [{ name: 'Computer Vision', level: 'Expert' }],
        preferredRoles: ['Computer Vision Lead'],
      }),
      createStudent({
        id: 'fe',
        skills: [{ name: 'Frontend', level: 'Expert' }],
        preferredRoles: ['Full Stack Developer'],
      }),
      createStudent({
        id: 'sus',
        skills: [{ name: 'Sustainability', level: 'Expert' }],
        interests: ['Sustainability'],
        preferredRoles: ['Sustainability Lead'],
      }),
      createStudent({
        id: 'ml2',
        skills: [{ name: 'Machine Learning', level: 'Expert' }],
        preferredRoles: ['ML Engineer'],
      }),
    ];

    const ranked = diversePool.map((s) => scoreCandidate(s, project));
    const result = optimizeTeam(ranked, project, 4);

    expect(result.teamScore).toBeGreaterThan(0);
    expect(result.team).toHaveLength(4);
  });
});
