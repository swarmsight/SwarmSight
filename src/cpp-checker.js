// SwarmSight C++ Checker Module

/**
 * C++ Checker Module
 *
 * This module provides an interface to all available C++ security checkers
 * and handles their integration with the main SwarmSight scanner.
 */

const path = require("path");
const fs = require("fs");

/**
 * Base C++ checker implementation
 */
class CppChecker {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.severity = config.severity;
    this.category = config.category;
    this.language = "cpp";
    this.available = config.available;
  }
  async scan(projectPath, options = {}) {
    console.log(`Running ${this.name} checker...`);

    // Enhanced C++ security analysis
    const findings = await this.performCppSecurityAnalysis(projectPath);
    return { findings };
  }

  async performCppSecurityAnalysis(projectPath) {
    const findings = [];

    try {
      // Find all C/C++ files in the target path
      const cppFiles = this.findCppFiles(projectPath);

      for (const filePath of cppFiles) {
        const content = fs.readFileSync(filePath, "utf8");
        const fileFindings = this.analyzeCppSecurity(content, filePath);
        findings.push(...fileFindings);
      }
    } catch (error) {
      console.error(`Error in ${this.name} analysis: ${error.message}`);
    }

    return findings;
  }

  findCppFiles(dirPath) {
    const cppFiles = [];
    const extensions = [".cpp", ".cc", ".cxx", ".c", ".h", ".hpp", ".hxx"];

    const walkDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory() && !file.startsWith(".") && file !== "build") {
            walkDir(filePath);
          } else if (extensions.some((ext) => file.endsWith(ext))) {
            cppFiles.push(filePath);
          }
        }
      } catch (error) {
        // Skip inaccessible directories
      }
    };

    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (extensions.some((ext) => dirPath.endsWith(ext))) {
      cppFiles.push(dirPath);
    }

    return cppFiles;
  }

  analyzeCppSecurity(content, filePath) {
    const findings = [];
    const lines = content.split("\n");

    // C++ security vulnerability patterns
    const patterns = [
      {
        regex: /strcpy\s*\(/g,
        severity: "critical",
        message: "Buffer overflow vulnerability - strcpy is unsafe",
        rule: "unsafe-strcpy",
        recommendation: "Use strncpy() or std::string instead of strcpy()",
      },
      {
        regex: /strcat\s*\(/g,
        severity: "critical",
        message: "Buffer overflow vulnerability - strcat is unsafe",
        rule: "unsafe-strcat",
        recommendation: "Use strncat() or std::string instead of strcat()",
      },
      {
        regex: /gets\s*\(/g,
        severity: "critical",
        message: "Buffer overflow vulnerability - gets() is extremely unsafe",
        rule: "unsafe-gets",
        recommendation: "Use fgets() or std::getline() instead of gets()",
      },
      {
        regex: /sprintf\s*\(/g,
        severity: "high",
        message: "Buffer overflow vulnerability - sprintf is unsafe",
        rule: "unsafe-sprintf",
        recommendation: "Use snprintf() or std::stringstream instead",
      },
      {
        regex: /scanf\s*\(/g,
        severity: "high",
        message:
          "Input validation vulnerability - scanf can cause buffer overflow",
        rule: "unsafe-scanf",
        recommendation: "Use safer input methods with bounds checking",
      },
      {
        regex: /malloc\s*\(/g,
        severity: "medium",
        message: "Manual memory management - potential memory leak",
        rule: "manual-malloc",
        recommendation:
          "Consider using RAII or smart pointers instead of malloc",
      },
      {
        regex: /free\s*\(/g,
        severity: "medium",
        message: "Manual memory deallocation - verify proper usage",
        rule: "manual-free",
        recommendation:
          "Ensure every malloc has corresponding free and no double-free",
      },
      {
        regex: /delete\s+\w+\s*;(?!\s*\/\/.*null)/g,
        severity: "medium",
        message: "Raw delete without nullifying pointer",
        rule: "delete-without-null",
        recommendation:
          "Set pointer to nullptr after delete to prevent use-after-free",
      },
      {
        regex: /new\s+\w+/g,
        severity: "low",
        message: "Raw new operator - consider smart pointers",
        rule: "raw-new",
        recommendation:
          "Use std::make_unique or std::make_shared for automatic memory management",
      },
      {
        regex: /system\s*\(/g,
        severity: "critical",
        message: "Command injection vulnerability - system() is dangerous",
        rule: "unsafe-system",
        recommendation:
          "Use safer alternatives like execvp() with proper input validation",
      },
      {
        regex: /rand\s*\(\)/g,
        severity: "medium",
        message: "Weak random number generation",
        rule: "weak-random",
        recommendation:
          "Use std::random_device and proper random number generators",
      },
      {
        regex: /const_cast\s*</g,
        severity: "high",
        message: "const_cast removes const protection - potentially dangerous",
        rule: "const-cast-removal",
        recommendation: "Avoid const_cast unless absolutely necessary",
      },
      {
        regex: /reinterpret_cast\s*</g,
        severity: "high",
        message: "reinterpret_cast bypasses type safety",
        rule: "unsafe-reinterpret-cast",
        recommendation: "Use safer cast alternatives when possible",
      },
      {
        regex: /memcpy\s*\(/g,
        severity: "medium",
        message: "memcpy usage - verify buffer bounds",
        rule: "memcpy-bounds",
        recommendation:
          "Ensure source and destination buffers are properly sized",
      },
      {
        regex: /\*\s*\w+\s*=.*malloc|alloca\s*\(/g,
        severity: "high",
        message: "Stack/heap allocation without size validation",
        rule: "unsafe-allocation",
        recommendation:
          "Validate allocation size and check for allocation failure",
      },
      {
        regex: /\.c_str\(\)\s*\+/g,
        severity: "medium",
        message: "Pointer arithmetic on c_str() result",
        rule: "cstr-pointer-arithmetic",
        recommendation: "Be careful with pointer arithmetic on string data",
      },
      {
        regex: /while\s*\(\s*1\s*\)|for\s*\(\s*;\s*;\s*\)/g,
        severity: "low",
        message: "Infinite loop detected - verify exit conditions",
        rule: "infinite-loop",
        recommendation: "Ensure infinite loops have proper exit conditions",
      },
      {
        regex: /goto\s+\w+/g,
        severity: "low",
        message: "goto statement - can make code hard to analyze",
        rule: "goto-usage",
        recommendation: "Consider structured control flow instead of goto",
      },
    ];

    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        const matches = line.matchAll(pattern.regex);
        for (const match of matches) {
          findings.push({
            id: `${this.id.toUpperCase()}-${pattern.rule.toUpperCase()}`,
            title: pattern.message,
            severity: pattern.severity,
            category: this.category,
            tool: this.id,
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
}

/**
 * Get all available C++ checkers based on options
 */
function getAvailableCheckers(options = {}) {
  const checkerConfigs = [
    {
      id: "cppcheck",
      name: "Cppcheck",
      description: "Static analysis tool for C/C++ code",
      severity: "high",
      category: "static-analysis",
      available: fs.existsSync(path.join(__dirname, "../cpp-checker/cppcheck")),
    },
  ];

  // Create checker instances for available checkers
  const availableCheckers = checkerConfigs
    .filter((config) => config.available)
    .map((config) => new CppChecker(config));

  return availableCheckers;
}

/**
 * Scan a target path with specified C++ checkers
 */
async function scan(targetPath, options = {}) {
  const results = {
    language: "cpp",
    checkers: [],
    findings: [],
    metadata: {
      scannedPath: targetPath,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };

  try {
    const checkers = getAvailableCheckers(options);

    for (const checker of checkers) {
      results.checkers.push(checker.name);

      // Use the checker's scan method
      const checkerResults = await checker.scan(targetPath, options);
      results.findings.push(...checkerResults.findings);
    }
  } catch (error) {
    results.error = error.message;
  }

  return results;
}

module.exports = {
  getAvailableCheckers,
  scan,
};
