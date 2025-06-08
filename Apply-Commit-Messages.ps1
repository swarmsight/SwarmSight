# Apply-Commit-Messages.ps1
# This script creates a COMMIT_MESSAGES.md file documenting all the individual commits for the SwarmSight project

# Navigate to the repository root
Set-Location -Path "c:\Users\Admin\Desktop\memora\Chain-Fox-main"

$commitMessagesContent = @"
# SwarmSight Commit Messages

This file documents the individual commit messages for each component of the SwarmSight project.
These structured commit messages provide a clear history of how each part of the project was developed.

## Core Project Files

### README.md
```
docs: create comprehensive project overview

This README provides a complete overview of the SwarmSight security framework including:
- Project description and branding
- List of supported security checkers across languages
- Notable bugs found in blockchain projects
- Getting started guide
- Documentation references
- Project roadmap
- Community information
```

### package.json
```
build: configure npm package with dependencies and scripts

Add package.json with:
- Project metadata and repository information
- CLI tool configuration
- Development and runtime dependencies
- NPM scripts for testing, linting, and running the tool
- Node.js engine requirements
```

### LICENSE
```
docs: add MIT license

Add standard MIT license file to permit usage, modification, and distribution
while limiting liability and providing no warranty.
```

## Core Documentation

### INSTALLATION.md
```
docs: add comprehensive installation guide

Create detailed installation instructions including:
- Prerequisites for different platforms
- Basic and Docker installation methods
- GitHub Actions and GitLab CI integration examples
- Advanced configuration options
- Troubleshooting common issues
```

### USAGE.md
```
docs: add detailed usage documentation

Provide comprehensive usage instructions covering:
- Basic and advanced CLI commands
- Configuration file creation
- Language-specific usage examples
- CI/CD integration
- Result interpretation
- Custom rule creation
```

### SECURITY.md
```
docs: add security policy and vulnerability reporting procedure

Establish security policy with:
- Vulnerability reporting email (security@swarmsight.io)
- Guidelines for responsible disclosure
- Best practices for secure usage
```

### CONTRIBUTING.md
```
docs: add basic contribution guidelines

Create simple contributor instructions covering:
- Fork and PR workflow
- Branch naming conventions
- Commit message format
- Code standards reference
```

### CONTRIBUTING_DETAILED.md
```
docs: expand contributor documentation with detailed guidelines

Provide in-depth contribution information including:
- Code of conduct
- Development environment setup
- Project structure explanation
- Workflow details
- Testing guidelines
- Review process
- Documentation standards
```

### SECURITY_CHECKS.md
```
docs: document all security checks in detail

Create comprehensive documentation of security checks:
- Categorized by language (Rust, Go, Solidity, C++)
- Detailed explanation of each checker's capabilities
- Description of detected bug types
- Severity level classifications
- Integration capabilities
```

## Source Code

### src/scanner.js
```
feat: implement core security scanner

Create the main scanner module which:
- Orchestrates security checking across languages
- Loads and manages individual checker plugins
- Detects project languages automatically
- Processes and aggregates results
- Generates reports in multiple formats
```

### src/cli.js
```
feat: implement command-line interface

Create CLI wrapper with:
- Command handling (scan, list-checkers, version)
- Parameter parsing and validation
- Output formatting and color coding
- Configuration file support
- Exit code handling for CI integration
```

### src/rust-checker/index.js
```
feat: add Rust checker module integration

Implement Rust checker functionality:
- Individual checker loading and configuration
- Rust project detection and metadata extraction
- Environment checking for Rust tools
- Parallel execution of Rust security analyzers
- Result aggregation and formatting
```

### src/rust-checker/static/lockbud.js
```
feat: implement Lockbud static analyzer for Rust

Add integration with Lockbud analyzer:
- Automatic installation handling
- Configuration and execution
- Output parsing and normalization
- Finding categorization and severity assignment
- Remediation suggestion generation
```

## Scripts and Automation

### Add-Logo.ps1
```
feat: add script to insert logo in text files

Create PowerShell script to:
- Generate ASCII art SwarmSight logo
- Insert the logo into specified text files
- Maintain proper formatting and alignment
```

### Auto-Commit-Push.ps1
```
feat: add automation script for git operations

Create PowerShell script to automate:
- Staging modified files
- Creating properly formatted commit messages
- Pushing changes to the remote repository
- Handling common git errors
```

### Create-Logo.ps1
```
feat: add SVG logo generation script

Create PowerShell script to:
- Generate SVG logos in multiple formats
- Create variations for different backgrounds
- Create icon-only and horizontal layouts
- Apply proper styling and branding colors
```

### Restore-Workspace.ps1
```
feat: add workspace restoration script

Create PowerShell script to:
- Rebuild the project directory structure
- Restore placeholder files in appropriate locations
- Set up the development environment
- Install necessary dependencies
```

### Simple-Commit.ps1
```
feat: add simplified commit script

Create PowerShell script for:
- Quick single-commit workflow
- Automatic staging of all changes
- Simplified commit message creation
- Optional push to remote repository
```

## Module Documentation

### branding/README.md
```
docs: add branding guidelines and assets information

Document branding resources:
- Logo usage guidelines
- Available logo variants
- Brand color specifications
- Typography information
```

### rust-checker/README.md
```
docs: document Rust checker module

Create detailed documentation for the Rust checker:
- Components (static, dynamic, verifier)
- Usage instructions
- Configuration options
- Cargo integration
- Custom rules creation
```

### solidity-checker/README.md
```
docs: document Solidity checker module

Create comprehensive documentation for Solidity analyzers:
- Slither, Gas-Fee, Compliance and Aderyn integrations
- Configuration options
- Framework integrations (Truffle, Hardhat, Foundry)
- Custom detector creation
- Report interpretation
```

### detection-results/README.md
```
docs: document detection results module

Create documentation for result formatting:
- Available report formats (JSON, SARIF, HTML, Markdown, CSV)
- Visualization tools
- Integration formats for CI/CD
- Metrics and scoring methodology
- Historical tracking capabilities
```

### integration/README.md
```
docs: document integration capabilities

Create documentation for integration options:
- CI/CD pipeline integration (GitHub, GitLab, Jenkins)
- Local development integration
- Rule engine customization
- API integration
- Custom integration development
```

## Directory Structure

```
feat: create initial directory structure for core modules

Set up the basic project structure with directories for:
- Core functionality (src/)
- Language-specific checkers (rust-checker/, solidity-checker/, etc.)
- Integration components
- Result handling
```

```
feat: add placeholder files for language-specific checkers

Add structure for language modules:
- Rust checker with static, dynamic, and verifier components
- Solidity checker with various analyzer integrations
- Go and C++ checker foundations
- Move language initial structure
```
"@

# Write the commit messages to file
$commitMessagesContent | Out-File -FilePath "COMMIT_MESSAGES.md" -Encoding utf8

Write-Host "Created COMMIT_MESSAGES.md with all individual commit messages!" -ForegroundColor Green

# Add and commit the file
git add COMMIT_MESSAGES.md
git commit -m "docs: add file documenting structured commit messages for the project"

# Ask about pushing
$confirmation = Read-Host "Do you want to push this commit to the remote repository? (y/n)"

if ($confirmation -eq "y") {
    git push
    Write-Host "Changes pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "Changes committed locally but not pushed." -ForegroundColor Yellow
}

Write-Host "`nCommit messages documentation has been added to the repository!" -ForegroundColor Green
