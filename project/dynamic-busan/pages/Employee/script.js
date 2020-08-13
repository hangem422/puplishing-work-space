import { appendAllChild } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import StackSlider from '../../src/js/layout/StackSlider';
import Loading from '../../src/js/component/Loading';
import Modal from '../../src/js/component/SingleBtnModal';

import data from './data.json';
import './style.css';

import createEmailCertPage from './comp/EmailCert';
import createRequestPage from './comp/Request';

/* ------------- */
/*  Config Data  */
/* ------------- */

const EMAIL_CERT_PAGE_TITLE = '회사 이메일 인증';
const REQUEST_PAGE_TITLE = '사원증 발급 요청';

const MODAL_EXCESS_CERT_TIME =
  '인증번호 입력시간이 초과되었습니다. 인증번호 재요청 후 다시 시도해주세요.';

const router = new Router(); // Callback으로 동작하는 라우터를 생성합니다.
const loading = new Loading(); // 로딩과 모달 컴포넌트를 생성합니다.
const modal = new Modal();

/* ------------- */
/*  API Handler  */
/* ------------- */

function sendEmailCert() {
  loading.show();
  return new Promise((res) =>
    setTimeout(() => {
      loading.hide();
      res();
    }, 3000),
  );
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
    const [emailCertPage, initEmailCertPage] = createEmailCertPage(
      sendEmailCert,
      () => modal.show(MODAL_EXCESS_CERT_TIME),
      () => router.redirect('/request'),
    );
    const [requestPage, initRequestPage] = createRequestPage(data);

    // 전체 페이지들에 대한 Layout Component를 생성합니다.
    const stackSlider = new StackSlider('family-card');
    stackSlider.addPage(emailCertPage);
    stackSlider.addPage(requestPage);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('request', () => {
      document.title = REQUEST_PAGE_TITLE;
      stackSlider.moveNext();
      initEmailCertPage();
    });

    // 라우터의 디폴트 콜백 함수를 추가합니다.
    router.setRouterFunc('default', () => {
      document.title = EMAIL_CERT_PAGE_TITLE;
      while (stackSlider.current !== 0) stackSlider.movePrev();
      initRequestPage();
    });

    appendAllChild(root, [loading.element, modal.element, stackSlider.element]);
  };
}
