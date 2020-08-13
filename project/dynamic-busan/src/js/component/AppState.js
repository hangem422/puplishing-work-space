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

    this.modal = createElement('div', {
      class: `single-btn-modal ${isIOS() ? 'ios' : ''}`,
      child: [this.text, this.btn],
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
    this.loading = createElement('div', {
      class: 'loading-container',
      child: load,
    });

    this.element = createElement('div', {
      class: 'app-state-container',
      child: [this.loading, this.modal],
    });
  }

  /**
   * @description App State 컴포넌트 사용 여부를 설정합니다.
   * @param {boolean} state 사용 여부
   */
  setState(state) {
    if (!this.element) return;

    this.state = state;

    // 모달이 스타일을 변경합니다.
    const containClass = this.element.classList.contains(ACTIVE_POPUP_CLASS);
    if (this.state && !containClass) {
      this.element.classList.add(ACTIVE_POPUP_CLASS);
    } else if (!this.state && containClass) {
      this.element.classList.remove(ACTIVE_POPUP_CLASS);
      this.loading.classList.remove(ACTIVE_POPUP_CLASS);
      this.modal.classList.remove(ACTIVE_POPUP_CLASS);
    }
  }

  /**
   * @description 싱글 버튼 모달 컴포넌트 구성
   * @param {string} text 모달 텍스트
   * @param {() => void} 모달 버튼의 온 클릭 이벤트 콜백함수
   */
  showModal(text = '', onClick = () => {}) {
    this.setState(true);
    this.modal.classList.add(ACTIVE_POPUP_CLASS);
    this.loading.classList.remove(ACTIVE_POPUP_CLASS);

    // 모달이 보여져야 한다면, 텍스트와 온 클릭 함수를 적용합니다.
    if (this.state) {
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

  /**
   * @description 로딩 컴포넌트 구성
   */
  showLoading() {
    this.setState(true);
    this.loading.classList.add(ACTIVE_POPUP_CLASS);

    this.use = this.state;
  }

  hide() {
    this.setState(false);
  }
}

export default AppState;

/**
 * @todo 로딩이 왜 마음대로 안되는지 찾아보기
 * @todo 배경화면을 설정하는 기능로만 사용
 */
