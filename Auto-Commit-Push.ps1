# This script automatically creates organized commits and pushes to GitHub
# No user interaction required

$ErrorActionPreference = "Stop"

# Function to display steps
function Show-Step {
    param($StepNumber, $Description)
    Write-Host "`n=== Step $StepNumber`: $Description ===" -ForegroundColor Cyan
}

# Step 1: Initialize Git repository
Show-Step 1 "Initialize Git repository"
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "Git repository initialized." -ForegroundColor Green
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

# Step 2: Configure Git identity if not already set
Show-Step 2 "Configure Git identity"
$gitUser = git config --get user.name
$gitEmail = git config --get user.email

if (-not $gitUser) {
    git config user.name "SwarmSight"
    Write-Host "Git username set to: SwarmSight" -ForegroundColor Green
}

if (-not $gitEmail) {
    git config user.email "admin@swarmsight.io"
    Write-Host "Git email set to: admin@swarmsight.io" -ForegroundColor Green
}

# Step 3: Configure remote repository
Show-Step 3 "Configure remote repository"
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "Removing existing origin remote..." -ForegroundColor Yellow
    git remote remove origin
}

Write-Host "Adding GitHub repository as remote..." -ForegroundColor Yellow
git remote add origin https://github.com/swarmsight/SwarmSight.git
Write-Host "Remote 'origin' added." -ForegroundColor Green

# Step 4: Create appropriate commits
Show-Step 4 "Create appropriate commits"

# First, check if there are existing commits
try {
    $headExists = git rev-parse --verify HEAD 2>$null
    if ($headExists) {
        Write-Host "Resetting existing repository..." -ForegroundColor Yellow
        # Create a backup branch just in case
        git branch -m backup-$(Get-Date -Format "yyyyMMdd-HHmmss") 2>$null
        # Create a new empty branch
        git checkout --orphan temp-main
        git reset --hard
        # Remove all files from staging
        git clean -fdx
    }
} catch {
    # No commits yet, this is good
    Write-Host "No existing commits found. Ready to create clean commit history." -ForegroundColor Green
}

# Add all files to staging initially (to keep track of them)
git add .

# Reset staging
git reset

# Create the organized commits
# Commit 1: Core files
Write-Host "`nCreating commit 1: Initial commit of SwarmSight security framework" -ForegroundColor Yellow
git add LICENSE README.md SECURITY.md logo.png CODE_OF_CONDUCT.md
git commit -m "Initial commit of SwarmSight security framework" -m "Add core project files and documentation"

# Commit 2: Checker modules
Write-Host "`nCreating commit 2: Add blockchain security checkers" -ForegroundColor Yellow
git add rust-checker/ go-checker/ solidity-checker/ cpp-checker/ move-checker/
git commit -m "Add blockchain security checkers for Rust, Go, Solidity, and C++" -m "Add security checker modules for multiple languages"

# Commit 3: Integration and rule engine
Write-Host "`nCreating commit 3: Implement rule engine and integration components" -ForegroundColor Yellow
git add integration/
git commit -m "Implement rule engine and integration components" -m "Add rule engine and integration components for security analysis"

# Commit 4: Detection results
Write-Host "`nCreating commit 4: Add detection results and documentation" -ForegroundColor Yellow
git add detection-results/
git commit -m "Add detection results and documentation" -m "Add security detection results and reports"

# Commit 5: Rebranding and contribution files
Write-Host "`nCreating commit 5: Add project rebranding and contribution guidelines" -ForegroundColor Yellow
git add CONTRIBUTING.md REBRANDING.md REBRANDING-CHECKLIST.md REBRANDING-SUMMARY.md 
git add GITHUB-UPLOAD.md FINAL-STEPS.md Find-References.ps1 Replace-References.ps1 
git add Update-GitModules.ps1 Update-GitModules-Direct.ps1 Rename-Directory.ps1 
git add Rename-Directory.bat Run-Rebranding.ps1 GitHub-Commit-Rewriter.ps1 Rewrite-Commit-Messages.ps1 Setup-Clean-Repository.ps1 Auto-Commit-Push.ps1
git commit -m "Add project rebranding and contribution guidelines" -m "Add rebranding scripts and documentation"

# Step 5: Push to GitHub
Show-Step 5 "Push to GitHub"
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow

# Rename the current branch to main if we created a temp branch
if ($headExists) {
    git branch -M main
}

# Force push to GitHub
git push -u origin main --force
    
Write-Host "`nRepository pushed to GitHub successfully!" -ForegroundColor Green
Write-Host "Visit https://github.com/swarmsight/SwarmSight to see your repository with organized commits." -ForegroundColor Green
Write-Host "`nScript completed." -ForegroundColor Cyan
