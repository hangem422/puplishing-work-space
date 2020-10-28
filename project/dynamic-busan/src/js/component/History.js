/* eslint-disable no-underscore-dangle */
import { createElement, appendAllChild } from '../util/dom';

export default (function () {
  const _list = new WeakMap();
  const _element = new WeakMap();
  const _prefix = new WeakMap();
  const _onclick = new WeakMap();
  const _separatorClass = new WeakMap();

  class History {
    /**
     * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
     * @param {string} prefix 각 이력마다 동일하게 붙을 접두어
     * @param {(file: string) => void)} historyOnclick 아이템 온 클릭 콜백 이벤트
     * @param {{ [propName: string]: string }} items 이력 날짜를 키로 갖고, url을 vlaue로 갖는 Object
     */
    constructor(separatorClass, prefix, onclick, items) {
      const title = createElement('p', {
        class: `term-history-title`,
        child: '이전 약관 이력은 아래에서 확인할 수 있습니다.',
      });
      const list = createElement('ul', {
        class: `term-history-list font-text-subtitle2 font-color-regular`,
      });
      const element = createElement('div', {
        class: `term-history ${separatorClass || ''}`,
      });

      _list.set(this, list);
      _element.set(this, element);
      _prefix.set(this, prefix);
      _onclick.set(this, onclick);
      _separatorClass.set(this, separatorClass);

      appendAllChild(element, [title, list]);
      Object.entries(items).forEach(([key, value]) => this.addItem(key, value));
    }

    get element() {
      return _element.get(this);
    }

    get prefix() {
      return _prefix.get(this);
    }

    get separatorClass() {
      return _separatorClass.get(this);
    }

    addItem(key, link) {
      const list = _list.get(this);
      const onClick = _onclick.get(this);

      const prefix = createElement('p', { child: this.prefix });
      const date = createElement('p', { child: key });

      const item = createElement('li', { child: [prefix, date] });
      item.addEventListener('click', () => onClick(link));
      appendAllChild(list, item);
    }
  }

  return History;
})();
