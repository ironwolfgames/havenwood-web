# Hex Map Tiles

This directory contains all 40 hex map tiles for Houses of Havenwood game.

## Overview

The hex tiles form the explorable map in the game. Each tile is a self-contained HTML file that can be opened in a browser, viewed on screen, and printed at the correct physical dimensions.

## Tile Specifications

- **Size**: 2" per hex side
- **Flat-to-flat**: 3.46"
- **Point-to-point**: 4"
- **Format**: Self-contained HTML with inline CSS
- **Print-ready**: Optimized for printing at actual size

## Tile Breakdown (40 total)

### Central Havenwood (1 tile)
- `hex_central.html` - Safe starting zone with ancient tree

### Plains Tiles (12 tiles)
Golden grasslands with wheat sheaf resource icon
- **+1 Food Discovery** (5 tiles): `hex_plains_food_01.html` through `hex_plains_food_05.html`
- **+1 Wood Discovery** (4 tiles): `hex_plains_wood_01.html` through `hex_plains_wood_04.html`
- **Free Move Discovery** (3 tiles): `hex_plains_move_01.html` through `hex_plains_move_03.html`
- **Allowed Buildings**: Farm 🏡, Mine ⛏️, Quarry 🗿

### Forest Tiles (12 tiles)
Dense woodland with tree log resource icon
- **+1 Wood Discovery** (5 tiles): `hex_forest_wood_01.html` through `hex_forest_wood_05.html`
- **+1 Food Discovery** (4 tiles): `hex_forest_food_01.html` through `hex_forest_food_04.html`
- **+1 Insight Discovery** (3 tiles): `hex_forest_insight_01.html` through `hex_forest_insight_03.html`
- **Allowed Buildings**: Forester Station 🌲

### Mountain Tiles (8 tiles)
Rocky peaks with stone resource icon
- **+1 Stone Discovery** (4 tiles): `hex_mountain_stone_01.html` through `hex_mountain_stone_04.html`
- **+1 Ore Discovery** (3 tiles): `hex_mountain_ore_01.html` through `hex_mountain_ore_03.html`
- **+1 Knowledge Discovery** (1 tile): `hex_mountain_knowledge_01.html` (RARE)
- **Allowed Buildings**: Mine ⛏️, Quarry 🗿

### River Tiles (7 tiles)
Flowing waters with water droplet resource icon
- **+1 Food Discovery** (3 tiles): `hex_river_food_01.html` through `hex_river_food_03.html`
- **+1 Insight Discovery** (2 tiles): `hex_river_insight_01.html` through `hex_river_insight_02.html`
- **Free Fort Lvl 1 Discovery** (2 tiles): `hex_river_fort_01.html` through `hex_river_fort_02.html`
- **Allowed Buildings**: Farm 🏡

## Usage

### Viewing All Tiles
Open `index.html` in a web browser to see a gallery of all 40 tiles with organized sections and descriptions.

### Viewing Individual Tiles
Open any `hex_*.html` file directly in a web browser to view a single tile.

### Printing Tiles

1. Open the tile(s) you want to print in a web browser
2. Use the browser's print function (Ctrl+P or Cmd+P)
3. **Important**: Set print scaling to "Actual Size" or "100%" to maintain correct dimensions
4. Verify in print preview that the tile measures approximately 4" point-to-point
5. Print on cardstock (recommended: 110lb cover weight) for durability

### Printing All Tiles
1. Open `index.html` in a web browser
2. Click the "Print All Tiles" button in the bottom-right corner
3. This will open all 40 tiles in separate tabs for batch printing

## Design Elements

Each tile includes:

1. **Background Layer**: Terrain-specific gradient (plains, forest, mountain, or river)
2. **Resource Icon**: Large central emoji symbol (60% of hex)
3. **Discovery Badge**: Small circle in top-right with discovery bonus text
4. **Allowed Buildings**: Small icon strip at bottom showing buildable structures
5. **Border**: Thin black line defining the hexagon edge

## Color Palette

### Resource Colors
- Food: Green (#32CD32)
- Wood: Brown (#8B4513)
- Stone: Light Grey (#C0C0C0)
- Ore: Dark Grey (#696969)
- Knowledge: Blue (#4169E1)
- Insight: Purple (#9370DB)

### Terrain Backgrounds
- Plains: Golden yellow gradient (#FFE4B5 to #DAA520)
- Forest: Dark green gradient (#228B22 to #004d00)
- Mountain: Grey gradient (#A9A9A9 to #505050)
- River: Blue gradient (#87CEEB to #1E90FF)
- Central: Lush green gradient (#90EE90 to #006400)

## Technical Details

### HTML Structure
- Complete standalone HTML documents
- Inline CSS for portability
- CSS clip-path for hexagon shape
- Responsive design with print media queries

### Print Styles
```css
@media print {
    .hex-container {
        width: 4in;
        height: 4.62in;
        page-break-after: always;
    }
    
    @page {
        size: 5in 6in;
        margin: 0.5in;
    }
}
```

### Browser Compatibility
All tiles should work in modern browsers:
- Chrome/Edge (recommended for printing)
- Firefox
- Safari

## File Naming Convention

Pattern: `hex_{terrain}_{discovery-type}_{number}.html`

- `{terrain}`: plains, forest, mountain, river, or central
- `{discovery-type}`: food, wood, stone, ore, knowledge, insight, move, fort
- `{number}`: Two-digit number (01, 02, etc.)

## Maintenance

When adding or modifying tiles:

1. Follow the existing naming convention
2. Maintain the hex dimensions (400px screen, 4in print)
3. Use the established color palette
4. Include appropriate resource icons and discovery badges
5. Test print output to verify dimensions
6. Update the index.html file to include new tiles

## Credits

Created for Houses of Havenwood board game prototype
Uses emoji icons for resource and building representations
Designed for easy printing and playtesting
