# ProjectMatch AI — Antigravity Implementation Prompt

## Role

You are the senior full-stack engineer implementing the ProjectMatch AI hackathon MVP.

The product is:

> **ProjectMatch AI — Build the right team, not just a team.**

Do not redesign the product into a generic chatbot, social network, or teammate directory.

## Primary Objective

Implement the complete core workflow:

```text
Project description
      ↓
Gemini project understanding
      ↓
Structured requirements
      ↓
Skill normalization
      ↓
Supabase student profiles
      ↓
Deterministic candidate scoring
      ↓
Complementary team optimization
      ↓
Team score
      ↓
AI explanation
      ↓
Team Health
      ↓
Missing teammate recommendation
```

## Existing Architecture

Use:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Supabase PostgreSQL
- Zod
- Google Gemini API
- Vercel

If the existing repository already has working components, preserve them.

Do not rewrite unrelated code.

## Gemini Integration

Install:

```bash
npm install @google/genai zod
```

Environment:

```text
GEMINI_API_KEY=
```

Never expose the key to the client.

Use:

```text
gemini-3.7-flash
```

Create:

```text
lib/ai/gemini.ts
lib/ai/prompts.ts
lib/ai/schemas.ts
lib/ai/project-analyzer.ts
lib/ai/team-explainer.ts
lib/ai/gap-explainer.ts
```

The Gemini SDK must only run server-side.

## API Routes

Create server endpoints as appropriate for the existing Next.js structure.

Minimum:

```text
POST /api/project/analyze
POST /api/team/explain
POST /api/team/gap
```

The analysis endpoint should:

1. Validate request with Zod.
2. Call Gemini.
3. Request structured JSON.
4. Validate returned JSON with Zod.
5. Normalize skills.
6. Retrieve profiles.
7. Run deterministic matching.
8. Return structured results.

## AI Responsibilities

Gemini may:

- Understand project descriptions.
- Extract requirements.
- Normalize semantic skill language.
- Explain recommendations.
- Explain skill gaps.

Gemini must not:

- Invent profile facts.
- Invent project history.
- Invent availability.
- Generate authoritative numerical match scores.
- Randomly choose the final team.
- Override deterministic matching.

## Matching Responsibilities

Application code must:

- Calculate candidate scores.
- Calculate team scores.
- Calculate skill coverage.
- Calculate complementarity.
- Penalize redundancy.
- Evaluate availability.
- Select the final team.
- Detect missing skills.
- Select missing-skill candidates.

Candidate weighting:

```text
Skill Match              40%
Interest Alignment      20%
Availability            15%
Experience              10%
Past Project Relevance  10%
Collaboration Fit        5%
```

Team weighting:

```text
Skill Coverage          35%
Complementarity         25%
Candidate Quality       15%
Interest Alignment      10%
Availability            10%
Experience Relevance     5%
```

## Required UI

Build or preserve these screens:

### Landing

Headline:

> Build the right team, not just a team.

CTA:

> Find My Team

### Project Builder

Inputs:

- Project description
- Team size
- Category
- Optional deadline
- Optional availability
- Optional existing team

CTA:

> Analyze Project

### AI Analysis

Show:

- Project category
- Domain
- Required skills
- Preferred skills
- Roles
- Recommended team size

CTA:

> Build My Team

### Team Results

Show:

- Members
- Roles
- Individual match
- Overall team score
- Skill coverage
- Availability
- Complementarity

Actions:

- Why This Team?
- Team Health

### Team Health

Show:

- Covered skills
- Weak skills
- Missing skills
- Redundant skills
- Overall health

CTA:

> Find Missing Teammate

### Missing Teammate

Show:

- Candidate
- Skill filled
- Candidate fit
- Relevant profile evidence
- Availability
- Explanation

## WOW Feature

The signature experience is:

> **Team Health + Skill Gap Detection**

The user should see something like:

```text
TEAM HEALTH

Computer Vision       ✓ Strong
Machine Learning      ✓ Strong
Frontend              ✓ Strong
Backend               ✓
Sustainability        ⚠ Weak
Mobile                ✕ Missing

Critical gap detected:
Mobile Development
```

Then:

```text
BEST MISSING TEAMMATE

Riya
Mobile Developer

Why:
Her Android and Flutter experience directly fills
the project's missing mobile capability.
```

## Loading Experience

During AI analysis, show a polished progress sequence:

```text
Understanding your project
✓ Identifying required capabilities
✓ Detecting skill gaps
✓ Evaluating available students
✓ Building complementary team
✓ Preparing team explanation
```

Do not claim to show private model reasoning.

## Error Handling

Handle:

- Empty project description
- Invalid team size
- Gemini timeout
- Gemini API failure
- Invalid AI JSON
- No profiles
- No suitable candidates
- Missing skill
- Supabase failure

The UI must not crash.

If Gemini fails, use a deterministic fallback where possible and continue matching.

## Seed Data

Create 30–40 realistic profiles if they do not already exist.

The dataset must demonstrate:

- Strong candidates
- Redundant candidates
- Rare skills
- Availability conflicts
- Complementary candidates
- Domain experts

## Code Organization

Prefer:

```text
app/
  page.tsx
  projects/
  analyze/
  team/
  api/

components/
  project/
  matching/
  team/
  ai/

lib/
  ai/
  matching/
  db/
  validation/

data/
  seed/

types/
```

Do not mix:

- UI logic
- Gemini prompts
- matching calculations
- database access

## Implementation Order

Do this in stages.

### Stage 1
Inspect the existing repository.

Do not overwrite working functionality.

### Stage 2
Verify the application builds.

### Stage 3
Implement project input.

### Stage 4
Implement Gemini project analysis.

### Stage 5
Implement Zod validation.

### Stage 6
Implement deterministic candidate scoring.

### Stage 7
Implement team optimization.

### Stage 8
Implement Team Health.

### Stage 9
Implement AI team explanation.

### Stage 10
Implement missing teammate recommendation.

### Stage 11
Add loading/error/empty states.

### Stage 12
Run typecheck and production build.

### Stage 13
Deploy to Vercel.

### Stage 14
Test the complete flow from a fresh session.

## Definition of Done

Do not stop at UI mockups.

The product is complete only when:

- A real project description reaches Gemini.
- Gemini returns structured requirements.
- Requirements are validated.
- Profiles come from the configured data source.
- Candidate scores are calculated by code.
- A complementary team is selected.
- The team score is calculated by code.
- Gemini explains the selected team using supplied facts.
- Team Health detects gaps.
- A missing teammate can be recommended.
- AI/API failures are handled.
- Production build succeeds.
- Secrets remain server-side.
- The deployed flow works end-to-end.

## Critical Rule

Do not generate a fake AI result just to make the demo work.

If a fallback is needed, clearly implement it as a fallback.

The demo should be convincing because the product actually works.
