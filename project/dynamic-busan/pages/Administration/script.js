import { createElement } from '../../src/js/util/dom';
import TextPost, { contentParser } from '../../src/js/layout/TextPost';

import './style.css';
import data from './data.json';

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
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 생성합니다.
    const subTitle = `시행일 ${data.enforceDate}`;
    const footerElement = createFooterElement(
      convertDate(`고지일: ${data.noticeDate}`),
      convertDate(`시행일: ${data.enforceDate}`),
    );

    // Page를 구성합니다.
    document
      .getElementsByClassName('root')[0]
      .appendChild(
        new TextPost(
          data.title,
          subTitle,
          contentParser({ contents: data.contents }),
          footerElement,
        ).element,
      );
  };
}
