# ProjectMatch AI — Deterministic Matching and Team Optimization

## Principle

The matching engine must be deterministic and explainable.

> **AI understands. Code decides.**

## Candidate Score

For each candidate:

```text
Final Candidate Score =
    Skill Match              × 0.40
  + Interest Alignment      × 0.20
  + Availability            × 0.15
  + Experience              × 0.10
  + Past Project Relevance  × 0.10
  + Collaboration Fit       × 0.05
```

All components are normalized to 0–100.

## Skill Match

For every required skill:

- 100 = strong/high-level match
- 75 = good match
- 50 = partial/related match
- 0 = no meaningful match

Required skills should receive greater weight than preferred skills.

Example:

```text
Required:
Computer Vision
Machine Learning
Mobile

Preferred:
UI/UX
Backend
```

The candidate's skill score should prioritize the required set.

## Interest Alignment

Compare:

```text
project domains
+
candidate interests
```

Example:

```text
Project: Sustainability + Smart Cities
Candidate interests: Sustainability + IoT
```

This receives a strong interest score.

## Availability

For MVP use:

```text
Weekdays
Weekends
Evenings
Flexible
```

Do not build calendar-level scheduling.

## Experience

Consider:

- Experience level
- Relevant project count
- Relevant project type
- Skill level

Only use stored profile data.

## Past Project Relevance

Compare project domain/category with the candidate's historical projects.

Example:

```text
Current project:
AI + Healthcare

Candidate history:
Medical image classification
Hospital data dashboard
```

Strong relevance.

## Collaboration Fit

Use:

- Collaboration style
- Preferred team size

Keep this component low-weighted.

---

# Team Composition

Do NOT simply select the top N candidates.

A strong team can contain:

```text
Candidate A = 96 individual score
Candidate B = 95 individual score
Candidate C = 94 individual score
Candidate D = 92 individual score
```

but still be weak if all four are frontend developers.

Instead evaluate combinations.

## Team Objective

Reward:

- Required skill coverage
- Complementarity
- Availability overlap
- Interest alignment
- Relevant experience

Penalize:

- Excessive duplication
- Critical skill gaps
- Severe availability conflicts

## Team Score

Recommended:

```text
Team Score =
    Skill Coverage        × 0.35
  + Complementarity       × 0.25
  + Candidate Quality     × 0.15
  + Interest Alignment    × 0.10
  + Availability          × 0.10
  + Experience Relevance  × 0.05
```

Normalize final score to 0–100.

## Small-Scale Optimization

Because the hackathon dataset is only approximately 30–40 students:

1. Filter candidates with hard conflicts.
2. Keep top ~10–15 candidates.
3. Generate feasible combinations.
4. Score each combination.
5. Select the highest team score.

For a team of four, brute-force combinations over 10–15 candidates is practical.

Do not introduce a heavy optimization library unless necessary.

## Complementarity

A candidate receives additional team value when they introduce a required capability that is weak or absent.

Example:

```text
Current team:
Python
Frontend
Backend

Candidate A:
Python + Backend

Candidate B:
Computer Vision + ML

Candidate C:
UI/UX + Product Design
```

Even if Candidate A has a slightly higher individual score, B or C may improve the team much more.

## Redundancy

Example:

```text
Team:
Python
Python
Python
Frontend
```

This should receive a lower complementarity score than:

```text
Python
Computer Vision
Frontend
Domain Expertise
```

## Team Health

After selecting the team, calculate:

```text
coveredSkills
weakSkills
missingSkills
redundantSkills
availabilityIssues
overallHealth
```

### Example

```text
TEAM HEALTH

Machine Learning     ✓ Strong
Computer Vision      ✓ Strong
Frontend             ✓ Strong
Backend              ✓
Domain Expertise     ⚠ Weak
Mobile               ✕ Missing
```

## Missing Teammate

If a critical skill is missing:

1. Identify the highest-priority missing skill.
2. Filter candidates with that skill.
3. Score candidates against the current team.
4. Prefer candidates that add missing capability without excessive redundancy.
5. Return the top candidate.
6. Ask AI only to explain the recommendation.

## Important

The AI must not:

- choose a different team
- modify scores
- fabricate profile facts
- invent missing candidates

The deterministic engine is authoritative.
