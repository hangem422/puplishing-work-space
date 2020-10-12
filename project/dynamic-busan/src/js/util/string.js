/**
 * @description 입력 값이 Max 길이를 초과혀면, 초과한 문자열을 삭제하여 반환합니다.
 * @param {string} str 입력 값
 * @param {number} length 제한할 길이
 * @returns {string} 제한된 길이의 문자열
 */
export function limitLength(str, length) {
  return str.length > length ? str.slice(0, length) : str;
}

/**
 * @description 입력 값에서 숫자가 아닌 문자를 제거합니다.
 * @param {string} str 입력 값
 * @returns 숫자로만 이루어진 문자열
 */
export function onlyNumber(str) {
  return str.replace(/\D/g, '');
}

/**
 * @description 입력 값에서 숫자가 아닌 문자를 제거 후 Max 길이를 초과혀면, 초과한 문자열을 삭제하여 반환합니다.
 * @param {string} str 입력 값
 * @param {number} length 제한할 길이
 * @returns {string} 제한된 길이의 문자열
 */
export function onlyNumLimitLength(str, length) {
  return limitLength(onlyNumber(str), length);
}
