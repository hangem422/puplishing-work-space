import '../../style/main.css';
import ListBoard from '../../js/ListBoard';

if (window) {
  window.onload = function () {
    const root = document.getElementsByClassName('root')[0];

    const testItemList = [];
    for (let i = 0; i < 5; i += 1) {
      const item = document.createElement('p');
      item.classList = 'font-text-body1 font-medium font-color-dark';
      item.innerHTML = 'Test Case Text';
      testItemList.push(item);
    }
    const itemOnClick = (index, item) => alert(`${index}: ${item.innerHTML}`);

    const listBoard = new ListBoard('test-board', testItemList, itemOnClick);
    root.appendChild(listBoard.element);
  };
}
