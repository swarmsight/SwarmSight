// SwarmSight Move Checker Module

/**
 * Move Checker Module
 *
 * This module provides an interface to all available Move language security checkers
 * and handles their integration with the main SwarmSight scanner.
 */

const path = require("path");
const fs = require("fs");

/**
 * Base Move checker implementation
 */
class MoveChecker {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.severity = config.severity;
    this.category = config.category;
    this.language = "move";
    this.available = config.available;
  }

  async scan(projectPath, options = {}) {
    console.log(`Running ${this.name} checker...`);

    // Create mock findings for demonstration
    const findings = [
      {
        id: `${this.id.toUpperCase()}-001`,
        title: `${this.name} security analysis`,
        severity: this.severity,
        category: this.category,
        tool: this.id,
        description: `${this.name} analysis completed - placeholder implementation`,
        file: projectPath,
        line: 1,
        column: 1,
        rule: `${this.id}-analysis`,
        recommendation: `Consider implementing actual ${this.name} integration for production use.`,
      },
    ];

    return { findings };
  }
}

/**
 * Get all available Move checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const checkerConfigs = [
    {
      id: "move-prover",
      name: "Move Prover",
      description: "Formal verification tool for Move smart contracts",
      severity: "high",
      category: "formal-verification",
      available: fs.existsSync(path.join(__dirname, "../move-checker")),
    },
  ];

  // Create checker instances for available checkers
  const availableCheckers = checkerConfigs
    .filter((config) => config.available)
    .map((config) => new MoveChecker(config));

  return availableCheckers;
}

/**
 * Scan a target path with specified Move checkers
 */
async function scan(targetPath, options = {}) {
  const results = {
    language: "move",
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

      // Use the checker's scan method
      const checkerResults = await checker.scan(targetPath, options);
      results.findings.push(...checkerResults.findings);
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
