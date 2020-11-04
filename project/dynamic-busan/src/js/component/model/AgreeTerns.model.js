import { createElement } from '../../util/dom';
import { checkIcon, moreRight, checkCircle } from '../Icon';

const ACTIVE_TERM_CLASS = 'active';

const _count = new WeakMap();
const _size = new WeakMap();
const _onClick = new WeakMap();
const _onDetail = new WeakMap();

const _agreeAllBtn = new WeakMap();
const _termWrapper = new WeakMap();
const _element = new WeakMap();

/**
 * @param {number} count 동의한 약관 숫자
 * @param {this} thisArg
 */
export function setCount(count, thisArg) {
  _count.set(thisArg, count);
}

/**
 * @param {this} thisArg
 */
export function getCount(thisArg) {
  return _count.get(thisArg);
}

/**
 * @param {number} size 전체 약관 수
 * @param {this} thisArg
 */
export function setSize(size, thisArg) {
  _size.set(thisArg, size);
}

/**
 * @param {this} thisArg
 */
export function getSize(thisArg) {
  return _size.get(thisArg);
}

/**
 * @param {(isDone: boolean, index: number, item: HTMLElement) => void} onClick 야관 동의 클릭 콜백 함수
 * @param {this} thisArg
 */
export function setOnClick(onClick, thisArg) {
  _onClick.set(thisArg, onClick);
}

/**
 * @param {this} thisArg
 */
export function getOnClick(thisArg) {
  return _onClick.get(thisArg);
}

/**
 * @param {(index: number, item: HTMLElement) => void} onDetail 상세 보기 클릭 콜백 함수
 * @param {this} thisArg
 */
export function setOnDetail(onDetail, thisArg) {
  _onDetail.set(thisArg, onDetail);
}

/**
 * @param {this} thisArg
 */
export function getOnDetail(thisArg) {
  return _onDetail.get(thisArg);
}

/**
 * @param {HTMLElement} agreeAllBtn 전체 동의 버튼 Element
 * @param {this} thisArg
 */
export function setAgreeAllBtn(agreeAllBtn, thisArg) {
  _agreeAllBtn.set(thisArg, agreeAllBtn);
}

/**
 * @param {this} thisArg
 */
export function getAgreeAllBtn(thisArg) {
  return _agreeAllBtn.get(thisArg);
}

/**
 * @param {HTMLElement} termWrapper 약관 Element를 감싼 Wrapper Element
 * @param {this} thisArg
 */
export function setTermWrapper(termWrapper, thisArg) {
  _termWrapper.set(thisArg, termWrapper);
}

/**
 * @param {this} thisArg
 */
export function getTermWrapper(thisArg) {
  return _termWrapper.get(thisArg);
}

/**
 * @param {HTMLElement} element AgreeTerms Element
 * @param {this} thisArg
 */
export function setElement(element, thisArg) {
  return _element.set(thisArg, element);
}

/**
 * @param {this} thisArg
 */
export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description 전체 동의 여부를 반환합니다.
 * @param {this} thisArg
 * @returns {boolean}
 */
export function isDone(thisArg) {
  return _count.get(thisArg) === _size.get(thisArg);
}

/**
 * @description 각 약관을 동의 했는지 여부를 배열로 반환합니다.
 * @param {this} thisArg
 * @return {boolean[]}
 */
export function getIsSelectedArr(thisArg) {
  return [].map.call(_termWrapper.get(thisArg).childNodes, (termElement) =>
    termElement.classList.contains(ACTIVE_TERM_CLASS),
  );
}

/**
 * @description 전체 동의 버튼 스타일을 변경합니다.
 * @param {this} thisArg
 */
export function changeAgreeAllBtnStyle(thisArg) {
  const btn = _agreeAllBtn.get(thisArg);
  const done = isDone(thisArg);
  const active = btn.classList.contains(ACTIVE_TERM_CLASS);

  if (done && !active) btn.classList.add(ACTIVE_TERM_CLASS);
  else if (!done && active) btn.classList.remove(ACTIVE_TERM_CLASS);
}

/**
 * @description 모든 약관을 동의합니다.
 * @param {this} thisArg
 */
export function agreeAll(thisArg) {
  _count.set(thisArg, _size.get(thisArg));

  if (!_agreeAllBtn.get(thisArg).classList.contains(ACTIVE_TERM_CLASS)) {
    _agreeAllBtn.get(thisArg).classList.add(ACTIVE_TERM_CLASS);
  }

  [].forEach.call(_termWrapper.get(thisArg).childNodes, (termElement) => {
    if (!termElement.classList.contains(ACTIVE_TERM_CLASS)) {
      termElement.classList.add(ACTIVE_TERM_CLASS);
    }
  });
}

/**
 * @description 모든 약관을 비동의합니다.
 * @param {this} thisArg
 */
export function disagreeAll(thisArg) {
  _count.set(thisArg, 0);

  if (_agreeAllBtn.get(thisArg).classList.contains(ACTIVE_TERM_CLASS)) {
    _agreeAllBtn.get(thisArg).classList.remove(ACTIVE_TERM_CLASS);
  }

  [].forEach.call(_termWrapper.get(thisArg).childNodes, (termElement) => {
    if (termElement.classList.contains(ACTIVE_TERM_CLASS)) {
      termElement.classList.remove(ACTIVE_TERM_CLASS);
    }
  });
}

/**
 * @description 현재 동의 상태에 맞게 전체를 한번에 변경합니다.
 * @param {this} thisArg
 */
export function changeAll(thisArg) {
  if (isDone(thisArg)) disagreeAll(thisArg);
  else agreeAll(thisArg);
}

/**
 * @description 전달받은 index에 해당하는 약관을 동의합니다.
 * @param {number} index 동의할 약관의 인덱스
 * @param {this} thisArg
 */
export function clickWithIdnex(index, thisArg) {
  const event = new Event('click');
  const termElement = _termWrapper.get(thisArg).children[index];
  const checkElement = termElement.getElementsByClassName(
    'agree-terms-item-check',
  )[0];
  checkElement.dispatchEvent(event);
}

/**
 * @description 새 이용약관 Comnponent를 생성합니다.
 * @param {string} term 추가할 이용 약관
 * @returns {HTMLElement[]} checkIconElement, detialWrapper, container
 */
function createTermItem(term) {
  const checkIconElement = checkIcon(20, '#cccccc');
  checkIconElement.setAttribute('class', 'agree-terms-item-check');

  const termElement = createElement('p', {
    class: 'font-text-body2 font-color-regular',
    child: term,
  });
  const moreIconElement = moreRight(12, '#A3A3A3');
  const detialWrapper = createElement('div', {
    class: 'row-center agree-terms-item-detail',
    child: [termElement, moreIconElement],
  });

  const container = createElement('div', {
    class: 'row-center agree-terms-item',
    child: [checkIconElement, detialWrapper],
  });

  return [checkIconElement, detialWrapper, container];
}

/**
 * @description 약관 아이템에 동의 이벤트를 추가합니다.
 * @param {HTMLElement} checkIconElement 체크 아이콘 Element
 * @param {HTMLElement} container 약관 Item
 * @param {number} index 햔제 약관의 index
 * @param {this} thisArg
 */
function setCheckIconOnClick(checkIconElement, container, index, thisArg) {
  checkIconElement.addEventListener('click', () => {
    const count = _count.get(thisArg);

    // 동의한 상태의 약관이면 동의를 헤지합니다.
    if (container.classList.contains(ACTIVE_TERM_CLASS)) {
      container.classList.remove(ACTIVE_TERM_CLASS);
      _count.set(thisArg, count - 1);
    }
    // 동의하지 않은 약관이면 동의합니다.
    else {
      container.classList.add(ACTIVE_TERM_CLASS);
      _count.set(thisArg, count + 1);
    }

    // 모두 동의한 상태이면 전체 동의 버튼 스타일을 변경합니다.
    changeAgreeAllBtnStyle(thisArg);
    _onClick.get(thisArg)(isDone(thisArg), index, container);
  });
}

/**
 * @description 약관 아이템에 상세 정보 이벤트를 추가합니다.
 * @param {HTMLElement} detialWrapper 상세정보 Element
 * @param {HTMLElement} container 약관 Item
 * @param {number} index 햔제 약관의 index
 * @param {this} thisArg
 */
function setDetailOnClick(detialWrapper, container, index, thisArg) {
  detialWrapper.addEventListener('click', () => {
    _onDetail.get(thisArg)(index, container);
  });
}

/**
 * @description 이용약관 리스트에 새 이용약관을 추가합니다.
 * @param {string} term 추가할 이용 약관
 * @param {this} thisArg
 */
export function addTerm(term, thisArg) {
  const curSize = _size.get(thisArg);
  const [checkIconElement, detialWrapper, container] = createTermItem(term);

  setCheckIconOnClick(checkIconElement, container, curSize, thisArg);
  setDetailOnClick(detialWrapper, container, curSize, thisArg);

  _termWrapper.get(thisArg).appendChild(container);
  _size.set(thisArg, curSize + 1);
}

/**
 * @description AgreeTerms에서 사용할 Proerty를 초기화합니다.
 * @param {(isDone: boolean, index: number, item: HTMLElement) => void} onClick 야관 동의 클릭 콜백 함수
 * @param {(index: number, item: HTMLElement) => void} onDetail 상세 보기 클릭 콜백 함수
 * @param {this} thisArg
 */
function initVariable(onClick, onDetail, thisArg) {
  _count.set(thisArg, 0);
  _size.set(thisArg, 0);
  _onClick.set(thisArg, onClick);
  _onDetail.set(thisArg, onDetail);
}

/**
 * @description 전체 동의 버튼을 생성합니다.
 * @param {this} thisArg
 */
function initAgreeAllBtn(thisArg) {
  const icon = checkCircle(24, '#cccccc');
  const text = createElement('p', {
    class: 'font-text-body1 font-bold font-color-dark',
    child: '전체 동의',
  });
  const agreeAllBtn = createElement('div', {
    class: 'agree-all-btn',
    child: [icon, text],
  });

  agreeAllBtn.addEventListener('click', () => {
    changeAll(thisArg);
    _onClick.get(thisArg)(isDone(thisArg));
  });

  _agreeAllBtn.set(thisArg, agreeAllBtn);
}

/**
 * @description AgreeTerms Element를 생성합니다.
 * @param {string} title AgreeTerms Title
 * @param {this} thisArg
 */
function initElement(title, thisArg) {
  const termsWrapper = createElement('div', {
    class: 'wrapper agree-terms-list',
  });
  const titleElement = createElement('p', {
    class: 'font-text-body1 font-color-dark agree-terms-title',
    child: title,
  });
  const element = createElement('div', {
    class: 'container agree-terms',
    child: [titleElement, _agreeAllBtn.get(thisArg), termsWrapper],
  });

  _termWrapper.set(thisArg, termsWrapper);
  _element.set(thisArg, element);
}

/**
 * @description AgreeTerms Component를 생성합니다.
 * @param {string} title AgreeTerms Title
 * @param {(isDone: boolean, index: number, item: HTMLElement) => void} onClick
 * @param {(index: number, item: HTMLElement) => void} onDetail
 * @param {this} thisArg
 */
export function createAgreeTerms(title, onClick, onDetail, thisArg) {
  initVariable(onClick, onDetail, thisArg);
  initAgreeAllBtn(thisArg);
  initElement(title, thisArg);
}
