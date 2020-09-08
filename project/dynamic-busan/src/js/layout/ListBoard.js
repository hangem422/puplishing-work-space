import { createElement } from '../util/dom';

/**
 * @description List Board Element를 렌더할 수 있는 클래스
 * @property {string} separatorClass 다른 List Board와 구분할 수 있는 고유 class
 * @property {(index: number, item: HTMLElement) => void} onClick Item의 온클릭 이벤트 리스너
 * @property {HTMLLIElement} element List Board Element
 */
class ListBoard {
  /**
   * @description List Board의 생성자
   * @param {string} separatorClass 다른 List Board와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} itemList List Board에 들어갈 Item들의 리스트
   * @param {(index: number, item: HTMLElement) => void} onClickFunction Item의 온클릭 이벤트 리스너
   */
  constructor(separatorClass, itemList = [], onClickFunction = () => {}) {
    this.separatorClass = separatorClass || '';
    this.onClick = onClickFunction;
    this.element = createElement('ul', {
      class: `list-board ${separatorClass}`,
    });

    this.render(itemList);
  }

  /**
   * @description List Board에 Item을 추가합니다.
   * @param {HTMLLIElement} item 추가할 Item
   */
  addItem(item) {
    // List Item에 들어갈 내부 구성 요소들을 만듭니다.
    const headerWrapper = createElement('div', {
      class: 'item-header-wrapper',
      child: item,
    });
    const headerContainer = createElement('div', {
      class: 'item-header-container',
      child: headerWrapper,
    });

    // Item의 내부 구성 요소와, Event Listner를 설정합니다.
    const index = this.element.childElementCount;
    const container = createElement('li', {
      class: `list-board-item ${this.separatorClass}`,
      child: headerContainer,
    });
    container.addEventListener('click', () => this.onClick(index, item));

    this.element.appendChild(container);
  }

  /**
   * @description List Board Element를 렌더합니다.
   * @param {HTMLElement[]} itemList List Board에 들어갈 Item들의 리스트
   */
  render(itemList) {
    itemList.forEach((item) => this.addItem(item));
  }
}

export default ListBoard;
