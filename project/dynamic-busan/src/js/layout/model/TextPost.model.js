import { createElement } from '../../util/dom';

/**
 * @description Header Title Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _titleElement = new WeakMap();

/**
 * @description Header Subtitle Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _subtitleElement = new WeakMap();

/**
 * @description Content Wrapper Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _contentWrapper = new WeakMap();

/**
 * @description Footer Wrapper Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _footerWrapper = new WeakMap();

/**
 * @description TextPost Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _element = new WeakMap();

export function setTitleElement(titleElement, thisArg) {
  _titleElement.set(thisArg, titleElement);
}

export function getTitleElement(thisArg) {
  return _titleElement.get(thisArg);
}

export function setSubtitleElement(subtitleElement, thisArg) {
  _subtitleElement.set(thisArg, subtitleElement);
}

export function getSubtitleElement(thisArg) {
  return _subtitleElement.get(thisArg);
}

export function setContentWrapper(contentWrapper, thisArg) {
  _contentWrapper.set(thisArg, contentWrapper);
}

export function getContentWrapper(thisArg) {
  return _contentWrapper.get(thisArg);
}

export function setFooterWrapper(footerWrapper, thisArg) {
  _footerWrapper.set(thisArg, footerWrapper);
}

export function getFooterWrapper(thisArg) {
  return _footerWrapper.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description TextPost Element를 초기화합니다.
 * @param {string} title 게시글의 제목 문자열
 * @param {string} subtitle 게시글의 부제목 문자열
 * @param {string | HTMLElement | HTMLElement[]} contents 게시글 내용 문자열 혹은 HTMLElemnt
 * @param {string | HTMLElement | HTMLElement[]} footer 게시글 푸터 문자열 혹은 HTMLElement
 * @param {this} thisArg
 */
function initElement(title, subtitle, contents, footer, thisArg) {
  // Component Element를 생성합니다.
  const titleElement = createElement('p', {
    class: 'font-text-body1 font-medium font-color-dark header-title',
    child: title,
  });
  const subtitleElement = createElement('p', {
    class: 'font-text-subtitle2 font-medium font-color-regular header-subtitle',
    child: subtitle,
  });

  // Layout을 구성합니다.
  const headerWrapper = createElement('div', {
    class: 'wrapper text-post-header',
    child: [titleElement, subtitleElement],
  });
  const contentWrapper = createElement('div', {
    class: 'wrapper text-post-content font-text-body2 font-color-medium',
    child: contents,
  });
  const footerWrapper = createElement('div', {
    class: 'wrapper text-post-footer font-text-body2 font-color-medium',
    child: footer,
  });

  const element = createElement('div', {
    class: 'container text-post-container',
    child: [headerWrapper, contentWrapper, footerWrapper],
  });

  _titleElement.set(thisArg, titleElement);
  _subtitleElement.set(thisArg, subtitleElement);
  _contentWrapper.set(thisArg, contentWrapper);
  _footerWrapper.set(thisArg, footerWrapper);
  _element.set(thisArg, element);
}

/**
 * @description TextPost Component를 생성합니다.
 * @param {string} title 게시글의 제목 문자열
 * @param {string} subtitle 게시글의 부제목 문자열
 * @param {string | HTMLElement | HTMLElement[]} contents 게시글 내용 문자열 혹은 HTMLElemnt
 * @param {string | HTMLElement | HTMLElement[]} footer 게시글 푸터 문자열 혹은 HTMLElement
 * @param {this} thisArg
 */
export function createTextPost(title, subtitle, contents, footer, thisArg) {
  initElement(title, subtitle, contents, footer, thisArg);
}
