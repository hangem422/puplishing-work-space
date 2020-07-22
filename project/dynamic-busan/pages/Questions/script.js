import "./style.css";

import DrawerBoard from "../../src/js/DrawerBoard";
import { dropDownIcon } from "../../src/js/Icon";
import data from "./data.json";

/**
 * @description DrawerBoard Item의 Header Element를 만듭니다.
 * @param {string} title DrawerBoard Item의 제목
 * @return {HTMLLIElement} DrawerBoard Item의 Header Element
 */
function createItemHeader(title) {
  // Item의 Layout을 만듭니다.
  const container = document.createElement("div");
  container.className = "row-center header-custom-content";

  // Item Header의 내부를 구성 Element를 만듭니다.
  const titleElement = document.createElement("p");
  titleElement.className = "font-text-body1 font-color-dark";
  titleElement.innerHTML = title;
  const icon = dropDownIcon();

  // Item Layout을 구성합니다.
  container.appendChild(titleElement);
  container.appendChild(icon);
  return container;
}

/**
 * @description Item의 Content Element를 만듭니다.
 * @param {string[]} content Item의 내용 문자열 리스트
 * @return {HTMLLIElement} Item의 Content Element
 */
function createItemContent(content) {
  // Item의 Layout을 만듭니다.
  const container = document.createElement("div");
  container.className =
    "font-text-body2 font-color-medium  content-custom-content";

  // Item Contet 내부를 구성 Element를 만듭니다.
  content.forEach((str) => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = str;
    container.appendChild(paragraph);
  });

  return container;
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName("root")[0];

    // Drawer Board에 들어갈 Item List 생성합니다.
    const itemList = data.reduce((prev, cur) => {
      const header = createItemHeader(cur.title);
      const content = createItemContent(cur.content);
      return prev.concat({ header, content });
    }, []);

    // Drawer Board를 생성합니다.
    const drawerBoard = new DrawerBoard("question-board", itemList);
    root.appendChild(drawerBoard.element);
  };
}
