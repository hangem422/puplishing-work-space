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
 * @param {{ strict: boolean, parse: 'text' | 'json' }} option SecretTextfield의 옵션 값
 * @returns {Promise<any>} Post Ajax 요청 비동기 객체
 */
export function post(url, data, option = {}) {
  const strict = option.strict || false;

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (strict && res.status !== 200) {
      throw new Error(`HTTP Status is ${res.status}`);
    }

    // 타입에따라 응답을 파싱합니다.
    if (option.parse === 'text') return res.text();
    return res.json();
  });
}

/**
 * @description Get Ajax 요청 비동기 객체를 반환합니다.
 * @param {string} url Request URL
 * @param {object} data Request Query Parameter Data
 * @param {{ strict: boolean, parse: 'text' | 'json' }} option SecretTextfield의 옵션 값
 * @returns {Promise<any>} Post Ajax 요청 비동기 객체
 */
export function get(url, data, option = {}) {
  const strict = option.strict || false;

  return fetch(`${url}?${objToQueryURL(data)}`, {
    method: 'GET',
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (strict && res.status !== 200) {
      throw new Error(`HTTP status is ${res.status}`);
    }

    // 타입에따라 응답을 파싱합니다.
    if (option.parse === 'text') return res.text();
    return res.json();
  });
}
