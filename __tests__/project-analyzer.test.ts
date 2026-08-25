import { describe, it, expect } from 'vitest';
import { analyzeProjectFallback } from '@/lib/ai/project-analyzer';
import { ProjectAnalysisInput } from '@/types/project';

describe('analyzeProjectFallback', () => {
  it('should identify sustainability project category from description keywords', () => {
    const input: ProjectAnalysisInput = {
      description: 'Build a campus waste segregation system using computer vision to improve recycling rates.',
      desiredTeamSize: 4,
      availability: 'Flexible',
    };

    const result = analyzeProjectFallback(input);

    expect(result.projectCategory).toContain('Sustainability');
    expect(result.requiredSkills).toContain('Computer Vision');
    expect(result.requiredSkills).toContain('Machine Learning');
    expect(result.isFallback).toBe(true);
  });

  it('should identify pothole/traffic project from description', () => {
    const input: ProjectAnalysisInput = {
      description: 'Detect potholes using road camera footage and report to municipal authorities.',
      desiredTeamSize: 4,
    };

    const result = analyzeProjectFallback(input);

    expect(result.projectCategory).toContain('Vision');
    expect(result.domain).toContain('Smart Cities');
  });

  it('should identify agritech project from description', () => {
    const input: ProjectAnalysisInput = {
      description: 'Use drones to monitor crop health and detect disease early in farm fields.',
      desiredTeamSize: 3,
    };

    const result = analyzeProjectFallback(input);

    expect(result.projectCategory).toContain('Agriculture');
    expect(result.requiredSkills).toContain('IoT');
  });

  it('should identify healthcare/NLP project from description', () => {
    const input: ProjectAnalysisInput = {
      description: 'Create a mental health chatbot that helps students manage stress and anxiety.',
      desiredTeamSize: 4,
    };

    const result = analyzeProjectFallback(input);

    expect(result.projectCategory).toContain('Healthcare');
    expect(result.requiredSkills).toContain('Natural Language Processing');
  });

  it('should identify fintech project from description', () => {
    const input: ProjectAnalysisInput = {
      description: 'Build a micro-lending platform for peer-to-peer money transfers with fraud detection.',
      desiredTeamSize: 4,
    };

    const result = analyzeProjectFallback(input);

    expect(result.projectCategory).toContain('FinTech');
    expect(result.requiredSkills).toContain('FinTech');
  });

  it('should fall back to general extraction for unknown project descriptions', () => {
    const input: ProjectAnalysisInput = {
      description: 'Build a collaborative whiteboard tool for real-time team brainstorming.',
      desiredTeamSize: 3,
    };

    const result = analyzeProjectFallback(input);

    expect(result.requiredSkills.length).toBeGreaterThan(0);
    expect(result.roles.length).toBeGreaterThan(0);
    expect(result.isFallback).toBe(true);
  });

  it('should respect desiredTeamSize from input', () => {
    const input: ProjectAnalysisInput = {
      description: 'A sustainability project for circular economy.',
      desiredTeamSize: 6,
    };

    const result = analyzeProjectFallback(input);
    expect(result.recommendedTeamSize).toBe(6);
  });

  it('should respect availability from input', () => {
    const input: ProjectAnalysisInput = {
      description: 'A sustainability project.',
      desiredTeamSize: 4,
      availability: 'Weekends',
    };

    const result = analyzeProjectFallback(input);
    expect(result.availabilityRequirement).toBe('Weekends');
  });

  it('should always return non-empty roles', () => {
    const input: ProjectAnalysisInput = {
      description: 'An abstract project idea with no specific keywords.',
      desiredTeamSize: 4,
    };

    const result = analyzeProjectFallback(input);
    expect(result.roles.length).toBeGreaterThan(0);
  });

  it('should return normalizedSkills details when available', () => {
    const input: ProjectAnalysisInput = {
      description: 'Build a sustainable waste management application.',
      desiredTeamSize: 4,
    };

    const result = analyzeProjectFallback(input);
    expect(result.normalizedSkills).toBeDefined();
    expect(result.normalizedSkills!.length).toBeGreaterThan(0);
  });
});
