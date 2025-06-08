// SwarmSight Lockbud Checker for Rust

/**
 * Lockbud Checker
 *
 * A static analysis tool for detecting memory and concurrency bugs in Rust code.
 * This module wraps the lockbud tool and integrates it with SwarmSight.
 */

const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const chalk = require("chalk");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Checker metadata
const checker = {
  id: "lockbud",
  name: "Lockbud",
  description: "Detects memory and concurrency bugs in Rust code",
  type: "static",
  severity: "critical",
  languages: ["rust"],
  website: "https://github.com/swarmsight/lockbud",
  categories: ["memory-safety", "concurrency"],
};

/**
 * Check if lockbud is installed
 */
async function checkInstallation() {
  try {
    const { stdout, stderr } = await exec("lockbud --version");
    return {
      installed: true,
      version: stdout.trim(),
    };
  } catch (error) {
    return {
      installed: false,
      error: error.message,
    };
  }
}

/**
 * Install lockbud if not already installed
 */
async function ensureInstalled() {
  const installStatus = await checkInstallation();

  if (installStatus.installed) {
    console.log(chalk.green(`Using Lockbud ${installStatus.version}`));
    return true;
  }

  console.log(
    chalk.yellow("Lockbud is not installed. Attempting to install...")
  );

  try {
    console.log(chalk.blue("Installing Lockbud via cargo..."));
    await exec("cargo install lockbud");

    const status = await checkInstallation();
    if (status.installed) {
      console.log(
        chalk.green(`Successfully installed Lockbud ${status.version}`)
      );
      return true;
    } else {
      console.error(chalk.red("Failed to install Lockbud."));
      return false;
    }
  } catch (error) {
    console.error(chalk.red("Error installing Lockbud:"), error.message);
    return false;
  }
}

/**
 * Parse lockbud output into SwarmSight findings format
 */
function parseLockbudOutput(output, projectPath) {
  const findings = [];
  const lines = output.split("\n");

  let currentFinding = null;

  for (const line of lines) {
    // Example lockbud output format (simplified for demonstration)
    // error[LOCKBUD_UAF]: Use-after-free detected
    //   --> src/main.rs:42:10
    //    |
    // 42 |     ptr.use_after_free();
    //    |          ^^^^^^^^^^^^^^^ using freed memory here
    //    |
    //    = note: Memory was freed at src/main.rs:40:10

    const errorMatch = line.match(/error\[([^\]]+)\]:\s*(.+)/);
    if (errorMatch) {
      // Start a new finding
      currentFinding = {
        id: `LOCKBUD-${errorMatch[1]}`,
        title: errorMatch[2],
        severity: "critical",
        category: "Memory Safety",
        tool: "lockbud",
        description: errorMatch[2],
        codeSnippets: [],
        locations: [],
      };
      findings.push(currentFinding);
      continue;
    }

    if (!currentFinding) continue;

    // Look for file location info
    const locationMatch = line.match(/-->\s*([^:]+):(\d+):(\d+)/);
    if (locationMatch && currentFinding) {
      const filePath = path.resolve(projectPath, locationMatch[1]);
      currentFinding.locations.push({
        file: filePath,
        line: parseInt(locationMatch[2], 10),
        column: parseInt(locationMatch[3], 10),
      });
      continue;
    }

    // Look for code snippet lines
    const codeLineMatch = line.match(/(\d+)\s*\|\s*(.+)/);
    if (codeLineMatch && currentFinding) {
      currentFinding.codeSnippets.push({
        line: parseInt(codeLineMatch[1], 10),
        code: codeLineMatch[2],
        file:
          currentFinding.locations.length > 0
            ? currentFinding.locations[0].file
            : null,
      });
      continue;
    }

    // Look for notes that provide additional context
    const noteMatch = line.match(/=\s*note:\s*(.+)/);
    if (noteMatch && currentFinding) {
      currentFinding.description += "\n\n" + noteMatch[1];
    }
  }

  // Add recommendations based on the type of finding
  findings.forEach((finding) => {
    if (finding.id.includes("UAF")) {
      finding.recommendation =
        "Ensure memory is not accessed after being freed. Consider using safe abstractions like Box<T>, Rc<T>, or Arc<T>.";
    } else if (finding.id.includes("DOUBLE_FREE")) {
      finding.recommendation =
        "Avoid freeing memory that has already been freed. Use RAII principles with smart pointers.";
    } else if (finding.id.includes("DATA_RACE")) {
      finding.recommendation =
        "Protect shared mutable state with a mutex or use message passing.";
    } else if (finding.id.includes("DEADLOCK")) {
      finding.recommendation =
        "Avoid acquiring locks in different orders in different threads.";
    } else {
      finding.recommendation =
        "Review the code carefully and ensure proper memory and concurrency management.";
    }
  });

  return findings;
}

/**
 * Run lockbud on a Rust project
 */
async function scan(projectPath, options = {}) {
  console.log(chalk.blue("Running Lockbud security checker..."));

  // Ensure lockbud is installed
  const installed = await ensureInstalled();
  if (!installed) {
    console.error(
      chalk.red(
        "Lockbud is not installed and could not be installed automatically."
      )
    );
    console.error(
      chalk.yellow("You can install it manually with: cargo install lockbud")
    );
    return { findings: [] };
  }

  return new Promise((resolve) => {
    // Prepare command options
    const cmdOptions = ["analyze"];

    // Add any custom options from the config
    if (options.lockbud && options.lockbud.options) {
      Object.entries(options.lockbud.options).forEach(([key, value]) => {
        cmdOptions.push(`--${key}=${value}`);
      });
    }

    // Run lockbud as a child process
    const lockbudProcess = spawn("lockbud", cmdOptions, {
      cwd: projectPath,
      shell: true,
    });

    let output = "";
    let errorOutput = "";

    lockbudProcess.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;

      // Print progress to console if verbose
      if (options.verbose) {
        process.stdout.write(chunk);
      }
    });

    lockbudProcess.stderr.on("data", (data) => {
      const chunk = data.toString();
      errorOutput += chunk;

      // Print errors to console
      if (options.verbose) {
        process.stderr.write(chunk);
      }
    });

    lockbudProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(chalk.red(`Lockbud exited with code ${code}`));
        console.error(chalk.red("Error output:"));
        console.error(errorOutput);

        resolve({ findings: [] });
        return;
      }

      console.log(chalk.green("Lockbud analysis completed."));

      // Parse the output to extract findings
      const findings = parseLockbudOutput(output, projectPath);

      console.log(chalk.green(`Found ${findings.length} issues.`));

      resolve({ findings });
    });
  });
}

module.exports = {
  ...checker,
  scan,
  checkInstallation,
  ensureInstalled,
};
