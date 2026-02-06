import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAT_CONFIGS = [
  { name: 'squirrel_mat', width: 3000, height: 2100 },
  { name: 'fox_mat', width: 3000, height: 2100 },
  { name: 'owl_mat', width: 3000, height: 2100 },
  { name: 'badger_mat', width: 3000, height: 2100 }
];

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
    const htmlPath = `file://${join(__dirname, htmlFile)}`;
    console.log(`Loading: ${htmlPath}`);
    await page.goto(htmlPath, { waitUntil: 'networkidle0' });

    // Take screenshot at 300 DPI equivalent
    // For 300 DPI at 10" x 7", we need 3000 x 2100 pixels
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
    console.log(`  Dimensions: ${width}x${height}px (300 DPI)`);
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

  // Create output directory if it doesn't exist
  const outputDir = join(__dirname, '../../output/player_mats');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log('========================================');
  console.log('Houses of Havenwood - Player Mat Export');
  console.log('========================================');
  console.log(`Output directory: ${outputDir}`);

  if (exportAll) {
    console.log('\nExporting all player mats...\n');

    for (const config of MAT_CONFIGS) {
      const htmlFile = `${config.name}.html`;
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
      console.log('  node export.js --all              Export all player mats');
      console.log('  node export.js <mat_name>         Export specific mat');
      console.log('\nAvailable mats:');
      MAT_CONFIGS.forEach(config => {
        console.log(`  - ${config.name}`);
      });
      console.log('\nExample:');
      console.log('  node export.js squirrel_mat');
      console.log('  yarn export-all');
      return;
    }

    const matName = args[0];
    const config = MAT_CONFIGS.find(c => c.name === matName);

    if (!config) {
      console.error(`\n✗ Unknown mat name: ${matName}`);
      console.log('\nAvailable mats:', MAT_CONFIGS.map(c => c.name).join(', '));
      process.exit(1);
    }

    const htmlFile = `${config.name}.html`;
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
