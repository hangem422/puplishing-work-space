import { createElement } from '../util/dom';
import { circleIcon } from './Icon';
import { isIOS } from '../util/os';

/**
 * @description 숨겨진 Input에 입력될 값
 * @param {string} type Input Type
 * @returns {string}
 */
function getDummyString(type) {
  if (type === 'number') return '0';
  return ' ';
}

/**
 * @description os에 따라 수정되어야 하는 타입값을 변환해줍니다.
 * @param {string} type Input Type
 * @returns {string}
 */
function parsingType(type) {
  if (!type) return 'text';
  if (type === 'number' && isIOS) return 'tel';
  return type;
}

/**
 * @description 입력값이 보이지 않는 Textfield 컴포넌트
 * @property {string} text 실제 입력된 문자열
 * @property {number} max 최대 입력될 수 있는 문자열 길이
 * @property {(char: string) => boolean} validateCharFunc 입력한 문자가 유효한 문자인지 검증하는 함수
 * @property {(value: string) => boolean} validateStringFunc Textfield의 값이 맞는지 검증하는 함수
 * @property {(value: string, validate: boolean) => void} onChangeFunc Textfield 값이 변할 때 실행되는 함수
 * @property {HTMLElement} secret Dummy Text Element
 * @property {HTMLElement} wrapper Secret Textfield Wrapper Element
 * @property {HTMLElement} element Secret Textfield Element
 */
class SecretTextfield {
  /**
   * @description SecretTextfield Class 생성자
   * @typedef {object} options
   * @property {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
   * @property {number} max Textfield의 문자열 최대 길이
   * @property {string} type Textfield의 type
   * @property {string} placeholder Textfield의 placeholder
   * @property {string} label Textfield의 label 문자열
   * @property {(char: string) => boolean} validateCharFunc 입력한 문자가 유효한 문자인지 검증하는 함수
   * @property {(value: string) => boolean} validateStringFunc Textfield의 값이 맞는지 검증하는 함수
   * @property {(value: string, validate: boolean) => void} onChangeFunc Textfield 값이 변할 때 실행되는 함수
   * @param {options} options SecretTextfield의 옵션 값
   */
  constructor(options) {
    this.text = '';
    this.dummyText = getDummyString(options.type);
    this.separatorClass = options.separatorClass || '';
    this.max = typeof options.max === 'number' ? options.max : Infinity;
    this.validateCharFunc = options.validateCharFunc || (() => true);
    this.validateStringFunc = options.validateStringFunc || (() => true);
    this.onChangeFunc = options.onChangeFunc || (() => {});

    const label = createElement('label', {
      for: this.separatorClass || 'secret-textfield-input',
      child: options.label || '',
    });
    this.input = createElement('input', {
      id: this.separatorClass || 'secret-textfield-input',
      type: parsingType(options.type),
    });
    this.secret = createElement('div', {
      placeholder: options.placeholder,
      class: 'secret-textfield-text empty',
    });
    this.element = createElement('div', {
      class: `secret-textfield ${options.separatorClass || ''}`,
      child: [label, this.input, this.secret],
    });

    // secret을 클릭하면 숨겨진 input에 포커스가 맞춰집니다.
    this.secret.addEventListener('click', () => this.input.focus());

    // input의 focus 여부에 맞춰 secret의 스타일을 변경합니다.
    this.input.addEventListener('focus', () =>
      this.secret.classList.add('focus'),
    );
    this.input.addEventListener('blur', () =>
      this.secret.classList.remove('focus'),
    );

    this.input.addEventListener('keyup', (event) => {
      // backspace 입력 시 문자 삭제
      if (event.keyCode === 8) this.deleteChar();
      // 허용 범위의 키가 입력됐을 시 문자 추가
      else if (event.target.value.length > this.text.length) {
        const char = event.target.value.slice(-1);
        event.target.value = event.target.value.slice(0, -1);
        this.addChar(char);
      }
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
      this.secret.removeChild(this.secret.lastChild);

      // text 전부 삭제되면 placeholder를 보여줍니다.
      if (this.text.length === 0) {
        this.secret.classList.add('empty');
      }

      this.onChangeFunc(this.text, this.isDone);
    }
  }

  /**
   * @description 문자를 추가합니다.
   * @param {string} char 추가 할 문자
   */
  addChar(char) {
    if (this.validateCharFunc(char) && this.text.length < this.max) {
      // placeholder를 숨깁니다.
      if (this.secret.classList.contains('empty')) {
        this.secret.classList.remove('empty');
      }

      this.text += char;
      // NOTE: Type이 text와 number일 때만 고려했습니다.
      this.input.value += 0;
      this.secret.appendChild(circleIcon(14, '#0056d0'));

      this.onChangeFunc(this.text, this.isDone);
    }
  }

  /**
   * @description Textfield를 에러 상태로 변형시킵니다.
   * @param {string} message 에러 메시지
   */
  error(message) {
    this.element.setAttribute('error-message', message);
    this.element.classList.add('secret-textfield-error');
    this.secret.classList.add('error');
  }
}

export default SecretTextfield;
