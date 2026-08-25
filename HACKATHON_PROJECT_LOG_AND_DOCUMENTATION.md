# 🏆 PROJECT AI-X — Hackathon Project Log & Engineering Documentation
**Event:** PromptWars Hackathon at SRM (FAST × NVIDIA × Hack2skill)  
**Problem Statement:** Problem Statement 2 — Team Formation Platform (ProjectMatch AI / PROJECT AI-X)  
**Core Slogan:** *"Build the right team, not just a team."*  
**Date:** August 25, 2026  

---

## 📑 Executive Summary

When students and engineers form teams for hackathons, capstones, or research initiatives, they typically rely on immediate friend circles or manual keyword searches. This leads to unbalanced squads (e.g. four machine learning engineers and zero frontend developers), schedule mismatches, single-point-of-failure skill bottlenecks, and high team failure rates.

**PROJECT AI-X** flips the paradigm: **Start with the project, not the social graph.**  
A user provides an unstructured natural-language project pitch, and the platform utilizes **Google Gemini 3.7 / 1.5 Flash** for semantic understanding and deterministic mathematical optimization to compose the optimal, complementary squad while detecting and healing real-time capability gaps.

---

## ⏱️ Hour-by-Hour Hackathon Implementation Log

### 🕒 Hour 1: Strategy, Problem Analysis & Architecture Definition
* **Activities**:
  - Selected Problem Statement 2: *ProjectMatch — Team Formation Platform*.
  - Established the foundational architectural doctrine:
    > *"AI understands and explains. Application code scores and optimizes."*
  - Designed the data contract schemas using **Zod** (`projectAnalysisSchema`, `teamExplanationSchema`, `gapExplanationSchema`).
  - Outlined the 6-factor candidate scoring formulation and complementary team objective function.
* **Challenges & Solutions**:
  - *Challenge*: LLMs hallucinate arbitrary numerical match scores (e.g., claiming a student has a "94.3% fit" without consistent mathematical justification).
  - *Solution*: Confined Gemini strictly to natural language parsing and qualitative rationale, delegating all scoring and combinatorial optimization to deterministic TypeScript algorithms.

---

### 🕒 Hour 2: Core Matching Engine & Gemini Server-Side Integration
* **Activities**:
  - Integrated `@google/generative-ai` SDK in `lib/ai/gemini.ts` with structured JSON output enforcement (`responseMimeType: "application/json"`).
  - Built `lib/ai/project-analyzer.ts` for semantic capability extraction.
  - Implemented `lib/matching/normalizer.ts` to map colloquial skills (`"cv"`, `"yolo"`, `"web"`, `"fastapi"`) into standard canonical taxonomy.
  - Developed the 6-factor scoring engine (`candidate-scorer.ts`) and combinatorial permutation optimizer (`team-optimizer.ts`).
* **Challenges & Solutions**:
  - *Challenge*: Individual top-scorers often have identical skillsets, causing high redundancy and missing critical roles (e.g., 4 ML engineers, 0 designers).
  - *Solution*: Introduced a mathematical penalty for duplicate roles and rewarded complementary coverage in the team objective function.

---

### 🕒 Hour 3: Signature WOW Feature — Real-Time Team Health & Skill Gap Detector
* **Activities**:
  - Created `lib/matching/team-health.ts` to audit team capabilities into **Covered (✓ Strong)**, **Weak (⚠ Low Depth)**, **Missing (✕ Unmet)**, and **Overlaps (3+ Members)**.
  - Engineered the real-time interactive trigger: clicking "Remove" on any team member recalculates health client-side in 0ms, dynamically flagging critical missing capabilities.
  - Built `lib/matching/missing-teammate.ts` and `MissingTeammateModal.tsx` to identify the optimal single candidate who heals the gap with grounded AI rationale and confetti feedback.
* **Challenges & Solutions**:
  - *Challenge*: Re-running full LLM analysis on every team adjustment causes 2–3 second latency during live judging.
  - *Solution*: Decoupled the health audit into pure client-side deterministic evaluation, providing instantaneous (0ms) visual responsiveness.

---

### 🕒 Hour 4: Aura Systematic Design Overhaul (Pixel-Perfect Alignment)
* **Activities**:
  - Replaced generic styles with the **Aura Systematic** design specification (`DESIGN.md`):
    - Light editorial theme (`#f9f9f9` background, `#1a1c1c` typography, `#ffffff` cards with `#e2e2e2` borders).
    - Modern Inter typography with tight tracking headlines (`-0.04em`).
    - Pill-shaped interactive elements (`rounded-full`).
  - Restructured top navigation, hero display headline, 4-metric stats bar (`500+` Students, `120+` Projects, `90%` Success, `25+` Colleges), and the 4-card *"How AI connects you"* Bento grid.
* **Challenges & Solutions**:
  - *Challenge*: Matching complex multi-widget layouts with specific spacing and border radii.
  - *Solution*: Configured custom Tailwind color tokens, utility classes, and custom scrollbars.

---

### 🕒 Hour 5: Project Builder, AI Analysis & Team Composer Redesign
* **Activities**:
  - Redesigned the **Project Builder** to match user mockups:
    - Multi-line bold headline (*"Describe What You're Building"*), 5 preset pills (*Campus*, *Pothole*, *Agritech*, *Mental*, *Micro-Lending*).
    - 3 parameter cards: Target Team Size (with black pill counter badge), Availability Select, and Category Input.
  - Redesigned the **AI Analysis Complete** section:
    - Left *Project Overview* card with enlarged *AI SUMMARY* typography.
    - Right *Parameters* card (Team Size, Experience Level, Timeline).
    - Bottom *Suggested Roles* 3-column grid with *Required* and *Preferred* chips.
  - Redesigned the **Why This Team?** grounded explanation widget with executive summary and 2x2 member rationale cards with bullet points.

---

### 🕒 Hour 6: Database Scaling (500 Profiles) & Cloud Persistence
* **Activities**:
  - Scaled the calibrated student database from **35 to 500 rich, realistic student profiles** across 12 academic departments, skills, years, projects, and availability slots.
  - Integrated **Firebase Firestore** SDK (`lib/db/firebase.ts`) and persistent disk storage (`lib/db/store.ts`).
  - Implemented automatic real-time database saving whenever projects are analyzed or teams are modified.
  - Created `/api/ai/status` and added the **Gemini AI Model Inspector** diagnostic tool to the navigation bar.
* **Challenges & Solutions**:
  - *Challenge*: Large seed database could cause TypeScript compilation bloat or slow startup times.
  - *Solution*: Automated clean profile generation via `scripts/generate-500-students.mjs` ensuring strict schema compliance and static pre-rendering.

---

### 🕒 Hour 7: Deployment Preparation, Verification & Documentation
* **Activities**:
  - Configured Netlify deployment with Next.js App Router support.
  - Injected live `GEMINI_API_KEY` and Firebase configuration into serverless environment variables.
  - Executed automated browser testing across all interactive user flows.
  - Drafted hackathon presentation scripts and LinkedIn announcement templates.

---

## 🛠️ Technical Architecture & Technology Stack

| Layer | Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (App Router) + React 18** | High-performance Server & Client Components with zero-layout-shift routing. |
| **Language** | **TypeScript 5** | Strict end-to-end type safety across Zod schemas, matching algorithms, and UI props. |
| **AI / LLM Engine** | **Google Gemini 3.7 / 1.5 Flash** (`@google/generative-ai`) | Semantic Natural Language Understanding, requirements extraction, and grounded explanations. |
| **Data Validation** | **Zod 3** | Runtime schema validation for AI JSON structured outputs. |
| **Styling & Theme** | **Tailwind CSS + Aura Systematic** | Monochromatic light editorial design system (`#f9f9f9`, `#1a1c1c`, pill buttons). |
| **Database** | **Firebase Firestore + Persistent Store** | 500-student talent repository with real-time automatic project persistence. |
| **Icons & Effects** | **Lucide React + Material Symbols + Canvas Confetti** | Smooth micro-interactions, responsive states, and celebratory confetti on gap resolution. |

---

## 🧮 Mathematical Scoring Formulation

### 1. Individual Candidate Scoring Formula ($0 - 100$)
$$\text{Score} = (\text{Skills} \times 0.40) + (\text{Interests} \times 0.20) + (\text{Availability} \times 0.15) + (\text{Experience} \times 0.10) + (\text{Past Projects} \times 0.10) + (\text{Fit} \times 0.05)$$

* **Skills (40%)**: Verified skill level ratings (Expert = 100, Advanced = 85, Intermediate = 65, Beginner = 40) mapped against required capabilities.
* **Interests (20%)**: Semantic overlap between student interest tags and project domains.
* **Availability (15%)**: Synchronous schedule overlap across week slots.
* **Experience (10%)**: Rating based on study year and technical level.
* **Past Projects (10%)**: Historical track record in relevant domains.
* **Collaboration Fit (5%)**: Alignment with target team size and working style.

---

### 2. Team Objective Function ($0 - 100$)
$$\text{Team Score} = (\text{Coverage} \times 0.35) + (\text{Complementarity} \times 0.25) + (\text{Quality} \times 0.15) + (\text{Interests} \times 0.10) + (\text{Availability} \times 0.10) + (\text{Experience} \times 0.05)$$

* **Coverage (35%)**: Ratio of project-required skills covered by at least one Advanced/Expert team member.
* **Complementarity (25%)**: Penalizes identical role duplication while rewarding balanced multidisciplinary distribution.

---

## 🎯 Key Problems Encountered & How We Solved Them

1. **LLM Non-Determinism & Score Hallucination**:
   - *Problem*: Pure LLM matching produces varying match scores on identical inputs and invents student qualifications.
   - *Fix*: Created the hybrid architecture where Gemini handles text understanding and explanation, while deterministic algorithms calculate exact mathematical scores.

2. **Real-Time Client Performance with 500 Profiles**:
   - *Problem*: Evaluating combinatorial permutations across 500 candidates could degrade UI responsiveness.
   - *Fix*: Implemented a two-stage pipeline: top candidates are pre-filtered and ranked before running combinatorial team optimization.

3. **Multi-Environment Deployment Graceful Fallbacks**:
   - *Problem*: Serverless cold starts or missing API keys during evaluation can break live hackathon demonstrations.
   - *Fix*: Implemented fail-safe heuristic parsers and dual database layers so the app always operates with 100% uptime.

---

## 🎬 90-Second Hackathon Demo Script

1. **0:00 - 0:15 (The Hook)**: Introduce PROJECT AI-X and the core problem: teams fail because of composition mismatches, not bad ideas.
2. **0:15 - 0:35 (Natural Language AI Parsing)**: Select the *AI Campus Waste Segregation* preset $\to$ click *Analyze Project* $\to$ show Gemini extracting technical requirements and roles.
3. **0:35 - 0:55 (Team Composition & Grounded Explanations)**: Showcase the 4-member squad, metric gauges, and Gemini's verified factual justification.
4. **0:55 - 1:15 (The WOW Feature — Skill Gap Detection)**: Remove *Rahul Verma* (Sustainability Lead) $\to$ watch the Team Health panel instantly flash **CRITICAL SKILL GAP: Sustainability**.
5. **1:15 - 1:30 (1-Click Resolution & Conclusion)**: Click *Resolve Gap* $\to$ preview recommended candidate $\to$ click *Add to Team & Heal Gap* $\to$ celebrate with confetti and conclusion.
