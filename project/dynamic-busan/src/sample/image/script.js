import '../../style/main.css';
import { emptyAlarmImage } from '../../js/image';

if (window) {
  window.onload = function () {
    const emptyAlarmContainer = document.getElementsByClassName(
      'empty-alarm-image',
    )[0];
    emptyAlarmContainer.appendChild(emptyAlarmImage());
  };
}
