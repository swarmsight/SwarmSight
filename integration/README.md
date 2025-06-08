# SwarmSight Integration

This module provides tools for integrating SwarmSight with various development environments, CI/CD pipelines, and IDEs.

## Components

The integration module consists of three main components:

### GitHub CI Integration (`github-ci-checker/`)

Tools for integrating SwarmSight with GitHub Actions and other CI/CD pipelines:

- GitHub Actions workflow templates
- Status check integration
- PR comment formatting
- Automated issue creation
- Security report generation
- Historical vulnerability tracking

### Local Integration (`local-checker/`)

Tools for integrating SwarmSight with local development environments:

- Pre-commit hooks
- IDE plugins
- CLI tools
- Git hooks
- Local configuration management
- Developer-focused reporting

### Rule Engine (`rule_engine/`)

A flexible system for creating, managing, and enforcing security rules:

- Custom rule creation framework
- Organization-specific policy enforcement
- Rule priority management
- False positive suppression
- Security standard mapping (OWASP, etc.)
- Machine learning-based rule improvement

## CI/CD Integration Examples

### GitHub Actions

```yaml
name: SwarmSight Security Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: SwarmSight Security Scan
        uses: swarmsight/github-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fail-level: high  # Fail CI on high or critical issues
          report-format: sarif
      - name: Upload SARIF file
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: swarmsight-results.sarif
```

### GitLab CI

```yaml
security_scan:
  image: swarmsight/scanner:latest
  stage: test
  script:
    - swarmsight scan --format=gitlab-json
  artifacts:
    reports:
      sast: swarmsight-report.json
```

### Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            steps {
                sh 'docker run --rm -v $(pwd):/app swarmsight/scanner:latest scan --format=jenkins-xml'
                recordIssues(tools: [checkStyle(pattern: 'swarmsight-report.xml')])
            }
        }
    }
}
```

## Local Development Integration

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit
# Ensure this file is executable: chmod +x .git/hooks/pre-commit

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Run SwarmSight on staged files
if [ -n "$STAGED_FILES" ]; then
  swarmsight scan --files "$STAGED_FILES" --quick
fi
```

### VS Code Extension

The SwarmSight VS Code extension provides:

- Real-time security feedback
- Inline issue highlighting
- Quick fix suggestions
- Detailed security explanations
- Rule customization

### Command Line Interface

```bash
# Interactive mode
swarmsight interactive

# Watch mode
swarmsight watch --path=/path/to/project

# Git hook installation
swarmsight install-hooks
```

## Rule Engine

### Custom Rule Creation

Create custom rules in JavaScript, TypeScript, or JSON:

```javascript
// custom-rules/my-rule.js
module.exports = {
  id: 'my-custom-rule',
  name: 'My Custom Security Rule',
  description: 'Detects a specific vulnerability pattern',
  severity: 'high',
  languages: ['solidity', 'rust'],
  detector: function(context) {
    // Detection logic
    return findings;
  }
};
```

### Rule Configuration

Configure rules in your project's `swarmsight.config.js`:

```javascript
module.exports = {
  rules: {
    // Enable/disable built-in rules
    'reentrancy': 'error',
    'integer-overflow': 'warning',
    'unused-variables': 'info',
    
    // Configure custom rules
    'my-custom-rule': {
      severity: 'high',
      options: {
        threshold: 5,
        ignoreTests: true
      }
    }
  }
};
```

## API Integration

SwarmSight provides a REST API for integration with custom tools:

```javascript
// Example API usage with Node.js
const axios = require('axios');

async function scanProject() {
  const response = await axios.post('https://api.swarmsight.io/scan', {
    projectId: 'my-project',
    repositoryUrl: 'https://github.com/myorg/myproject',
    branch: 'main',
    options: {
      checkers: ['slither', 'rudra'],
      severity: 'medium'
    }
  }, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    }
  });
  
  return response.data;
}
```

## Contributing

See [CONTRIBUTING_DETAILED.md](../CONTRIBUTING_DETAILED.md) for information on contributing to the integration module.

### Adding a New Integration

1. Create a new directory under the appropriate category
2. Implement the necessary integration code
3. Add documentation in this README
4. Create tests in the `integration/tests/` directory
5. Submit a pull request

## License

This module is part of SwarmSight and is licensed under the MIT License.
