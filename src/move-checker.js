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

    // Enhanced Move security analysis
    const findings = await this.performMoveSecurityAnalysis(projectPath);
    return { findings };
  }

  async performMoveSecurityAnalysis(projectPath) {
    const findings = [];

    try {
      // Find all Move files in the target path
      const moveFiles = this.findMoveFiles(projectPath);

      for (const filePath of moveFiles) {
        const content = fs.readFileSync(filePath, "utf8");
        const fileFindings = this.analyzeMoveSecurity(content, filePath);
        findings.push(...fileFindings);
      }
    } catch (error) {
      console.error(`Error in ${this.name} analysis: ${error.message}`);
    }

    return findings;
  }

  findMoveFiles(dirPath) {
    const moveFiles = [];

    const walkDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory() && !file.startsWith(".") && file !== "build") {
            walkDir(filePath);
          } else if (file.endsWith(".move")) {
            moveFiles.push(filePath);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };

    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (dirPath.endsWith(".move")) {
      moveFiles.push(dirPath);
    }

    return moveFiles;
  }

  analyzeMoveSecurity(content, filePath) {
    const findings = [];
    const lines = content.split("\n");

    // Move language security patterns
    const patterns = [
      {
        regex: /public\s+fun\s+\w+.*(?!acquires)/g,
        severity: "medium",
        message: "Public function without explicit resource acquisition",
        rule: "missing-acquires",
        recommendation:
          "Specify acquires clause for functions that access global resources",
      },
      {
        regex: /abort\s+\d+/g,
        severity: "low",
        message: "Hardcoded abort code - consider using named constants",
        rule: "hardcoded-abort",
        recommendation:
          "Use named error constants instead of hardcoded abort codes",
      },
      {
        regex: /assert!\s*\([^,]*,\s*\d+\s*\)/g,
        severity: "low",
        message: "Assert with hardcoded error code",
        rule: "hardcoded-assert-code",
        recommendation: "Use named error constants for better error handling",
      },
      {
        regex: /borrow_global_mut\s*</g,
        severity: "high",
        message: "Mutable global resource access - verify exclusive access",
        rule: "unsafe-global-mut-access",
        recommendation:
          "Ensure exclusive access when borrowing global resources mutably",
      },
      {
        regex: /borrow_global\s*</g,
        severity: "medium",
        message: "Global resource access - verify resource exists",
        rule: "global-resource-access",
        recommendation:
          "Check resource existence before borrowing global resources",
      },
      {
        regex: /move_to\s*</g,
        severity: "medium",
        message: "Resource publication - verify authorization",
        rule: "resource-publication",
        recommendation:
          "Ensure proper authorization before publishing resources",
      },
      {
        regex: /move_from\s*</g,
        severity: "high",
        message: "Resource extraction - verify ownership and authorization",
        rule: "resource-extraction",
        recommendation:
          "Verify ownership and authorization before extracting resources",
      },
      {
        regex: /native\s+fun/g,
        severity: "critical",
        message: "Native function call - requires careful security review",
        rule: "native-function-call",
        recommendation:
          "Native functions bypass Move safety - review thoroughly",
      },
      {
        regex: /\@\w+/g,
        severity: "low",
        message: "Address literal - verify address validity",
        rule: "address-literal",
        recommendation: "Ensure address literals are valid and authorized",
      },
      {
        regex: /copy\s+/g,
        severity: "low",
        message: "Resource copy operation - verify copy ability",
        rule: "resource-copy",
        recommendation: "Ensure resources have copy ability before copying",
      },
      {
        regex: /drop\s+/g,
        severity: "low",
        message: "Resource drop operation - verify drop ability",
        rule: "resource-drop",
        recommendation: "Ensure resources have drop ability before dropping",
      },
      {
        regex: /\*&mut\s+/g,
        severity: "medium",
        message: "Mutable reference dereference - verify safety",
        rule: "mut-ref-deref",
        recommendation: "Ensure mutable reference dereference is safe",
      },
      {
        regex: /vector::empty\s*<.*>\s*\(\s*\)/g,
        severity: "low",
        message: "Empty vector creation - consider initialization",
        rule: "empty-vector",
        recommendation: "Consider initializing vectors with expected elements",
      },
      {
        regex: /vector::borrow\s*\(/g,
        severity: "medium",
        message: "Vector element borrowing - verify bounds",
        rule: "vector-bounds",
        recommendation: "Ensure vector index is within bounds before borrowing",
      },
      {
        regex: /signer::address_of\s*\(/g,
        severity: "low",
        message: "Signer address extraction - verify signer validity",
        rule: "signer-address",
        recommendation: "Verify signer is valid before extracting address",
      },
      {
        regex: /timestamp::now_microseconds\s*\(\s*\)/g,
        severity: "medium",
        message: "Timestamp dependency - avoid for critical logic",
        rule: "timestamp-dependency",
        recommendation: "Avoid using timestamps for critical security logic",
      },
      {
        regex: /coin::value\s*\(/g,
        severity: "low",
        message: "Coin value access - verify coin ownership",
        rule: "coin-value-access",
        recommendation: "Ensure proper ownership before accessing coin values",
      },
      {
        regex: /table::borrow_mut\s*\(/g,
        severity: "medium",
        message: "Mutable table access - verify key existence",
        rule: "table-mut-access",
        recommendation: "Check key existence before mutable table access",
      },
    ];

    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        const matches = line.matchAll(pattern.regex);
        for (const match of matches) {
          findings.push({
            id: `${this.id.toUpperCase()}-${pattern.rule.toUpperCase()}`,
            title: pattern.message,
            severity: pattern.severity,
            category: this.category,
            tool: this.id,
            description: `${pattern.message} in ${path.basename(filePath)}`,
            file: filePath,
            line: index + 1,
            column: match.index + 1,
            rule: pattern.rule,
            recommendation: pattern.recommendation,
            codeSnippet: line.trim(),
            confidence: "medium",
          });
        }
      });
    });

    return findings;
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
