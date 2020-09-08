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
 * @typedef {object} option
 * @property {string} url Request URL
 * @property {object} data Request Body
 * @property {object} headers Request Header
 * @property {boolean} strict HTTP Status가 200이 아니면 에러 발생
 * @param {option} option Post Ajax의 옵션 값
 * @returns {Promise<any>} Post Ajax 요청 비동기 객체
 */
export function post(option) {
  const headers = typeof option.headers === 'object' ? option.headers : {};
  const data = typeof option.data === 'object' ? option.data : {};

  return fetch(option.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (option.strict && res.status !== 200) {
      throw new Error(`HTTP status is ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType.startsWith('application/json;')) return res.json();
    if (contentType.startsWith('text/plain;')) return res.text();
    throw new Error(`Unsupported response content-type: ${contentType}`);
  });
}

/**
 * @description Get Ajax 요청 비동기 객체를 반환합니다.
 * @typedef {object} option
 * @property {string} url Request URL
 * @property {object} data Request Body
 * @property {object} headers Request Header
 * @property {boolean} strict HTTP Status가 200이 아니면 에러 발생
 * @param {option} option Get Ajax의 옵션 값
 * @returns {Promise<any>} Get Ajax 요청 비동기 객체
 */
export function get(option) {
  const headers = typeof option.headers === 'object' ? option.headers : {};
  const data = typeof option.data === 'object' ? option.data : {};

  return fetch(`${option.url}?${objToQueryURL(data)}`, {
    method: 'GET',
    headers,
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (option.strict && res.status !== 200) {
      throw new Error(`HTTP status is ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType.startsWith('application/json;')) return res.json();
    if (contentType.startsWith('text/plain;')) return res.text();
    throw new Error(`Unsupported response content-type: ${contentType}`);
  });
}
