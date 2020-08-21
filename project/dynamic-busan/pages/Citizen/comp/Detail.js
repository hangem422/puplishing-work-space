import { createElement } from '../../../src/js/util/dom';
import TextPost, { contentParser } from '../../../src/js/layout/TextPost';
import ShowDetail from '../../../src/js/layout/ShowDetail';

/**
 * @description Json 데이터를 기반으로 이용약관 상세 페이지를 생성합니다.
 * @param {{ link?: string, title: string, subtitle: string, contents?: Array, noticeDate: string, enforceDate: string }[]} data 약관 데이터
 * @returns {ShowDetail} Term Detail Page
 */
function createDetailPage(data) {
  /* --------------- */
  /*  Util Function  */
  /* --------------- */

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
    // 컴포넌트 Element를 생성합니다.
    const noticeElement = createElement('li', { child: notice });
    const enforceElement = createElement('li', { child: enforce });
    return createElement('ul', {
      class: 'font-text-body2 font-color-dark',
      child: [noticeElement, enforceElement],
    });
  }

  /* ------------ */
  /*  Create View */
  /* ------------ */

  const textPostList = data.map((term) => {
    const textPostPage = new TextPost();
    if (term.link) return textPostPage.element;

    textPostPage.title = term.title;
    textPostPage.subtitle = `시행일 ${term.enforceDate}`;
    textPostPage.contents = contentParser({ contents: term.contents });
    textPostPage.footer = createFooterElement(
      convertDate(`고지일: ${term.noticeDate}`),
      convertDate(`시행일: ${term.enforceDate}`),
    );
    return textPostPage.element;
  });

  return new ShowDetail('term-detail', textPostList);
}

export default createDetailPage;
