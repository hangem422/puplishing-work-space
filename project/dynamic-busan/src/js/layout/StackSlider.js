const { createElement } = require('../util/dom');

const ACTIVE_PAGE_CLASS = 'active';

/**
 * @description Page를 한장씩 쌓거나 덜어내는 Slider
 * @property {number} size Stack Slider Element에 추가된 총 페이지 수
 * @property {number} current 현재 페이지의 인덱스 번호
 * @property {string} sc 다른 Stack Slider와 구분할 수 있는 고유 class
 * @property {HTMLLIElement} element Stack Slider Element
 */
class StackSlider {
  /**
   * @description Stack Slider의 생성자
   * @param {string} separatorClass 다른 Stack Slider와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} pageList Stack Slider에 들어갈 Page들의 리스트
   */
  constructor(separatorClass, pageList = []) {
    this.size = 0;
    this.current = 0;
    this.sc = separatorClass || '';

    this.pageWrapper = createElement('div', {
      class: `stack-slider-wrapper ${this.sc}`,
    });
    this.element = createElement('div', {
      class: `stack-slider-container ${this.sc}`,
      child: this.pageWrapper,
    });

    this.render(pageList);
  }

  /**
   * @description Stack Slider를 다음 페이지로 넘깁니다.
   */
  moveNext() {
    // 맨 끝 페이지에서는 사용할 수 없습니다.
    if (this.current === this.size - 1) return;
    this.current += 1;
    this.pageWrapper.childNodes[this.current].classList.add(ACTIVE_PAGE_CLASS);
  }

  /**
   * @description Stack Slider를 이전 페이지로 넘깁니다.
   */
  movePrev() {
    // 맨 끝 페이지에서는 사용할 수 없습니다.
    if (this.current === 0) return;
    this.pageWrapper.childNodes[this.current].classList.remove(
      ACTIVE_PAGE_CLASS,
    );
    this.current -= 1;
  }

  /**
   * @description Stack Slider에 Page을 추가합니다.
   * @param {HTMLLIElement} page 추가할 Page
   */
  addPage(page) {
    const wrapper = createElement('div', {
      class: 'stack-slider-item-wrapper',
      style: `z-index: ${(this.size + 1) * 100};`,
      child: page,
    });
    const conatiner = createElement('div', {
      class: 'stack-slider-item-container',
      child: wrapper,
    });
    if (this.size === 0) conatiner.classList.add(ACTIVE_PAGE_CLASS);
    this.pageWrapper.appendChild(conatiner);
    this.size += 1;
  }

  /**
   * @description Stack Slider Element를 랜더합니다.
   * @param {HTMLLIElement[]} pageList Page Slider에 들어갈 Page들의 리스트
   */
  render(pageList) {
    pageList.forEach((page) => this.addPage(page));
  }
}

export default StackSlider;
