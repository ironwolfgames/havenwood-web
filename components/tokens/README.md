# Tokens & Markers - Houses of Havenwood

This directory contains HTML files for all game tokens and markers used in Houses of Havenwood. Each token is designed for printing at 300 DPI and can be viewed in any web browser or exported as PNG images.

## Directory Contents

### Resource Tokens (300×300px / 1" diameter)
Basic and composite resource tokens for the game economy:

- `food_token.html` - Yellow/golden token with wheat sheaf icon
- `wood_token.html` - Brown token with tree log icon
- `ore_token.html` - Dark grey/silver token with crystal icon
- `stone_token.html` - Light grey token with stone block icon
- `lumber_token.html` - Light brown composite token with planks icon (dashed border)
- `steel_token.html` - Silver/metallic composite token with ingot icon (double border)
- `stone_brick_token.html` - Red-brown composite token with brick pattern (double border)

**Suggested Quantity:** 30 of each type (210 total resource tokens)

### House Markers (450×450px / 1.5" diameter)
Faction identity markers for player boards:

- `squirrel_marker.html` - Red/orange with squirrel silhouette
- `fox_marker.html` - Orange/rust with fox silhouette
- `owl_marker.html` - Brown/tan with owl silhouette
- `badger_marker.html` - Black/grey with badger silhouette and white stripe

**Suggested Quantity:** 1 of each (4 total markers)

### Special Tokens

#### Fox Walls (225×225px / 0.75" square)
Progressive wall defense tokens:

- `fox_wall_level1.html` - Grey stone wall
- `fox_wall_level2.html` - Stone wall with battlements
- `fox_wall_level3.html` - Stone wall with towers

**Suggested Quantity:** 4 of each level (12 total)

#### Fortifications (225×225px / 0.75" shield shape)
Defensive fortification tokens:

- `fortification_level1.html` - Wooden shield with wood grain
- `fortification_level2.html` - Stone shield with masonry
- `fortification_level3.html` - Metal shield with rivets and glow

**Suggested Quantity:** 4 of each level (12 total)

#### Game Tokens (300×300px / 1")
Various game state and tracking tokens:

- `magic_shield.html` - Purple/blue hexagon with energy effect (6 tokens)
- `blocked_token.html` - Red octagon with X mark (6 tokens)
- `bandit_token.html` - Black/dark red circle with skull (6 tokens)
- `knowledge_tracker.html` - Blue circle with book icon (1 token)
- `insight_tracker.html` - Purple circle with crystal ball icon (1 token)
- `round_marker.html` - White/neutral circle with clock icon (1 token)

#### Large Markers (450×450px / 1.5")
Special game state markers:

- `storm_marker.html` - Black/grey circle with storm cloud and lightning (1 token)

### Index File

- `index.html` - Comprehensive display of all tokens organized by category. Open this file in a browser to preview all tokens at once. Useful for batch printing or quick reference.

## File Naming Convention

Files follow this naming pattern:
- `{resource}_token.html` - For resource tokens
- `{faction}_marker.html` - For house/faction markers
- `{type}_level{1-3}.html` - For progressive tokens
- `{name}_{type}.html` - For special tokens

## How to Use

### Viewing Tokens
1. Open any HTML file in a web browser to view the token
2. Open `index.html` to see all tokens at once in a grid layout

### Exporting as PNG
Option 1 - Browser Screenshot:
1. Open the token HTML file in a browser
2. Use browser screenshot tools or extensions to capture the token
3. Crop to exact dimensions if needed

Option 2 - Print to PDF:
1. Open the token HTML file
2. Use Print (Ctrl+P / Cmd+P)
3. Select "Save as PDF"
4. Choose portrait orientation
5. Convert PDF to PNG if needed using image editing software

Option 3 - Automated Export:
Use the `export.js` script in the parent `player_mats` directory (if available) or similar headless browser tools like Puppeteer to batch export all tokens.

### Printing

#### Print Settings
- **Resolution:** 300 DPI
- **Paper:** Heavy cardstock (110 lb / 300 gsm recommended)
- **Color Mode:** Full color
- **Margins:** Minimal or borderless if possible

#### Preparation
1. Open `index.html` or individual token files
2. Use browser print function (Ctrl+P / Cmd+P)
3. Adjust print settings for quality and scale
4. Consider printing multiple copies per sheet to save paper

#### Post-Processing
1. Cut out tokens using:
   - Circle punches (1", 1.5" for round tokens)
   - Craft knife and cutting mat for precise cuts
   - Corner rounder for square tokens
2. Optional: Laminate tokens for durability
3. Optional: Mount on thin cardboard or foam board for thickness

### Batch Printing Tips

For efficient printing of multiple copies:

1. Use `index.html` to print all tokens together
2. Print multiple copies of the page for quantity requirements
3. Alternatively, use PDF merging tools to create sheets with repeated tokens:
   - 30× Food tokens on one sheet
   - 30× Wood tokens on one sheet
   - etc.

## Design Guidelines

All tokens follow these design principles:

- **Inline CSS:** All styling is self-contained in each HTML file
- **Georgia Font:** Uses Georgia serif font for all text
- **Print-Optimized:** Includes `@media print` rules for proper sizing
- **Consistent Colors:** Matches the color palette from REMAINING_COMPONENTS.md
- **Visual Hierarchy:** Clear icons and text for easy identification
- **Borders:** Composite resources use distinct borders (dashed/double) to differentiate them

### Token Specifications

| Token Type | Size (px) | Size (inches) | Shape | Border Style |
|------------|-----------|---------------|-------|--------------|
| Resource (Basic) | 300×300 | 1" | Circle | Solid |
| Resource (Composite) | 300×300 | 1" | Circle | Dashed/Double |
| House Markers | 450×450 | 1.5" | Circle | Solid |
| Fox Walls | 225×225 | 0.75" | Square | Solid |
| Fortifications | 225×225 | 0.75" | Hexagon | Solid |
| Special Tokens | 300×300 | 1" | Varies | Solid |
| Large Markers | 450×450 | 1.5" | Circle | Solid |

## Color Reference

### House Colors
- Squirrels: `#D2691E` (chocolate/red-orange)
- Foxes: `#FF8C00` (dark orange)
- Owls: `#8B7355` (burlywood/tan)
- Badgers: `#2F4F4F` (dark slate grey)

### Resource Colors
- Food: `#FFD700` (gold/yellow)
- Wood: `#8B4513` (saddle brown)
- Ore: `#696969` (dim grey)
- Stone: `#C0C0C0` (silver/light grey)
- Lumber: `#DEB887` (burlywood)
- Steel: `#B0C4DE` (light steel blue)
- Stone Brick: `#A0522D` (sienna/red-brown)

### Special Colors
- Knowledge: `#4169E1` (royal blue)
- Insight: `#9370DB` (medium purple)
- Magic Shield: `#9370DB` (medium purple)
- Blocked: `#DC143C` (crimson red)
- Bandit: `#2F2F2F` (dark grey) with `#8B0000` (dark red)
- Storm: `#2F4F4F` (dark slate grey) with `#FFD700` (gold lightning)

## Maintenance

When updating tokens:

1. Maintain the same HTML structure and CSS patterns
2. Keep file sizes reasonable (< 5KB per token)
3. Test in multiple browsers (Chrome, Firefox, Safari)
4. Verify print dimensions match specifications
5. Update this README if adding new token types
6. Update `index.html` to include new tokens

## Related Files

- `../player_mats/` - Player mat HTML files with similar design patterns
- `../boards/` - Game board HTML files
- `../../REMAINING_COMPONENTS.md` - Full component specifications

## Credits

Tokens designed for Houses of Havenwood board game. All components use CSS-based graphics for easy editing and scalability.
