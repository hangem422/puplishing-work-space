import * as model from './model/ShowDetail.model';

/* Show Detail Layout 컴포넌트 */

class ShowDetail {
  /**
   * @description Show Detail의 생성자
   * @param {string} seperatorClass 다른 Show  Detail과 구분할 수 있는 고유 Claass
   * @param {HTMLLIElement[] | { [key: string]: HTMLLIElement }} details
   */
  constructor(separatorClass, details) {
    const filteredDetails = {};

    if (typeof details === 'object') {
      Object.entries(details).forEach(([key, item]) => {
        if (item instanceof HTMLElement) filteredDetails[key] = item;
      });
    }

    model.createShowDetail(
      typeof separatorClass === 'string' ? separatorClass : '',
      filteredDetails,
      this,
    );
  }

  get element() {
    return model.getElement(this);
  }

  get details() {
    return model.getDetails(this);
  }

  /**
   * @description 세부 내용을 보여줍니다.
   * @param {number | string} key
   */
  renderDetail(key) {
    if (model.getDetails(this)[key] instanceof HTMLElement) {
      model.renderDetail(key, this);
    }
  }
}

export default ShowDetail;
