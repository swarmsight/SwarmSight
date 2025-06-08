// CSV Formatter for SwarmSight reports
class CSVFormatter {
  format(results) {
    const headers = ["Severity", "Message", "File", "Line", "Column", "Rule", "Checker", "Description"];
    let csv = headers.join(",") + "\n";
    
    if (results.findings.length === 0) {
      csv += "No findings,,,,,,,\n";
    } else {
      results.findings.forEach((finding) => {
        const row = [
          finding.severity || "",
          `"${(finding.message || "").replace(/"/g, '""')}"`,
          `"${(finding.file || "").replace(/"/g, '""')}"`,
          finding.line || "",
          finding.column || "",
          `"${(finding.rule || "").replace(/"/g, '""')}"`,
          `"${(finding.checker || "").replace(/"/g, '""')}"`,
          `"${(finding.description || "").replace(/"/g, '""')}"`
        ];
        csv += row.join(",") + "\n";
      });
    }
    
    return csv;
  }
}

module.exports = new CSVFormatter();
