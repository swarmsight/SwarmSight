# SwarmSight Rust Checker

This module provides comprehensive security analysis for Rust codebases with a focus on blockchain applications.

## Components

The Rust checker is divided into three main components:

### Static Analysis (`static/`)

Static code analysis tools that examine Rust code without executing it:

- **lockbud**: Detects memory and concurrency bugs
- **rudra**: Focuses on memory safety when code panics
- **RAPx**: Specialized in memory management vulnerabilities
- **AtomVChecker**: Analyzes atomic operations and memory ordering
- **Cocoon**: Detects secrecy leaks
- **MIRAI**: Performs abstract interpretation on Rust's MIR

### Dynamic Analysis (`dynamic/`)

Runtime analysis tools that detect issues during program execution:

- **ERASan**: Identifies memory access bugs at runtime
- **shuttle**: Tests for concurrency issues through controlled execution

### Formal Verification (`verifier/`)

Mathematical proof-based approaches to verify code correctness:

- **kani**: Provides formal verification of memory safety and user-specified properties

## Usage

To run all Rust checkers:

```bash
swarmsight rust-check /path/to/rust/project
```

To run specific checkers:

```bash
swarmsight rust-check /path/to/rust/project --checkers=lockbud,kani
```

## Configuration

Each checker can be configured in the `swarmsight.config.js` file:

```javascript
module.exports = {
  rust: {
    checkers: {
      lockbud: {
        enabled: true,
        severity: 'high',
        // Checker-specific options
        options: {
          threads: 4,
          maxDepth: 10
        }
      },
      // Other checkers...
    }
  }
};
```

## Integration

### Cargo Integration

The Rust checkers can be integrated with Cargo:

```bash
# Install the SwarmSight Cargo plugin
cargo install swarmsight-cargo

# Run analysis
cargo swarmsight
```

### IDE Integration

For real-time feedback, install the appropriate IDE plugin:

- VS Code: SwarmSight Rust Analyzer Extension
- IntelliJ IDEA: SwarmSight Rust Plugin
- Vim/Neovim: swarmsight.vim

## Customization

### Custom Rules

Create custom detection rules in the `custom-rules/rust/` directory:

```rust
// Example custom rule definition
pub struct MyCustomRule;

impl Rule for MyCustomRule {
    fn check(&self, ctx: &RuleContext) -> Vec<Finding> {
        // Rule implementation
    }
    
    fn name(&self) -> &'static str {
        "my-custom-rule"
    }
    
    fn severity(&self) -> Severity {
        Severity::High
    }
    
    fn description(&self) -> &'static str {
        "Detects a specific vulnerability pattern"
    }
}
```

## Contributing

See [CONTRIBUTING_DETAILED.md](../../CONTRIBUTING_DETAILED.md) for information on contributing to the Rust checker module.

### Adding a New Checker

1. Create a new directory under the appropriate category (static, dynamic, or verifier)
2. Implement the `RustChecker` trait
3. Add integration code in `rust-checker/src/checkers/mod.rs`
4. Add tests in `rust-checker/tests/`
5. Update documentation in this README

## License

This module is part of SwarmSight and is licensed under the MIT License.
