# Houses of Havenwood — Game Design Document

## 1. Theme & Background

In the ancient woodland realm of **Havenwood**, four great anthropomorphic animal houses live in peaceful harmony. For centuries, they have protected the forest from natural threats, magical anomalies, and the encroaching ambitions of unseen enemies. But now, a **magical storm known as the Umbral Tempest** begins sweeping through the land, warping creatures, corrupting the wilds, and threatening the heart of Havenwood itself.

Only through cooperation can the four houses—**Squirrels (Harvesters), Foxes (Explorers), Owls (Researchers), and Badgers (Architects)**—combine their unique strengths to survive the storm, repel outside forces, and complete a monumental shared project needed to save Havenwood.

“Houses of Havenwood” is a cooperative, asymmetric euro-style game where each player controls one house and must use their distinct abilities to support the others in a shared struggle against time, threats, and escalating magical chaos.

## 2. Round Overview

- All houses draw from **one shared action deck**, collaboratively improved via deckbuilding.
- Each round:
  1. Draw to **hand limit** (start: 5).
  2. Each house **may pass one card** to a neighbor.
  3. Houses simultaneously **play cards from their hand** to perform actions.
     - **Build**: Construct or upgrade a building on the map where your House marker is located.
     - **Move**: Move your House marker to an adjacent hex up to N times, where N is indicated on the Move card.
     - **Buy Card**: Purchase a new card from the Market.
     - **Main Action**: Perform your House's unique Main Action.
     - **Auxiliary Action**: Perform your House's unique Auxiliary Action.
  4. Perform house specific **Cleanup** 
  5. Draw N event cards and resolve them, where N is the number on the threat track. Event cards can increase the threat track, target specific buildings or resources, etc.

### **Hex Tile Map**

- Modular hex map; foxes explore to add new tiles.
- Buildings: max **one** per hex.
- Each hex has:
  - **Environment type**
  - **Natural resources**
  - **Event vulnerability** (varies by environment)

## 3. Resources

All basic and composite resources are shared globally; spending of resources is done co-operatively in agreement as a team.

### Basic Resources

1. Food - harvested by the Farm building - environment: Plains
1. Wood - harvested by the Forester Station building - environment: Forest
1. Ore - harvested by the Mine building - environment: Plains/Mountains
1. Stone - harvested by the Quarry building - environment: Plains/Mountains

### Composite Resources

1. Lumber - input: Wood - produced by the Mill
1. Steel - input: Wood, Ore - produced by the Furnace
1. Stone Brick - input: Stone - produced by the Quarry

### Resource Usage Overview

Wood, Lumber, Steel, Stone, and Stone Bricks are used by all houses to construct their own buildings and by the Badgers for constructing the various stages of each shared project.

Food is used for all deckbuilding actions.

All basic and composite resources are used by the Owls to purchase their research cards.

### Starting Resources

Each House begins the game with **4 Food** and **2 Wood**.

## 4. Houses

Each house performs their unique main and auxiliary actions using their own asymmetric mechanics.

### Squirrels - Harvesters & Producers

#### A. Main action – Harvest

- Dice faces:
  - 1–3 resource icons
  - Bust (acorn cracked)
- For each basic resource building:
  - Roll a pool of N building-specific dice where N is the level of the building.
  - A single bust on a dice means that dice can no longer be rerolled.
  - Lock any number of dice and reroll the rest, continuing until all dice have been locked by the player or busted.
  - Calculate the sum of the values on the locked dice and then gain that amount of the basic resource that the given building harvests.

#### B. Auxiliary action – Produce

- Card icons:
  - 1, 2, or 3 output
  - Gear fragment (half bust)
- Two gear fragments = bust → production from that building is limited to 1 resource.
- Each production building grants 5/7/10 draw cards building levels 1/2/3.
- For each building:
  - Draw one card at a time up to the draw limit, choosing when to stop drawing cards.
  - At any point if you bust with two gear fragments, the production is limited to 1 resource.
  - If you don't bust by the time you choose to stop drawing cards, your production limit is the sum of the values on the cards.
  - You may then spend the necessary basic resources to produce the building's composite resource up to the production limit.

#### Cleanup

- No special cleanup.

#### Squirrel Buildings

| Building         | Level 1 Cost    | Level 2 Cost    | Level 3 Cost                 |
| ---------------- | --------------- | --------------- | ---------------------------- |
| Farm             | 2 Wood          | 2 Wood, 1 Stone | 2 Wood, 2 Stone              |
| Forester Station | 2 Wood          | 3 Wood          | 3 Wood, 1 Lumber             |
| Mine             | 2 Wood, 1 Stone | 2 Wood, 2 Stone | 2 Wood, 2 Stone, 1 Steel     |
| Quarry           | 2 Stone         | 3 Stone         | 4 Stone                      |
| Mill             | 1 Wood, 1 Stone | 2 Wood, 1 Stone | 2 Wood, 2 Stone              |
| Furnace          | 2 Ore, 1 Wood   | 2 Ore, 2 Wood   | 2 Ore, 2 Wood, 1 Stone Brick |

### Foxes - Explorers & Defenders

#### A. Main action - **Explore**

- Draw **N** hex tiles (Base: 2). This value is tracked on the Fox Player Mat and can be upgraded via the Tech Tree.
- Place **M** hex tiles (Base: 1). This value is tracked on the Fox Player Mat and can be upgraded via the Tech Tree.
- Hex tiles may have a discovery bonus (a free action, some basic or composite resources, knowledge or insight, etc.); if so, the bonus is gained when the tile is placed. Discovery bonuses examples:
  - +1 Food
  - +1 Wood
  - +1 Insight
  - +1 Knowledge
  - Free Move
  - Free Fortification Level 1

*Note: When the tile deck runs out, shuffle the tile discard to make a new tile deck.*

#### B. Auxiliary action - **Scout**

- Draw X (starts at 1) event cards **keeping them in order** 
- Manipulate Y (starts at 0) event cards. The rest are returned in order to the top of the deck. Manipulation options are initially limited but may be expanded by Owl research to include:
  - Destroy the event out of the game
  - Put the event on the bottom of the deck
  - Reorder drawn events

#### Cleanup

- Place any unused hex tiles in the hex tile discard pile.
- Place any unused event cards in their original order back on top of the event deck.

#### Fox Buildings

| Building | Level 1 Cost | Level 2 Cost | Level 3 Cost | Description |
| --- | --- | --- | --- | --- |
| Walls | 2 Stone | 3 Stone | 4 Stone, 1 Stone Brick | provides protection against certain events for buildings within/behind walls (the amount of protection matches the level of the walls) |
| Scouting Camp | 2 Wood | 3 Wood | 3 Wood, 1 Lumber | increases exploration distance in a particular direction (can explore non-adjacent tiles in one direction up to a certain distance for the level of the watchtower) |
| Fortifications | 1 Wood, 1 Stone | 2 Wood, 2 Stone | 2 Lumber, 2 Stone Brick | provides protection for a single building (the amount of protection matches the level of the fortifications) |
| Magic Shield | 2 Ore | 2 Ore, 1 Steel | 2 Ore, 2 Steel | provides immunity against magic attacks for everything under it - size increases with level |
| Watchtower | 2 Wood, 1 Stone | 2 Lumber, 1 Stone | 3 Lumber, 2 Stone Brick | provides various bonuses/abilities for interacting with events |

### Owls - Researchers & Mages

#### A. Main action - **Research**

##### Concepts

- Research cards are split into 3 levels with a deck for each level.
- Research cards have a cost of 1-3 different resources with the amount of each resource cost increasing with the level of the research card.
- Research cards have graphical links that go to the edge of the cards that can connect to links on adjacent cards; links that are connected result in the player gaining the indicated amount of Knowledge or Insight.
- Knowledge is used for tech tree advancements and Insight is used for magic tree advancements. 

#### Action

- From the display of research cards, spend the necessary resources to buy research cards and place them orthogonally in a tableau up to the research limit such that the links on adjacent cards connect.
- When links are completed, the player gains the associated amount of Knowledge or Insight.

#### B. Auxiliary action - **Apply**

- Spend Knowledge/Insight from the tracks to unlock items on the tech or magic tree.

#### Cleanup

- Discard all remaining research cards.
- Refill the research card row back up to **N** cards (Base: 3). This value is tracked on the Owl Player Mat and can be upgraded via the Magic Tree.

#### Owl Buildings

| Building | Level 1 Cost | Level 2 Cost | Level 3 Cost | Description |
| --- | --- | --- | --- | --- |
| University | 2 Wood, 1 Stone | 3 Wood, 2 Stone | 2 Lumber, 2 Stone Brick | increases the number of research cards that are displayed each round by the building level (the number of research cards on display is equal to the sum of the level of all universities) |
| Library | 3 Wood | 4 Wood | 3 Lumber, 1 Steel | increases the research limit (which is the number of research cards allowed in the tableau) by the building level (the research limit is the sum of the level of all libraries) |
| Laboratory | 1 Stone, 1 Ore | 2 Stone, 1 Steel | 2 Stone Brick, 2 Steel | provides a discount of any N resources on tech research cards, where N is the building level (this discount sums up across multiple laboratories) |
| Maginarium | 1 Wood, 1 Ore | 2 Wood, 1 Steel | 2 Lumber, 2 Steel | provides a discount of any N resources on magic research cards, where N is the building level (this discount sums up across multiple maginariums) |

### Badgers - Leaders & Master Builders

Uses a worker placement board to perform the **Progress** action; starts with 1 worker and can gain up to 3 workers total over the course of a game.

#### A. Main action - **Progress**

Place as many workers as you have available to you on the worker placement board to perform various actions in service of constructing a shared project.

##### Board spaces

| Action              | Cost                              | Effect                                                                 |
| ------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| Construct Component | resource costs on component card  | Add to project                                                         |
| Train               | 2 Knowledge or 2 Insight          | +1 expertise level (max 5)                                             |
| Ensure Quality      | none                              | Roll X dice where X is your expertise level. Must meet card requirement (e.g., ≥12). |
| Install Component   | 2 workers                         | Install completed component                                            |
| Commission          | 2 workers + two main action cards | Win the game                                                           |

#### B. Auxiliary action - **Lead**

- Spend food to perform one of the special deckbuilding tasks:
  - Trash a card - 5 food
  - Upgrade an existing card - 8 food - equivalent to buying a new card and trashing a card; remove a card from your hand from the game and gain a new card from the card market
  - Increase hand limit by 1 - 10 food
- Spend 10 food to gain another worker for the **Progress** action

#### Cleanup

- Retrieve all workers from the worker placement board.

#### Badger Buildings

The Badgers' buildings are the shared projects. Typically construction is attempted for just one shared project in each play session. 

Each project has 3–5 components, each with:

- Resource cost
- Quality requirement (dice total from 6–20)

##### 1. Heart of the Wood

A living ancient core that stabilizes Havenwood’s magic.

| Component        | Cost                   | Quality |
| ---------------- | ---------------------- | ------- |
| Barkshell Casing | 3 Wood, 2 Stone        | 8       |
| Sapflow Channels | 2 Wood, 2 Lumber       | 10      |
| Spirit Conduit   | 2 Steel, 1 Stone Brick | 12      |
| Core Crystal     | 1 Steel, 2 Stone Brick | 14      |

##### 2. Skybridge Beacon

A massive signal tower that calls aid from distant allies.

| Component            | Cost                   | Quality |
| -------------------- | ---------------------- | ------- |
| Tower Frame          | 4 Wood, 2 Lumber       | 9       |
| Lens Array           | 2 Steel, 1 Stone       | 12      |
| Arcane Focusing Ring | 1 Steel, 2 Stone Brick | 13      |
| Beacon Flame         | 2 Lumber, 2 Steel      | 15      |

##### 3. Stoneweave Bastion

A defensive fortress providing peace and security.

| Component       | Cost                   | Quality |
| --------------- | ---------------------- | ------- |
| Foundation      | 4 Stone                | 10      |
| Ramparts        | 3 Stone, 1 Stone Brick | 12      |
| Inner Keep      | 2 Stone Brick, 1 Steel | 14      |
| Guardian Sigils | 2 Insight, 2 Steel     | 16      |

##### 4. Astral Observatory

Reveals the mysteries of the stars.

| Component        | Cost                   | Quality |
| ---------------- | ---------------------- | ------- |
| Observation Deck | 3 Wood, 2 Stone        | 8       |
| Star Mirror      | 1 Steel, 2 Stone Brick | 12      |
| Astral Lens      | 2 Steel                | 14      |
| Reality Anchor   | 2 Insight, 2 Lumber    | 16      |

##### 5. Riverheart Engine

A water-powered infrastructure project.

| Component       | Cost                   | Quality |
| --------------- | ---------------------- | ------- |
| Waterwheel      | 3 Wood, 1 Lumber       | 9       |
| Channelworks    | 2 Stone Brick, 1 Stone | 12      |
| Power Core      | 2 Steel, 1 Lumber      | 14      |
| Flow Regulator  | 1 Steel, 1 Stone Brick | 16      |
| Control Station | 1 Steel, 1 Insight     | 18      |

## 6. Tech and Magic Trees

The Owl House drives advancement through two distinct development trees. **Knowledge** is spent to advance the **Technology Tree** (focused on infrastructure, efficiency, and physics), while **Insight** is spent to advance the **Magic Tree** (focused on rule manipulation, event mitigation, and arcane defense).

### Technology Tree (Uses Knowledge)

The Technology Tree is the backbone of Havenwood's economy. It is primarily responsible for unlocking higher tiers of buildings for all houses.

#### Tier 1: Foundation

- **Basic Engineering**
  - **Cost:** 3 Knowledge
  - **Effect:** Unlocks **Level 2** for all **Production Buildings** (Squirrels) and **Research Buildings** (Owls).
  - **Prerequisite:** None

- **Logistics Network**
  - **Cost:** 2 Knowledge
  - **Effect:** Unlocks the Fox Scout ability: **Reorder** (Rearrange the top X event cards). **Fox Explore:** Draw +1 Tile (+1 N).
  - **Prerequisite:** None

#### Tier 2: Industrialization

- **Advanced Masonry**
  - **Cost:** 5 Knowledge
  - **Effect:** Unlocks **Level 2** for all **Fox Buildings** (Walls, Fortifications, etc.).
  - **Prerequisite:** Basic Engineering

- **Composite Refining**
  - **Cost:** 6 Knowledge
  - **Effect:** Unlocks **Level 3** for all **Production Buildings** (Squirrels) and **Research Buildings** (Owls).
  - **Prerequisite:** Basic Engineering

- **Heavy Infrastructure**
  - **Cost:** 5 Knowledge
  - **Effect:** Unlocks the Badgers' ability to construct **Phase 2 & 3** components of Shared Projects.
  - **Prerequisite:** Advanced Masonry

#### Tier 3: Mastery

- **Master Architecture**
  - **Cost:** 10 Knowledge
  - **Effect:** Unlocks **Level 3** for all **Fox Buildings**.
  - **Prerequisite:** Advanced Masonry AND Composite Refining

- **Automated Hauling**
  - **Cost:** 8 Knowledge
  - **Effect:** The "Move" action for all players costs 0 resources. **Fox Explore:** Place +1 Tile (+1 M).
  - **Prerequisite:** Logistics Network

### Magic Tree (Uses Insight)

The Magic Tree focuses on interacting with the Umbral Tempest, mitigating the Event Deck, and providing defensive buffs against arcane threats.

#### Tier 1: Awareness

- **Aetheric Sensing**
  - **Cost:** 3 Insight
  - **Effect:** Unlocks **Magic Shield Level 1** (Fox Building). **Owl Research:** Display +1 Card (+1 N).
  - **Prerequisite:** None

- **Fate Weaving**
  - **Cost:** 4 Insight
  - **Effect:** Unlocks the Fox Scout ability: **Bottom of Deck** (Move an event card to the bottom of the deck).
  - **Prerequisite:** None

#### Tier 2: Manipulation

- **Tempest Abjuration**
  - **Cost:** 6 Insight
  - **Effect:** Unlocks **Magic Shield Level 2 & 3** (Fox Building). **Owl Research:** Display +1 Card (+1 N).
  - **Prerequisite:** Aetheric Sensing

- **Banishment**
  - **Cost:** 7 Insight
  - **Effect:** Unlocks the Fox Scout ability: **Destroy Event** (Remove an event card from the game completely).
  - **Prerequisite:** Fate Weaving

#### Tier 3: Transcendance

- **Chronomancy**
  - **Cost:** 10 Insight
  - **Effect:** Once per round, the Badgers may re-roll any number of dice during an "Ensure Quality" check on a Shared Project.
  - **Prerequisite:** Banishment

- **Umbral Resistance**
  - **Cost:** 12 Insight
  - **Effect:** The maximum hand limit for all players is increased by +1.
  - **Prerequisite:** Tempest Abjuration

## 7. Events

The Event Deck represents the encroaching **Umbral Tempest** and the natural dangers of the wild. As the game progresses, the frequency and severity of these events increase based on the **Threat Track**.

### Event Deck Structure

The Event Deck is constructed at the start of the game using a ratio of **Standard Events** and **Storm Cards**.

- **Standard Events**: Natural disasters or enemy movements that target specific resources or biomes.
- **Storm Cards**: Direct advancements of the magical corruption that accelerates the end of the game.

### Threat Track Progression

The Threat Track determines how many event cards are drawn during the Event Phase. It has **15 spaces** total.

- **Spaces 1–6:** Draw 1 Event Card
- **Spaces 7–12:** Draw 2 Event Cards
- **Spaces 13–14:** Draw 3 Event Cards
- **Space 15:** **Storm Climax** (Immediate Loss)

### Event Card Anatomy

1. **Title**: The name of the threat.
2. **Type**:
    - *Natural*: Weather or environmental hazards (can often be mitigated by specific buildings).
    - *Hostile*: Enemy incursions (tested against Walls/Fortifications).
    - *Arcane*: Magical anomalies (often require Insight/Knowledge to dispel).
3. **Target**: The specific Hex Environment (e.g., Forest), Building Type (e.g., Mines), or House affected.
4. **Effect**: The penalty incurred if the event is not negated.
5. **Storm Value**: The amount the Storm Track advances if this event is unresolved (usually 0 for Natural/Hostile events, 1+ for Arcane cards).

### Event Resolution Phases

Events are drawn during step 5 of the Shared Deck Action System.

#### Phase 1: Vulnerability Check

Check the **Hex Tile Map**. The event only triggers if a player occupies a Hex tile matching the **Target** environment.

- *Example:* A "Landslide" event targets **Mountain** hexes. If no player has a building on a Mountain hex, the event is discarded with no effect.

#### Phase 2: Defense & Mitigation

Players may use House abilities or Buildings to mitigate the event:

- **Fox Walls/Fortifications**: If the target is behind Walls (or Fortified), compare the **Event Severity** (1–3) against the **Wall Level**. If Wall Level ≥ Severity, the event is ignored.
- **Magic Shield (Foxes)**: Negates *Arcane* type events completely for protected tiles.
- **Effect Triggers**: If undefended, the effect resolves immediately.

#### Phase 3: The Storm Track

If the event was a **Storm Card**, move the marker on the Storm Track forward by 1. If the marker reaches the final space, the players lose immediately.

---

### Sample Event List

#### Natural Events (Environment Specific)

| Event Title | Target | Severity | Effect |
| :--- | :--- | :--- | :--- |
| **Flash Flood** | Plains / River | 1 | Discard 2 Food or destroy 1 Farm on a Plains tile. |
| **Root Rot** | Forest | 1 | Production of Wood is halved (rounded down) for the next round. |
| **Cave-In** | Mountain | 2 | **Blocked:** Place a "Blocked" token on one Mine. It produces nothing until a player spends an Action to clear it. |
| **Blighted Crops** | Plains | 2 | Destroy 1 Farm level 1. If a Level 2+ Farm exists, downgrade it by one level instead. |
| **Deep Freeze** | Global | 3 | All players must discard 1 card from their hand immediately. |

#### Hostile Events (Defense Tests)

| Event Title | Target | Severity | Effect |
| :--- | :--- | :--- | :--- |
| **Kobold Scavengers**| Storage | 1 | Lose 3 basic resources of the team's choice. **Fox Walls** prevent this. |
| **Siege Engine** | Any Building | 3 | Destroy one building on the outermost edge of the map. **Fortifications** (Lvl 2+) prevent this. |
| **Supply Ambush** | Roads | 2 | Players cannot pass cards to neighbors during the next round. |

#### Arcane Events (The Umbral Tempest)

| Event Title | Target | Storm Value | Effect |
| :--- | :--- | :--- | :--- |
| **Mana Surge** | Global | +1 | All Owl Research costs increase by 1 resource this round. |
| **Reality Fracture**| Magic Track | +1 | Lose 2 Insight or move the Storm Track an additional +1 step. |
| **The Umbral Eye** | Fox House | +2 | The Fox player must shuffle 2 "Fear" cards (useless junk cards) into their deck. |
| **Tempest Howl** | Global | +1 | **Silence:** No players may communicate verbally during the next Strategy Phase. |

## 8. Loss Conditions

Players lose if **any one** of the following occurs:

1. The **Storm Track** reaches the end.
1. Any house has all its buildings destroyed.
1. The event deck runs out.

## 9. Win Condition

Complete **one** shared project **before** any loss condition occurs.

## 10. Component List

### Cards

- **Shared Action Deck** (~80 cards)
  - Starter Cards (Basic actions/resources)
  - Market Cards (Advanced actions, improved efficiencies)
- **Squirrel Production Deck** (~20 cards)
  - Production Cards (1, 2, or 3 output)
  - Gear Fragment Cards (Half-bust)
- **Event Deck** (~40 cards)
  - Standard Events (Natural, Hostile)
  - Storm Cards (Arcane/Tempest advancement)
  - Fear Cards (Negative status cards)
- **Research Cards** (Owl House)
  - Level 1 Research Deck (~20 cards)
  - Level 2 Research Deck (~20 cards)
  - Level 3 Research Deck (~20 cards)
- **Project Component Cards**
  - Cards representing components for the 5 Shared Projects (4-5 cards per project)

### Tiles

- **Hex Map Tiles** (~40 tiles)
  - Environments: Plains, Forest, Mountain, River
  - Starting Tile (Central Havenwood)

### Boards & Mats

- **House Player Mats** (4 total)
  - Squirrel (Harvester) Mat
  - Fox (Explorer) Mat
  - Owl (Researcher) Mat
  - Badger (Architect) Mat
- **Badger Worker Placement Board**
- **Tech & Magic Tree Board** (Tracks for Knowledge/Insight and unlock slots)
- **Threat/Storm Track Board**

### Tokens & Markers

- **Resources** (Wooden bits or tokens)
  - Food (Yellow)
  - Wood (Brown)
  - Ore (Grey)
  - Stone (Dark Grey)
  - Lumber (Processed Wood)
  - Steel (Processed Ore)
  - Stone Brick (Processed Stone)
- **House Markers**
  - Badger Workers (3 Meeples)
  - Fox Wall/Fortification Tokens (Stackable or numbered 1-3)
  - Magic Shield Tokens
  - "Blocked" Tokens (for Mines)
- **Trackers**
  - Knowledge Tracker Cube
  - Insight Tracker Cube
  - Storm/Threat Level Marker
  - Round/Turn Marker

### Buildings (Miniatures, Standees, or Tokens)

- **Squirrel Buildings**: Farm, Forester Station, Mine, Quarry, Mill, Furnace (Levels 1-3 indicated by base or token)
- **Fox Buildings**: Scouting Camp, Watchtower (Levels 1-3)
- **Owl Buildings**: University, Library, Laboratory, Maginarium (Levels 1-3)
- **Shared Project Models**: 5 unique models (optional, or represented by cards/tiles)

### Dice

- **Harvest Dice** (Custom d6s for Squirrels)
  - Faces: 1 Resource, 2 Resources, 3 Resources, Bust (x2?), Blank?
  - Quantity: ~10 dice
- **Quality Dice** (Standard d6s for Badgers)
  - Quantity: 6 dice

## 11. Full Event List

### Natural Events (16 Cards)

| Title | Target | Severity | Effect | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Flash Flood** | Plains / River | 1 | Discard 2 Food or destroy 1 Farm on a Plains tile. | 2 |
| **Root Rot** | Forest | 1 | Production of Wood is halved (rounded down) for the next round. | 2 |
| **Cave-In** | Mountain | 2 | **Blocked:** Place a "Blocked" token on one Mine. It produces nothing until a player spends an Action to clear it. | 2 |
| **Blighted Crops** | Plains | 2 | Destroy 1 Farm level 1. If a Level 2+ Farm exists, downgrade it by one level instead. | 2 |
| **Deep Freeze** | Global | 3 | All players must discard 1 card from their hand immediately. | 1 |
| **Wildfire** | Forest | 2 | Destroy 1 Forester Station. If adjacent to another Forest, spread to that tile (destroying buildings there too) unless 2 Food (Water) spent to extinguish. | 1 |
| **Tremors** | Mountain | 1 | All Stone production reduced by 1 per Quarry this round. | 2 |
| **Drought** | Plains | 1 | Food production cost increases: Must spend 1 Wood to harvest Food this round. | 2 |
| **Pestilence** | Global | 2 | Each player must trash 1 card from their hand or discard 2 cards. | 1 |
| **Heavy Fog** | Global | 1 | Exploration action costs +1 Resource this round. | 1 |

### Hostile Events (10 Cards)

| Title | Target | Severity | Effect | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Kobold Scavengers** | Storage | 1 | Lose 3 basic resources of the team's choice. **Fox Walls** prevent this. | 3 |
| **Siege Engine** | Any Building | 3 | Destroy one building on the outermost edge of the map. **Fortifications** (Lvl 2+) prevent this. | 1 |
| **Supply Ambush** | Roads | 2 | Players cannot pass cards to neighbors during the next round. | 2 |
| **Goblin Raiders** | Outskirts | 1 | Steal 1 random card from each player's hand. **Fox Walls** prevent this. | 2 |
| **Bandit Camp** | Hex Tile | 2 | Place a Bandit Token on a random empty hex. No building can be built there until a "Move" action is used to clear it (Cost: 3 Resources). | 2 |

### Arcane / Storm Events (14 Cards)

| Title | Target | Storm Value | Effect | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Mana Surge** | Global | +1 | All Owl Research costs increase by 1 resource this round. | 2 |
| **Reality Fracture** | Magic Track | +1 | Lose 2 Insight or move the Storm Track an additional +1 step. | 2 |
| **The Umbral Eye** | Fox House | +2 | The Fox player must shuffle 2 "Fear" cards (useless junk cards) into their deck. | 1 |
| **Tempest Howl** | Global | +1 | **Silence:** No players may communicate verbally during the next Strategy Phase. | 1 |
| **Arcane Feedback** | Owl House | +1 | Owl player must discard 1 card for every 2 Research cards they have in their tableau. | 2 |
| **Time Dilation** | Badger House | +1 | Badgers have -1 Worker this round. | 1 |
| **Resource Decay** | Storage | +1 | All stored Basic Resources are reduced by half (rounded up). | 1 |
| **Shadow Walkers** | Global | +2 | Hostile Events this round have +1 Severity. | 1 |
| **Void Whispers** | Global | +1 | Players cannot draw cards from card effects this round. | 1 |
| **The Darkening** | Global | +2 | Reveal the next 2 events immediately. Resolve them both. | 1 |
| **Storm Climax** | Global | +3 | **CRITICAL:** If not cancelled by spending 10 Insight, the game ends immediately (Loss). | 1 |

## 12. Hex Tile List

### Starting Tile (1 Tile)

| Environment | Count | Natural Resources | Discovery Bonus | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Central Havenwood** | 1 | None (Safe Zone) | None | Starting location for all Houses. Cannot be destroyed. |

### Exploration Tiles (39 Tiles)

| Environment | Count | Buildings Allowed | Discovery Bonus |
| :--- | :--- | :--- | :--- |
| **Plains** | 5 | Farm, Mine, Quarry | +1 Food |
| **Plains** | 4 | Farm, Mine, Quarry | +1 Wood |
| **Plains** | 3 | Farm, Mine, Quarry | Free Move Action |
| **Forest** | 5 | Forester Station | +1 Wood |
| **Forest** | 4 | Forester Station | +1 Food |
| **Forest** | 3 | Forester Station | +1 Insight |
| **Mountain** | 4 | Mine, Quarry | +1 Stone |
| **Mountain** | 3 | Mine, Quarry | +1 Ore |
| **Mountain** | 1 | Mine, Quarry | +1 Knowledge |
| **River** | 3 | Farm | +1 Food |
| **River** | 2 | Farm | +1 Insight |
| **River** | 2 | Farm | Free Fortification (Lvl 1) |

## 13. Shared Action Deck List

### Starter Cards (40 Cards - 10 per Player)

Each player starts with an identical deck of 10 cards.

| Card Name | Count | Action Effect |
| :--- | :--- | :--- |
| **Build** | 2 | Perform a **Build** action. | The market always contains **5 face-up cards**. When a card is bought, immediately refill the slot from the deck.
| **Move (Level 1)** | 1 | **Move**. Move up to 1 space. |
| **Move (Level 2)** | 1 | **Move**. Move up to 2 spaces. |
| **Buy Card** | 2 | Perform a **Buy Card** action. |
| **Main Action** | 2 | Perform your House's **Main Action**. |
| **Auxiliary Action** | 2 | Perform your House's **Auxiliary Action**. |

### Market Cards (40 Cards)

These cards are available for purchase from a shared market row.

#### Tier 1: Improved Efficiency (Cost: 3-5 Food)

| Card Name | Cost | Count | Action Effect |
| :--- | :--- | :--- | :--- |
| **Master Builder** | 4 | 4 | **Build**. If you build, the cost is reduced by 1 Basic Resource of your choice. |
| **Forced March** | 3 | 4 | **Move**. Move up to 3 spaces. |
| **Wholesale** | 4 | 4 | **Buy Card**. Gain 2 Food before buying. |
| **Veteran's Command** | 5 | 3 | **Main Action**. Treat your relevant building level as +1 for this action. |
| **Field Logistics** | 5 | 3 | **Auxiliary Action**. Draw 1 card after performing the action. |

#### Tier 2: Versatility & Power (Cost: 6-8 Food)

| Card Name | Cost | Count | Action Effect |
| :--- | :--- | :--- | :--- |
| **Double Duty** | 7 | 3 | Perform **two different** actions: Build, Move (up to 2 spaces), or Buy Card. |
| **Improvise** | 6 | 3 | Copy the action of a card played by a neighbor this round. |
| **Reinforce** | 6 | 3 | **Build**. You may build/upgrade even if you are not on the tile (must be adjacent). |
| **Expedition** | 7 | 3 | **Move**. Move up to 5 spaces. |
| **Grand Maneuver** | 8 | 2 | **Main Action**. You may perform this action twice. |

#### Tier 3: Mastery (Cost: 9+ Food)

| Card Name | Cost | Count | Action Effect |
| :--- | :--- | :--- | :--- |
| **Omnipotence** | 10 | 2 | Perform **any** one action (Build, Move up to 6 spaces, Buy, Main, or Aux). Then draw 1 card. |
| **Heroic Inspiration** | 10 | 2 | **Main Action**. All other players may immediately draw 1 card. |
| **Time Warp** | 11 | 2 | **Auxiliary Action**. Take another turn immediately after this one (play 1 card only). |
| **Unified Front** | 9 | 2 | **Buy Card**. The card you buy goes directly into your hand. |
| **Architect's Dream** | 9 | 2 | **Build**. This build costs 0 Resources (Level 1 or 2 only). |

## 14. Squirrel Production Deck List

The Squirrel House uses this deck for their **Produce** Auxiliary Action.

| Card Type | Count | Effect |
| :--- | :--- | :--- |
| **1 Output** | 8 | Adds 1 to production limit. |
| **2 Output** | 6 | Adds 2 to production limit. |
| **3 Output** | 2 | Adds 3 to production limit. |
| **Gear Fragment** | 4 | **Half-Bust**. If two are drawn, production busts (limit becomes 1). |

## 15. Owl Research Deck List

The Owl House uses these cards for their **Research** Main Action. Links are represented by connections on the card edges (Top, Bottom, Left, Right).

### Level 1 Research Deck (20 Cards)

| Card Name | Cost | Links | Reward (on completion) | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Basic Physics** | 1 Wood | Top, Bottom | 1 Knowledge | 4 |
| **Simple Geometry** | 1 Stone | Left, Right | 1 Knowledge | 4 |
| **Minor Cantrip** | 1 Food | Top, Right | 1 Insight | 4 |
| **Nature Study** | 1 Wood | Bottom, Left | 1 Insight | 4 |
| **Star Chart** | 1 Ore | Top, Left | 1 Knowledge | 2 |
| **Herbology** | 1 Food | Bottom, Right | 1 Insight | 2 |

### Level 2 Research Deck (20 Cards)

| Card Name | Cost | Links | Reward (on completion) | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Advanced Algebra** | 1 Wood, 1 Stone | Top, Bottom, Left | 2 Knowledge | 4 |
| **Material Science** | 1 Ore, 1 Stone | Top, Bottom, Right | 2 Knowledge | 4 |
| **Elemental Theory** | 1 Wood, 1 Food | Left, Right, Top | 2 Insight | 4 |
| **Arcane Flow** | 1 Ore, 1 Food | Left, Right, Bottom | 2 Insight | 4 |
| **Structural Analysis** | 2 Stone | All 4 Sides | 2 Knowledge | 2 |
| **Spirit Whispers** | 2 Wood | All 4 Sides | 2 Insight | 2 |

### Level 3 Research Deck (20 Cards)

| Card Name | Cost | Links | Reward (on completion) | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Quantum Mechanics** | 1 Lumber, 1 Steel | Top, Bottom | 3 Knowledge | 4 |
| **Metaphysics** | 1 Stone Brick, 1 Steel | Left, Right | 3 Knowledge | 4 |
| **Void Manipulation** | 1 Lumber, 1 Stone Brick | Top, Right, Bottom | 3 Insight | 4 |
| **Time Weaving** | 2 Steel | Left, Top, Right | 3 Insight | 4 |
| **Unified Theory** | 1 of each Composite | All 4 Sides | 4 Knowledge | 2 |
| **Ascension** | 1 of each Composite | All 4 Sides | 4 Insight | 2 |

## 16. Miscellaneous Cards

### Fear Cards (10 Cards)

These cards are added to player decks by specific Events or effects.

| Card Name | Count | Effect |
| :--- | :--- | :--- |
| **Fear** | 10 | **Unplayable.** Cannot be played for any action. Takes up hand space. Can be trashed using the Badger's **Lead** action or specific card effects. |

### Project Component Cards (22 Cards)

These cards represent the physical components needed for the Shared Projects.

| Project | Component Name | Cost | Quality Req. |
| :--- | :--- | :--- | :--- |
| **Heart of the Wood** | Barkshell Casing | 3 Wood, 2 Stone | 8 |
| | Sapflow Channels | 2 Wood, 2 Lumber | 10 |
| | Spirit Conduit | 2 Steel, 1 Stone Brick | 12 |
| | Core Crystal | 1 Steel, 2 Stone Brick | 14 |
| **Skybridge Beacon** | Tower Frame | 4 Wood, 2 Lumber | 9 |
| | Lens Array | 2 Steel, 1 Stone | 12 |
| | Arcane Focusing Ring | 1 Steel, 2 Stone Brick | 13 |
| | Beacon Flame | 2 Lumber, 2 Steel | 15 |
| **Stoneweave Bastion** | Foundation | 4 Stone | 10 |
| | Ramparts | 3 Stone, 1 Stone Brick | 12 |
| | Inner Keep | 2 Stone Brick, 1 Steel | 14 |
| | Guardian Sigils | 2 Insight, 2 Steel | 16 |
| **Astral Observatory** | Observation Deck | 3 Wood, 2 Stone | 8 |
| | Star Mirror | 1 Steel, 2 Stone Brick | 12 |
| | Astral Lens | 2 Steel | 14 |
| | Reality Anchor | 2 Insight, 2 Lumber | 16 |
| **Riverheart Engine** | Waterwheel | 3 Wood, 1 Lumber | 9 |
| | Channelworks | 2 Stone Brick, 1 Stone | 12 |
| | Power Core | 2 Steel, 1 Lumber | 14 |
| | Flow Regulator | 1 Steel, 1 Stone Brick | 16 |
| | Control Station | 1 Steel, 1 Insight | 18 |

## To-Do List

- Physical prototype:
  - [x] Generate a full component list
  - [x] Generate a full list of event cards with all their effects
  - [x] Generate a full list of hex tiles with discovery bonuses, environment, resources available, etc.
  - [x] Generate a full list of all shared deck cards, including the starter cards and all purchasable cards
  - [ ] Generate a rulebook that someone who has no knowledge of the game can use to learn to play the game from
- [x] Ensure the design document is fully consistent with itself and has no missing details or loose ends.