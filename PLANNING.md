To create a Tabletop Simulator (TTS) mod, you need to prepare flat 2D image files that the software wraps around 3D objects (cards, boards, tokens).

Here is the breakdown of the assets you need to generate, structured by component type, along with layout recommendations to ensure playability.

### 1. Cards
TTS requires cards to be uploaded as **"Card Sheets" (Atlases)**. This is a single large image containing a grid of all card faces (usually 10 columns x 7 rows). You will need a separate image file for the **Card Back** of each deck.

#### A) Card Elements by Deck

| Deck | Essential Front Elements | Unique Requirement |
| :--- | :--- | :--- |
| **Shared Action** | **Cost** (Top Left), **Title**, **Tags** (Build, Move, etc.), **Effect Text** | Clear distinction between Tier 1, 2, and 3 cards (border color or watermark). |
| **Event** | **Title**, **Type** (Natural, Hostile, Aether), **Target**, **Severity/Storm Value**, **Effect** | Color-coding the "Type" is crucial for quick recognition. |
| **Owl Research** | **Cost**, **Links** (Half-shapes on edges), **Reward Icon** (inside the link) | **Geometry is key.** The "Links" (Top, Bottom, UL, UR, BL, BR) must align perfectly when cards are placed side-by-side. |
| **Squirrel Production** | **Output Number** (Huge font), **Gear Icon** (for busts) | These should be minimal. Just the number and the bust icon. |
| **Project Components** | **Name**, **Cost**, **Quality Req** (Target Number) | Flavor text describing the component (e.g., "Barkshell Casing"). |

#### B) Card Layout Recommendation
Use a standard poker card size ratio (2.5" x 3.5", or 750px x 1050px).

* **Header (Top 20%):** Title and Resource Cost.
* **Art/Flavor (Middle 40%):** An image representing the card.
* **Body (Bottom 40%):** The game text. Use bolding for keywords (e.g., **Move**, **Build**).
* **The "Owl" Exception:** Owl cards need the center clear for art, but the *edges* are the mechanic. Place half-circle or triangle icons at the specific "Link" coordinates on the very edge of the card so they form a full shape when adjacent.

---

### 2. Boards & Mats
In TTS, these are "Custom Boards" or "Custom Tokens." You need one high-resolution image (JPG/PNG) for each.

#### A) Board Elements

* **Player Mats (x4):**
    * **House Name & Icon.**
    * **Building Tracker:** A list or slots for buildings showing Lvl 1/2/3 costs.
    * **Ability Summary:** Short text explaining Main/Aux actions.
    * **Variable Track:**
        * *Fox:* N (Draw) and M (Place) track.
        * *Owl:* N (Display) track.
    * **Resource/Deck Area:** Designated space for their personal deck (if any) and discard pile.

* **Badger Worker Board:**
    * **Worker Slots:** Circles to place meeples.
    * **Action Explanations:** Icons or text summarizing "Construct," "Train," "Ensure Quality," etc..

* **Tech & Magic Tree:**
    * **Nodes:** Boxes for each technology (e.g., "Basic Engineering").
    * **Lines:** Arrows connecting prerequisites to upgrades.
    * **Cost:** Clearly visible inside the node.

* **Threat/Storm Track:**
    * **15 Spaces:** Numbered 1–15.
    * **Threshold Markers:** Visual indicators at spaces 7 (Draw 2) and 13 (Draw 3).

#### B) Board Layout Recommendation
* **Player Mats:** Keep the "Active Area" (where they play cards) at the bottom. Keep "Reference Info" (Building costs) at the top.
* **Tech Tree:** arrange it hierarchically from Left-to-Right or Bottom-to-Top. Use distinct colors for the Tech (Knowledge) vs. Magic (Insight) trees.

---

### 3. Tiles (Hexes)
TTS allows you to import "Tiles." You can use a generic Hex model and apply your image as a "Diffuse/Color" map.

#### A) Tile Elements
* **Environment Art:** Clear visual texture (Green for Forest, Grey for Mountain, Yellow/Green for Plains).
* **Resource Icon:** A large, central icon showing what it produces (Wood, Stone, Food).
* **Discovery Bonus:** A smaller icon (perhaps in a circle or banner) indicating the one-time bonus (e.g., "+1 Insight").
* **Allowed Buildings:** (Optional) Small watermark icons showing what can be built there (e.g., Mine icon on Mountains).

#### B) Tile Layout Recommendation
* **Shape:** Prepare the image as a **Square** with a transparent background, but draw the content within a Hexagon shape in the center.
* **Orientation:** Pointy-topped hexes are standard for most board games.
* **Readability:** The **Resource Icon** is the most important information. It should be visible even when the board is zoomed out.

---

### 4. Technical "Asset List" for TTS
To actually build the mod, you will need to generate and save the following files in a specific folder.

**File Checklist:**

1.  **`Card_Sheet_SharedDeck.jpg`** (The 40 Starter cards + 40 Market cards in a grid).
2.  **`Card_Back_Shared.jpg`** (One image).
3.  **`Card_Sheet_Events.jpg`** (Events, Storm cards, Fear cards).
4.  **`Card_Back_Event.jpg`** (Distinct warning design).
5.  **`Card_Sheet_OwlResearch.jpg`** (All 3 levels, potentially on one sheet or three separate ones if you want distinct backs).
6.  **`Card_Sheet_GreatWorks.jpg`** (Project components).
7.  **`Card_Sheet_Squirrel.jpg`** (Production deck).
8.  **`Board_Player_Squirrel.jpg`**
9.  **`Board_Player_Fox.jpg`**
10. **`Board_Player_Owl.jpg`**
11. **`Board_Player_Badger.jpg`**
12. **`Board_WorkerPlacement.jpg`**
13. **`Board_TechTree.jpg`**
14. **`Board_StormTrack.jpg`**
15. **`Tile_Plains.png`** (Individual file usually best for tiles, or a "Tile Sheet").
16. **`Tile_Forest.png`**
17. **`Tile_Mountain.png`**
18. **`Tile_River.png`**
19. **`Tile_Central.png`**

### Recommended Workflow
Don't design every card individually in Photoshop. It takes too long.

1.  **Use Nandeck (Free) or Component Studio:** These tools take a CSV (Spreadsheet) of your card data (which you can export from the tables in `HOUSES.md`) and merge them into a template automatically. They can export the "Card Sheets" in the grid format TTS requires.
2.  **Use Figma/Canva for Boards:** These tools are better for layout out large boards with text and boxes than Photoshop.

***

**Would you like me to generate a CSV-formatted text block for the "Shared Action Deck" or the "Event Deck" that you can copy-paste directly into a tool like Nandeck or a spreadsheet?**