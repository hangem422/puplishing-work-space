import * as model from './model/StackSlider.model';

/* Stack Slider Layout 컴포넌트 */

class StackSlider {
  /**
   * @description Stack Slider의 생성자
   * @param {string} separatorClass 다른 Stack Slider와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} pageList Stack Slider에 들어갈 Page들의 리스트
   */
  constructor(separatorClass, pageList = []) {
    model.createStackSlider(
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

  get current() {
    return model.getCurrent(this);
  }

  /**
   * @description Stack Slider를 다음 페이지로 넘깁니다.
   */
  moveNext() {
    model.moveNext(this);
  }

  /**
   * @description Stack Slider를 이전 페이지로 넘깁니다.
   */
  movePrev() {
    model.movePrev(this);
  }

  /**
   * @description Stack Slider에 Page을 추가합니다.
   * @param {HTMLLIElement} page 추가할 Page
   */
  addPage(page) {
    if (page instanceof HTMLElement) model.addPage(page, this);
  }
}

export default StackSlider;
