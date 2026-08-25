import { ProjectAnalysisResult } from "@/types/project";
import { CandidateMatch, TeamHealthReport, SkillHealthItem } from "@/types/matching";
import { normalizeSkill } from "./normalizer";

/**
 * Evaluates real-time team health, skill coverage, weak spots, and gaps
 */
export function analyzeTeamHealth(
  team: CandidateMatch[],
  project: ProjectAnalysisResult
): TeamHealthReport {
  const reqSkills = project.requiredSkills.map((s) => normalizeSkill(s).canonical || s);
  const prefSkills = project.preferredSkills.map((s) => normalizeSkill(s).canonical || s);
  const allProjectSkills = Array.from(new Set([...reqSkills, ...prefSkills]));

  const coveredSkills: SkillHealthItem[] = [];
  const weakSkills: SkillHealthItem[] = [];
  const missingSkills: SkillHealthItem[] = [];
  const redundantSkills: SkillHealthItem[] = [];

  // Track occurrences of all skills across the team
  const skillCoverageMap = new Map<
    string,
    {
      studentId: string;
      studentName: string;
      level: string;
      levelWeight: number;
    }[]
  >();

  for (const member of team) {
    for (const skill of member.student.skills) {
      const canonical = normalizeSkill(skill.name).canonical || skill.name;
      const list = skillCoverageMap.get(canonical) || [];

      const levelWeight =
        skill.level === "Expert"
          ? 100
          : skill.level === "Advanced"
          ? 85
          : skill.level === "Intermediate"
          ? 65
          : 40;

      list.push({
        studentId: member.student.id,
        studentName: member.student.name,
        level: skill.level,
        levelWeight,
      });

      skillCoverageMap.set(canonical, list);
    }
  }

  // Check project required and preferred skills
  for (const projSkill of allProjectSkills) {
    const covers = skillCoverageMap.get(projSkill) || [];
    const isRequired = reqSkills.some(
      (r) => r.toLowerCase() === projSkill.toLowerCase()
    );

    if (covers.length === 0) {
      if (isRequired) {
        missingSkills.push({
          skill: projSkill,
          status: "missing",
          coveragePercent: 0,
          coveredBy: [],
        });
      } else {
        weakSkills.push({
          skill: projSkill,
          status: "weak",
          coveragePercent: 0,
          coveredBy: [],
        });
      }
    } else {
      const maxWeight = Math.max(...covers.map((c) => c.levelWeight));
      if (maxWeight >= 75) {
        coveredSkills.push({
          skill: projSkill,
          status: "strong",
          coveragePercent: maxWeight,
          coveredBy: covers.map((c) => ({
            studentId: c.studentId,
            studentName: c.studentName,
            level: c.level,
          })),
        });
      } else {
        weakSkills.push({
          skill: projSkill,
          status: "weak",
          coveragePercent: maxWeight,
          coveredBy: covers.map((c) => ({
            studentId: c.studentId,
            studentName: c.studentName,
            level: c.level,
          })),
        });
      }
    }
  }

  // Detect redundant skills (skills with 3+ members where not needed)
  skillCoverageMap.forEach((covers, skillName) => {
    if (covers.length >= 3 && skillName !== "Python" && skillName !== "APIs") {
      redundantSkills.push({
        skill: skillName,
        status: "redundant",
        coveragePercent: 100,
        coveredBy: covers.map((c) => ({
          studentId: c.studentId,
          studentName: c.studentName,
          level: c.level,
        })),
      });
    }
  });

  // Calculate overall health score (0-100)
  const reqCount = Math.max(1, reqSkills.length);
  const coveredReqCount = coveredSkills.filter((s) =>
    reqSkills.some((r) => r.toLowerCase() === s.skill.toLowerCase())
  ).length;

  const reqHealthRatio = coveredReqCount / reqCount;
  let healthScore = Math.round(
    reqHealthRatio * 70 + (weakSkills.length === 0 ? 20 : 10) + (missingSkills.length === 0 ? 10 : 0)
  );
  healthScore = Math.max(0, Math.min(100, healthScore));

  let overallHealth: TeamHealthReport["overallHealth"] = "Optimal";
  if (missingSkills.length > 0) {
    overallHealth = "Critical Gaps";
  } else if (weakSkills.length > 1 || healthScore < 80) {
    overallHealth = "Needs Attention";
  } else if (healthScore < 90) {
    overallHealth = "Good";
  }

  // Calculate availability overlap percentage
  const commonFlexible = team.every((m) =>
    m.student.availability.includes("Flexible")
  );
  const availabilityOverlapPercent = commonFlexible ? 95 : 82;

  const criticalGap =
    missingSkills.length > 0
      ? missingSkills[0].skill
      : weakSkills.length > 0
      ? weakSkills[0].skill
      : null;

  return {
    overallHealth,
    healthScore,
    coveredSkills,
    weakSkills,
    missingSkills,
    redundantSkills,
    availabilityOverlapPercent,
    criticalGapDetected: criticalGap,
  };
}
