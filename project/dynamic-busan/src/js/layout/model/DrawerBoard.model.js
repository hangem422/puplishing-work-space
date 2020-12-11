import { createElement } from '../../util/dom';

const ACTIVE_ELEMENT_CLASS = 'active';
const INIT_CONTENT_HEIGHT = '0px';
const ANIMATION_DURATION = 100;

/**
 * @description 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description 현재 활성화 된 Item
 * @type {WeakMap<object, number>}
 */
const _active = new WeakMap();

/**
 * @description DrawerBoard Item 개수
 * @type {WeakMap<object, number>}
 */
const _size = new WeakMap();

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

export function setSize(size, thisArg) {
  _size.set(thisArg, size);
}

export function getSize(thisArg) {
  return _size.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description 현재 활성화된 Item이 화면에 보이지 않을 경우 스크롤을 강제 이동합니다.
 * @param {this} thisArg
 */
export function focusActiveItem(thisArg) {
  const element = _element.get(thisArg);
  const active = _active.get(thisArg);

  // 현재 활성화된 Node를 기져옵니다.
  const childs = element.querySelectorAll('li');
  const node = childs[active];
  if (!node || !node.getBoundingClientRect || !window.innerHeight) return;

  let end = node.getBoundingClientRect().bottom;

  // 활성화된 노드가 마지막이 아니면, 밑에 조금의 여백을 더합니다.
  // UX적으로 스크롤할 요소가 더 남아있다는 것을 인지시키기 위함입니다.
  const nextNode = childs[active + 1];
  if (nextNode) end += Math.ceil(nextNode.getBoundingClientRect().height / 2);

  const diff = end - window.innerHeight;
  if (diff <= 0) return;

  // 스크롤을 강제 이동시킵니다.
  window.scrollTo({ top: window.scrollY + diff, behavior: 'smooth' });
}

/**
 * @description 활성화된 Item을 해지합니다.
 * @param {this} thisArg
 */
export function deleteActive(thisArg) {
  const element = _element.get(thisArg);
  const active = _active.get(thisArg);

  const node = element.querySelectorAll('li')[active];

  // 활성화된 node가 존재하면, node를 비활성화 시킵니다.
  if (node) {
    node.classList.remove(ACTIVE_ELEMENT_CLASS);
    node.childNodes[1].style.height = INIT_CONTENT_HEIGHT;
  }

  // active를 초기화시킵니다.
  _active.set(thisArg, -1);
}

/**
 * @description 새로운 Item을 활성화합니다.
 * @param {number} index 활성화시킬 Item의 index
 * @param {this} thisArg
 */
export function changeActive(index, thisArg) {
  const element = _element.get(thisArg);
  const active = _active.get(thisArg);

  // 현재 활성화 된 Item을 해지합니다.
  if (active >= 0) deleteActive(thisArg);

  // 파라미터로 전달받은 element를 활성화합니다.
  const node = element.querySelectorAll('li')[index];
  if (!node) return;

  node.classList.add(ACTIVE_ELEMENT_CLASS);
  node.childNodes[1].style.height = `${node.childNodes[2].offsetHeight}px`;
  _active.set(thisArg, index);

  // focusActiveItem 함수를 바로 호출하면 CSS Transition이 끝나지 않아 제대로된 DOM 수치를 가져올 수 없습니다.
  // 현재 DrawerBoard Item 활성화에 적용된 Transition이 끝난 후에 함수를 호출합니다.
  setTimeout(() => focusActiveItem(thisArg), ANIMATION_DURATION);
}

/**
 * @description Item의 onClick 이벤트 리스너 함수입니다.
 * @param {number} item 해당 함수를 onClick 리스너로 사용하는 Item index
 * @param {this} thisArg
 * @return {function} onClick 이벤트 리스너 함수
 */
function itemOnClick(index, thisArg) {
  const active = _active.get(thisArg);

  if (index === active) deleteActive(thisArg);
  else changeActive(index, thisArg);
}

/**
 * @description DrawerBoard에 Item을 추가합니다.
 * @param {{ header: HTMLLIElement, content: HTMLLIElement}} item 추가할 Item
 */
export function addItem(item, thisArg) {
  const separatorClass = _separatorClass.get(thisArg);
  const element = _element.get(thisArg);
  const size = _size.get(thisArg);

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
  container.addEventListener('click', () => itemOnClick(size, thisArg));

  // 내용 클릭 시에는 이벤트가 동작하지 않게 이벤트 버블링을 막습니다.
  contentContainer.addEventListener('click', (event) =>
    event.stopPropagation(),
  );

  element.appendChild(container);
  _size.set(thisArg, size + 1);
}

/**
 * @description DrawerBoard에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initVariable(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
  _active.set(thisArg, -1);
  _size.set(thisArg, 0);
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
