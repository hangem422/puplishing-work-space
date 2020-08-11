import { createElement, wrapping } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import { emptyAlarmImage } from '../../src/js/component/Image';
import { moreRight } from '../../src/js/component/Icon';
import PageSlider from '../../src/js/layout/PageSlider';
import ListBoard from '../../src/js/layout/ListBoard';
import TextPost, { contentParser } from '../../src/js/layout/TextPost';
import { showDetail } from '../../src/js/layout/ShowDetail';

import './style.css';
import data from './data.json';

const termData = data;

const DOCUMENT_TITLE = '이용약관';
const EMPTY_PAGE_TEXT = '아직 등록된 이용약관이 없습니다.';

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router();

/**
 * @description 이용 약관이 없을 시 빈 페이지를 생성합니다.
 * @returns {HTMLElement} 빈 화면 Element
 */
function createEmptyPage() {
  // Component Element를 생성합니다.
  const image = emptyAlarmImage();
  const text = createElement('div', {
    class: 'font-text-body1 font-color-light empty-page-text',
    child: EMPTY_PAGE_TEXT,
  });

  return wrapping('empty-page', [image, text]);
}

/**
 * @description Json 데이터를 기반으로 이용약관 리스트 페이지를 생성합니다.
 * @returns {HTMLElement} List Board Page
 */
function createListBoardPage() {
  // List의 내부를 구성 Element를 만듭니다.
  const itemList = termData.reduce((prev, cur) => {
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
    if (termData[index].link) window.location.href = termData[index].link;
    else router.redirect('/detail', { index });
  };

  // List Board Paga를 반환합니다.
  return new ListBoard('term-board', itemList, nextPageFunc);
}
/**
 * @description YYYY.MM.DD를 YYYY년 MM월 DD일로 변경합니다.
 * @param {string} date YYYY.MM.DD
 * @returns {string} YYYY년 MM월 DD일
 */
function convertDate(date) {
  const dateArr = date.split('.');
  dateArr[0] = `${dateArr[0]}년`;
  dateArr[1] = dateArr[1].length < 2 ? `0${dateArr[1]}월` : `${dateArr[1]}월`;
  dateArr[2] = dateArr[2].length < 2 ? `0${dateArr[2]}일` : `${dateArr[2]}일`;
  return dateArr.join(' ');
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
 * @description 약관 데이터의 세부 내용을 보여줍니다.
 */
function makeTextPostPage(datas) {
  // 약관 데이터를 파싱합니다.
  datas = data.map((term) => {
    if (!term.contents) return term;
    return {
      ...term,
      contents: contentParser({ contents: term.contents }),
    };
  });

  const textPostPages = [];
  for (let i = 0; i < datas.length; i += 1) {
    const textPostPage = new TextPost();
    textPostPage.title = datas[i].title;
    textPostPage.subtitle = `시행일 ${datas[i].enforceDate}`;
    textPostPage.contents =
      datas[i].contents === undefined
        ? document.createElement('div')
        : datas[i].contents;
    textPostPage.footer = createFooterElement(
      convertDate(`고지일: ${datas[i].noticeDate}`),
      convertDate(`시행일: ${datas[i].enforceDate}`),
    );
    textPostPages.push(textPostPage.element);
  }
  return textPostPages;
}
/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 데이터가 없을 시 비어있는 페이지를 보여줍니다.
    if (termData.length < 1) {
      root.appendChild(createEmptyPage());
      return;
    }

    // Page Slide를 생성합니다.
    const listBoardPage = createListBoardPage();
    const textPostPage = makeTextPostPage(termData);
    const pageSlider = new PageSlider('term-slider', [
      listBoardPage.element,
      textPostPage,
    ]);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('detail', ({ query }) => {
      const index = query.index || 0;
      document.title = termData[index].title;
      showDetail(textPostPage, index);
      pageSlider.movePage(1);
    });
    router.setRouterFunc('default', () => {
      document.title = DOCUMENT_TITLE;
      if (pageSlider.current !== 0) pageSlider.movePage(0);
    });

    // Page Slider에 리스트 페이지와 상세 페이지를 추가합니다.
    root.appendChild(pageSlider.element);
  };
}
