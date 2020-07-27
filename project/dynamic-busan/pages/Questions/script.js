import { createElement } from '../../src/js/util/dom';
import DrawerBoard from '../../src/js/layout/DrawerBoard';
import { dropDownIcon } from '../../src/js/component/Icon';

import './style.css';
import data from './data.json';

/**
 * @description DrawerBoard Item의 Header Element를 만듭니다.
 * @param {string} title DrawerBoard Item의 제목
 * @return {HTMLLIElement} DrawerBoard Item의 Header Element
 */
function createItemHeader(title) {
  // Item Header의 내부를 구성 Element를 만듭니다.
  const titleElement = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: title,
  });
  const icon = dropDownIcon();

  // Item Layout을 구성합니다.
  return createElement('div', {
    class: 'row-center header-custom-content',
    child: [titleElement, icon],
  });
}

/**
 * @description Item의 Content Element를 만듭니다.
 * @param {string[]} content Item의 내용 문자열 리스트
 * @return {HTMLLIElement} Item의 Content Element
 */
function createItemContent(content) {
  // Item Contet 내부를 구성 Element를 만듭니다.
  const contentElements = content.map((str) =>
    createElement('p', { child: str }),
  );

  // Item의 Layout을 만듭니다.
  return createElement('div', {
    class: 'font-text-body2 font-color-medium  content-custom-content',
    child: contentElements,
  });
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // Drawer Board에 들어갈 Item List 생성합니다.
    const itemList = data.reduce((prev, cur) => {
      const header = createItemHeader(cur.title);
      const content = createItemContent(cur.content);
      return prev.concat({ header, content });
    }, []);

    // Drawer Board를 생성합니다.
    const drawerBoard = new DrawerBoard('question-board', itemList);
    root.appendChild(drawerBoard.element);
  };
}
