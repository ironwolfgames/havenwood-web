# Houses of Havenwood — Game Design Document

## 1. Theme & Background

In the ancient woodland realm of **Havenwood**, four great anthropomorphic animal houses coexist in fragile harmony. For centuries, they have protected the forest from natural threats, magical anomalies, and the encroaching ambitions of unseen enemies. But now, a **magical storm known as the Umbral Tempest** begins sweeping through the land, warping creatures, corrupting the wilds, and threatening the Heart of the Forest itself.

Only through cooperation can the four houses—**Squirrels (Harvesters), Foxes (Explorers), Owls (Researchers), and Badgers (Architects)**—combine their unique strengths to survive the storm, repel outside forces, and complete a monumental shared project needed to save Havenwood.

“Houses of Havenwood” is a cooperative, asymmetric euro-style game where each player controls one house and must use their distinct subsystem to support the others in a shared struggle against time, threats, and escalating magical chaos.

---

## 2. Shared Systems Overview

### **Shared Deck Action System**
- All houses draw from **one shared action deck**, collaboratively improved via deckbuilding.
- Each round:
  1. Draw to **hand limit** (start: 5).
  2. Each house **passes one card** to a neighbor.
  3. Houses simultaneously choose and play actions using:
     - Build
     - Move
     - Buy Card
     - **Main Action** (unique per house)
     - **Auxiliary Action** (unique per house)

### **Hex Tile Map**
- Modular hex map; foxes explore to add new tiles.
- Buildings: max **one** per hex.
- Each hex has:
  - **Environment type**
  - **Natural resources**
  - **Event vulnerability** (varies by environment)

---

## 3. Resources

### **Basic Resources (harvested by Squirrels)**
| Resource | Source Environment | Usage |
|---------|--------------------|-------|
| **Wood** | Forest | Building basic structures, defensive towers, research components. |
| **Stone** | Mountains | Strong buildings, walls, shared project components. |
| **Clay** | Riverbanks / Wetlands | Upgrading buildings, spell catalysts. |
| **Herbs** | Plains / Meadows | Research, magic discovery, healing. |
| **Ore** | Mountains | Advanced construction, magical artifacts. |
| **Fruits/Nuts** | Forest | Feed workers (Badgers), fuel Owl spell activations. |

### **Combined / Refined Resources**
| Composite | Made From | Used For |
|----------|-----------|-----------|
| **Timber** | Wood + Stone | Stronger buildings, advanced structures. |
| **Steel** | Ore + Wood | Shared project construction, heavy defenses. |
| **Potion Base** | Herbs + Clay | Magic discovery checks, countering event effects. |
| **Runestones** | Ore + Herbs | Owl technology & ritual completion. |
| **Food Stores** | Fruits/Nuts + Herbs | Feeding Badger workers to reset worker board. |

---

## 4. Hex Environments

| Environment | Resources Provided | Special Notes |
|-------------|--------------------|---------------|
| **Forest** | Wood, Fruits/Nuts | Vulnerable to fire events. |
| **Mountains** | Stone, Ore | Hard to traverse; defensive advantage. |
| **Plains** | Herbs | Common target of enemy incursions. |
| **Swamp** | Clay, Herbs | Some events more severe here. |
| **Snowfield** | Stone | Movement costs +1. |
| **River** | Clay, Food | Enables certain Owl rituals. |
| **Coast/Ocean** | None (special) | Unique events; no building allowed. |

---

## 5. House Subsystems

---

## **A. The Squirrels — Harvesters & Producers**

### **Subsystem: Push-Your-Luck Harvesting**
- Roll dice equal to building level.
- Faces include:
  - Resource symbols (Wood/Stone/etc.)
  - Double-resource symbols
  - **Bust** (Cannot reroll these dice; 3 busts ends harvest with 50% penalty)

### **Main Action (Harvest)**
- **Base:** Roll 2 dice.
- **Tier I upgrade:** Roll 3 dice.
- **Tier II:** Spend 1 Food to reroll 1 bust.
- **Tier III:** Convert two identical harvest symbols into a composite resource.

### **Auxiliary Action (Produce)**
- Draw production cards; stop when bust appears.
- Symbols on cards combine into:
  - Composite resources
  - Extra build actions
  - Bonus research tokens (for Owls)

### **Squirrel Buildings**
| Building | Effect |
|----------|---------|
| **Gathering Hut** | Roll +1 die, stores 1 resource. |
| **Granary** | Produces Food Stores. |
| **Mill** | Converts Wood + Stone → Timber. |
| **Foundry** | Converts Ore + Wood → Steel. |
| **Grove of Plenty** | Improves push‑your‑luck odds (removes 1 bust per round). |

---

## **B. The Foxes — Explorers & Defenders**

### **Subsystem: Tile Drafting & Event Deck Manipulation**

### **Main Action (Explore)**
- **Base:** Draw **N=1** tile, place **M=1**.
- **Tier I:** N+1 tiles.  
- **Tier II:** M+1 placement.  
- **Tier III:** Choose to discard 1 drawn tile for a global bonus.

### **Auxiliary Action (Scout Events)**
- Draw **A** event cards, manipulate **B**:
  - Reveal early
  - Swap order
  - Place on bottom
  - Delay or escalate

**Upgrades**:  
- **A +1** per tier; **B increases every second tier**.

### **Fox Buildings**
| Building | Effect |
|----------|---------|
| **Watchtower** | Defends 1 adjacent tile from early threats. |
| **Wall Segment** | Prevents structure damage on that tile. |
| **Ranger Den** | Grants movement bonuses. |
| **Scout Post** | A+1 when built. |
| **Beacon** | Allows global emergency event reordering once per round. |

---

## **C. The Owls — Researchers & Mages**

### **Subsystem: Pattern‑Matching Tableau (Card Edges)**
Owls draw and place cards with edges showing:
- Arcane Lines
- Nature Glyphs
- Rune Clusters

Matching edges trigger progress on two tracks:
- **Technology**
- **Magic**

### **Main Action (Discover)**
- Draw 2 cards, place 1.
- **Upgrades** increase:
  - Cards drawn
  - Cards placed
  - Ability to rotate cards

### **Auxiliary Action (Research)**
- Spend Herbs, Runestones, or Potion Bases to advance on tech/magic tracks.

### **Owl Buildings**
| Building | Effect |
|----------|---------|
| **Study Tower** | +1 discover draw. |
| **Library** | Store 1 unplaced card for later. |
| **Crystal Lab** | Produce Potion Base. |
| **Runeforge** | Produce Runestones. |
| **Astrarium** | Counts as 2 matching edges for rituals (late‑game). |

---

## **D. The Badgers — Architects & Master Builders**

### **Subsystem: Worker Placement Board**
Badgers place limited workers to activate:
- Architect building for any house
- Build shared project components
- Improve shared deck limits
- Trash cards
- Build/enhance Squirrel, Fox, or Owl buildings

### **Main Action (Architect)**
- Choose blueprint (unlocked via owl research).
- Spend resources to create building schema.

Upgrades:
- **Unlock more worker slots**
- **Reduce resource costs**
- **Architect multiple blueprints per turn**

### **Auxiliary Action (Construct)**
- Build a schema on the map.
- Upgrade:
  - Extra buildings per round
  - Build without moving
  - Repair for free

---

## 6. Technologies & Magic Tracks (Owls)

### **Technology Track**
| Tier | Technology | Effect |
|-------|------------|---------|
| I | Reinforced Frames | Buildings gain +1 HP. |
| II | Efficient Tools | Squirrels roll +1 harvest die. |
| III | Crystal Focusing | Badgers reduce blueprint costs by 1 resource. |
| IV | Arcane Barriers | Fox defenses count as +1 against storms. |
| V | Synergy Core | Prevents one loss condition per game. |

### **Magic Track**
| Tier | Magic | Effect |
|-------|--------|--------|
| I | Light Glyphs | Reveal 1 extra event when scouting. |
| II | Binding Runes | Prevent enemy movement for 1 round. |
| III | Stormweaving | Reduce storm power globally by 1. |
| IV | Leyline Surge | Perform any main action again. |
| V | Heartspell | Required for main shared project. |

---

## 7. Events

### **Event Types**
- **Natural Threats:** Fire, flood, storm surge.
- **Corrupted Creatures:** Attack explored tiles.
- **Umbral Storm:** Global penalties; grows stronger over time.
- **Blights:** Remove resources from stores.
- **Hex Maladies:** Building HP loss or temporary tile shutdown.

### **Event Effects**
Examples:
- “Forest Fire”: Forest tiles lose 1 HP from buildings.
- “Rockslide”: Mountain tile impassable.
- “Scouting Echo”: Next two events execute together.
- “Umbral Pulsation”: Increase storm track by 1; reveal additional event.

---

## 8. Lose Conditions

Players lose if **any one** of the following occurs:
1. **Storm Track** reaches the end.
2. **Three buildings** are destroyed.
3. **All players' workers/pieces** are displaced by an Umbral Wave.
4. **Shared project cannot be completed** before final storm surge.
5. The event deck runs out.

---

## 9. Shared Projects (Only one required to win)

| Project | Requirements | Effect |
|---------|--------------|--------|
| **Heart of Havenwood** | Heartspell + Steel + Timber + Runestones | Permanently seals the Umbral Storm. |
| **Aegis Spire** | Steel ×4 + Technology IV | Generates barrier protecting all tiles from all final events. |
| **The Beacon of Dawn** | Potion Base ×3 + Magic III | Cancels last 3 events. |
| **Worldroot Conduit** | Timber ×3 + Crystal Lab + Runestone ×3 | Channels leyline energy to stabilize the forest. |

---

## 10. Win Condition
Complete **one** shared project **before** any lose condition triggers.

---

## END OF DOCUMENT
