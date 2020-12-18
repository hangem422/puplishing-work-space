import { createElement } from '../../util/dom';
import { circleIcon } from '../Icon';
import { isIOS } from '../../util/os';

/**
 * @description 실제 입력된 문자열
 * @type {WeakMap<object, string>}
 */
const _text = new WeakMap();

/**
 * @description 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @type {WeakMap<object, string>}
 */
const _separatorClass = new WeakMap();

/**
 * @description Textfield의 문자열 최대 길이
 * @type {WeakMap<object, number>}
 */
const _max = new WeakMap();

/**
 * @description Textfield의 문자열 타입
 * @type {WeakMap<object, string>}
 */
const _type = new WeakMap();

/**
 * @description 입력한 문자가 유효한 문자인지 검증하는 함수
 * @type {WeakMap<object, (char: string) => boolean>}
 */
const _validateCharFunc = new WeakMap();

/**
 * @description Textfield의 값이 맞는지 검증하는 함수
 * @type {WeakMap<object, (value: string) => boolean>}
 */
const _validateStringFunc = new WeakMap();

/**
 * @description Textfield 값이 변할 때 실행되는 함수
 * @type {WeakMap<object, (value: string, validate: boolean) => void>}
 */
const _onChangeFunc = new WeakMap();

/**
 * @description 숨겨진 Textfield Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _input = new WeakMap();

/**
 * @description 보여지는 Textfield Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _secret = new WeakMap();

/**
 * @description SecretTextfield Element
 * @type {WeakMap<object, HTMLElement>}
 */
const _element = new WeakMap();

export function setText(text, thisArg) {
  _text.set(thisArg, text);
}

export function getText(thisArg) {
  return _text.get(thisArg);
}

export function setSeparatorClass(separatorClass, thisArg) {
  _separatorClass.set(thisArg, separatorClass);
}

export function getSeparatorClass(thisArg) {
  return _separatorClass.get(thisArg);
}

export function setMax(max, thisArg) {
  _max.set(thisArg, max);
}

export function getMax(thisArg) {
  return _max.get(thisArg);
}

export function setType(type, thisArg) {
  _type.set(thisArg, type);
}

export function getType(thisArg) {
  return _type.get(thisArg);
}

export function setValidateCharFunc(validateCharFunc, thisArg) {
  _validateCharFunc.set(thisArg, validateCharFunc);
}

export function getValidateCharFunc(thisArg) {
  return _validateCharFunc.get(thisArg);
}

export function setValidateStringFunc(validateStringFunc, thisArg) {
  _validateStringFunc.set(thisArg, validateStringFunc);
}

export function getValidateStringFunc(thisArg) {
  return _validateStringFunc.get(thisArg);
}

export function setOnChangeFunc(onChangeFunc, thisArg) {
  _onChangeFunc.set(thisArg, onChangeFunc);
}

export function getOnChangeFunc(thisArg) {
  return _onChangeFunc.get(thisArg);
}

export function setInput(input, thisArg) {
  _input.set(thisArg, input);
}

export function getInput(thisArg) {
  return _input.get(thisArg);
}

export function setSecret(secret, thisArg) {
  _secret.set(thisArg, secret);
}

export function getSecret(thisArg) {
  return _secret.get(thisArg);
}

export function setElement(element, thisArg) {
  _element.set(thisArg, element);
}

export function getElement(thisArg) {
  return _element.get(thisArg);
}

/**
 * @description os에 따라 수정되어야 하는 타입값을 변환합니다.
 * @param {string} type Input Type
 * @returns {string}
 */
export function parsingType(type) {
  if (!type) return 'text';
  if (type === 'number' && isIOS) return 'tel';
  return type;
}

/**
 * @description 숨겨진 Input에 입력될 값
 * @param {this} thisArg
 * @returns {string}
 */
export function getDummyString(thisArg) {
  const type = _type.get(thisArg);

  if (type === 'number' || type === 'tel') return '0';
  return ' ';
}

/**
 * @description 입력이 안료됐는지 검사합니다.
 * @param {this} thisArg
 * @returns {boolean} 입력 완료 여부
 */
export function isDone(thisArg) {
  const validateString = _validateStringFunc.get(thisArg);

  return validateString(_text.get(thisArg));
}

/**
 * @description 문자를 삭제합니다.
 * @param {this} thisArg
 */
export function deleteChar(thisArg) {
  const text = _text.get(thisArg);
  const secret = _secret.get(thisArg);
  const onChange = _onChangeFunc.get(thisArg);

  if (text.length > 0) {
    const newText = text.slice(0, -1);
    _text.set(thisArg, newText);
    secret.removeChild(secret.lastChild);

    // text 전부 삭제되면 placeholder를 보여줍니다.
    if (newText.length === 0) secret.classList.add('empty');

    onChange(newText, isDone(thisArg));
  }
}

/**
 * @description 문자를 전부 삭제합니다.
 * @param {this} thisArg
 */
export function deleteAll(thisArg) {
  let text = _text.get(thisArg);

  while (text.length > 0) {
    deleteChar();
    text = _text.get(thisArg);
  }
}

/**
 * @description 문자를 추가합니다.
 * @param {string} char 추가 할 문자
 * @param {this} thisArg
 */
export function addChar(char, thisArg) {
  const validateChar = _validateCharFunc.get(thisArg);
  const onChange = _onChangeFunc.get(thisArg);
  const text = _text.get(thisArg);
  const max = _max.get(thisArg);
  const secret = _secret.get(thisArg);
  const input = _input.get(thisArg);

  if (validateChar(char) && text.length < max) {
    // placeholder를 숨깁니다.
    if (secret.classList.contains('empty')) {
      secret.classList.remove('empty');
    }

    const newText = text + char;
    _text.set(thisArg, newText);
    input.value += getDummyString(thisArg);
    secret.appendChild(circleIcon(14, '#0056d0'));

    onChange(newText, isDone(thisArg));
  }
}

/**
 * @description Textfield를 에러 상태로 변형시킵니다.
 * @param {string} message 에러 메시지
 */
export function error(message, thisArg) {
  const element = _element.get(thisArg);
  const secret = _secret.get(thisArg);

  element.setAttribute('error-message', message);
  element.classList.add('secret-textfield-error');
  secret.classList.add('error');
}

/**
 * @description SecretTextfield에서 사용할 Proerty를 초기화합니다.
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {number} max Textfield의 문자열 최대 길이
 * @param {string} type Textfield의 type
 * @param {this} thisArg
 */
function initVariable(separatorClass, max, type, thisArg) {
  _text.set(thisArg, '');
  _separatorClass.set(thisArg, separatorClass);
  _max.set(thisArg, max);
  _type.set(thisArg, parsingType(type));
}

/**
 * @description SecretTextfield의 Callback에서 사용할 Function를 초기화합니다.
 * @param {(char: string) => boolean} validateChar 입력한 문자가 유효한 문자인지 검증하는 함수
 * @param {(value: string) => boolean} validateString Textfield의 값이 맞는지 검증하는 함수
 * @param {(value: string, validate: boolean) => void} onChange Textfield 값이 변할 때 실행되는 함수
 * @param {this} thisArg
 */
function initFunctions(validateChar, validateString, onChange, thisArg) {
  _validateCharFunc.set(thisArg, validateChar);
  _validateStringFunc.set(thisArg, validateString);
  _onChangeFunc.set(thisArg, onChange);
}

/**
 * @description SecretTextfield Element를 초기화합니다.
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {string} label Textfield의 label 문자열
 * @param {string} type Textfield의 type
 * @param {string} placeholder Textfield의 placeholder
 * @param {this} thisArg
 */
function initElement(separatorClass, label, type, placeholder, thisArg) {
  const labelElement = createElement('label', {
    for: `secret-textfield-input ${separatorClass}`,
    child: label,
  });
  const inputElement = createElement('input', {
    id: `secret-textfield-input ${separatorClass}`,
    type: parsingType(type),
  });
  const secretElement = createElement('div', {
    placeholder,
    class: 'secret-textfield-text empty',
  });

  const element = createElement('div', {
    class: `secret-textfield ${separatorClass}`,
    child: [labelElement, inputElement, secretElement],
  });

  _input.set(thisArg, inputElement);
  _secret.set(thisArg, secretElement);
  _element.set(thisArg, element);
}

/**
 * @description SecretTextfield에서 사용하는 이벤트 리스너를 초기화합니다.
 * @param {this} thisArg
 */
function initEventListenr(thisArg) {
  const secret = _secret.get(thisArg);
  const input = _input.get(thisArg);

  // secret을 클릭하면 숨겨진 input에 포커스가 맞춰집니다.
  secret.addEventListener('click', () => {
    _input.get(thisArg).focus();
  });

  // input의 focus 여부에 맞춰 secret의 스타일을 변경합니다.
  input.addEventListener('focus', () => {
    _secret.get(thisArg).classList.add('focus');
  });
  input.addEventListener('blur', () => {
    _secret.get(thisArg).classList.remove('focus');
  });

  input.addEventListener('keyup', (event) => {
    // backspace 입력 시 문자 삭제
    if (event.keyCode === 8) deleteChar(thisArg);
    // 허용 범위의 키가 입력됐을 시 문자 추가
    else if (event.target.value.length > _text.get(thisArg).length) {
      const char = event.target.value.slice(-1);
      event.target.value = event.target.value.slice(0, -1);
      addChar(char, thisArg);
    }
  });
}

/**
 * @description SecretTextfield Component를 생성합니다.
 * @param {string} separatorClass 다른 Secret Textfield와 구분할 수 있는 고유 class
 * @param {number} max Textfield의 문자열 최대 길이
 * @param {string} label Textfield의 label 문자열
 * @param {string} type Textfield의 type
 * @param {string} placeholder Textfield의 placeholder
 * @param {(char: string) => boolean} validateChar 입력한 문자가 유효한 문자인지 검증하는 함수
 * @param {(value: string) => boolean} validateString Textfield의 값이 맞는지 검증하는 함수
 * @param {(value: string, validate: boolean) => void} onChange Textfield 값이 변할 때 실행되는 함수
 * @param {this} thisArg
 */
export function createSecretTextfield(
  separatorClass,
  max,
  label,
  type,
  placeholder,
  validateChar,
  validateString,
  onChange,
  thisArg,
) {
  initVariable(separatorClass, max, type, thisArg);
  initFunctions(validateChar, validateString, onChange, thisArg);
  initElement(separatorClass, label, type, placeholder, thisArg);
  initEventListenr(thisArg);
}
