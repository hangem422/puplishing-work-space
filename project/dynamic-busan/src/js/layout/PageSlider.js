import * as model from './model/PageSlider.model';

/* Page Slider Layout 컴포넌트 */

class PageSlider {
  /**
   * @param {string} separatorClass 다른 Page Slider와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} pageList Page Slider에 들어갈 Page들의 리스트
   */
  constructor(separatorClass, pageList) {
    model.createPageSlider(
      typeof separatorClass === 'string' ? separatorClass : '',
      this,
    );

    if (Array.isArray(pageList)) {
      pageList.forEach((page) => {
        if (page instanceof HTMLElement) model.addPage(page, this);
      });
    }
  }

  get element() {
    return model.getElement(this);
  }

  /**
   * @description Page Slider를 원하는 페이지로 넘깁니다.
   * @param {number} index 이동할 페이지의 인덱스 값
   */
  movePage(index) {
    if (typeof index === 'number') model.movePage(index, this);
  }

  /**
   * @description Page Slider를 다음 페이지로 넘깁니다.
   */
  moveNext() {
    model.moveNext(this);
  }

  /**
   * @description Page Slider를 이전 페이지로 넘깁니다.
   */
  movePrev() {
    model.movePrev(this);
  }

  /**
   * @description Page Slider에 Page을 추가합니다.
   * @param {HTMLLIElement} page 추가할 Page
   */
  addPage(page) {
    if (page instanceof HTMLElement) model.addPage(page, this);
  }
}

export default PageSlider;
