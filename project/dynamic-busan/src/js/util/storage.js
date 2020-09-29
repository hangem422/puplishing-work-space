/**
 * @description 전달 받은 value를 key값으로 Local Storage에 저장
 * @param {string} key Local Storage Key
 * @param {any} val Local Storage Value
 */
export function saveLocal(key, val) {
  window.localStorage.setItem(key, JSON.stringify(val));
}

/**
 * @description 전달 받은 key 값의 Local Storage Value 가져옴
 * @param {string} key Local Storage Key
 * @returns {any} Local Storage Value
 */
export function loadLocal(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (err) {
    return undefined;
  }
}

/**
 * @description 뒤로가기로 접근시 저장된 Value를 사용하고, 그렇지 않은 접근시 초기화 시킵니다.
 * @typedef {object} options
 * @property {(val: any) => boolean} isValidFnc Local Storage Value가 옳바른지 판단하는 함수
 * @property {any} defVal Local Storage Value가 없거나 정상적이지 않을때 적용할 Default 값
 * @param {string} key Local Storage Key
 * @param {options} options option 값
 */
export function useOnlyBackForwardType(key, options) {
  let res;

  // navigation 객체가 필요합니다.
  if (window.performance && window.performance.navigation) {
    // BackForward로 접근시에만 local sotrage의 value를 사용합니다.
    if (
      window.performance.navigation.type ===
      window.PerformanceNavigation.TYPE_BACK_FORWARD
    ) {
      const val = loadLocal(key);
      // Local Storage Value를 검증하는 함수가 있으면 검증이 통과했을 시에만 반영합니다.
      if (options.isValidFnc && options.isValidFnc(val)) res = val;
      else if (options.isValidFnc === undefined) res = val;
    }
  }

  if (!res) {
    // default value가 정해졌으면 반영합니다.
    if (options.defVal !== undefined) res = options.defVal;
    if (res !== undefined) saveLocal(key, res);
  }

  return res;
}
