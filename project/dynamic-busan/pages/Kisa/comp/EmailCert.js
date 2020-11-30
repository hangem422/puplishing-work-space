import { createElement, wrapping } from '../../../src/js/util/dom';
import { onlyNumLimitLength } from '../../../src/js/util/string';
import { isIOS } from '../../../src/js/util/os';

/* ------------- */
/*  Config Data  */
/* ------------- */

const TITLE = 'KISA계정 이메일로만 인증하실 수 있습니다.';

const EMAIL_TIMEOUT_ERROR =
  '인증번호 입력시간이 초과되었습니다.<br />인증번호 재요청 후 다시 시도해주세요.';
const INVALID_CERT_ERROR =
  '인증번호가 일치하지 않습니다.<br />확인 후 다시 시도해주세요';

const INVALID_CERT_MESSAGE =
  '인증번호가 일치하지 않습니다.\n확인 후 다시 시도해주세요';

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const CERT_NUM_REG = /^[0-9]{6}$/;

const EMAIL_SUFFIX = '%EMAIL_CERT_SUFFIX_KISA%';
const RE_CERT_EMAIL_TIME = 30 * 1000;
const CERT_LIMIT_TIME = 3 * 60 * 1000;
const CERT_NUM_LENGTH = 6;

/**
 * @description 이메일 인증 페이지를 만듭니다.
 * @param {(email: string) => Promise<boolean>} sendEmailCertFunc 이메일 주소로 인증 번호를 발송
 * @param {(cert: string, lastChance: boolean) => Promise<boolean>} submitFunc 인증번호를 API 서버로 제출
 * @param {(message: string) => void} modalFunc 이메일 인증 과정중에 Modal을 소환하는 함수
 * @param {(message: string) => void} errorFunc 이메일 인증 과정 실패시 프로세스를 종료하는 함수
 * @returns {[HTMLElement, () => void]} 이메일 인증 페이지와 초기화 함수
 */
function createEmailCertPage(sendEmailCertFunc, submitFunc, modalFunc) {
  let countEmailCertError = 0; // 이메일 인증 요청 검증 횟수
  let timeout = null; // 인증 번호 재용청 버튼 활성화 타이머
  let interval = null; // 인증 번호 제한 시간 체크 인터벌

  /* -------------- */
  /*  Util Function */
  /* -------------- */

  /**
   * @description 초 단위의 시간을 MM : SS 포멧 문자열로 변경합니다.
   * @param {number} _sec 변경할 초 단위의 시간
   * @returns {string} MM : SS 포멧 문자열
   */
  function secToString(_sec) {
    if (_sec < 0) return '';
    const min = Math.floor(_sec / 60);
    const sec = Math.floor(_sec % 60);
    const numToString = (num) => (num < 10 ? `0${num}` : num.toString());
    return `${min} : ${numToString(sec)}`;
  }

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
    child: '인증하기',
    disabled: 'disabled',
  });

  // 이메일 인풋을 생성합니다.
  const emailInputLabel = createElement('label', {
    for: 'email-input',
    child: '이메일',
  });
  const emailInput = createElement('input', {
    type: 'email',
    id: 'email-input',
    placeholder: '회사 이메일을 입력하세요.',
  });
  const emailInputElement = createElement('div', {
    class: `textfield ${EMAIL_SUFFIX && 'textfield-time'}`,
    time: EMAIL_SUFFIX,
    child: [emailInputLabel, emailInput],
  });

  // 인증번호 인풋을 생성합니다.
  const certInputLabel = createElement('label', {
    for: 'certification-input',
    child: '인증번호',
  });
  const certInput = createElement('input', {
    type: isIOS ? 'tel' : 'number',
    id: 'certification-input',
    placeholder: '인증번호를 입력하세요.',
  });
  const certInputElement = createElement('div', {
    class: 'textfield textfield-time',
    child: [certInputLabel, certInput],
  });

  // 인증번호 용청 버튼 생성
  const requestCertNumBtn = createElement('button', {
    class: 'button button-type-b',
    child: '인증번호 요청',
    disabled: 'disabled',
  });

  // Layout을 구성합니다.
  const titleContainer = wrapping('certification-title', titleElement);
  const submitContainer = wrapping('certification-submit', submitElement);
  const emailContainer = wrapping('certification-email', [
    emailInputElement,
    requestCertNumBtn,
  ]);
  const certNumContainer = wrapping('certification-num', certInputElement);

  const emailCertPage = createElement('div', {
    class: 'certification-page',
    child: [titleContainer, emailContainer, certNumContainer, submitContainer],
  });

  /* -------------- */
  /*  Event Helper  */
  /* -------------- */

  /**
   * @description 인증 번호 요청 버튼 활성화 함수
   */
  function setActiveCertReqBtn() {
    if (
      timeout === null && // 한번 요청 후 30초 후에 재 요청이 가능합니다.
      EMAIL_REG.test(emailInput.value + EMAIL_SUFFIX) // 이메일이 올바른 포멧이야 합니다.
    ) {
      requestCertNumBtn.removeAttribute('disabled');
    } else {
      requestCertNumBtn.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 인증하기 버튼 활성화 함수
   */
  function setActiveSubmitBtn() {
    if (
      interval && // 인증 번호가 발급된 후 3분동안 활성화 됩니다.
      CERT_NUM_REG.test(certInput.value) // 인증번호가 올바른 포멧이여야 합니다.
    ) {
      submitElement.removeAttribute('disabled');
    } else {
      submitElement.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 인증번호 재요청 버튼을 대기시간보다 빠르게 활성화 시킵니다.
   */
  function endTimeout() {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    setActiveCertReqBtn();
  }

  function endIterval() {
    if (interval) clearInterval(interval);
    interval = null;
    certInputElement.removeAttribute('time');
  }

  /**
   * @description 인증번호 오류 횟수 증가
   */
  function setErrorCertInput() {
    countEmailCertError += 1;
    certInput.value = ''; // 인증 번호 인풋 초기화

    const message = `${INVALID_CERT_MESSAGE} (${countEmailCertError}/3)`;
    certInputElement.setAttribute('error-message', message);

    if (!certInputElement.classList.contains('textfield-error')) {
      certInputElement.classList.add('textfield-error');
    }
    if (!certInputElement.classList.contains('textfield-error-message')) {
      certInputElement.classList.add('textfield-error-message');
    }

    // 오류 횟수가 3번 이상이면 더 이상 인증번호를 입력할 수 없다.
    if (countEmailCertError > 2) {
      modalFunc(INVALID_CERT_ERROR);
      certInput.setAttribute('disabled', 'disabled');
      endIterval();
      endTimeout();
    }
  }

  /**
   * @description 인증 번호 인풋을 초기화합니다.
   * @param {boolean} bool 인증 번호 인풋을 보여줄지 말지 여부
   */
  function initCertInput(bool) {
    certInput.removeAttribute('disabled'); // 이메일 인풋 활성화
    certInput.value = ''; // 인증 번호 인풋 초기화
    countEmailCertError = 0; // 이메일 인증 요청 검증 횟수 초기화

    endIterval();
    setActiveSubmitBtn();

    // 인증 번호 인풋 생성/제거
    if (bool && !certNumContainer.classList.contains('show')) {
      certNumContainer.classList.add('show');
    }
    if (!bool && certNumContainer.classList.contains('show')) {
      certNumContainer.classList.remove('show');
    }

    // 인증 번호 오류 메시지 초기화
    if (certInputElement.classList.contains('textfield-error')) {
      certInputElement.classList.remove('textfield-error');
    }
    if (certInputElement.classList.contains('textfield-error-message')) {
      certInputElement.classList.remove('textfield-error-message');
    }
  }

  /**
   * @description 인증 페이지 초기화
   */
  function initPage() {
    // emailInput.removeAttribute('disabled'); // 이메일 인풋 활성화
    // emailInput.value = ''; // 이메일 인풋 초기화

    endTimeout();
    initCertInput(false);
    setActiveCertReqBtn();
  }

  /* ------------- */
  /*  API Handler  */
  /* ------------- */

  /**
   * @description 아매알 안중 번호 발송을 요청합니다.
   * @returns {Promise<boolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
   */
  function certNumReq() {
    requestCertNumBtn.innerHTML = '인증번호 재요청';
    return sendEmailCertFunc(emailInput.value + EMAIL_SUFFIX);
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */

  // 이메일 입력 onChangeEvent
  emailInput.addEventListener('input', (event) => {
    if (event.target.value.length <= 50) setActiveCertReqBtn();
    else event.target.value = event.target.value.slice(0, -1);
  });

  // 인증 번호 입력 onChangeEvent
  certInput.addEventListener('input', (event) => {
    const str = onlyNumLimitLength(event.target.value, CERT_NUM_LENGTH);
    event.target.value = str;
    setActiveSubmitBtn();
  });

  // 인증 번호 요청 onClickEvent
  requestCertNumBtn.addEventListener('click', async () => {
    if (interval) endIterval();

    // 대기시간이 지나면 입력된 이메일의 값에 따라 버튼 활성화
    timeout = setTimeout(endTimeout, RE_CERT_EMAIL_TIME);
    setActiveCertReqBtn();

    // 이메일 인증 요청
    const certNumReqRes = await certNumReq();
    if (!certNumReqRes) {
      endTimeout();
      return;
    }

    // 인증 번호 인풋 생성
    initCertInput(true);
    certInput.focus();

    // 인증 번호 입력 대기시간을 카운트 다운 합니다.
    const startTime = Date.now();
    const initTimeStr = secToString(Math.round(CERT_LIMIT_TIME / 1000));
    certInputElement.setAttribute('time', initTimeStr);

    interval = setInterval(() => {
      const remainTime = CERT_LIMIT_TIME + startTime - Date.now();
      const remainTimeStr = secToString(Math.round(remainTime / 1000));

      if (remainTimeStr) {
        certInputElement.setAttribute('time', remainTimeStr);
      } else {
        initCertInput(false); // 인증번호 인풋을 초기화
        endTimeout(); // 인증본호 재요청 버튼 초기화
        modalFunc(EMAIL_TIMEOUT_ERROR); // 팝업 띄우기
      }
    }, 1000);

    setActiveSubmitBtn();
  });

  // 인증하기 버튼 onClickEvent
  submitElement.addEventListener('click', () => {
    submitFunc(certInput.value).then((result) => {
      if (result) clearInterval();
      else setErrorCertInput();

      setActiveSubmitBtn();
    });
  });

  return [emailCertPage, initPage];
}

export default createEmailCertPage;
