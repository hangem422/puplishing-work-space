import { createElement } from './util/dom';

const ACTIVE_ELEMENT_CLASS = 'active';
const INIT_CONTENT_HEIGHT = '0px';

/**
 * @description Drawer Board Element를 랜더할 수 있는 클래스
 * @property {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @property {HTMLLIElement | undefined} active 현재 활성화된 Item
 * @property {HTMLLIElement} element DrawerBoard Element
 */
class DrawerBoard {
  /**
   * @description DrawerBoard의 생성자
   * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
   * @param {{ header: HTMLLIElement, content: HTMLLIElement}[]} itemList DrawerBoard에 들어갈 Item들의 리스트
   */
  constructor(separatorClass, itemList) {
    this.separatorClass = separatorClass || '';
    this.active = undefined;
    this.element = createElement('ul', {
      class: `drawer-board ${separatorClass}`,
    });

    if (itemList) this.render(itemList);
  }

  /**
   * @description 활성화된 Item을 해지합니다.
   */
  deleteActive() {
    if (this.active instanceof HTMLElement) {
      this.active.classList.remove(ACTIVE_ELEMENT_CLASS);
      this.active.childNodes[1].style.height = INIT_CONTENT_HEIGHT;
      this.active = undefined;
    } else if (this.active) {
      this.active = undefined;
    }
  }

  /**
   * @description 새로운 Item을 활성화합니다.
   * @param {HTMLLIElement} element 활성화시킬 Item
   */
  changeActive(element) {
    // 현재 활성화된 Item을 해지합니다.
    if (this.active) this.deleteActive();

    // 파라미터로 전달받은 element를 활성화합니다.
    element.classList.add(ACTIVE_ELEMENT_CLASS);
    element.childNodes[1].style.height = `${element.childNodes[2].offsetHeight}px`;
    this.active = element;
  }

  /**
   * @description Item의 onClick 이벤트 리스너 함수를 만듭니다.
   * @param {HTMLLIElement} item 해당 함수를 onClick 리스너로 사용하는 Item
   * @return {function} onClick 이벤트 리스너 함수
   */
  createItemOnClick(item) {
    return () => {
      // 이미 활성화된 상태이면 활성화를 헤지합니다.
      if (item.classList.contains(ACTIVE_ELEMENT_CLASS)) this.deleteActive();
      // 활성화 상태가 아니면 활성화된 List Item을 교체합니다.
      else this.changeActive(item);
    };
  }

  /**
   * @description DrawerBoard에 Item을 추가합니다.
   * @param {{ header: HTMLLIElement, content: HTMLLIElement}} item 추가할 Item
   */
  addItem(item) {
    // List Item에 들어갈 내부 구성 요소들을 만듭니다.
    const headerWrapper = createElement('div', {
      class: 'item-header-wrapper',
      child: item.header,
    });
    const headerContainer = createElement('div', {
      class: 'item-header-container',
      child: headerWrapper,
    });

    const contentWrapper = createElement('div', {
      class: 'item-content-wrapper',
      child: item.content,
    });
    const contentContainer = createElement('div', {
      class: 'item-content-container',
      child: contentWrapper,
      style: `height: ${INIT_CONTENT_HEIGHT};`,
    });

    // Note: content의 높이를 저장해서 쓰면, Web Font가 로드되기 전과 후의 높이가 달라져서 문제가 발생합니다.
    // Note: dummyForHeight를 보이지 않는 곳에 만들고 그 높이를 가져와 content의 높이를 확장할 때 사용합니다.
    const dummyForHeight = contentContainer.cloneNode(true);
    dummyForHeight.classList.add('item-dummy');
    dummyForHeight.removeAttribute('style');

    // Item의 내부 구성 요소와, Event Listner를 설정합니다.
    const container = createElement('li', {
      class: `drawer-board-item ${this.separatorClass}`,
      child: [headerContainer, contentContainer, dummyForHeight],
    });
    container.addEventListener('click', this.createItemOnClick(container));

    // 내용 클릭시에는 이벤트가 동작하지 않게 이벤트 버블링을 막습니다.
    contentContainer.addEventListener('click', (event) =>
      event.stopPropagation(),
    );

    this.element.appendChild(container);
  }

  /**
   * @description DrawerBoard Element를 랜더합니다.
   * @param {{ header: HTMLLIElement, content: HTMLLIElement}[]} itmeList DrawerBoard에 들어갈 Item들의 리스트
   */
  render(itmeList) {
    itmeList.forEach((item) => this.addItem(item));
  }
}

export default DrawerBoard;
