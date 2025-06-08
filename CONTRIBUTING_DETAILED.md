# SwarmSight Contributor's Guide

Thank you for your interest in contributing to SwarmSight! This guide provides detailed instructions for contributors, including coding standards, pull request processes, and development setup.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Review Process](#review-process)
- [Community](#community)

## Code of Conduct

Our community is dedicated to providing a harassment-free experience for everyone. We do not tolerate harassment of participants in any form. Please be respectful and constructive in all interactions.

## Development Environment Setup

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Git
- Rust (for rust-checker development)
- Go (for go-checker development)
- Solidity compiler (for solidity-checker development)

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/SwarmSight.git
   cd SwarmSight
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/swarmsight/SwarmSight.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the project:
   ```bash
   npm run build
   ```

## Project Structure

```
SwarmSight/
├── cpp-checker/            # C++ analysis tools
├── detection-results/      # Output templates and formats
├── go-checker/             # Go language analysis tools
├── integration/            # CI integration tools
│   ├── github-ci-checker/  # GitHub Actions integration
│   ├── local-checker/      # Local IDE integration
│   └── rule_engine/        # Rule processing engine
├── move-checker/           # Move language analysis tools
├── rust-checker/           # Rust analysis tools
│   ├── dynamic/            # Dynamic analysis tools
│   ├── static/             # Static analysis tools
│   └── verifier/           # Formal verification tools
├── solidity-checker/       # Solidity analysis tools
│   ├── aderyn/             # Aderyn integration
│   ├── compliance-checker/ # Compliance verification
│   ├── gas-fee-saver/      # Gas optimization tools
│   └── slither/            # Slither integration
├── .github/                # GitHub configuration files
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## Contribution Workflow

1. **Find an Issue**: Look for open issues or create a new one to discuss your proposed changes.

2. **Create a Branch**: Create a branch from the `main` branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**: Implement your changes, following our coding standards.

4. **Test Your Changes**: Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm test
   ```

5. **Commit Your Changes**: Follow our commit message conventions:
   ```bash
   git commit -m "feat: add new detection rule for memory safety"
   ```
   We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

6. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**: Submit a pull request from your fork to the main repository.

## Coding Standards

### General Guidelines

- Use clear, descriptive names for variables, functions, and classes
- Write self-documenting code with appropriate comments
- Keep functions small and focused on a single task
- Follow the SOLID principles
- Write testable code

### Language-Specific Guidelines

#### JavaScript/TypeScript
- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use async/await instead of callbacks or raw promises when possible
- Use TypeScript for type safety

#### Rust
- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use Rust 2018 edition features
- Prefer safe code over unsafe when possible

#### Go
- Follow the [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `go fmt` and `go vet` before committing

#### Solidity
- Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Prioritize security over gas optimization for initial implementations

## Testing Guidelines

### Test Types

1. **Unit Tests**: For individual functions and methods
2. **Integration Tests**: For interactions between components
3. **Regression Tests**: For previously fixed bugs
4. **Security Tests**: Specific to security vulnerabilities

### Writing Tests

- Each new feature should include tests
- Bug fixes should include a test that verifies the fix
- Tests should be clear and descriptive
- Use mocks and fixtures appropriately

### Running Tests

```bash
# Run all tests
npm test

# Run specific test category
npm run test:unit
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Documentation

Good documentation is crucial for a security tool. Please document:

1. **Code**: Add comments explaining complex logic or security implications
2. **APIs**: Document all public APIs with JSDoc or similar
3. **Features**: Update user documentation for new features
4. **Examples**: Provide usage examples for new functionality

## Review Process

All pull requests will be reviewed by at least one core team member. The review process focuses on:

1. **Code Quality**: Is the code well-written and maintainable?
2. **Security**: Does the code introduce any security risks?
3. **Performance**: Is the code efficient?
4. **Test Coverage**: Are there sufficient tests?
5. **Documentation**: Is the change well-documented?

## Community

Join our community to discuss contributions:

- [Discord](https://discord.gg/swarmsight)
- [Forum](https://forum.swarmsight.io)
- [GitHub Discussions](https://github.com/swarmsight/SwarmSight/discussions)

---

Thank you for contributing to SwarmSight! Your efforts help make blockchain technology more secure for everyone.
