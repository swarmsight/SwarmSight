# Apply-Individual-Commits.ps1
# This script will apply multiple individual commits to your repository with specific messages for each file

# Function to commit a single file with a custom message
function Commit-SingleFile {
    param (
        [string]$FilePath,
        [string]$CommitMessage
    )
    
    # Check if file exists
    if (-not (Test-Path $FilePath)) {
        Write-Host "File not found: $FilePath" -ForegroundColor Red
        return $false
    }
    
    # Add the file to git staging
    git add $FilePath
    
    # Create the commit
    git commit -m $CommitMessage
    
    return $true
}

# Store current directory to return to it later
$currentDir = Get-Location

# Navigate to the repository root
Set-Location -Path "c:\Users\Admin\Desktop\memora\Chain-Fox-main"

# Make sure we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "Not a git repository. Make sure you're in the correct directory." -ForegroundColor Red
    exit 1
}

Write-Host "Starting individual file commits for SwarmSight..." -ForegroundColor Cyan

# Array to track successful and failed commits
$successfulCommits = @()
$failedCommits = @()

# Core Project Files
$coreFiles = @{
    "README.md" = @{
        "message" = 'docs: create comprehensive project overview

This README provides a complete overview of the SwarmSight security framework including:
- Project description and branding
- List of supported security checkers across languages
- Notable bugs found in blockchain projects
- Getting started guide
- Documentation references
- Project roadmap
- Community information'
    };
    "package.json" = @{
        "message" = 'build: configure npm package with dependencies and scripts

Add package.json with:
- Project metadata and repository information
- CLI tool configuration
- Development and runtime dependencies
- NPM scripts for testing, linting, and running the tool
- Node.js engine requirements'
    };
    "LICENSE" = @{
        "message" = 'docs: add MIT license

Add standard MIT license file to permit usage, modification, and distribution
while limiting liability and providing no warranty.'
    };
}

# Core Documentation
$documentationFiles = @{
    "INSTALLATION.md" = @{
        "message" = 'docs: add comprehensive installation guide

Create detailed installation instructions including:
- Prerequisites for different platforms
- Basic and Docker installation methods
- GitHub Actions and GitLab CI integration examples
- Advanced configuration options
- Troubleshooting common issues'
    };
    "USAGE.md" = @{
        "message" = 'docs: add detailed usage documentation

Provide comprehensive usage instructions covering:
- Basic and advanced CLI commands
- Configuration file creation
- Language-specific usage examples
- CI/CD integration
- Result interpretation
- Custom rule creation'
    };
    "SECURITY.md" = @{
        "message" = 'docs: add security policy and vulnerability reporting procedure

Establish security policy with:
- Vulnerability reporting email (security@swarmsight.io)
- Guidelines for responsible disclosure
- Best practices for secure usage'
    };
    "CONTRIBUTING.md" = @{
        "message" = 'docs: add basic contribution guidelines

Create simple contributor instructions covering:
- Fork and PR workflow
- Branch naming conventions
- Commit message format
- Code standards reference'
    };
    "CONTRIBUTING_DETAILED.md" = @{
        "message" = 'docs: expand contributor documentation with detailed guidelines

Provide in-depth contribution information including:
- Code of conduct
- Development environment setup
- Project structure explanation
- Workflow details
- Testing guidelines
- Review process
- Documentation standards'
    };
    "SECURITY_CHECKS.md" = @{
        "message" = 'docs: document all security checks in detail

Create comprehensive documentation of security checks:
- Categorized by language (Rust, Go, Solidity, C++)
- Detailed explanation of each checker''s capabilities
- Description of detected bug types
- Severity level classifications
- Integration capabilities'
    };
}

# Source Code
$sourceFiles = @{
    "src\scanner.js" = @{
        "message" = 'feat: implement core security scanner

Create the main scanner module which:
- Orchestrates security checking across languages
- Loads and manages individual checker plugins
- Detects project languages automatically
- Processes and aggregates results
- Generates reports in multiple formats'
    };
    "src\cli.js" = @{
        "message" = 'feat: implement command-line interface

Create CLI wrapper with:
- Command handling (scan, list-checkers, version)
- Parameter parsing and validation
- Output formatting and color coding
- Configuration file support
- Exit code handling for CI integration'
    };
    "src\rust-checker\index.js" = @{
        "message" = 'feat: add Rust checker module integration

Implement Rust checker functionality:
- Individual checker loading and configuration
- Rust project detection and metadata extraction
- Environment checking for Rust tools
- Parallel execution of Rust security analyzers
- Result aggregation and formatting'
    };
    "src\rust-checker\static\lockbud.js" = @{
        "message" = 'feat: implement Lockbud static analyzer for Rust

Add integration with Lockbud analyzer:
- Automatic installation handling
- Configuration and execution
- Output parsing and normalization
- Finding categorization and severity assignment
- Remediation suggestion generation'
    };
}

# Scripts and Automation
$scriptFiles = @{
    "Add-Logo.ps1" = @{
        "message" = 'feat: add script to insert logo in text files

Create PowerShell script to:
- Generate ASCII art SwarmSight logo
- Insert the logo into specified text files
- Maintain proper formatting and alignment'
    };
    "Auto-Commit-Push.ps1" = @{
        "message" = 'feat: add automation script for git operations

Create PowerShell script to automate:
- Staging modified files
- Creating properly formatted commit messages
- Pushing changes to the remote repository
- Handling common git errors'
    };
    "Create-Logo.ps1" = @{
        "message" = 'feat: add SVG logo generation script

Create PowerShell script to:
- Generate SVG logos in multiple formats
- Create variations for different backgrounds
- Create icon-only and horizontal layouts
- Apply proper styling and branding colors'
    };
    "Restore-Workspace.ps1" = @{
        "message" = 'feat: add workspace restoration script

Create PowerShell script to:
- Rebuild the project directory structure
- Restore placeholder files in appropriate locations
- Set up the development environment
- Install necessary dependencies'
    };
    "Simple-Commit.ps1" = @{
        "message" = 'feat: add simplified commit script

Create PowerShell script for:
- Quick single-commit workflow
- Automatic staging of all changes
- Simplified commit message creation
- Optional push to remote repository'
    };
}

# Module Documentation
$moduleDocFiles = @{
    "branding\README.md" = @{
        "message" = 'docs: add branding guidelines and assets information

Document branding resources:
- Logo usage guidelines
- Available logo variants
- Brand color specifications
- Typography information'
    };
    "rust-checker\README.md" = @{
        "message" = 'docs: document Rust checker module

Create detailed documentation for the Rust checker:
- Components (static, dynamic, verifier)
- Usage instructions
- Configuration options
- Cargo integration
- Custom rules creation'
    };
    "solidity-checker\README.md" = @{
        "message" = 'docs: document Solidity checker module

Create comprehensive documentation for Solidity analyzers:
- Slither, Gas-Fee, Compliance and Aderyn integrations
- Configuration options
- Framework integrations (Truffle, Hardhat, Foundry)
- Custom detector creation
- Report interpretation'
    };
    "detection-results\README.md" = @{
        "message" = 'docs: document detection results module

Create documentation for result formatting:
- Available report formats (JSON, SARIF, HTML, Markdown, CSV)
- Visualization tools
- Integration formats for CI/CD
- Metrics and scoring methodology
- Historical tracking capabilities'
    };
    "integration\README.md" = @{
        "message" = 'docs: document integration capabilities

Create documentation for integration options:
- CI/CD pipeline integration (GitHub, GitLab, Jenkins)
- Local development integration
- Rule engine customization
- API integration
- Custom integration development'
    };
}

# Function to execute the commit process and track results
function Process-CommitGroup {
    param (
        [hashtable]$Files,
        [string]$GroupName
    )
    
    Write-Host "Processing $GroupName..." -ForegroundColor Yellow
    
    foreach ($file in $Files.Keys) {
        $commitDetails = $Files[$file]
        $message = $commitDetails["message"]
        
        Write-Host "Committing $file..." -ForegroundColor Cyan
        $result = Commit-SingleFile -FilePath $file -CommitMessage $message
        
        if ($result) {
            $successfulCommits += $file
            Write-Host "Successfully committed $file" -ForegroundColor Green
        } else {
            $failedCommits += $file
            Write-Host "Failed to commit $file" -ForegroundColor Red
        }
    }
}

# Process all file groups
Process-CommitGroup -Files $coreFiles -GroupName "Core Project Files"
Process-CommitGroup -Files $documentationFiles -GroupName "Documentation Files"
Process-CommitGroup -Files $sourceFiles -GroupName "Source Code Files"
Process-CommitGroup -Files $scriptFiles -GroupName "Script Files"
Process-CommitGroup -Files $moduleDocFiles -GroupName "Module Documentation Files"

# Create directory structure commit
git add -A
git commit -m 'feat: create project directory structure

Set up the complete SwarmSight directory structure with:
- Core functionality (src/)
- Language-specific checkers (rust-checker/, solidity-checker/, etc.)
- Integration components
- Result handling
- Documentation organization'

# Push all the commits to the remote repository
Write-Host "Pushing commits to remote repository..." -ForegroundColor Yellow
git push

# Summary
Write-Host "`nCommit Summary:" -ForegroundColor Cyan
Write-Host "Successfully committed files: $($successfulCommits.Count)" -ForegroundColor Green
Write-Host "Failed to commit files: $($failedCommits.Count)" -ForegroundColor $(if ($failedCommits.Count -gt 0) { "Red" } else { "Green" })

if ($failedCommits.Count -gt 0) {
    Write-Host "`nFailed files:" -ForegroundColor Red
    $failedCommits | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
}

# Return to original directory
Set-Location -Path $currentDir

Write-Host "`nIndividual commits process completed!" -ForegroundColor Green
