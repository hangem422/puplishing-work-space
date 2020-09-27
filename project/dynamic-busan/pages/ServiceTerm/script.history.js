import './style.css';
import data from './data.json';

import createMainPage from './comp/Main';

if (window) {
  window.onload = function () {
    document
      .getElementsByClassName('root')[0]
      .appendChild(createMainPage(data));
  };
}
