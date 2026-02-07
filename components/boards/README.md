# Boards - Houses of Havenwood

This folder contains HTML designs for game boards used during play.

## Contents

- `badger_worker_placement_board.html` - Great Work Progress Board for worker placement mechanics

## Exporting Boards

The export functionality is located in the parent `components/` folder and supports exporting both player mats and boards.

### Setup

1. Install Node.js dependencies:

```powershell
cd components
npm install
```

This will install Puppeteer (~350MB download - includes Chromium browser).

### Export Commands

To export all boards:

```powershell
cd components
npm run export-boards
```

To export a specific board:

```powershell
cd components
node export.js badger_worker_placement_board
```

To export all components (mats + boards):

```powershell
cd components
npm run export-all
```

### Output

PNG files are exported to: `../output/boards/`

## Board Specifications

### Badger Worker Placement Board

- **Size**: 1100px × 1700px (display size)
- **Format**: PNG
- **Purpose**: Shared board for Great Work construction progress
- **Font**: Raleway (loaded from Google Fonts)

#### Features

- **Expertise Track**: 6-level progression track (0-5)
- **5 Worker Placement Spaces**:
  1. Construct Component - Start new component construction
  2. Train - Increase expertise level
  3. Ensure Quality - Roll dice to complete components
  4. Install Component - Add completed components to Great Work (2 workers)
  5. Commission - Win condition if all components installed (2 workers)
- **3 Storage Areas**:
  - Under Construction - Components being built
  - Completed - Finished components awaiting installation
  - Installed - Permanently installed components

## Customization

To modify the board design, edit the HTML file directly. Each file is self-contained with embedded CSS.

### Key Design Elements

- **Font**: Raleway (via Google Fonts)
- **Color Scheme**: Dark slate gray (#2F4F4F) to olive (#556B2F) with gold accents (#FFD700)
- **No animations**: Static design for clean printing
- **Responsive**: Includes media queries for smaller screens

### Print Specifications

For physical prototypes:

1. Export PNG at display size (1100×1700px)
2. Scale to desired physical dimensions maintaining aspect ratio
3. Print on heavy cardstock or mount to foam board
4. Recommended physical size: Scale to fit gameplay needs

## Tabletop Simulator

For TTS mod creation:

1. Export PNG using the export script
2. Upload to image hosting or Steam Workshop
3. Use as "Custom Board" object in TTS
4. Adjust physical dimensions in TTS as needed for gameplay

## License

Part of Houses of Havenwood game project.
