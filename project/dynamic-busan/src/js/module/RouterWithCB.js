import { objToQueryURL } from '../util/ajax';

/**
 * @description URL Path의 앞뒤 '/'를 제거합니다.
 * @param {string} path URL Path
 * @returns {string} 앞뒤 '/'를 제거한 URL Path
 */
function clearSlashes(path) {
  return path.replace(/\/$/, '').replace(/^\//, '');
}

/**
 * @description Callback 함수를 기반으로 작동하는 Router
 * @property {string} orginPath Origin Path
 * @property {string} root Root Path
 * @property {{ [propName: string]: ({ path: string, query: object }) => void }} routerFunc Root Path
 */
class RouterWithCB {
  /**
   * @description RouterWithCB의 생성자
   * @param {({ path: string, query: object }) => void} defaultFunc 기본 라우터 함수
   * @param {string} root Root Path
   */
  constructor(defaultFunc = () => {}) {
    this.orginPath = window.location.pathname;
    this.root = this.orginPath.split('/').pop();
    this.routerFunc = { default: defaultFunc };

    // popstate 이벤트 리스너에 라우터 함수를 적용합니다.
    window.addEventListener('popstate', (event) =>
      this.routerCallback({
        path: clearSlashes(
          window.location.pathname.replace(this.orginPath, ''),
        ),
        query: event.state || {},
      }),
    );
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
  redirect(path, query) {
    // 현재 Path와 URL을 재설정합니다.
    const clearPath = clearSlashes(path);
    let url = `${this.root}/${clearPath}`;

    // Query Parameter가 존재하면 Query와 URL을 재설정 합니다.
    if (typeof query === 'object') url += `?${objToQueryURL(query)}`;

    // 브라우저의 세션 기록 스택에 상태를 추가합니다.
    window.history.pushState(query, null, url);
    this.routerCallback({ path: clearPath, query });
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
}

export default RouterWithCB;
