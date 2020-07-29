import { createElement } from '../util/dom';
import { circleIcon } from './Icon';

/**
 * @description 압력값이 보이지 않는 Textfield 컴포넌트
 * @property {string} text 실제 입력된 문자열
 * @property {number} max 최대 입력될 수 있는 문자열 길이
 * @property {number} max 최대 입력될 수 있는 문자열 길이
 * @property {(char: string) => boolean} validateCharFunc 입력한 문자가 유효한 문자인지 검증하는 함수
 * @property {(value: string) => boolean} validateStringFunc Textfield의 값이 맞는지 검증하는 함수
 * @property {(value: string, validate: boolean) => void} onChangeFunc Textfield 값이 변할 때 실행되는 함수
 * @property {HTMLElement} input Input Element
 * @property {HTMLElement} secret Dummy Text Element
 * @property {HTMLElement} wrapper Secret Textfield Wrapper Element
 * @property {HTMLElement} element Secret Textfield Element
 */
class SecretTextfield {
  /**
   * @description SecretTextfield Class 생성자
   * @typedef {object} option
   * @property {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
   * @property {number} max Textfield의 문자열 최대 길이
   * @property {string} placeholder Textfield의 placeholder
   * @property {string} label Textfield의 label 문자열
   * @property {(char: string) => boolean} validateCharFunc 입력한 문자가 유효한 문자인지 검증하는 함수
   * @property {(value: string) => boolean} validateStringFunc Textfield의 값이 맞는지 검증하는 함수
   * @property {(value: string, validate: boolean) => void} onChangeFunc Textfield 값이 변할 때 실행되는 함수
   * @param {option} option SecretTextfield의 옵션 값
   */
  constructor(option) {
    this.text = '';
    this.max = typeof option.max === 'number' ? option.max : Infinity;
    this.validateCharFunc = option.validateCharFunc || (() => true);
    this.validateStringFunc = option.validateStringFunc || (() => true);
    this.onChangeFunc = option.onChangeFunc || (() => {});

    const label = createElement('label', {
      for: this.separatorClass || 'secret-textfield-input',
      child: option.label || '',
    });
    this.input = createElement('input', {
      type: 'text',
      id: this.separatorClass || 'secret-textfield-input',
      placeholder: option.placeholder || '',
    });
    this.secret = createElement('div', {
      class: 'secret-textfield-text',
    });
    this.wrapper = createElement('div', {
      class: `wrapper textfield ${option.separatorClass || ''}`,
      child: [label, this.input, this.secret],
    });
    this.element = createElement('div', {
      class: `container secret-textfield ${option.separatorClass || ''}`,
      child: this.wrapper,
    });

    this.input.addEventListener('keydown', (event) => {
      event.preventDefault();
      // backspace 입력시 문자 삭제
      if (event.keyCode === 8) this.deleteChar();
      // 허용 범위의 키가 입력됐을 시 문자 추가
      else this.addChar(String.fromCharCode(event.keyCode));
    });

    this.secret.addEventListener('click', (event) => {
      event.preventDefault();
      this.input.focus();
    });
  }

  /**
   * @description 입력이 안료됐는지 검사합니다.
   * @returns {boolean} 입력 완료 여부
   */
  get isDone() {
    return this.validateStringFunc(this.text);
  }

  /**
   * @description 문자를 삭제합니다.
   */
  deleteChar() {
    if (this.text.length > 0) {
      this.text = this.text.slice(0, -1);
      this.input.value = this.input.value.slice(0, -1);

      // 동그라미를 한개 삭제합니다.
      this.secret.removeChild(this.secret.lastChild);

      this.onChangeFunc(this.text, this.isDone);
    }
  }

  /**
   * @description 문자를 추가합니다.
   * @param {string} char 추가할 문자
   */
  addChar(char) {
    if (this.validateCharFunc(char) && this.text.length < this.max) {
      this.text += char;
      this.input.value += ' ';

      // 동그라미를 한개 추가합니다.
      const circle = circleIcon(14, '#0056d0');
      this.secret.appendChild(circle);

      this.onChangeFunc(this.text, this.isDone);
    }
  }

  /**
   * @description Textfield를 에러 상태로 변형시킵니다.
   * @param {string} message 에러 메시지
   */
  error(message) {
    this.wrapper.setAttribute('error-message', message);
    this.wrapper.classList.add('textfield-error-message');
    this.wrapper.classList.add('textfield-error');
  }
}

export default SecretTextfield;
