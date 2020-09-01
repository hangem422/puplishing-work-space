import { createElement, wrapping } from '../../../src/js/util/dom';

/* ------------- */
/*  Config Data  */
/* ------------- */

const TITLE = '회사 이메일을 이용해 인증을 해주세요.';
const EMAIL_CHANGE_ERROR = '변경된 이메일로 인증 번호를 재요청 할 수 없습니다.';
const EMAIL_TIMEOUT_ERROR =
  '인증번호 입력시간이 초과되었습니다. 인증번호 재요청 후 다시 시도해주세요.';
const INVALID_CERT_MESSAGE =
  '인증번호가 일치하지 않습니다.\n확인 후 다시 시도해주세요';

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const CERT_NUM_REG = /^[0-9]{6}[0-9]*$/;

const RE_CERT_EMAIL_TIME = 30 * 1000;
const CERT_LIMIT_TIME = 3 * 60 * 1000;
const CERT_NUM_LENGTH = 6;

/**
 * @description 이메일 인증 페이지를 만듭니다.
 * @param {(email: string) => Promise<boolean>} sendEmailCertFunc 이메일 주소로 인증 번호를 발송
 * @param {() => Promise<boolean>} reSendEmailCertFunc 이메일 주소로 인증 번호를 재 발송
 * @param {(message: string) => void} errorFunc 인증번호 입력 제한시간 초과시 실행할 함수
 * @param {(cert: string, lastChance: boolean) => Promise<boolean>} submitFunc 인증번호를 API 서버로 제출
 * @returns {[HTMLElement, () => void]} 이메일 인증 페이지와 초기화 함수
 */
function createEmailCertPage(
  sendEmailCertFunc,
  reSendEmailCertFunc,
  errorFunc,
  submitFunc,
) {
  let emailCertFlag = false; // 현재 인증번호 요청 대기중인지 여부
  let countEmailCert = 0; // 이메일 인증 요청 횟수
  let countEmailCertVerify = 0; // 이메일 인증 요청 검증 횟수
  let interval = null; // 인증 번호 시간 체크 인터벌
  let email = ''; // 1차로 입력받은 이메일

  /* -------------- */
  /*  Util Function */
  /* -------------- */

  function clearTimeCheck() {
    clearInterval(interval);
    interval = null;
  }

  /**
   * @description 초 단위의 시간을 MM : SS 포멧 문자열로 변경합니다.
   * @param {number} _sec 변경할 초 단위의 시간
   * @@returns {string} MM : SS 포멧 문자열
   */
  function secToString(_sec) {
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
    class: 'textfield',
    child: [emailInputLabel, emailInput],
  });

  // 인증번호 인풋을 생성합니다.
  const certInputLabel = createElement('label', {
    for: 'certification-input',
    child: '인증번호',
  });
  const certInput = createElement('input', {
    type: 'number',
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
  function setActiveCertRequestBtn() {
    if (
      countEmailCert < 5 && // 최대 5번까지 요청할 수 있습ㄴ디ㅏ.
      !emailCertFlag && // 한번 요청 후 30초 후에 재 요청이 가능합니다.
      EMAIL_REG.test(emailInput.value) // 이메일이 올바른 포멧이야 합니다.
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
    if (interval && CERT_NUM_REG.test(certInput.value)) {
      submitElement.removeAttribute('disabled');
    } else {
      submitElement.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 인증번호 오류 횟수 증가
   */
  function setCertInpuError() {
    countEmailCertVerify += 1;
    const message = `${INVALID_CERT_MESSAGE} (${countEmailCert}/3)`;
    certInputElement.setAttribute('error-message', message);
    certInputElement.classList.add('textfield-error textfield-error-message');
  }

  /**
   * @description 인증 페이지 초기화
   */
  function initPage() {
    emailInput.value = ''; // 이메일 인풋 초기화
    certInput.value = ''; // 인증 번호 인풋 초기화
    email = ''; // 저장된 이메일 초기화
    emailCertFlag = false; // 인증 번호 요청 대기상태 초기화
    countEmailCert = 0; // 인증 번호 요청 횟수 초기화
    countEmailCertVerify = 0; // 이메일 인증 요청 검증 횟수 초기화
    clearTimeCheck(); // 타임 체크 초기화
    setActiveCertRequestBtn(); // 인증 번호 요청 버튼 초기화
    setActiveSubmitBtn(); // 인증하기 버튼 초기화

    certNumContainer.classList.remove('show'); // 인증 번호 인풋 숨김
  }

  /* ------------- */
  /*  API Handler  */
  /* ------------- */

  /**
   * @description 이메일 인증 번호 요청 함수
   * @returns {Promise<boolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
   */
  function firstCertNumRequest() {
    emailInput.setAttribute('disabled', 'disabled');
    email = emailInput.value;
    return sendEmailCertFunc(email);
  }

  /**
   * @description 이메일 인증 번호 재요청 함수
   * @returns {Promise<boolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
   */
  function reCertNumRequest() {
    if (email !== emailInput.value) {
      errorFunc(EMAIL_CHANGE_ERROR);
      return Promise.resolve(false);
    }
    return reSendEmailCertFunc();
  }

  /**
   * @description 아매알 안중 번호 발송을 요청합니다.
   * @returns {Promise<boolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
   */
  function certNumRequest() {
    countEmailCert += 1;
    return countEmailCert === 1 ? firstCertNumRequest() : reCertNumRequest();
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */

  // 이메일 입력 onChangeEvent
  emailInput.addEventListener('keyup', setActiveCertRequestBtn);

  // 인증 번호 입력 onChangeEvent
  certInput.addEventListener('input', (event) => {
    if (event.target.value.length > CERT_NUM_LENGTH) {
      event.target.value = event.target.value.slice(0, CERT_NUM_LENGTH);
    }
  });

  // 인증 번호 요청 onClickEvent
  requestCertNumBtn.addEventListener('click', async (event) => {
    if (interval) clearTimeCheck();

    // 버튼 텍스트를 변경하고 대기 시간동안 비활성화
    emailCertFlag = true;
    event.target.innerHTML = '인증번호 재요청';
    setActiveCertRequestBtn();

    // 대기시간이 지나면 입력된 이메일의 값에 따라 버튼 활성화
    const certReauestBtnTimeout = setTimeout(() => {
      emailCertFlag = false;
      setActiveCertRequestBtn();
    }, RE_CERT_EMAIL_TIME);

    // 이메일 인증 요청
    const emailRequest = await certNumRequest();
    if (!emailRequest) {
      clearTimeout(certReauestBtnTimeout);
      return;
    }

    // 인증 번호 인풋 생성
    certNumContainer.classList.add('show');
    certInput.focus();

    // 인증 번호 입력 대기시간을 카운트 다운 합니다.
    const sendEmailTime = Date.now();
    const limitTimeStr = secToString(Math.round(CERT_LIMIT_TIME / 1000));
    certInputElement.setAttribute('time', limitTimeStr);

    interval = setInterval(() => {
      const remainTime = CERT_LIMIT_TIME + sendEmailTime - Date.now();
      const remainTimeStr = secToString(Math.round(remainTime / 1000));
      certInputElement.setAttribute('time', remainTimeStr);
      if (remainTimeStr === '0 : 00') {
        clearTimeCheck();
        submitElement.setAttribute('disabled', 'disabled');
        errorFunc(EMAIL_TIMEOUT_ERROR);
      }
    }, 1000);

    setActiveSubmitBtn();
  });

  // 인증 번호 입력 onChangeEvent
  certInput.addEventListener('keyup', setActiveSubmitBtn);

  // 인증하기 버튼 onClickEvent
  submitElement.addEventListener('click', () => {
    submitFunc(certInput.value, countEmailCertVerify > 1).then((result) => {
      if (result) clearTimeCheck();
      else setCertInpuError();
      setActiveSubmitBtn();
    });
  });

  return [emailCertPage, initPage];
}

export default createEmailCertPage;
