# ProjectMatch AI — Gemini AI Provider and Integration

## Decision

Use **Google Gemini 3.7 Flash** as the primary AI model for the hackathon MVP.

The Google GenAI JavaScript SDK is:

```bash
npm install @google/genai
```

The model should be accessed only from the server.

## Why Gemini 3.7 Flash

ProjectMatch needs:

- Fast natural-language understanding
- Structured JSON output
- Good reasoning over project requirements
- Low enough latency for a live demo
- Simple JavaScript/TypeScript integration

Gemini's structured-output capability allows the application to provide a JSON Schema and receive predictable structured data.

## Architecture

```text
Browser
   |
   | POST /api/project/analyze
   v
Next.js Server
   |
   +--> Gemini AI Service
   |       |
   |       +--> Project analysis
   |       +--> Skill normalization
   |       +--> Team explanation
   |       +--> Gap explanation
   |
   +--> Matching Engine
           |
           +--> Supabase student profiles
           +--> Deterministic scoring
           +--> Team optimization
           +--> Team Health
```

## Security Rule

Never expose the Gemini API key to the browser.

Use:

```text
GEMINI_API_KEY=...
```

in server-side environment variables.

Do not use:

```text
NEXT_PUBLIC_GEMINI_API_KEY
```

## Provider Abstraction

Do not spread Gemini SDK calls throughout the application.

Use one service layer:

```text
lib/
  ai/
    gemini.ts
    schemas.ts
    prompts.ts
    project-analyzer.ts
    team-explainer.ts
```

The UI should never import `@google/genai`.

## Recommended Gemini Client

```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
```

Use the model:

```ts
const model = "gemini-3.7-flash";
```

## Server-Side Request

The server receives:

```ts
type ProjectAnalysisInput = {
  description: string;
  desiredTeamSize: number;
  category?: string;
  deadline?: string;
  availability?: string;
};
```

The server sends the description and constraints to Gemini.

Gemini returns structured project requirements.

The server validates the response with Zod.

Only validated data reaches the matching engine.

## Required AI Calls

Keep the MVP to four focused AI operations.

### 1. analyzeProject

Input:

- Project description
- Desired team size
- Optional category
- Optional deadline
- Optional availability

Output:

- Category
- Domain
- Required skills
- Preferred skills
- Roles
- Recommended team size
- Experience requirements

### 2. normalizeSkills

Input:

- Extracted natural-language skills
- Canonical skill taxonomy

Output:

- Canonical skill names
- Confidence
- Original term

### 3. explainTeam

Input:

- Project requirements
- Selected team
- Deterministic scores
- Skill coverage
- Team gaps

Output:

- Team summary
- Per-member reasons
- Skill coverage explanation
- Complementarity explanation

### 4. explainGap

Input:

- Missing skill
- Current team
- Candidate shortlist

Output:

- Gap explanation
- Recommended candidate
- Why candidate fills the gap

## Timeout

AI requests must have a practical timeout.

If the request fails:

1. Log the server-side error.
2. Do not expose raw provider errors to the user.
3. Use deterministic fallback project analysis where possible.
4. Continue the matching flow.
5. Clearly label fallback-derived results if the UI needs to distinguish them.

## Important Product Rule

AI is not the source of truth for numerical scores.

Gemini must never decide:

> "This person is 94% compatible."

The application calculates that number.

Gemini explains the result.

## AI Boundary

```text
AI:
  Understand
  Normalize
  Explain
  Diagnose

Application:
  Score
  Rank
  Optimize
  Calculate
  Validate
  Persist
```
