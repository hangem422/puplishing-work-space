import * as model from './model/AgreeTerns.model';

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
export default class AgreeTerms {
  /**
   * @param {string[]} terms 약관 제목 리스트
   * @param {{ 
      title?: string,
      onClick?: (isDone: boolean, index: number, item: HTMLElement) => void,
      onDetail?: (index: number, item: HTMLElement) => void
    }} options AgerrTerms의 옵션 객체
   */
  constructor(terms, options = {}) {
    model.createAgreeTerms(
      typeof options.title === 'string' ? options.title : '',
      typeof options.onClick === 'function' ? options.onClick : () => {},
      typeof options.onDetail === 'function' ? options.onDetail : () => {},
      this,
    );

    if (Array.isArray(terms)) {
      terms.forEach((term) => {
        model.addTerm(typeof term === 'string' ? term : '', this);
      });
    }
  }

  /**
   * @returns {number} 동의한 약관 개수
   */
  get count() {
    return model.getCount(this);
  }

  /**
   * @returns {number} 전체 약관 개수
   */
  get size() {
    return model.getSize(this);
  }

  /**
   * @returns {HTMLElement} AgreeTerms Element
   */
  get element() {
    return model.getElement(this);
  }

  /**
   * @returns {boolean} 전체 동의 여부
   */
  get isDone() {
    return model.isDone(this);
  }

  /**
   * @returns {boolean[]} 각 약관을 동의 했는지 여부를 배열로 반환
   */
  get json() {
    return model.getIsSelectedArr(this);
  }

  /**
   * @param {(isDone: boolean, index: number, item: HTMLElement) => void} onClick 야관 동의 클릭 콜백 함수
   */
  setOnClick(onClick) {
    if (typeof onClick === 'function') model.setOnClick(onClick, this);
  }

  /**
   * @param {(index: number, item: HTMLElement) => void} onDetail 상세 보기 클릭 콜백 함수
   */
  setOnDetail(onDetail) {
    if (typeof onDetail === 'function') model.setOnDetail(onDetail, this);
  }

  /**
   * @description 모든 약관을 동의합니다.
   */
  agreeAll() {
    model.agreeAll(this);
  }

  /**
   * @description 모든 약관을 비동의합니다.
   */
  disagreeAll() {
    model.disagreeAll(this);
  }

  /**
   * @description 현재 동의 상태에 맞게 전체를 한번에 변경합니다.
   */
  changeAll() {
    model.changeAll(this);
  }

  /**
   * @description 전달받은 index에 해당하는 약관을 동의합니다.
   * @param {number} index 동의할 약관의 인덱스
   */
  clickWithIndex(index) {
    if (typeof index === 'number' && index < model.getSize(this)) {
      model.clickWithIdnex(index, this);
    }
  }
}
