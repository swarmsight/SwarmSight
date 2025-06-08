# SwarmSight Usage Guide

This guide explains how to use SwarmSight effectively for detecting security vulnerabilities in blockchain projects.

## Basic Usage

### Command Line Interface

SwarmSight can be used directly from the command line:

```bash
# Basic scan of a project
swarmsight scan /path/to/project

# Scan with specific checkers
swarmsight scan /path/to/project --checkers=rudra,slither,GCatch

# Generate a report
swarmsight scan /path/to/project --output-format=json --output-file=report.json
```

### Configuration File

For more advanced configuration, create a `swarmsight.config.js` file in your project root:

```javascript
module.exports = {
  // Project details
  project: {
    name: 'My Blockchain Project',
    version: '1.0.0',
  },
  
  // Checkers to use
  checkers: {
    rust: ['lockbud', 'rudra', 'RAPx'],
    solidity: ['slither', 'PeCatch'],
    go: ['GCatch'],
    cpp: ['cppcheck'],
  },
  
  // Files to include/exclude
  include: ['src/**/*.rs', 'contracts/**/*.sol'],
  exclude: ['**/node_modules/**', '**/test/**'],
  
  // Severity thresholds
  severityThreshold: 'medium', // Ignore low severity issues
  
  // Report configuration
  report: {
    format: 'html',
    output: './security-report.html',
  },
};
```

## Language-Specific Usage

### Rust Projects

For Rust projects, SwarmSight integrates with cargo:

```bash
# Install the SwarmSight cargo extension
cargo install swarmsight-cargo

# Run analysis
cargo swarmsight

# Analyze specific crates
cargo swarmsight --crate mycrate
```

### Solidity Projects

For Solidity smart contracts:

```bash
# Analyze a specific contract
swarmsight scan --solidity-file=MyContract.sol

# Analyze a Truffle project
swarmsight scan --truffle-project

# Analyze a Hardhat project
swarmsight scan --hardhat-project
```

### Go Projects

For Go projects:

```bash
# Analyze a Go project
swarmsight scan --go-project

# Analyze specific packages
swarmsight scan --go-packages="github.com/myorg/myproject/pkg1,github.com/myorg/myproject/pkg2"
```

## CI/CD Integration Examples

### GitHub Actions

```yaml
# Example GitHub workflow for SwarmSight
name: Security Analysis

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  swarmsight:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
          
      - name: Install SwarmSight
        run: npm install -g @swarmsight/cli
        
      - name: Run Security Analysis
        run: swarmsight scan --ci --fail-on-high
        
      - name: Upload Security Report
        uses: actions/upload-artifact@v2
        with:
          name: security-report
          path: swarmsight-report.json
```

### Travis CI

```yaml
# Example .travis.yml file
language: node_js
node_js:
  - 14
  
before_install:
  - npm install -g @swarmsight/cli
  
script:
  - swarmsight scan --ci
  
after_success:
  - swarmsight report --format=markdown > SECURITY_REPORT.md
```

## Interpreting Results

SwarmSight provides detailed information about identified vulnerabilities:

1. **Severity Level**: Critical, High, Medium, Low
2. **Vulnerability Type**: Category of the detected issue
3. **Location**: File, line, and column of the detected issue
4. **Description**: Explanation of the vulnerability
5. **Recommendation**: Suggested fix or mitigation

Example report output:

```
CRITICAL: Use-After-Free vulnerability detected
  File: src/memory.rs
  Line: 42, Column: 10
  Description: Memory is freed but then accessed later in the function
  Recommendation: Ensure the memory is not accessed after being freed, or use a safer pattern like Rc<T> or Arc<T>
```

## Advanced Features

### Custom Rules

Create custom security rules:

```javascript
// my-custom-rules.js
module.exports = [
  {
    id: 'custom-private-key-check',
    name: 'Private Key Exposure',
    description: 'Detects hardcoded private keys in source code',
    severity: 'critical',
    regex: /private[_\s]key\s*=\s*["']([0-9a-fA-F]{64})["']/g,
    message: 'Hardcoded private key detected',
  }
];

// Use with CLI
swarmsight scan --custom-rules=my-custom-rules.js
```

### Integration with IDEs

SwarmSight provides plugins for popular IDEs:

- **VS Code**: Install the "SwarmSight Security" extension
- **IntelliJ IDEA**: Install the "SwarmSight" plugin
- **Sublime Text**: Install via Package Control

### Continuous Monitoring

Set up continuous monitoring:

```bash
# Start monitoring mode
swarmsight monitor --project=/path/to/project

# Monitor with webhook notifications
swarmsight monitor --webhook=https://example.com/webhook
```

## Best Practices

1. **Run Early and Often**: Integrate SwarmSight into your development workflow from the start
2. **Address High Severity Issues First**: Prioritize critical and high severity issues
3. **Use Custom Rules**: Create project-specific rules for your unique security requirements
4. **Integrate with CI/CD**: Automate security checks in your pipeline
5. **Regular Updates**: Keep SwarmSight updated to get the latest security checks

## Support and Community

For additional help:

- Join our [Discord server](https://discord.gg/swarmsight)
- Visit our [Forum](https://forum.swarmsight.io)
- Check our [Documentation](https://docs.swarmsight.io)
- Report issues on [GitHub](https://github.com/swarmsight/SwarmSight/issues)
