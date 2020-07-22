import "./style.css";

import data from "./data.json";

/**
 * @description YYYY.MM.DD를 YYYY년 MM월 DD일로 변경합니다.
 * @param {string} date YYYY.MM.DD
 * @returns {string} YYYY년 MM월 DD일
 */
function converDate(date) {
  const dateArr = date.split(".");
  dateArr[0] = `${dateArr[0]}년`;
  dateArr[1] = dateArr[1].length < 2 ? `0${dateArr[1]}월` : `${dateArr[1]}월`;
  dateArr[2] = dateArr[2].length < 2 ? `0${dateArr[2]}일` : `${dateArr[2]}일`;
  return dateArr.join(" ");
}

/**
 * @description 약관 Header Container를 생성합니다.
 * @param {string} title 헤더에 들어갈 제목
 * @param {string} subtitle 헤더에 들어갈 부제목
 * @return {HTMLLIElement} Header Container
 */
function createHeaderContainer(title, subtitle) {
  // Lavtout Element 생성합니다.
  const container = document.createElement("div");
  container.className = "container header";
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  // Component Element를 생성합니다.
  const titleElement = document.createElement("p");
  titleElement.className =
    "font-text-body1 font-medium font-color-dark header-title";
  titleElement.innerHTML = title;
  const subtitleElement = document.createElement("p");
  subtitleElement.className =
    "font-text-subtitle2 font-medium font-color-regular header-subtitle";
  subtitleElement.innerHTML = subtitle;

  // Layout을 구성합니다.
  wrapper.appendChild(titleElement);
  wrapper.appendChild(subtitleElement);
  container.appendChild(wrapper);
  return container;
}

/**
 * @description 약관 Content Container를 생성합니다.
 * @param {string} content Content에 들어갈 약관 내용
 * @return {HTMLLIElement} Content Container
 */
function createContentContainer(content) {
  // Lavtout Element 생성합니다.
  const container = document.createElement("div");
  container.className = "container content";
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  // Component Element를 생성합니다.
  const contentElement = document.createElement("p");
  contentElement.className = "font-text-body2 font-color-medium";
  contentElement.innerHTML = content;

  // Layout을 구성합니다.
  wrapper.appendChild(contentElement);
  container.appendChild(wrapper);
  return container;
}

/**
 * @description 약관 Date Container를 생성합니다.
 * @param {string} notice 약관 고지일
 * @param {string} enforce 약관 시행일
 * @return {HTMLLIElement} Date Container
 */
function createDateContainer(notice, enforce) {
  // Lavtout Element 생성합니다.
  const container = document.createElement("div");
  container.className = "container date";
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";

  // Component Element를 생성합니다.
  const listElement = document.createElement("ul");
  listElement.className = "font-text-body2 font-color-dark";
  const noticeElement = document.createElement("li");
  noticeElement.innerHTML = notice;
  const enforceElement = document.createElement("li");
  enforceElement.innerHTML = enforce;

  // Layout을 구성합니다.
  listElement.appendChild(noticeElement);
  listElement.appendChild(enforceElement);
  wrapper.appendChild(listElement);
  container.appendChild(wrapper);
  return container;
}

/**
 * @description Window Onload Callback
 */
if (window) {
  window.onload = function () {
    // Page를 Render할 Element를 가져옵니다.
    const root = document.getElementsByClassName("root")[0];

    // Page를 구성할 Element 생성합니다.
    const headerContainer = createHeaderContainer(
      data.title,
      `시행일 ${data.enforceDate}`
    );
    const contentContainer = createContentContainer(data.content);
    const dateContainer = createDateContainer(
      converDate(`고지일: ${data.noticeDate}`),
      converDate(`시행일: ${data.enforceDate}`)
    );

    // Page를 구성합니다.
    root.appendChild(headerContainer);
    root.appendChild(contentContainer);
    root.appendChild(dateContainer);
  };
}
