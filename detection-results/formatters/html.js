// SwarmSight HTML Formatter

/**
 * HTML output formatter for SwarmSight scan results
 */

function format(results) {
    const timestamp = new Date(results.metadata.timestamp).toLocaleString();
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SwarmSight Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .finding { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .critical { border-left-color: #e74c3c; }
        .high { border-left-color: #f39c12; }
        .medium { border-left-color: #f1c40f; }
        .low { border-left-color: #3498db; }
        .info { border-left-color: #95a5a6; }
        .severity { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; }
        .severity.critical { background-color: #e74c3c; }
        .severity.high { background-color: #f39c12; }
        .severity.medium { background-color: #f1c40f; }
        .severity.low { background-color: #3498db; }
        .severity.info { background-color: #95a5a6; }
        .metadata { color: #7f8c8d; font-size: 12px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 SwarmSight Security Report</h1>
        <p>Generated on ${timestamp} | SwarmSight v${results.metadata.version}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Findings:</strong> ${results.summary.total}</p>
        <p><strong>Critical:</strong> ${results.summary.critical} | <strong>High:</strong> ${results.summary.high} | <strong>Medium:</strong> ${results.summary.medium} | <strong>Low:</strong> ${results.summary.low} | <strong>Info:</strong> ${results.summary.info}</p>
    </div>
    
    <div class="findings">
        <h2>Findings</h2>`;
    
    if (results.findings.length === 0) {
        html += '<p>No security findings detected.</p>';
    } else {
        results.findings.forEach(finding => {
            html += `
        <div class="finding ${finding.severity}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>${finding.message}</h3>
                <span class="severity ${finding.severity}">${finding.severity.toUpperCase()}</span>
            </div>
            <p><strong>File:</strong> ${finding.file}</p>
            <p><strong>Line:</strong> ${finding.line} | <strong>Column:</strong> ${finding.column}</p>
            <p><strong>Rule:</strong> ${finding.rule}</p>
            <p><strong>Checker:</strong> ${finding.checker}</p>
            <div class="metadata">
                ${finding.description || ''}
            </div>
        </div>`;
        });
    }
    
    html += `
    </div>
</body>
</html>`;
    
    return html;
}

function getFileExtension() {
    return '.html';
}

function getMimeType() {
    return 'text/html';
}

module.exports = {
    format,
    getFileExtension,
    getMimeType
};
