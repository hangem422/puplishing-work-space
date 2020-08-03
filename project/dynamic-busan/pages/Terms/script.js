import { createElement } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import { emptyAlarmImage } from '../../src/js/component/Image';
import { moreRight } from '../../src/js/component/Icon';
import PageSlider from '../../src/js/layout/PageSlider';
import ListBoard from '../../src/js/layout/ListBoard';
import TextPost from '../../src/js/layout/TextPost';

import './style.css';
import data from './data.json';

// router 함수를 담는 객체
const routerFunc = {
  default: () => {},
};

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router(({ path, query }) => {
  // router 함수 객체에 알맞은 함수가 있으면 실행합니다.
  const isComplete = Object.keys(routerFunc).some((key) => {
    if (!path.startsWith(key)) return false;
    routerFunc[key]({ path, query });
    return true;
  });
  // 알맞은 함수가 없을 시 Default 함수가 실행됩니다.
  if (!isComplete) routerFunc.default({ path, query });
});

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
 * @returns {HTMLElement} List Board Page
 */
function createListBoardPage() {
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

  /**
   * @description 리스트 클릭시 상세페이지로 이동하는 함수입니다.
   * @param {number} index 리스트에서 선택한 항목의 인덱스 값
   */
  const nextPageFunc = (index) => {
    // 링크가 있는 약관이면 링크로 리다이렉션 시킵니다.
    if (data[index].link) window.location.href = data[index].link;
    else router.redirect('/detail', { index });
  };

  // List Board Paga를 반환합니다.
  return new ListBoard('term-board', itemList, nextPageFunc);
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

    // Page Slide를 생성합니다.
    const listBoardPage = createListBoardPage();
    const textPostPage = new TextPost();
    const pageSlider = new PageSlider('term-slider', [
      listBoardPage.element,
      textPostPage.element,
    ]);

    // 라우터에 함수를 추가합니다.
    routerFunc.detail = ({ query }) => {
      const cur = data[query.index || 0];
      document.title = cur.title;
      textPostPage.title = cur.title;
      textPostPage.subtitle = `시행일 ${cur.enforceDate}`;
      textPostPage.contents = cur.content;
      textPostPage.footer = createFooterElement(
        converDate(`고지일: ${cur.noticeDate}`),
        converDate(`시행일: ${cur.enforceDate}`),
      );
      pageSlider.movePage(1);
    };

    routerFunc.default = () => {
      document.title = '이용약관';
      if (pageSlider.current !== 0) pageSlider.movePage(0);
    };

    // Page Slider에 리스트 페이지와 상세 페이지를 추가합니다.
    root.appendChild(pageSlider.element);
  };
}
