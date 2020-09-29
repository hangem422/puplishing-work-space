import AgreeTerms from '../../../src/js/component/AgreeTerms';
import { createElement, wrapping } from '../../../src/js/util/dom';

/* ------------- */
/*  Config Data  */
/* ------------- */

const TERM_OF_USE_TITLE =
  '모바일 가족사랑 카드를 발급하기 위해 약관을 확인해주세요.';

/**
 * @description 약관 동의 페이지를 생성합니다.
 * @typedef {object} options
 * @property {(index: number, item: HTMLElement) => void} onDetailFunc 약관 상세보기 이벤트 콜백 함수
 * @property {() => void} submitFunc 약관 동의 제출 이벤트 콜백 함수
 * @property {(val: any) => void} saveLocalStorage value를 local storage에 저장하는 함수
 * @property {boolean[]} initAgreeVal 약관 동의 초기 값
 * @param {string[]} titles 약관 제목 리스트
 * @param {options} options option 값
 * @returns {[HTMLElement, () => void]}  약관 동의 페이지와 초기화 함수
 */
function createAgreePage(titles, options) {
  const onDetailFunc = options.onDetailFunc || function () {};
  const submitFunc = options.submitFunc || function () {};
  const saveLocalStorage = options.saveLocalStorage || function () {};
  const initAgreeVal = options.initAgreeVal || [];

  /* ------------ */
  /*  Create View */
  /* ------------ */

  // 약관 동의 버튼을 생성합니다.
  const agreeTerms = new AgreeTerms(titles, { title: TERM_OF_USE_TITLE });

  // 확인 버튼을 생성합니다.
  const submitElement = createElement('button', {
    class: 'button button-type-a',
    child: '확인',
    disabled: 'disabled',
  });

  // Layout을 구성합니다.
  const submitContainer = wrapping('agree-terms-submit', submitElement);
  const agreeTermsPage = createElement('div', {
    class: 'agree-terms-page',
    child: [agreeTerms.element, submitContainer],
  });

  /* -------------- */
  /*  Event Helper  */
  /* -------------- */

  /**
   * @description 약관을 전부 동의하지 않으면 확인 버튼을 누를 수 없습니다.
   * @param {boolean} isDone 약관 전체를 동의 했는지 여부
   */
  function setSubmitBtnActive(isDone) {
    if (isDone) submitElement.removeAttribute('disabled');
    else submitElement.setAttribute('disabled', 'disabled');
  }

  /**
   * @description 인증 페이지 초기화
   */
  function initPage() {
    agreeTerms.disagreeAll();
    submitElement.setAttribute('disabled', 'disabled');
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */

  submitElement.addEventListener('click', submitFunc);
  agreeTerms.onClick = setSubmitBtnActive;
  agreeTerms.onDetail = function (index) {
    saveLocalStorage(agreeTerms.json);
    onDetailFunc(index);
  };

  /* ----------- */
  /*  Init Page  */
  /* ----------- */

  initAgreeVal.forEach((val, index) => {
    if (val) agreeTerms.clickWithIndex(index);
  });

  return [agreeTermsPage, initPage];
}

export default createAgreePage;
