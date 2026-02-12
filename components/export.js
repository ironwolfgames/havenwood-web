import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PLAYER_MAT_CONFIGS = [
  { name: 'squirrel_mat', width: 3000, height: 2100, folder: 'player_mats', output: 'player_mats' },
  { name: 'fox_mat', width: 3000, height: 2100, folder: 'player_mats', output: 'player_mats' },
  { name: 'owl_mat', width: 3000, height: 2100, folder: 'player_mats', output: 'player_mats' },
  { name: 'badger_mat', width: 3000, height: 2100, folder: 'player_mats', output: 'player_mats' }
];

const BOARD_CONFIGS = [
  { name: 'badger_worker_placement_board', width: 1500, height: 2320, folder: 'boards', output: 'boards' },
  { name: 'tech_magic_tree', width: 4800, height: 2400, folder: 'boards', output: 'boards' },
  { name: 'threat_storm_track', width: 3232, height: 800, folder: 'boards', output: 'boards' }
];

const DICE_CONFIGS = [
  { name: 'harvest_dice_tts', width: 768, height: 512, folder: 'dice', output: 'dice' }
];

const TILE_CONFIGS = [
  { name: 'hex_tiles_deck', width: 3234, height: 2400, folder: 'tiles', output: 'tiles' },
];

const TOKEN_CONFIGS = [
  // Resource tokens (300x300px / 1")
  { name: 'food_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'wood_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'ore_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'stone_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'lumber_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'steel_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'stone_brick_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  // House markers (450x450px / 1.5")
  { name: 'squirrel_marker', width: 450, height: 450, folder: 'tokens', output: 'tokens' },
  { name: 'fox_marker', width: 450, height: 450, folder: 'tokens', output: 'tokens' },
  { name: 'owl_marker', width: 450, height: 450, folder: 'tokens', output: 'tokens' },
  { name: 'badger_marker', width: 450, height: 450, folder: 'tokens', output: 'tokens' },
  // Fox walls (225x225px / 0.75" square)
  { name: 'fox_wall_level1', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  { name: 'fox_wall_level2', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  { name: 'fox_wall_level3', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  // Fortifications (225x225px / 0.75")
  { name: 'fortification_level1', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  { name: 'fortification_level2', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  { name: 'fortification_level3', width: 225, height: 225, folder: 'tokens', output: 'tokens' },
  // Special tokens (300x300px / 1")
  { name: 'magic_shield', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'blocked_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'bandit_token', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'knowledge_tracker', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  { name: 'insight_tracker', width: 300, height: 300, folder: 'tokens', output: 'tokens' },
  // Large markers (450x450px / 1.5")
  { name: 'storm_marker', width: 450, height: 450, folder: 'tokens', output: 'tokens' }
];

const BUILDING_CONFIGS = [
  // Squirrel Buildings (6 cols x 3 rows)
  { name: 'squirrel_buildings', width: 1800, height: 900, folder: 'buildings', output: 'buildings' },
  { name: 'squirrel_building_back', width: 300, height: 300, folder: 'buildings', output: 'buildings' },

  // Fox Buildings (5 cols x 3 rows)
  { name: 'fox_buildings', width: 1500, height: 900, folder: 'buildings', output: 'buildings' },
  { name: 'fox_building_back', width: 300, height: 300, folder: 'buildings', output: 'buildings' },

  // Owl Buildings (4 cols x 3 rows)
  { name: 'owl_buildings', width: 1200, height: 900, folder: 'buildings', output: 'buildings' },
  { name: 'owl_building_back', width: 300, height: 300, folder: 'buildings', output: 'buildings' }
];

const ALL_CONFIGS = [...PLAYER_MAT_CONFIGS, ...BOARD_CONFIGS, ...DICE_CONFIGS, ...TILE_CONFIGS, ...TOKEN_CONFIGS, ...BUILDING_CONFIGS];

async function exportHTML(htmlFile, outputFile, width, height) {
  console.log(`\nExporting ${htmlFile}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to match the desired output size
    await page.setViewport({
      width: width,
      height: height,
      deviceScaleFactor: 1
    });

    // Load the HTML file
    const htmlPath = `file://${htmlFile}`;
    console.log(`Loading: ${htmlPath}`);
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });

    // Wait for any web fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Take screenshot
    await page.screenshot({
      path: outputFile,
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: width,
        height: height
      }
    });

    console.log(`✓ Saved to: ${outputFile}`);
    console.log(`  Dimensions: ${width}x${height}px`);
  } catch (error) {
    console.error(`✗ Error exporting ${htmlFile}:`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

async function exportConfigs(configs, label) {
  console.log(`\nExporting ${label}...\n`);

  for (const config of configs) {
    const htmlFile = join(__dirname, config.folder, `${config.name}.html`);
    const outputDir = join(__dirname, '../output', config.output);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = join(outputDir, `${config.name}.png`);

    try {
      await exportHTML(htmlFile, outputFile, config.width, config.height);
    } catch (error) {
      console.error(`Failed to export ${config.name}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const exportAll = args.includes('--all');
  const exportMats = args.includes('--mats');
  const exportBoards = args.includes('--boards');
  const exportDice = args.includes('--dice');
  const exportTiles = args.includes('--tiles');
  const exportTokens = args.includes('--tokens');
  const exportBuildings = args.includes('--buildings');

  console.log('========================================');
  console.log('Houses of Havenwood - Component Export');
  console.log('========================================');

  if (exportAll) {
    console.log('\nExporting all components...\n');
    await exportConfigs(PLAYER_MAT_CONFIGS, 'player mats');
    await exportConfigs(BOARD_CONFIGS, 'boards');
    await exportConfigs(DICE_CONFIGS, 'dice');
    await exportConfigs(TILE_CONFIGS, 'tiles');
    await exportConfigs(TOKEN_CONFIGS, 'tokens');
    await exportConfigs(BUILDING_CONFIGS, 'buildings');
  } else if (exportMats) {
    await exportConfigs(PLAYER_MAT_CONFIGS, 'player mats');
  } else if (exportBoards) {
    await exportConfigs(BOARD_CONFIGS, 'boards');
  } else if (exportDice) {
    await exportConfigs(DICE_CONFIGS, 'dice');
  } else if (exportTiles) {
    await exportConfigs(TILE_CONFIGS, 'tiles');
  } else if (exportTokens) {
    await exportConfigs(TOKEN_CONFIGS, 'tokens');
  } else if (exportBuildings) {
    await exportConfigs(BUILDING_CONFIGS, 'buildings');
  } else {
    // Interactive mode or single file
    if (args.length === 0) {
      console.log('\nUsage:');
      console.log('  node export.js --all              Export all components');
      console.log('  node export.js --mats             Export all player mats');
      console.log('  node export.js --boards           Export all boards');
      console.log('  node export.js --dice             Export all dice faces');
      console.log('  node export.js --tiles            Export all hex tiles');
      console.log('  node export.js --tokens           Export all tokens');
      console.log('  node export.js --buildings        Export all buildings');
      console.log('  node export.js <component_name>   Export specific component');
      console.log('\nAvailable components:');
      console.log('\nPlayer Mats:');
      PLAYER_MAT_CONFIGS.forEach(config => {
        console.log(`  - ${config.name}`);
      });
      console.log('\nBoards:');
      BOARD_CONFIGS.forEach(config => {
        console.log(`  - ${config.name}`);
      });
      console.log('\nDice:');
      DICE_CONFIGS.forEach(config => {
        console.log(`  - ${config.name}`);
      });
      console.log(`\nTiles: (${TILE_CONFIGS.length} available)`);
      console.log('  - hex_tiles_deck (Combined TTS deck - 7x6 grid)');
      console.log('  Use --tiles to export all tiles');
      console.log(`\nTokens: (${TOKEN_CONFIGS.length} tokens and markers)`);
      console.log('  Use --tokens to export all tokens');
      console.log(`\nBuildings: (${BUILDING_CONFIGS.length} sheets)`);
      console.log('  Use --buildings to export all buildings');
      console.log('\nExamples:');
      console.log('  node export.js squirrel_mat');
      console.log('  node export.js harvest_dice_tts');
      console.log('  node export.js hex_tiles_deck');
      console.log('  node export.js food_token');
      console.log('  npm run export-all');
      return;
    }

    const componentName = args[0];
    const config = ALL_CONFIGS.find(c => c.name === componentName);

    if (!config) {
      console.error(`\n✗ Unknown component name: ${componentName}`);
      console.log('\nTry one of these categories:');
      console.log('  --mats, --boards, --dice, --tiles, --tokens, --all');
      process.exit(1);
    }

    const htmlFile = join(__dirname, config.folder, `${config.name}.html`);
    const outputDir = join(__dirname, '../output', config.output);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = join(outputDir, `${config.name}.png`);

    await exportHTML(htmlFile, outputFile, config.width, config.height);
  }

  console.log('\n========================================');
  console.log('Export complete!');
  console.log('========================================\n');
}

main().catch(error => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
