# SwarmSight Installation Guide

This guide provides step-by-step instructions for installing and configuring SwarmSight for different use cases.

## Prerequisites

Before installing SwarmSight, ensure you have the following prerequisites:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git
- Docker (optional, for containerized usage)
- Rust (for rust-checker components)
- Go (for go-checker components)
- Solidity compiler (for solidity-checker components)

## Basic Installation

### 1. Clone the Repository

```bash
git clone https://github.com/swarmsight/SwarmSight.git
cd SwarmSight
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Settings

Create a configuration file based on the template:

```bash
cp config.example.json config.json
```

Edit the `config.json` file to match your requirements.

## Using Docker

For containerized deployment:

```bash
# Build the Docker image
docker build -t swarmsight .

# Run SwarmSight in a container
docker run -v $(pwd):/app swarmsight npm run scan [project-path]
```

## Integration Options

### GitHub Actions Integration

Add the following to your `.github/workflows/security.yml` file:

```yaml
name: SwarmSight Security Analysis

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
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
        run: swarmsight scan --report-format=github
```

### GitLab CI Integration

Add the following to your `.gitlab-ci.yml` file:

```yaml
security_scan:
  image: node:14
  stage: test
  script:
    - npm install -g @swarmsight/cli
    - swarmsight scan --report-format=gitlab
  artifacts:
    paths:
      - swarmsight-report.json
```

## Advanced Configuration

### Custom Rules

You can create custom rules in the `custom-rules` directory:

```javascript
// custom-rules/my-rule.js
module.exports = {
  id: 'my-custom-rule',
  description: 'Detects a specific security pattern',
  severity: 'high',
  detect: function(code, context) {
    // Detection logic here
    return {
      found: true/false,
      line: lineNumber,
      column: columnNumber,
      message: 'Description of the issue'
    };
  }
};
```

### Ignore Patterns

Create a `.swarmsightignore` file to exclude files from analysis:

```
node_modules/
dist/
*.test.js
```

## Troubleshooting

### Common Issues

1. **Installation Fails**
   
   Ensure you have the correct Node.js version:
   ```bash
   node --version
   ```

2. **Scanner Crashes**
   
   Check available memory:
   ```bash
   # For large projects, allocate more memory
   NODE_OPTIONS=--max-old-space-size=4096 npm run scan
   ```

3. **Missing Dependencies**
   
   Install required tools:
   ```bash
   # For Rust checkers
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # For Go checkers
   wget https://golang.org/dl/go1.17.linux-amd64.tar.gz
   sudo tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
   ```

## Support

For additional support, please contact:

- Email: support@swarmsight.io
- Discord: https://discord.gg/swarmsight
- Documentation: https://docs.swarmsight.io
