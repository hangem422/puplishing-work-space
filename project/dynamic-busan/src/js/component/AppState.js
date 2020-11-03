import * as controller from './controller/AppState.controller';

/**
 * @description App State 컴포넌트를 생성합니다.
 * @property {boolean} state Lodaing 혹은 Modal이 활성화 상태인지 여부 (Read Only)
 * @property {HTMLLIElement} element App State Element (Read Only)
 */
export default class AppState {
  constructor() {
    controller.createModalComp(this);
    controller.createLoadingComp(this);
    controller.createAppState(
      controller.getLoadingWrapper(this),
      controller.getModalWrapper(this),
      this,
    );
  }

  /**
   * @returns {boolean} Lodaing 혹은 Modal이 활성화 상태인지 여부 (Read Only)
   */
  get state() {
    return controller.getState(this);
  }

  /**
   * @returns {HTMLLIElement} App State Element (Read Only)
   */
  get element() {
    return controller.getElement(this);
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
    controller.showModalBasic(
      typeof text === 'string' ? text : '',
      typeof onClick === 'function' ? onClick : () => {},
      this,
    );

    controller.showModalLink(
      typeof options.linkText === 'string' ? options.linkText : '',
      typeof options.linkUrl === 'string' ? options.linkUrl : '',
      this,
    );

    controller.showModalSubBtn(
      typeof options.subBtnText === 'string' ? options.subBtnText : '',
      typeof options.onSubClick === 'function' ? options.onSubClick : () => {},
      this,
    );
  }

  /**
   * @description 로딩 컴포넌트를 생성합니다.
   */
  showLoading() {
    controller.showLoading(this);
  }

  /**
   * @description App State를 비활성화합니다.
   */
  hide() {
    controller.hideAppState(this);
  }
}
