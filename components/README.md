# Card and Component Generation Guide

This folder contains CSV data files and JSON configuration files for generating printable cards using the cardigan tool, as well as HTML-based player mats and boards that can be exported as high-resolution images.

## Files

### CSV Data Files
- `action_deck.csv` - Shared action cards (80 cards total)
- `event_deck.csv` - Event cards including Natural, Hostile, Aether, and Fear cards
- `great_works.csv` - Great Work component cards for project completion
- `production_deck.csv` - Squirrel production cards for push-your-luck mechanics
- `research_deck.csv` - Owl research cards with link mechanics

### Configuration Files
- `action_deck_config.json` - Configuration for action deck cards
- `event_deck_config.json` - Configuration for event deck cards
- `great_works_config.json` - Configuration for great works component cards
- `production_deck_config.json` - Configuration for production deck cards
- `research_deck_config.json` - Configuration for research deck cards

## Usage

### Prerequisites
The cardigan tool is included as a git submodule at `lib/cardigan`. To use it:

```bash
cd lib/cardigan
yarn install
```

### Generating Cards

From the project root directory (`havenwood-web`), you can generate cards in three formats:

#### 1. HTML Preview (for visual development)
```bash
cd lib/cardigan
yarn cardigan html ../../components/action_deck_config.json ../../output/action_deck.html
```

#### 2. PDF Export (for printing)
```bash
cd lib/cardigan
yarn cardigan pdf ../../components/action_deck_config.json ../../output/action_deck.pdf ../../output/action_deck.html
```

#### 3. Image Export (for Tabletop Simulator)
```bash
cd lib/cardigan
yarn cardigan images ../../components/action_deck_config.json ../../output/action_deck_images/
```

#### 3. Image Export (for Tabletop Simulator)
```bash
cd lib/cardigan
yarn cardigan images ../../components/action_deck_config.json ../../output/action_deck_images/
```

### Generate All Decks

You can use these commands to generate all decks at once:

```powershell
# From lib/cardigan directory
$decks = @('action_deck', 'event_deck', 'great_works', 'production_deck', 'research_deck')
foreach ($deck in $decks) {
    yarn cardigan html "../../components/${deck}_config.json" "../../output/${deck}.html"
    yarn cardigan pdf "../../components/${deck}_config.json" "../../output/${deck}.pdf" "../../output/${deck}.html"
    yarn cardigan images "../../components/${deck}_config.json" "../../output/${deck}_images/"
}
```

Or use the provided PowerShell script from the project root:

```powershell
.\generate-cards.ps1
```

## Card Layouts

### Action Deck
- **Tier** (top left)
- **Cost** (top right, in circle)
- **Title** (centered)
- **Tags** (centered, below title)
- **Effect Text** (bottom section)

### Event Deck
- **Type** (Natural/Hostile/Aether, top left)
- **Value** (Storm/Severity value, top right)
- **Title** (centered)
- **Target** (centered, below title)
- **Effect Text** (bottom section)

### Great Works
- **Project Name** (top, centered)
- **Component Name** (centered)
- **Quality Requirement** (top right, large number)
- **Cost** (bottom, centered)

### Production Deck
- **Title** (top, centered)
- **Output Value** (very large, centered) - shows 1, 2, 3, or 0 for gear fragments
- **Effect Text** (bottom, centered)

### Research Deck
- **Level** (top left)
- **ID** (top right)
- **Cost** (centered)
- **Link indicators** (6 positions around edges for connecting cards)
  - Top, Bottom
  - Upper Left, Upper Right
  - Bottom Left, Bottom Right

## Customization

To modify card layouts, edit the corresponding `*_config.json` file. Key properties:

- `posX`, `posY` - Position of element (in mm from top-left)
- `width`, `height` - Size of element ("auto" for text wrapping)
- `fontSize` - Font size in mm
- `fontWeight` - "normal" or "bold"
- `horizontalAlign` - "left", "center", or "right"

### Image Export Options

Add an `imageExport` section to generate images:

```json
{
  "imageExport": {
    "format": "sheet",
    "sheetColumns": 10,
    "sheetRows": 7,
    "imageFormat": "png",
    "quality": 100,
    "namingScheme": "index",
    "filenamePrefix": "card"
  }
}
```

- `format`: "individual", "sheet", or "both"
- `sheetColumns`/`sheetRows`: Grid size for TTS card sheets (default: 10x7)
- `imageFormat`: "png" or "jpeg"  
- `namingScheme`: "index" (numbered) or "title" (based on card title)
- `filenamePrefix`: Prefix for numbered files

## Card Specifications

- **Card Size**: 63.5mm × 88.9mm (standard poker card, 2.5" × 3.5")
- **Page Size**: US Letter (215.9mm × 279.4mm, 8.5" × 11")
- **Cards Per Page**: 9 (3×3 grid)
- **Units**: millimeters (mm)

## HTML Component Export (Player Mats & Boards)

In addition to cards, this folder contains HTML-based components (player mats and boards) that can be exported as high-resolution PNG images.

### Prerequisites

Install Node.js dependencies for export functionality:

```powershell
cd components
npm install
```

This will install Puppeteer (~350MB download - includes Chromium browser).

### Export Commands

#### Export All Components
```powershell
npm run export-all
```

#### Export Only Player Mats
```powershell
npm run export-mats
```

#### Export Only Boards
```powershell
npm run export-boards
```

#### Export Single Component
```powershell
node export.js squirrel_mat
node export.js badger_worker_placement_board
```

### Available Components

**Player Mats** (in `player_mats/`):
- `squirrel_mat` - 3000×2100px (10"×7" at 300 DPI)
- `fox_mat` - 3000×2100px (10"×7" at 300 DPI)
- `owl_mat` - 3000×2100px (10"×7" at 300 DPI)
- `badger_mat` - 3000×2100px (10"×7" at 300 DPI)

**Boards** (in `boards/`):
- `badger_worker_placement_board` - 1100×1700px

### Output Locations

Exported PNG files are saved to:
- Player mats: `output/player_mats/`
- Boards: `output/boards/`

See `player_mats/README.md` for detailed information about player mat designs and customization.
