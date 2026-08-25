import { describe, it, expect } from 'vitest';
import { normalizeSkill, normalizeSkillList } from '@/lib/matching/normalizer';

describe('normalizeSkill', () => {
  describe('exact canonical match', () => {
    it('should match "Machine Learning" exactly', () => {
      const result = normalizeSkill('Machine Learning');
      expect(result.canonical).toBe('Machine Learning');
      expect(result.confidence).toBe(1.0);
    });

    it('should match "Computer Vision" exactly', () => {
      const result = normalizeSkill('Computer Vision');
      expect(result.canonical).toBe('Computer Vision');
      expect(result.confidence).toBe(1.0);
    });

    it('should match case-insensitively for canonical names', () => {
      const result = normalizeSkill('machine learning');
      expect(result.canonical).toBe('Machine Learning');
      expect(result.confidence).toBe(1.0);
    });
  });

  describe('alias matching', () => {
    it('should resolve "ml" alias to "Machine Learning"', () => {
      const result = normalizeSkill('ml');
      expect(result.canonical).toBe('Machine Learning');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should resolve "cv" alias to "Computer Vision"', () => {
      const result = normalizeSkill('cv');
      expect(result.canonical).toBe('Computer Vision');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should resolve "nlp" alias to "Natural Language Processing"', () => {
      const result = normalizeSkill('nlp');
      expect(result.canonical).toBe('Natural Language Processing');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should resolve "pytorch" to "Deep Learning"', () => {
      const result = normalizeSkill('pytorch');
      expect(result.canonical).toBe('Deep Learning');
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });

    it('should resolve "react" to a frontend-related canonical skill', () => {
      const result = normalizeSkill('react');
      expect(result.canonical).not.toBeNull();
      expect(result.confidence).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('keyword fallback matching', () => {
    it('should resolve "image processing" to "Computer Vision"', () => {
      const result = normalizeSkill('image processing');
      expect(result.canonical).toBe('Computer Vision');
    });

    it('should resolve "web development" to "Frontend"', () => {
      const result = normalizeSkill('web development');
      expect(result.canonical).toBe('Frontend');
    });

    it('should resolve "server-side coding" to "Backend"', () => {
      const result = normalizeSkill('server-side coding');
      expect(result.canonical).toBe('Backend');
    });

    it('should resolve "ux design" to "UI/UX"', () => {
      const result = normalizeSkill('ux design');
      expect(result.canonical).toBe('UI/UX');
    });

    it('should resolve "waste reduction" to "Sustainability"', () => {
      const result = normalizeSkill('waste reduction');
      expect(result.canonical).toBe('Sustainability');
    });

    it('should resolve "geospatial mapping" to "Geospatial Data"', () => {
      const result = normalizeSkill('gis mapping');
      expect(result.canonical).toBe('Geospatial Data');
    });
  });

  describe('edge cases', () => {
    it('should return null canonical and low confidence for empty input', () => {
      const result = normalizeSkill('');
      expect(result.canonical).toBeNull();
      expect(result.confidence).toBe(0);
    });

    it('should return null canonical for completely unknown skills', () => {
      const result = normalizeSkill('quantum teleportation');
      expect(result.canonical).toBeNull();
      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should handle whitespace-padded input', () => {
      const result = normalizeSkill('  Machine Learning  ');
      expect(result.canonical).toBe('Machine Learning');
      expect(result.confidence).toBe(1.0);
    });

    it('should preserve the original input string in the result', () => {
      const result = normalizeSkill('yolo');
      expect(result.original).toBe('yolo');
    });
  });
});

describe('normalizeSkillList', () => {
  it('should return deduplicated canonical skills', () => {
    const { canonicalList } = normalizeSkillList(['ml', 'Machine Learning', 'machine learning']);
    expect(canonicalList).toHaveLength(1);
    expect(canonicalList[0]).toBe('Machine Learning');
  });

  it('should filter out low-confidence matches', () => {
    const { canonicalList, details } = normalizeSkillList(['Machine Learning', 'quantum teleportation']);
    expect(canonicalList).toContain('Machine Learning');
    expect(canonicalList).not.toContain('quantum teleportation');
    expect(details).toHaveLength(2);
  });

  it('should handle an empty input array', () => {
    const { canonicalList, details } = normalizeSkillList([]);
    expect(canonicalList).toHaveLength(0);
    expect(details).toHaveLength(0);
  });

  it('should normalize a mixed list of aliases and canonical names', () => {
    const { canonicalList } = normalizeSkillList(['cv', 'nlp', 'React', 'Python']);
    expect(canonicalList.length).toBeGreaterThanOrEqual(3);
    expect(canonicalList).toContain('Computer Vision');
    expect(canonicalList).toContain('Natural Language Processing');
  });
});
