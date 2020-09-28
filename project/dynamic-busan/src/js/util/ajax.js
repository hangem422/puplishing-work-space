/**
 * @description URL Path의 앞뒤 '/'를 제거합니다.
 * @param {string} path URL Path
 * @returns {string} 앞뒤 '/'를 제거한 URL Path
 */
export function clearSlashes(path) {
  return path.replace(/\/$/, '').replace(/^\//, '');
}

/**
 * @description 두개의 path를 합칩니다.
 * @param {string} path1
 * @param {string} path2
 * @returns {string} 합쳐진 path
 */
export function mergePath(path1, path2) {
  let newPath = '';
  if (path1 !== '/') newPath += `/${clearSlashes(path1)}`;
  if (path2 !== '/') newPath += `/${clearSlashes(path2)}`;
  if (newPath.length === 0) newPath = '/';
  return newPath;
}

/**
 * @description Target Pathd에서 Path를 제거합니다.
 * @param {string} target 제거 당할 path
 * @param {string} path 제거 할 path
 * @returns {string} 새로운 path
 */
export function removePath(_target, _path) {
  const target = `/${clearSlashes(_target)}/`;
  const path = `/${clearSlashes(_path)}/`;
  const newPath = target.replace(path, '');
  return `/${clearSlashes(newPath)}`;
}

/**
 * @description Object를 Query String으로 변환합니다.
 * @param {object} obj Query Parameter Data
 * @returns {string} Query String
 */
export function objToQueryURL(obj) {
  if (Object.keys(obj).length < 1) return '';
  const queryUrl = Object.entries(obj)
    .map((keyValue) => keyValue.join('='))
    .join('&');
  return `?${queryUrl}`;
}

/**
 * @description Query String를 Object으로 변환합니다.
 * @param {string} str Query String
 * @returns {object} Query Parameter Data
 */
export function queryURLToObj(str) {
  const obj = {};
  str
    .slice(1)
    .split('&')
    .forEach((query) => {
      const [key, value] = query.split('=');
      obj[key] = value;
    }, {});
  return obj;
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
    if (contentType.startsWith('application/json')) return res.json();
    if (contentType.startsWith('text/plain')) return res.text();
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

  return fetch(`${option.url}${objToQueryURL(data)}`, {
    method: 'GET',
    headers,
  }).then((res) => {
    // strict가 true이면 HTTP Status가 200이 아닐 시 모두 에러처리 합니다.
    if (option.strict && res.status !== 200) {
      throw new Error(`HTTP status is ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType.startsWith('application/json')) return res.json();
    if (contentType.startsWith('text/plain')) return res.text();
    throw new Error(`Unsupported response content-type: ${contentType}`);
  });
}
