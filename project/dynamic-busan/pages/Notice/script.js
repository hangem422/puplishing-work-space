/* eslint-disable no-unused-vars */
import { emptyAlarmImage } from '../../src/js/image';
import { createElement } from '../../src/js/util/dom';
import Router from '../../src/js/util/RouterWithCB';
import { moreRight } from '../../src/js/Icon';
import ListBoard from '../../src/js/ListBoard';
import PageSlider from '../../src/js/PageSlider';

import data from './data.json';
import './style.css';

const detailPageConfig = {
  title: undefined,
  date: undefined,
  contentWrapper: undefined,
  from: undefined,
};

/**
 * @description 공지사항이 없을 시 빈 페이지를 생성합니다.
 * @returns {HTMLElement} 빈 화면 Element
 */
function createEmptyPage() {
  // Component Element를 생성합니다.
  const image = emptyAlarmImage();
  const text = createElement('div', {
    class: 'font-text-body1 font-color-light empty-page-text',
    child: '아직 등록된 공지사항이 없습니다.',
  });

  // Layout을 구성합니다.
  const wrapper = createElement('div', {
    class: 'wrapper',
    child: [image, text],
  });
  return createElement('div', {
    class: 'container empty-page',
    child: wrapper,
  });
}

/**
 * @description Json 데이터를 기반으로 공지사항 리스트 페이지를 생성합니다.
 * @param {{title: string, date: string, content: string[], from: string}[]} data 공지사항 데이터 리스트
 * @param {(index: number) => voide} nextPageFunc 다음 페이지로 이동하는 함수
 * @returns {HTMLElement} List Board Page
 */
function createListBoardPage(nextPageFunc) {
  // List의 내부를 구성 Element를 만듭니다.
  const itemList = data.reduce((prev, cur) => {
    const { title, date } = cur;
    const titleElement = createElement('p', {
      class: 'font-text-body1 font-medium font-color-dark',
      child: title,
    });
    const dateElement = createElement('p', {
      class: 'font-number-body3 font-color-regular',
      child: date,
    });
    const textWrapper = createElement('div', {
      class: 'header-custom-text',
      child: [titleElement, dateElement],
    });
    const container = createElement('div', {
      class: 'header-custom-content row-center',
      child: [textWrapper, moreRight(16, '#E5E5E5')],
    });
    return prev.concat(container);
  }, []);

  // List Board Paga를 반환합니다.
  return createElement('div', {
    class: 'notice-board-page',
    child: new ListBoard('notice-board', itemList, nextPageFunc).element,
  });
}

/**
 * @description 공지사항 세부 페이지를 생성합니다.
 * @returns {HTMLElement} 공지사항 세부 페이지
 */
function createDetailPage() {
  // Header Component를 생성합니다.
  const titleElement = createElement('p', {
    class: 'font-text-body1 font-medium font-color-dark',
  });
  const dateElement = createElement('p', {
    class: 'font-number-body3 font-color-regular',
  });
  const haederWrapper = createElement('div', {
    class: 'wrapper',
    child: [titleElement, dateElement],
  });
  const headerContainer = createElement('div', {
    class: 'container notice-detail-heder',
    child: haederWrapper,
  });

  // Content Compnent를 생성합니다.
  const contentWrapper = createElement('div', {
    class: 'wrpper font-text-body2 font-color-medium',
  });
  const contentContainer = createElement('div', {
    class: 'container notice-detail-content',
    child: contentWrapper,
  });

  // Footer Component를 생성합니다.
  const fromElement = createElement('p', {
    class: 'font-text-body2 font-color-dark',
  });
  const footerWrapper = createElement('div', {
    class: 'wrapper',
    child: fromElement,
  });
  const footerContainer = createElement('div', {
    class: 'container notice-detail-footer',
    child: footerWrapper,
  });

  // Detail 페이지 내용 수정을 위해 config 전역 변수에 할당합니다.
  detailPageConfig.title = titleElement;
  detailPageConfig.date = dateElement;
  detailPageConfig.contentWrapper = contentWrapper;
  detailPageConfig.from = fromElement;

  return createElement('div', {
    class: 'notice-detail-page',
    child: [headerContainer, contentContainer, footerContainer],
  });
}

/**
 * @description Detail Page의 텍스트를 변경합니다.
 * @param {number} index Detail Page에서 보여줄 Data의 인덱스 번호
 */
function changeDetailPage(index) {
  // Header Text 변경
  detailPageConfig.title.innerHTML = data[index].title;
  detailPageConfig.date.innerHTML = data[index].date;

  // Content Text 변경
  detailPageConfig.contentWrapper.innerHTML = '';
  data[index].content.forEach((str) => {
    detailPageConfig.contentWrapper.appendChild(
      createElement('p', { child: str }),
    );
  });

  // Footer Text 변경
  detailPageConfig.from.innerHTML = data[index].from;
}

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
    }
    // 데이터가 한개라도 존재하면 슬라이더 페이지를 보여줍니다.
    else {
      // PageSlider를 생성합니다.
      const pageSlider = new PageSlider('notice-slider');

      /**
       * @description Router에서 Path 변경시 호출해주는 Callback Function
       * @param {{ path: string, query: object }} param Path 변경 시 전달받는 파라미터
       */
      const routerCallback = ({ path, query }) => {
        // Path가 Detail로 시작하면 상세 페이지를 보여줍니다.
        if (path.startsWith('detail')) {
          changeDetailPage(query.index || 0);
          document.title = '공지사항 상세내용';
          pageSlider.movePage(1);
        }
        // Path가 Detail이 아니면 리스트 페이지를 보여줍니다.
        else {
          document.title = '공지사항';
          pageSlider.movePage(0);
        }
      };
      // Callback으로 동작하는 라우터를 생성합니다.
      const router = new Router(routerCallback);

      /**
       * @description 리스트 클릭시 상세페이지로 이동하는 함수입니다.
       * @param {number} index 리스트에서 선택한 항목의 인덱스 값
       */
      const nextPageFunc = (index) => router.redirect('/detail', { index });

      // Page Slider에 리스트 페이지와 상세 페이지를 추가합니다.
      pageSlider.addPage(createListBoardPage(nextPageFunc));
      pageSlider.addPage(createDetailPage());
      root.appendChild(pageSlider.element);
    }
  };
}
