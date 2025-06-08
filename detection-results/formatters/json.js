// JSON Formatter for SwarmSight reports
class JSONFormatter {
  format(results) {
    return JSON.stringify(results, null, 2);
  }
}

module.exports = new JSONFormatter();
