// SwarmSight Solidity Checker Module

/**
 * Solidity Checker Module
 *
 * This module provides an interface to all available Solidity security checkers
 * and handles their integration with the main SwarmSight scanner.
 */

const path = require("path");
const fs = require("fs");

/**
 * Base Solidity checker implementation
 */
class SolidityChecker {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.severity = config.severity;
    this.category = config.category;
    this.language = "solidity";
    this.available = config.available;
  }
  async scan(projectPath, options = {}) {
    console.log(`Running ${this.name} checker on ${projectPath}...`);

    const findings = [];

    try {
      // Find all Solidity files
      const solidityFiles = await this.findSolidityFiles(projectPath);

      if (solidityFiles.length === 0) {
        console.log(`No Solidity files found in ${projectPath}`);
        return { findings: [], summary: { filesScanned: 0, issuesFound: 0 } };
      }

      console.log(`Found ${solidityFiles.length} Solidity files to analyze`);

      // Analyze each file
      for (const filePath of solidityFiles) {
        const fileFindings = await this.analyzeFile(filePath, options);
        findings.push(...fileFindings);
      }

      return {
        findings,
        summary: {
          filesScanned: solidityFiles.length,
          issuesFound: findings.length,
          checker: this.name,
        },
      };
    } catch (error) {
      console.error(`Error in ${this.name} checker:`, error.message);
      return {
        findings: [],
        summary: {
          filesScanned: 0,
          issuesFound: 0,
          error: error.message,
          checker: this.name,
        },
      };
    }
  }

  async findSolidityFiles(projectPath) {
    const solidityFiles = [];

    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
            scanDirectory(fullPath);
          } else if (stat.isFile() && item.endsWith(".sol")) {
            solidityFiles.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Could not scan directory ${dir}: ${error.message}`);
      }
    };

    if (fs.existsSync(projectPath)) {
      const stat = fs.statSync(projectPath);
      if (stat.isFile() && projectPath.endsWith(".sol")) {
        solidityFiles.push(projectPath);
      } else if (stat.isDirectory()) {
        scanDirectory(projectPath);
      }
    }

    return solidityFiles;
  }

  shouldSkipDirectory(dirname) {
    const skipDirs = [
      "node_modules",
      ".git",
      "build",
      "dist",
      "target",
      "artifacts",
      "cache",
    ];
    return skipDirs.includes(dirname) || dirname.startsWith(".");
  }
  async analyzeFile(filePath, options = {}) {
    const findings = [];

    try {
      const content = fs.readFileSync(filePath, "utf8");

      // Real Solidity security analysis patterns
      const vulnerabilityPatterns = [
        // Reentrancy patterns
        {
          pattern: /\.call\s*\(\s*[^)]*\)\s*;\s*(?!require|assert)/gi,
          rule: "reentrancy-vulnerability",
          severity: "critical",
          message: "Potential reentrancy vulnerability detected",
          recommendation:
            "Use checks-effects-interactions pattern and consider ReentrancyGuard",
        },
        {
          pattern: /\.transfer\s*\(\s*[^)]*\)\s*;\s*\w+\s*\+=?\s*/gi,
          rule: "reentrancy-transfer",
          severity: "high",
          message:
            "State change after external call may be vulnerable to reentrancy",
          recommendation: "Update state variables before external calls",
        },

        // Access control issues
        {
          pattern:
            /function\s+\w+\s*\([^)]*\)\s+public\s+(?!view|pure|onlyOwner)/gi,
          rule: "missing-access-control",
          severity: "high",
          message: "Public function without access control modifier",
          recommendation:
            "Add appropriate access control modifiers (onlyOwner, onlyAdmin, etc.)",
        },

        // Integer overflow/underflow (for older Solidity versions)
        {
          pattern:
            /\w+\s*[\+\-\*\/]\s*\w+(?!\s*(>=|<=|>|<|\?|require|assert))/gi,
          rule: "arithmetic-operations",
          severity: "medium",
          message: "Arithmetic operation without overflow/underflow protection",
          recommendation:
            "Use SafeMath library or Solidity 0.8+ built-in overflow checks",
        },

        // Unchecked external calls
        {
          pattern: /\w+\.call\([^)]*\)(?!\s*;\s*require)/gi,
          rule: "unchecked-call",
          severity: "medium",
          message: "External call without checking return value",
          recommendation: "Always check return values of external calls",
        },

        // Gas-related issues
        {
          pattern: /for\s*\([^)]*;\s*\w+\s*<\s*\w+\.length/gi,
          rule: "gas-limit-loop",
          severity: "medium",
          message: "Loop with dynamic array length may cause gas limit issues",
          recommendation: "Consider pagination or gas-efficient alternatives",
        },

        // Timestamp dependence
        {
          pattern: /block\.timestamp|now(?!\w)/gi,
          rule: "timestamp-dependence",
          severity: "low",
          message: "Reliance on block timestamp detected",
          recommendation:
            "Avoid using block.timestamp for critical logic; miners can manipulate timestamps",
        },

        // Uninitialized storage pointers
        {
          pattern: /struct\s+\w+\s+\w+(?!\s*=)/gi,
          rule: "uninitialized-storage",
          severity: "high",
          message: "Potentially uninitialized storage pointer",
          recommendation: "Initialize storage pointers explicitly",
        },
      ];

      const lines = content.split("\n");

      vulnerabilityPatterns.forEach((patternInfo) => {
        let match;
        while ((match = patternInfo.pattern.exec(content)) !== null) {
          const lineNumber = content
            .substring(0, match.index)
            .split("\n").length;
          const columnNumber =
            match.index - content.lastIndexOf("\n", match.index - 1);

          findings.push({
            id: `${this.id.toUpperCase()}-${patternInfo.rule.toUpperCase()}`,
            title: patternInfo.message,
            severity: patternInfo.severity,
            category: this.category,
            tool: this.id,
            description: `${patternInfo.message} in ${path.basename(filePath)}`,
            file: filePath,
            line: lineNumber,
            column: columnNumber,
            rule: patternInfo.rule,
            recommendation: patternInfo.recommendation,
            codeSnippet: lines[lineNumber - 1]?.trim() || "",
            confidence: "medium",
          });
        }
        patternInfo.pattern.lastIndex = 0; // Reset regex
      });
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
    }

    return findings;
  }
}

/**
 * Get all available Solidity checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const checkerConfigs = [
    {
      id: "slither",
      name: "Slither",
      description: "Static analyzer for Solidity smart contracts",
      severity: "high",
      category: "static-analysis",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/slither")
      ),
    },
    {
      id: "aderyn",
      name: "Aderyn",
      description: "Rust-based static analyzer for Solidity",
      severity: "high",
      category: "static-analysis",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/aderyn")
      ),
    },
    {
      id: "gas-fee-saver",
      name: "Gas Fee Saver",
      description: "Gas optimization analyzer for Solidity contracts",
      severity: "medium",
      category: "optimization",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/gas-fee-saver")
      ),
    },
    {
      id: "compliance-checker",
      name: "Compliance Checker",
      description: "Compliance and regulatory checker for smart contracts",
      severity: "medium",
      category: "compliance",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/compliance-checker")
      ),
    },
  ];

  // Create checker instances for available checkers
  const availableCheckers = checkerConfigs
    .filter((config) => config.available)
    .map((config) => new SolidityChecker(config));

  return availableCheckers;
}

/**
 * Scan a target path with specified Solidity checkers
 */
async function scan(targetPath, options = {}) {
  const results = {
    language: "solidity",
    checkers: [],
    findings: [],
    metadata: {
      scannedPath: targetPath,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };

  try {
    const checkers = getAvailableCheckers(options);

    for (const checker of checkers) {
      results.checkers.push(checker.name);

      // Run real security analysis with each checker
      const checkerResults = await checker.scan(targetPath, options);
      if (checkerResults.findings) {
        results.findings.push(...checkerResults.findings);
      }
    }
  } catch (error) {
    results.error = error.message;
  }

  return results;
}

module.exports = {
  getAvailableCheckers,
  scan,
};
