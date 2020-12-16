/**
 * @description data가 Child Property에 적합한 타입인지 검사하고, 아닐경우 적절하게 변형합니다.
 * @param {*} data Child Property로 사용될 데이터
 * @returns {HTMLElement | HTMLElement[] | string | string[] | null}
 */
export function filterToValidChild(data) {
  // 데이터가 배열일 경우
  if (Array.isArray(data)) {
    return data.filter((val) => val instanceof HTMLElement);
  }

  // 데이터가 벼열이 아닐 경우
  return typeof data === 'string' || data instanceof HTMLElement ? data : null;
}

/**
 * @description HTMl Elemnt에 Child를 한번에 추가하도록 도와줍니다.
 * @param {HTMLElement} element 자식을 추가할 HTML Element
 * @param {HTMLElement | HTMLElement[] | string} child Element 추가할 Child
 */
export function appendAllChild(element, child) {
  // ChildList가 List로 제대로 왔을 떄
  if (Array.isArray(child)) {
    child.forEach((node) => {
      if (node instanceof HTMLElement || node instanceof Element) {
        element.appendChild(node);
      } else if (typeof node === 'string') {
        element.innerHTML += node;
      }
    });
  }
  // ChildList가 단일 Element일 때
  else if (child instanceof HTMLElement || child instanceof Element) {
    element.appendChild(child);
  }
  // ChildList가 단일 String일 때
  else if (typeof child === 'string') {
    element.innerHTML = child;
  }
}

/**
 * @description HTMl Elemnt의 Attribute 값을 한번에 설정하게 도와줍니다.
 * @param {HTMLElement} element Attribute를 추가할 Element
 * @param {{ [propName: string]: string }} attrObj 추가할 Attribute
 */
export function setAttributeAll(element, attrObj) {
  Object.entries(attrObj).forEach(([key, value]) => {
    if (value !== undefined) element.setAttribute(key, value);
  });
}

/**
 * @description HTMl Elemnt를 Class, Attribute 그리고 Child를 추가하여 생성합니다.
 * @param {string} tagName HTML Element의 tag 이름
 * @param {{ class?: string, child?: HTMLElement | HTMLElement[] | string, [propName: string]: string } | undefined} option 추가할 Class, Attribute, Child
 * @returns {HTMLElement} 생성한 HTML Element
 */
export function createElement(tagName, option = {}) {
  const attrObj = { ...option };

  // Element를 생성합니다.
  const element = document.createElement(tagName);
  // option에 child가 존재할 시 append 시키고 object에서 제거합니다.
  if (attrObj.child) {
    appendAllChild(element, attrObj.child);
    delete attrObj.child;
  }

  // Attribute와 Class를 추가합니다.
  setAttributeAll(element, attrObj);
  return element;
}

/**
 * @description HTMl Elemnt를 NameSpace, Class 그리고 Attribute를 추가하여 만듭니다.
 * @param {string} nameSpace HTML Element의 Name Space
 * @param {string} tagName HTML Element의 tag 이름
 * @param {{ class?: string, child?: HTMLElement | HTMLElement[] | string, [propName: string]: string } | undefined} option 추가할 Class, Attribute, Child
 * @returns {HTMLElement} 생성한 HTML Element
 */
export function createElementNS(nameSpace, tagName, option) {
  const attrObj = { ...option };

  // Element를 생성합니다.
  const element = document.createElementNS(nameSpace, tagName);
  // option에 child가 존재할 시 append 시키고 object에서 제거합니다.
  if (attrObj.child) {
    appendAllChild(element, attrObj.child);
    delete attrObj.child;
  }

  // Attribute와 Class를 추가합니다.
  setAttributeAll(element, attrObj);
  return element;
}

/**
 * @description HTMl Elemnt를 wrapper와 container로 감쌉니다.
 * @param {string} separatorClass 다른 컨테이너와 구분할 수 있는 고유 Class
 * @param {HTMLElement | HTMLElement[] | string} child Element 추가할 Child
 */
export function wrapping(separatorClass, child) {
  const wrapper = createElement('div', { class: 'wrapper', child });
  return createElement('div', {
    class: `container ${separatorClass || ''}`,
    child: wrapper,
  });
}
