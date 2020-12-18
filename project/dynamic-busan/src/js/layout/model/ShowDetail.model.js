const { createElement } = require('../../util/dom');

/**
 * @description 다른 Show Detail과 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description 현재 활성화된 Element의 Key 값
 * @type {WeakMap<object, string>}
 */
const _current = new WeakMap();

/**
 * @description Show Detail의 Item Object
 * @type {WeakMap<object, HTMLLIElement[] | { [key: string]: HTMLLIElement }>}
 */
const _details = new WeakMap();

/**
 * @description 모든 페이지를 포함하는 Show Detail
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _wrapper = new WeakMap();

/**
 * @description Show Detail Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _element = new WeakMap();

export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
}

export function setCurrent(current, thisArg) {
  _current.set(thisArg, current);
}

export function getCurrent(thisArg) {
  return _current.get(thisArg);
}

export function setDetails(details, thisArg) {
  _details.set(thisArg, details);
}

export function getDetails(thisArg) {
  return _details.get(thisArg);
}

export function setWrapper(wrapper, thisArg) {
  _wrapper.set(thisArg, wrapper);
}

export function getWrapper(thisArg) {
  return _wrapper.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description 세부 내용을 보여줍니다.
 * @param {number | string} key
 * @param {this} thisArg
 */
export function renderDetail(key, thisArg) {
  const current = _current.get(thisArg);
  const details = _details.get(thisArg);

  if (current !== null) details[current].style.display = 'none';

  details[key].style.display = 'block';
  _current.set(thisArg, key);
}

/**
 * @description Show Detail에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 Show Detail 구분할 수 있는 고유 class
 * @param {HTMLLIElement[] | { [key: string]: HTMLLIElement }} details Show Detail의 Item Object
 * @param {this} thisArg
 */
function initVariable(separatorClass, details, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
  _details.set(thisArg, details);
  _current.set(thisArg, null);
}

/**
 * @description Show Detail Element를 초기화합니다.
 * @param {string} separatorClass 다른 Show Detail과 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const details = _details.get(thisArg);

  const wrapper = createElement('div', {
    class: `show-detail-wrapper ${separatorClass}`,
  });
  const element = createElement('div', {
    class: `show-detail-container ${separatorClass}`,
    child: wrapper,
  });

  Object.values(details).forEach((item) => {
    item.style.display = 'none';
    wrapper.appendChild(item);
  });

  _wrapper.set(thisArg, wrapper);
  _element.set(thisArg, element);
}

/**
 * @description Show Detail Component를 생성합니다.
 * @param {string} separatorClass 다른 Show Detail과 구분할 수 있는 고유 class
 * @param {HTMLLIElement[] | { [key: string]: HTMLLIElement }} details Show Detail의 Item Object
 * @param {this} thisArg
 */
export function createShowDetail(separatorClass, details, thisArg) {
  initVariable(separatorClass, details, thisArg);
  initElement(separatorClass, thisArg);
}
