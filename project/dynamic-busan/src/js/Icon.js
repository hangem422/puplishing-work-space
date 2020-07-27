import { createElementNS } from './util/dom';

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
