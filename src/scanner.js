// SwarmSight Core Scanner Module

/**
 * SwarmSight Scanner - Main entry point for security scanning
 *
 * This module provides the core scanning functionality that orchestrates
 * the various language-specific checkers and produces consolidated results.
 */

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

class SwarmSightScanner {
  constructor(options = {}) {
    this.options = {
      projectPath: options.projectPath || process.cwd(),
      outputFormat: options.outputFormat || "json",
      outputFile: options.outputFile || "swarmsight-report.json",
      severity: options.severity || "low",
      checkers: options.checkers || "all",
      exclude: options.exclude || [],
      ...options,
    };

    this.results = {
      metadata: {
        tool: "SwarmSight",
        version: require("../package.json").version,
        timestamp: new Date().toISOString(),
        options: this.options,
      },
      summary: {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      },
      findings: [],
    };

    this.checkers = {
      rust: [],
      solidity: [],
      go: [],
      cpp: [],
      move: [],
    };

    this.loadCheckers();
  }

  /**
   * Load all available checkers based on configuration
   */
  loadCheckers() {
    // Load Rust checkers
    if (
      this.options.checkers === "all" ||
      this.options.checkers.includes("rust")
    ) {
      try {
        const rustCheckerPath = path.join(__dirname, "rust-checker");
        if (fs.existsSync(rustCheckerPath)) {
          const checkers = require("./rust-checker");
          this.checkers.rust = checkers.getAvailableCheckers(this.options);
          console.log(
            chalk.blue(`Loaded ${this.checkers.rust.length} Rust checkers`)
          );
        }
      } catch (error) {
        console.error(chalk.red("Error loading Rust checkers:"), error.message);
      }
    } // Load Solidity checkers
    if (
      this.options.checkers === "all" ||
      this.options.checkers.includes("solidity")
    ) {
      try {
        const solidityCheckerPath = path.join(__dirname, "solidity-checker.js");
        if (fs.existsSync(solidityCheckerPath)) {
          const checkers = require("./solidity-checker");
          this.checkers.solidity = checkers.getAvailableCheckers(this.options);
          console.log(
            chalk.blue(
              `Loaded ${this.checkers.solidity.length} Solidity checkers`
            )
          );
        }
      } catch (error) {
        console.error(
          chalk.red("Error loading Solidity checkers:"),
          error.message
        );
      }
    }

    // Load Go checkers
    if (
      this.options.checkers === "all" ||
      this.options.checkers.includes("go")
    ) {
      try {
        const goCheckerPath = path.join(__dirname, "go-checker.js");
        if (fs.existsSync(goCheckerPath)) {
          const checkers = require("./go-checker");
          this.checkers.go = checkers.getAvailableCheckers(this.options);
          console.log(
            chalk.blue(`Loaded ${this.checkers.go.length} Go checkers`)
          );
        }
      } catch (error) {
        console.error(chalk.red("Error loading Go checkers:"), error.message);
      }
    }

    // Load C++ checkers
    if (
      this.options.checkers === "all" ||
      this.options.checkers.includes("cpp")
    ) {
      try {
        const cppCheckerPath = path.join(__dirname, "cpp-checker.js");
        if (fs.existsSync(cppCheckerPath)) {
          const checkers = require("./cpp-checker");
          this.checkers.cpp = checkers.getAvailableCheckers(this.options);
          console.log(
            chalk.blue(`Loaded ${this.checkers.cpp.length} C++ checkers`)
          );
        }
      } catch (error) {
        console.error(chalk.red("Error loading C++ checkers:"), error.message);
      }
    }

    // Load Move checkers
    if (
      this.options.checkers === "all" ||
      this.options.checkers.includes("move")
    ) {
      try {
        const moveCheckerPath = path.join(__dirname, "move-checker.js");
        if (fs.existsSync(moveCheckerPath)) {
          const checkers = require("./move-checker");
          this.checkers.move = checkers.getAvailableCheckers(this.options);
          console.log(
            chalk.blue(`Loaded ${this.checkers.move.length} Move checkers`)
          );
        }
      } catch (error) {
        console.error(chalk.red("Error loading Move checkers:"), error.message);
      }
    }
  }

  /**
   * Scan the project for security vulnerabilities
   */
  async scan() {
    console.log(
      chalk.green(`Starting SwarmSight scan on ${this.options.projectPath}`)
    );

    // Detect project languages
    const languages = await this.detectLanguages();
    console.log(chalk.blue(`Detected languages: ${languages.join(", ")}`));

    // Run language-specific checkers
    const promises = [];

    for (const language of languages) {
      if (this.checkers[language] && this.checkers[language].length > 0) {
        promises.push(this.runLanguageCheckers(language));
      }
    }
    await Promise.all(promises);

    // Update summary stats
    this.updateSummary();

    // Calculate security score
    const securityScore = this.calculateSecurityScore();
    this.results.securityScore = securityScore;

    // Display security score    console.log(chalk.cyan('\n=== Security Score ==='));
    console.log(
      chalk.bold(`Score: ${securityScore.score}/100 (${securityScore.rating})`)
    );
    console.log(chalk.gray(`Details: ${securityScore.details}`));
    if (securityScore.breakdown) {
      console.log(
        chalk.gray(
          `Issues: Critical(${securityScore.breakdown.critical}) High(${securityScore.breakdown.high}) Medium(${securityScore.breakdown.medium}) Low(${securityScore.breakdown.low}) Info(${securityScore.breakdown.info})`
        )
      );
    }

    // Generate and save report
    await this.generateReport();

    return this.results;
  }

  /**
   * Detect languages used in the project
   */
  async detectLanguages() {
    const detectedLanguages = new Set();

    // Simple file extension-based detection
    const fileExtensions = {
      rust: [".rs"],
      solidity: [".sol"],
      go: [".go"],
      cpp: [".cpp", ".cc", ".h", ".hpp"],
      move: [".move"],
    };

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && !this.options.exclude.includes(file)) {
          walkDir(filePath);
        } else {
          const ext = path.extname(file).toLowerCase();

          for (const [language, extensions] of Object.entries(fileExtensions)) {
            if (extensions.includes(ext)) {
              detectedLanguages.add(language);
              break;
            }
          }
        }
      }
    };

    walkDir(this.options.projectPath);

    return Array.from(detectedLanguages);
  }

  /**
   * Run all checkers for a specific language
   */
  async runLanguageCheckers(language) {
    console.log(chalk.blue(`Running ${language} security checks...`));

    const checkers = this.checkers[language];
    const promises = checkers.map((checker) =>
      this.runChecker(checker, language)
    );

    const results = await Promise.all(promises);

    // Flatten results and add to findings
    results.forEach((result) => {
      if (result && result.findings) {
        this.results.findings.push(...result.findings);
      }
    });

    console.log(chalk.green(`Completed ${language} security checks`));
  }

  /**
   * Run a specific checker
   */
  async runChecker(checker, language) {
    try {
      console.log(chalk.blue(`  Running ${checker.name}...`));
      const startTime = Date.now();

      const result = await checker.scan(this.options.projectPath, this.options);

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(
        chalk.green(
          `  Completed ${checker.name} in ${duration}ms, found ${result.findings.length} issues`
        )
      );

      return result;
    } catch (error) {
      console.error(
        chalk.red(`  Error running ${checker.name}:`),
        error.message
      );
      return { findings: [] };
    }
  }

  /**
   * Update summary statistics based on findings
   */
  updateSummary() {
    this.results.summary.total = this.results.findings.length;

    for (const finding of this.results.findings) {
      if (finding.severity) {
        this.results.summary[finding.severity.toLowerCase()] =
          (this.results.summary[finding.severity.toLowerCase()] || 0) + 1;
      }
    }
  }

  /**
   * Calculate security score based on findings
   */
  calculateSecurityScore() {
    const {
      critical = 0,
      high = 0,
      medium = 0,
      low = 0,
      info = 0,
    } = this.results.summary;
    const total = critical + high + medium + low + info;

    if (total === 0) {
      return {
        score: 100,
        rating: "Excellent",
        details: "No security issues found",
      };
    }

    // Weighted scoring system
    const criticalWeight = 20;
    const highWeight = 10;
    const mediumWeight = 5;
    const lowWeight = 1;
    const infoWeight = 0.5;

    const totalDeductions =
      critical * criticalWeight +
      high * highWeight +
      medium * mediumWeight +
      low * lowWeight +
      info * infoWeight;

    // Base score starts at 100, deduct based on severity
    const rawScore = Math.max(0, 100 - totalDeductions);

    // Apply scaling factor for better distribution
    const scaledScore = Math.max(0, Math.min(100, rawScore * 1.2));
    const score = Math.round(scaledScore);

    let rating;
    let details;

    if (score >= 90) {
      rating = "Excellent";
      details = "Very few security issues detected";
    } else if (score >= 75) {
      rating = "Good";
      details = "Some security issues found, but manageable";
    } else if (score >= 50) {
      rating = "Fair";
      details = "Moderate security issues that should be addressed";
    } else if (score >= 25) {
      rating = "Poor";
      details = "Significant security issues requiring immediate attention";
    } else {
      rating = "Critical";
      details = "Severe security issues found - immediate action required";
    }

    return {
      score,
      rating,
      details,
      breakdown: { critical, high, medium, low, info },
    };
  }

  /**
   * Generate the report in the specified format
   */
  async generateReport() {
    const formatters = {
      json: require("../detection-results/formatters/json"),
      html: require("../detection-results/formatters/html"),
      markdown: require("../detection-results/formatters/markdown"),
      sarif: require("../detection-results/formatters/sarif"),
      csv: require("../detection-results/formatters/csv"),
    };

    const formatter = formatters[this.options.outputFormat];

    if (!formatter) {
      throw new Error(
        `Unsupported output format: ${this.options.outputFormat}`
      );
    }

    const report = formatter.format(this.results);

    if (this.options.outputFile) {
      fs.writeFileSync(this.options.outputFile, report);
      console.log(chalk.green(`Report saved to ${this.options.outputFile}`));
    }

    return report;
  }
}

module.exports = SwarmSightScanner;
