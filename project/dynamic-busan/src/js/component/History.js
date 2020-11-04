import * as model from './model/History.model';

/* 약관 이력 컴포넌트입나디. */

export default class History {
  /**
   * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
   * @param {string} prefix 각 이력마다 동일하게 붙을 접두어
   * @param {(file: string) => void} onClick 아이템 온 클릭 콜백 이벤트
   * @param {{ [propName: string]: string }} items 이력 날짜를 키로 갖고, url을 vlaue로 갖는 Object
   */
  constructor(separatorClass, prefix, onClick, items) {
    model.createHistory(
      typeof prefix === 'string' ? prefix : '',
      typeof onClick === 'function' ? onClick : () => {},
      typeof separatorClass === 'string' ? separatorClass : '',
      this,
    );

    if (Array.isArray(items)) {
      Object.entries(items).forEach(([key, value]) => {
        model.addItem(key, value, this);
      });
    }
  }

  /**
   * @returns {HTMLElement} History List Element
   */
  get element() {
    return model.getElement(this);
  }
}
