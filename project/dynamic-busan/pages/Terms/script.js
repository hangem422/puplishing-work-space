import { createElement } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import { emptyAlarmImage } from '../../src/js/component/Image';
import { moreRight } from '../../src/js/component/Icon';
import PageSlider from '../../src/js/layout/PageSlider';
import ListBoard from '../../src/js/layout/ListBoard';
import TextPost from '../../src/js/layout/TextPost';

import './style.css';
import data from './data.json';

/**
 * @description YYYY.MM.DD를 YYYY년 MM월 DD일로 변경합니다.
 * @param {string} date YYYY.MM.DD
 * @returns {string} YYYY년 MM월 DD일
 */
function converDate(date) {
  const dateArr = date.split('.');
  dateArr[0] = `${dateArr[0]}년`;
  dateArr[1] = dateArr[1].length < 2 ? `0${dateArr[1]}월` : `${dateArr[1]}월`;
  dateArr[2] = dateArr[2].length < 2 ? `0${dateArr[2]}일` : `${dateArr[2]}일`;
  return dateArr.join(' ');
}

/**
 * @description 이용 약관이 없을 시 빈 페이지를 생성합니다.
 * @returns {HTMLElement} 빈 화면 Element
 */
function createEmptyPage() {
  // Component Element를 생성합니다.
  const image = emptyAlarmImage();
  const text = createElement('div', {
    class: 'font-text-body1 font-color-light empty-page-text',
    child: '아직 등록된 이용약관이 없습니다.',
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
 * @description Json 데이터를 기반으로 이용약관 리스트 페이지를 생성합니다.
 * @param {{title: string, date: string, content: string[], from: string}[]} data 이용약관 데이터 리스트
 * @param {(index: number) => voide} nextPageFunc 다음 페이지로 이동하는 함수
 * @returns {HTMLElement} List Board Page
 */
function createListBoardPage(nextPageFunc) {
  // List의 내부를 구성 Element를 만듭니다.
  const itemList = data.reduce((prev, cur) => {
    const { title, enforceDate } = cur;
    const titleElement = createElement('p', {
      class: 'font-text-body1 font-medium font-color-dark',
      child: title,
    });
    const dateElement = createElement('p', {
      class: 'font-number-body3 font-color-regular',
      child: `시행일 ${enforceDate}`,
    });
    const textWrapper = createElement('div', {
      class: 'header-custom-text',
      child: [titleElement, dateElement],
    });
    const container = createElement('div', {
      class: 'header-custom-content row',
      child: [textWrapper, moreRight(16, '#E5E5E5')],
    });
    return prev.concat(container);
  }, []);

  // List Board Paga를 반환합니다.
  return new ListBoard('term-board', itemList, nextPageFunc).element;
}

/**
 * @description 약관 Date Element 생성합니다.
 * @param {string} notice 약관 고지일
 * @param {string} enforce 약관 시행일
 * @return {HTMLLIElement} Date Element
 */
function createFooterElement(notice, enforce) {
  // Component Element를 생성합니다.
  const noticeElement = createElement('li', { child: notice });
  const enforceElement = createElement('li', { child: enforce });
  return createElement('ul', {
    class: 'font-text-body2 font-color-dark',
    child: [noticeElement, enforceElement],
  });
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
      return;
    }

    // PageSlider를 생성합니다.
    const pageSlider = new PageSlider('term-slider');
    const textPost = new TextPost();

    /**
     * @description Router에서 Path 변경시 호출해주는 Callback Function
     * @param {{ path: string, query: object }} param Path 변경 시 전달받는 파라미터
     */
    const routerCallback = ({ path, query }) => {
      // Path가 Detail로 시작하면 상세 페이지를 보여줍니다.
      if (path.startsWith('detail')) {
        const cur = data[query.index || 0];
        // data에 link가 있으면 해당 링크로 이동합니다.
        if (cur.link) {
          window.location.replace(cur.link);
        }
        // data에 link가 없으면 detail 페이지를 구성하여 보여줍니다.
        else {
          document.title = cur.title;
          textPost.title = cur.title;
          textPost.subtitle = `시행일 ${cur.enforceDate}`;
          textPost.contents = cur.content;
          textPost.footer = createFooterElement(
            converDate(`고지일: ${cur.noticeDate}`),
            converDate(`시행일: ${cur.enforceDate}`),
          );
          pageSlider.movePage(1);
        }
      }
      // Path가 Detail이 아니면 리스트 페이지를 보여줍니다.
      else {
        document.title = '이용약관';
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
    pageSlider.addPage(textPost.element);
    root.appendChild(pageSlider.element);
  };
}
