# ProjectMatch AI — Supabase Data and Seed Dataset

## Database

Use Supabase PostgreSQL for the deployed application.

The application should not rely on frontend-only hardcoded profiles for the final demo.

## Core Tables

```text
profiles
skills
profile_skills
interests
profile_interests
projects
project_requirements
project_members
matches
teams
team_members
skill_aliases
```

## MVP Simplification

If implementation time becomes tight, the first production version can reduce persistence to:

```text
profiles
skills
profile_skills
projects
project_members
```

and calculate matches/teams in application memory.

The final deployed application must still retrieve the student dataset from Supabase.

## Profiles

```text
id
name
avatar_url
department
year
bio
experience_level
collaboration_style
preferred_team_size
created_at
```

## Skills

Use a controlled vocabulary.

Initial canonical skills:

```text
Python
Machine Learning
Computer Vision
Data Science
Frontend
React
Backend
APIs
Mobile
Cloud
UI/UX
Product Design
Research
Sustainability
Domain Expertise
Cybersecurity
DevOps
Marketing
Communication
Pitching
IoT
Embedded Systems
Geospatial Data
Database
Testing
Project Management
```

## Profile Skills

```text
profile_id
skill_id
skill_level
```

Recommended skill levels:

```text
Beginner
Intermediate
Advanced
Expert
```

## Interests

Examples:

```text
AI
Sustainability
Healthcare
FinTech
Education
Smart Cities
Cybersecurity
Robotics
IoT
Climate
Design
Startups
Research
```

## Availability

For the MVP use simple categories:

```text
Weekdays
Weekends
Evenings
Flexible
```

## Past Projects

A profile should include enough project history to make relevance meaningful.

Example:

```json
{
  "title": "Traffic Sign Recognition",
  "category": "AI / Computer Vision",
  "skills": ["Python", "Computer Vision", "PyTorch"]
}
```

## Seed Dataset

Create approximately 30–40 realistic student profiles.

Include:

- AI/ML specialists
- Full-stack developers
- Frontend developers
- Backend developers
- UI/UX designers
- Data scientists
- Researchers
- Domain experts
- Marketing/pitching specialists
- Cloud/DevOps students
- Cybersecurity students
- IoT/embedded students

## Deliberate Dataset Design

Do not make every profile obviously perfect.

Include:

### Strong individual candidates

High project relevance.

### Redundant candidates

Excellent individual skill but too similar to existing team members.

### Rare specialists

A skill that only a few students possess.

### Availability conflicts

Excellent skills but poor availability.

### Complementary candidates

Slightly lower individual score but excellent missing-skill coverage.

This makes the demo prove that ProjectMatch does more than sort people.

## Demo Scenario

Seed a scenario that supports:

```text
Project:
AI-powered waste segregation

Needs:
Computer Vision
Machine Learning
Frontend
Backend
Sustainability / Domain Expertise
```

Make the ideal team contain complementary capabilities.

Then ensure:

- At least one candidate is technically excellent but redundant.
- At least one candidate has domain expertise.
- At least one candidate fills a critical gap.
- At least one candidate has an availability limitation.

## Data Integrity

AI must never create facts about a profile.

Every explanation must be traceable to:

```text
Supabase profile data
+
deterministic matching results
```

Missing data remains missing.

Do not silently invent defaults such as fake experience.
