import { createElement, appendAllChild } from '../../util/dom';

const _list = new WeakMap();
const _element = new WeakMap();

const _prefix = new WeakMap();
const _onClick = new WeakMap();
const _separatorClass = new WeakMap();

/**
 * @param {HTMLElement} list History List Element
 * @param {this} thisArg
 */
export function setList(list, thisArg) {
  _list.set(thisArg, list);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} History List Element
 */
export function getList(thisArg) {
  return _list.get(thisArg);
}

/**
 * @param {HTMLElement} element History Element
 * @param {this} thisArg
 */
export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} History Element
 */
export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @param {string} prefix 각 이력마다 동일하게 붙을 접두어
 * @param {this} thisArg
 */
export function setPrefix(prefix, thisArg) {
  _prefix.set(thisArg, prefix);
}

/**
 * @param {this} thisArg
 * @returns {string} 각 이력마다 동일하게 붙을 접두어
 */
export function getPrefix(thisArg) {
  return _prefix.get(thisArg);
}

/**
 * @param {(file: string) => void} onClick 아이템 온 클릭 콜백 이벤트
 * @param {this} thisArg
 */
export function setOnClick(onClick, thisArg) {
  _onClick.set(thisArg, onClick);
}

/**
 * @param {this} thisArg
 * @param {(file: string) => void} onClick 아이템 온 클릭 콜백 이벤트
 */
export function getOnclick(thisArg) {
  return _onClick.get(thisArg);
}

/**
 * @param {string} separatorClass 다른 History와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

/**
 * @param {this} thisArg
 * @returns {string} 다른 History와와 구분할 수 있는 고유 class
 */
export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
}

/**
 * @description History List에 아이템을 추가합니다.
 * @param {string} key 이력 날짜
 * @param {string} link
 * @param {this} thisArg
 */
export function addItem(key, link, thisArg) {
  const prefix = createElement('p', { child: _prefix.get(thisArg) });
  const date = createElement('p', { child: key });

  const item = createElement('li', { child: [prefix, date] });
  item.addEventListener('click', () => _onClick.get(thisArg)(link));

  appendAllChild(_list.get(thisArg), item);
}

/**
 * @description History에서 사용할 Proerty를 초기화합니다.
 * @param {string} prefix 각 이력마다 동일하게 붙을 접두어
 * @param {(file: string) => void} onClick 아이템 온 클릭 콜백 이벤트
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initVariable(prefix, onClick, separatorClass, thisArg) {
  _prefix.set(thisArg, prefix);
  _onClick.set(thisArg, onClick);
  _separatorClass.set(thisArg, separatorClass);
}

/**
 * @description History Element를 생성합니다.
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const title = createElement('p', {
    class: `term-history-title`,
    child: '이전 약관 이력은 아래에서 확인할 수 있습니다.',
  });
  const list = createElement('ul', {
    class: `term-history-list font-text-subtitle2 font-color-regular`,
  });
  const element = createElement('div', {
    class: `term-history ${separatorClass}`,
  });

  appendAllChild(element, [title, list]);

  _list.set(thisArg, list);
  _element.set(thisArg, element);
}

/**
 * @description History Component를 생성합니다.
 * @param {string} prefix 각 이력마다 동일하게 붙을 접두어
 * @param {(file: string) => void)} onClick 아이템 온 클릭 콜백 이벤트
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
export function createHistory(prefix, onClick, separatorClass, thisArg) {
  initVariable(prefix, onClick, separatorClass, thisArg);
  initElement(separatorClass, thisArg);
}
