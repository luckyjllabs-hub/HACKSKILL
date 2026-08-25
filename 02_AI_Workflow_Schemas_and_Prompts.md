# ProjectMatch AI — AI Workflow, Schemas and Prompt Contracts

## 1. Project Analysis

### User input example

```text
We are building an AI-powered system that detects potholes from
smartphone cameras and maps them for municipal authorities.
We have one Python developer and need a team of four.
```

### Required structured output

```json
{
  "projectCategory": "AI / Computer Vision",
  "domain": ["Smart Cities", "Transportation"],
  "requiredSkills": [
    "Computer Vision",
    "Machine Learning",
    "Python",
    "Mobile"
  ],
  "preferredSkills": [
    "Backend",
    "Geospatial Data",
    "UI/UX"
  ],
  "roles": [
    "ML Engineer",
    "Mobile Developer",
    "Backend Developer"
  ],
  "recommendedTeamSize": 4,
  "experienceRequirements": [
    "Computer vision project experience",
    "Mobile development experience"
  ],
  "availabilityRequirement": "Flexible"
}
```

## 2. Zod Contract

Use a strict schema.

```ts
import { z } from "zod";

export const projectAnalysisSchema = z.object({
  projectCategory: z.string(),
  domain: z.array(z.string()).min(1).max(5),
  requiredSkills: z.array(z.string()).min(1).max(12),
  preferredSkills: z.array(z.string()).max(12),
  roles: z.array(z.string()).min(1).max(8),
  recommendedTeamSize: z.number().int().min(2).max(8),
  experienceRequirements: z.array(z.string()).max(8),
  availabilityRequirement: z.string().optional(),
});
```

Never render unvalidated AI output.

## 3. Project Analyzer Prompt

Use a system instruction with this behavior:

```text
You are ProjectMatch's project-analysis engine.

Your job is to convert a student's natural-language project idea
into structured team requirements.

Rules:
1. Understand the actual project objective.
2. Identify concrete technical and non-technical capabilities required.
3. Separate required skills from preferred skills.
4. Suggest realistic project roles.
5. Infer domains only when supported by the project description.
6. Do not invent facts about students.
7. Do not recommend specific people.
8. Use concise canonical-style skill names.
9. Return only the requested JSON structure.
10. Never generate numerical candidate or team match scores.
11. If information is uncertain, use a conservative interpretation.
```

Then append the user project description and constraints.

## 4. Skill Normalization

Maintain a canonical vocabulary.

Example:

```text
ML
machine learning
ML models
machine-learning
    ->
Machine Learning

image recognition
object detection
image classification
computer vision
    ->
Computer Vision

web UI
frontend development
React
web frontend
    ->
Frontend
```

The model may identify semantic equivalents, but the application must map them to known canonical skills.

Unknown skills should not silently become database skills.

Use:

```ts
type NormalizedSkill = {
  original: string;
  canonical: string | null;
  confidence: number;
};
```

If confidence is too low, keep the skill as an unresolved requirement and allow the deterministic engine to treat it as uncovered.

## 5. Team Explanation Schema

```ts
export const teamExplanationSchema = z.object({
  teamSummary: z.string(),
  members: z.array(
    z.object({
      profileId: z.string(),
      role: z.string(),
      reason: z.string(),
      skillsFilled: z.array(z.string()),
      evidence: z.array(z.string())
    })
  ),
  complementarityExplanation: z.string(),
  remainingGaps: z.array(z.string())
});
```

### Team explanation prompt

```text
You are ProjectMatch's team-explanation engine.

Explain why the already-selected team is appropriate.

Important:
- The team was selected by deterministic application logic.
- Do not change the team.
- Do not calculate or invent match percentages.
- Do not invent skills, projects, achievements, availability,
  or experience.
- Every explanation must be grounded in supplied profile data.
- Explain complementarity, not popularity.
- Mention remaining skill gaps honestly.
- Return only the requested JSON.
```

Provide Gemini with:

```text
PROJECT REQUIREMENTS
CURRENT TEAM
CANDIDATE SCORES
SKILL COVERAGE
TEAM SCORE COMPONENTS
REMAINING GAPS
```

## 6. Gap Explanation

```ts
export const gapExplanationSchema = z.object({
  gapSummary: z.string(),
  criticalSkill: z.string(),
  recommendationReason: z.string(),
  candidateEvidence: z.array(z.string())
});
```

Prompt rules:

```text
The application has identified a missing skill.

Explain:
1. Why the skill matters to this project.
2. Why the recommended candidate fills it.
3. Which actual profile facts support the recommendation.

Do not invent facts.
Do not change the deterministic candidate ranking.
Do not create a numerical score.
```

## 7. Hallucination Prevention

Every AI prompt should explicitly state:

```text
Use only the data supplied in the request.
Do not invent profile facts.
Do not invent project history.
Do not invent availability.
Do not invent achievements.
Do not invent numerical scores.
```

## 8. Error Handling

If Gemini returns invalid JSON:

```text
Gemini
  ↓
Parse
  ↓
Zod validation
  ↓
Invalid
  ↓
Fallback
```

Never let invalid AI output crash the results page.

## 9. Demo-Friendly Analysis States

The UI can show:

```text
Understanding your project
✓ Identifying required capabilities
✓ Detecting skill gaps
✓ Evaluating available students
✓ Building complementary team
✓ Preparing team explanation
```

These are UI states, not leaked internal model reasoning.

Do not display private chain-of-thought or hidden reasoning.
