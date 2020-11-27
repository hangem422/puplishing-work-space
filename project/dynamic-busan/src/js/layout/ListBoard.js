import * as model from './model/ListBoard.model';

/* List Board Layout 컴포넌트 */

class ListBoard {
  /**
   * @param {string} separatorClass 다른 List Board와 구분할 수 있는 고유 class
   * @param {HTMLLIElement[]} itemList List Board에 들어갈 Item들의 리스트
   * @param {(index: number, item: HTMLElement) => void} onClickFunction Item의 온클릭 이벤트 리스너
   */
  constructor(separatorClass, itemList = [], onClickFunction) {
    model.createListBoard(
      typeof separatorClass === 'string' ? separatorClass : '',
      typeof onClickFunction === 'function' ? onClickFunction : () => {},
      this,
    );

    if (Array.isArray(itemList)) {
      itemList.forEach((item) => {
        if (item instanceof HTMLElement) model.addItem(item, this);
      });
    }
  }

  get element() {
    return model.getElement(this);
  }
}

export default ListBoard;
