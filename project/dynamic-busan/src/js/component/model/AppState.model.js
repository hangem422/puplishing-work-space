import { createElement } from '../../util/dom';
import { isIOS } from '../../util/os';

const ACTIVE_POPUP_CLASS = 'active';

/**
 * @description Lodaing 혹은 Modal이 활성화 상태인지 여부
 * @type {WeakMap<object, boolean>}
 */
const _state = new WeakMap();

/**
 * @description 모달 버튼의 온 클릭 이벤트 콜백함수
 * @type {WeakMap<object, () => void>}
 */
const _onClick = new WeakMap();

/**
 * @description 모달 보조 버튼 온 클릭 이벤트 콜백함수
 * @type {WeakMap<object, () => void>}
 */
const _onSubClick = new WeakMap();

/**
 * @description 모달 링크 택스트 온 클릭 이벤트 콜백함수
 * @type {WeakMap<object, () => void>}
 */
const _onLinkClick = new WeakMap();

/**
 * @description 모달 택스트
 * @type {WeakMap<object, string>}
 */
const _modalText = new WeakMap();

/**
 * @description 모달 메인 버튼 Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _modalBtn = new WeakMap();

/**
 * @description 모달 보조 버튼 Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _modalSubBtn = new WeakMap();

/**
 * @description 모달 링크 Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _modalLink = new WeakMap();

/**
 * @description 모달 Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _modalWrapper = new WeakMap();

/**
 * @description 로딩 Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _loadingWrapper = new WeakMap();

/**
 * @description App State Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _element = new WeakMap();

export function setState(state, thisArg) {
  _state.set(thisArg, state);
}

export function getState(thisArg) {
  return _state.get(thisArg);
}

export function setOnClick(onClick, thisArg) {
  _onClick.set(thisArg, () => {
    onClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

export function getOnClick(thisArg) {
  return _onClick.get(thisArg);
}

export function setOnSubClick(onSubClick, thisArg) {
  _onSubClick.set(thisArg, () => {
    onSubClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

export function getOnSubClick(thisArg) {
  return _onSubClick.get(thisArg);
}

export function setOnLinkClick(onLinkClick, thisArg) {
  _onLinkClick.set(thisArg, () => {
    onLinkClick();
    // eslint-disable-next-line no-use-before-define
    hideAppState(thisArg);
  });
}

export function getOnLinkClick(thisArg) {
  return _onLinkClick.get(thisArg);
}

export function setModalText(modalText, thisArg) {
  _modalText.set(thisArg, modalText);
}

export function getModalText(thisArg) {
  return _modalText.get(thisArg);
}

export function setModalBtn(modalBtn, thisArg) {
  _modalBtn.set(thisArg, modalBtn);
}

export function getModalBtn(thisArg) {
  return _modalBtn.get(thisArg);
}

export function setModalSubBtn(modalSubBtn, thisArg) {
  _modalSubBtn.set(thisArg, modalSubBtn);
}

export function getModalSubBtn(thisArg) {
  return _modalSubBtn.get(thisArg);
}

export function setModalLink(modalLink, thisArg) {
  _modalLink.set(thisArg, modalLink);
}

export function getModalLink(thisArg) {
  return _modalLink.get(thisArg);
}

export function setModalWrapper(modalWrapper, thisArg) {
  _modalWrapper.set(thisArg, modalWrapper);
}

export function getModalWrapper(thisArg) {
  return _modalWrapper.get(thisArg);
}

export function setLoadingWrapper(loadingWrapper, thisArg) {
  _loadingWrapper.set(thisArg, loadingWrapper);
}

export function getLoadingWrapper(thisArg) {
  return _loadingWrapper.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description App State를 비활성화 시킵니다.
 * @param {this} thisArg
 */
export function hideAppState(thisArg) {
  const element = _element.get(thisArg);
  const modalWrapper = _modalWrapper.get(thisArg);
  const loadingWrapper = _loadingWrapper.get(thisArg);

  element.classList.remove(ACTIVE_POPUP_CLASS);
  modalWrapper.classList.remove(ACTIVE_POPUP_CLASS);
  loadingWrapper.classList.remove(ACTIVE_POPUP_CLASS);
}

/**
 * @description 주어진 텍스트와 온클릭 함수를 가지고 기본적인 모달을 생성합니다.
 * @param {string} text 모달 텍스트
 * @param {() => void} onClick 모달 버튼의 온 클릭 이벤트 콜백함수
 * @param {this} thisArg
 */
export function showModalBasic(text, onClick, thisArg) {
  const state = _state.get(thisArg);
  const element = _element.get(thisArg);
  const modalWrapper = _modalWrapper.get(thisArg);
  const loadingWrapper = _loadingWrapper.get(thisArg);
  const modalText = _modalText.get(thisArg);
  const modalBtn = _modalBtn.get(thisArg);

  // App State기 비활성화 상태이면 활성화 시켜줍니다.
  if (!state) {
    element.classList.add(ACTIVE_POPUP_CLASS);
    _state.set(thisArg, true);
  }

  // Lodaing을 숨기고 Modal을 보여줍니다.
  modalWrapper.classList.add(ACTIVE_POPUP_CLASS);
  loadingWrapper.classList.remove(ACTIVE_POPUP_CLASS);

  modalText.innerHTML = text;

  // 기존 이벤트 리스너를 제거하고, 새로운 온클릭 리스너를 저장합니다.
  modalBtn.removeEventListener('click', _onClick.get(thisArg));
  _onClick.set(thisArg, () => {
    onClick();
    hideAppState(thisArg);
  });

  modalBtn.addEventListener('click', _onClick.get(thisArg));
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
  const modalSubBtn = _modalSubBtn.get(thisArg);

  if (!text) _modalSubBtn.get(thisArg).style.display = 'none';
  else _modalSubBtn.get(thisArg).style.display = null;
  modalSubBtn.innerHTML = text;

  // 기존 이벤트 리스너를 제거하고, 새로운 온클릭 리스너를 저장합니다.
  modalSubBtn.removeEventListener('click', _onSubClick.get(thisArg));
  _onSubClick.set(thisArg, () => {
    onClick();
    hideAppState(thisArg);
  });

  modalSubBtn.addEventListener('click', _onSubClick.get(thisArg));
}

/**
 * @description Loading Component를 생성합니다.
 * @param {this} thisArg
 */
export function showLoading(thisArg) {
  const state = _state.get(thisArg);
  const element = _element.get(thisArg);
  const loadingWrapper = _loadingWrapper.get(thisArg);
  const modalWrapper = _modalWrapper.get(thisArg);

  // App State기 비활성화 상태이면 활성화 시켜줍니다.
  if (!state) {
    element.classList.add(ACTIVE_POPUP_CLASS);
    _state.set(thisArg, true);
  }

  // Modal을 숨기고 Loading을 보여줍니다.
  loadingWrapper.classList.add(ACTIVE_POPUP_CLASS);
  modalWrapper.classList.remove(ACTIVE_POPUP_CLASS);
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
