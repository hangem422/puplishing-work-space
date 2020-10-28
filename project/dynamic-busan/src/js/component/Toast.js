import { createElement } from '../util/dom';

const PADDING = 16; // 토스트 메시지가 화면 밑과의 마진
const ACTIVE_ELEMENT_CLASS = 'activate';

/**
 * @description Toast Message 컴포넌트를 생성합니다.
 * @property {HTMLLIElement} text Toast 메시지의 텍스트
 * @property {HTMLLIElement} wrapper Toast 메시지의 메시지 박스
 * @property {HTMLLIElement} element Toast Message Element
 */
class Toast {
  /**
   * @description Toast Message 생성자
   */
  constructor() {
    this.text = createElement('p', {
      class: 'font-text-body2',
      child: ';',
    });
    this.wrapper = createElement('div', {
      class: 'wrapper toast-wrapper',
      child: this.text,
    });
    this.element = createElement('div', {
      class: 'toast-container',
      child: this.wrapper,
    });

    this.timer = null;
  }

  /**
   * @description 일정 시간이 지나면 토스트 메시지가 자동으로 숨겨지는 것을 멈춥니다.
   */
  cancleTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  /**
   * @description Toast Message를 보여줍니다.
   * @param {string} str Message 내용
   * @param {number} time Message가 보여지는 시간
   */
  show(str, time) {
    this.text.innerHTML = str;
    this.element.classList.add(ACTIVE_ELEMENT_CLASS);
    this.wrapper.style.top = `-${this.wrapper.offsetHeight + PADDING}px`;

    // 일정시간이 지나면 자동으로 숨깁니다.
    setTimeout(() => this.hide(), time);
  }

  /**
   * @description Toast Message를 강제로 숨깁니다.
   */
  hide() {
    this.cancleTimer();
    this.element.classList.remove(ACTIVE_ELEMENT_CLASS);
    this.wrapper.style.top = '0px';
  }
}

export default Toast;
