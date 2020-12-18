/* eslint-disable no-unused-vars */
import { requestVP, issuedVC, fail, cancel } from '../../src/js/util/os';
import { get, post } from '../../src/js/util/ajax';
import AppState from '../../src/js/component/AppState';

import './style.css';

/* ------------- */
/*  Config Data  */
/* ------------- */

const SEND_VP_API_URL = '/api/v1/request_required_vp';
const GET_VC_API_URL = '/api/v1/issue_vc';

const ERROR_MESSAGE_01 = '유효하지 않은 환경에서 실행할 수 없습니다.';
const ERROR_MESSAGE_02 =
  '페이지를 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';

const LIBRARY_MEMBER_ERROR = ['EBL001', 'EBL002', 'EBL004'];
const INTEGRATED_MEMBER_ERROR = ['EBL006'];
const EXPIRE_MEMBER_ERROR = ['EBL007'];

const LIBRARY_MEMBER_URL =
  'https://library.busan.go.kr/portal/intro/join/index.do?menu_idx=45';
const INTEGRATED_MEMBER_URL =
  'https://library.busan.go.kr/portal/intro/join/integration.do?menu_idx=48';
const EXPIRE_MEMBER_URL =
  'https://library.busan.go.kr/portal/intro/join/reAgree.do?menu_idx=87';

const LIBRARY_MEMBER_MSG =
  '도서관 회원증은 부산지역 공공도서관 회원만 발급받을 수 있습니다.';
const INTEGRATED_MEMBER_MSG =
  '도서관 회원증은 통합회원인증 후 발급받을 수 있습니다.';
const EXPIRE_MEMBER_MSG =
  '귀하는 개인정보이용재동의(2년 주기) 대상자입니다. 개인정보재동의 이후 도서관 회원증을 발급받을 수 있습니다.';

const LIBRARY_MEMBER_SUB = '회원가입 바로가기';
const INTEGRATED_MEMBER_SUB = '통합회원인증 바로가기';
const EXPIRE_MEMBER_SUB = '개인정보재동의 바로가기';

const appState = new AppState(); // 로딩과 모달 컴포넌트를 생성합니다.

// 에러 발생 시 에러 모달을 보여주는 함수입니다.
const errorFunc = {
  // 확인 버튼 클릭 시 로딩 해제
  showModal: (message) => appState.showModal(message),
  // 확인 버튼 클릭 시 프로세스 취소
  cancel: (message, linkText, linkUrl) =>
    appState.showModal(message, cancel, { linkText, linkUrl }),
  // 확인 버튼 클릭 시 프로세스 실패
  fail: (message) => appState.showModal(message, () => fail()),
};

/* ------------- */
/*  API Handler  */
/* ------------- */

/**
 * @description Api 서버로 VP를 전달한 후, 도서관 VC를 가져옵니다.
 * @param {string} vp AA VC 발급을 위한 VP
 */
function apiHandler(vp) {
  post({ url: SEND_VP_API_URL, data: { vp }, strict: true })
    // 발급받은 Referrer Token으로 VC를 발급받습니다.
    .then((res) =>
      get({
        url: GET_VC_API_URL,
        headers: { 'referrer-token': res.data },
        strict: false,
      }),
    )
    // 발급 받은 VC를 모바일 디바이스로 전달합니다.
    .then((res) => {
      // 요청 성공 시 VCS 문자열을 받습니다.
      if (res.ok) {
        issuedVC(res.data, () => errorFunc.fail(ERROR_MESSAGE_01));
      }
      // 도서관 회원증 발급 실패
      else if (LIBRARY_MEMBER_ERROR.includes(res.data.message)) {
        errorFunc.cancel(
          LIBRARY_MEMBER_MSG,
          LIBRARY_MEMBER_SUB,
          LIBRARY_MEMBER_URL,
        );
      } else if (INTEGRATED_MEMBER_ERROR.includes(res.data.message)) {
        errorFunc.cancel(
          INTEGRATED_MEMBER_MSG,
          INTEGRATED_MEMBER_SUB,
          INTEGRATED_MEMBER_URL,
        );
      } else if (EXPIRE_MEMBER_ERROR.includes(res.data.message)) {
        errorFunc.cancel(
          EXPIRE_MEMBER_MSG,
          EXPIRE_MEMBER_SUB,
          EXPIRE_MEMBER_URL,
        );
      }
      // 기타 오류
      else errorFunc.fail(ERROR_MESSAGE_02);
    })
    // HTTP Status가 200이 아니면 전부 에러 처리합니다.
    .catch(() => errorFunc.fail(ERROR_MESSAGE_02));
}

// NOTE: keepin에서 전역 함수를 실행시켜야하는데 Webpack을 실행시키면 스코프로 감싸지기에 전역 함수 선언이 힘듭니다.
// NOTE: 이를 해결하기 위해 Window 객체에 넣어서, 전역 함수화 시킵니다.
window.apiHandler = (vp) => apiHandler(vp);

/* -------------- */
/*  Window Onload */
/* -------------- */

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // 로딩 화면을 추가합니다.
    document.getElementsByClassName('root')[0].appendChild(appState.element);

    appState.showLoading();
    requestVP('window.apiHandler', () => errorFunc.showModal(ERROR_MESSAGE_01));
  };
}
