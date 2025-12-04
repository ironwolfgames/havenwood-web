# Houses of Havenwood — Game Design Document

## 1. Theme & Background

In the ancient woodland realm of **Havenwood**, four great anthropomorphic animal houses live in peaceful harmony. For centuries, they have protected the forest from natural threats, magical anomalies, and the encroaching ambitions of unseen enemies. But now, a **magical storm known as the Umbral Tempest** begins sweeping through the land, warping creatures, corrupting the wilds, and threatening the heart of Havenwood itself.

Only through cooperation can the four houses—**Squirrels (Harvesters), Foxes (Explorers), Owls (Researchers), and Badgers (Architects)**—combine their unique strengths to survive the storm, repel outside forces, and complete a monumental shared project needed to save Havenwood.

“Houses of Havenwood” is a cooperative, asymmetric euro-style game where each player controls one house and must use their distinct abilities to support the others in a shared struggle against time, threats, and escalating magical chaos.

## 2. Shared Systems Overview

### **Shared Deck Action System**

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

- Walls - provides protection against certain events for buildings within/behind walls (the amount of protection matches the level of the walls)
- Scouting Camp - increases exploration distance in a particular direction (can explore non-adjacent tiles in one direction up to a certain distance for the level of the watchtower)
- Fortifications (can be used on existing buildings) - provides protection for a single building (the amount of protection matches the level of the fortifications)
- Magic Shield - provides immunity against magic attacks for everything under it - size increases with level
- Watchtower - provides various bonuses/abilities for interacting with events

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

- University - increases the number of research cards that are displayed each round by the building level (the number of research cards on display is equal to the sum of the level of all universities)
- Library - increases the research limit (which is the number of research cards allowed in the tableau) by the building level (the research limit is the sum of the level of all libraries)
- Laboratory - provides a discount of any N resources on tech research cards, where N is the building level (this discount sums up across multiple laboratories)
- Maginarium - provides a discount of any N resources on magic research cards, where N is the building level (this discount sums up across multiple maginariums)

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

### Technology Tree

### Magic Track

## 7. Events

## 8. Loss Conditions

Players lose if **any one** of the following occurs:

1. The **Storm Track** reaches the end.
1. Any house has all its buildings destroyed.
1. The event deck runs out.

## 9. Win Condition

Complete **one** shared project **before** any loss condition occurs.
