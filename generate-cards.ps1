#!/usr/bin/env pwsh
# Generate HTML and images for all decks using cardigan

Write-Host "Generating card files for all decks..." -ForegroundColor Cyan

# Navigate to cardigan directory
Push-Location lib/cardigan

$decks = @(
    "action_deck",
    "event_deck",
    "great_works",
    "production_deck",
    "research_deck",
    "reference_cards"
)

foreach ($deck in $decks) {
    Write-Host "`nGenerating $deck..." -ForegroundColor Yellow
    $configPath = "../../components/${deck}_config.json"
    $htmlPath = "../../output/${deck}.html"
    $imagesPath = "../../output/${deck}_images/"
    
    # Generate HTML
    Write-Host "  Generating HTML..." -ForegroundColor Gray
    yarn cardigan html $configPath $htmlPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ HTML generated" -ForegroundColor Green
    } else {
        Write-Host "  ✗ HTML generation failed" -ForegroundColor Red
        continue
    }
    
    # Generate Images
    Write-Host "  Generating images..." -ForegroundColor Gray
    yarn cardigan images $configPath $imagesPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Images generated" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Image generation failed" -ForegroundColor Red
    }
}

# Return to original directory
Pop-Location

Write-Host "`nCard generation complete!" -ForegroundColor Cyan
Write-Host "  HTML files: ./output/*.html" -ForegroundColor Gray
Write-Host "  Images: ./output/*_images/" -ForegroundColor Gray
