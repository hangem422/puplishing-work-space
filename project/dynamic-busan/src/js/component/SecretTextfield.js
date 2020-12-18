import * as model from './model/SecretTextfiedl.model';

/* 입력값이 보이지 않는 Textfield 컴포넌트 */

export default class SecretTextfield {
  /**
   * @typedef {object} options
   * @property {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
   * @property {number} max Textfield의 문자열 최대 길이
   * @property {string} label Textfield의 label 문자열
   * @property {string} type Textfield의 type
   * @property {string} placeholder Textfield의 placeholder
   * @property {(char: string) => boolean} validateCharFunc 입력한 문자가 유효한 문자인지 검증하는 함수
   * @property {(value: string) => boolean} validateStringFunc Textfield의 값이 맞는지 검증하는 함수
   * @property {(value: string, validate: boolean) => void} onChangeFunc Textfield 값이 변할 때 실행되는 함수
   * @param {options} options SecretTextfield의 옵션 값
   */
  constructor(options) {
    model.createSecretTextfield(
      typeof options.separatorClass === 'string' ? options.separatorClass : '',
      typeof options.max === 'number' ? options.max : Infinity,
      typeof options.label === 'string' ? options.label : '',
      typeof options.type === 'string' ? options.type : '',
      typeof options.placeholder === 'string' ? options.placeholder : '',
      typeof options.validateCharFunc === 'function'
        ? options.validateCharFunc
        : () => true,
      typeof options.validateStringFunc === 'function'
        ? options.validateStringFunc
        : () => true,
      typeof options.onChangeFunc === 'function'
        ? options.onChangeFunc
        : () => {},
      this,
    );
  }

  get text() {
    return model.getText(this);
  }

  get element() {
    return model.getElement(this);
  }

  get isDone() {
    return model.isDone(this);
  }

  /**
   * @description Textfield 값이 변할 때 실행되는 함수 변경
   * @param {(value: string, validate: boolean) => void} onChangeFunc
   */
  setOnChangeFunc(onChangeFunc) {
    if (typeof onChangeFunc === 'function') {
      model.setOnChangeFunc(onChangeFunc, this);
    }
  }

  /**
   * @description 문자를 전부 삭제합니다.
   */
  deleteAll() {
    model.deleteAll(this);
  }

  /**
   * @description Textfield를 에러 상태로 변형시킵니다.
   * @param {string} message 에러 메시지
   */
  error(message) {
    if (typeof message === 'string') model.error(message, this);
  }
}
