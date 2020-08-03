const platform = require('platform');

export function isAndroid() {
  return platform.os.family === 'Android';
}

export function isIOS() {
  return platform.os.family === 'iOS';
}

const IS_ANDROID = Boolean(isAndroid() && window.KeepinBridge);
const IS_IOS = Boolean(
  isIOS() && window.webkit && window.webkit.messageHandlers,
);

export function requestVP(funcName, invalidFunc) {
  // Android Javascript Call
  if (IS_ANDROID && window.KeepinBridge.requestVP) {
    window.KeepinBridge.requestVP(funcName);
  }
  // iOS Javascript Call
  else if (IS_IOS && window.webkit.messageHandlers.KeepinBridgeRequestVP) {
    window.webkit.messageHandlers.KeepinBridgeRequestVP.postMessage(funcName);
  }
  // 유효하지 않은 환경일때 예외 처리
  else invalidFunc();
}
