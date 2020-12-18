import { appendAllChild } from '../../src/js/util/dom';
import { get } from '../../src/js/util/ajax';
import Router from '../../src/js/module/RouterWithCB';
import StackSlider from '../../src/js/layout/StackSlider';
import AppState from '../../src/js/component/AppState';
import TextPost from '../../src/js/layout/TextPost';

import './style.css';
import data from './data.json';

import createMainPage from './comp/Main';

/* ------------- */
/*  Config Data  */
/* ------------- */

const PATHNAME_DEV = '/';
const PATHNAME_PROD = '/html/administration.html';

const PATHNAME =
  process.env.NODE_ENV === 'development' ? PATHNAME_DEV : PATHNAME_PROD;

const router = new Router(undefined, PATHNAME);
const appState = new AppState(); // 로딩과 모달 컴포넌트를 생성합니다.

/* ------------- */
/*  API Handler  */
/* ------------- */

/**
 * @description API 서버로부터 이력 정보를 받아옵니다.
 */
function getHistory(url) {
  return get({ url, strict: true }).then((res) => res.data);
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    const stackSlider = new StackSlider('service-term');

    const main = createMainPage(data, (file) => {
      router.redirect('/history', { file });
    });
    const history = new TextPost();

    stackSlider.addPage(main);
    stackSlider.addPage(history.element);

    // 라우터에 함수를 추가합니다.
    router.addRouterFunc('/history', ({ query }) => {
      appState.showLoading();
      getHistory(data.history[query.file])
        .then((res) => {
          history.title = res.title;
          history.subtitle = `시행일 ${res.date}`;
          history.contents = res.contents;
          appState.hide();
          stackSlider.moveNext();
        })
        .catch(() => {
          appState.showModal(
            '오류가 발생했습니다. 잠시 후에 다시 시도 해주세요',
          );
          window.history.go(-1);
        });
    });

    router.addRouterFunc('default', () => {
      while (stackSlider.current !== 0) stackSlider.movePrev();
    });

    router.refresh();

    // Page를 구성합니다.
    appendAllChild(root, [appState.element, stackSlider.element]);
  };
}
