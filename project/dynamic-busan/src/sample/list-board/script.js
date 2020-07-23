import '../../style/main.css';
import ListBoard from '../../js/ListBoard';
import { createElement } from '../../js/util/dom';

if (window) {
  window.onload = function () {
    const root = document.getElementsByClassName('root')[0];

    const testItemList = [];
    for (let i = 0; i < 5; i += 1) {
      const item = createElement('p', {
        class: 'font-text-body1 font-medium font-color-dark',
        child: 'Test Case Text',
      });
      testItemList.push(item);
    }
    const itemOnClick = (index, item) => alert(`${index}: ${item.innerHTML}`);

    const listBoard = new ListBoard('test-board', testItemList, itemOnClick);
    root.appendChild(listBoard.element);
  };
}
