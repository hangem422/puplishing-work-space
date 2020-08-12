import { createElement } from '../util/dom';

/**
 * @description 특정영역만 보여줄 수 있는 클래스
 * @property {string} seperatorClassb 다른 Show Detail과 구분할 수 있는 고유 class
 * @property {HTMLLIElement[]} details Show Detail Element
 */

class ShowDetail {
  /**
   * @description Show Detail의 생성자
   * @param {string} seperatorClass 다른 Show  Detail과 구분할 수 있는 고유 Claass
   * @param {HTMLLIElement[]} details
   */
  constructor(separatorClass, details) {
    this.details = details;
    this.cur = null;
    this.separatorClass = separatorClass || '';

    this.wrapper = createElement('div', {
      class: `show-detail-wrapper ${this.separatorClass}`,
    });
    this.element = createElement('div', {
      class: `show-detail-container ${this.separatorClass}`,
      child: this.wrapper,
    });

    this.makeDisplayNone(details);
  }

  /**
   * @description 약관 데이터 세부화면의 빈화면을 보여줍니다.
   * @param {HTMLLIElement} details
   */
  makeDisplayNone(details) {
    for (let i = 0; i < details.length; i += 1) {
      this.details[i].style.display = 'none';
      this.wrapper.appendChild(this.details[i]);
    }
    this.cur = null;
  }

  /**
   * @description 약관 데이터의 세부 내용을 보여줍니다.
   * @param {number} index
   */
  renderDetail(index) {
    if (this.cur !== null) this.details[this.cur].style.display = 'none';

    this.details[index].style.display = 'block';
    this.cur = index;
  }
}

export default ShowDetail;
