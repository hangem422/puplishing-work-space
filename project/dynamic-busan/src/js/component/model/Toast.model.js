import { createElement } from '../../util/dom';

const PADDING = 16; // 토스트 메시지가 화면 밑과의 마진
const ACTIVE_ELEMENT_CLASS = 'activate';

/**
 * @description Toast 메시지의 텍스트 Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _text = new WeakMap();

/**
 * @description Toast 메시지의 메시지 박스 Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _wrapper = new WeakMap();

/**
 * @description Toast Message Element
 * @type {WeakMap<object, HTMLLIElement>}
 */
const _element = new WeakMap();

/**
 * @description Toast Message를 비활성화하는 타이머
 * @type {WeakMap<object, NodeJS.Timeout>}
 */
const _timer = new WeakMap();

export function setText(text, thisArg) {
  _text.set(thisArg, text);
}

export function getText(thisArg) {
  return _text.get(thisArg);
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

export function setTimer(timer, thisArg) {
  // eslint-disable-next-line no-use-before-define
  cancleTimer(thisArg);
  _timer.set(thisArg, timer);
}

export function getTimer(thisArg) {
  return _timer.get(thisArg);
}

/**
 * @description 일정 시간이 지나면 토스트 메시지가 자동으로 숨겨지는 것을 멈춥니다.
 * @param {this} thisArg
 */
export function cancleTimer(thisArg) {
  const timer = _timer.get(thisArg);

  if (timer) clearTimeout(timer);
  _timer.set(thisArg, null);
}

/**
 * @description Toast Message를 강제로 숨깁니다.
 * @param {this} thisArg
 */
export function hide(thisArg) {
  const wrapper = _wrapper.get(thisArg);
  const element = _element.get(thisArg);

  cancleTimer(thisArg);
  element.classList.remove(ACTIVE_ELEMENT_CLASS);
  wrapper.style.top = '0px';
}

/**
 * @description Toast Message를 보여줍니다.
 * @param {string} str Message 내용
 * @param {number} time Message가 보여지는 시간
 * @param {this} thisArg
 */
export function show(str, time, thisArg) {
  const text = _text.get(thisArg);
  const wrapper = _wrapper.get(thisArg);
  const element = _element.get(thisArg);

  text.innerHTML = str;
  wrapper.style.top = `-${wrapper.offsetHeight + PADDING}px`;
  element.classList.add(ACTIVE_ELEMENT_CLASS);

  // 일정시간이 지나면 자동으로 숨깁니다.
  const timer = setTimeout(() => hide(thisArg), time);
  _timer.set(thisArg, timer);
}

/**
 * @description Toast에서 사용할 Proerty를 초기화합니다.
 * @param {this} thisArg
 */
function initVariable(thisArg) {
  _timer.set(thisArg, null);
}

/**
 * @description Toast Element를 초기화합니다.
 * @param {this} thisArg
 */
function initElement(thisArg) {
  const text = createElement('p', {
    class: 'font-text-body2',
    child: ';',
  });
  const wrapper = createElement('div', {
    class: 'wrapper toast-wrapper',
    child: text,
  });
  const element = createElement('div', {
    class: 'toast-container',
    child: wrapper,
  });

  _text.set(thisArg, text);
  _wrapper.set(thisArg, wrapper);
  _element.set(thisArg, element);
}

/**
 * @description Toast Component를 생성합니다.
 * @param {this} thisArg
 */
export function createToast(thisArg) {
  initVariable(thisArg);
  initElement(thisArg);
}
