// HTML Formatter for SwarmSight reports
class HTMLFormatter {
  format(results) {
    const { metadata, summary, findings } = results;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>SwarmSight Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .summary { margin: 20px 0; }
        .finding { border: 1px solid #ddd; margin: 10px 0; padding: 10px; border-radius: 5px; }
        .critical { border-left: 5px solid #d32f2f; }
        .high { border-left: 5px solid #f57c00; }
        .medium { border-left: 5px solid #fbc02d; }
        .low { border-left: 5px solid #388e3c; }
        .info { border-left: 5px solid #1976d2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 SwarmSight Security Report</h1>
        <p><strong>Project:</strong> ${metadata.projectName}</p>
        <p><strong>Scan Date:</strong> ${metadata.timestamp}</p>
        <p><strong>Version:</strong> ${metadata.version}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Total Issues:</strong> ${summary.total}</p>
        <p><strong>Critical:</strong> ${summary.critical} | <strong>High:</strong> ${summary.high} | <strong>Medium:</strong> ${summary.medium} | <strong>Low:</strong> ${summary.low} | <strong>Info:</strong> ${summary.info}</p>
    </div>
    
    <div class="findings">
        <h2>🔍 Findings</h2>
        ${findings.map(finding => `
            <div class="finding ${finding.severity}">
                <h3>${finding.title}</h3>
                <p><strong>Severity:</strong> ${finding.severity.toUpperCase()}</p>
                <p><strong>File:</strong> ${finding.file}</p>
                <p><strong>Line:</strong> ${finding.line}</p>
                <p><strong>Tool:</strong> ${finding.tool}</p>
                <p><strong>Description:</strong> ${finding.description}</p>
                <p><strong>Recommendation:</strong> ${finding.recommendation}</p>
                ${finding.codeSnippet ? `<pre><code>${finding.codeSnippet}</code></pre>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
}

module.exports = new HTMLFormatter();
