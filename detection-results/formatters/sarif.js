// SARIF Formatter for SwarmSight reports
class SARIFFormatter {
  format(results) {
    const sarif = {
      version: "2.1.0",
      $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
      runs: [{
        tool: {
          driver: {
            name: "SwarmSight",
            version: results.metadata.version,
            informationUri: "https://swarmsight.io",
            rules: []
          }
        },
        results: [],
        originalUriBaseIds: {
          SRCROOT: {
            uri: `file:///${results.metadata.options.projectPath.replace(/\\/g, "/")}/`
          }
        }
      }]
    };

    const run = sarif.runs[0];
    const ruleMap = new Map();

    results.findings.forEach((finding) => {
      const ruleId = finding.rule || "unknown-rule";

      if (!ruleMap.has(ruleId)) {
        ruleMap.set(ruleId, {
          id: ruleId,
          name: finding.rule || "Unknown Rule",
          shortDescription: { text: finding.message },
          fullDescription: { text: finding.description || finding.message },
          help: { text: `This rule is checked by ${finding.checker}` },
          properties: { category: finding.category || "security", checker: finding.checker }
        });
        run.tool.driver.rules.push(ruleMap.get(ruleId));
      }

      const severityToLevel = { critical: "error", high: "error", medium: "warning", low: "note", info: "note" };
      const result = {
        ruleId: ruleId,
        level: severityToLevel[finding.severity] || "note",
        message: { text: finding.message },
        locations: [{
          physicalLocation: {
            artifactLocation: { uri: finding.file.replace(/\\/g, "/"), uriBaseId: "SRCROOT" },
            region: { startLine: finding.line || 1, startColumn: finding.column || 1 }
          }
        }],
        properties: { checker: finding.checker, severity: finding.severity }
      };

      if (finding.description) {
        result.message.markdown = finding.description;
      }

      run.results.push(result);
    });

    return JSON.stringify(sarif, null, 2);
  }
}

module.exports = new SARIFFormatter();
