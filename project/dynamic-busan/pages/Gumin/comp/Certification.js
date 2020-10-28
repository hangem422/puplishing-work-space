import { createElement, wrapping } from '../../../src/js/util/dom';
import SecretTextfield from '../../../src/js/component/SecretTextfield';

/* ------------- */
/*  Config Data  */
/* ------------- */

const CERTIFICATION_TITLE = '주민등록번호를 이용해 인증을 해주세요.';
const CERTIFICATION_LABEL = '주민등록번호 뒷자리(7자리 숫자)';
const CERTIFICATION_PLACEHOLDER = '주민등록번호 뒷자리 숫자를 입력하세요.';
const CERTIFICATION_DESCRIPTION =
  '입력하신 개인정보는 인증서 발급을 위해 사용되며, 다른 목적으로 사용되지 않습니다.';
const SECRET_INPUT_LENGTH = 7;

const INVALID_RRN_MESSAGE =
  '입력하신 주민등록번호가 일치하지 않습니다.\n다시 시도해주세요';

/**
 * @description 주민번호 인증 페이지를 생성합니다.
 * @param {(rrn: string, lastChance: boolean) => Promise<bolean>} submitFunc 주민번호 제출 버튼 이벤트 콜백 함수
 * @returns {[HTMLElement, () => void]} 주민번호 인증 페이지와 초기화 함수
 */
function createCertificationPage(submitFunc) {
  let rrnInvalidCount = 0; // 주민 번호 오류 횟수

  /* ------------ */
  /*  Create View */
  /* ------------ */

  const titleElement = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: CERTIFICATION_TITLE,
  });
  const submitElement = createElement('button', {
    class: 'button button-type-a',
    child: '인증하기',
    disabled: 'disabled',
  });
  const secretTextfield = new SecretTextfield({
    separatorClass: 'resident-registration-number',
    max: SECRET_INPUT_LENGTH,
    type: 'number',
    placeholder: CERTIFICATION_PLACEHOLDER,
    label: CERTIFICATION_LABEL,
    validateCharFunc: (char) => /[0-9]/.test(char),
    validateStringFunc: (str) => /^[0-9]{7}$/.test(str),
  });
  const descElement = createElement('p', {
    class: 'font-text-body2 font-color-regular resident-description',
    child: CERTIFICATION_DESCRIPTION,
  });

  // Layout을 구성합니다.
  const titleContainer = wrapping('certification-title', titleElement);
  const submitContainer = wrapping('certification-submit', submitElement);
  const secretTextfieldContainer = wrapping('certification-input', [
    secretTextfield.element,
    descElement,
  ]);
  const certificationPage = createElement('div', {
    class: 'certification-page',
    child: [titleContainer, secretTextfieldContainer, submitContainer],
  });

  /* -------------- */
  /*  Event Helper  */
  /* -------------- */

  /**
   * @description 약관을 전부 동의하지 않으면 확인 버튼을 누를 수 없습니다.
   * @param {boolean} isDone 약관 전체를 동의 했는지 여부
   */
  function setSubmitBtnActive(_, validate) {
    if (validate) submitElement.removeAttribute('disabled');
    else submitElement.setAttribute('disabled', 'disabled');
  }

  /**
   * @description 인증 페이지 초기화
   */
  function initPage() {
    secretTextfield.deleteAll();
    submitElement.setAttribute('disabled', 'disabled');
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */
  secretTextfield.onChangeFunc = setSubmitBtnActive;

  submitElement.addEventListener('click', () => {
    submitFunc(secretTextfield.text, rrnInvalidCount >= 4).then((result) => {
      if (!result) {
        rrnInvalidCount += 1;
        secretTextfield.deleteAll();
        secretTextfield.error(`${INVALID_RRN_MESSAGE} (${rrnInvalidCount}/5)`);
      }
    });
  });

  return [certificationPage, initPage];
}

export default createCertificationPage;
