/**
 * @description Drop Down SVG Icon을 생성합니다.
 * @param {number} size Icon 크기
 * @param {string} color Icon 색상
 * @returns {HTMLElement} Drop Down Icon
 */
export function dropDownIcon(size = 16, color) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 16 16');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M1.41 3.89c.505-.48 1.299-.517 1.848-.11l.132.11L8 9.28l4.61-5.39c.505-.48 1.299-.517 1.848-.11l.132.11c.505.481.543 1.237.116 1.76l-.116.126-5.6 6.333c-.505.481-1.299.518-1.848.111l-.132-.11-5.6-6.334c-.547-.52-.547-1.365 0-1.885z',
  );
  if (color) path.setAttribute('fill', color);

  svg.appendChild(path);
  return svg;
}
