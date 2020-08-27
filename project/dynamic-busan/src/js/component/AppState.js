import { createElement } from '../util/dom';
import { isIOS } from '../util/os';

const ACTIVE_POPUP_CLASS = 'active';

/**
 * @description App State 컴포넌트를 생성합니다.
 * @property {boolean} state App State 화면을 보여줄지 여부
 * @property {HTMLLIElement} text 싱글 버튼 모달의 텍스트 엘리먼트
 * @property {HTMLLIElement} btn 싱글 버튼 모달의 버튼 엘리먼트
 * @property {HTMLLIElement} element App State 엘리먼트
 * @property {HTMLLIElement} loading loading 엘리먼트
 * @property {HTMLLIElement} modal modal 엘리먼트
 */
class AppState {
  /**
   * @description App State 생성자
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

    const modal = createElement('div', {
      class: `single-btn-modal ${isIOS() ? 'ios' : ''}`,
      child: [this.text, this.btn],
    });
    this.modalWrapper = createElement('div', {
      class: 'app-state-wrapper modal-wrapper',
      child: modal,
    });

    const wings = [...Array(12)].map(() => document.createElement('div'));
    const wingWrapper = createElement('div', {
      class: 'ldio-s5ugu8dwj4l',
      child: wings,
    });
    const load = createElement('div', {
      class: 'loadingio-spinner-spinner-bv4ofojvnw',
      child: wingWrapper,
    });
    this.loadingWrapper = createElement('div', {
      class: 'app-state-wrapper loading-wrapper',
      child: load,
    });

    this.element = createElement('div', {
      class: 'app-state-container',
      child: [this.loadingWrapper, this.modalWrapper],
    });
  }

  /**
   * @description 싱글 버튼 모달 컴포넌트 구성
   * @param {string} text 모달 텍스트
   * @param {() => void} 모달 버튼의 온 클릭 이벤트 콜백함수
   */
  showModal(text = '', onClick = () => {}) {
    this.element.classList.add(ACTIVE_POPUP_CLASS);
    this.modalWrapper.classList.add(ACTIVE_POPUP_CLASS);
    this.loadingWrapper.classList.remove(ACTIVE_POPUP_CLASS);

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

  /**
   * @description 로딩 컴포넌트 구성
   */
  showLoading() {
    this.element.classList.add(ACTIVE_POPUP_CLASS);
    this.loadingWrapper.classList.add(ACTIVE_POPUP_CLASS);
    this.modalWrapper.classList.remove(ACTIVE_POPUP_CLASS);

    this.use = true;
  }

  hide() {
    this.element.classList.remove(ACTIVE_POPUP_CLASS);
    this.modalWrapper.classList.remove(ACTIVE_POPUP_CLASS);
    this.loadingWrapper.classList.remove(ACTIVE_POPUP_CLASS);
  }
}

export default AppState;
