import { createElement } from '../../../src/js/util/dom';
import { moreRight } from '../../../src/js/component/Icon';
import ListBoard from '../../../src/js/layout/ListBoard';

/**
 * @description Json 데이터를 기반으로 공지사항 리스트 페이지를 생성합니다.
 * @param {{ title: string, date: string }[]} data 약관 데이터
 * @param {(index: number, item: HTMLElement) => void} onClickFunc 공지사항의 온클릭 이벤트 리스너
 * @returns {ListBoard} List Board Page
 */
function createListBoardPage(data, onClickFunc) {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  // List의 내부를 구성하는 Element를 만듭니다.
  const itemList = data.reduce((prev, { title, date }) => {
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
      class: 'header-custom-content row',
      child: [textWrapper, moreRight(16, '#E5E5E5')],
    });
    return prev.concat(container);
  }, []);

  return new ListBoard('notice-board', itemList, onClickFunc);
}

export default createListBoardPage;
