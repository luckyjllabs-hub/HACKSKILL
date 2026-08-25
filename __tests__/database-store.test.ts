import { describe, it, expect } from "vitest";
import { getAllStudents, saveProjectRecord, getAllProjects } from "@/lib/db/store";

describe("Database & Persistence Layer", () => {
  it("should retrieve all seeded students correctly", async () => {
    const students = await getAllStudents();
    expect(students.length).toBeGreaterThanOrEqual(35);
    expect(students[0]).toHaveProperty("id");
    expect(students[0]).toHaveProperty("name");
    expect(students[0]).toHaveProperty("skills");
    expect(students[0]).toHaveProperty("availability");
  });

  it("should have valid skill proficiencies for every seeded student", async () => {
    const students = await getAllStudents();
    const validLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

    for (const student of students.slice(0, 50)) {
      expect(student.skills.length).toBeGreaterThan(0);
      for (const skill of student.skills) {
        expect(validLevels).toContain(skill.level);
      }
    }
  });

  it("should persist and retrieve project records without errors", async () => {
    const mockRecord = {
      projectId: "test-proj-001",
      timestamp: new Date().toISOString(),
      project: {
        projectCategory: "AI / Sustainability",
        domain: ["Sustainability"],
        requiredSkills: ["Machine Learning"],
        preferredSkills: [],
        roles: ["ML Engineer"],
        recommendedTeamSize: 4,
        experienceRequirements: [],
        availabilityRequirement: "Flexible",
      },
      teamScore: 92,
    };

    const saved = await saveProjectRecord(mockRecord);
    expect(saved).toHaveProperty("id");
    expect(typeof saved.savedToFirebase).toBe("boolean");

    const records = await getAllProjects();
    expect(Array.isArray(records)).toBe(true);
  });
});
