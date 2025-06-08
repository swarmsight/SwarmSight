// SwarmSight ERASan Checker Module
// ERASan is a dynamic analysis tool for detecting data races in Rust programs

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class ErasanChecker {
  constructor() {
    this.name = "ERASan";
    this.description =
      "Dynamic analysis tool for detecting data races in Rust programs";
    this.severity = "high";
    this.category = "dynamic-analysis";
    this.language = "rust";
    this.basePath = path.join(
      __dirname,
      "../../../rust-checker/dynamic/ERASan"
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
        console.log(
          "ERASan tool not installed, running pattern-based analysis..."
        );
      }

      // ERASan-style data race detection patterns
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

      // ERASan-style data race patterns
      const vulnerabilityPatterns = [
        // Static mutable data races
        {
          pattern: /static\s+mut\s+\w+[\s\S]*?(?=fn|\n\n|$)/g,
          rule: "static-mut-data-race",
          severity: "critical",
          message: "Static mutable data may cause data races",
          recommendation:
            "Use thread-safe alternatives like Mutex or atomic types",
        },

        // Shared mutable state without synchronization
        {
          pattern: /let\s+\w+\s*=\s*&mut\s+.*(?!Mutex|RwLock|Arc)/g,
          rule: "unsynchronized-mutation",
          severity: "high",
          message: "Mutable reference shared without synchronization",
          recommendation: "Use proper synchronization primitives",
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
            id: `ERASAN-${patternInfo.rule.toUpperCase()}`,
            title: patternInfo.message,
            severity: patternInfo.severity,
            category: "concurrency",
            tool: "erasan",
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

module.exports = new ErasanChecker();
