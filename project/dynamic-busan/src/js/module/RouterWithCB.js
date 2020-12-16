import * as model from './model/RouterWithCB.model';

/*  Callback 함수를 기반으로 작동하는 Router */

class RouterWithCB {
  /**
   * @description RouterWithCB의 생성자
   * @param {(param: { path: string, query: object }) => void} defaultFunc 기본 라우터 함수
   * @param {string} originPathname 고정 Pathname 값. 마 입력시 현재 Pathname으로 고정
   * @param {string} root Root Path
   */
  constructor(defaultFunc, originPathname) {
    model.createRouterWithCB(
      typeof defaultFunc === 'function' ? defaultFunc : () => {},
      typeof originPathname === 'string'
        ? originPathname
        : window.location.pathname,
      this,
    );
  }

  get url() {
    return model.getCurrentUrl(this);
  }

  /**
   * @description 라우터 함수를 등록합니다.
   * @param {string} key path와 일치 여부를 검사할 key 값
   * @param {({ path: string, query: object }) => void} func path가 key와 일치하면 실행 될 함수
   */
  addRouterFunc(key, func) {
    if (typeof key === 'string' && typeof func === 'function') {
      model.addRouterFunc(key, func, this);
    }
  }

  /**
   * @description 새로고침 없이 현재 URL을 변경합니다.
   * @param {string} path Redirect할 URL Path
   * @param {object} query URL Query Parameter
   */
  redirect(path, query = {}) {
    if (typeof path === 'string' && typeof query === 'object') {
      model.redirect(path, query || {}, this);
    }
  }

  /**
   * @description 브라우저 새로고침 없이 현재 상태를 반영합니다.
   */
  refresh() {
    model.refresh(this);
  }
}

export default RouterWithCB;
