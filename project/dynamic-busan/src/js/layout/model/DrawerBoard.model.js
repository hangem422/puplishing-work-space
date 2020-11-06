import { createElement } from '../../util/dom';

const ACTIVE_ELEMENT_CLASS = 'active';
const INIT_CONTENT_HEIGHT = '0px';

/**
 * @description 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description 현재 활성화 된 Item
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _active = new WeakMap();

/**
 * @description DrawerBoard Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _element = new WeakMap();

export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
}

export function setActive(active, thisArg) {
  _active.set(thisArg, active);
}

export function getActive(thisArg) {
  return _active.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description 활성화된 Item을 해지합니다.
 * @param {this} thisArg
 */
export function deleteActive(thisArg) {
  const active = _active.get(thisArg);

  if (active instanceof HTMLElement) {
    active.classList.remove(ACTIVE_ELEMENT_CLASS);
    active.childNodes[1].style.height = INIT_CONTENT_HEIGHT;
    _active.set(thisArg, undefined);
  } else if (active) {
    _active.set(thisArg, undefined);
  }
}

/**
 * @description 새로운 Item을 활성화합니다.
 * @param {HTMLLIElement} element 활성화시킬 Item
 * @param {this} thisArg
 */
export function changeActive(element, thisArg) {
  const active = _active.get(thisArg);

  // 현재 활성화 된 Item을 해지합니다.
  if (active) deleteActive(thisArg);

  // 파라미터로 전달받은 element를 활성화합니다.
  element.classList.add(ACTIVE_ELEMENT_CLASS);
  element.childNodes[1].style.height = `${element.childNodes[2].offsetHeight}px`;
  _active.set(thisArg, element);
}

/**
 * @description Item의 onClick 이벤트 리스너 함수를 만듭니다.
 * @param {HTMLLIElement} item 해당 함수를 onClick 리스너로 사용하는 Item
 * @param {this} thisArg
 * @return {function} onClick 이벤트 리스너 함수
 */
export function createItemOnClick(item, thisArg) {
  return () => {
    // 이미 활성화된 상태이면 활성화를 해지합니다.
    if (item.classList.contains(ACTIVE_ELEMENT_CLASS)) deleteActive(thisArg);
    // 활성화 상태가 아니면 활성화된 List Item을 교체합니다.
    else changeActive(item, thisArg);
  };
}

/**
 * @description DrawerBoard에 Item을 추가합니다.
 * @param {{ header: HTMLLIElement, content: HTMLLIElement}} item 추가할 Item
 */
export function addItem(item, thisArg) {
  const separatorClass = _separatorClass.get(thisArg);
  const element = _element.get(thisArg);

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

  // Note: content의 높이를 저장해서 쓰면, Web Front가 로드되기 전과 후의 높이가 달라져서 문제가 발생합니다.
  // Note: dummyForHeight를 보이지 않는 곳에 만들고 그 높이를 가져와 content의 높이를 확장할 때 사용합니다.
  const dummyForHeight = contentContainer.cloneNode(true);
  dummyForHeight.classList.add('item-dummy');
  dummyForHeight.removeAttribute('style');

  // Item의 내부 구성 요소와, Event Listner를 설정합니다.
  const container = createElement('li', {
    class: `drawer-board-item ${separatorClass}`,
    child: [headerContainer, contentContainer, dummyForHeight],
  });
  container.addEventListener('click', createItemOnClick(container, thisArg));

  // 내용 클릭 시에는 이벤트가 동작하지 않게 이벤트 버블링을 막습니다.
  contentContainer.addEventListener('click', (event) =>
    event.stopPropagation(),
  );

  element.appendChild(container);
}

/**
 * @description DrawerBoard에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initVariable(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
  _active.set(thisArg, undefined);
}

/**
 * @description Drawer Board Element를 초기화합니다.
 * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const element = createElement('ul', {
    class: `drawer-board ${separatorClass}`,
  });

  _element.set(thisArg, element);
}

/**
 * @description Drawer Board Component를 생성합니다.
 * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
export function createDrawerBoard(separatorClass, thisArg) {
  initVariable(separatorClass, thisArg);
  initElement(separatorClass, thisArg);
}
