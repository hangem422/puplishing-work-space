import '../../style/main.css';
import { createElement, wrapping } from '../../js/util/dom';
import AppState from '../../js/component/AppState';

if (window) {
  const appState = new AppState();

  const root = document.getElementsByClassName('root')[0];
  const loading = () => {
    appState.showLoading();
  };
  const loading3sec = () => {
    appState.showLoading();
    setTimeout(() => appState.hide(), 3000);
  };
  const afterLoading = () => {
    appState.showLoading();
    setTimeout(() => appState.showModal('스으으으을로울리 모달~~'), 3000);
  };

  window.onload = function () {
    const btn1 = createElement('button', {
      class: 'button button-type-a',
      child: '로딩만',
    });
    btn1.addEventListener('click', loading);
    const btn2 = createElement('button', {
      class: 'button button-type-a',
      child: '로딩만 3초',
    });
    btn2.addEventListener('click', loading3sec);
    const btn3 = createElement('button', {
      class: 'button button-type-a',
      child: '로딩후 모달',
    });
    btn3.addEventListener('click', afterLoading);

    const buttons = createElement('div', {
      class: '',
      child: [
        appState.element,
        wrapping('btn1', btn1),
        wrapping('btn2', btn2),
        wrapping('btn3', btn3),
      ],
    });

    root.appendChild(buttons);
  };
}
