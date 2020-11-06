import * as model from './model/DrawerBoard.model';

/* Drawer Board Layout 컴포넌트 */

export default class DrawerBoard {
  /**
   * @param {string} separatorClass 다른 DrawerBoard와 구분할 수 있는 고유 class
   * @param {{ header: HTMLLIElement, content: HTMLLIElement}[]} itemList DrawerBoard에 들어갈 Item들의 리스트
   */
  constructor(separatorClass, itemList) {
    model.createDrawerBoard(
      typeof separatorClass === 'string' ? separatorClass : '',
      this,
    );

    if (Array.isArray(itemList)) {
      itemList.forEach((item) => {
        if (
          item.header instanceof HTMLElement &&
          item.content instanceof HTMLElement
        ) {
          model.addItem(item, this);
        }
      });
    }
  }

  get element() {
    return model.getElement(this);
  }
}
