import * as model from './model/AppState.model';

/**
 * @description App State 컴포넌트를 생성합니다.
 * @property {boolean} state Lodaing 혹은 Modal이 활성화 상태인지 여부 (Read Only)
 * @property {HTMLLIElement} element App State Element (Read Only)
 */
export default class AppState {
  constructor() {
    model.createAppState(this);
  }

  /**
   * @returns {boolean} Lodaing 혹은 Modal이 활성화 상태인지 여부
   */
  get state() {
    return model.getState(this);
  }

  /**
   * @returns {HTMLLIElement} App State Element
   */
  get element() {
    return model.getElement(this);
  }

  /**
   * @description 버튼 모달 컴포넌트를 생성합니다.
   * @param {string} text 모달 텍스트
   * @param {() => void} onClick 모달 버튼의 온 클릭 이벤트 콜백함수
   * @param {{
      subBtnText?: string,
      onSubClick?: () => void,
      linkText?: string,
      linkUrl?: string,
    }} options 모달 컴포넌트 옵션 값
   */
  showModal(text, onClick, options = {}) {
    model.showModalBasic(
      typeof text === 'string' ? text : '',
      typeof onClick === 'function' ? onClick : () => {},
      this,
    );

    model.showModalLink(
      typeof options.linkText === 'string' ? options.linkText : '',
      typeof options.linkUrl === 'string' ? options.linkUrl : '',
      this,
    );

    model.showModalSubBtn(
      typeof options.subBtnText === 'string' ? options.subBtnText : '',
      typeof options.onSubClick === 'function' ? options.onSubClick : () => {},
      this,
    );
  }

  /**
   * @description 로딩 컴포넌트를 생성합니다.
   */
  showLoading() {
    model.showLoading(this);
  }

  /**
   * @description App State를 비활성화합니다.
   */
  hide() {
    model.hideAppState(this);
  }
}
