# SwarmSight Solidity Checker

This module provides comprehensive security analysis for Solidity smart contracts and blockchain applications.

## Components

The Solidity checker is divided into four main components:

### Slither Integration (`slither/`)

Integration with the popular Slither framework for detecting common Solidity vulnerabilities:

- Reentrancy vulnerabilities
- Integer overflow/underflow
- Unchecked external calls
- Uninitialized storage pointers
- Shadowing state variables
- Incorrect visibility
- And many more...

### Gas Fee Optimization (`gas-fee-saver/`)

Tools for detecting gas inefficiencies and optimizing transaction costs:

- **PeCatch**: Specialized in detecting gas inefficiencies
- Gas usage analysis
- Storage optimization recommendations
- Function execution cost estimation
- Loop optimization suggestions

### Compliance Checker (`compliance-checker/`)

Ensures smart contracts follow best practices and standards:

- ERC standard compliance (ERC20, ERC721, ERC1155, etc.)
- EIP compatibility
- Security best practices adherence
- Upgrade safety checks
- Governance implementation analysis

### Aderyn Integration (`aderyn/`)

Integration with Aderyn for additional code quality and security checks:

- Smart contract best practices
- Code readability issues
- Complex code structures
- Function visibility optimization
- Code organization improvements

## Usage

To run all Solidity checkers:

```bash
swarmsight solidity-check /path/to/solidity/project
```

To run specific checkers:

```bash
swarmsight solidity-check /path/to/solidity/project --checkers=slither,gas-fee-saver
```

## Configuration

Each checker can be configured in the `swarmsight.config.js` file:

```javascript
module.exports = {
  solidity: {
    compilerVersion: '0.8.17',
    checkers: {
      slither: {
        enabled: true,
        detectors: ['reentrancy', 'uninitialized-storage'],
        exclude: ['naming-convention']
      },
      'gas-fee-saver': {
        enabled: true,
        threshold: 5000 // Only report if gas savings > 5000
      },
      // Other checkers...
    }
  }
};
```

## Integration

### Development Framework Integration

The Solidity checkers can be integrated with popular development frameworks:

```bash
# Truffle integration
truffle run swarmsight

# Hardhat integration
npx hardhat swarmsight

# Foundry integration
forge swarmsight
```

### IDE Integration

For real-time feedback, install the appropriate IDE plugin:

- VS Code: SwarmSight Solidity Extension
- Remix: SwarmSight Remix Plugin
- IntelliJ IDEA: SwarmSight Solidity Plugin

## Customization

### Custom Detectors

Create custom detectors in the `custom-detectors/solidity/` directory:

```javascript
// Example custom detector
module.exports = {
  name: 'custom-unsafe-delegatecall',
  description: 'Detects unsafe usage of delegatecall',
  severity: 'high',
  detect: function(contract) {
    // Detection logic
    return {
      findings: [],
      recommendations: []
    };
  }
};
```

## Security Report

The Solidity checker generates comprehensive security reports including:

1. Vulnerability summary with severity levels
2. Detailed explanations of each finding
3. Code snippets showing the problematic code
4. Remediation recommendations
5. Gas optimization suggestions

## Contributing

See [CONTRIBUTING_DETAILED.md](../../CONTRIBUTING_DETAILED.md) for information on contributing to the Solidity checker module.

### Adding a New Detector

1. Create a new detector in the appropriate category
2. Implement the `SolidityDetector` interface
3. Add integration code in `solidity-checker/src/detectors/index.js`
4. Add tests in `solidity-checker/tests/`
5. Update documentation in this README

## License

This module is part of SwarmSight and is licensed under the MIT License.
