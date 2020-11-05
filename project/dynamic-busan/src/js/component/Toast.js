import * as model from './model/Toast.model';

/* Toast 메시지 컴포넌트 */

export default class Toast {
  constructor() {
    model.createToast(this);
  }

  /**
   * @description Toast Message를 보여줍니다.
   * @param {string} str Message 내용
   * @param {number} time Message가 보여지는 시간
   */
  show(str, time) {
    model.show(
      typeof str === 'string' ? str : '',
      typeof time === 'number' ? time : Infinity,
      this,
    );
  }
}
