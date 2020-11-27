import { createElement } from '../../util/dom';

/**
 * @description Page Slider Element에 추가된 총 페이지 수
 * @type {WeakMap<object, number>}
 */
const _size = new WeakMap();

/**
 * @description 현재 페이지의 인덱스 번호
 * @type {WeakMap<object, number>}
 */
const _current = new WeakMap();

/**
 * @description 다른 Page Slider와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description 모든 페이지를 포함하는 Slider Wrapper
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _wrapper = new WeakMap();

/**
 * @description Page Slider Element
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

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description Page Slider를 원하는 페이지로 넘깁니다.
 * @param {number} index 이동할 페이지의 인덱스 값
 * @param {this} thisArg
 */
export function movePage(index, thisArg) {
  const size = _size.get(thisArg);
  const wrapper = _wrapper.get(thisArg);

  // index가 범위를 초과할 시 값을 변경합니다.
  let next = index < 0 ? size - 1 : index;
  next = index >= size ? 0 : next;

  // 페이지를 이동시키고, 현재 페이 인덱스 값을 변경합니다.
  wrapper.style.left = `${next * -100}%`;
  _current.set(thisArg, next);
}

/**
 * @description Page Slider를 다음 페이지로 넘깁니다.
 * @param {this} thisArg
 */
export function moveNext(thisArg) {
  const current = _current.get(thisArg);

  movePage(current + 1, thisArg);
}

/**
 * @description Page Slider를 이전 페이지로 넘깁니다.
 * @param {this} thisArg
 */
export function movePrev(thisArg) {
  const current = _current.get(thisArg);

  this.movePage(current - 1, thisArg);
}

/**
 * @description Page Slider에 Page을 추가합니다.
 * @param {HTMLLIElement} page 추가할 Page
 * @param {this} thisArg
 */
export function addPage(page, thisArg) {
  const size = _size.get(thisArg);
  const separatorClass = _separatorClass.get(thisArg);
  const wrapper = _wrapper.get(thisArg);

  const conatiner = createElement('div', {
    class: `page-slider-item ${separatorClass}`,
    style: `left: ${size * 100}%;`,
    child: page,
  });

  wrapper.appendChild(conatiner);
  _size.set(thisArg, size + 1);
}

/**
 * @description Page Slider에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 PageSlider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initVariable(separatorClass, thisArg) {
  _size.set(thisArg, 0);
  _current.set(thisArg, 0);
  _separatorClass.set(thisArg, separatorClass);
}

/**
 * @description Page Slider Element를 초기화합니다.
 * @param {string} separatorClass 다른 PageSlider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
function initElement(separatorClass, thisArg) {
  const wrapper = createElement('div', {
    class: `page-slider-wrapper ${separatorClass}`,
  });
  const element = createElement('div', {
    class: `page-slider-container ${separatorClass}`,
    child: wrapper,
  });

  _wrapper.set(thisArg, wrapper);
  _element.set(thisArg, element);
}

/**
 * @description Page Slider Component를 생성합니다.
 * @param {string} separatorClass 다른 Page Slider와 구분할 수 있는 고유 class
 * @param {this} thisArg
 */
export function createPageSlider(separatorClass, thisArg) {
  initVariable(separatorClass, thisArg);
  initElement(separatorClass, thisArg);
}
