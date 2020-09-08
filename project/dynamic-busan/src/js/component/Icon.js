import { createElementNS } from '../util/dom';

/**
 * @description Drop Down SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} Drop Down Icon
 */
export function dropDownIcon(size = 16, color = '#000000') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const path = createElementNS(xmlns, 'path', {
    d:
      'M1.41 3.89c.505-.48 1.299-.517 1.848-.11l.132.11L8 9.28l4.61-5.39c.505-.48 1.299-.517 1.848-.11l.132.11c.505.481.543 1.237.116 1.76l-.116.126-5.6 6.333c-.505.481-1.299.518-1.848.111l-.132-.11-5.6-6.334c-.547-.52-.547-1.365 0-1.885z',
    fill: color,
  });

  return createElementNS(xmlns, 'svg', {
    xmlns,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 16 16',
    child: path,
  });
}

/**
 * @description More Right SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} More Right Icon
 */
export function moreRight(size = 16, color = '#000000') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const xlink = 'http://www.w3.org/1999/xlink';

  const defPath = createElementNS(xmlns, 'path', {
    id: 'ueq3dnggla',
    d: 'M0 0H16V16H0z',
  });
  const def = createElementNS(xmlns, 'defs', {
    child: defPath,
  });

  const use = createElementNS(xmlns, 'use');
  use.setAttributeNS(xlink, 'xlink:href', '#ueq3dnggla');
  const mask = createElementNS(xmlns, 'mask', {
    id: 'qwh3zhnq1b',
    fill: '#fff',
    child: use,
  });
  const path = createElementNS(xmlns, 'path', {
    fill: color,
    'fill-rule': 'nonzero',
    d:
      'M4.86 1.232c.391-.327.959-.303 1.322.036l.086.092 5 6c.281.337.307.813.077 1.175l-.077.105-5 6c-.353.424-.984.482-1.408.128-.392-.326-.47-.889-.203-1.307l.075-.101 4.465-5.361L4.732 2.64c-.327-.391-.303-.959.036-1.322l.092-.086z',
    mask: 'url(#qwh3zhnq1b)',
  });
  const g = createElementNS(xmlns, 'g', {
    fill: 'none',
    'fill-rule': 'evenodd',
    child: [mask, path],
  });

  return createElementNS(xmlns, 'svg', {
    xmlns,
    'xmlns:xlink': xlink,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 16 16',
    child: [def, g],
  });
}

/**
 * @description Circle Right SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} Circle Icon
 */
export function circleIcon(size = 18, color = '#000000') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const circle = createElementNS(xmlns, 'circle', {
    cx: '9',
    cy: '9',
    r: '9',
    fill: color,
    'fill-rule': 'evenodd',
  });

  return createElementNS(xmlns, 'svg', {
    xmlns,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 18 18',
    child: circle,
  });
}

/**
 * @description Check SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} Check Icon
 */
export function checkIcon(size = 16, color = '#000000') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const path = createElementNS(xmlns, 'path', {
    fill: color,
    d:
      'M12.81 3.777c.399-.382 1.032-.367 1.413.033.352.368.367.936.053 1.321l-.086.092-7.333 7c-.357.34-.902.367-1.288.079l-.093-.079-3.666-3.5c-.4-.381-.415-1.014-.033-1.413.352-.37.918-.41 1.317-.114l.096.08 2.976 2.841 6.644-6.34z',
  });

  return createElementNS(xmlns, 'svg', {
    xmlns,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 16 16',
    child: path,
  });
}

/**
 * @description Check Circle SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} Check Circle Icon
 */
export function checkCircle(size = 80, color = '#000000') {
  const xmlns = 'http://www.w3.org/2000/svg';
  const path = createElementNS(xmlns, 'path', {
    fill: color,
    'fill-rule': 'evenodd',
    d:
      'M40 0c22.091 0 40 17.909 40 40S62.091 80 40 80 0 62.091 0 40 17.909 0 40 0zm20.755 26.043c-1.265-1.338-3.375-1.396-4.712-.131L33.7 47.047l-9.71-9.437-.318-.273c-1.322-.998-3.211-.879-4.396.34-1.283 1.32-1.253 3.43.067 4.713l12.003 11.667.308.265c1.282.975 3.108.9 4.306-.234l24.664-23.333.286-.306c1.053-1.28 1.013-3.172-.155-4.406z',
  });

  return createElementNS(xmlns, 'svg', {
    xmlns,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 80 80',
    child: path,
  });
}
