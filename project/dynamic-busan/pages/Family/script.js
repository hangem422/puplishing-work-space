import { createElement } from '../../src/js/util/dom';
import AgreeTerms from '../../src/js/component/AgreeTerms';
import PageSlider from '../../src/js/layout/PageSlider';

import data from './data.json';
import './style.css';

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // 페이지 제목을 첫 페이지에 맞게 변경합니다.
    document.title = '약관동의';

    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName('root')[0];

    // Layout Component들을 생성합니다.
    const pageSlider = new PageSlider();

    // 약관 동의 페이지를 구성할 Componenet들을 생성합니다.
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

    pageSlider.addPage(agreeTermsPage);
    root.appendChild(pageSlider.element);
  };
}
