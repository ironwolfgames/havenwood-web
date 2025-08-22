# Database Schema Documentation

This document describes the database schema for the Havenwood Kingdoms game, including tables, relationships, and security policies.

## Overview

The database is built on Supabase (PostgreSQL) and consists of eight main tables that handle player management, faction definitions, game sessions, player-session relationships, resources tracking, player actions, turn resolution, and shared project definitions.

## Tables

### `players`
Stores player profiles linked to authenticated users.

**Columns:**
- `id` (UUID, PK) - Unique player identifier
- `user_id` (UUID, FK → auth.users) - Reference to Supabase auth user
- `username` (TEXT, UNIQUE) - Player's display name (3-50 chars, alphanumeric + underscore/dash)
- `created_at` (TIMESTAMPTZ) - Account creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)

**Constraints:**
- Username must be 3-50 characters
- Username format: alphanumeric, underscore, dash only
- Each auth user can have only one player profile

**Security (RLS):**
- Players can view, update, create, and delete their own profile only

### `factions`
Defines the four main game factions and their system types.

**Columns:**
- `id` (UUID, PK) - Unique faction identifier
- `name` (TEXT, UNIQUE) - Faction name (3-100 chars)
- `description` (TEXT) - Faction description (10-1000 chars)
- `system_type` (TEXT) - System specialization: 'provisioner', 'guardian', 'mystic', 'explorer'
- `created_at` (TIMESTAMPTZ) - Creation timestamp

**Constraints:**
- System type must be one of the four valid types
- Name and description have length constraints

**Security (RLS):**
- All authenticated users can read factions (public game data)
- Only service role can modify factions (admin-only)

### `game_sessions`
Represents individual game sessions/matches.

**Columns:**
- `id` (UUID, PK) - Unique session identifier
- `name` (TEXT) - Session name (3-100 chars)
- `status` (TEXT) - Current status: 'waiting', 'active', 'completed'
- `current_turn` (INTEGER) - Current turn number (1-max_turns)
- `max_turns` (INTEGER) - Maximum turns for this session (1-20, default 7)
- `shared_project_id` (UUID, nullable) - Reference to shared project (future feature)
- `created_at` (TIMESTAMPTZ) - Session creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)

**Constraints:**
- Current turn must be between 1 and max_turns
- Max turns must be between 1 and 20
- Turn progression is validated

**Security (RLS):**
- Players can view sessions they're participating in
- Authenticated users can create new sessions
- Session participants can update sessions

### `session_players`
Junction table linking players to game sessions with their chosen factions.

**Columns:**
- `id` (UUID, PK) - Unique record identifier
- `session_id` (UUID, FK → game_sessions) - Reference to game session
- `player_id` (UUID, FK → players) - Reference to player
- `faction_id` (UUID, FK → factions) - Reference to chosen faction
- `joined_at` (TIMESTAMPTZ) - When player joined the session

**Constraints:**
- Each player can join a session only once
- Each faction can be used only once per session
- Cascade delete when session or player is deleted
- Restrict delete when faction is deleted (preserves game history)

**Security (RLS):**
- Players can view participants of sessions they're in
- Players can join sessions (insert their own participation)
- Players can leave sessions (delete their own participation)
- Players can update their faction choice

### `resources`
Tracks resource quantities per faction per turn in game sessions.

**Columns:**
- `id` (UUID, PK) - Unique resource record identifier
- `session_id` (UUID, FK → game_sessions) - Reference to game session
- `faction_id` (UUID, FK → factions) - Reference to faction owning the resource
- `resource_type` (TEXT) - Type of resource: food, timber, fiber, protection_tokens, stability_tokens, magic_crystals, insight_tokens, infrastructure_tokens, project_progress
- `quantity` (INTEGER) - Amount of the resource (non-negative)
- `turn_number` (INTEGER) - Turn when this resource state was recorded
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)

**Constraints:**
- Quantity must be non-negative
- Turn number must be positive
- Resource type must be one of the valid types
- Unique per session/faction/resource_type/turn combination

**Security (RLS):**
- Players can view resources for sessions they're in
- Players can update resources for their own faction
- Players can create resources for their own faction
- Only service role can delete resources

### `actions`
Stores player actions with flexible parameters for turn-based gameplay.

**Columns:**
- `id` (UUID, PK) - Unique action identifier
- `session_id` (UUID, FK → game_sessions) - Reference to game session
- `player_id` (UUID, FK → players) - Reference to player submitting the action
- `turn_number` (INTEGER) - Turn when action was submitted
- `action_type` (TEXT) - Type of action: gather, build, research, protect, trade, special
- `action_data` (JSONB) - Flexible storage for action parameters
- `status` (TEXT) - Action status: submitted, resolved
- `submitted_at` (TIMESTAMPTZ) - When action was submitted

**Constraints:**
- Turn number must be positive
- Action type must be one of the valid types
- Status must be submitted or resolved

**Security (RLS):**
- Players can view actions for sessions they're in
- Players can create their own actions
- Players can update their own submitted actions
- Only service role can delete actions

### `turn_results`
Stores resolution outcomes for each turn in a game session.

**Columns:**
- `id` (UUID, PK) - Unique result identifier
- `session_id` (UUID, FK → game_sessions) - Reference to game session
- `turn_number` (INTEGER) - Turn these results apply to
- `results_data` (JSONB) - Flexible storage for resolution outcomes
- `resolved_at` (TIMESTAMPTZ) - When turn was resolved

**Constraints:**
- Turn number must be positive
- Unique per session/turn combination

**Security (RLS):**
- Players can view turn results for sessions they're in
- Only service role can modify turn results

### `shared_projects`
Stores shared project definitions for cooperative gameplay.

**Columns:**
- `id` (UUID, PK) - Unique project identifier
- `name` (TEXT, UNIQUE) - Project name (3-100 chars)
- `description` (TEXT) - Project description (10-1000 chars)
- `stages` (JSONB) - Project stages with requirements
- `created_at` (TIMESTAMPTZ) - Creation timestamp

**Constraints:**
- Name must be 3-100 characters
- Description must be 10-1000 characters

**Security (RLS):**
- All authenticated users can read shared projects (public game data)
- Only service role can modify shared projects

## Relationships

```
auth.users (1) ←→ (1) players
factions (1) ←→ (n) session_players
factions (1) ←→ (n) resources
players (1) ←→ (n) session_players  
players (1) ←→ (n) actions
game_sessions (1) ←→ (n) session_players
game_sessions (1) ←→ (n) resources
game_sessions (1) ←→ (n) actions
game_sessions (1) ←→ (n) turn_results
game_sessions (1) ←→ (0..1) shared_projects (via shared_project_id)
```

## Indexes

Performance indexes are created on:
- `players`: user_id, username, created_at
- `factions`: name, system_type, created_at
- `game_sessions`: status, created_at, current_turn
- `session_players`: session_id, player_id, faction_id, joined_at
- `resources`: session_id, faction_id, resource_type, turn_number, created_at, session_turn composite
- `actions`: session_id, player_id, turn_number, action_type, status, submitted_at, session_player_turn composite, action_data (GIN)
- `turn_results`: session_id, turn_number, resolved_at, session_turn composite, results_data (GIN)
- `shared_projects`: name, created_at, stages (GIN)

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Ensure players can only access their own data
- Allow public read access to faction data
- Restrict game session access to participants
- Prevent unauthorized modifications

### Data Integrity
- Foreign key constraints maintain referential integrity
- Check constraints validate data formats and ranges
- Unique constraints prevent duplicate entries
- Cascade and restrict rules handle deletions appropriately

## Initial Data

The `factions` table is seeded with the four main factions:

1. **Meadow Moles** (Provisioner) - Agriculture & crafting specialists
2. **Oakshield Badgers** (Guardian) - Defense & stability specialists  
3. **Starling Scholars** (Mystic) - Knowledge & magic specialists
4. **River Otters** (Explorer) - Expansion & engineering specialists

The `shared_projects` table is seeded with the five cooperative projects from the Game Design Document:

1. **Sky Lantern of Eternal Dawn** - Illuminate the land to hold back encroaching darkness
2. **Heartwood Tree Restoration** - Revive the central life-giving tree
3. **Crystal Bridge Across the Chasm** - Reconnect isolated kingdoms with a crystal bridge
4. **Moon Temple Ritual** - Seal away corruption with a massive magical ritual
5. **Skyship Ark** - Build an airship to evacuate kingdoms to safety

## Usage

### Setup
1. Run the migration scripts in order (`001_` through `008_`)
2. Run the seed scripts to populate factions and shared projects
3. Verify tables and relationships are created correctly

### API Operations
The `database-operations.ts` module provides type-safe CRUD operations for all tables:
- `playerOperations` - Player management
- `factionOperations` - Faction queries
- `gameSessionOperations` - Game session management  
- `sessionPlayerOperations` - Session participation
- `resourceOperations` - Resource tracking and updates
- `actionOperations` - Player action submission and management
- `turnResultOperations` - Turn resolution data
- `sharedProjectOperations` - Shared project definitions
- `adminOperations` - Administrative functions

### Testing
Basic tests validate:
- CRUD operation signatures
- Type safety
- Security policy enforcement
- Data constraint validation

## Files

- `supabase/migrations/001_create_players_table.sql`
- `supabase/migrations/002_create_factions_table.sql`
- `supabase/migrations/003_create_game_sessions_table.sql`
- `supabase/migrations/004_create_session_players_table.sql`
- `supabase/migrations/005_create_resources_table.sql`
- `supabase/migrations/006_create_actions_table.sql`
- `supabase/migrations/007_create_turn_results_table.sql`
- `supabase/migrations/008_create_shared_projects_table.sql`
- `supabase/seed-data/001_seed_factions.sql`
- `supabase/seed-data/001_shared_projects.sql`
- `src/lib/database-operations.ts`
- `src/app/api/setup-database/route.ts`
- `__tests__/lib/database-operations.test.ts`