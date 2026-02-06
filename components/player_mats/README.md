# Player Mats - Houses of Havenwood

This folder contains HTML designs for the four player mats and a Node.js script to export them as high-resolution PNG images suitable for printing or use in Tabletop Simulator.

## Contents

- `squirrel_mat.html` - Squirrel House player mat (Harvesters & Producers)
- `fox_mat.html` - Fox House player mat (Explorers & Defenders)
- `owl_mat.html` - Owl House player mat (Researchers & Mages)
- `badger_mat.html` - Badger House player mat (Leaders & Master Builders)
- `export.js` - Node.js export script using Puppeteer
- `package.json` - Node.js dependencies

## Setup

1. Install Node.js dependencies:

```powershell
cd components/player_mats
npm install
```

This will install Puppeteer (~350MB download - includes Chromium browser).

## Usage

### Export All Mats

To export all four player mats at once:

```powershell
npm run script export-all
```

Or:

```powershell
node export.js --all
```

### Export Single Mat

To export a specific player mat:

```powershell
node export.js squirrel_mat
node export.js fox_mat
node export.js owl_mat
node export.js badger_mat
```

### Output

PNG files are exported to: `../../output/player_mats/`

- `squirrel_mat.png`
- `fox_mat.png`
- `owl_mat.png`
- `badger_mat.png`

## Specifications

### Dimensions

- **Size**: 3000px × 2100px (10" × 7" at 300 DPI)
- **Format**: PNG with transparency support
- **DPI**: 300 (print quality)

### Physical Size

- **10" × 7"** (landscape orientation)
- Smaller than the maximum 11" × 8.5" to allow for comfortable handling
- Fits standard letter-size protective sleeves when trimmed

## Design Features

### Squirrel Mat (Red/Orange)

- Building cost table for all 6 Squirrel buildings
- Harvest action explanation with dice mechanics
- Produce action explanation with card draw rules
- Play area indicators (Deck, Discard, Hand, Played)

### Fox Mat (Orange/Rust)

- Building cost table for all 5 Fox buildings
- N (Draw Tiles) tracker: 2-6 tiles
- M (Place Tiles) tracker: 1-4 tiles
- Explore action explanation
- Scout action explanation with event manipulation
- Play area indicators including tile draw/discard

### Owl Mat (Brown/Tan)

- Building cost table for all 4 Owl buildings
- N (Display Size) tracker: 3-8 cards
- Research Limit reference (sum of Library levels)
- Research action explanation with link mechanics
- Apply action explanation for Tech/Magic trees
- Research tableau guide with link positions

### Badger Mat (Black/Grey/Green)

- List of all 5 Great Works with descriptions
- Worker information (starting: 1, max: 3, cost: 10 Food)
- Visual worker tracker (3 meeple silhouettes)
- Progress action explanation
- Lead action explanation
- Lead action costs table (Trash: 5F, Buy Starter: 3F, +Hand: 10F, +Worker: 10F)

## Customization

To modify the designs, edit the HTML files directly. Each file is self-contained with embedded CSS.

### Key Style Variables

The designs use consistent spacing and sizing:

- Header height: 380px (18%)
- Main content height: 1000-1100px (50%)
- Bottom section height: 440-540px (23%)
- Padding: 30px
- Font sizes: 28-88px (scaled for readability at print size)

### Color Schemes

- **Squirrel**: #8B4513 to #D2691E (brown to chocolate)
- **Fox**: #CD853F to #FF8C00 (peru to dark orange)
- **Owl**: #6B4423 to #8B7355 (brown to tan)
- **Badger**: #2F4F4F to #556B2F (dark slate to olive)

## Printing

For physical prototypes:

1. Export PNGs at 300 DPI (default)
2. Print on heavy cardstock (110lb+) or cardboard
3. Optional: laminate for durability
4. Recommend size: 10" × 7" (matches export dimensions exactly)

For professional printing services:

- Use The Game Crafter, PrintNinja, or similar
- Provide PNG files with embedded color profile
- Request 300 DPI, full-bleed printing

## Tabletop Simulator

For TTS mod creation:

1. Export PNGs using the export script
2. Upload to image hosting or Steam Workshop
3. Use as "Custom Board" objects in TTS
4. Set physical dimensions in TTS to 10" × 7"

## Troubleshooting

### Export fails with "Cannot find module"

Make sure you've run `npm install` first.

### Fonts look wrong in exported PNG

The designs use common system fonts (Georgia, Arial). They should render consistently across Windows/Mac/Linux.

### Image appears cropped

Check that the viewport size in `export.js` matches the `width` and `height` in the HTML file's `.player-mat` class.

### File size too large

The PNGs are high-resolution (300 DPI). This is intentional for print quality. For web use, resize to 72 DPI.

## License

Part of Houses of Havenwood game project.
