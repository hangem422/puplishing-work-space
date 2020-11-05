import { createElement, appendAllChild } from '../../util/dom';

/**
 * @description History List Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _list = new WeakMap();

/**
 * @description History Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _element = new WeakMap();

/**
 * @description 각 이력마다 동일하게 붙을 접두어
 * @type {WeakMap<object, string>}
 */
const _prefix = new WeakMap();

/**
 * @description 아이템 온 클릭 콜백 이벤트
 * @type {WeakMap<object, (file: string) => void>}
 */
const _onClick = new WeakMap();

/**
 * @description 다른 History와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description History List에 아이템을 추가합니다.
 * @param {string} key 이력 날짜
 * @param {string} link
 * @param {this} thisArg
 */
export function addItem(key, link, thisArg) {
  const prefix = _prefix.get(thisArg);
  const list = _list.get(thisArg);

  const prefixElement = createElement('p', { child: prefix });
  const dateElement = createElement('p', { child: key });

  const item = createElement('li', { child: [prefixElement, dateElement] });
  item.addEventListener('click', () => _onClick.get(thisArg)(link));

  appendAllChild(list, item);
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
