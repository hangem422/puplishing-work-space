import {
  clearSlashes,
  mergePath,
  removePath,
  objToQueryURL,
  queryURLToObj,
} from '../../util/ajax';

/**
 * @description Location Protocol
 * @type {WeakMap<object, string>}
 */
const _protocol = new WeakMap();

/**
 * @description Location Host
 * @type {WeakMap<object, string>}
 */
const _host = new WeakMap();

/**
 * @description 고정 Pathname
 * @type {WeakMap<object, string>}
 */
const _originPathname = new WeakMap();

/**
 * @description Location Pathname
 * @type {WeakMap<object, string>}
 */
const _pathname = new WeakMap();

/**
 * @description Location Search
 * @type {WeakMap<object, string>}
 */
const _search = new WeakMap();

/**
 * @description 라우터 함수 객체
 * @type {WeakMap<object, { [propName: string]: (param: { path: string, query: object }) => void}}>}
 */
const _routerFunc = new WeakMap();

export function setProtocol(protocol, thisArg) {
  _protocol.set(thisArg, protocol);
}

export function getProtocol(thisArg) {
  return _protocol.get(thisArg);
}

export function setHost(host, thisArg) {
  _host.set(thisArg, host);
}

export function getHost(thisArg) {
  return _host.get(thisArg);
}

export function setOriginPathname(originPathname, thisArg) {
  _originPathname.set(thisArg, originPathname);
}

export function getOriginPathname(thisArg) {
  return _originPathname.get(thisArg);
}

export function setPathname(pathname, thisArg) {
  _pathname.set(thisArg, pathname);
}

export function getPathname(thisArg) {
  return _pathname.get(thisArg);
}

export function setSearch(search, thisArg) {
  _search.set(thisArg, search);
}

export function getSearch(thisArg) {
  return _search.get(thisArg);
}

export function setRouterFunc(routerFunc, thisArg) {
  _routerFunc.set(thisArg, routerFunc);
}

export function getRouterFunc(thisArg) {
  return _routerFunc.get(thisArg);
}

/**
 * @description 현재 URL을 반환합니다.
 * @param {this} thisArg
 * @returns {string} URL
 */
export function getCurrentUrl(thisArg) {
  const protocol = _protocol.get(thisArg);
  const host = _host.get(thisArg);
  const pathname = _pathname.get(thisArg);
  const search = _search.get(thisArg);

  return `${protocol}//${host}${pathname}${search}`;
}

/**
 * @description 라우터 함수를 등록합니다.
 * @param {string} key path와 일치 여부를 검사할 key 값
 * @param {({ path: string, query: object }) => void} func path가 key와 일치하면 실행 될 함수
 * @param {this} thisArg
 */
export function addRouterFunc(key, func, thisArg) {
  const routerFunc = _routerFunc.get(thisArg);
  routerFunc[key] = func;
}

/**
 * @description Path에 맞는 Router Function을 찾아 실행합니다.
 * @param {{ path: string, query: object }} param router 정보
 * @param {this} thisArg
 */
export function routerCallback({ path, query }, thisArg) {
  const routerFunc = _routerFunc.get(thisArg);

  // router 함수 객체에 알맞은 함수가 있으면 실행합니다.
  const isComplete = Object.keys(routerFunc).some((key) => {
    if (!path.startsWith(key)) return false;
    routerFunc[key]({ path, query });
    return true;
  });

  // 알맞은 함수가 없을 시 Default 함수가 실행됩니다.
  if (!isComplete) routerFunc.default({ path, query });
}

/**
 * @description 새로고침 없이 현재 URL을 변경합니다.
 * @param {string} _path Redirect할 URL Path
 * @param {object} query URL Query Parameter
 * @param {this} thisArg
 */
export function redirect(_path, query, thisArg) {
  const originPathname = _originPathname.get(thisArg);
  const prevUrl = getCurrentUrl(thisArg);

  // pathname 설정
  const path = `/${clearSlashes(_path)}`;
  _pathname.set(thisArg, mergePath(originPathname, path));

  // search를 재설정 합니다.
  _search.set(thisArg, objToQueryURL(query));

  // 같은 페이지로 이동시 아무런 동작을 하지 않습ㄴ다.
  const nextUrl = getCurrentUrl(thisArg);
  if (prevUrl === nextUrl) return;

  // 브라우저의 세션 기록 스택에 상태를 추가합니다.
  const state = { path, query };
  window.history.pushState(state, null, nextUrl);
  routerCallback(state, thisArg);
}

/**
 * @description 브라우저 새로고침 없이 현재 상태를 반영합니다.
 * @param {this} thisArg
 */
export function refresh(thisArg) {
  const search = _search.get(thisArg);
  const pathname = _pathname.get(thisArg);
  const originPathname = _originPathname.get(thisArg);

  const query = search ? queryURLToObj(search) : {};
  const path = removePath(pathname, originPathname);
  routerCallback({ path, query }, thisArg);
}

/**
 * @description Router에서 사용할 Proerty를 초기화합니다.
 * @param {(param: { path: string, query: object }) => void} defaultFunc 기본 라우터 함수
 * @param {string} originPathname 고정 Pathname 값. 마 입력시 현재 Pathname으로 고정
 * @param {this} thisArg
 */
function initVariable(defaultFunc, originPathname, thisArg) {
  _protocol.set(thisArg, window.location.protocol);
  _host.set(thisArg, window.location.host);
  _originPathname.set(thisArg, `/${clearSlashes(originPathname)}`);
  _pathname.set(thisArg, window.location.pathname);
  _search.set(thisArg, window.location.search);
  _routerFunc.set(thisArg, { default: defaultFunc });
}

/**
 * @description Router에서 사용하는 이벤트 리스너를 초기화합니다.
 * @param {this} thisArg
 */
function initEventListenr(thisArg) {
  // popstate 이벤트 리스너에 라우터 함수를 적용합니다.
  window.addEventListener('popstate', (event) => {
    const { query = {}, path = '/' } = event.state || {};
    _search.set(thisArg, objToQueryURL(query));
    _pathname.set(thisArg, window.location.pathname);

    routerCallback({ path, query }, thisArg);
  });
}

/**
 * @description RouterWithCB Module을 생성합니다.
 * @param {(param: { path: string, query: object }) => void} defaultFunc 기본 라우터 함수
 * @param {string} originPathname 고정 Pathname 값. 마 입력시 현재 Pathname으로 고정
 * @param {this} thisArg
 */
export function createRouterWithCB(defaultFunc, originPathname, thisArg) {
  initVariable(defaultFunc, originPathname, thisArg);
  initEventListenr(thisArg);
}
