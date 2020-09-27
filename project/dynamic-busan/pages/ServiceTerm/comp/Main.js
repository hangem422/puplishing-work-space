import { createElement } from '../../../src/js/util/dom';
import TextPost, { contentParser } from '../../../src/js/layout/TextPost';

/**
 *
 * @param {{ 
    title: string,
    contents: Array,
    history: Object,
    enforceDate: string,
    enforceDate: string,
  }} data
 * @param {(file: string) => void}historyOnclick 이력 항목 온클릭 이벤트 콜백 함수
 */
function createMainPage(data, historyOnclick) {
  /* --------------- */
  /*  Util Function  */
  /* --------------- */

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

  /* ------------ */
  /*  Create View */
  /* ------------ */

  // Subtitle 생성
  const subTitle = `시행일 ${data.enforceDate}`;

  // Footer 생성
  const noticeDate = createElement('li', {
    child: converDate(`고지일: ${data.noticeDate}`),
  });
  const enforceDate = createElement('li', {
    child: converDate(`시행일: ${data.enforceDate}`),
  });
  const footerElement = createElement('ul', {
    class: 'font-text-body2 font-color-dark',
    child: [noticeDate, enforceDate],
  });

  // Content 생성
  const contentElement = contentParser({ contents: data.contents });

  // 이력 보기 생성
  if (typeof historyOnclick === 'function') {
    const historyTitle = createElement('p', {
      class: 'content-item-title font-text-body2 font-color-dark font-medium',
      child: data.history.title,
    });
    const historyContainer = createElement('div', {
      class: 'content-item depth-1',
      child: historyTitle,
    });

    data.history.links.forEach((option) => {
      const element = createElement('p', {
        class: 'font-text-body2 font-color-medium font-link',
        child: `○ ${option.title} (${option.start} - ${option.end})`,
      });
      element.addEventListener('click', () => historyOnclick(option.file));
      historyContainer.appendChild(element);
    });

    contentElement.appendChild(historyContainer);
  }

  return new TextPost(data.title, subTitle, contentElement, footerElement)
    .element;
}

export default createMainPage;
