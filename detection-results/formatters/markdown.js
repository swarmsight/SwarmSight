// Markdown Formatter for SwarmSight reports
class MarkdownFormatter {
  format(results) {
    const { metadata, summary, findings } = results;
    
    let markdown = `# 🔍 SwarmSight Security Report

## 📊 Scan Information
- **Project:** ${metadata.projectName}
- **Scan Date:** ${metadata.timestamp}
- **Version:** ${metadata.version}
- **Checkers:** ${metadata.options.checkers}

## 📈 Summary
- **Total Issues:** ${summary.total}
- **Critical:** ${summary.critical}
- **High:** ${summary.high}
- **Medium:** ${summary.medium}
- **Low:** ${summary.low}
- **Info:** ${summary.info}

## 🔍 Findings

`;

    findings.forEach((finding, index) => {
      const severityEmoji = {
        critical: '🚨',
        high: '⚠️',
        medium: '⚡',
        low: '💡',
        info: 'ℹ️'
      };

      markdown += `### ${severityEmoji[finding.severity]} ${finding.title}

- **Severity:** ${finding.severity.toUpperCase()}
- **File:** \`${finding.file}\`
- **Line:** ${finding.line}
- **Tool:** ${finding.tool}
- **Rule:** ${finding.rule}

**Description:** ${finding.description}

**Recommendation:** ${finding.recommendation}

`;

      if (finding.codeSnippet) {
        markdown += `**Code Snippet:**
\`\`\`
${finding.codeSnippet}
\`\`\`

`;
      }

      markdown += '---\n\n';
    });

    return markdown;
  }
}

module.exports = new MarkdownFormatter();
