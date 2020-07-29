import { createElement, wrapping } from '../../src/js/util/dom';
import Router from '../../src/js/module/RouterWithCB';
import AgreeTerms from '../../src/js/component/AgreeTerms';
import PageSlider from '../../src/js/layout/PageSlider';
import TextPost from '../../src/js/layout/TextPost';

import data from './data.json';
import './style.css';
import SecretTextfield from '../../src/js/component/SecretTextfield';

// router 함수를 담는 객체
const routerFunc = {
  default: () => {},
};

// Callback으로 동작하는 라우터를 생성합니다.
const router = new Router(({ path, query }) => {
  // router 함수 객체에 알맞은 함수가 있으면 실행합니다.
  const isComplete = Object.keys(routerFunc).some((key) => {
    if (!path.startsWith(key)) return false;
    routerFunc[key]({ path, query });
    return true;
  });
  // 알맞은 함수가 없을 시 Default 함수가 실행됩니다.
  if (!isComplete) routerFunc.default({ path, query });
});

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
    { title: '모바일 가족사랑카드를 발급하기 위해 약관을 확인해주세요.' },
  );
  const agreeTermsSubmit = createElement('button', {
    class: 'button button-type-a',
    child: '확인',
    disabled: 'disabled',
  });
  const agreeTermsSubmitWrapper = createElement('div', {
    class: 'agree-terms-submit',
    child: agreeTermsSubmit,
  });
  const agreeTermsPage = createElement('div', {
    class: 'agree-terms-page',
    child: [agreeTerms.element, agreeTermsSubmitWrapper],
  });

  // 약관 동의 이벤트들을 설정합니다.
  /**
   * @description 약관을 전부 동의하지 않으면 확인 버튼을 누를 수 없습니다.
   * @param {boolean} isDone 약관 전체를 동의 했는지 여부
   */
  agreeTerms.onClick = (isDone) => {
    if (isDone) agreeTermsSubmit.removeAttribute('disabled');
    else agreeTermsSubmit.setAttribute('disabled', 'disabled');
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
  routerFunc.detail = ({ query }) => {
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
  };

  return pageSlider;
}

function createCertificationPage() {
  // 인증 페이지를 구성할 일반 Componenet들을 생성합니다.
  const title = createElement('p', {
    class: 'font-text-body1 font-color-dark',
    child: '주민등록번호를 이용해 인증을 해주세요.',
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
    placeholder: '주민등록번호 뒷자리 숫자를 입력하세요.',
    label: '주민등록번호 뒷자리(7자리 숫자)',
    validateCharFunc: (char) => /[0-9]/.test(char),
    validateStringFunc: (str) => /^[0-9]{7}$/.test(str),
    onChangeFunc: (_, validate) => {
      if (validate) submit.removeAttribute('disabled');
      else submit.setAttribute('disabled', 'disabled');
    },
  });

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
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // 페이지를 생성합니다.
    const termsOfUsePage = createTermsOfUsePage();
    const certificationPage = createCertificationPage();

    // 라우터의 디폴트 콜백 함수를 추가합니다.
    routerFunc.default = () => {
      if (termsOfUsePage.current !== 0) termsOfUsePage.movePage(0);
    };

    // root.appendChild(termsOfUsePage.element);
    root.appendChild(certificationPage);
  };
}
