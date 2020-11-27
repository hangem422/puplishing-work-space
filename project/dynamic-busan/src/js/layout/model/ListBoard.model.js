import { createElement } from '../../util/dom';

/**
 * @description 다른 List Board와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description Item의 온클릭 이벤트 리스너
 * @type {WeakMap<object, (index: number, item: HTMLElement) => void>}
 */
const _onClick = new WeakMap();

/**
 * @description List Board Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _element = new WeakMap();

export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
}

export function setOnClick(onClick, thisArg) {
  _onClick.set(thisArg, onClick);
}

export function getOnClick(thisArg) {
  return _onClick.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description List Board에 Item을 추가합니다.
 * @param {HTMLElement} item 추가할 Item
 * @param {this} thisArg
 */
export function addItem(item, thisArg) {
  const separatorClass = _separatorClass.get(thisArg);
  const element = _element.get(thisArg);
  const onClick = _onClick.get(thisArg);

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
  const index = element.childElementCount;
  const container = createElement('li', {
    class: `list-board-item ${separatorClass}`,
    child: headerContainer,
  });
  container.addEventListener('click', () => onClick(index, item));

  element.appendChild(container);
}

/**
 * @description ListBoard에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 ListBoard와 구분할 수 있는 고유 class
 * @param {(index: number, item: HTMLElement) => void} onClick Item의 온클릭 이벤트 리스너
 * @param {this} thisArg
 */
function initVariable(separatorClass, onClick, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
  _onClick.set(thisArg, onClick);
}

/**
 * @description List Board Element를 초기화합니다.
 * @param {string} separatorClass 다른 ListBoard와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const element = createElement('ul', {
    class: `list-board ${separatorClass}`,
  });

  _element.set(thisArg, element);
}

/**
 * @description List Board Component를 생성합니다.
 * @param {string} separatorClass 다른 ListBoard와 구분할 수 있는 고유 class
 * @param {(index: number, item: HTMLElement) => void} onClick Item의 온클릭 이벤트 리스너
 * @param {this} thisArg
 */
export function createListBoard(separatorClass, onClick, thisArg) {
  initVariable(separatorClass, onClick, thisArg);
  initElement(separatorClass, thisArg);
}
