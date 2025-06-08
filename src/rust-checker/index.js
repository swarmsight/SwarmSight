// SwarmSight Rust Checker Module

/**
 * Rust Checker Module
 *
 * This module provides an interface to all available Rust security checkers
 * and handles their integration with the main SwarmSight scanner.
 */

const path = require("path");
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const chalk = require("chalk");

// Import individual checkers
const lockbudChecker = require("./static/lockbud");
const rudraChecker = require("./static/rudra");
const rapxChecker = require("./static/rapx");
const atomvChecker = require("./static/atomv");
const cocoonChecker = require("./static/cocoon");
const miraiChecker = require("./static/mirai");
const erasanChecker = require("./dynamic/erasan");
const shuttleChecker = require("./dynamic/shuttle");
const kaniChecker = require("./verifier/kani");

/**
 * Get all available Rust checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const allCheckers = [
    lockbudChecker,
    rudraChecker,
    rapxChecker,
    atomvChecker,
    cocoonChecker,
    miraiChecker,
    erasanChecker,
    shuttleChecker,
    kaniChecker,
  ];

  // Filter checkers based on options
  let checkers = allCheckers;

  if (
    options.checkers &&
    options.checkers !== "all" &&
    options.checkers !== "rust"
  ) {
    const requestedCheckers = Array.isArray(options.checkers)
      ? options.checkers
      : options.checkers.split(",").map((c) => c.trim());

    checkers = allCheckers.filter(
      (checker) =>
        requestedCheckers.includes(checker.id) ||
        requestedCheckers.includes(checker.name.toLowerCase())
    );
  }

  // Filter by analyzer type if specified
  if (options.analyzerType) {
    const types = Array.isArray(options.analyzerType)
      ? options.analyzerType
      : [options.analyzerType];

    checkers = checkers.filter((checker) => types.includes(checker.type));
  }

  return checkers;
}

/**
 * Check if Rust is installed and get its version
 */
function checkRustInstallation() {
  try {
    const rustcVersion = execSync("rustc --version", { encoding: "utf8" });
    const cargoVersion = execSync("cargo --version", { encoding: "utf8" });

    return {
      installed: true,
      rustc: rustcVersion.trim(),
      cargo: cargoVersion.trim(),
    };
  } catch (error) {
    return {
      installed: false,
      error: error.message,
    };
  }
}

/**
 * Check if a project is a Rust project
 */
function isRustProject(projectPath) {
  const cargoTomlPath = path.join(projectPath, "Cargo.toml");
  return fs.existsSync(cargoTomlPath);
}

/**
 * Get Rust project metadata
 */
function getRustProjectMetadata(projectPath) {
  if (!isRustProject(projectPath)) {
    return null;
  }

  try {
    const cargoTomlPath = path.join(projectPath, "Cargo.toml");
    const cargoToml = fs.readFileSync(cargoTomlPath, "utf8");

    // Very basic TOML parsing for demonstration purposes
    const nameMatch = cargoToml.match(/name\s*=\s*"([^"]+)"/);
    const versionMatch = cargoToml.match(/version\s*=\s*"([^"]+)"/);

    return {
      name: nameMatch ? nameMatch[1] : "unknown",
      version: versionMatch ? versionMatch[1] : "unknown",
      path: projectPath,
    };
  } catch (error) {
    console.error(chalk.red("Error reading Cargo.toml:"), error.message);
    return null;
  }
}

/**
 * Run a Rust security analysis with all selected checkers
 */
async function runSecurityAnalysis(projectPath, options = {}) {
  const rustInfo = checkRustInstallation();

  if (!rustInfo.installed) {
    console.error(
      chalk.red(
        "Rust is not installed. Please install Rust to use the Rust checkers."
      )
    );
    console.error(chalk.yellow("You can install Rust from https://rustup.rs/"));
    return { findings: [] };
  }

  console.log(chalk.blue(`Using ${rustInfo.rustc}`));
  console.log(chalk.blue(`Using ${rustInfo.cargo}`));

  if (!isRustProject(projectPath)) {
    console.warn(
      chalk.yellow(
        `The project at ${projectPath} does not appear to be a Rust project.`
      )
    );
    console.warn(
      chalk.yellow(
        `If this is a Rust project, ensure it has a Cargo.toml file.`
      )
    );
    return { findings: [] };
  }

  const projectMeta = getRustProjectMetadata(projectPath);
  console.log(
    chalk.blue(
      `Analyzing Rust project: ${projectMeta.name} v${projectMeta.version}`
    )
  );

  // Get available checkers based on options
  const checkers = getAvailableCheckers(options);

  if (checkers.length === 0) {
    console.warn(chalk.yellow("No Rust checkers selected."));
    return { findings: [] };
  }

  console.log(
    chalk.blue(`Running ${checkers.length} Rust security checkers...`)
  );

  // Run all selected checkers in parallel
  const promises = checkers.map((checker) =>
    checker.scan(projectPath, options)
  );
  const results = await Promise.all(promises);

  // Combine all findings
  const findings = results.flatMap((result) => result.findings || []);

  console.log(
    chalk.green(
      `Completed Rust security analysis. Found ${findings.length} issues.`
    )
  );

  return { findings };
}

module.exports = {
  getAvailableCheckers,
  checkRustInstallation,
  isRustProject,
  getRustProjectMetadata,
  runSecurityAnalysis,
};
