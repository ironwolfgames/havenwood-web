# havenwood-web

Asymmetric co-op turn-based web game

## Game Core

- *Type:* Turn-based, web-based, co-op board game/sim hybrid.
- *Theme:* Whimsical fantasy land with anthropomorphic creatures.
- *Player Role:* Rulers of asymmetric factions/kingdoms.
- *Gameplay:* Systems/resource management (not tactical unit movement).
- *Turn Structure:* Simultaneous planning → single resolution phase.
- *Turn Length:* 2–5 mins of choices → ~60–90 min session.
- *Win/Loss:* Each faction has a unique mini-goal + shared project; group loses if survival thresholds fail.
- *Modes:* Co-op primary, solo with AI or single-faction possible.

## Shared Projects

### 1. The Great Sky Lantern
  
- *Theme:* A massive floating lantern powered by magic and resources, meant to banish the encroaching darkness.
- *Gameplay:* Requires steady contributions of food (fuel), magic research, crafted parts, and defenses against nighttime threats.
- *Victory Condition:* Launch the lantern before the final turn — it illuminates the entire land, driving back the darkness.

### 2. The Heartwood Tree
- *Theme:* An ancient tree at the center of the land that has withered; players must restore it.
- *Gameplay:* Each round, factions can contribute resources, magic, and blessings to heal different parts of the tree (roots, trunk, branches).
- *Victory Condition:* Fully restore the tree before it collapses, symbolizing life and balance returning to the land.

### 3. The Crystal Bridge
- *Theme:* A massive magical bridge that will connect the fractured lands and unite the kingdoms.
- *Gameplay:* Constructed in stages — requires building materials (otters), magical stabilizers (starlings), protection during construction (badgers), and supply lines (moles + foxes).
- *Victory Condition:* Complete all bridge segments before the final turn, allowing the kingdoms to be connected.

### 4. The Moon Temple
- *Theme:* A forgotten temple must be rebuilt and reawakened to seal away a chaotic force rising each night.
- *Gameplay:* Requires both construction (builders), ritual offerings (providers), arcane knowledge (mystics), and defense during rituals (guardians).
- *Victory Condition:* Complete all temple chambers and perform the final sealing ritual on the last turn.

### 5. The Skyship Ark
- *Theme:* A wondrous flying ship that can carry the factions to safety beyond the stormlands.
- *Gameplay:* Multi-step construction: hull (builders), sails/rigging (explorers), energy crystals (mystics), food stores (providers), defenses against raiders (guardians).
- *Victory Condition:* Launch the ship before the land is overrun, allowing the players to escape together.

### Design Notes

Each project can be modularized into stages, so every faction has clear contributions (e.g., Stage 1: foundation, Stage 2: power, Stage 3: final ritual/launch). Projects provide tension: players must divert resources between their faction goals, the shared project, and ongoing survival threats.

### How Shared Projects Could Work

#### 1. Project Selection Timing
  
- *Option A:* Chosen at the start of the game, players know their mission from turn 1.
- *Option B:* Chosen mid-game (say, around turn 3–4 of a 7-turn game) after players see how their kingdoms are developing. This creates drama: “We’re clearly great at farming this run — let’s restore the Heartwood Tree!”

#### 2. Project Structure

Each project could be broken into 3 stages, where each stage requires contributions from all factions:

- Example: *Skyship Ark*
  - Stage 1: Gather hull materials (builders, providers).
  - Stage 2: Power the engines and sails (mystics, explorers).
  - Stage 3: Defend the launch and stock supplies (guardians, providers).

Each stage could also come with unique events tied to the project:
- Heartwood Tree → “Root Blight” events.
- Sky Lantern → “Darkness Encroaches” events.
- Moon Temple → “Unstable Ritual” events.

#### 3. Replayability & Balance

- Having 4–6 possible projects (like the ones we sketched: Lantern, Heartwood, Bridge, Temple, Ark) would give players lots of variety.
- Each project subtly shifts the weight of importance between factions, ensuring that different sessions feel fresh.

## Factions & Gameplay Systems

### 1. Resource Cultivation System (Meadow Moles)

**Focus:** Food and raw materials.

- **Input:**
  - Water (from global water pool or prior infrastructure)
  - Fertilizer tokens (from trade or prior harvest)
- **Output:**
  - Food units → required by all factions each turn to maintain operations; shortage reduces Otters’ building capacity and Starlings’ research efficiency.
  - Timber → used by Badgers for fortifications and Otters for building project stages.
  - Fiber/Cloth → used by Starlings to craft magical research tools, and by Otters to build certain structures.
- **Unique Actions:** Plant, Harvest, Irrigate, Trade Surplus (convert Food → Timber or Fiber)

### 2. Defensive Infrastructure System (Oakshield Badgers)

**Focus:** Security & event mitigation.

- **Input:**
  - Timber (from Moles) → needed to build walls, barricades.
  - Stone (from Moles or explored nodes) → heavy fortifications.
- **Output:**
  - Protection Tokens → required by Otters to safely advance project stages without damage, and by Starlings to complete risky research tasks.
  - Stability Tokens → feed a global stability pool that prevents event escalation; if stability drops too low, a survival failure condition occurs.
- **Unique Actions:** Fortify, Patrol, Emergency Response

### 3. Arcane Knowledge System (Starling Scholars)

**Focus:** Research and magical enhancement.

- **Input:**
  - Food (from Moles) → sustains researchers.
  - Fiber/Cloth (from Moles) → crafting scrolls and research tools.
  - Protection Tokens (from Badgers) → required to safely perform high-level experiments.
- **Output:**
  - Magic Crystals → accelerate Otters’ construction or enhance Moles’ harvest.
  - Insight Tokens → predict or mitigate upcoming events; can also be spent to gain extra Stability Tokens (global pool).
- **Unique Actions:** Study, Forecast, Enchant/Empower

### 4. Construction & Logistics System (River Otters)

**Focus:** Building structures and advancing the shared project.

- **Input:**
  - Timber & Fiber/Cloth (from Moles)
  - Protection Tokens (from Badgers)
  - Magic Crystals (from Starlings)
- **Output:**
  - Project Progress Tokens → advance the shared project.
  - Infrastructure Tokens → can feed back to the global pool to improve resource transport efficiency for all factions (i.e., faster harvest, easier fortification).
- **Unique Actions:** Build, Repair, Connect/Transport

### Interdependence Overview

| Faction | Outputs → Used By |
| - | - |
| Moles | Food → Starlings, Otters; Timber → Badgers, Otters; Fiber/Cloth → Starlings, Otters |
| Badgers | Protection Tokens → Starlings, Otters; Stability Tokens → Global pool |
| Starlings | Magic Crystals → Otters, Moles; Insight Tokens → Event mitigation, Stability Tokens |
| Otters | Project Progress Tokens → Shared Project; Infrastructure Tokens → boosts resource transport for all factions |

## Sample Turn Overview

**Game State:**

- 4 Factions: Meadow Moles, Oakshield Badgers, Starling Scholars, River Otters
- Shared Project: Heartwood Tree (modular stages)
- Global Pool: Stability Tokens = 3
- Turn: 3 of 7

**Shared Action Pool (available actions this turn):**

1. Gather – produce base resources from your faction system
1. Build – advance construction/project stages
1. Research – generate Magic Crystals / Insights
1. Protect – generate Protection Tokens or Stability Tokens
1. Trade/Convert – exchange one type of resource for another
1. Special – faction-specific unique action

### Action Selection (Simultaneous)

Each player chooses 3 actions for the turn:

| Faction | Chosen Actions |
| - | - |
| Meadow Moles | Gather, Gather, Trade/Convert |
| Oakshield Badgers | Protect, Protect, Fortify (Special) |
| Starling Scholars | Research, Research, Forecast (Special) |
| River Otters | Build, Build, Connect/Transport (Special) |

### Resolution Phase

#### Step 1: Process Inputs → Outputs

##### Meadow Moles

- Gather:
  - Produce 3 Food, 2 Timber, 1 Fiber/Cloth
  - Food feeds Starling Scholars and Otters
  - Timber feeds Badgers and Otters
  - Fiber/Cloth feeds Starlings and Otters
- Trade/Convert: Convert 1 Food → 1 Timber (boosting Otters’ input)

##### Oakshield Badgers

- Protect ×2: Spend 2 Timber → Generate 2 Protection Tokens
- Fortify (Special): Spend 1 Timber + 1 Stone → Add 1 Stability Token to global pool

##### Starling Scholars

- Research ×2: Spend 2 Food + 1 Fiber/Cloth + 1 Protection Token → Generate 2 Magic Crystals, 1 Insight Token
- Forecast (Special): Reveal next turn’s event (planning aid)

##### River Otters

- Build ×2: Spend 2 Timber + 1 Fiber/Cloth + 1 Protection Token + 1 Magic Crystal → Advance Heartwood Tree by 2 Project Progress Tokens
- Connect/Transport (Special): Convert 1 Infrastructure Token → Reduce next turn’s resource cost for all factions by 1 unit

### Resource Flow Summary

| Resource | Source → Destination | Effect |
| - | - | - |
| Food | Moles → Starlings, Otters | Sustains research & building actions |
| Timber | Moles (+Trade) → Badgers, Otters | Build fortifications/project stages |
| Fiber/Cloth | Moles → Starlings, Otters | Craft scrolls, buildings |
| Protection Tokens | Badgers → Starlings, Otters | Enables safe research & construction |
| Stability Tokens | Badgers → Global | Prevents survival failure |
| Magic Crystals | Starlings → Otters, Moles | Boost harvest or construction |
| Project Progress Tokens | Otters → Shared Project | Heartwood Tree moves toward completion |
| Infrastructure Tokens | Otters → Global | Reduces next turn’s resource cost for all |
| Insight Tokens | Starlings → Global/Events | Predict & mitigate events |

### Check Global Mechanics

- Global Stability Pool: 3 + 1 (from Badgers) = 4 → above threshold, no survival failure triggered
- Shared Project Progress: Heartwood Tree advanced by 2 Project Progress Tokens
- Event Forecast: Next turn’s storm hazard revealed (players can pre-plan)

### Player Feedback

Each player now sees:
- How their outputs helped other factions (interdependence visible)
- Resources they have for the next turn
- Shared project progress and global stability status
- Upcoming events to plan their next actions
  
