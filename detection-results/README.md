# SwarmSight Detection Results

This directory contains tools and templates for formatting, displaying, and analyzing security findings from SwarmSight.

## Overview

The detection-results module provides:

1. **Report Templates**: Standard formats for security reports
2. **Visualization Tools**: Charts and graphs for vulnerability analysis
3. **Data Export Formats**: Integration with other security tools
4. **Metrics Calculation**: Security scoring and trend analysis
5. **Historical Tracking**: Vulnerability trend monitoring

## Report Formats

SwarmSight supports the following report formats:

### JSON Format

```json
{
  "metadata": {
    "tool": "SwarmSight",
    "version": "1.0.0",
    "timestamp": "2023-11-15T10:30:00Z",
    "project": "MyProject"
  },
  "summary": {
    "total": 12,
    "critical": 1,
    "high": 3,
    "medium": 5,
    "low": 3,
    "info": 0
  },
  "findings": [
    {
      "id": "SST-001",
      "title": "Reentrancy Vulnerability",
      "severity": "critical",
      "category": "Security",
      "description": "...",
      "location": {
        "file": "contracts/MyContract.sol",
        "line": 42,
        "column": 10
      },
      "recommendation": "...",
      "codeSnippet": "...",
      "references": []
    }
    // Additional findings...
  ]
}
```

### SARIF Format

Security Analysis Results Interchange Format (SARIF) for integration with GitHub Code Scanning and other tools.

### HTML Reports

Interactive HTML reports with:
- Filtering capabilities
- Collapsible sections
- Code snippets with highlighting
- Vulnerability explanations
- Fix recommendations

### Markdown Reports

Markdown format for easy inclusion in documentation:

```markdown
# Security Report: MyProject

## Summary
- **Critical**: 1
- **High**: 3
- **Medium**: 5
- **Low**: 3

## Findings

### [Critical] Reentrancy Vulnerability
**Location**: `contracts/MyContract.sol:42`

**Description**: This function is vulnerable to reentrancy attacks...

**Recommendation**: Implement checks-effects-interactions pattern...

...
```

### CSV Format

For importing into spreadsheets and data analysis tools.

## Visualization Tools

SwarmSight provides several visualization tools:

### Security Dashboard

An interactive dashboard showing:
- Vulnerability trends over time
- Distribution by severity
- Distribution by category
- Most affected files/components
- Fix progress tracking

### Dependency Vulnerability Map

Visual representation of security issues in dependencies.

### Code Heatmap

Color-coded visualization of code security issues.

## Integration Formats

### CI/CD Integration

- GitHub Code Scanning format
- GitLab Security Dashboard format
- Jenkins Security warnings format

### Bug Tracking Integration

Automated creation of:
- GitHub Issues
- JIRA tickets
- Trello cards
- Azure DevOps work items

## Metrics and Scoring

SwarmSight calculates several security metrics:

### Security Score

A composite score (0-100) based on:
- Number and severity of findings
- Coverage of security checks
- Time to fix vulnerabilities
- Technical debt related to security

### Risk Analysis

- Exploitability rating
- Impact assessment
- Attack vector classification
- Required attacker skill level

## Historical Tracking

Track security trends over time:

- New vulnerabilities introduced
- Vulnerabilities fixed
- Recurring issues
- Average fix time

## Usage

### Generating Reports

```bash
# Generate a JSON report
swarmsight scan --output-format=json --output-file=report.json

# Generate an HTML report
swarmsight scan --output-format=html --output-file=report.html

# Generate a SARIF report for GitHub
swarmsight scan --output-format=sarif --output-file=report.sarif
```

### Customizing Reports

Create custom report templates in the `templates` directory:

```
detection-results/
├── templates/
│   ├── html/
│   │   ├── custom-template.hbs
│   ├── markdown/
│   │   ├── custom-template.md
```

Configure custom templates in your `swarmsight.config.js`:

```javascript
module.exports = {
  reporting: {
    template: 'custom-template',
    branding: {
      logo: './company-logo.png',
      colors: {
        primary: '#0066FF',
        secondary: '#FFD700'
      }
    }
  }
};
```

## Contributing

See [CONTRIBUTING_DETAILED.md](../CONTRIBUTING_DETAILED.md) for information on contributing to the detection-results module.

### Adding a New Report Format

1. Create a new formatter in `detection-results/formatters/`
2. Add templates in `detection-results/templates/`
3. Update the CLI options in `detection-results/cli.js`
4. Add tests in `detection-results/tests/`
5. Update documentation in this README

## License

This module is part of SwarmSight and is licensed under the MIT License.
