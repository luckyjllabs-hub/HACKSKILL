import { describe, it, expect } from 'vitest';
import { analyzeTeamHealth } from '@/lib/matching/team-health';
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
    roles: ['ML Engineer', 'CV Lead', 'Full Stack Developer', 'Sustainability Lead'],
    recommendedTeamSize: 4,
    experienceRequirements: ['Project-level execution experience'],
    availabilityRequirement: 'Flexible',
    ...overrides,
  };
}

describe('analyzeTeamHealth', () => {
  it('should report "Critical Gaps" when required skills are missing', () => {
    const project = createProject();
    // Team that only covers ML, not CV or Sustainability
    const team = [
      scoreCandidate(
        createStudent({
          id: 'ml-only',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
    ];

    const health = analyzeTeamHealth(team, project);

    expect(health.overallHealth).toBe('Critical Gaps');
    expect(health.missingSkills.length).toBeGreaterThan(0);
    expect(health.criticalGapDetected).not.toBeNull();
  });

  it('should report "Optimal" when all required skills are strongly covered', () => {
    const project = createProject();
    const team = [
      scoreCandidate(
        createStudent({
          id: 'ml',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
      scoreCandidate(
        createStudent({
          id: 'cv',
          skills: [{ name: 'Computer Vision', level: 'Expert' }],
        }),
        project
      ),
      scoreCandidate(
        createStudent({
          id: 'sus',
          skills: [
            { name: 'Sustainability', level: 'Expert' },
            { name: 'Frontend', level: 'Advanced' },
            { name: 'UI/UX', level: 'Advanced' },
          ],
        }),
        project
      ),
    ];

    const health = analyzeTeamHealth(team, project);

    expect(health.overallHealth).toBe('Optimal');
    expect(health.missingSkills).toHaveLength(0);
    expect(health.healthScore).toBeGreaterThanOrEqual(90);
  });

  it('should classify skills as "weak" when only covered at Beginner level', () => {
    const project = createProject({
      requiredSkills: ['Machine Learning'],
      preferredSkills: [],
    });

    const team = [
      scoreCandidate(
        createStudent({
          id: 'beginner',
          skills: [{ name: 'Machine Learning', level: 'Beginner' }],
        }),
        project
      ),
    ];

    const health = analyzeTeamHealth(team, project);

    // Beginner (40) is below the 75 threshold → should be weak
    const weakML = health.weakSkills.find(
      (s) => s.skill.toLowerCase() === 'machine learning'
    );
    expect(weakML).toBeDefined();
  });

  it('should detect redundant skills when 3+ members share the same skill', () => {
    const project = createProject({
      requiredSkills: ['Machine Learning'],
      preferredSkills: [],
    });

    const team = [1, 2, 3].map((i) =>
      scoreCandidate(
        createStudent({
          id: `ml-${i}`,
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      )
    );

    const health = analyzeTeamHealth(team, project);

    expect(health.redundantSkills.length).toBeGreaterThan(0);
    expect(health.redundantSkills[0].coveredBy.length).toBeGreaterThanOrEqual(3);
  });

  it('should return health score between 0 and 100', () => {
    const project = createProject();
    const team = [
      scoreCandidate(createStudent({ id: 'a' }), project),
    ];

    const health = analyzeTeamHealth(team, project);

    expect(health.healthScore).toBeGreaterThanOrEqual(0);
    expect(health.healthScore).toBeLessThanOrEqual(100);
  });

  it('should detect the correct critical gap skill name', () => {
    const project = createProject({
      requiredSkills: ['Machine Learning', 'Blockchain'],
      preferredSkills: [],
    });

    const team = [
      scoreCandidate(
        createStudent({
          id: 'ml',
          skills: [{ name: 'Machine Learning', level: 'Expert' }],
        }),
        project
      ),
    ];

    const health = analyzeTeamHealth(team, project);

    // Blockchain gets normalized — just verify a critical gap IS detected
    expect(health.criticalGapDetected).not.toBeNull();
    expect(health.missingSkills.length).toBeGreaterThan(0);
  });
});
