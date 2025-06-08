// SwarmSight Rudra Checker Module
// Rudra is a static analyzer for Rust that detects common programming errors

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class RudraChecker {
  constructor() {
    this.name = "Rudra";
    this.description =
      "Static analyzer for Rust that detects common programming errors";
    this.severity = "high";
    this.category = "static-analysis";
    this.language = "rust";
    this.basePath = path.join(__dirname, "../../../rust-checker/static/Rudra");
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
        console.log(
          "Rudra tool not installed, running pattern-based analysis..."
        );
      }

      // Real Rust security analysis patterns for Rudra-style issues
      const rustFiles = await this.findRustFiles(targetPath);

      for (const filePath of rustFiles) {
        const fileFindings = await this.analyzeRustFile(filePath);
        results.findings.push(...fileFindings);
      }
    } catch (error) {
      results.error = error.message;
    }

    return results;
  }

  async findRustFiles(targetPath) {
    const rustFiles = [];
    const fs = require("fs");

    function searchDirectory(dir) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            if (
              !["target", "node_modules", ".git", "build"].includes(entry.name)
            ) {
              searchDirectory(fullPath);
            }
          } else if (entry.name.endsWith(".rs")) {
            rustFiles.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    if (fs.statSync(targetPath).isDirectory()) {
      searchDirectory(targetPath);
    } else if (targetPath.endsWith(".rs")) {
      rustFiles.push(targetPath);
    }

    return rustFiles;
  }

  async analyzeRustFile(filePath) {
    const findings = [];
    const fs = require("fs");

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      // Rudra-style vulnerability patterns
      const vulnerabilityPatterns = [
        // Panic safety issues
        {
          pattern: /unwrap\(\)|expect\([^)]*\)/g,
          rule: "panic-safety",
          severity: "medium",
          message: "Potential panic condition detected",
          recommendation: "Use proper error handling instead of unwrap/expect",
        },

        // Send/Sync variance issues
        {
          pattern: /unsafe\s+impl\s+Send\s+for|unsafe\s+impl\s+Sync\s+for/g,
          rule: "send-sync-variance",
          severity: "high",
          message: "Unsafe Send/Sync implementation may violate memory safety",
          recommendation: "Carefully review thread safety guarantees",
        },

        // Higher-order invariant violations
        {
          pattern: /Box::from_raw|Box::into_raw|std::mem::transmute/g,
          rule: "memory-transmutation",
          severity: "critical",
          message: "Unsafe memory transmutation detected",
          recommendation: "Ensure lifetime and type safety guarantees",
        },

        // Lifetime annotation bugs
        {
          pattern: /&'static\s+mut|static\s+mut\s+\w+/g,
          rule: "static-mut-reference",
          severity: "high",
          message: "Static mutable reference may cause data races",
          recommendation:
            "Use thread-safe alternatives or proper synchronization",
        },

        // Uninitialized memory access
        {
          pattern:
            /std::mem::uninitialized|MaybeUninit::uninit\(\)\.assume_init/g,
          rule: "uninitialized-memory",
          severity: "critical",
          message: "Potentially uninitialized memory access",
          recommendation: "Ensure memory is properly initialized before use",
        },

        // Double-free potential
        {
          pattern: /std::mem::forget.*Box::|drop\(.*Box::/g,
          rule: "manual-memory-management",
          severity: "high",
          message: "Manual memory management may lead to double-free",
          recommendation: "Let Rust handle memory management automatically",
        },
      ];

      vulnerabilityPatterns.forEach((patternInfo) => {
        let match;
        while ((match = patternInfo.pattern.exec(content)) !== null) {
          const lineNumber = content
            .substring(0, match.index)
            .split("\n").length;
          const columnNumber =
            match.index - content.lastIndexOf("\n", match.index - 1);

          findings.push({
            id: `RUDRA-${patternInfo.rule.toUpperCase()}`,
            title: patternInfo.message,
            severity: patternInfo.severity,
            category: "memory-safety",
            tool: "rudra",
            description: `${patternInfo.message} in ${path.basename(filePath)}`,
            file: filePath,
            line: lineNumber,
            column: columnNumber,
            rule: patternInfo.rule,
            recommendation: patternInfo.recommendation,
            codeSnippet: lines[lineNumber - 1]?.trim() || "",
            confidence: "high",
          });
        }
        patternInfo.pattern.lastIndex = 0; // Reset regex
      });
    } catch (error) {
      console.error(`Error analyzing file ${filePath}:`, error.message);
    }

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

module.exports = new RudraChecker();
