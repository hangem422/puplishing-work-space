import { createElement } from '../../util/dom';
import { isIOS } from '../../util/os';

const ACTIVE_POPUP_CLASS = 'active';

const _state = new WeakMap();

const _onClick = new WeakMap();
const _onSubClick = new WeakMap();
const _onLinkClick = new WeakMap();

const _modalText = new WeakMap();
const _modalBtn = new WeakMap();
const _modalSubBtn = new WeakMap();
const _modalLink = new WeakMap();

const _modalWrapper = new WeakMap();
const _loadingWrapper = new WeakMap();
const _element = new WeakMap();

/**
 * @param {boolean} state Lodaing 혹은 Modal이 활성화 상태인지 여부
 * @param {this} thisArg
 */
export function setState(state, thisArg) {
  _state.set(thisArg, state);
}

/**
 * @param {this} thisArg
 * @returns {boolean} Lodaing 혹은 Modal이 활성화 상태인지 여부
 */
export function getState(thisArg) {
  return _state.get(thisArg);
}

/**
 * @param {() => void} onClick 모달 버튼의 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function setOnClick(onClick, thisArg) {
  _onClick.set(thisArg, () => {
    onClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

/**
 * @param {this} thisArg
 * @returns {() => void} 모달 버튼의 온 클릭 이벤트 콜백함수
 */
export function getOnClick(thisArg) {
  return _onClick.get(thisArg);
}

/**
 * @param {() => void} onSubClick 모달 보조 버튼 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function setOnSubClick(onSubClick, thisArg) {
  _onSubClick.set(thisArg, () => {
    onSubClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

/**
 * @param {this} thisArg
 * @returns {() => void} 모달 보조 버튼 온 클릭 이벤트 콜백함수
 */
export function getOnSubClick(thisArg) {
  return _onSubClick.get(thisArg);
}

/**
 * @param {() => void} onLinkClick 모달 링크 택스트 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function setOnLinkClick(onLinkClick, thisArg) {
  _onLinkClick.set(thisArg, () => {
    onLinkClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

/**
 * @param {this} thisArg
 * @returns {() => void} 모달 링크 택스트 온 클릭 이벤트 콜백함수
 */
export function getOnLinkClick(thisArg) {
  return _onLinkClick.get(thisArg);
}

/**
 * @param {string} modalText 모달 택스트
 * @param {this} thisArg
 */
export function setModalText(modalText, thisArg) {
  _modalText.set(thisArg, modalText);
}

/**
 * @param {this} thisArg
 * @returns {string} 모달 택스트
 */
export function getModalText(thisArg) {
  return _modalText.get(thisArg);
}

/**
 * @param {HTMLElement} modalBtn 모달 메인 버튼 Element
 * @param {this} thisArg
 */
export function setModalBtn(modalBtn, thisArg) {
  _modalBtn.set(thisArg, modalBtn);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} 모달 메인 버튼 Element
 */
export function getModalBtn(thisArg) {
  return _modalBtn.get(thisArg);
}

/**
 * @param {HTMLElement} modalSubBtn 모달 보조 버튼 Element
 * @param {this} thisArg
 */
export function setModalSubBtn(modalSubBtn, thisArg) {
  _modalSubBtn.set(thisArg, modalSubBtn);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} 모달 보조 버튼 Element
 */
export function getModalSubBtn(thisArg) {
  return _modalSubBtn.get(thisArg);
}

/**
 * @param {HTMLElement} modalLink 모달 링크 Element
 * @param {this} thisArg
 */
export function setModalLink(modalLink, thisArg) {
  _modalLink.set(thisArg, modalLink);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} 모달 링크 Element
 */
export function getModalLink(thisArg) {
  return _modalLink.get(thisArg);
}

/**
 * @param {HTMLElement} modalWrapper 모달 Element
 * @param {this} thisArg
 */
export function setModalWrapper(modalWrapper, thisArg) {
  _modalWrapper.set(thisArg, modalWrapper);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} 모달 Element
 */
export function getModalWrapper(thisArg) {
  return _modalWrapper.get(thisArg);
}

/**
 * @param {HTMLElement} loadingWrapper 로딩 Element
 * @param {this} thisArg
 */
export function setLoadingWrapper(loadingWrapper, thisArg) {
  _loadingWrapper.set(thisArg, loadingWrapper);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} 로딩 Element
 */
export function getLoadingWrapper(thisArg) {
  return _loadingWrapper.get(thisArg);
}

/**
 * @param {HTMLElement} element App State Element
 * @param {this} thisArg
 */
export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

/**
 * @param {this} thisArg
 * @returns {HTMLElement} App State Element
 */
export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description App State를 비활성화 시킵니다.
 * @param {this} thisArg
 */
export function hideAppState(thisArg) {
  _element.get(thisArg).classList.remove(ACTIVE_POPUP_CLASS);
  _modalWrapper.get(thisArg).classList.remove(ACTIVE_POPUP_CLASS);
  _loadingWrapper.get(thisArg).classList.remove(ACTIVE_POPUP_CLASS);
}

/**
 * @description 주어진 텍스트와 온클릭 함수를 가지고 기본적인 모달을 생성합니다.
 * @param {string} text 모달 텍스트
 * @param {() => void} onClick 모달 버튼의 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function showModalBasic(text, onClick, thisArg) {
  // App State기 비활성화 상태이면 활성화 시켜줍니다.
  if (!_state.get(thisArg)) {
    _element.get(thisArg).classList.add(ACTIVE_POPUP_CLASS);
    _state.set(thisArg, true);
  }

  // Lodaing을 숨기고 Modal을 보여줍니다.
  _modalWrapper.get(thisArg).classList.add(ACTIVE_POPUP_CLASS);
  _loadingWrapper.get(thisArg).classList.remove(ACTIVE_POPUP_CLASS);

  _modalText.get(thisArg).innerHTML = text;

  // 기존 이벤트 리스너를 제거하고, 새로운 온클릭 리스너를 저장합니다.
  _modalBtn.get(thisArg).removeEventListener('click', _onClick.get(thisArg));
  _onClick.set(thisArg, () => {
    onClick();
    hideAppState(thisArg);
  });

  _modalBtn.get(thisArg).addEventListener('click', _onClick.get(thisArg));
}

/**
 * @description Modal Component에 Link 기능을 추가합니다.
 * @param {string} text Link가 걸릴 텍스트
 * @param {string} url Link가 걸릴 URL
 * @param {this} thisArg
 */
export function showModalLink(text, url, thisArg) {
  const link = _modalLink.get(thisArg);

  link.innerHTML = text;

  // 기존 이벤트 리스너를 제거하고, 새로운 온클릭 리스너를 저장합니다.
  link.removeEventListener('click', _onLinkClick.get(thisArg));
  _onLinkClick.set(thisArg, () => {
    if (url) window.open(url);
    setTimeout(() => _onClick.get(thisArg)(), 0);
  });

  link.addEventListener('click', _onLinkClick.get(thisArg));
}

/**
 * @description Modal Component에 Sub Button을 추가합니다.
 * @param {string} text 서브 버튼 텍스트
 * @param {() => void} onClick 모달 버튼의 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function showModalSubBtn(text, onClick, thisArg) {
  const sub = _modalSubBtn.get(thisArg);

  if (!text) _modalSubBtn.get(thisArg).style.display = 'none';
  else _modalSubBtn.get(thisArg).style.display = null;
  sub.innerHTML = text;

  // 기존 이벤트 리스너를 제거하고, 새로운 온클릭 리스너를 저장합니다.
  sub.removeEventListener('click', _onSubClick.get(thisArg));
  _onSubClick.set(thisArg, () => {
    onClick();
    hideAppState(thisArg);
  });

  sub.addEventListener('click', _onSubClick.get(thisArg));
}

/**
 * @description Loading Component를 생성합니다.
 * @param {this} thisArg
 */
export function showLoading(thisArg) {
  // App State기 비활성화 상태이면 활성화 시켜줍니다.
  if (!_state.get(thisArg)) {
    _element.get(thisArg).classList.add(ACTIVE_POPUP_CLASS);
    _state.set(thisArg, true);
  }

  // Modal을 숨기고 Loading을 보여줍니다.
  _loadingWrapper.get(thisArg).classList.add(ACTIVE_POPUP_CLASS);
  _modalWrapper.get(thisArg).classList.remove(ACTIVE_POPUP_CLASS);
}

/**
 * @description App State에서 사용할 Proerty를 초기화합니다.
 * @param {this} thisArg
 */
function initVariable(thisArg) {
  _state.set(thisArg, false);
  _onClick.set(thisArg, () => {});
  _onSubClick.set(thisArg, () => {});
  _onLinkClick.set(thisArg, () => {});
}

/**
 * @description Modal 컴포넌트를 생성합니다.
 * @param {this} thisArg
 */
function initModalComp(thisArg) {
  const modalText = createElement('p', {
    class: 'modal-text font-text-body1 font-color-dark',
  });
  const modalBtn = createElement('button', {
    class: 'modal-btn font-text-body1 font-color-dark font-medium',
    child: '확인',
  });
  const modalSubBtn = createElement('button', {
    class: 'modal-sub-btn font-text-body1 font-color-dark',
  });
  const modalLink = createElement('p', {
    class: 'modal-text font-text-body1 font-color-dark font-link',
    child: undefined,
  });

  modalBtn.addEventListener('click', _onClick.get(this));
  modalSubBtn.addEventListener('click', _onSubClick.get(this));
  modalLink.addEventListener('click', _onLinkClick.get(this));

  _modalText.set(thisArg, modalText);
  _modalBtn.set(thisArg, modalBtn);
  _modalSubBtn.set(thisArg, modalSubBtn);
  _modalLink.set(thisArg, modalLink);

  const modalBtnWrapper = createElement('div', {
    class: 'modal-btn-wrapper',
    child: [modalSubBtn, modalBtn],
  });
  const modal = createElement('div', {
    class: `btn-modal ${isIOS() ? 'ios' : ''}`,
    child: [modalText, modalLink, modalBtnWrapper],
  });
  const modalWrapper = createElement('div', {
    class: 'app-state-wrapper modal-wrapper',
    child: modal,
  });

  _modalWrapper.set(thisArg, modalWrapper);
}

/**
 * @description Loading 컴포넌트를 생성합니다.
 * @param {this} thisArg
 */
function initLoadingComp(thisArg) {
  const loadingWings = [...Array(8)].map(() => document.createElement('div'));
  const loadingWingWrapper = createElement('div', {
    class: 'ldio-s5ugu8dwj4l',
    child: loadingWings,
  });
  const loading = createElement('div', {
    class: 'loadingio-spinner-spinner-bv4ofojvnw',
    child: loadingWingWrapper,
  });
  const loadingWrapper = createElement('div', {
    class: 'app-state-wrapper loading-wrapper',
    child: loading,
  });

  _loadingWrapper.set(thisArg, loadingWrapper);
}

/**
 * @description App State Element를 생성합니다.
 * @param {this} thisArg
 */
function initElement(thisArg) {
  const element = createElement('div', {
    class: 'app-state-container',
    child: [_loadingWrapper.get(thisArg), _modalWrapper.get(thisArg)],
  });

  _element.set(thisArg, element);
}

/**
 * @description App State Component를 생성합니다.
 * @param {HTMLElement} loading Loading Component
 * @param {HTMLElement} modal Modal Component
 * @param {this} thisArg
 */
export function createAppState(thisArg) {
  initVariable(thisArg);
  initModalComp(thisArg);
  initLoadingComp(thisArg);
  initElement(thisArg);
}
