import { createElement, appendAllChild, wrapping } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import StackSlider from '../../src/js/layout/StackSlider';
import Loading from '../../src/js/component/Loading';
import Modal from '../../src/js/component/SingleBtnModal';

import './style.css';

/* ------------- */
/*  Config Data  */
/* ------------- */

const EMAIL_CERT_PAGE_TITLE = '회사 이메일 인증';
const EMAIL_CERT_PAGE_SUBTITLE = '회사 이메일을 이용해 인증을 해주세요.';

const MODAL_EXCESS_CERT_TIME =
  '인증번호 입력시간이 초과되었습니다. 인증번호 재요청 후 다시 시도해주세요.';

// const RE_CERT_EMAIL_TIME = 30 * 1000;
const RE_CERT_EMAIL_TIME = 3 * 1000;
// const CERT_LIMIT_TIME = 3 * 60 * 1000;
const CERT_LIMIT_TIME = 10 * 1000;

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const CERT_NUM_REG = /^[0-9]{6}[0-9]*$/;

const router = new Router(); // Callback으로 동작하는 라우터를 생성합니다.
const loading = new Loading(); // 로딩과 모달 컴포넌트를 생성합니다.
const modal = new Modal();

/* ------------- */
/*  API Handler  */
/* ------------- */

function sendEmailCert() {
  return new Promise((res) => setTimeout(() => res(), RE_CERT_EMAIL_TIME));
}

/* -------------- */
/*  Util Function */
/* -------------- */

function secToString(_sec) {
  const min = Math.floor(_sec / 60);
  const sec = Math.floor(_sec % 60);
  const numToString = (num) => (num < 10 ? `0${num}` : num.toString());
  return `${min} : ${numToString(sec)}`;
}

/* -------------- */
/*  View Function */
/* -------------- */

function createEmailCertPage() {
  let reEmailCertFlag = false; // 현재 인증번호 요청 대기중인지 여부
  let interval = null; // 인증 번호 시간 체크 인터벌

  // 제목과 Submit 버튼을 생성
  const title = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: EMAIL_CERT_PAGE_SUBTITLE,
  });
  const submit = createElement('button', {
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
    maxlength: '6',
    placeholder: '인증번호를 입력하세요.',
  });
  const certInputElement = createElement('div', {
    class: 'textfield textfield-time',
    child: [certInputLabel, certInput],
  });

  // 인증번호 용청 버튼 생성
  const reRequestCertNumBtn = createElement('button', {
    class: 'button button-type-b',
    child: '인증번호 요청',
    disabled: 'disabled',
  });

  // Layout을 구성합니다.
  const titleContainer = wrapping('certification-title', title);
  const submitContainer = wrapping('certification-submit', submit);
  const emailContainer = wrapping('certification-email', [
    emailInputElement,
    reRequestCertNumBtn,
  ]);

  const certNumContainer = wrapping('certification-num', certInputElement);

  // 이메일 입력 onChangeEvent
  emailInput.addEventListener('keyup', (event) => {
    // 이메일 포멧이 올바르고, 재인증 요청 대기시간이 없으면 인증 요청 버튼 활성화
    if (EMAIL_REG.test(event.target.value) && !reEmailCertFlag) {
      reRequestCertNumBtn.removeAttribute('disabled');
    } else {
      reRequestCertNumBtn.setAttribute('disabled', 'disabled');
    }
  });

  // 인증 번호 요청 onClickEvent
  reRequestCertNumBtn.addEventListener('click', async (event) => {
    // 버튼 텍스트를 변경하고 대기 시간동안 비활성화
    reEmailCertFlag = true;
    event.target.innerHTML = '인증번호 재요청';
    event.target.setAttribute('disabled', 'disabled');
    // 대기시간이 지나면 입력된 이메일의 값에 따라 버튼 활성화
    setTimeout(() => {
      reEmailCertFlag = false;
      if (EMAIL_REG.test(emailInput.value)) {
        reRequestCertNumBtn.removeAttribute('disabled');
      }
    }, RE_CERT_EMAIL_TIME);

    // 이메일 인증 요청
    await sendEmailCert();
    const sendEmailTime = Date.now();

    // 인증 번호 인풋 생성
    certNumContainer.classList.add('show');
    certInput.focus();

    // 인증 번호 입력 대기시간을 카운트 다운 합니다.
    const limitTimeStr = secToString(Math.round(CERT_LIMIT_TIME / 1000));
    certInputElement.setAttribute('time', limitTimeStr);

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const remainTime = CERT_LIMIT_TIME + sendEmailTime - Date.now();
      const remainTimeStr = secToString(Math.round(remainTime / 1000));
      certInputElement.setAttribute('time', remainTimeStr);
      if (remainTimeStr === '0 : 00') {
        clearInterval(interval);
        modal.show(MODAL_EXCESS_CERT_TIME);
      }
    }, 1000);
  });

  // 인증 번호 입력 onChangeEvent
  certInput.addEventListener('keyup', (event) => {
    if (CERT_NUM_REG.test(event.target.value)) {
      submit.removeAttribute('disabled');
    } else {
      submit.setAttribute('disabled', 'disabled');
    }
  });

  // 인증하기 버튼 onClickEvent
  submit.addEventListener('click', () => {
    clearInterval(interval);
    router.redirect('/request');
  });

  return createElement('div', {
    class: 'certification-page',
    child: [titleContainer, emailContainer, certNumContainer, submitContainer],
  });
}

function createRequestPage() {
  return createElement('div', {
    class: 'reqeust-page',
  });
}

/* -------------- */
/*  Window Onload */
/* -------------- */

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Document Title 초기화
    document.title = EMAIL_CERT_PAGE_TITLE;

    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 페이지를 생성합니다.
    const emailCertPage = createEmailCertPage();
    const requestPage = createRequestPage();

    // 전체 페이지들에 대한 Layout Component를 생성합니다.
    const stackSlider = new StackSlider('family-card');
    stackSlider.addPage(emailCertPage);
    stackSlider.addPage(requestPage);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('request', () => {
      stackSlider.moveNext();
    });

    // 라우터의 디폴트 콜백 함수를 추가합니다.
    router.setRouterFunc('default', () => window.history.back());

    appendAllChild(root, [loading.element, modal.element, stackSlider.element]);
  };
}
