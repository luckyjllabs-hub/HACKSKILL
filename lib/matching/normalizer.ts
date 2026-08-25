import { CANONICAL_SKILLS } from "@/data/seed/skills";

export interface NormalizedSkillResult {
  original: string;
  canonical: string | null;
  confidence: number;
}

/**
 * Normalizes an arbitrary skill string to canonical skill vocabulary
 */
export function normalizeSkill(skillInput: string): NormalizedSkillResult {
  const cleanInput = skillInput.trim().toLowerCase();
  if (!cleanInput) {
    return { original: skillInput, canonical: null, confidence: 0 };
  }

  // 1. Exact match with canonical name
  const exactCanonical = CANONICAL_SKILLS.find(
    (s) => s.name.toLowerCase() === cleanInput
  );
  if (exactCanonical) {
    return { original: skillInput, canonical: exactCanonical.name, confidence: 1.0 };
  }

  // 2. Exact match with an alias
  for (const skill of CANONICAL_SKILLS) {
    if (skill.aliases.some((alias) => alias.toLowerCase() === cleanInput)) {
      return { original: skillInput, canonical: skill.name, confidence: 0.95 };
    }
  }

  // 3. Substring / inclusion match with alias or canonical name
  for (const skill of CANONICAL_SKILLS) {
    if (
      cleanInput.includes(skill.name.toLowerCase()) ||
      skill.name.toLowerCase().includes(cleanInput)
    ) {
      return { original: skillInput, canonical: skill.name, confidence: 0.85 };
    }

    for (const alias of skill.aliases) {
      if (cleanInput.includes(alias) || alias.includes(cleanInput)) {
        return { original: skillInput, canonical: skill.name, confidence: 0.80 };
      }
    }
  }

  // 4. Fallback: Check for domain/tech keywords
  if (cleanInput.includes("vision") || cleanInput.includes("image") || cleanInput.includes("yolo")) {
    return { original: skillInput, canonical: "Computer Vision", confidence: 0.85 };
  }
  if (cleanInput.includes("learning") || cleanInput.includes("model") || cleanInput.includes("ai")) {
    return { original: skillInput, canonical: "Machine Learning", confidence: 0.80 };
  }
  if (cleanInput.includes("web") || cleanInput.includes("front") || cleanInput.includes("css")) {
    return { original: skillInput, canonical: "Frontend", confidence: 0.80 };
  }
  if (cleanInput.includes("api") || cleanInput.includes("server") || cleanInput.includes("back")) {
    return { original: skillInput, canonical: "Backend", confidence: 0.80 };
  }
  if (cleanInput.includes("design") || cleanInput.includes("ux") || cleanInput.includes("ui")) {
    return { original: skillInput, canonical: "UI/UX", confidence: 0.85 };
  }
  if (cleanInput.includes("sustain") || cleanInput.includes("waste") || cleanInput.includes("green")) {
    return { original: skillInput, canonical: "Sustainability", confidence: 0.85 };
  }
  if (cleanInput.includes("gis") || cleanInput.includes("map") || cleanInput.includes("spatial")) {
    return { original: skillInput, canonical: "Geospatial Data", confidence: 0.85 };
  }
  if (cleanInput.includes("app") || cleanInput.includes("android") || cleanInput.includes("ios")) {
    return { original: skillInput, canonical: "Mobile", confidence: 0.85 };
  }

  // Unresolved skill (confidence too low)
  return { original: skillInput, canonical: null, confidence: 0.2 };
}

/**
 * Normalizes an array of skills and returns only resolved canonical names + normalized details
 */
export function normalizeSkillList(skills: string[]): {
  canonicalList: string[];
  details: NormalizedSkillResult[];
} {
  const details = skills.map(normalizeSkill);
  const canonicalSet = new Set<string>();

  for (const item of details) {
    if (item.canonical && item.confidence >= 0.7) {
      canonicalSet.add(item.canonical);
    }
  }

  return {
    canonicalList: Array.from(canonicalSet),
    details,
  };
}
