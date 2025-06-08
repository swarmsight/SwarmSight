// SwarmSight JSON Formatter

/**
 * JSON output formatter for SwarmSight scan results
 */

function format(results) {
  return JSON.stringify(results, null, 2);
}

function getFileExtension() {
  return ".json";
}

function getMimeType() {
  return "application/json";
}

module.exports = {
  format,
  getFileExtension,
  getMimeType,
};
