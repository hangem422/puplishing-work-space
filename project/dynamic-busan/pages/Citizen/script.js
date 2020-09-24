import { appendAllChild } from '../../src/js/util/dom';
import { requestVP, issuedVC, fail, cancel } from '../../src/js/util/os';
import { get, post } from '../../src/js/util/ajax';
import Router from '../../src/js/module/RouterWithCB';
import PageSlider from '../../src/js/layout/PageSlider';
import StackSlider from '../../src/js/layout/StackSlider';
import AppState from '../../src/js/component/AppState';

import data from './data.json';
import './style.css';

import createAgreePage from './comp/Agree';
import createDetailPage from './comp/Detail';
import createCertificationPage from './comp/Certification';

/* ------------- */
/*  Config Data  */
/* ------------- */

const SEND_VP_API_URL = '/api/v1/request_required_vp';
const GET_VC_API_URL = '/api/v1/issue_vc';

const ERROR_MESSAGE_01 = '유효하지 않은 환경에서 실행할 수 없습니다.';
const ERROR_MESSAGE_02 = '오류가 발생했습니다. 잠시 후에 다시 시도 해주세요.';
const ERROR_MESSAGE_03 =
  '부산시민 카드 발급 대상이 아닙니다. 부산시민 카드는 주민등록상 주소지가 부산광역시로 등록된 시민만 발급받을 수 있습니다.';
const ERROR_MESSAGE_04 =
  '입력하신 주민등록번호가 유효하지 않습니다. 주민등록번호를 확인 후 다시 시도해주세요.';

const TERM_OF_USE_TITLE = '약관동의';
const CERTIFICATION_TITLE = '부산시민 인증';

let sessionUUID = ''; // API 서버에서 VC를 받기 위한 Session UUID

const router = new Router(); // Callback으로 동작하는 라우터를 생성합니다.
const appState = new AppState(); // 로딩과 모달 컴포넌트를 생성합니다.

// 에러 발생 시 에러 모달을 보여주는 함수입니다.
const errorFunc = {
  // 확인 버튼 클릭 시 로딩 해제
  showModal: (message) => appState.showModal(message),
  // 확인 버튼 클릭 시 프로세스 취소
  cancel: (message) => appState.showModal(message, () => cancel()),
  // 확인 버튼 클릭 시 프로세스 실패
  fail: (message) => appState.showModal(message, () => fail()),
};

/* ------------- */
/*  API Handler  */
/* ------------- */

/**
 * @description Api 서버로 VP를 전달합니다.
 * @param {string} vp AA VC 발급을 위한 VP
 * @returns {Promise<bolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
 */
function sendVpToApi(vp) {
  appState.showLoading();

  // HTTP Status가 200이 아니면 전부 에러 처리합니다.
  return post({ url: SEND_VP_API_URL, data: { vp }, strict: true })
    .then((res) => {
      sessionUUID = res;
      appState.hide();
      router.redirect('certification');
      return true;
    })
    .catch(() => {
      errorFunc.fail(ERROR_MESSAGE_02);
      return false;
    });
}

// NOTE: keepin에서 전역 함수를 실행시켜야하는데 Webpack을 실행시키면 스코프로 감싸지기에 전역 함수 선언이 힘듭니다.
// NOTE: 이를 해결하기 위해 Window 객체에 넣어서, 전역 함수화 시킵니다.
window.sendVpToApi = (vp) => sendVpToApi(vp);

/**
 * @description Api 서버에 주민번호 입력 후, VC를 받아옵니다.
 * @param {string} rrn 입력받은 주민 등록번호 뒷자리
 * @param {boolean} lastChance 주민번호 인증이 마지막 기회인지 여부
 * @returns {Promise<bolean>} 요청 성공 / 실패 여부 반환하는 비동기 객체
 */
function getVcFromApi(rrn, lastChance) {
  // sessionUUID를 발급받은 적이 없으면 GET 요청을 보낼 수 없습니다.
  if (!sessionUUID) {
    errorFunc.showModal(ERROR_MESSAGE_01);
    return Promise.resolve(false);
  }

  appState.showLoading();

  return get({
    url: GET_VC_API_URL,
    data: { rrn },
    headers: { 'referrer-token': sessionUUID },
    strict: false,
  })
    .then((res) => {
      // 요청 성공 시 VCS 문자열을 받습니다.
      if (typeof res === 'string') {
        issuedVC(res, () => errorFunc(ERROR_MESSAGE_01));
        return true;
      }

      // 발급 조건 미달 오류
      if (['E001', 'E002', 'E003', 'E006'].includes(res.message)) {
        errorFunc.fail(ERROR_MESSAGE_03);
        return true;
      }
      // 주민번호 불일치 오류
      if (['E004'].includes(res.message)) {
        if (lastChance) errorFunc.cancel(ERROR_MESSAGE_04);
        else appState.hide();
        return false;
      }
      // 기타 오류
      errorFunc.fail(ERROR_MESSAGE_02);
      return true;
    })
    .catch(() => {
      errorFunc.fail(ERROR_MESSAGE_02);
      return false;
    });
}

/* ------------------------- */
/*  Event Callback Function  */
/* ------------------------- */

/**
 * @description 약관 상세 페이지로 이동합니다.
 * @param {number} index
 */
function agreePageOnDetail(index) {
  if (data[index].link) window.location.href = data[index].link;
  else router.redirect('/detail', { index });
}

/**
 * @description 약관 동의를 제출하고, 단말로부터 VP를 가져옵니다.
 */
function agreePageOnSubmint() {
  if (!appState.state) appState.showLoading();
  requestVP('window.sendVpToApi', () => errorFunc.showModal(ERROR_MESSAGE_01));
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
    document.title = TERM_OF_USE_TITLE;

    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 이용 약관 동의 페이지를 생성합니다.
    const termsOfUsePage = new PageSlider('terms-and-condition');
    const [agreeTermsPage, initAgreeTermsPage] = createAgreePage(
      data.map(({ title }) => title),
      agreePageOnDetail,
      agreePageOnSubmint,
    );
    termsOfUsePage.addPage(agreeTermsPage);

    // 주민번호 인증 페이지를 생성합니다.
    const stackSlider = new StackSlider('family-card');
    const [certificationPage, initCertificationPage] = createCertificationPage(
      getVcFromApi,
    );
    stackSlider.addPage(termsOfUsePage.element);
    stackSlider.addPage(certificationPage);

    // 생성한 레이아웃 컴포넌트를 Render 합니다.
    appendAllChild(root, [appState.element, stackSlider.element]);

    // 약관 상세 페이지는 랜더에 다소 시간이 걸릴 수 있으니, 마지막에 진행합니다.
    const detailPage = createDetailPage(data);
    termsOfUsePage.addPage(detailPage.element);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('detail', ({ query }) => {
      const index = query.index || 0;
      document.title = data[index].title;
      detailPage.renderDetail(index);
      termsOfUsePage.movePage(1);
    });

    router.setRouterFunc('certification', () => {
      document.title = CERTIFICATION_TITLE;
      stackSlider.moveNext();
    });

    router.setRouterFunc('default', () => {
      document.title = TERM_OF_USE_TITLE;
      if (termsOfUsePage.current !== 0) termsOfUsePage.movePage(0);
      if (stackSlider.current !== 0) {
        initAgreeTermsPage();
        initCertificationPage();
      }
      while (stackSlider.current !== 0) stackSlider.movePrev();
    });
  };
}
