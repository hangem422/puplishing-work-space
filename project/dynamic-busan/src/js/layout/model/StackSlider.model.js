const { createElement } = require('../../util/dom');

const ACTIVE_PAGE_CLASS = 'active';
const STACK_PAGE_CLASS = 'stack';

/**
 * @description Stack Slider Element에 추가된 총 페이지 수
 * @type {WeakMap<object, number>}
 */
const _size = new WeakMap();

/**
 * @description 현재 페이지의 인덱스 번호
 * @type {WeakMap<object, number>}
 */
const _current = new WeakMap();

/**
 * @description 다른 Stack Slider와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description 모든 페이지를 포함하는 Slider Wrapper
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _wrapper = new WeakMap();

/**
 * @description Stack Detail Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _element = new WeakMap();

export function setSize(size, thisArg) {
  _size.set(thisArg, size);
}

export function getSize(thisArg) {
  return _size.get(thisArg);
}

export function setCurrent(current, thisArg) {
  _current.set(thisArg, current);
}

export function getCurrent(thisArg) {
  return _current.get(thisArg);
}

export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
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
 * @description Stack Slider를 다음 페이지로 넘깁니다.
 * @param {this} thisArg
 */
export function moveNext(thisArg) {
  const size = _size.get(thisArg);
  const current = _current.get(thisArg);
  const wrapper = _wrapper.get(thisArg);

  // 맨 끝 페이지에서는 사용할 수 없습니다.
  if (current === size - 1) return;

  wrapper.childNodes[current].classList.remove(ACTIVE_PAGE_CLASS);
  wrapper.childNodes[current].classList.add(STACK_PAGE_CLASS);
  wrapper.childNodes[current + 1].classList.add(ACTIVE_PAGE_CLASS);

  _current.set(thisArg, current + 1);
}

/**
 * @description Stack Slider를 이전 페이지로 넘깁니다.
 * @param {this} thisArg
 */
export function movePrev(thisArg) {
  const current = _current.get(thisArg);
  const wrapper = _wrapper.get(thisArg);

  // 맨 끝 페이지에서는 사용할 수 없습니다.
  if (current === 0) return;

  wrapper.childNodes[current].classList.remove(ACTIVE_PAGE_CLASS);
  wrapper.childNodes[current - 1].classList.remove(STACK_PAGE_CLASS);
  wrapper.childNodes[current - 1].classList.add(ACTIVE_PAGE_CLASS);

  _current.set(thisArg, current - 1);
}

/**
 * @description Stack Slider에 Page을 추가합니다.
 * @param {HTMLLIElement} page 추가할 Page
 * @param {this} thisArg
 */
export function addPage(page, thisArg) {
  const size = _size.get(thisArg);
  const wrapper = _wrapper.get(thisArg);
  const separatorClass = _separatorClass.get(thisArg);

  const pageWrapper = createElement('div', {
    class: 'stack-slider-item-wrapper',
    style: `z-index: ${(size + 1) * 100};`,
    child: page,
  });
  const pageConatiner = createElement('div', {
    class: `stack-slider-item-container ${separatorClass}`,
    child: pageWrapper,
  });

  if (size === 0) pageConatiner.classList.add(ACTIVE_PAGE_CLASS);
  wrapper.appendChild(pageConatiner);

  _size.set(thisArg, size + 1);
}

/**
 * @description Stack Slider에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 Stack Slider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initVariable(separatorClass, thisArg) {
  _size.set(thisArg, 0);
  _current.set(thisArg, 0);
  _separatorClass.set(thisArg, separatorClass);
}

/**
 * @description Stack Slider Element를 초기화합니다.
 * @param {string} separatorClass 다른 Stack Slider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const wrapper = createElement('div', {
    class: `stack-slider-wrapper ${separatorClass}`,
  });
  const element = createElement('div', {
    class: `stack-slider-container ${separatorClass}`,
    child: wrapper,
  });

  _wrapper.set(thisArg, wrapper);
  _element.set(thisArg, element);
}

/**
 * @description Stack Slider Component를 생성합니다.
 * @param {string} separatorClass 다른 Stack Slider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
export function createStackSlider(separatorClass, thisArg) {
  initVariable(separatorClass, thisArg);
  initElement(separatorClass, thisArg);
}
