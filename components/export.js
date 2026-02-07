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
  { name: 'badger_worker_placement_board', width: 1100, height: 1700, folder: 'boards', output: 'boards' }
];

const ALL_CONFIGS = [...PLAYER_MAT_CONFIGS, ...BOARD_CONFIGS];

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

    // Wait a bit for fonts to load
    await page.waitForTimeout(500);

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

async function main() {
  const args = process.argv.slice(2);
  const exportAll = args.includes('--all');
  const exportMats = args.includes('--mats');
  const exportBoards = args.includes('--boards');

  console.log('========================================');
  console.log('Houses of Havenwood - Component Export');
  console.log('========================================');

  if (exportAll) {
    console.log('\nExporting all components...\n');

    for (const config of ALL_CONFIGS) {
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
  } else if (exportMats) {
    console.log('\nExporting all player mats...\n');

    for (const config of PLAYER_MAT_CONFIGS) {
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
  } else if (exportBoards) {
    console.log('\nExporting all boards...\n');

    for (const config of BOARD_CONFIGS) {
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
  } else {
    // Interactive mode or single file
    if (args.length === 0) {
      console.log('\nUsage:');
      console.log('  node export.js --all              Export all components (mats + boards)');
      console.log('  node export.js --mats             Export all player mats');
      console.log('  node export.js --boards           Export all boards');
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
      console.log('\nExamples:');
      console.log('  node export.js squirrel_mat');
      console.log('  node export.js badger_worker_placement_board');
      console.log('  npm run export-all');
      console.log('  npm run export-mats');
      console.log('  npm run export-boards');
      return;
    }

    const componentName = args[0];
    const config = ALL_CONFIGS.find(c => c.name === componentName);

    if (!config) {
      console.error(`\n✗ Unknown component name: ${componentName}`);
      console.log('\nAvailable components:', ALL_CONFIGS.map(c => c.name).join(', '));
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
