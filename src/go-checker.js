// SwarmSight Go Checker Module

/**
 * Go Checker Module
 *
 * This module provides an interface to all available Go security checkers
 * and handles their integration with the main SwarmSight scanner.
 */

const path = require("path");
const fs = require("fs");

/**
 * Base Go checker implementation
 */
class GoChecker {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.severity = config.severity;
    this.category = config.category;
    this.language = "go";
    this.available = config.available;
  }
  async scan(projectPath, options = {}) {
    console.log(`Running ${this.name} checker...`);

    // Enhanced Go security analysis
    const findings = await this.performGoSecurityAnalysis(projectPath);
    return { findings };
  }

  async performGoSecurityAnalysis(projectPath) {
    const findings = [];

    try {
      // Find all Go files in the target path
      const goFiles = this.findGoFiles(projectPath);

      for (const filePath of goFiles) {
        const content = fs.readFileSync(filePath, "utf8");
        const fileFindings = this.analyzeGoSecurity(content, filePath);
        findings.push(...fileFindings);
      }
    } catch (error) {
      console.error(`Error in ${this.name} analysis: ${error.message}`);
    }

    return findings;
  }

  findGoFiles(dirPath) {
    const goFiles = [];

    const walkDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (
            stat.isDirectory() &&
            !file.startsWith(".") &&
            file !== "vendor"
          ) {
            walkDir(filePath);
          } else if (file.endsWith(".go") && !file.endsWith("_test.go")) {
            goFiles.push(filePath);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };

    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (dirPath.endsWith(".go")) {
      goFiles.push(dirPath);
    }

    return goFiles;
  }

  analyzeGoSecurity(content, filePath) {
    const findings = [];
    const lines = content.split("\n");

    // Go security patterns based on checker type
    let patterns = [];

    if (this.id === "gcatch") {
      // GCatch - Concurrency bug detection
      patterns = [
        {
          regex: /go\s+\w+\([^)]*\)/g,
          severity: "medium",
          message: "Goroutine launch detected - verify proper synchronization",
          rule: "goroutine-synchronization",
          recommendation:
            "Ensure proper synchronization for goroutine communication",
        },
        {
          regex: /chan\s+\w+|make\s*\(\s*chan/g,
          severity: "medium",
          message: "Channel operation - verify deadlock freedom",
          rule: "channel-deadlock",
          recommendation: "Verify channel operations cannot cause deadlocks",
        },
        {
          regex: /sync\.Mutex|sync\.RWMutex/g,
          severity: "high",
          message: "Mutex usage detected - verify lock ordering",
          rule: "mutex-lock-ordering",
          recommendation:
            "Ensure consistent lock ordering to prevent deadlocks",
        },
        {
          regex: /sync\.WaitGroup/g,
          severity: "medium",
          message: "WaitGroup usage - verify Add/Done balance",
          rule: "waitgroup-balance",
          recommendation: "Ensure Add() and Done() calls are properly balanced",
        },
        {
          regex: /sync\.Once/g,
          severity: "low",
          message: "Once usage detected - verify initialization safety",
          rule: "once-initialization",
          recommendation:
            "Verify Once.Do() properly initializes shared resources",
        },
        {
          regex: /atomic\./g,
          severity: "medium",
          message: "Atomic operation detected - verify memory ordering",
          rule: "atomic-ordering",
          recommendation:
            "Ensure atomic operations have proper memory ordering",
        },
        {
          regex: /select\s*\{/g,
          severity: "medium",
          message: "Select statement - verify proper channel handling",
          rule: "select-channel-handling",
          recommendation:
            "Ensure select statements handle all channel cases properly",
        },
      ];
    } else if (this.id === "gfuzz") {
      // GFuzz - Dynamic concurrency testing
      patterns = [
        {
          regex: /race|data\s+race/gi,
          severity: "critical",
          message: "Potential data race condition detected",
          rule: "data-race",
          recommendation: "Use proper synchronization to prevent data races",
        },
        {
          regex: /unsafe\./g,
          severity: "high",
          message: "Unsafe operation detected - requires careful review",
          rule: "unsafe-operation",
          recommendation: "Verify unsafe operations are memory safe",
        },
        {
          regex: /\*\(\*\w+\)\(unsafe\.Pointer/g,
          severity: "critical",
          message: "Unsafe pointer conversion - potential memory corruption",
          rule: "unsafe-pointer-conversion",
          recommendation: "Verify pointer conversions are safe and necessary",
        },
        {
          regex: /reflect\./g,
          severity: "medium",
          message: "Reflection usage - verify type safety",
          rule: "reflection-safety",
          recommendation: "Ensure reflection operations are type safe",
        },
      ];
    }

    // Common Go security patterns
    const commonPatterns = [
      {
        regex: /sql\.Query\s*\([^)]*\+/g,
        severity: "critical",
        message: "SQL injection vulnerability - string concatenation in query",
        rule: "sql-injection",
        recommendation:
          "Use parameterized queries instead of string concatenation",
      },
      {
        regex: /exec\.Command\s*\([^)]*\+/g,
        severity: "high",
        message:
          "Command injection vulnerability - dynamic command construction",
        rule: "command-injection",
        recommendation: "Validate and sanitize command arguments",
      },
      {
        regex: /os\.Open\s*\([^)]*\+/g,
        severity: "medium",
        message: "Path traversal vulnerability - dynamic file path",
        rule: "path-traversal",
        recommendation: "Validate file paths and use filepath.Clean()",
      },
      {
        regex: /http\.ListenAndServe\s*\(\s*"[^"]*"\s*,\s*nil\s*\)/g,
        severity: "medium",
        message: "HTTP server without handler - potential security risk",
        rule: "default-http-handler",
        recommendation:
          "Provide explicit HTTP handlers instead of using default",
      },
      {
        regex: /rand\.Read|crypto\/rand/g,
        severity: "info",
        message: "Cryptographic random number generation - good practice",
        rule: "crypto-random",
        recommendation:
          "Continue using cryptographically secure random numbers",
      },
      {
        regex: /math\/rand/g,
        severity: "medium",
        message: "Non-cryptographic random numbers - potential security issue",
        rule: "weak-random",
        recommendation: "Use crypto/rand for security-sensitive applications",
      },
    ];

    patterns = patterns.concat(commonPatterns);

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
 * Get all available Go checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const checkerConfigs = [
    {
      id: "gcatch",
      name: "GCatch",
      description: "Statically detecting Go concurrency bugs",
      severity: "high",
      category: "concurrency-analysis",
      available: fs.existsSync(path.join(__dirname, "../go-checker/GCatch")),
    },
    {
      id: "gfuzz",
      name: "GFuzz",
      description: "Fuzzing tool for Go programs",
      severity: "medium",
      category: "dynamic-analysis",
      available: fs.existsSync(path.join(__dirname, "../go-checker/GFuzz")),
    },
  ];

  // Create checker instances for available checkers
  const availableCheckers = checkerConfigs
    .filter((config) => config.available)
    .map((config) => new GoChecker(config));

  return availableCheckers;
}

/**
 * Scan a target path with specified Go checkers
 */
async function scan(targetPath, options = {}) {
  const results = {
    language: "go",
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
