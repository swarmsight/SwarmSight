// SwarmSight Shuttle Checker Module
// Shuttle is a library for testing concurrent Rust programs

const path = require("path");
const { execSync } = require("child_process");
const fs = require("fs");

class ShuttleChecker {
  constructor() {
    this.name = "Shuttle";
    this.description = "Library for testing concurrent Rust programs";
    this.severity = "medium";
    this.category = "concurrency-testing";
    this.language = "rust";
    this.basePath = path.join(
      __dirname,
      "../../../rust-checker/dynamic/shuttle"
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
        results.error = "Shuttle checker not available";
        return results;
      }

      // Enhanced Shuttle analysis - Concurrency testing for Rust
      const findings = await this.performConcurrencyAnalysis(targetPath);
      results.findings = findings;
    } catch (error) {
      results.error = error.message;
    }

    return results;
  }

  async performConcurrencyAnalysis(targetPath) {
    const findings = [];

    try {
      // Find all Rust files in the target path
      const rustFiles = this.findRustFiles(targetPath);

      for (const filePath of rustFiles) {
        const content = fs.readFileSync(filePath, "utf8");
        const fileFindings = this.analyzeConcurrencyPatterns(content, filePath);
        findings.push(...fileFindings);
      }
    } catch (error) {
      console.error(`Error in Shuttle analysis: ${error.message}`);
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

  analyzeConcurrencyPatterns(content, filePath) {
    const findings = [];
    const lines = content.split("\n");

    // Concurrency testing patterns for Shuttle
    const patterns = [
      {
        regex: /std::thread::spawn\s*\(/g,
        severity: "medium",
        message: "Thread spawn detected - potential concurrency issues",
        rule: "thread-spawn",
        recommendation:
          "Use Shuttle to test thread interactions and detect race conditions",
      },
      {
        regex: /Arc<Mutex<[^>]*>>/g,
        severity: "medium",
        message: "Shared mutable state with Arc<Mutex> - test for deadlocks",
        rule: "shared-mutex-state",
        recommendation:
          "Test mutex usage patterns with Shuttle to detect deadlocks",
      },
      {
        regex: /Arc<RwLock<[^>]*>>/g,
        severity: "medium",
        message: "Shared state with RwLock - verify reader-writer correctness",
        rule: "shared-rwlock-state",
        recommendation:
          "Test RwLock usage with Shuttle to ensure reader-writer safety",
      },
      {
        regex: /channel\(\)|mpsc::/g,
        severity: "medium",
        message: "Channel communication detected - test message ordering",
        rule: "channel-communication",
        recommendation: "Use Shuttle to test channel communication patterns",
      },
      {
        regex: /Condvar|std::sync::Condvar/g,
        severity: "high",
        message: "Condition variable usage - potential for lost wakeups",
        rule: "condition-variable",
        recommendation:
          "Test condition variable patterns with Shuttle for correctness",
      },
      {
        regex: /atomic::|Atomic(?:Bool|I\d+|U\d+|Ptr)/g,
        severity: "medium",
        message: "Atomic operations detected - verify memory ordering",
        rule: "atomic-operations",
        recommendation: "Test atomic operation ordering with Shuttle",
      },
      {
        regex: /\.join\(\)/g,
        severity: "low",
        message: "Thread join operation - verify completion semantics",
        rule: "thread-join",
        recommendation:
          "Ensure proper thread joining patterns with Shuttle testing",
      },
      {
        regex: /unsafe\s*\{[\s\S]*?(?:send|sync)[\s\S]*?\}/gi,
        severity: "high",
        message: "Unsafe Send/Sync implementation - test thread safety",
        rule: "unsafe-send-sync",
        recommendation:
          "Thoroughly test unsafe Send/Sync implementations with Shuttle",
      },
      {
        regex: /std::sync::Once|once_cell/g,
        severity: "medium",
        message:
          "One-time initialization detected - test initialization race conditions",
        rule: "once-initialization",
        recommendation:
          "Test one-time initialization patterns for race conditions",
      },
      {
        regex: /\.wait\(\)|\.notify_one\(\)|\.notify_all\(\)/g,
        severity: "high",
        message:
          "Condition variable wait/notify operations - test for missed signals",
        rule: "condvar-wait-notify",
        recommendation:
          "Test wait/notify patterns with Shuttle to prevent missed signals",
      },
    ];

    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        const matches = line.matchAll(pattern.regex);
        for (const match of matches) {
          findings.push({
            id: `SHUTTLE-${pattern.rule.toUpperCase()}`,
            title: pattern.message,
            severity: pattern.severity,
            category: "concurrency-testing",
            tool: "shuttle",
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

module.exports = new ShuttleChecker();
