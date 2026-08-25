# ProjectMatch AI — Implementation Documentation Index

## Purpose

This documentation pack is the implementation-ready source of truth for the ProjectMatch AI hackathon MVP.

Core product:

> **Describe your project. ProjectMatch builds the team you're missing.**

The implementation follows one central rule:

> **AI understands and explains. Application code scores and optimizes.**

## Documents

1. `01_Gemini_AI_Provider_and_Integration.md`
   - Gemini 3.7 Flash integration
   - Server-side API usage
   - Environment variables
   - AI service abstraction
   - Failure and fallback behavior

2. `02_AI_Workflow_Schemas_and_Prompts.md`
   - Project analysis
   - Skill normalization
   - Team explanation
   - Skill-gap explanation
   - Zod schemas
   - Prompt contracts

3. `03_Deterministic_Matching_and_Team_Optimization.md`
   - Candidate scoring
   - Team scoring
   - Complementarity
   - Redundancy penalties
   - Team Health
   - Missing teammate selection

4. `04_Supabase_Data_and_Seed_Dataset.md`
   - Database requirements
   - Canonical skills
   - Student profile structure
   - Seed data strategy
   - Demo dataset design

5. `05_Antigravity_Implementation_Prompt.md`
   - Exact implementation instructions for an AI coding agent
   - Files/modules to create
   - Acceptance criteria
   - What not to build

6. `06_Testing_Deployment_and_Demo.md`
   - QA checklist
   - AI failure tests
   - Production deployment
   - 90-second demo flow

## Existing Project Context

The existing ProjectMatch documentation already defines:

- Next.js + TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Supabase PostgreSQL
- Zod
- Vercel deployment
- Seeded student profiles
- Deterministic matching

This pack adds the concrete Gemini implementation layer.

## MVP Boundary

### Must work

- Natural-language project input
- Gemini project analysis
- Structured required/preferred skills
- Controlled skill normalization
- Student profile retrieval
- Deterministic candidate scoring
- Complementary team composition
- Team match score
- AI explanation
- Team Health
- Critical skill-gap detection
- Missing teammate recommendation
- Loading/error/fallback states
- Production deployment

### Do not build for the MVP

- Chat
- Payments
- Video calls
- Social feed
- Complex authentication
- Calendar integration
- Admin dashboard
- Notifications
- Full messaging system
- Autonomous agents
- AI-generated numerical match scores
