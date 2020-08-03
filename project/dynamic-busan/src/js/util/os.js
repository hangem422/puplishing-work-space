const platform = require('platform');

export function isAndroid() {
  return platform.os.family === 'Android';
}

export function isIOS() {
  return platform.os.family === 'iOS';
}
