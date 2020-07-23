/* eslint-disable no-unused-vars */
import { emptyAlarmImage } from '../../src/js/image';
import { createElementWithOption, appendAllChild } from '../../src/js/util/dom';

import data from './data.json';
import './style.css';

/**
 * @description 공지사항이 없을 시 빈 화면을 보여줍니다.
 * @param {HTMLElement} root 화면을 렌더링할 컨테이너 엘리먼트
 */
function showEmptyScreen(root) {
  // root의 모든 Child Node를 삭제합니다.
  root.innerHTML = '';

  // Lavtout Element 생성합니다.
  const container = createElementWithOption('div', {
    class: 'container empty-screen',
  });
  const wrapper = createElementWithOption('div', { class: 'wrapper' });

  // Component Element를 생성합니다.
  const image = emptyAlarmImage();
  const text = createElementWithOption('div', {
    class: 'font-text-body1 font-color-light empty-screen-text',
  });
  text.innerHTML = '아직 등록된 공지사항이 없습니다.';

  // Layout을 구성합니다.
  appendAllChild(wrapper, [image, text]);
  container.appendChild(wrapper);
  root.appendChild(container);
}

/**
 * @description 렌더링할 페이지의 상태에따라 다른 화면을 보여줍니다.
 * @param {'empty' | 'list' | 'detail'} pageState 렌더링할 페이지의 상태
 */
function renderBasedOnState(pageState) {
  // Page를 Render할 Element를 가져옵니다.
  const root = document.getElementsByClassName('root')[0];

  // appSate의 값에 따라 화면을 다리 보여줍니다.
  if (pageState === 'empty') showEmptyScreen(root);
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    if (data.length < 1) renderBasedOnState('empty');
  };
}
