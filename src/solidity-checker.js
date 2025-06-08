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
 * Get all available Solidity checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const allCheckers = [
    {
      name: "Slither",
      description: "Static analyzer for Solidity smart contracts",
      severity: "high",
      category: "static-analysis",
      language: "solidity",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/slither")
      ),
    },
    {
      name: "Aderyn",
      description: "Rust-based static analyzer for Solidity",
      severity: "high",
      category: "static-analysis",
      language: "solidity",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/aderyn")
      ),
    },
    {
      name: "Gas Fee Saver",
      description: "Gas optimization analyzer for Solidity contracts",
      severity: "medium",
      category: "optimization",
      language: "solidity",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/gas-fee-saver")
      ),
    },
    {
      name: "Compliance Checker",
      description: "Compliance and regulatory checker for smart contracts",
      severity: "medium",
      category: "compliance",
      language: "solidity",
      available: fs.existsSync(
        path.join(__dirname, "../solidity-checker/compliance-checker")
      ),
    },
  ];

  return allCheckers.filter((checker) => checker.available);
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

      // Placeholder for actual checker execution
      results.findings.push({
        checker: checker.name,
        severity: "info",
        message: `${checker.name} analysis placeholder - implementation pending`,
        file: targetPath,
        line: 1,
        column: 1,
        rule: `${checker.name.toLowerCase()}-placeholder`,
      });
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
