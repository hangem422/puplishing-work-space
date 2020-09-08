import '../../style/main.css';
import { emptyAlarmImage } from '../../js/component/Image';

if (window) {
  window.onload = function () {
    document
      .getElementsByClassName('empty-alarm-image')[0]
      .appendChild(emptyAlarmImage());
  };
}
