# Implementation Plan for *Havenwood Kingdoms*

This implementation plan assumes:
- **Frontend & Backend Framework**: Next.js (full-stack)
- **Database & Auth & State Management**: Supabase
- **Hosting/Deployment**: Vercel

All tasks are decomposed into subtasks until each leaf task can be completed in ≤500 lines of code (or equivalent work). Each leaf includes clear **success criteria**.

---

## 1. Project Setup

### 1.1 Repository & Environment
- **Task:** Initialize repository
  - Success Criteria: A GitHub repository exists with `main` branch protected, README.md with project description, and MIT license file.

- **Task:** Configure development environment
  - Success Criteria: Next.js project initialized with TypeScript, ESLint, Prettier, Husky pre-commit hooks, and GitHub Actions CI for lint/test passes.

- **Task:** Supabase project setup
  - Success Criteria: A Supabase project created, linked to GitHub repo, with environment variables stored securely in Vercel.

### 1.2 Deployment
- **Task:** Configure Vercel deployment
  - Success Criteria: Deploys automatically from `main` branch; staging and production environments available.

---

## 2. Core Systems

### 2.1 Database Schema (Supabase)
- **Task:** Design faction/player schema
  - Success Criteria: Tables for `players`, `factions`, `sessions`, `resources`, `actions` created with RLS (Row-Level Security) enabled.

- **Task:** Define game session schema
  - Success Criteria: Table for `game_sessions` with references to players, shared projects, global states.

- **Task:** Define resource schema
  - Success Criteria: Tables for `resources` with relations to faction ownership and session context.

### 2.2 Authentication (Supabase Auth)
- **Task:** Implement email/password login
  - Success Criteria: Users can sign up, log in, and log out with Supabase email/password.

- **Task:** Implement OAuth providers
  - Success Criteria: Login works with Google/GitHub.

- **Task:** Link users to player profiles
  - Success Criteria: Each authenticated user is linked to a player profile in DB.

### 2.3 State Management
- **Task:** Configure Supabase subscriptions for real-time updates
  - Success Criteria: When any player submits an action, all clients see the updated state within 1 second.

- **Task:** Implement game state resolver function
  - Success Criteria: After all players lock in actions, Supabase function calculates new state and updates DB.

---

## 3. Core Gameplay Systems (Factions & Mechanics)

### 3.1 Resource Model (Shared Across All Factions)
- **Task:** Define shared resources (`Food, Materials, Knowledge, Magic, Energy`) in Supabase schema.
  - **Success Criteria:** Resources table exists in Supabase with correct schema; seeded with test data; accessible via Supabase API in Next.js.

- **Task:** Implement resource transaction system.
  - Subtasks:
    - Create API endpoint `/api/resources/adjust` to add/remove resources.
    - Ensure atomic operations (no partial updates).
    - Add validation (no negative totals unless explicitly allowed).
  - **Success Criteria:** Resources can be updated via API; updates are persisted in Supabase and reflected in the client state.

### 3.2 Faction Systems
Each faction has a unique system with inputs and outputs linked to shared/global resources.

#### 3.2.1 Builders (Materials → Structures → Global Benefits)
- **Task:** Implement structure-building system.
  - Subtasks:
    - Define `structures` table in Supabase (`id, name, cost, benefit, status`).
    - Create API `/api/build` to spend Materials and create structures.
    - Link structures to global modifiers (e.g., boosting Food production).
  - **Success Criteria:** Builders can spend Materials to add new Structures, which modify global gameplay parameters.

#### 3.2.2 Farmers (Food Production & Distribution)
- **Task:** Implement farming system.
  - Subtasks:
    - Create `farms` table with upgrade levels.
    - API `/api/farms/harvest` generates Food per turn based on farm levels.
    - Implement food decay (X% lost per turn unless stored by Builders).
  - **Success Criteria:** Farmers generate Food each turn; output is adjusted by upgrades and decay rules.

#### 3.2.3 Scholars (Knowledge Research)
- **Task:** Implement research system.
  - Subtasks:
    - Define `tech_tree` table with prerequisites and unlock effects.
    - API `/api/research/start` to spend Knowledge and queue research.
    - API `/api/research/complete` to finish research and unlock global modifiers.
  - **Success Criteria:** Scholars can research technologies that unlock new actions or boost efficiency across factions.

#### 3.2.4 Mystics (Magic → Energy → Buffs/Debuffs)
- **Task:** Implement magic channeling system.
  - Subtasks:
    - Create `rituals` table (`id, name, cost, effect`).
    - API `/api/rituals/cast` to spend Magic and apply effects.
    - Effects may include boosting another faction’s output, shielding against disasters, or generating Energy.
  - **Success Criteria:** Mystics can spend Magic to trigger effects that influence global/faction resources.

---

## 4. Multiplayer & Turn System (Simultaneous Turns)

### 4.1 Player Actions Submission
- **Task:** Implement action selection UI and storage.
  - Subtasks:
    - Create Supabase `actions` table (`player_id, turn_id, action_type, parameters`).
    - Frontend form allows each player to submit 1+ actions per turn.
    - API `/api/actions/submit` saves actions.
  - **Success Criteria:** Player can select and submit actions; data is stored in Supabase.

### 4.2 Turn Resolution Phase
- **Task:** Implement server-side turn resolution engine.
  - Subtasks:
    - Cron job (or serverless function on Vercel) checks when all players have submitted actions.
    - Engine pulls all actions, processes them in a deterministic order, applies changes to resources, and logs results.
    - Store results in `turn_results` table.
  - **Success Criteria:** When all players submit, the system resolves the turn, updates resources, and saves results.

### 4.3 Turn Result Delivery
- **Task:** Show turn results to players.
  - Subtasks:
    - API `/api/results/:turn_id` returns processed outcomes.
    - Frontend results screen displays changes in resources, new structures, completed research, etc.
  - **Success Criteria:** After resolution, players see a clear summary of what happened.

### 4.4 Timer for Turns (Optional)
- **Task:** Implement turn timer.
  - Subtasks:
    - Configurable countdown per game session.
    - If timer expires, unresolved players default to “no action” or AI-assist.
  - **Success Criteria:** Turns auto-resolve after timer expiry, ensuring game flow.

---

## 5. Game Loop & Victory/Defeat Conditions

### 5.1 Shared Project Progression
- **Task:** Implement shared project system.
  - Subtasks:
    - Create `projects` table (`id, name, stages, required_resources`).
    - API `/api/projects/progress` applies contributed resources toward project goals.
    - Update project stage when requirements are met.
  - **Success Criteria:** Players can collectively contribute resources to advance shared projects.

### 5.2 Mini-Goals for Factions
- **Task:** Implement faction-specific goals.
  - Subtasks:
    - Create `faction_goals` table linked to player/faction IDs.
    - Each faction has unique win conditions (e.g., Builders complete X structures).
    - UI displays progress toward mini-goals.
  - **Success Criteria:** Each faction tracks and displays progress toward their mini-goals.

### 5.3 Failure Conditions
- **Task:** Implement survival/failure checks.
  - Subtasks:
    - Define global failure triggers (e.g., Food < 0 for 2 turns = famine defeat).
    - Define per-faction failures (e.g., Mystics overchannel Magic causing collapse).
    - Resolution engine checks conditions each turn.
  - **Success Criteria:** Game ends immediately if any failure condition is met.

### 5.4 Victory Conditions
- **Task:** Implement victory system.
  - Subtasks:
    - Global victory: Shared project completed.
    - Conditional victory: All factions achieve mini-goals before collapse.
    - Store outcome in `game_sessions` table.
    - Display victory/defeat screen.
  - **Success Criteria:** When a win condition is met, the game session ends and displays results clearly.

---

## 6. User Interface

### 6.1 Core Layout
- **Task:** Implement lobby screen
  - Success Criteria: Users can create/join sessions.

- **Task:** Implement faction dashboard
  - Success Criteria: Each faction has its own view showing resources, actions, and logs.

- **Task:** Implement shared project view
  - Success Criteria: Shared project status visible to all players.

### 6.2 Game Flow
- **Task:** Implement turn timer (optional)
  - Success Criteria: If enabled, turn auto-resolves after X minutes.

- **Task:** Implement endgame screen
  - Success Criteria: Victory/defeat conditions displayed with recap of session.

---

## 7. Testing & QA

### 7.1 Unit Tests
- **Task:** Write tests for Supabase functions
  - Success Criteria: >80% coverage on resolution and resource management functions.

### 7.2 Integration Tests
- **Task:** Write tests for turn resolution
  - Success Criteria: Automated test simulates 4 factions taking turns, produces expected outcomes.

### 7.3 Playtesting Tools
- **Task:** Implement debug tools
  - Success Criteria: Admin-only UI to set resources, force resolution, or skip turns.

---

## 8. Deployment & Monitoring

### 8.1 CI/CD
- **Task:** Configure GitHub Actions with Vercel
  - Success Criteria: Code pushed to `main` auto-deploys; staging uses `develop` branch.

### 8.2 Monitoring
- **Task:** Set up Supabase logging
  - Success Criteria: Query performance and errors visible in Supabase dashboard.

- **Task:** Set up Vercel monitoring
  - Success Criteria: Errors and slow requests reported in Vercel dashboard.

---

✅ This plan is broken down to ensure all smallest-level tasks can be executed independently and tracked as GitHub Issues.

