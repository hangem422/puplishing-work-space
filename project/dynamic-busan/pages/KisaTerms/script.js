import Router from '../../src/js/module/RouterWithCB';
import PageSlider from '../../src/js/layout/PageSlider';

import './style.css';
import data from './data.json';

import createEmptyPage from './comp/Empty';
import createListBoardPage from './comp/Board';
import createDetailPage from './comp/Detail';

const DOCUMENT_TITLE = '이용약관';
const IFRAME_PREFIX =
  process.env.NODE_ENV === 'development' ? '' : '/public/html';

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router();

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 데이터가 없을 시 비어있는 페이지를 보여줍니다.
    if (data.length < 1) {
      root.appendChild(createEmptyPage());
      return;
    }

    // Page Slide를 생성합니다.
    const pageSlider = new PageSlider('term-slider');
    const listBoardPage = createListBoardPage(data, (index) =>
      router.redirect('/detail', { index }),
    );

    pageSlider.addPage(listBoardPage.element);
    root.appendChild(pageSlider.element);

    // 약관 상세 페이지는 랜더에 다소 시간이 걸릴 수 있으니, 마지막에 진행합니다.
    const detailPage = createDetailPage(data, IFRAME_PREFIX);
    pageSlider.addPage(detailPage.element);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('/detail', ({ query }) => {
      const index = query.index || 0;
      // 링크가 있는 약관이면 링크로 리다이렉션 시킵니다.
      if (data[index].link) window.location.replace(data[index].link);

      const titleElement = detailPage.details[
        index
      ].contentWindow.document.getElementsByTagName('title')[0];
      const title = titleElement.innerHTML;
      document.title = title || data[index].title.slice(0, 15);

      detailPage.renderDetail(index);
      pageSlider.movePage(1);
    });

    router.setRouterFunc('default', () => {
      document.title = DOCUMENT_TITLE;
      if (pageSlider.current !== 0) pageSlider.movePage(0);
    });
  };
}
