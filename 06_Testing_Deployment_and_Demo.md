# ProjectMatch AI — Testing, Deployment and 90-Second Demo

## 1. Functional QA

### Project Input

Test:

- Empty description
- Very short description
- Long description
- Team size 2
- Team size 4
- Team size 8
- Missing optional fields
- Invalid team size

### Gemini

Test:

- Successful response
- Timeout
- API error
- Invalid structured response
- Missing optional fields
- Unexpected skill wording

### Matching

Test:

- Exact skill match
- Partial skill match
- No skill match
- Strong redundant candidate
- Strong complementary candidate
- Availability conflict
- No candidate for a required skill

### Team Health

Test:

- All skills covered
- Weak skill
- Critical missing skill
- Duplicate/redundant skills
- No suitable replacement

## 2. AI Reliability Tests

The application must survive:

```text
Gemini unavailable
Gemini slow
Gemini returns malformed data
Gemini returns unknown skill
Supabase unavailable
```

The UI should display a useful error or fallback state.

## 3. Grounding Test

Create a profile:

```text
Name: Test Student
Skills: Python
Projects: Weather App
Availability: Weekends
```

Ask the system to explain why they were selected.

The explanation must not claim:

```text
PyTorch
Computer Vision
Healthcare experience
```

because those facts do not exist.

## 4. Score Integrity Test

Given the same:

```text
project
profiles
weights
```

the deterministic engine must produce the same result.

AI output must not change the numerical score.

## 5. Production Environment

Required:

```text
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit `.env.local`.

Never expose:

```text
GEMINI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

to the browser.

## 6. Deployment

Target:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ├── Supabase
   └── Gemini
```

Deploy early.

Do not wait until the final hour.

## 7. Demo Project

Recommended demo:

> We are building an AI-powered waste segregation system that uses computer vision to identify waste and recommend the correct disposal method.

Desired requirements:

```text
Computer Vision
Machine Learning
Frontend
Backend
Sustainability / Domain Expertise
```

Start with:

```text
Team size: 4
```

Then show:

1. AI analysis.
2. Team recommendation.
3. Match score.
4. Why This Team.
5. Team Health.
6. Missing skill.
7. Missing teammate recommendation.

## 8. 90-Second Demo Script

### 0–10 seconds — Problem

> "Students usually build teams from people they already know. That makes it easy to miss critical skills."

### 10–20 seconds — Product

> "ProjectMatch starts with the project instead of the social network. Describe what you're building, and it figures out the team you need."

### 20–35 seconds — AI Analysis

Enter the demo project.

Show:

```text
Understanding project
Identifying capabilities
Detecting skill gaps
```

Then show structured requirements.

### 35–55 seconds — Team

Show:

```text
YOUR IDEAL TEAM
92% Team Fit
```

Reveal members and their complementary roles.

### 55–70 seconds — Why This Team

Click:

> Why This Team?

Show the grounded explanation.

### 70–85 seconds — WOW

Open Team Health.

Show:

```text
Sustainability       ⚠ Weak
Mobile               ✕ Missing
```

Then:

> Find Missing Teammate

### 85–90 seconds — Close

> "ProjectMatch doesn't just find people who are good individually. It builds the team that covers what the project is missing."

## Judge Message

The key technical explanation is:

> "Gemini handles the semantic work — understanding the project and explaining recommendations. Our deterministic matching engine calculates the actual scores and optimizes the team, so the recommendations remain explainable and reproducible."

That sentence clearly demonstrates meaningful AI without pretending the model is responsible for everything.
