import '../../style/main.css';
import PageSlider from '../../js/PageSlider';
import { createElement } from '../../js/util/dom';

if (window) {
  window.onload = function () {
    const root = document.getElementsByClassName('root')[0];

    const testPageList = [];
    for (let i = 1; i < 6; i += 1) {
      const page = createElement('p', {
        class: 'font-text-body1 font-medium font-color-dark',
      });
      page.innerHTML = `Test Page 0${i}`;
      testPageList.push(page);
    }

    const pageSlider = new PageSlider('test-page-slider', testPageList);
    root.appendChild(pageSlider.element);

    setInterval(() => pageSlider.moveNext(), 3000);
  };
}
