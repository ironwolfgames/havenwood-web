# Dice Components - Houses of Havenwood

This folder contains HTML designs for custom dice faces used in Houses of Havenwood and a Node.js script to export them as PNG images suitable for printing on sticker paper or use in Tabletop Simulator.

## Contents

### HTML Files
- `harvest_face_1.html` - Face showing numeral "1"
- `harvest_face_2.html` - Face showing numeral "2"
- `harvest_face_3.html` - Face showing numeral "3"
- `harvest_face_bust.html` - Bust face with cracked acorn icon and "BUST" text
- `harvest_face_blank.html` - Blank face with small distinguishing dot
- `harvest_dice.html` - All 6 faces displayed in a grid for easy visualization

### Export Tools
- `export.js` - Node.js export script using Puppeteer
- `package.json` - Node.js dependencies

## Dice Overview

### Harvest Dice (Custom d6)

**Quantity Required:** 10 dice

**Purpose:** Used by the Squirrel faction (Forest Squirrels - Harvesters & Producers) for their signature Harvest action, which implements a push-your-luck mechanic for resource gathering.

**Face Distribution:**
- **Face 1:** Large "1" numeral (white on wood brown/golden yellow gradient)
- **Face 2:** Large "2" numeral (white on wood brown/golden yellow gradient)
- **Face 3:** Large "3" numeral (white on wood brown/golden yellow gradient)
- **Face 4:** "BUST" with cracked acorn icon
- **Face 5:** "BUST" with cracked acorn icon (duplicate)
- **Face 6:** Blank face with small dot (worth 0 but can be locked)

**Gameplay Mechanics:**
1. Player rolls N dice where N equals their building level (1-3)
2. Player locks any non-bust dice they wish to keep
3. Player chooses to either:
   - **Stop:** Gain resources equal to the total value of all locked dice
   - **Reroll:** Reroll all unlocked dice and repeat the process
4. If a bust is rolled, player cannot lock any dice that turn
5. Blank faces are worth 0 but can be locked to secure what you have

**Risk vs. Reward:** The two bust faces create tension - do you push for more resources or play it safe?

### Quality Dice (Standard d6)

**Quantity Required:** 6 dice

**Purpose:** Used by the Badger faction (Oakshield Badgers - Leaders & Master Builders) for quality checks when ensuring Great Work components meet requirements.

**Type:** Standard six-sided dice (1-6 pips or numerals)

**Recommendation:** Use contrasting color dice (white or red) to distinguish them from Harvest Dice in physical play. No custom assets needed - use any standard d6.

**Gameplay Mechanics:**
Roll X dice where X equals the Badger player's Expertise Level. If the total meets or exceeds the Quality Requirement shown on the component card, the component passes quality control and moves to the "Completed" area.

## Setup

### Prerequisites

1. Install Node.js (v18 or higher recommended)
2. Install dependencies:

```bash
cd components/dice
npm install
```

Or if using Yarn:

```bash
cd components/dice
yarn install
```

This will install Puppeteer (~350MB download - includes Chromium browser).

## Exporting to PNG

### Export All Faces

To export all dice faces at once:

```bash
npm run export-all
```

Or:

```bash
yarn export-all
```

Or:

```bash
node export.js --all
```

### Export Individual Faces

To export a specific dice face:

```bash
node export.js harvest_face_1
node export.js harvest_face_2
node export.js harvest_face_3
node export.js harvest_face_bust
node export.js harvest_face_blank
node export.js harvest_dice
```

### Output Location

PNG files are exported to: `../../output/dice/`

Individual face files:
- `harvest_face_1.png` (256×256px)
- `harvest_face_2.png` (256×256px)
- `harvest_face_3.png` (256×256px)
- `harvest_face_bust.png` (256×256px)
- `harvest_face_blank.png` (256×256px)
- `harvest_dice.png` (900×1200px - all faces sheet)

## Physical Prototype - Printing on Sticker Paper

### Materials Needed

1. **Blank d6 dice** - 10 standard white or wooden dice (16mm is standard)
2. **Sticker paper** - Clear or white adhesive labels
3. **Printer** - Inkjet or laser (color)
4. **Scissors or craft knife** - For cutting stickers
5. **Optional:** Clear sealant spray for durability

### Recommended Sticker Paper

- **Avery 22806** - Clear Full-Sheet Labels (8.5" × 11")
- **Avery 5165** - White Full-Sheet Labels (8.5" × 11")
- **OnlineLabels OL125** - Clear Gloss Labels
- **Cricut Printable Sticker Paper** - Works with most printers

### Sizing for Stickers

Standard d6 dice have **13-16mm faces**. The exported faces are 256×256px at 300 DPI, which equals:
- **256px ÷ 300 DPI × 25.4mm/inch = 21.7mm** square

For best results, scale down when printing:
- **Print at 60-75% size** to fit standard dice (resulting in 13-16mm squares)

### Printing Instructions

#### Method 1: Using harvest_dice.html (Sheet)

1. Open `harvest_dice.html` in a web browser
2. Print to PDF or directly to sticker paper:
   - **File → Print**
   - Select your printer or "Save as PDF"
   - **Page Setup:** Use landscape orientation
   - **Scale:** Set to 60-75% to fit your dice size
   - **Margins:** Minimal (0.25")
3. Load sticker paper in printer (check which side is adhesive)
4. Print the page
5. Let ink dry completely (5-10 minutes for inkjet)

#### Method 2: Using Individual PNGs

1. Export all faces using `node export.js --all`
2. Open image editing software (Photoshop, GIMP, Canva)
3. Create new document (8.5" × 11")
4. Arrange face PNGs in grid:
   - Each face at **60-75% scale** (13-16mm square)
   - Leave 2-3mm spacing between faces
   - Repeat faces as needed (face 4 and 5 are both bust faces)
   - Create 2 sheets for all 60 faces (10 dice × 6 faces)
5. Print to sticker paper

#### Layout Example (one sheet):
```
Row 1:  1  2  3  4  5  6
Row 2:  1  2  3  4  5  6
Row 3:  1  2  3  4  5  6
...
(Repeat to fill sheet - each row is one complete die)
```

### Application Instructions

1. **Cut stickers carefully:**
   - Use sharp scissors or craft knife
   - Cut squares slightly smaller than dice faces for clean edges
   - Test fit on dice before removing backing

2. **Clean dice surfaces:**
   - Wipe with rubbing alcohol
   - Let dry completely

3. **Apply stickers:**
   - Peel backing from one sticker
   - Center on dice face
   - Press firmly from center outward to avoid bubbles
   - Smooth edges with fingernail or credit card

4. **Face orientation guide:**
   - **Opposite faces on standard d6:** 1-6, 2-5, 3-4
   - **For Harvest dice:** Keep bust faces on positions 4 & 5 (opposite 3 & 2)
   - Blank face on position 6 (opposite 1)

5. **Seal (optional):**
   - Spray with clear acrylic sealer
   - 2-3 light coats
   - Let dry 24 hours between coats
   - Improves durability and water resistance

### Alternative: Professional Dice Printing

If you prefer professionally printed dice:

- **Chessex Custom Dice** - Custom dice printing service
- **The Game Crafter** - Print-on-demand game components including dice
- **Panda Game Manufacturing** - Bulk custom dice (500+ minimum)

Provide the PNG exports and specify the wood brown/golden yellow color scheme.

## Tabletop Simulator (TTS)

### Setup for TTS

1. **Export all faces:**
   ```bash
   node export.js --all
   ```

2. **Upload PNGs to image hosting:**
   - Use Imgur, Steam Cloud, or TTS Workshop
   - Each face needs a public URL

3. **Create custom dice in TTS:**
   - In-game: Objects → Components → Custom → Dice → Custom Dice
   - Or use the dice customizer tool
   - Map each PNG to corresponding face

4. **Face mapping:**
   - Face 1: `harvest_face_1.png`
   - Face 2: `harvest_face_2.png`
   - Face 3: `harvest_face_3.png`
   - Face 4: `harvest_face_bust.png`
   - Face 5: `harvest_face_bust.png` (same image)
   - Face 6: `harvest_face_blank.png`

5. **TTS dice settings:**
   - **Type:** D6
   - **Size:** Standard (1.0 scale)
   - **Material:** Plastic or Wood
   - **Color tint:** Brown/Gold to match the theme

6. **Save as object:**
   - Right-click dice → Save Object
   - Name: "Harvest Die"
   - Add 10 copies to your mod

### Quality Dice in TTS

For Quality Dice, use the built-in TTS d6 objects:
- Objects → Components → Dice → D6
- Color: White or Red
- Add 6 dice to the mod

No custom textures needed for Quality Dice.

## Specifications

### Individual Face Dimensions
- **Size:** 256×256px (each face)
- **Format:** PNG with transparency support
- **DPI:** 300 (print quality)
- **Physical size at 100%:** 21.7mm × 21.7mm
- **Recommended print scale:** 60-75% (13-16mm for standard dice)

### Combined Sheet Dimensions
- **Size:** 900×1200px (all 6 faces)
- **Format:** PNG
- **Layout:** 3×2 grid with labels

### Color Scheme
- **Background gradient:** Wood brown (#8B4513) to golden yellow (#FFD700)
- **Border:** Dark brown (#5d2f0a)
- **Numbers:** White with shadow effects
- **Acorn:** Brown tones (#6B4423, #D2691E, #A0522D)
- **Bust text:** White with shadow

### Design Features
- Clean sans-serif typography (Arial Black)
- High contrast for readability
- Rounded corners (8px border-radius)
- Inner shadow for depth
- Gradient background for visual interest
- Cracked acorn icon for bust face
- Small dot on blank face for distinction

## Customization

### Modifying Designs

To change the designs, edit the HTML files directly. Each file is self-contained with embedded CSS.

**Common customizations:**
- **Colors:** Change gradient colors in `.dice-face` background
- **Font size:** Adjust `.number` font-size (currently 180px)
- **Border:** Modify `.dice-face` border property
- **Acorn design:** Edit `.acorn-*` styles in bust face

### Using Different Icons

To replace the cracked acorn with a different bust icon:
1. Edit `harvest_face_bust.html`
2. Replace the `.acorn` and related CSS with your icon
3. Use SVG, emoji, or CSS shapes
4. Ensure icon is clearly recognizable at 256px

### Alternative Color Schemes

While the specification calls for wood brown/golden yellow, you can adjust:
- **Darker theme:** `#654321` to `#8B4513`
- **Autumn theme:** `#8B4513` to `#FF8C00`
- **Spring theme:** `#9ACD32` to `#FFD700`

Update the `linear-gradient` in `.dice-face` background.

## File Structure

```
components/dice/
├── README.md                    # This file
├── harvest_dice.html            # All 6 faces visualization
├── harvest_face_1.html          # Face 1: numeral "1"
├── harvest_face_2.html          # Face 2: numeral "2"
├── harvest_face_3.html          # Face 3: numeral "3"
├── harvest_face_bust.html       # Faces 4 & 5: cracked acorn/BUST
├── harvest_face_blank.html      # Face 6: blank with dot
├── export.js                    # PNG export script
└── package.json                 # Node dependencies
```

## Troubleshooting

### Export fails with "Cannot find module"

Make sure you've run `npm install` or `yarn install` first.

### Fonts look different in PNG export

The designs use Arial Black which should be available on most systems. If fonts render incorrectly, you may need to install Arial Black or modify the HTML to use a different system font.

### Stickers don't stick to dice

- Ensure dice are clean (use rubbing alcohol)
- Use high-quality sticker paper designed for your printer type
- Press firmly when applying
- Consider using clear acrylic spray as adhesive aid

### Dice faces are too large/small

Adjust the print scale when printing:
- **Standard 16mm dice:** Print at 73% scale
- **14mm dice:** Print at 64% scale
- **Jumbo 19mm dice:** Print at 87% scale

### Exported PNG has white background instead of gradient

The HTML uses CSS gradients which render correctly in Puppeteer. If you see a white background, check that:
- You're using the latest version of Puppeteer
- The HTML file hasn't been modified
- Your system has sufficient memory for rendering

### TTS dice don't show images

- Verify image URLs are publicly accessible
- Check that images are PNG format
- Ensure URLs use HTTPS (not HTTP)
- Test URLs in a web browser first

## License

Part of Houses of Havenwood game project.

## Version History

- **v1.0.0** (2026-02-07) - Initial release
  - 6 harvest dice face designs
  - Export script with Puppeteer
  - Comprehensive documentation
  - Print and TTS instructions
