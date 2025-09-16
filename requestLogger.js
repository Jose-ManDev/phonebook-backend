const colors = {
  reset: '\x1b[0m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgBlue: '\x1b[34m',
  fgMagenta: '\x1b[35m',
  fgCyan: '\x1b[36m',
  fgWhite: '\x1b[37m'
  , fgOrange: '\x1b[38;5;208m'
};

function parseObject(obj) {
  return '{ ' + Object.entries(obj).map(([key, value]) => {
    let coloredKey = `${colors.fgBlue}${key}${colors.reset}`;
    let coloredValue;
    if (typeof value === 'boolean') {
      coloredValue = `${colors.fgYellow}${value}${colors.reset}`;
    } else if (typeof value === 'string') {
      coloredValue = `${colors.fgMagenta}"${value}"${colors.reset}`;
    } else if (typeof value === 'number' && Number.isInteger(value)) {
      coloredValue = `${colors.fgOrange}${value}${colors.reset}`;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      coloredValue = parseObject(value);
    } else {
      coloredValue = `${value}`;
    }
    return `${coloredKey}: ${coloredValue}`;
  }).join(', ') + ' }';
}

function requestLogger(tokens, req, res) {
  return [
    colors.fgYellow, tokens.method(req, res),
    colors.fgGreen, tokens.url(req, res),
    colors.fgOrange, tokens.status(req, res),
    colors.reset, "-",
    colors.fgWhite, tokens["response-time"](req, res), "ms",
    req.body ? parseObject(req.body) : ""
  ].join(" ");
}

module.exports = requestLogger;