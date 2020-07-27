import '../../style/main.css';
import { dropDownIcon, moreRight } from '../../js/component/Icon';

if (window) {
  window.onload = function () {
    document
      .getElementsByClassName('icon-more-right')[0]
      .appendChild(dropDownIcon());

    document
      .getElementsByClassName('icon-drop-down')[0]
      .appendChild(moreRight());
  };
}
