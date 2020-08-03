import { createElement } from '../util/dom';

const ACTIVE_LOADING_CLASS = 'active';

/**
 * @description 로딩 컴포넌트를 생성합니다.
 * @property {boolean} state 로딩 화면을 보여줄지 여부
 * @property {HTMLLIElement} element Loading Element
 */
class Loading {
  /**
   * @description Loading 생성자
   */
  constructor() {
    this.state = false;

    const wings = [...Array(12)].map(() => document.createElement('div'));
    const wingWrapper = createElement('div', {
      class: 'ldio-s5ugu8dwj4l',
      child: wings,
    });
    const icon = createElement('div', {
      class: 'loadingio-spinner-spinner-bv4ofojvnw',
      child: wingWrapper,
    });
    this.element = createElement('div', {
      class: 'loading-container',
      child: icon,
    });
  }

  /**
   * @description Loading 컴포넌트 사용 여부를 설정합니다.
   * @param {boolean} state 사용 여부
   */
  setState(state) {
    if (!this.element) return;

    const containClass = this.element.classList.contains(ACTIVE_LOADING_CLASS);
    if (state && !containClass) {
      this.element.classList.add(ACTIVE_LOADING_CLASS);
    } else if (!state && containClass) {
      this.element.classList.remove(ACTIVE_LOADING_CLASS);
    }
    this.use = state;
  }

  show() {
    this.setState(true);
  }

  hide() {
    this.setState(false);
  }
}

export default Loading;
