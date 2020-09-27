import { createElement } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import StackSlider from '../../src/js/layout/StackSlider';

import './style.css';
import data from './data.json';

import createMainPage from './comp/Main';

/* ------------- */
/*  Config Data  */
/* ------------- */

const PATHNAME_DEV = '/';
const PATHNAME_PROD = '/html/serviceterm.html';

const RECORD_PATH_DEV = '/record';
const RECORD_PATH_PROD = '/record/serviceterm';

const PATHNAME =
  process.env.NODE_ENV === 'development' ? PATHNAME_DEV : PATHNAME_PROD;
const RECORD_PATH =
  process.env.NODE_ENV === 'development' ? RECORD_PATH_DEV : RECORD_PATH_PROD;

const router = new Router(undefined, PATHNAME);

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    const stackSlider = new StackSlider('service-term');

    const main = createMainPage(data, (file) => {
      router.redirect('/history', { file });
    });
    const iframe = createElement('iframe');

    stackSlider.addPage(main);
    stackSlider.addPage(iframe);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('/history', ({ query }) => {
      iframe.src = `${RECORD_PATH}/${query.file}.html`;
      stackSlider.moveNext();
    });

    router.setRouterFunc('default', () => {
      while (stackSlider.current !== 0) stackSlider.movePrev();
    });

    router.refresh();

    // Page를 구성합니다.
    document.getElementsByClassName('root')[0].appendChild(stackSlider.element);
  };
}
