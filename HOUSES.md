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
  3. Houses simultaneously choose and play actions using:
     - Build
     - Move
     - Buy Card
     - **Main Action** (unique per house)
     - **Auxiliary Action** (unique per house)
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

- Draw N hex tiles
- Place M hex tiles. 
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
- Refill the research card row back up to N cards.

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
  - **Effect:** Unlocks the Fox Scout ability: **Reorder** (Rearrange the top X event cards).
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
  - **Effect:** The "Move" action for all players costs 0 resources.
  - **Prerequisite:** Logistics Network

### Magic Tree (Uses Insight)

The Magic Tree focuses on interacting with the Umbral Tempest, mitigating the Event Deck, and providing defensive buffs against arcane threats.

#### Tier 1: Awareness

- **Aetheric Sensing**
  - **Cost:** 3 Insight
  - **Effect:** Unlocks **Magic Shield Level 1** (Fox Building).
  - **Prerequisite:** None

- **Fate Weaving**
  - **Cost:** 4 Insight
  - **Effect:** Unlocks the Fox Scout ability: **Bottom of Deck** (Move an event card to the bottom of the deck).
  - **Prerequisite:** None

#### Tier 2: Manipulation

- **Tempest Abjuration**
  - **Cost:** 6 Insight
  - **Effect:** Unlocks **Magic Shield Level 2 & 3** (Fox Building).
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

## To-Do List

- Ensure the design document is fully consistent with itself and has no missing details or loose ends.
- Physical prototype:
  - Generate a full component list
  - Generate a full list of event cards with all their effects
  - Generate a full list of hex tiles with discovery bonuses, environment, resources available, etc.
  - Generate a full list of all shared deck cards, including the starter cards and all purchasable cards
  - Generate a rulebook that someone who has no knowledge of the game can use to learn to play the game from