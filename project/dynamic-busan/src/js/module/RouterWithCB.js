import {
  clearSlashes,
  mergePath,
  removePath,
  objToQueryURL,
  queryURLToObj,
} from '../util/ajax';

/**
 * @description Callback 함수를 기반으로 작동하는 Router
 * @property {string} protocol
 * @property {string} host
 * @property {string} originPathname 고정 Pathname 값
 * @property {string} pathname
 * @property {string} search
 * @property {string} url (Get Only) 현재 URL 주소
 * @property {{ [propName: string]: ({ path: string, query: object }) => void }} routerFunc 라우터 함수
 */
class RouterWithCB {
  /**
   * @description RouterWithCB의 생성자
   * @param {({ path: string, query: object }) => void} defaultFunc 기본 라우터 함수
   * @param {string} originPathname 고정 Pathname 값. 마 입력시 현재 Pathname으로 고정
   * @param {string} root Root Path
   */
  constructor(defaultFunc = () => {}, originPathname) {
    this.protocol = window.location.protocol;
    this.host = window.location.host;
    this.originPathname = originPathname
      ? `/${clearSlashes(originPathname)}`
      : window.location.pathname;
    this.pathname = window.location.pathname;
    this.search = window.location.search;
    this.routerFunc = { default: defaultFunc };

    // popstate 이벤트 리스너에 라우터 함수를 적용합니다.
    window.addEventListener('popstate', (event) => {
      const { query = {}, path = '/' } = event.state || {};
      this.search = objToQueryURL(query);
      this.pathname = window.location.pathname;

      this.routerCallback({ path, query });
    });
  }

  /**
   * @description 현재 URL을 반환합니다.
   * @returns {string} URL
   */
  get url() {
    return `${this.protocol}//${this.host}${this.pathname}${this.search}`;
  }

  /**
   * @description 라우터 함수를 등록합니다.
   * @param {string} key path와 일치 여부를 검사할 key 값
   * @param {({ path: string, query: object }) => void} func path가 key와 일치하면 실행 될 함수
   */
  setRouterFunc(key, func) {
    this.routerFunc[key] = func;
  }

  /**
   * @description 새로고침 없이 현재 URL을 변경합니다.
   * @param {string} path Redirect할 URL Path
   * @param {object} query URL Query Parameter
   */
  redirect(_path, query) {
    const prevUrl = this.url;

    // pathname 설정
    const path = `/${clearSlashes(_path)}`;
    this.pathname = mergePath(this.originPathname, path);

    // Query Parameter가 존재하면 search를 재설정 합니다.
    if (typeof query === 'object') this.search = objToQueryURL(query);

    // 같은 페이지로 이동시 아무런 동작을 하지 않습ㄴ다.
    const nextUrl = this.url;
    if (prevUrl === nextUrl) return;

    // 브라우저의 세션 기록 스택에 상태를 추가합니다.
    const state = { path, query };
    window.history.pushState(state, null, nextUrl);
    this.routerCallback(state);
  }

  /**
   * @description Path에 맞는 Router Function을 찾아 실행합니다.
   * @param {{ path: string, query: object }} param router 정보
   */
  routerCallback({ path, query }) {
    // router 함수 객체에 알맞은 함수가 있으면 실행합니다.
    const isComplete = Object.keys(this.routerFunc).some((key) => {
      if (!path.startsWith(key)) return false;
      this.routerFunc[key]({ path, query });
      return true;
    });
    // 알맞은 함수가 없을 시 Default 함수가 실행됩니다.
    if (!isComplete) this.routerFunc.default({ path, query });
  }

  refresh() {
    const query = this.search ? queryURLToObj(this.search) : {};
    const path = removePath(this.pathname, this.originPathname);
    this.routerCallback({ path, query });
  }
}

export default RouterWithCB;
