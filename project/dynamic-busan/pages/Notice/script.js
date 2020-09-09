import Router from '../../src/js/module/RouterWithCB';
import PageSlider from '../../src/js/layout/PageSlider';

import data from './data.json';
import './style.css';

import createEmptyPage from './comp/Empty';
import createListBoardPage from './comp/Board';
import createDetailPage from './comp/Detail';

const DOCUMENT_TITLE = '이용약관';
const DOCUMENT_DETAIL_TITLE = '공지사항 상세내용';
const PATHNAME = '/html/notice.html';

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router(
  undefined,
  process.env.NODE_ENV === 'development' ? '/' : PATHNAME,
);

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

    // PageSlider를 생성합니다.
    const pageSlider = new PageSlider('notice-slider');
    const listBoardPage = createListBoardPage(data, (index) =>
      router.redirect('/detail', { index }),
    );
    pageSlider.addPage(listBoardPage.element);

    const detailPage = createDetailPage(data);
    pageSlider.addPage(detailPage.element);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('/detail', ({ query }) => {
      const index = query.index || 0;
      document.title = DOCUMENT_DETAIL_TITLE;
      detailPage.renderDetail(index);
      pageSlider.movePage(1);
    });

    router.setRouterFunc('default', () => {
      document.title = DOCUMENT_TITLE;
      if (pageSlider.current !== 0) pageSlider.movePage(0);
    });

    router.refresh();

    // Page Slider에 리스트 페이지와 상세 페이지를 추가합니다.
    root.appendChild(pageSlider.element);
  };
}
