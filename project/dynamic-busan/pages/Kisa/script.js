/* eslint-disable no-unused-vars */
import { appendAllChild } from '../../src/js/util/dom';
import { requestVP, issuedVC, fail, cancel } from '../../src/js/util/os';
import { post, get } from '../../src/js/util/ajax';
import Router from '../../src/js/module/RouterWithCB';
import AppState from '../../src/js/component/AppState';
import Toast from '../../src/js/component/Toast';

import './style.css';

import createEmailCertPage from './comp/EmailCert';

/* ------------- */
/*  Config Data  */
/* ------------- */

const SEND_VP_API_URL = '/api/v1/request_required_vp';
const EMAIL_CERT_API_URL = '/api/v1/auth/email/request';
const VERIFY_EMAIL_CERT_API_URL = '/api/v1/auth/email/verify';
const REQUEST_VC_API_URL = '/api/v1/issue_vc';

const EMAIL_CERT_PAGE_TITLE = '이메일 인증';

const MODAL_INVALID_ENV = '유효하지 않은 환경에서 실행할 수 없습니다.';
const MODAL_SERVER_ERROR = '오류가 발생했습니다. 잠시 후에 다시 시도해주세요.';

const ERROR_MESSAGE_01 = '등록되지 않은 사원';
const ERROR_MESSAGE_02 = '사원정보 불일치';
const ERROR_MESSAGE_03 = '서버 통신 오류 등';

const EMAIL_TOAST_MESSAGE = '이메일로 인증번호가 발송되었습니다.';
const EMAIL_TOAST_TIME = 3000;

let certEmail = '';
let vpSessionUUID = '';
let emailSessionUUID = '';

const router = new Router(); // Callback으로 동작하는 라우터를 생성합니다.
const appState = new AppState(); // 로딩과 모달 컴포넌트를 생성합니다.
const toast = new Toast(); // 토스트 메시지 컴포넌트를 생성합니다.

// 에러 발생시 에러 모달을 보여주는 함수입니다.
const errorFunc = {
  // 확인 버튼 클릭 시 로딩 헤제
  showModal: (message) => appState.showModal(message),
  // 확인 버튼 클릭 시 프로세스 취소
  cancel: (message) => appState.showModal(message, () => cancel()),
  // 확인 버튼 클릭시 프로세스 실패
  fail: (message) => appState.showModal(message, () => fail()),
};

/* ------------- */
/*  API Handler  */
/* ------------- */

/**
 * @description Api 서버로 VP를 전달합니다.
 * @param {string} vp AA VC 밝급을 위한 VP
 * @returns {Promise<bolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
 */
function sendVpToApi(vp) {
  appState.showLoading();

  // HTTP Status가 200이 아니면 전부 에러 처리합니다.
  return post({ url: SEND_VP_API_URL, data: { vp }, strict: true })
    .then((res) => {
      vpSessionUUID = res;
      appState.hide();
      return true;
    })
    .catch(() => {
      errorFunc.cancel(MODAL_SERVER_ERROR);
      return false;
    });
}

// NOTE: keepin에서 전역 함수를 실행시켜야하는데 Webpack을 실행시키면 스코프로 감싸지기에 전역 함수 선언이 힘들다.
// NOTE: 이를 해결하기위해 Window 객체에 넣어서, 전역함수화 시킵니다.
window.sendVpToApi = (vp) => sendVpToApi(vp);

/**
 * @description Api 서버로 이메일 인증 발솔 요청을 전달합니다.
 * @param {string} email 인증 번호를 발송할 이메일
 * @returns {Promise<bolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
 */
function sendEmailCert(email) {
  // 사전에 VP를 API 서버에 등록하지 않았으면 실행을 취소합니다.
  if (!vpSessionUUID) {
    errorFunc.cancel(MODAL_SERVER_ERROR);
    return Promise.resolve(false);
  }

  appState.showLoading();

  return post({
    url: EMAIL_CERT_API_URL,
    data: { email },
    headers: { 'referrer-token': vpSessionUUID },
    strict: true,
  })
    .then((res) => {
      certEmail = email;
      emailSessionUUID = res.data.referrer_token;
      appState.hide();
      toast.show(EMAIL_TOAST_MESSAGE, EMAIL_TOAST_TIME);
      return true;
    })
    .catch(() => {
      errorFunc.cancel(MODAL_SERVER_ERROR);
      return false;
    });
}

/**
 * @description API 서버에 사원증 VC를 요청합니다
 */
function requestVcFromApi() {
  // 사전에 이메일 인증 발송을 요청한 적이 없거나 VP를 등록한 적이 업으면 실행을 취소합니다.
  if (!certEmail || !vpSessionUUID) {
    errorFunc.cancel(MODAL_SERVER_ERROR);
    return Promise.resolve(false);
  }

  return get({
    url: REQUEST_VC_API_URL,
    data: { email: certEmail },
    headers: { 'referrer-token': vpSessionUUID },
  })
    .then((res) => {
      // 요청 성공 시 VCS 문자열을 받습니다.
      if (typeof res === 'string') {
        issuedVC(res, () => errorFunc(MODAL_INVALID_ENV));
        return true;
      }

      // 발급 조건 미달 오류
      if (res.message === 'KE001') {
        errorFunc.cancel(ERROR_MESSAGE_01);
        return true;
      }
      if (res.message === 'KE002') {
        errorFunc.cancel(ERROR_MESSAGE_02);
        return true;
      }

      // 기타 오류
      throw new Error('Undefined Condition');
    })
    .catch(() => {
      errorFunc.cancel(ERROR_MESSAGE_03);
      return false;
    });
}

/**
 * @description 이메일 인증 번호를 검증합니다.
 * @param {string} cert 이메일 인증 번호
 * @returns {Promise<boolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
 */
function verifyEmailCert(cert) {
  // 사전에 이메일 인증 발송을 요청한 적이 없으면 실행을 취소합니다.
  if (!emailSessionUUID) {
    errorFunc.cancel(MODAL_SERVER_ERROR);
    return Promise.resolve(false);
  }

  appState.showLoading();

  return post({
    url: VERIFY_EMAIL_CERT_API_URL,
    data: { auth_code: cert },
    headers: { 'referrer-token': emailSessionUUID },
    strict: false,
  })
    .then((res) => {
      // 이메일 인증 번호 검증 성공
      if (res.data) {
        requestVcFromApi();
        return true;
      }
      // 이메일 인증 번호 검증 실패
      if (res.id === 'unauthorized') {
        appState.hide();
        return false;
      }
      // 기타 오류
      throw new Error();
    })
    .catch(() => {
      errorFunc.cancel(MODAL_SERVER_ERROR);
      return false;
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

    // VP를 API 서버에 등록 후 시작합니다.
    appState.showLoading();
    requestVP('window.sendVpToApi', () =>
      errorFunc.showModal(MODAL_INVALID_ENV),
    );

    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 페이지를 생성합니다.
    const [emailCertPage] = createEmailCertPage(
      sendEmailCert,
      verifyEmailCert,
      errorFunc.showModal,
    );

    appendAllChild(root, [toast.element, appState.element, emailCertPage]);
  };
}
