/**
 * @description Date 객체를 문자열로 변경합니다.
 * @param {Date} date Date 객체
 * @param {{ 
    year?: boolean,
    month?: boolean,
    date?: boolean,
    time?: boolean,
    prefix?: boolean,
    space? :boolean
  }} option option 객체
 * @returns {string} 날짜 문자열
 */
export function dateToString(date, option = {}) {
  /**
   * @description 옵션 값에 따라 10 미만의 숫자 앞에 0을 붙여줍니다.
   * @param {number} num 대상 숫자
   * @param {boolean} force 옵션 값을 무시하고 0을 붙일지 여부
   * @returns {string} 옵션 값에 따라 prefix를 붙인 문자열
   */
  function addPrefix(num, force = false) {
    const noPrefix = force === false && option.prefix === false;
    if (noPrefix || num >= 10) return `${num}`;
    return `0${num}`;
  }

  /**
   * @description 날짜 데이터를 추가합니다.
   * @param {string} target 추가할 문자열
   * @param {number} num 추가할 날짜 데이터
   * @returns 날짜 데이터가 추가된 문자열
   */
  function addDateStr(target, num) {
    const prefixed = addPrefix(num);
    if (option.space === true && target) return `${target}. ${prefixed}`;
    return `${target}.${prefixed}`;
  }

  /**
   * @description 시간 데이터를 추가합니다.
   * @param {string} target 추가할 문자열
   * @param {number} hour 시간 데이터
   * @param {number} min 분 데이터
   * @returns {string} 시간 데이터가 추가된 문자열
   */
  function addTimeStr(target, hour, min) {
    return `${target}. ${addPrefix(hour, true)}:${addPrefix(min, 0)}`;
  }

  let res = '';
  if (option.year !== false) res = date.getUTCFullYear();
  if (option.month !== false) res = addDateStr(res, date.getUTCMonth() + 1);
  if (option.date !== false) res = addDateStr(res, date.getUTCDate());
  if (option.time !== false) {
    res = addTimeStr(res, date.getUTCHours(), date.getUTCMinutes());
  }

  return res;
}
