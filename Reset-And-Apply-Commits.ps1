# Reset-And-Apply-Commits.ps1
# This script resets the repository history and creates a new history with individual commits per file

# Navigate to the repository root
Set-Location -Path "c:\Users\Admin\Desktop\memora\Chain-Fox-main"

Write-Host "Starting repository history reset and individual commits..." -ForegroundColor Yellow

# Backup current files to a temporary directory
Write-Host "Creating backup of all files..." -ForegroundColor Cyan
$backupDir = "C:\Temp\SwarmSight_Backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item -Path ".\*" -Destination $backupDir -Recurse -Force

# Confirm with the user
Write-Host "`nWARNING: This script will reset the Git history of this repository." -ForegroundColor Red
Write-Host "A backup of all files has been created at: $backupDir" -ForegroundColor Yellow
$confirmation = Read-Host "Do you want to continue? (y/n)"

if ($confirmation -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Reset Git repository but keep files
Write-Host "Resetting Git repository..." -ForegroundColor Cyan
git checkout --orphan temp_branch
git add -A
git commit -m "Initial commit for SwarmSight"
git branch -D main
git branch -m main

# Define all individual commits in order
$commits = @(
    @{
        "message" = "docs: add MIT license";
        "files" = @("LICENSE");
    },
    @{
        "message" = "feat: create initial project structure";
        "files" = @("cpp-checker", "detection-results", "go-checker", "integration", "move-checker", "rust-checker", "solidity-checker", "src");
    },
    @{
        "message" = "docs: add basic project README";
        "files" = @("README.md");
    },
    @{
        "message" = "docs: add security policy and vulnerability reporting";
        "files" = @("SECURITY.md");
    },
    @{
        "message" = "docs: add basic contribution guidelines";
        "files" = @("CONTRIBUTING.md");
    },
    @{
        "message" = "feat: add SVG logo generation script";
        "files" = @("Create-Logo.ps1");
    },
    @{
        "message" = "feat: generate project logo and branding assets";
        "files" = @("branding");
    },
    @{
        "message" = "docs: add branding guidelines";
        "files" = @("branding/README.md");
    },
    @{
        "message" = "feat: add script to insert logo in text files";
        "files" = @("Add-Logo.ps1");
    },
    @{
        "message" = "feat: add text-based logo";
        "files" = @("logo.txt");
    },
    @{
        "message" = "docs: add comprehensive installation guide";
        "files" = @("INSTALLATION.md");
    },
    @{
        "message" = "docs: add detailed usage documentation";
        "files" = @("USAGE.md");
    },
    @{
        "message" = "docs: expand contributor documentation with detailed guidelines";
        "files" = @("CONTRIBUTING_DETAILED.md");
    },
    @{
        "message" = "docs: document all security checks in detail";
        "files" = @("SECURITY_CHECKS.md");
    },
    @{
        "message" = "docs: document Rust checker module";
        "files" = @("rust-checker/README.md");
    },
    @{
        "message" = "docs: document Solidity checker module";
        "files" = @("solidity-checker/README.md");
    },
    @{
        "message" = "docs: document detection results module";
        "files" = @("detection-results/README.md");
    },
    @{
        "message" = "docs: document integration capabilities";
        "files" = @("integration/README.md");
    },
    @{
        "message" = "feat: add workspace restoration script";
        "files" = @("Restore-Workspace.ps1");
    },
    @{
        "message" = "feat: add automation script for git operations";
        "files" = @("Auto-Commit-Push.ps1");
    },
    @{
        "message" = "feat: add simplified commit script";
        "files" = @("Simple-Commit.ps1");
    },
    @{
        "message" = "feat: implement core security scanner";
        "files" = @("src/scanner.js");
    },
    @{
        "message" = "feat: implement command-line interface";
        "files" = @("src/cli.js");
    },
    @{
        "message" = "feat: add Rust checker module integration";
        "files" = @("src/rust-checker/index.js");
    },
    @{
        "message" = "feat: implement Lockbud static analyzer for Rust";
        "files" = @("src/rust-checker/static/lockbud.js");
    },
    @{
        "message" = "build: configure npm package with dependencies and scripts";
        "files" = @("package.json");
    },
    @{
        "message" = "docs: enhance README with complete project information";
        "files" = @("README.md");
    }
)

# Reset the working tree
Write-Host "Resetting working tree..." -ForegroundColor Cyan
git rm -rf --cached .

# Create each commit individually
foreach ($commit in $commits) {
    $message = $commit.message
    $files = $commit.files
    
    Write-Host "`nCreating commit: $message" -ForegroundColor Cyan
    
    # Add the specified files
    foreach ($file in $files) {
        if (Test-Path $file -PathType Container) {
            # Directory - add all files within
            $filesToAdd = Get-ChildItem -Path $file -Recurse -File
            foreach ($fileToAdd in $filesToAdd) {
                git add $fileToAdd.FullName
                Write-Host "  Added: $($fileToAdd.FullName)" -ForegroundColor Green
            }
        } elseif (Test-Path $file) {
            # Single file
            git add $file
            Write-Host "  Added: $file" -ForegroundColor Green
        } else {
            Write-Host "  Warning: File/directory not found - $file" -ForegroundColor Yellow
        }
    }
    
    # Create the commit
    git commit -m $message
}

# Force push the new history
Write-Host "`nForce pushing new history to remote repository..." -ForegroundColor Yellow
$confirmation = Read-Host "Do you want to force push the new history? This will overwrite remote history! (y/n)"

if ($confirmation -eq "y") {
    git push -f origin main
    Write-Host "Force push completed." -ForegroundColor Green
} else {
    Write-Host "Force push cancelled. You'll need to manually push the new history." -ForegroundColor Yellow
}

Write-Host "`nRepository history has been reset with individual commits for each file/component!" -ForegroundColor Green
Write-Host "Original files were backed up to: $backupDir" -ForegroundColor Cyan
