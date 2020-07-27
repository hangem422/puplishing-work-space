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
 * @property {string} host Location Host
 * @property {string} root Root Path
 * @property {({ path: string, query: object}) => void} callback Redirect시 호출할 Callback 함수
 */
class RouterWithCB {
  /**
   * @description RouterWithCB의 생성자
   * @param {string} root Root Path
   * @param {({ path: string, query: object}) => void} callback 현재 활성화된 Item
   */
  constructor(callback = () => {}) {
    this.orginPath = window.location.pathname;
    this.root = this.orginPath.split('/').pop();
    this.callback = callback;

    window.addEventListener('popstate', (event) => {
      this.callback({
        path: clearSlashes(
          window.location.pathname.replace(this.orginPath, ''),
        ),
        query: event.state || {},
      });
    });
  }

  /**
   * @description 새로고침 없이 현재 URL을 변경합니다.
   * @param {string} path Redirect할 URL Path
   * @param {{ key: string, value: string }} query URL Query Parameter
   */
  redirect(path, query) {
    // 현재 Path와 URL을 재설정합니다.
    const clearPath = clearSlashes(path);
    let url = `${this.root}/${clearPath}`;

    // Query Parameter가 존재하면 Query와 URL을 재설정 합니다.
    if (typeof query === 'object') {
      const queryUrl = Object.entries(query)
        .map((keyValue) => keyValue.join('='))
        .join('&');
      url += `?${queryUrl}`;
    }

    // 브라우저의 세션 기록 스택에 상태를 추가합니다.
    window.history.pushState(query, null, url);
    this.callback({ path: clearPath, query });
  }
}

export default RouterWithCB;
