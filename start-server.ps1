# PDF Toolkit Development Server Launcher
# This script starts the PDF Toolkit development server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PDF Toolkit Development Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory and navigate to pdf-toolkit folder
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$pdfToolkitPath = Join-Path $scriptPath "pdf-toolkit"

Write-Host "Navigating to: $pdfToolkitPath" -ForegroundColor Yellow
Set-Location $pdfToolkitPath

Write-Host "Starting PDF Toolkit development server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Run the development server
    npm run dev
} catch {
    Write-Host ""
    Write-Host "Error starting server: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}
