import { createElement, appendAllChild } from '../util/dom';

/**
 * @description 내용이 문자열일 게시글의 레이아웃 컴포넌트
 * @property {HTMLElement} element TextPost Element
 * @property {HTMLElement} titleElement Header Title Element
 * @property {HTMLElement} subtitleElement Header Subtitle Element
 * @property {HTMLElement} contentWrapper Content Wrapper Element
 * @property {HTMLElement} footerWrapper Footer Wrapper Element
 */
class TextPost {
  /**
   * @description TextPost Component 생성자
   * @param {string} title 게시글의 제목 문자열
   * @param {string} subtitle 게시글의 부제목 문자열
   * @param {string[]} contents 게시글 내용 문자열 리스트
   * @param {string | HTMLElement} footer 게시글 푸터 문자열 혹은 HTMLElement
   */
  constructor(title = '', subtitle = '', contents = [], footer = '') {
    // Component Element를 생성합니다.
    const titleElement = createElement('p', {
      class: 'font-text-body1 font-medium font-color-dark header-title',
      child: title,
    });
    const subtitleElement = createElement('p', {
      class:
        'font-text-subtitle2 font-medium font-color-regular header-subtitle',
      child: subtitle,
    });
    const contentElementList = contents.map((str) =>
      createElement('p', { child: str }),
    );

    // Layout을 구성합니다.
    const headerWrapper = createElement('div', {
      class: 'wrapper text-post-header',
      child: [titleElement, subtitleElement],
    });
    const contentWrapper = createElement('div', {
      class: 'wrapper font-text-body2 font-color-medium text-post-content',
      child: contentElementList,
    });
    const footerWrapper = createElement('div', {
      class: 'wrapper font-text-body2 font-color-dark text-post-footer',
      child: footer,
    });

    this.element = createElement('div', {
      class: 'container text-post-container',
      child: [headerWrapper, contentWrapper, footerWrapper],
    });

    // 내용 수정을 용이하게 하기위해 수정이 있을 수 있는 Element 미리 할당
    this.titleElement = titleElement;
    this.subtitleElement = subtitleElement;
    this.contentWrapper = contentWrapper;
    this.footerWrapper = footerWrapper;
  }

  /**
   * @description 제목을 수정합니다.
   * @param {string} title 게시글의 제목 문자열
   */
  set title(title) {
    this.titleElement.innerHTML = title;
  }

  /**
   * @description 부제목을 수정합니다.
   * @param {string} subtitle 게시글의 부제목 문자열
   */
  set subtitle(subtitle) {
    this.subtitleElement.innerHTML = subtitle;
  }

  /**
   * @description 게시글 내용을 수정합니다.
   * @param {string[]} contents 게시글의 내용 문자열 리스트
   */
  set contents(contents) {
    this.contentWrapper.innerHTML = '';
    const contentElementList = contents.map((str) =>
      createElement('p', { child: str }),
    );
    appendAllChild(this.contentWrapper, contentElementList);
  }

  /**
   * @description 게시글 푸터를 수정합니다.
   * @param {string | HTMLElement} footer 게시글 푸터 문자열 혹은 HTMLElement
   */
  set footer(footer) {
    this.footerWrapper.innerHTML = '';
    appendAllChild(this.footerWrapper, footer);
  }
}

export default TextPost;
