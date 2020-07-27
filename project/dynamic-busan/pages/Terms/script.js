import { createElement, appendAllChild } from '../../src/js/util/dom';

import './style.css';
import data from './data.json';

/**
 * @description YYYY.MM.DD를 YYYY년 MM월 DD일로 변경합니다.
 * @param {string} date YYYY.MM.DD
 * @returns {string} YYYY년 MM월 DD일
 */
function converDate(date) {
  const dateArr = date.split('.');
  dateArr[0] = `${dateArr[0]}년`;
  dateArr[1] = dateArr[1].length < 2 ? `0${dateArr[1]}월` : `${dateArr[1]}월`;
  dateArr[2] = dateArr[2].length < 2 ? `0${dateArr[2]}일` : `${dateArr[2]}일`;
  return dateArr.join(' ');
}

/**
 * @description 약관 Header Container를 생성합니다.
 * @param {string} title 헤더에 들어갈 제목
 * @param {string} subtitle 헤더에 들어갈 부제목
 * @return {HTMLLIElement} Header Container
 */
function createHeaderContainer(title, subtitle) {
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
  const wrapper = createElement('div', {
    class: 'wrapper',
    child: [titleElement, subtitleElement],
  });
  return createElement('div', { class: 'container header', child: wrapper });
}

/**
 * @description 약관 Content Container를 생성합니다.
 * @param {string} content Content에 들어갈 약관 내용
 * @return {HTMLLIElement} Content Container
 */
function createContentContainer(content) {
  // Component Element를 생성합니다.
  const contentElement = createElement('p', {
    class: 'font-text-body2 font-color-medium',
    child: content,
  });

  // Layout을 구성합니다.
  const wrapper = createElement('div', {
    class: 'wrapper',
    child: contentElement,
  });
  return createElement('div', { class: 'container content', child: wrapper });
}

/**
 * @description 약관 Date Container를 생성합니다.
 * @param {string} notice 약관 고지일
 * @param {string} enforce 약관 시행일
 * @return {HTMLLIElement} Date Container
 */
function createDateContainer(notice, enforce) {
  // Component Element를 생성합니다.
  const noticeElement = createElement('li', { child: notice });
  const enforceElement = createElement('li', { child: enforce });
  const listElement = createElement('ul', {
    class: 'font-text-body2 font-color-dark',
    child: [noticeElement, enforceElement],
  });

  // Layout을 구성합니다.
  const wrapper = createElement('div', {
    class: 'wrapper',
    child: listElement,
  });
  return createElement('div', { class: 'container date', child: wrapper });
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // Page를 구성할 Element 생성합니다.
    const headerContainer = createHeaderContainer(
      data.title,
      `시행일 ${data.enforceDate}`,
    );
    const contentContainer = createContentContainer(data.content);
    const dateContainer = createDateContainer(
      converDate(`고지일: ${data.noticeDate}`),
      converDate(`시행일: ${data.enforceDate}`),
    );

    // Page를 구성합니다.
    appendAllChild(root, [headerContainer, contentContainer, dateContainer]);
  };
}
