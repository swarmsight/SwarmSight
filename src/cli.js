#!/usr/bin/env node

/**
 * SwarmSight CLI
 *
 * Command line interface for the SwarmSight security scanner
 */

const yargs = require("yargs");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const SwarmSightScanner = require("./scanner");
const packageJson = require("../package.json");

// Setup CLI options
const argv = yargs
  .usage("Usage: $0 <command> [options]")
  .command(
    "scan [path]",
    "Scan a project for security vulnerabilities",
    (yargs) => {
      return yargs.positional("path", {
        describe: "Path to the project to scan",
        default: process.cwd(),
      });
    }
  )
  .command("list-checkers", "List all available security checkers")
  .command("version", "Show version information")
  .command("install-checker <checker>", "Install a specific checker")

  // Global options
  .option("output-format", {
    alias: "f",
    describe: "Output format for the report",
    choices: ["json", "html", "markdown", "sarif", "csv"],
    default: "json",
  })
  .option("output-file", {
    alias: "o",
    describe: "Output file for the report",
    type: "string",
  })
  .option("severity", {
    alias: "s",
    describe: "Minimum severity level to report",
    choices: ["critical", "high", "medium", "low", "info"],
    default: "low",
  })
  .option("checkers", {
    alias: "c",
    describe: "Specific checkers to run (comma-separated)",
    type: "string",
    default: "all",
  })
  .option("exclude", {
    alias: "e",
    describe: "Paths to exclude (comma-separated)",
    type: "string",
    default: "node_modules,target,build,dist",
  })
  .option("ci", {
    describe: "CI mode: exit with non-zero code on findings",
    type: "boolean",
    default: false,
  })
  .option("fail-on", {
    describe:
      "Exit with error if findings with this severity or higher are found",
    choices: ["critical", "high", "medium", "low"],
    default: "critical",
  })
  .option("verbose", {
    alias: "v",
    describe: "Verbose output",
    type: "boolean",
    default: false,
  })
  .option("config", {
    describe: "Path to configuration file",
    type: "string",
  })
  .help("help")
  .alias("help", "h")
  .version(false).argv;

// Main function
async function main() {
  const command = argv._[0] || "scan";

  switch (command) {
    case "version":
      showVersion();
      break;

    case "list-checkers":
      await listCheckers();
      break;

    case "install-checker":
      await installChecker(argv._[1]);
      break;

    case "scan":
      await runScan();
      break;

    default:
      console.error(chalk.red(`Unknown command: ${command}`));
      yargs.showHelp();
      process.exit(1);
  }
}

// Show version information
function showVersion() {
  console.log(`SwarmSight v${packageJson.version}`);
  console.log(`Node.js ${process.version}`);
  console.log(`Platform: ${process.platform}`);
}

// List all available checkers
async function listCheckers() {
  console.log(chalk.blue("Available SwarmSight security checkers:"));

  // Get all checker modules
  const checkerModules = {
    rust: require("./rust-checker"),
    solidity: require("./solidity-checker"),
    go: require("./go-checker"),
    cpp: require("./cpp-checker"),
    move: require("./move-checker"),
  };

  for (const [language, module] of Object.entries(checkerModules)) {
    console.log(chalk.green(`\n${language.toUpperCase()} Checkers:`));

    const checkers = module.getAvailableCheckers();

    if (checkers.length === 0) {
      console.log(chalk.yellow("  No checkers available."));
      continue;
    }

    checkers.forEach((checker) => {
      console.log(chalk.white(`  ${checker.name} (${checker.id})`));
      console.log(chalk.gray(`    ${checker.description}`));
      console.log(chalk.gray(`    Type: ${checker.type}`));
      console.log(chalk.gray(`    Severity: ${checker.severity}`));
      if (checker.website) {
        console.log(chalk.gray(`    Website: ${checker.website}`));
      }
      console.log();
    });
  }
}

// Install a specific checker
async function installChecker(checkerName) {
  if (!checkerName) {
    console.error(chalk.red("Please specify a checker to install."));
    console.error(chalk.yellow("Usage: swarmsight install-checker <checker>"));
    console.error(
      chalk.yellow('Run "swarmsight list-checkers" to see available checkers.')
    );
    process.exit(1);
  }

  console.log(chalk.blue(`Installing checker: ${checkerName}`));

  // Logic to find and install the specific checker
  // This would depend on how checkers are packaged and distributed
  console.log(chalk.yellow("This functionality is not yet implemented."));
}

// Run a security scan
async function runScan() {
  const projectPath = path.resolve(argv.path || process.cwd());

  if (!fs.existsSync(projectPath)) {
    console.error(chalk.red(`Project path does not exist: ${projectPath}`));
    process.exit(1);
  }

  console.log(chalk.blue(`Starting security scan on: ${projectPath}`));

  // Parse exclude paths
  const excludePaths = argv.exclude
    ? argv.exclude.split(",").map((p) => p.trim())
    : [];

  // Parse checkers
  const checkers =
    argv.checkers === "all"
      ? "all"
      : argv.checkers.split(",").map((c) => c.trim());

  // Create scanner with options
  const scanner = new SwarmSightScanner({
    projectPath,
    outputFormat: argv["output-format"],
    outputFile: argv["output-file"],
    severity: argv.severity,
    checkers,
    exclude: excludePaths,
    verbose: argv.verbose,
    ci: argv.ci,
    failOn: argv["fail-on"],
  });

  try {
    // Run the scan
    const results = await scanner.scan();

    // Show a summary
    console.log(chalk.blue("\nScan Summary:"));
    console.log(chalk.white(`Total issues found: ${results.summary.total}`));

    if (results.summary.critical > 0) {
      console.log(chalk.red(`Critical: ${results.summary.critical}`));
    } else {
      console.log(chalk.green(`Critical: ${results.summary.critical}`));
    }

    if (results.summary.high > 0) {
      console.log(chalk.magenta(`High: ${results.summary.high}`));
    } else {
      console.log(chalk.green(`High: ${results.summary.high}`));
    }

    if (results.summary.medium > 0) {
      console.log(chalk.yellow(`Medium: ${results.summary.medium}`));
    } else {
      console.log(chalk.green(`Medium: ${results.summary.medium}`));
    }

    console.log(chalk.white(`Low: ${results.summary.low}`));
    console.log(chalk.white(`Info: ${results.summary.info || 0}`));

    // Exit with non-zero code in CI mode if issues are found
    if (argv.ci) {
      const severityLevels = ["critical", "high", "medium", "low"];
      const failOnLevel = severityLevels.indexOf(argv["fail-on"]);

      let shouldFail = false;

      for (let i = 0; i <= failOnLevel; i++) {
        const level = severityLevels[i];
        if (results.summary[level] > 0) {
          shouldFail = true;
          break;
        }
      }

      if (shouldFail) {
        console.error(
          chalk.red(
            `\nExiting with error due to ${argv["fail-on"]} or higher severity findings.`
          )
        );
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(chalk.red("Error during scan:"), error.message);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error(chalk.red("Unhandled error:"), error.message);
  process.exit(1);
});
