// SwarmSight Cocoon Checker Module
// Cocoon is an information flow control system for Rust

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class CocoonChecker {
  constructor() {
    this.name = "Cocoon";
    this.description = "Information flow control system for Rust";
    this.severity = "medium";
    this.category = "information-flow";
    this.language = "rust";
    this.basePath = path.join(
      __dirname,
      "../../../rust-checker/static/Cocoon-implementation"
    );
  }

  async isAvailable() {
    try {
      return fs.existsSync(this.basePath);
    } catch (error) {
      return false;
    }
  }
  async scan(targetPath, options = {}) {
    const results = {
      checker: this.name,
      findings: [],
      metadata: {
        scannedPath: targetPath,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    try {
      if (!(await this.isAvailable())) {
        results.error = "Cocoon checker not available";
        return results;
      }

      // Enhanced Cocoon analysis - Information Flow Control for Rust
      const findings = await this.performInformationFlowAnalysis(targetPath);
      results.findings = findings;
    } catch (error) {
      results.error = error.message;
    }

    return results;
  }

  async performInformationFlowAnalysis(targetPath) {
    const findings = [];

    try {
      // Find all Rust files in the target path
      const rustFiles = this.findRustFiles(targetPath);

      for (const filePath of rustFiles) {
        const content = fs.readFileSync(filePath, "utf8");
        const fileFindings = this.analyzeInformationFlow(content, filePath);
        findings.push(...fileFindings);
      }
    } catch (error) {
      console.error(`Error in Cocoon analysis: ${error.message}`);
    }

    return findings;
  }

  findRustFiles(dirPath) {
    const rustFiles = [];

    const walkDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (
            stat.isDirectory() &&
            !file.startsWith(".") &&
            file !== "target"
          ) {
            walkDir(filePath);
          } else if (file.endsWith(".rs")) {
            rustFiles.push(filePath);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };

    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (dirPath.endsWith(".rs")) {
      rustFiles.push(dirPath);
    }

    return rustFiles;
  }

  analyzeInformationFlow(content, filePath) {
    const findings = [];
    const lines = content.split("\n");

    // Information flow control patterns for Cocoon
    const patterns = [
      {
        regex: /unsafe\s*\{[\s\S]*?\}/g,
        severity: "high",
        message: "Unsafe block may bypass information flow controls",
        rule: "unsafe-information-flow",
        recommendation:
          "Review unsafe blocks for information flow security violations",
      },
      {
        regex: /transmute\s*[<(]/g,
        severity: "critical",
        message: "Memory transmutation can leak sensitive information",
        rule: "transmute-leak",
        recommendation:
          "Avoid transmute operations that may expose sensitive data",
      },
      {
        regex: /println!\s*\(\s*[^)]*secret[^)]*\)/gi,
        severity: "high",
        message: "Potential secret information disclosure through debug output",
        rule: "secret-disclosure",
        recommendation: "Remove debug output containing sensitive information",
      },
      {
        regex: /eprintln!\s*\(\s*[^)]*password[^)]*\)/gi,
        severity: "high",
        message: "Password information disclosed through error output",
        rule: "password-disclosure",
        recommendation: "Remove password information from error messages",
      },
      {
        regex:
          /log::(debug|info|warn|error)!\s*\([^)]*(?:key|token|secret)[^)]*\)/gi,
        severity: "medium",
        message: "Sensitive information in log output",
        rule: "sensitive-logging",
        recommendation: "Sanitize sensitive data before logging",
      },
      {
        regex: /serialize\s*\([^)]*(?:private|secret|key)[^)]*\)/gi,
        severity: "medium",
        message: "Serialization of sensitive data may leak information",
        rule: "sensitive-serialization",
        recommendation:
          "Ensure sensitive data is properly protected during serialization",
      },
      {
        regex: /\.to_string\(\)\s*[^;]*(?:private|secret|key)/gi,
        severity: "low",
        message: "String conversion of sensitive data",
        rule: "sensitive-string-conversion",
        recommendation: "Be careful when converting sensitive data to strings",
      },
      {
        regex: /format!\s*\([^)]*(?:private|secret|key|password)[^)]*\)/gi,
        severity: "medium",
        message: "Formatting sensitive data may expose information",
        rule: "sensitive-formatting",
        recommendation: "Avoid including sensitive data in formatted strings",
      },
    ];

    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        const matches = line.matchAll(pattern.regex);
        for (const match of matches) {
          findings.push({
            id: `COCOON-${pattern.rule.toUpperCase()}`,
            title: pattern.message,
            severity: pattern.severity,
            category: "information-flow",
            tool: "cocoon",
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

  async getInfo() {
    return {
      name: this.name,
      description: this.description,
      version: "1.0.0",
      language: this.language,
      category: this.category,
      severity: this.severity,
      available: await this.isAvailable(),
    };
  }
}

module.exports = new CocoonChecker();
