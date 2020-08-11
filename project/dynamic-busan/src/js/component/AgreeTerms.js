import { createElement } from '../util/dom';
import { checkIcon, moreRight, checkCircle } from './Icon';

const ACTIVE_TERM_CLASS = 'active';

/**
 * @description 전체 동의 버튼을 생성합니다.
 * @returns {HTMLElement} 전체 동의 버튼
 */
function createAgreeAllBtn() {
  const icon = checkCircle(24, '#cccccc');
  const text = createElement('p', {
    class: 'font-text-body1 font-bold font-color-dark',
    child: '전체 동의',
  });
  return createElement('div', {
    class: 'agree-all-btn',
    child: [icon, text],
  });
}

/**
 * @description 약관 동의 컴포넌트입니다.
 * @property {number} count 현재 동의한 약관의 수
 * @property {number} size 전체 약관의 수
 * @property {(index: number, item: HTMLElement) => void} onClick 약관 상세보기 온 클릭 이벤트 콜백
 * @property {HTMLLIElement} agreeAllBtn 약관 전체 동의 버튼
 * @property {HTMLLIElement} termsWrapper 약관들을 감싸고있는 container element
 * @property {HTMLLIElement} element List Board Element
 * @property {boolean} isDone 전체 동의 여부 (GET ONLY)
 */
class AgreeTerms {
  /**
   * @description AgerrTerms의 생성자
   * @param {string[]} terms 약관 제목 리스트
   * @param {{ 
      title?: string,
      onClick?: (isDone: boolean, index: number, item: HTMLElement) => void,
      onDetail?: (index: number, item: HTMLElement) => void
    }} options AgerrTerms의 옵션 객체
   */
  constructor(terms = [], options = {}) {
    this.count = 0;
    this.size = 0;
    this.onClick = options.onClick || function () {};
    this.onDetail = options.onDetail || function () {};

    // 전체 동의 번튼을 생성합니다.
    this.agreeAllBtn = createAgreeAllBtn();
    this.agreeAllBtn.addEventListener('click', () => {
      this.changeAll();
      this.onClick(this.isDone);
    });
    // 약관들을 감싸고있는 container element를 생성합니다.
    this.termsWrapper = createElement('div', {
      class: 'wrapper agree-terms-list',
    });

    const titleElement = createElement('p', {
      class: 'font-text-body1 font-color-dark agree-terms-title',
      child: options.title || '',
    });
    this.element = createElement('div', {
      class: 'container agree-terms',
      child: [titleElement, this.agreeAllBtn, this.termsWrapper],
    });
    this.render(terms);
  }

  /**
   * @description 모두 동의했는지 여부를 반환합니다.
   * @returns {boolean} 전체 동의 여부
   */
  get isDone() {
    return this.count === this.size;
  }

  /**
   * @description 전체 동의 버튼 스타일을 변경합니다.
   */
  changeAgreeAllBtnStyle() {
    const isAcitve = this.agreeAllBtn.classList.contains(ACTIVE_TERM_CLASS);
    if (this.isDone && !isAcitve) {
      this.agreeAllBtn.classList.add(ACTIVE_TERM_CLASS);
    } else if (!this.isDone && isAcitve) {
      this.agreeAllBtn.classList.remove(ACTIVE_TERM_CLASS);
    }
  }

  /**
   * @description 모든 약관을 동의합니다.
   */
  agreeAll() {
    this.count = this.size;
    // 전체 동의 버튼 스타일을 변경합니다.
    if (!this.agreeAllBtn.classList.contains(ACTIVE_TERM_CLASS)) {
      this.agreeAllBtn.classList.add(ACTIVE_TERM_CLASS);
    }

    Array.from(this.termsWrapper.childNodes).forEach((termElement) => {
      if (!termElement.classList.contains(ACTIVE_TERM_CLASS)) {
        termElement.classList.add(ACTIVE_TERM_CLASS);
      }
    });
  }

  /**
   * @description 모든 약관을 비동의합니다.
   */
  disagreeAll() {
    this.count = 0;
    // 전체 동의 버튼 스타일을 변경합니다.
    if (this.agreeAllBtn.classList.contains(ACTIVE_TERM_CLASS)) {
      this.agreeAllBtn.classList.remove(ACTIVE_TERM_CLASS);
    }

    Array.from(this.termsWrapper.childNodes).forEach((termElement) => {
      if (termElement.classList.contains(ACTIVE_TERM_CLASS)) {
        termElement.classList.remove(ACTIVE_TERM_CLASS);
      }
    });
  }

  /**
   * @description 현재 동의 상태에 맞게 전체를 한번에 변경합니다.
   */
  changeAll() {
    if (this.isDone) this.disagreeAll();
    else this.agreeAll();
  }

  /**
   * @description 이용약관 리스트에 새 이용약관을 추가합니다.
   * @param {string} term 추가할 이용 약관
   */
  addTerm(term) {
    // List Item에 들어갈 내부 구성 요소들을 만듭니다.
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

    // 약관 동의 / 비동의 온클릭 이벤트 추가
    const index = this.termsWrapper.childElementCount;
    checkIconElement.addEventListener('click', () => {
      // 동의한 상태의 약관이면 동의를 헤지합니다.
      if (container.classList.contains(ACTIVE_TERM_CLASS)) {
        container.classList.remove(ACTIVE_TERM_CLASS);
        this.count -= 1;
      }
      // 동의하지 않은 약관이면 동의합니다.
      else {
        container.classList.add(ACTIVE_TERM_CLASS);
        this.count += 1;
      }
      // 모두 동의한 상태이면 전체 동의 버튼 스타일을 변경합니다.
      this.changeAgreeAllBtnStyle();
      this.onClick(this.isDone, index, container);
    });

    // 상세보기 온클릭 이벤트 추가
    detialWrapper.addEventListener('click', () => {
      this.onDetail(index, container);
    });

    this.termsWrapper.appendChild(container);
    this.size += 1;
  }

  /**
   * @description 이용약관 리스트를 초기화합니다.
   * @param {string[]} terms 이용약관 문자열 리스트
   */
  render(terms) {
    this.termsWrapper.innerHTML = '';
    terms.forEach((term) => this.addTerm(term));
  }
}

export default AgreeTerms;
