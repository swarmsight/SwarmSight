# Simple script to commit all files with a clean message and push to GitHub

Write-Host "=== SwarmSight Repository Setup ===" -ForegroundColor Cyan

# Initialize Git repository if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository initialized." -ForegroundColor Green
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

# Configure remote
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "Removing existing origin remote..." -ForegroundColor Yellow
    git remote remove origin
}

Write-Host "Adding GitHub repository as remote..." -ForegroundColor Yellow
git remote add origin https://github.com/swarmsight/SwarmSight.git
Write-Host "Remote 'origin' added." -ForegroundColor Green

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .

# Commit with a descriptive message
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "SwarmSight Security Framework" -m "Complete blockchain security analysis framework with multiple language support (Rust, Go, Solidity, C++) and comprehensive detection capabilities. This framework includes static and dynamic analysis tools, integration components, and a rule engine for accurate security detection."

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "Done! Repository pushed to GitHub with a clean commit message." -ForegroundColor Green
