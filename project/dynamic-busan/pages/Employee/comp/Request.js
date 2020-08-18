import { createElement, wrapping } from '../../../src/js/util/dom';

/* ------------- */
/*  Config Data  */
/* ------------- */

const TITLE = '사원 정보를 입력 후 요청을 진행하세요.';

const INPUT_MIN_LENGTH = 2;
const INPUT_MAX_LENGTH = 12;

/**
 * @description 사원증 발급 페이지를 생성합니다.
 * @param {string[]} notice 유의 사항 문자열 리스트
 * @param {(department: string, position: string) => void} submitFunc 사원증 발급 요청
 * @returns {[HTMLElement, () => void]} 사원증 발급 페이지와 초기화 함수
 */
function createRequestPage(notice, submitFunc) {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  // 제목과 Submit 버튼을 생성
  const titleElement = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: TITLE,
  });
  const submitElement = createElement('button', {
    class: 'button button-type-a',
    child: '방문증 발급 요청하기',
    disabled: 'disabled',
  });

  // 근무부서 인풋을 생성합니다.
  const departInputLabel = createElement('label', {
    for: 'depart-input',
    child: '근무부서',
  });
  const departInput = createElement('input', {
    type: 'text',
    id: 'depart-input',
    maxlength: INPUT_MAX_LENGTH.toString(),
    placeholder: '방문 부서명을 입력하세요.',
  });
  const departElement = createElement('div', {
    class: 'textfield textfield-time',
    child: [departInputLabel, departInput],
  });

  // 작위 인풋을 생성합니다.
  const positionInputLabel = createElement('label', {
    for: 'position-input',
    child: '직위',
  });
  const positionInput = createElement('input', {
    type: 'text',
    id: 'position-input',
    maxlength: INPUT_MAX_LENGTH.toString(),
    placeholder: '담당자 이름을 입력하세요.',
  });
  const positionElement = createElement('div', {
    class: 'textfield textfield-time',
    child: [positionInputLabel, positionInput],
  });

  // 유의 사할을 생성합니다.
  const noticeTitle = createElement('p', {
    class: 'font-text-body2 font-medium font-color-dark',
    child: '유의 사항 안내',
  });
  const noticeList = createElement('ul', {
    class: 'font-text-body2 font-color-medium',
    child: notice.map((str) => createElement('li', { child: str })),
  });

  // Layout을 구성합니다.
  const titleContainer = wrapping('request-title', titleElement);
  const submitContainer = wrapping('request-submit', submitElement);
  const departContainer = wrapping('request-depart', departElement);
  const positionContainer = wrapping('request-position', positionElement);
  const noticeContainer = wrapping('request-notice', [noticeTitle, noticeList]);

  const requestPage = createElement('div', {
    class: 'reqeust-page',
    child: [
      titleContainer,
      departContainer,
      positionContainer,
      noticeContainer,
      submitContainer,
    ],
  });

  /* -------------- */
  /*  Event Helper  */
  /* -------------- */

  /**
   * @description 사원증 발급 요청하기 버튼 활성화 함수
   */
  function setActiveSubmitBtn() {
    function validValue(str) {
      return str.length >= INPUT_MIN_LENGTH && str.length <= INPUT_MAX_LENGTH;
    }
    if (
      validValue(departInput.value) && // 근무 부서가 올바른 포멧이여야 합니다.
      validValue(positionInput.value) // 직위가 올바른 포멧이여야 합니다.
    ) {
      submitElement.removeAttribute('disabled');
    } else {
      submitElement.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 사원증 발급 요청 페이지 초가화 함수
   */
  function initPage() {
    departInput.value = ''; // 근무 부서 인풋 초기화
    positionInput.value = ''; // 직위 인풋 초기화
    setActiveSubmitBtn(); // 사원증 발급 요청 버튼 초기화
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */

  departInput.addEventListener('keyup', setActiveSubmitBtn);
  positionInput.addEventListener('keyup', setActiveSubmitBtn);
  submitElement.addEventListener('click', () =>
    submitFunc(departInput.value, positionInput.value),
  );

  return [requestPage, initPage];
}

export default createRequestPage;
