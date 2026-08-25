import { describe, it, expect } from 'vitest';
import { scoreCandidate, rankCandidates } from '@/lib/matching/candidate-scorer';
import { StudentProfile } from '@/types/student';
import { ProjectAnalysisResult } from '@/types/project';

/** Creates a minimal valid StudentProfile for testing */
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
    interests: ['Artificial Intelligence', 'Healthcare'],
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

/** Creates a minimal valid ProjectAnalysisResult for testing */
function createProject(overrides: Partial<ProjectAnalysisResult> = {}): ProjectAnalysisResult {
  return {
    projectCategory: 'AI / Sustainability',
    domain: ['Sustainability', 'Smart Cities'],
    requiredSkills: ['Machine Learning', 'Computer Vision', 'Sustainability'],
    preferredSkills: ['Frontend', 'UI/UX'],
    roles: ['ML Engineer', 'Full Stack Developer', 'UI/UX Designer'],
    recommendedTeamSize: 4,
    experienceRequirements: ['Project-level execution experience'],
    availabilityRequirement: 'Flexible',
    ...overrides,
  };
}

describe('scoreCandidate', () => {
  it('should return an overall score between 0 and 100', () => {
    const student = createStudent();
    const project = createProject();
    const match = scoreCandidate(student, project);

    expect(match.overallScore).toBeGreaterThanOrEqual(0);
    expect(match.overallScore).toBeLessThanOrEqual(100);
  });

  it('should return higher scores for students with more matching required skills', () => {
    const highSkillStudent = createStudent({
      id: 'high',
      skills: [
        { name: 'Machine Learning', level: 'Expert' },
        { name: 'Computer Vision', level: 'Expert' },
        { name: 'Sustainability', level: 'Advanced' },
      ],
    });

    const lowSkillStudent = createStudent({
      id: 'low',
      skills: [{ name: 'Frontend', level: 'Beginner' }],
      interests: [],
    });

    const project = createProject();

    const highMatch = scoreCandidate(highSkillStudent, project);
    const lowMatch = scoreCandidate(lowSkillStudent, project);

    expect(highMatch.overallScore).toBeGreaterThan(lowMatch.overallScore);
  });

  it('should correctly identify matched required skills', () => {
    const student = createStudent({
      skills: [
        { name: 'Machine Learning', level: 'Expert' },
        { name: 'Computer Vision', level: 'Advanced' },
      ],
    });
    const project = createProject();
    const match = scoreCandidate(student, project);

    expect(match.matchedRequiredSkills).toContain('Machine Learning');
  });

  it('should produce a valid score breakdown with all 6 factors', () => {
    const student = createStudent();
    const project = createProject();
    const match = scoreCandidate(student, project);

    expect(match.breakdown).toHaveProperty('skillMatch');
    expect(match.breakdown).toHaveProperty('interestAlignment');
    expect(match.breakdown).toHaveProperty('availability');
    expect(match.breakdown).toHaveProperty('experience');
    expect(match.breakdown).toHaveProperty('pastProjectRelevance');
    expect(match.breakdown).toHaveProperty('collaborationFit');

    // All scores should be in [0, 100]
    Object.values(match.breakdown).forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it('should assign a role from the project roles when student has a matching preferred role', () => {
    const student = createStudent({ preferredRoles: ['ML Engineer'] });
    const project = createProject({ roles: ['ML Engineer', 'Designer'] });
    const match = scoreCandidate(student, project);

    expect(match.assignedRole).toBe('ML Engineer');
  });

  it('should give higher availability score to flexible students', () => {
    const flexStudent = createStudent({ id: 'flex', availability: ['Flexible'] });
    const fixedStudent = createStudent({ id: 'fixed', availability: ['Weekends'] });
    const project = createProject();

    const flexMatch = scoreCandidate(flexStudent, project);
    const fixedMatch = scoreCandidate(fixedStudent, project);

    expect(flexMatch.breakdown.availability).toBeGreaterThan(fixedMatch.breakdown.availability);
  });

  it('should reward higher experience level and year', () => {
    const expertSenior = createStudent({ id: 'senior', experienceLevel: 'Expert', year: 4 });
    const beginnerFreshman = createStudent({ id: 'freshman', experienceLevel: 'Beginner', year: 1 });
    const project = createProject();

    const seniorMatch = scoreCandidate(expertSenior, project);
    const freshmanMatch = scoreCandidate(beginnerFreshman, project);

    expect(seniorMatch.breakdown.experience).toBeGreaterThan(freshmanMatch.breakdown.experience);
  });
});

describe('rankCandidates', () => {
  it('should return candidates sorted by overall score (descending)', () => {
    const students = [
      createStudent({
        id: 'weak',
        skills: [{ name: 'Frontend', level: 'Beginner' }],
        interests: [],
      }),
      createStudent({
        id: 'strong',
        skills: [
          { name: 'Machine Learning', level: 'Expert' },
          { name: 'Computer Vision', level: 'Expert' },
          { name: 'Sustainability', level: 'Advanced' },
        ],
      }),
    ];

    const project = createProject();
    const ranked = rankCandidates(students, project);

    expect(ranked[0].student.id).toBe('strong');
    expect(ranked[0].overallScore).toBeGreaterThanOrEqual(ranked[1].overallScore);
  });

  it('should handle an empty student pool', () => {
    const project = createProject();
    const ranked = rankCandidates([], project);
    expect(ranked).toHaveLength(0);
  });

  it('should rank all students in the pool', () => {
    const students = Array.from({ length: 10 }, (_, i) =>
      createStudent({
        id: `student-${i}`,
        skills: [{ name: 'Python', level: i % 2 === 0 ? 'Expert' : 'Beginner' }],
      })
    );

    const project = createProject();
    const ranked = rankCandidates(students, project);

    expect(ranked).toHaveLength(10);
  });
});
