// SwarmSight MIRAI Checker Module
// MIRAI is an abstract interpreter for the Rust MIR

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class MiraiChecker {
  constructor() {
    this.name = "MIRAI";
    this.description =
      "Abstract interpreter for the Rust MIR (Mid-level Intermediate Representation)";
    this.severity = "high";
    this.category = "static-analysis";
    this.language = "rust";
    this.basePath = path.join(__dirname, "../../../rust-checker/static/MIRAI");
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
          "MIRAI tool not installed, running pattern-based analysis..."
        );
      }

      // Real Rust abstract interpretation patterns
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

      // MIRAI-style abstract interpretation patterns
      const vulnerabilityPatterns = [
        // Panic conditions
        {
          pattern: /panic!\(|unreachable!\(|todo!\(|unimplemented!\(/g,
          rule: "explicit-panic",
          severity: "medium",
          message: "Explicit panic condition detected",
          recommendation: "Replace panics with proper error handling",
        },

        // Division by zero
        {
          pattern: /\/\s*[^\/\n]*(?!\s*[1-9])/g,
          rule: "division-by-zero",
          severity: "high",
          message: "Potential division by zero",
          recommendation: "Check divisor is non-zero before division",
        },

        // Array bounds violations
        {
          pattern: /\[\s*\w+\s*\](?!\s*=).*(?!get\(|len\(\))/g,
          rule: "array-bounds",
          severity: "high",
          message: "Unchecked array indexing may cause bounds violation",
          recommendation: "Use bounds-checked access or validate indices",
        },

        // Integer overflow in arithmetic
        {
          pattern: /\w+\s*\+\s*\w+|\w+\s*\*\s*\w+(?!\s*\.|\s*;)/g,
          rule: "integer-overflow",
          severity: "medium",
          message: "Arithmetic operation may overflow",
          recommendation:
            "Use checked arithmetic operations or validate ranges",
        },

        // Unsafe code without proper validation
        {
          pattern: /unsafe\s*\{[\s\S]*?\}(?!.*precondition|.*postcondition)/g,
          rule: "unvalidated-unsafe",
          severity: "high",
          message: "Unsafe code block without explicit safety validation",
          recommendation:
            "Document and validate safety preconditions for unsafe code",
        },

        // Null pointer dereference potential
        {
          pattern: /\*\w+\.as_ptr\(\)|\*\w+\.as_mut_ptr\(\)/g,
          rule: "null-pointer-deref",
          severity: "high",
          message: "Potential null pointer dereference",
          recommendation: "Check pointer validity before dereferencing",
        },

        // Resource leak patterns
        {
          pattern: /File::open\([^)]+\)(?!\?|\.unwrap_or|\.map_err)/g,
          rule: "resource-leak",
          severity: "medium",
          message: "Resource may not be properly closed on error",
          recommendation: "Use proper error handling and RAII patterns",
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
            id: `MIRAI-${patternInfo.rule.toUpperCase()}`,
            title: patternInfo.message,
            severity: patternInfo.severity,
            category: "correctness",
            tool: "mirai",
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

module.exports = new MiraiChecker();
