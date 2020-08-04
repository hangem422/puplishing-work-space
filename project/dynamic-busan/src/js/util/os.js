const platform = require('platform');

/**
 * @description OS가 Android인지 검사
 */
export function isAndroid() {
  return platform.os.family === 'Android';
}

/**
 * @description OS가 iOS인지 검사
 */
export function isIOS() {
  return platform.os.family === 'iOS';
}

// Android Webview로서 JS Call Interface를 사용할 수 있는지 여부
const IS_ANDROID = Boolean(isAndroid() && window.KeepinBridge);
// iOS Webview로서 JS Call Interface를 사용할 수 있는지 여부
const IS_IOS = Boolean(
  isIOS() && window.webkit && window.webkit.messageHandlers,
);

/**
 * @description AA 방급을 위한 VP를 keepin에 요청
 * @param {string} funcName 콜백 함수 이름
 * @param {() => void} invalidFunc JS Call Interface 사용 환경이 아닐 때 예외 처리 함수
 */
export function requestVP(funcName, invalidFunc = () => {}) {
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

/**
 * @description AA에서 발급한 VC를 keepin에 전달
 * @param {Array} vcListJson AA에서 발급한 VC List
 * @param {() => void} invalidFunc JS Call Interface 사용 환경이 아닐 때 예외 처리 함수
 */
export function issuedVC(vcListJson, invalidFunc = () => {}) {
  // Android Javascript Call
  if (IS_ANDROID && window.KeepinBridge.issuedVC) {
    window.KeepinBridge.issuedVC(vcListJson);
  }
  // iOS Javascript Call
  else if (IS_IOS && window.webkit.messageHandlers.MyKeepinBridgeIssuedVC) {
    window.webkit.messageHandlers.MyKeepinBridgeIssuedVC.postMessage(
      vcListJson,
    );
  }
  // 유효하지 않은 환경일때 예외 처리
  else invalidFunc();
}

/**
 * @description AA에서 발급 실패함수
 * @param {() => void} invalidFunc JS Call Interface 사용 환경이 아닐 때 예외 처리 함수
 */
export function fail(invalidFunc = () => {}) {
  // Android Javascript Call
  if (IS_ANDROID && window.KeepinBridge.fail) {
    window.KeepinBridge.fail();
  }
  // iOS Javascript Call
  else if (IS_IOS && window.webkit.messageHandlers.MyKeepinBridgeFail) {
    window.webkit.messageHandlers.MyKeepinBridgeFail.postMessage();
  }
  // 유효하지 않은 환경일때 예외 처리
  else invalidFunc();
}
