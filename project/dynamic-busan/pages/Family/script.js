import { createElement, appendAllChild, wrapping } from '../../src/js/util/dom';
import { requestVP, issuedVC, fail } from '../../src/js/util/os';
import { get, post } from '../../src/js/util/ajax';
import Router from '../../src/js/module/RouterWithCB';
import AgreeTerms from '../../src/js/component/AgreeTerms';
import PageSlider from '../../src/js/layout/PageSlider';
import StackSlider from '../../src/js/layout/StackSlider';
import TextPost from '../../src/js/layout/TextPost';
import Loading from '../../src/js/component/Loading';
import Modal from '../../src/js/component/SingleBtnModal';

import data from './data.json';
import './style.css';
import SecretTextfield from '../../src/js/component/SecretTextfield';

const API_SERVER_HOST = 'http://15.164.137.13:8005';
const SEND_VP_API_URL = `${API_SERVER_HOST}/api/v1/request_required_vp`;
const GET_VC_API_URL = `${API_SERVER_HOST}/api/v1/issue_vc`;

const ERROR_MESSAGE_01 = '유효하지 않은 환경에서 실행할 수 없습니다.';
const ERROR_MESSAGE_02 = '오류가 발생했습니다. 잠시 후에 다시 시도해주세요.';
const ERROR_MESSAGE_03 =
  '모바일 가족사랑카드 발급대상이 아닙니다. 모바일 가족사랑카드는 주소지가 부산광역시면서, 주민등록본에 부 또는 모와 세 자녀 이상이 같이 되어있는 가정의 부모만 발급받을 수 있습니다.';
const ERROR_MESSAGE_04 =
  '입력하신 주민등록번호가 유요하지 않습니다. 주민등록번호를 확인 후 다시 시도해주세요.';

const TERM_OF_USE_DOC_TITLE = '약관동의';
const TERM_OF_USE_TITLE =
  '모바일 가족사랑카드를 발급하기 위해 약관을 확인해주세요.';

const CERTIFICATION_DOC_TITLE = '다자녀가정 인증';
const CERTIFICATION_TITLE = '주민등록번호를 이용해 인증을 해주세요.';
const CERTIFICATION_LABEL = '주민등록번호 뒷자리(7자리 숫자)';
const CERTIFICATION_PLACEHOLDER = '주민등록번호 뒷자리 숫자를 입력하세요.';

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router();

// 로딩과 모달 컴포넌트를 생성합니다.
const loading = new Loading();
const modal = new Modal();

/**
 * @description JS Call Interface 사용 환경이 아닐 때 예외 처리 함수
 */
function jsCallInvalidFunc() {
  modal.show(ERROR_MESSAGE_01, () => loading.hide());
}

/**
 * @description API 서버와 통신에 실패했을 때 예외 처리 함수
 */
function faillToApiConnect(message) {
  modal.show(message || ERROR_MESSAGE_02, () => fail(() => loading.hide()));
}

/**
 * @description Api 서버로 VP를 전달합니다.
 * @param {string} vp AA VC 밝급을 위한 VP
 */
// eslint-disable-next-line no-unused-vars
function sendVpToApi(vp) {
  // 로딩 화면이 없으면 로딩 화면을 보여줍니다.
  if (!loading.state) loading.show();

  // HTTP Status가 200이 아니면 전부 에러 처리합니다.
  post(SEND_VP_API_URL, { vp }, { strict: true, parse: 'json' })
    .then(() => {
      loading.hide();
      router.redirect('certification');
    })
    .catch(() => faillToApiConnect());
}

/**
 * @description 이용 약관 동의 버튼 클릭 이벤트 콜백 함수
 */
function termsOfUseSubmit() {
  // 로딩 화면이 없으면 로딩 화면을 보여줍니다.
  if (!loading.state) loading.show();

  requestVP(sendVpToApi.name, jsCallInvalidFunc);
}

/**
 * @description Api 서버에 주민번호 입력 후, vc를 받아옵니다.
 * @param {string} rnn 입력받은 주민 등록번호 뒷자리
 */
function certificationSubmit(rnn) {
  // 로딩 화면이 없으면 로딩 화면을 보여줍니다.
  if (!loading.state) loading.show();

  get(GET_VC_API_URL, { rnn }, { strict: false, parse: 'json' })
    .then((res) => {
      // response에 id가 존재할 경우, 에러 발생으로 간주합니다.
      if (res.id) {
        if (res.message && ['E001', 'E002', 'E003'].includes(res.message)) {
          faillToApiConnect(ERROR_MESSAGE_03);
        } else if (res.message && ['E004'].includes(res.message)) {
          faillToApiConnect(ERROR_MESSAGE_04);
        } else {
          faillToApiConnect(ERROR_MESSAGE_02);
        }
      } else {
        issuedVC(res, jsCallInvalidFunc);
      }
    })
    .catch(() => faillToApiConnect());
}

/**
 * @description YYYY.MM.DD를 YYYY년 MM월 DD일로 변경합니다.
 * @param {string} date YYYY.MM.DD
 * @returns {string} YYYY년 MM월 DD일
 */
function converDate(date) {
  const dateArr = date.split('.');
  dateArr[0] = `${dateArr[0]}년`;
  dateArr[1] = dateArr[1].length < 2 ? `0${dateArr[1]}월` : `${dateArr[1]}월`;
  dateArr[2] = dateArr[2].length < 2 ? `0${dateArr[2]}일` : `${dateArr[2]}일`;
  return dateArr.join(' ');
}

/**
 * @description 약관 Footer Element 생성합니다.
 * @param {string} notice 약관 고지일
 * @param {string} enforce 약관 시행일
 * @return {HTMLLIElement} Footer Element
 */
function createTermDetailFooter(notice, enforce) {
  // Component Element를 생성합니다.
  const noticeElement = createElement('li', { child: notice });
  const enforceElement = createElement('li', { child: enforce });
  return createElement('ul', {
    class: 'font-text-body2 font-color-dark',
    child: [noticeElement, enforceElement],
  });
}

function createTermsOfUsePage() {
  // 약관 동의 페이지를 구성할 Layout Component들을 생성합니다.
  const pageSlider = new PageSlider('terms-and-condition');
  const textPost = new TextPost();

  // 약관 동의 페이지를 구성할 일반 Componenet들을 생성합니다.
  const agreeTerms = new AgreeTerms(
    data.terms.map((term) => term.title),
    { title: TERM_OF_USE_TITLE },
  );
  const submit = createElement('button', {
    class: 'button button-type-a',
    child: '확인',
    disabled: 'disabled',
  });
  const submitContainer = wrapping('agree-terms-submit', submit);
  const agreeTermsPage = createElement('div', {
    class: 'agree-terms-page',
    child: [agreeTerms.element, submitContainer],
  });

  // 제출 버튼 온클릭 이벤트를 설정합니다.
  submit.addEventListener('click', () => termsOfUseSubmit());

  // 약관 동의 이벤트들을 설정합니다.
  /**
   * @description 약관을 전부 동의하지 않으면 확인 버튼을 누를 수 없습니다.
   * @param {boolean} isDone 약관 전체를 동의 했는지 여부
   */
  agreeTerms.onClick = (isDone) => {
    if (isDone) submit.removeAttribute('disabled');
    else submit.setAttribute('disabled', 'disabled');
  };

  /**
   * @description 약관 상세페이지로 이동합니다.
   * @param {number} index 리스트에서 선택한 항목의 인덱스 값
   */
  agreeTerms.onDetail = (index) => router.redirect('/detail', { index });

  // 약관 동의 페이지를 구성합니다.
  pageSlider.addPage(agreeTermsPage);
  pageSlider.addPage(textPost.element);

  // 라우터에 함수를 추가합니다.
  router.setRouterFunc('detail', ({ query }) => {
    const term = data.terms[query.index || 0];
    document.title = term.title;
    textPost.title = term.title;
    textPost.subtitle = `시행일 ${term.enforceDate}`;
    textPost.contents = term.content;
    textPost.footer = createTermDetailFooter(
      converDate(`고지일: ${term.noticeDate}`),
      converDate(`시행일: ${term.enforceDate}`),
    );
    pageSlider.movePage(1);
  });

  return pageSlider;
}

function createCertificationPage() {
  // 인증 페이지를 구성할 일반 Componenet들을 생성합니다.
  const title = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: CERTIFICATION_TITLE,
  });
  const submit = createElement('button', {
    class: 'button button-type-a',
    child: '인증하기',
    disabled: 'disabled',
  });
  const titleContainer = wrapping('certification-title', title);
  const submitContainer = wrapping('certification-submit', submit);
  const secretTextfield = new SecretTextfield({
    separatorClass: 'certification-input',
    max: 7,
    type: 'number',
    placeholder: CERTIFICATION_PLACEHOLDER,
    label: CERTIFICATION_LABEL,
    validateCharFunc: (char) => /[0-9]/.test(char),
    validateStringFunc: (str) => /^[0-9]{7}$/.test(str),
    onChangeFunc: (_, validate) => {
      if (validate) submit.removeAttribute('disabled');
      else submit.setAttribute('disabled', 'disabled');
    },
  });

  // 제출 버튼 온클릭 이벤트를 설정합니다.
  submit.addEventListener('click', () =>
    certificationSubmit(secretTextfield.text),
  );

  return createElement('div', {
    class: 'certification-page',
    child: [titleContainer, secretTextfield.element, submitContainer],
  });
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Document Title 초기화
    document.title = TERM_OF_USE_DOC_TITLE;

    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 페이지를 생성합니다.
    const termsOfUsePage = createTermsOfUsePage();
    const certificationPage = createCertificationPage();

    // 전체 페이지들에 대한 Layout Component를 생성합니다.
    const stackSlider = new StackSlider('family-card');
    stackSlider.addPage(termsOfUsePage.element);
    stackSlider.addPage(certificationPage);

    // 라우터에 함수를 추가합니다.
    router.setRouterFunc('certification', () => {
      document.title = CERTIFICATION_DOC_TITLE;
      stackSlider.moveNext();
    });

    // 라우터의 디폴트 콜백 함수를 추가합니다.
    router.setRouterFunc('default', () => {
      document.title = TERM_OF_USE_DOC_TITLE;
      if (termsOfUsePage.current !== 0) termsOfUsePage.movePage(0);
      while (stackSlider.current !== 0) stackSlider.movePrev();
    });

    appendAllChild(root, [loading.element, modal.element, stackSlider.element]);
  };
}
