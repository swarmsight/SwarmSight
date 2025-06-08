// SwarmSight AtomV Checker Module
// AtomV is a tool for detecting atomicity violations in Rust programs

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class AtomVChecker {
  constructor() {
    this.name = "AtomV";
    this.description =
      "Tool for detecting atomicity violations in Rust programs";
    this.severity = "high";
    this.category = "concurrency-analysis";
    this.language = "rust";
    this.basePath = path.join(
      __dirname,
      "../../../rust-checker/static/AtomVChecker"
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
          "AtomV tool not installed, running pattern-based analysis..."
        );
      }

      // Real Rust concurrency analysis patterns
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

      // AtomV-style concurrency vulnerability patterns
      const vulnerabilityPatterns = [
        // Atomicity violation patterns
        {
          pattern: /Arc::new\([^)]+\)[\s\S]*?\.load\([\s\S]*?\.store\(/g,
          rule: "atomicity-violation",
          severity: "high",
          message: "Potential atomicity violation in concurrent access",
          recommendation:
            "Use proper atomic operations or synchronization primitives",
        },

        // Memory ordering issues
        {
          pattern: /Ordering::Relaxed.*(?!SeqCst|AcqRel|Acquire|Release)/g,
          rule: "weak-memory-ordering",
          severity: "medium",
          message: "Relaxed memory ordering may cause unexpected behavior",
          recommendation: "Consider stronger memory ordering guarantees",
        },

        // Data race patterns
        {
          pattern: /static\s+mut\s+\w+|lazy_static.*mut/g,
          rule: "static-mut-race",
          severity: "high",
          message: "Static mutable data may cause data races",
          recommendation:
            "Use thread-safe alternatives like Mutex or AtomicXxx",
        },

        // Lock-free programming issues
        {
          pattern:
            /compare_and_swap|compare_exchange.*(?!\.is_ok\(\)|\.is_err\(\))/g,
          rule: "cas-without-check",
          severity: "medium",
          message: "Compare-and-swap result not checked",
          recommendation:
            "Always check CAS operation results and handle failures",
        },

        // Shared mutable state without synchronization
        {
          pattern: /Rc<RefCell<|Rc<Cell<.*(?!Mutex|RwLock)/g,
          rule: "unsynchronized-shared-state",
          severity: "high",
          message: "Shared mutable state without proper synchronization",
          recommendation:
            "Use Mutex, RwLock, or atomic types for thread-safe sharing",
        },

        // Performance issues with memory ordering
        {
          pattern: /Ordering::SeqCst.*load|Ordering::SeqCst.*store/g,
          rule: "unnecessary-seq-cst",
          severity: "low",
          message: "Sequential consistency may be unnecessarily strong",
          recommendation:
            "Consider using weaker memory ordering for better performance",
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
            id: `ATOMV-${patternInfo.rule.toUpperCase()}`,
            title: patternInfo.message,
            severity: patternInfo.severity,
            category: "concurrency",
            tool: "atomv",
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

module.exports = new AtomVChecker();
