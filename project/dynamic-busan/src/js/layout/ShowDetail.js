import { createElement } from '../util/dom';

/**
 * @description 특정영역만 보여줄 수 있는 클래스
 * @property {string} seperatorClassb 다른 Show Detail과 구분할 수 있는 고유 class
 * @property {number | string | null} cur 현재 활성화된 Element의 Key 값
 * @property {HTMLLIElement[] | { [key: string]: HTMLLIElement }} details Show Detail Element
 */
class ShowDetail {
  /**
   * @description Show Detail의 생성자
   * @param {string} seperatorClass 다른 Show  Detail과 구분할 수 있는 고유 Claass
   * @param {HTMLLIElement[] | { [key: string]: HTMLLIElement }} details
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

    (Array.isArray(this.details)
      ? this.details
      : Object.values(this.details)
    ).forEach((item) => {
      item.style.display = 'none';
      this.wrapper.appendChild(item);
    });
  }

  /**
   * @description 약관 데이터의 세부 내용을 보여줍니다.
   * @param {number | string} index
   */
  renderDetail(key) {
    if (this.cur !== null) this.details[this.cur].style.display = 'none';

    this.details[key].style.display = 'block';
    this.cur = key;
  }
}

export default ShowDetail;
