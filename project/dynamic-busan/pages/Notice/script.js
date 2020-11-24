import Router from '../../src/js/module/RouterWithCB';
import PageSlider from '../../src/js/layout/PageSlider';
import { get } from '../../src/js/util/ajax';
import { dateToString } from '../../src/js/util/date';
import AppState from '../../src/js/component/AppState';

import './style.css';

import createEmptyPage from './comp/Empty';
import createListBoardPage from './comp/Board';
import createDetailPage from './comp/Detail';

/* ------------- */
/*  Config Data  */
/* ------------- */

const PATHNAME = '/html/notice.html';
const NOICE_DATA_URL = 'https://svc.mykeepin.com/api/v1/notice';

// 로딩과 모달 컴포넌트를 생성합니다.
const appState = new AppState();
// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router(
  undefined,
  process.env.NODE_ENV === 'development' ? '/' : PATHNAME,
);

/* ------------- */
/*  API Handler  */
/* ------------- */

/**
 * @description API 서버로부터 공지 정보를 받아옵니다.
 */
function getNoticeList() {
  return get({
    url: NOICE_DATA_URL,
    data: { size: '64', page: '1' },
    strict: true,
  })
    .then((res) => {
      const { list } = res.data.data;
      const dateOption = {
        prefix: false,
        space: true,
      };

      // 날짜 정보를 포멧에 맞게 파싱합니다.
      return list.map((notice) => ({
        ...notice,
        date: dateToString(new Date(notice.date), dateOption),
      }));
    })
    .catch(() => []);
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];
    root.appendChild(appState.element);
    appState.showLoading();

    getNoticeList().then((list) => {
      // 데이터가 없을 시 비어있는 페이지를 보여줍니다.
      if (list.length < 1) {
        root.appendChild(createEmptyPage());
      }

      // PageSlider를 생성합니다.
      const pageSlider = new PageSlider('notice-slider');
      const listBoardPage = createListBoardPage(list, (index) =>
        router.redirect('/detail', { id: list[index].id }),
      );
      pageSlider.addPage(listBoardPage.element);

      const detailPage = createDetailPage(list);
      pageSlider.addPage(detailPage.element);

      // 라우터에 함수를 추가합니다.
      router.setRouterFunc('/detail', ({ query }) => {
        const id = query.id || '0';
        detailPage.renderDetail(id);
        pageSlider.movePage(1);
      });

      router.setRouterFunc('default', () => {
        if (pageSlider.current !== 0) pageSlider.movePage(0);
      });

      router.refresh();

      // Page Slider에 리스트 페이지와 상세 페이지를 추가합니다.
      root.appendChild(pageSlider.element);
      appState.hide();
    });
  };
}
