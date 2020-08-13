import { createElement, wrapping } from '../../../src/js/util/dom';

/* ------------- */
/*  Config Data  */
/* ------------- */

const TITLE = '회사 이메일을 이용해 인증을 해주세요.';

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const CERT_NUM_REG = /^[0-9]{6}[0-9]*$/;

// const RE_CERT_EMAIL_TIME = 30 * 1000;
const RE_CERT_EMAIL_TIME = 10 * 1000;
// const CERT_LIMIT_TIME = 3 * 60 * 1000;
const CERT_LIMIT_TIME = 10 * 1000;

function createEmailCertPage(sendEmailCertFunc, timeOutFunc, submitFunc) {
  let reEmailCertFlag = false; // 현재 인증번호 요청 대기중인지 여부
  let interval = null; // 인증 번호 시간 체크 인터벌

  /* -------------- */
  /*  Util Function */
  /* -------------- */

  function clearTimeCheck() {
    clearInterval(interval);
    interval = null;
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

  /**
   * @description 인증 번호 요청 버튼 활성화 함수
   */
  function setActiveCerRequestBtn() {
    // 이메일 포멧이 올바르고, 재인증 요청 대기시간이 없으면 인증 요청 버튼 활성화
    if (EMAIL_REG.test(emailInput.value) && !reEmailCertFlag) {
      requestCertNumBtn.removeAttribute('disabled');
    } else {
      requestCertNumBtn.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 인증하기 버튼 활성화 함수
   */
  function setActiveSubmitBtn() {
    if (CERT_NUM_REG.test(certInput.value) && interval) {
      submitElement.removeAttribute('disabled');
    } else {
      submitElement.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * @description 인증 페이지 초기화
   */
  function initPage() {
    emailInput.value = '';
    certInput.value = '';
    reEmailCertFlag = false;
    clearTimeCheck();
    setActiveCerRequestBtn();
    setActiveSubmitBtn();

    certNumContainer.classList.remove('show');
  }

  /* ------------------------- */
  /*  Event Callback Function  */
  /* ------------------------- */

  // 이메일 입력 onChangeEvent
  emailInput.addEventListener('keyup', setActiveCerRequestBtn);

  // 인증 번호 요청 onClickEvent
  requestCertNumBtn.addEventListener('click', async (event) => {
    // 버튼 텍스트를 변경하고 대기 시간동안 비활성화
    reEmailCertFlag = true;
    event.target.innerHTML = '인증번호 재요청';
    setActiveCerRequestBtn();
    // 대기시간이 지나면 입력된 이메일의 값에 따라 버튼 활성화
    setTimeout(() => {
      reEmailCertFlag = false;
      setActiveCerRequestBtn();
    }, RE_CERT_EMAIL_TIME);

    // 이메일 인증 요청
    await sendEmailCertFunc();
    const sendEmailTime = Date.now();

    // 인증 번호 인풋 생성
    certNumContainer.classList.add('show');
    certInput.focus();

    // 인증 번호 입력 대기시간을 카운트 다운 합니다.
    const limitTimeStr = secToString(Math.round(CERT_LIMIT_TIME / 1000));
    certInputElement.setAttribute('time', limitTimeStr);

    if (interval) clearTimeCheck();
    interval = setInterval(() => {
      const remainTime = CERT_LIMIT_TIME + sendEmailTime - Date.now();
      const remainTimeStr = secToString(Math.round(remainTime / 1000));
      certInputElement.setAttribute('time', remainTimeStr);
      if (remainTimeStr === '0 : 00') {
        clearTimeCheck();
        submitElement.setAttribute('disabled', 'disabled');
        timeOutFunc();
      }
    }, 1000);

    setActiveSubmitBtn();
  });

  // 인증 번호 입력 onChangeEvent
  certInput.addEventListener('keyup', setActiveSubmitBtn);

  // 인증하기 버튼 onClickEvent
  submitElement.addEventListener('click', () => {
    clearTimeCheck();
    submitFunc();
  });

  return [emailCertPage, initPage];
}

export default createEmailCertPage;
