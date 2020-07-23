/**
 * @description HTMl Elemnt의 Attribute 값을 한번에 설정하게 도와줍니다.
 * @param {HTMLElement} element Attribute를 추가할 Element
 * @param {{ [propName: string]: string }} attrObj 추가할 Attribute
 */
export function setAttributeAll(element, attrObj) {
  Object.entries(attrObj).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
}

/**
 * @description HTMl Elemnt를 Class와 Attribute를 추가하여 만듭니다.
 * @param {string} tagName HTML Element의 tag 이름
 * @param {{ [propName: string]: string } | undefined} attrObj 추가할 Attribute
 * @returns {HTMLElement} 생성한 HTML Element
 */
export function createElementWithOption(tagName, attrObj) {
  const element = document.createElement(tagName);
  if (attrObj) setAttributeAll(element, attrObj);
  return element;
}

/**
 * @description HTMl Elemnt를 NameSpace, Class 그리고 Attribute를 추가하여 만듭니다.
 * @param {string} nameSpace HTML Element의 Name Space
 * @param {string} tagName HTML Element의 tag 이름
 * @param {string | undefined} className HTML Element의 Class
 * @param {{ [propName: string]: string } | undefined} attrObj 추가할 Attribute
 * @returns {HTMLElement} 생성한 HTML Element
 */
export function createElementNSWithOption(nameSpace, tagName, attrObj) {
  const element = document.createElementNS(nameSpace, tagName);
  if (attrObj) setAttributeAll(element, attrObj);
  return element;
}

/**
 * @description HTMl Elemnt에 Child를 한번에 추가하도록 도와줍니다.
 * @param {HTMLElement} element 자식을 추가할 HTML Element
 * @param {HTMLElement[]} childList Child에 추가할 Element 리스트
 */
export function appendAllChild(element, childList) {
  childList.forEach((child) => element.appendChild(child));
}
