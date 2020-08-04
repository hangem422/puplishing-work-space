import { createElement } from '../util/dom';
import { isIOS } from '../util/os';

const ACTIVE_MODAL_CLASS = 'active';

/**
 * @description 싱글 버튼 모달 컴포넌트를 생성합니다.
 * @property {boolean} state 싱글 버튼 모달 화면을 보여줄지 여부
 * @property {HTMLLIElement} text 싱글 버튼 모달의 텍스트 엘리먼트
 * @property {HTMLLIElement} btn 싱글 버튼 모달의 버튼 엘리먼트
 * @property {HTMLLIElement} element Single Button Modal Element
 */
class SingleBtnModal {
  /**
   * @description Single Button Modal 생성자
   */
  constructor() {
    this.state = false;
    this.onClick = () => {};

    this.text = createElement('p', {
      class: 'modal-text font-text-body1 font-color-dark',
    });
    this.btn = createElement('button', {
      class: 'modal-btn font-text-body1 font-color-dark font-medium',
      child: '확인',
    });
    this.btn.addEventListener('click', this.onClick);
    if (isIOS()) {
      const modal = createElement('div', {
        class: 'single-btn-modal-ios',
        child: [this.text, this.btn],
      });
      this.element = createElement('div', {
        class: 'single-btn-modal-container',
        child: modal,
      });
    } else {
      const modal = createElement('div', {
        class: 'single-btn-modal',
        child: [this.text, this.btn],
      });
      this.element = createElement('div', {
        class: 'single-btn-modal-container',
        child: modal,
      });
    }
  }

  /**
   * @description 싱글 버튼 모달 컴포넌트 사용 여부를 설정합니다.
   * @param {boolean} state 사용 여부
   * @param {string} text 모달 텍스트
   * @param {() => void} 모달 버튼의 온 클릭 이벤트 콜백함수
   */
  setState(state, text = '', onClick = () => {}) {
    if (!this.element) return;

    // 모달이 스타일을 변경합니다.
    const containClass = this.element.classList.contains(ACTIVE_MODAL_CLASS);
    if (state && !containClass) {
      this.element.classList.add(ACTIVE_MODAL_CLASS);
    } else if (!state && containClass) {
      this.element.classList.remove(ACTIVE_MODAL_CLASS);
    }

    // 모달이 보여져야 한다면, 텍스트와 온 클릭 함수를 적용합니다.
    if (state) {
      this.text.innerHTML = text;

      // 기존 이벤트 리스너를 제거합니다.
      this.btn.removeEventListener('click', this.onClick);
      // 새로운 온클릭 리스너를 지정합니다.
      this.onClick = () => {
        onClick();
        this.hide();
      };
      this.btn.addEventListener('click', this.onClick);
    }
  }

  show(text = '', onClick = () => {}) {
    this.setState(true, text, onClick);
  }

  hide() {
    this.setState(false);
  }
}

export default SingleBtnModal;
