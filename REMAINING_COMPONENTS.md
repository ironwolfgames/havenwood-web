# Houses of Havenwood — Remaining Components

This document details all components that still need to be created to complete either a **Tabletop Simulator (TTS) mod** or a **physical prototype** for Houses of Havenwood.

## ✅ Completed Components

The following card decks have been fully created with CSV data and JSON configurations:

- **Shared Action Deck** (80 cards: 40 starter + 40 market)
- **Event Deck** (40 cards: Natural, Hostile, Aether events)
- **Production Deck** (20 cards: Squirrel push-your-luck)
- **Research Deck** (60 cards: Owl research with links, 3 levels)
- **Great Works Components** (22 cards: Badger project components)
- **Reference Cards** (faction-specific player aids)
- **Deck Backs** (card back designs)

---

## 🎯 Outstanding Components

### 1. Player Mats (4 Required)

Player mats serve as reference boards and organizers for each house. Each mat needs:

#### A. Squirrel Player Mat

**Dimensions:** 11" × 8.5" (landscape orientation)

**Required Elements:**

1. **House Identity Section** (Top, 20% of height)
   - House name: "Forest Squirrels — Harvesters & Producers"
   - House icon/logo (large, centered or left)
   - Flavor text: "Masters of the harvest, weathering fortune's whims"

2. **Building Cost Reference** (Left side, 60% of width)
   - Table format showing all 6 Squirrel buildings
   - Three columns for Level 1/2/3 costs
   - Buildings:
     - Farm: 2 Wd → 2 Wd, 1 St → 2 Wd, 2 St
     - Forester Station: 2 Wd → 3 Wd → 3 Wd, 1 Lbr
     - Mine: 2 Wd, 1 St → 2 Wd, 2 St → 2 Wd, 2 St, 1 Stl
     - Quarry: 2 St → 3 St → 4 St
     - Mill: 1 Wd, 1 St → 2 Wd, 1 St → 2 Wd, 2 St
     - Furnace: 2 Ore, 1 Wd → 2 Ore, 2 Wd → 2 Ore, 2 Wd, 1 SB

3. **Action Summary** (Right side, 40% of width)
   - **Main Action: Harvest**
     - Icon: Dice
     - Description: "Roll N dice per building (N = level). Lock non-bust dice. Reroll or stop. Gain total value of locked dice."
     - Dice faces: 1, 2, 3, Bust, Bust, Blank
   
   - **Auxiliary Action: Produce**
     - Icon: Gears/cogs
     - Description: "Draw cards one at a time (limit: 5/7/10 for levels 1/2/3). 2 gear fragments = bust (limit becomes 1). Produce composite resources up to limit."

4. **Play Area Indicators** (Bottom, 20% of height)
   - Labeled rectangles for:
     - Personal Deck (left)
     - Discard Pile (center-left)
     - Hand (center)
     - Played Cards (right)

**File Format:**
- **TTS:** High-res JPG/PNG (3000×2100px minimum, 300 DPI)
- **Physical:** PDF at 300 DPI

---

#### B. Fox Player Mat

**Dimensions:** 11" × 8.5" (landscape orientation)

**Required Elements:**

1. **House Identity Section** (Top, 20% of height)
   - House name: "Swift Foxes — Explorers & Defenders"
   - House icon/logo
   - Flavor text: "Guardians of the frontier, eyes on the horizon"

2. **Building Cost Reference** (Left side, 55% of width)
   - Table showing all 5 Fox buildings with Level 1/2/3 costs
   - Buildings:
     - Walls: 2 St → 3 St → 4 St, 1 SB
     - Scouting Camp: 2 Wd → 3 Wd → 3 Wd, 1 Lbr
     - Fortifications: 1 Wd, 1 St → 2 Wd, 2 St → 2 Lbr, 2 SB
     - Magic Shield: 2 Ore → 2 Ore, 1 Stl → 2 Ore, 2 Stl
     - Watchtower: 2 Wd, 1 St → 2 Lbr, 1 St → 3 Lbr, 2 SB

3. **Variable Trackers** (Center-right, 25% of width)
   - **N (Draw Tiles) Track**
     - Numbers: 2, 3, 4, 5, 6
     - Circle to mark current value (starting at 2)
   
   - **M (Place Tiles) Track**
     - Numbers: 1, 2, 3, 4
     - Circle to mark current value (starting at 1)

4. **Action Summary** (Right side, 20% of width)
   - **Main Action: Explore**
     - Icon: Compass
     - Description: "Draw N tiles, place M tiles. Gain discovery bonus when placing."
   
   - **Auxiliary Action: Scout**
     - Icon: Spyglass
     - Description: "Draw X events (keep order), manipulate Y events, return rest to top of deck."

5. **Play Area Indicators** (Bottom)
   - Hex Tile Draw Pile
   - Hex Tile Discard
   - Hand, Deck, Discard

**File Format:** Same as Squirrel mat

---

#### C. Owl Player Mat

**Dimensions:** 11" × 8.5" (landscape orientation)

**Required Elements:**

1. **House Identity Section** (Top, 20% of height)
   - House name: "Starling Scholars — Researchers & Mages"
   - House icon/logo
   - Flavor text: "Seekers of truth, weavers of wonder"

2. **Building Cost Reference** (Left side, 55% of width)
   - Table showing all 4 Owl buildings with Level 1/2/3 costs
   - Buildings:
     - University: 2 Wd, 1 St → 3 Wd, 2 St → 2 Lbr, 2 SB
     - Library: 3 Wd → 4 Wd → 3 Lbr, 1 Stl
     - Laboratory: 1 St, 1 Ore → 2 St, 1 Stl → 2 SB, 2 Stl
     - Maginarium: 1 Wd, 1 Ore → 2 Wd, 1 Stl → 2 Lbr, 2 Stl

3. **Variable Trackers** (Center-right, 20% of width)
   - **N (Display Size) Track**
     - Numbers: 3, 4, 5, 6, 7, 8
     - Circle to mark current value (starting at 3)
     - Label: "Research cards on display"
   
   - **Research Limit Track**
     - Numbers: calculated from Library levels
     - Note: "Sum of all Library levels"

4. **Action Summary** (Right side, 25% of width)
   - **Main Action: Research**
     - Icon: Linked hexagons
     - Description: "Buy research cards from display. Place orthogonally in tableau. Connecting links grant Knowledge or Insight."
   
   - **Auxiliary Action: Apply**
     - Icon: Tree/circuit diagram
     - Description: "Spend Knowledge/Insight to unlock Tech Tree or Magic Tree upgrades."

5. **Research Tableau Guide** (Bottom)
   - Diagram showing link positions: T, B, UL, UR, BL, BR
   - Example of two cards connecting

**File Format:** Same as previous mats

---

#### D. Badger Player Mat

**Dimensions:** 11" × 8.5" (landscape orientation)

**Required Elements:**

1. **House Identity Section** (Top, 20% of height)
   - House name: "Oakshield Badgers — Leaders & Master Builders"
   - House icon/logo
   - Flavor text: "Builders of legacy, architects of hope"

2. **Great Work Quick Reference** (Left side, 50% of width)
   - List of 5 possible Great Works (names only):
     - Heart of the Wood
     - The Aether Siphon
     - Stoneweave Bastion
     - The Harmonic Resonator
     - The Genesis Vault
   - Note: "Components detailed on Great Work cards"

3. **Worker Information** (Center, 25% of width)
   - **Starting Workers:** 1
   - **Maximum Workers:** 3
   - **Cost to Gain Worker:** 10 Food
   - Visual: 3 meeple outlines, first one filled/highlighted

4. **Action Summary** (Right side, 25% of width)
   - **Main Action: Progress**
     - Icon: Hammer/anvil
     - Description: "Place workers on board to construct components, train, ensure quality, install, or commission."
   
   - **Auxiliary Action: Lead**
     - Icon: Crown/banner
     - Description: "Spend Food for deckbuilding: Trash (5F), Buy Starter (3F), Increase hand limit (10F), or gain Worker (10F)."

5. **Lead Action Costs** (Bottom, 20% of height)
   - Table format:
     - Trash a card: 5 Food
     - Buy Starter from trash: 3 Food
     - +1 Hand Limit: 10 Food
     - +1 Worker: 10 Food

**File Format:** Same as previous mats

---

### 2. Badger Worker Placement Board

**Dimensions:** 11" × 17" (large format) or 8.5" × 14" (legal size)

**Required Elements:**

1. **Title/Header** (Top, 10% of height)
   - "Great Work Progress Board"
   - Subtitle: "Place workers to advance the Great Work"

2. **Worker Placement Spaces** (5 total, arranged vertically or in grid)

   Each space needs:
   - Large circle(s) for placing worker meeples
   - Action name (bold, large font)
   - Cost (if applicable)
   - Effect description

   **Space 1: Construct Component**
   - Worker slots: 1 circle
   - Cost: Resource costs shown on component card
   - Effect: "Pay the cost shown on a Great Work component card. Add that card to the 'Under Construction' area."
   - Icon: Hammer and wood planks

   **Space 2: Train**
   - Worker slots: 1 circle
   - Cost: 2 Knowledge OR 2 Insight
   - Effect: "+1 Expertise Level (max 5). Move expertise marker up one space."
   - Icon: Open book or scroll

   **Space 3: Ensure Quality**
   - Worker slots: 1 circle
   - Cost: None
   - Effect: "Roll X dice where X = Expertise Level. If total ≥ Quality Requirement on component card, move card to 'Completed' area."
   - Icon: Dice or magnifying glass

   **Space 4: Install Component**
   - Worker slots: 2 circles (requires 2 workers)
   - Cost: 2 workers
   - Effect: "Move one completed component from 'Completed' area to the Great Work structure. Permanently installed."
   - Icon: Gears connecting

   **Space 5: Commission**
   - Worker slots: 2 circles (requires 2 workers)
   - Cost: 2 workers + 2 Main Action cards from hand
   - Effect: "If all components are installed, WIN THE GAME! Otherwise, lose the 2 Main Action cards."
   - Icon: Laurel wreath or trophy

3. **Component Storage Areas** (Right side or bottom, 30-40% of space)
   - **Under Construction:** Rectangle to hold component cards being built
   - **Completed:** Rectangle to hold finished components awaiting installation
   - **Installed:** Rectangle or diagram showing Great Work structure (optional visual)

4. **Expertise Track** (Left side or top, 15% of space)
   - Numbers 0-5 with circles for marker placement
   - Label: "Expertise Level"
   - Starting position: 0

**File Format:**
- **TTS:** High-res JPG/PNG (5100×3000px minimum for 17"×11", 300 DPI)
- **Physical:** PDF at 300 DPI

---

### 3. Tech & Magic Tree Board

**Dimensions:** 17" × 11" (tabloid, landscape) or split into two 11" × 8.5" sheets

**Layout:** Split vertically into two halves

#### Left Half: Technology Tree (Knowledge)

**Background color:** Blue/grey tones

**Tier 1: Foundation** (Bottom)

1. **Basic Engineering**
   - Node shape: Rectangle with rounded corners
   - Cost: 3 Knowledge (displayed in top-right corner)
   - Effect: "Unlock Level 2 buildings for all houses"
   - Prerequisite: None (starting position)
   - Visual: Gear icon

2. **Logistics Network**
   - Cost: 2 Knowledge
   - Effect: "Players may pass 2 cards (instead of 1) during Strategy Phase"
   - Prerequisite: None
   - Visual: Road/path icon

**Tier 2: Industrialization** (Middle)

3. **Advanced Masonry**
   - Cost: 5 Knowledge
   - Effect: "Unlock Stone Brick production. Unlock Level 3 defensive buildings (Fox)"
   - Prerequisite: Basic Engineering (arrow connecting from node 1)
   - Visual: Brick wall icon

4. **Composite Refining**
   - Cost: 6 Knowledge
   - Effect: "Unlock Steel & Lumber production. Unlock Level 3 production buildings (Squirrel)"
   - Prerequisite: Basic Engineering
   - Visual: Furnace/mill icon

5. **Heavy Infrastructure**
   - Cost: 5 Knowledge
   - Effect: "Unlock Level 3 buildings for Fox and Owl"
   - Prerequisite: Advanced Masonry (arrow from node 3)
   - Visual: Castle/tower icon

**Tier 3: Mastery** (Top)

6. **Master Architecture**
   - Cost: 10 Knowledge
   - Effect: "All Level 2→3 upgrades cost 2 fewer resources (min 0)"
   - Prerequisites: Advanced Masonry AND Composite Refining (arrows from nodes 3 & 4)
   - Visual: Blueprint icon

7. **Automated Hauling**
   - Cost: 8 Knowledge
   - Effect: "Players may pass ANY number of cards during Strategy Phase"
   - Prerequisite: Logistics Network (arrow from node 2)
   - Visual: Cart/wagon icon

**Connection lines:** Use arrows pointing upward to show prerequisite paths

---

#### Right Half: Magic Tree (Insight)

**Background color:** Purple/violet tones

**Tier 1: Awareness** (Bottom)

1. **Aetheric Sensing**
   - Node shape: Hexagon
   - Cost: 3 Insight (displayed in top-right corner)
   - Effect: "Fox Scout: X increased to 2 (draw 2 events)"
   - Prerequisite: None
   - Visual: Eye icon

2. **Fate Weaving**
   - Cost: 4 Insight
   - Effect: "Fox Scout: Y increased to 1 (manipulate 1 event)"
   - Prerequisite: None
   - Visual: Thread/weaving icon

**Tier 2: Manipulation** (Middle)

3. **Storm Stabilization**
   - Cost: 6 Insight
   - Effect: "Event Phase: May spend 3 Insight to reduce Storm Track advancement by 1 (once per round)"
   - Prerequisite: Aetheric Sensing (arrow from node 1)
   - Visual: Shield with storm icon

4. **Banishment**
   - Cost: 7 Insight
   - Effect: "Fox Scout manipulation: Unlock 'Destroy event' option"
   - Prerequisite: Fate Weaving (arrow from node 2)
   - Visual: Crossed-out card icon

**Tier 3: Transcendence** (Top)

5. **Chronomancy**
   - Cost: 10 Insight
   - Effect: "If threat reaches 15, may spend 15 Insight to reset it to 13 instead of losing (once per game)"
   - Prerequisite: Banishment (arrow from node 4)
   - Visual: Clock/hourglass icon

6. **Aether Adaptation**
   - Cost: 12 Insight
   - Effect: "Aether events no longer advance Storm Track"
   - Prerequisite: Storm Stabilization (arrow from node 3)
   - Visual: Storm absorbed into tree icon

**Connection lines:** Use arrows pointing upward

---

**Status Tracking:**
- Include small checkbox or token placement circle on each node
- Unlocked nodes should have space for a marker/token

**File Format:**
- **TTS:** High-res JPG/PNG (5100×3300px for 17"×11", 300 DPI)
- **Physical:** PDF, could be split into 2 pages if needed

---

### 4. Threat/Storm Track Board

**Dimensions:** 11" × 4" (horizontal strip) or incorporated into another board

**Required Elements:**

1. **Title** (Left side, 10% of width)
   - "Aether Storm Threat Track"
   - Subtitle: "Advance = Danger"

2. **Track Spaces** (15 total, 80% of width)
   - Large numbered circles from 1-15
   - Divided into three visual zones:

   **Zone 1: Spaces 1-6** (Green/safe zone)
   - Color: Green or blue background
   - Label above: "Draw 1 Event Card"

   **Zone 2: Spaces 7-12** (Yellow/warning zone)
   - Color: Yellow/orange background
   - Label above: "Draw 2 Event Cards"
   - Mark the boundary at space 7 with a threshold indicator

   **Zone 3: Spaces 13-14** (Red/danger zone)
   - Color: Red background
   - Label above: "Draw 3 Event Cards"
   - Mark the boundary at space 13 with a threshold indicator

   **Space 15** (Black/loss zone)
   - Color: Black background, red text
   - Large skull icon or storm cloud
   - Label: "STORM CLIMAX — IMMEDIATE LOSS"

3. **Starting Position Indicator**
   - Arrow pointing to space 1
   - Text: "Start here"

4. **Visual Elements**
   - Storm cloud illustrations that get darker/more intense moving right
   - Lightning bolts increasing in frequency toward space 15

**File Format:**
- **TTS:** JPG/PNG (3300×1200px for 11"×4", 300 DPI)
- **Physical:** PDF could be printed on cardstock

---

### 5. Hex Map Tiles (40 Tiles)

Hex tiles form the explorable map. Each needs to be a separate image for TTS.

**Dimensions:** 
- If physical: 2" per hex side (flat-to-flat: 3.46", point-to-point: 4")
- If TTS: 1024×1024px square with transparent background, hex drawn inside

**Tile Breakdown:**

#### Central Havenwood (1 tile) — UNIQUE

**Visual Elements:**
- Background: Lush green meadow with giant ancient tree in center
- Resource Icon: None (safe zone)
- Discovery Bonus: None (starting tile)
- Text overlay: "Central Havenwood — Safe Zone"
- Special marker: Crown or star icon indicating starting position

---

#### Plains Tiles (12 total)

**Base Visual:** 
- Rolling golden grassland
- Blue sky with scattered clouds
- Small wildflowers

**Type A: +1 Food Discovery** (5 tiles)
- Resource Icon: Wheat sheaf (large, centered)
- Discovery Bonus Badge: "+1 Food" in green circle (top-right corner)
- Allowed Buildings Icons (bottom): Farm, Mine, Quarry (small icons)

**Type B: +1 Wood Discovery** (4 tiles)
- Resource Icon: Wheat sheaf
- Discovery Bonus Badge: "+1 Wood" in brown circle
- Allowed Buildings Icons: Farm, Mine, Quarry

**Type C: Free Move Discovery** (3 tiles)
- Resource Icon: Wheat sheaf
- Discovery Bonus Badge: "Free Move" with arrow icon in blue circle
- Allowed Buildings Icons: Farm, Mine, Quarry

---

#### Forest Tiles (12 total)

**Base Visual:**
- Dense woodland with tall trees
- Darker green palette
- Dappled sunlight through canopy

**Type A: +1 Wood Discovery** (5 tiles)
- Resource Icon: Tree log (large, centered, brown)
- Discovery Bonus Badge: "+1 Wood" in brown circle
- Allowed Buildings Icon: Forester Station (small, bottom)

**Type B: +1 Food Discovery** (4 tiles)
- Resource Icon: Tree log
- Discovery Bonus Badge: "+1 Food" in green circle
- Allowed Buildings Icon: Forester Station

**Type C: +1 Insight Discovery** (3 tiles)
- Resource Icon: Tree log
- Discovery Bonus Badge: "+1 Insight" in purple circle
- Allowed Buildings Icon: Forester Station

---

#### Mountain Tiles (8 total)

**Base Visual:**
- Rocky grey/brown peaks
- Snow on peaks (optional)
- Dramatic perspective

**Type A: +1 Stone Discovery** (4 tiles)
- Resource Icon: Stone blocks (grey, large, centered)
- Discovery Bonus Badge: "+1 Stone" in grey circle
- Allowed Buildings Icons (bottom): Mine, Quarry

**Type B: +1 Ore Discovery** (3 tiles)
- Resource Icon: Stone blocks
- Discovery Bonus Badge: "+1 Ore" in dark grey/silver circle
- Allowed Buildings Icons: Mine, Quarry

**Type C: +1 Knowledge Discovery** (1 tile) — RARE
- Resource Icon: Stone blocks
- Discovery Bonus Badge: "+1 Knowledge" in blue circle
- Allowed Buildings Icons: Mine, Quarry

---

#### River Tiles (7 total)

**Base Visual:**
- Flowing blue water
- Green riverbanks
- Maybe some lily pads or reeds

**Type A: +1 Food Discovery** (3 tiles)
- Resource Icon: Water droplet or fish (large, centered, blue)
- Discovery Bonus Badge: "+1 Food" in green circle
- Allowed Buildings Icon: Farm (bottom)

**Type B: +1 Insight Discovery** (2 tiles)
- Resource Icon: Water droplet/fish
- Discovery Bonus Badge: "+1 Insight" in purple circle
- Allowed Buildings Icon: Farm

**Type C: Free Fortification Discovery** (2 tiles)
- Resource Icon: Water droplet/fish
- Discovery Bonus Badge: "Free Fort Lvl 1" with shield icon
- Allowed Buildings Icon: Farm

---

**Hex Tile Template Specifications:**

For consistency, create a template with these zones:

1. **Background Layer:** Environment-specific art
2. **Resource Icon Layer:** Large central symbol (60% of hex)
3. **Discovery Badge:** Small circle in top-right (15% of hex diameter)
4. **Allowed Buildings:** Small icon strip at bottom (10% of hex height)
5. **Border:** Thin black line defining hex edge

**File Naming Convention:**
- `hex_central.png`
- `hex_plains_food_01.png` through `hex_plains_food_05.png`
- `hex_plains_wood_01.png` through `hex_plains_wood_04.png`
- `hex_plains_move_01.png` through `hex_plains_move_03.png`
- `hex_forest_wood_01.png` through `hex_forest_wood_05.png`
- Etc.

**File Format:**
- **TTS:** PNG with transparency, 1024×1024px
- **Physical:** PDF, could be arranged on sheets for printing

---

### 6. Tokens & Markers

Tokens can be simple 2D circles or squares with icons/text.

**Standard Token Size:**
- Small: 0.75" diameter
- Medium: 1" diameter
- Large: 1.5" diameter

#### Resource Tokens

**Quantity:** Suggest 30 of each type

Design each as a colored circle with icon:

1. **Food Tokens** (Medium)
   - Color: Yellow/golden
   - Icon: Wheat sheaf or apple
   - Text: "Food" or "F"

2. **Wood Tokens** (Medium)
   - Color: Brown
   - Icon: Tree log
   - Text: "Wood" or "Wd"

3. **Ore Tokens** (Medium)
   - Color: Dark grey/silver
   - Icon: Ore chunk/crystal
   - Text: "Ore" or "O"

4. **Stone Tokens** (Medium)
   - Color: Light grey
   - Icon: Stone block
   - Text: "Stone" or "St"

5. **Lumber Tokens** (Medium)
   - Color: Light brown
   - Icon: Lumber planks
   - Text: "Lumber" or "Lbr"
   - Border: Distinct pattern to show it's composite

6. **Steel Tokens** (Medium)
   - Color: Silver/metallic
   - Icon: Steel ingot
   - Text: "Steel" or "Stl"
   - Border: Distinct pattern

7. **Stone Brick Tokens** (Medium)
   - Color: Red-brown
   - Icon: Brick pattern
   - Text: "Stone Brick" or "SB"
   - Border: Distinct pattern

**File Format:** Individual PNG files with transparency, 300×300px each

---

#### House Markers

**Quantity:** 1 of each (4 total)

Design as colored circles or house-shaped tokens:

1. **Squirrel Marker** (Large)
   - Color: Red/orange
   - Icon: Squirrel silhouette
   - Text: "Squirrels"

2. **Fox Marker** (Large)
   - Color: Orange/rust
   - Icon: Fox silhouette
   - Text: "Foxes"

3. **Owl Marker** (Large)
   - Color: Brown/tan
   - Icon: Owl silhouette
   - Text: "Owls"

4. **Badger Marker** (Large)
   - Color: Black/white stripes
   - Icon: Badger silhouette
   - Text: "Badgers"

**File Format:** PNG with transparency, 450×450px each

---

#### Special Tokens

1. **Fox Wall Tokens** (12 total, 4 of each level)
   - Shape: Small square (0.75")
   - Level 1: Grey stone wall, "1"
   - Level 2: Grey stone wall with battlements, "2"
   - Level 3: Stone wall with towers, "3"

2. **Fortification Tokens** (12 total, 4 of each level)
   - Shape: Small shield (0.75")
   - Level 1: Wooden shield, "1"
   - Level 2: Stone shield, "2"
   - Level 3: Metal shield, "3"

3. **Magic Shield Tokens** (6 total)
   - Shape: Hexagon (1")
   - Color: Purple/blue glow effect
   - Icon: Energy shield symbol

4. **Blocked Tokens** (6 total)
   - Shape: Octagon (1", like stop sign)
   - Color: Red background
   - Icon: X or crossed tools
   - Text: "Blocked"

5. **Bandit Tokens** (6 total)
   - Shape: Circle (1")
   - Color: Black/dark red
   - Icon: Skull or bandit mask
   - Text: "Bandits"

6. **Knowledge Tracker Cube**
   - 3D cube design (if TTS) or single token (if physical)
   - Color: Blue
   - Text: "Knowledge"
   - Size: Medium (1")

7. **Insight Tracker Cube**
   - 3D cube design or single token
   - Color: Purple
   - Text: "Insight"
   - Size: Medium (1")

8. **Storm/Threat Marker**
   - Shape: Large circle or storm cloud shape (1.5")
   - Color: Black/grey with lightning
   - Icon: Storm cloud with lightning bolt

9. **Round/Turn Marker**
   - Shape: Circle (1")
   - Color: White/neutral
   - Text: "Round [number]" or just numbers 1-20

**File Format:** PNG files with transparency, sized appropriately (300-450px)

---

### 7. Badger Worker Meeples

**Quantity:** 3 total

If using TTS:
- Use built-in meeple models (available in TTS)
- Assign color: Black or brown to represent Badgers

If creating physical prototype:
- Can use standard wooden meeples painted black/brown
- Or create cardboard standees:
  - Design: Badger silhouette (front view)
  - Size: 1.5" tall
  - Base: 0.75" diameter circle
  - Print on cardstock and attach to small bases

**File Format (if custom):** PNG silhouette, 450×600px

---

### 8. Dice

#### A. Harvest Dice (10 required, custom d6)

**Face Design:**

You'll need to create custom dice face stickers or use a dice customizer service (like Chessex).

**Faces:**
1. **Face 1:** Large "1" numeral
2. **Face 2:** Large "2" numeral
3. **Face 3:** Large "3" numeral
4. **Face 4 (Bust #1):** Cracked acorn icon or "BUST" text
5. **Face 5 (Bust #2):** Cracked acorn icon or "BUST" text
6. **Face 6 (Blank):** Empty/blank (or very small dot to distinguish from bust)

**Color:** Wood brown or golden yellow

**For TTS:**
- Can use custom dice asset with texture mapping
- Or use standard d6 and document the face mapping in rules

**For Physical:**
- Use dice sticker sheets (e.g., from The Game Crafter)
- Or print onto adhesive label paper and apply to blank d6s

**File Format:** 6 individual face designs, 256×256px each

---

#### B. Quality Dice (6 required, standard d6)

**Description:** These are just standard six-sided dice with faces 1-6.

**For TTS:** Use built-in d6 objects (available in TTS)

**For Physical:** Any standard d6 (suggest contrasting color like white or red)

No custom assets needed.

---

## 📋 Summary Checklist

### High Priority (Required for MVP)

- [ ] Squirrel Player Mat
- [ ] Fox Player Mat
- [ ] Owl Player Mat
- [ ] Badger Player Mat
- [ ] Badger Worker Placement Board
- [ ] Tech & Magic Tree Board
- [ ] Threat/Storm Track Board
- [ ] Hex Map Tiles (40 designs)
- [ ] Resource Tokens (7 types)
- [ ] House Markers (4)

### Medium Priority (Gameplay Enhancement)

- [ ] Badger Worker Meeples (3)
- [ ] Fox Wall Tokens (12)
- [ ] Fortification Tokens (12)
- [ ] Magic Shield Tokens (6)
- [ ] Blocked Tokens (6)
- [ ] Bandit Tokens (6)
- [ ] Knowledge/Insight Trackers (2)
- [ ] Storm/Threat Marker (1)
- [ ] Harvest Dice faces (custom d6 design)

### Low Priority (Nice to Have)

- [ ] Round/Turn Marker
- [ ] Quality Dice (use standard d6)
- [ ] Decorative elements for boards
- [ ] Alternative art variants

---

## 🎨 Design Guidelines

### Color Palette

**House Colors:**
- Squirrels: Red/Orange (#D2691E)
- Foxes: Orange/Rust (#FF8C00)
- Owls: Brown/Tan (#8B7355)
- Badgers: Black/Grey (#2F4F4F)

**Resource Colors:**
- Food: Yellow (#FFD700)
- Wood: Brown (#8B4513)
- Ore: Dark Grey (#696969)
- Stone: Light Grey (#C0C0C0)
- Lumber: Light Brown (#DEB887)
- Steel: Silver (#B0C4DE)
- Stone Brick: Red-Brown (#A0522D)

**Tree Colors:**
- Knowledge/Tech: Blue (#4169E1)
- Insight/Magic: Purple (#9370DB)

### Typography

**Recommended Fonts:**
- **Titles:** Bold sans-serif (e.g., Helvetica Bold, Roboto Bold)
- **Body Text:** Clean sans-serif (e.g., Arial, Open Sans)
- **Flavor Text:** Serif or script font (e.g., Georgia, Crimson Text)

### Icon Sources

Consider using:
- **Game-icons.net** (free, open-source SVG icons)
- **Noun Project** (requires attribution or purchase)
- Custom illustrations via Fiverr or similar

---

## 🛠️ Tools & Resources

### Design Software

**Free:**
- **GIMP** (Photoshop alternative for raster graphics)
- **Inkscape** (vector graphics for icons/tokens)
- **Canva** (online, great for layout)
- **Figma** (online, professional layouts)

**Paid:**
- **Adobe Photoshop** (industry standard)
- **Adobe Illustrator** (vector graphics)
- **Affinity Designer** (one-time purchase alternative)

### Prototype Services

**Physical Printing:**
- **The Game Crafter** (print-on-demand for boards, tiles, tokens)
- **PrintNinja** (bulk printing)
- **Printer Studio** (custom cards and boards)

**Dice Customization:**
- **Chessex Custom Dice**
- **The Game Crafter** (dice stickers)

### TTS Resources

- **Tabletop Simulator Workshop** (upload custom assets)
- **TTS Asset Importer** (built into TTS)
- Templates available in TTS for common objects

---

## 📏 Asset Specifications for TTS

| Component Type | Image Size (px) | File Format | DPI/Quality |
|---|---|---|---|
| Player Mat (11"×8.5") | 3300×2550 | JPG/PNG | 300 |
| Worker Board (11"×17") | 5100×3300 | JPG/PNG | 300 |
| Tech Tree (17"×11") | 5100×3300 | JPG/PNG | 300 |
| Storm Track (11"×4") | 3300×1200 | JPG/PNG | 300 |
| Hex Tiles (2" hex) | 1024×1024 | PNG (transparent) | 300 |
| Tokens (1" diameter) | 300×300 | PNG (transparent) | 300 |
| House Markers (1.5") | 450×450 | PNG (transparent) | 300 |
| Card Sheet (10×7) | 4096×2816 | JPG | 300 |

---

## 🎯 Next Steps

1. **Start with Player Mats** — These provide the most value for testing gameplay
2. **Create the Badger Worker Board** — Essential for Badger house mechanics
3. **Design Tech & Magic Tree** — Critical for progression system testing
4. **Produce Hex Tiles** — Start with 1 of each type, expand to full set later
5. **Create basic resource tokens** — Can use simple circles with text initially
6. **Build Storm Track** — Simple but essential for game tension

Consider creating "low-fidelity" prototypes first (simple shapes, minimal art) to test gameplay before investing in polished visuals.

---

**Document Version:** 1.0  
**Last Updated:** February 5, 2026  
**Status:** Ready for asset creation
