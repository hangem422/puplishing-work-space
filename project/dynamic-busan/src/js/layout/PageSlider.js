import { createElement } from '../util/dom';

/**
 * @description Page Slider Element를 렌더할 수 있는 클래스
 * @property {string} separatorClass 다른 Page Slider와 구분할 수 있는 고유 class
 * @property {HTMLLIElement} element Page Slider Element
 * @property {number} size Page Slider Element에 추가된 총 페이지 수
 * @property {number} current 현재 페이지의 인덱스 번호
 */
class PageSlider {
  /**
   * @description Page Slider의 생성자
   * @param {string} separatorClass 다른 Page Slider와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} pageList Page Slider에 들어갈 Page들의 리스트
   */
  constructor(separatorClass, pageList = []) {
    this.size = 0;
    this.current = 0;
    this.separatorClass = separatorClass || '';

    this.wrapper = createElement('div', {
      class: `page-slider-wrapper ${this.separatorClass}`,
    });
    this.element = createElement('div', {
      class: `page-slider-container ${this.separatorClass}`,
      child: this.wrapper,
    });

    this.render(pageList);
  }

  /**
   * @description Page Slider를 원하는 페이지로 넘깁니다.
   * @param {number} index 이동할 페이지의 인덱스 값
   */
  movePage(index) {
    // index가 범위를 초과할 시 값을 변경합니다.
    let next = index < 0 ? this.size - 1 : index;
    next = index >= this.size ? 0 : next;

    // 페이지를 이동시키고, 현재 페이 인덱스 값을 변경합니다.
    this.wrapper.style.left = `${next * -100}%`;
    this.current = next;
  }

  /**
   * @description Page Slider를 다음 페이지로 넘깁니다.
   */
  moveNext() {
    this.movePage(this.current + 1);
  }

  /**
   * @description Page Slider를 이전 페이지로 넘깁니다.
   */
  movePrev() {
    this.movePage(this.current - 1);
  }

  /**
   * @description Page Slider에 Page을 추가합니다.
   * @param {HTMLLIElement} page 추가할 Page
   */
  addPage(page) {
    const conatiner = createElement('div', {
      class: `page-slider-item ${this.separatorClass}`,
      style: `left: ${this.size * 100}%;`,
      child: page,
    });
    this.wrapper.appendChild(conatiner);
    this.size += 1;
  }

  /**
   * @description Page Slider Element를 렌더합니다.
   * @param {HTMLLIElement[]} pageList Page Slider에 들어갈 Page들의 리스트
   */
  render(pageList) {
    pageList.forEach((page) => this.addPage(page));
  }
}

export default PageSlider;
