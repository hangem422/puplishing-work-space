/**
 * @description Object를 Query String으로 변환합니다.
 * @param {object} obj Query URL Query Parameter Data
 * @returns {string} Query String
 */
export function objToQueryURL(obj) {
  const queryUrl = Object.entries(obj)
    .map((keyValue) => keyValue.join('='))
    .join('&');
  return `${queryUrl}`;
}

/**
 * @description Post Ajax 요청 비동기 객체를 반환합니다.
 * @param {string} url Request URL
 * @param {object} data Request Body
 * @param {boolean} strict HTTP Status가 200이 아니면 전부 에러 처리
 * @returns {Promise<any>} Post Ajax 요청 비동기 객체
 */
export function post(url, data, strict = false) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (strict && res.status !== 200) {
      throw new Error(`HTTP Status is ${res.status}`);
    }
    return res.json();
  });
}

/**
 * @description Get Ajax 요청 비동기 객체를 반환합니다.
 * @param {string} url Request URL
 * @param {object} data Request Query Parameter Data
 * @param {boolean} strict HTTP Status가 200이 아니면 전부 에러 처리
 * @returns {Promise<any>} Post Ajax 요청 비동기 객체
 */
export function get(url, data, strict = false) {
  return fetch(`${url}?${objToQueryURL(data)}`, {
    method: 'GET',
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (strict && res.status !== 200) {
      throw new Error(`HTTP Status is ${res.status}`);
    }
    return res.json();
  });
}
