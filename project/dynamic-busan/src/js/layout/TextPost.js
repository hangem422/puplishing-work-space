import { createElement, appendAllChild } from '../util/dom';

/**
 * @description 약관 데이터의 content를 HTMLElement로 파싱합니다.
 * @typedef {object} contents 파싱될 Contents의 포멧
 * @property {string?} title 문단의 제목
 * @property {contents | string[]} contents 문단의 내용
 * @param {contents} contents HTMLElement로 파싱할 약관 데이터
 */
export function contentParser(contents) {
  const stack = [[contents, 0]];
  const que = [];
  const mem = {};

  // 트리 배열로 데이터를 정렬합니다.
  while (stack.length) {
    const [cur, depth] = stack.pop();

    // 데이터가 String 값이면 리프 노드로 판단합니다.
    if (typeof cur === 'string') {
      const paragraph = createElement('p', {
        class: 'font-text-body2 font-color-medium',
        child: cur,
      });
      que.push([paragraph, depth]);
    }
    // 후위 순위 방식을 사용합니다.
    else if (cur.contents) {
      const container = createElement('div', {
        class: `content-item depth-${depth}`,
      });
      if (cur.title) {
        const title = createElement('p', {
          class: 'content-item-title font-text-body2 font-color-dark',
          child: cur.title,
        });
        if (depth === 1) title.classList.add('font-medium');
        container.appendChild(title);
      }
      que.push([container, depth]);

      // 왼쪽 노드부터 순회하도록 정렬합니다.
      for (let i = cur.contents.length - 1; i >= 0; i -= 1) {
        stack.push([cur.contents[i], depth + 1]);
      }
    } else {
      throw new Error('Wrong Template');
    }
  }

  [mem[0]] = que.shift();

  // 트리 배열을 순회하면서 부모 노드에 자식 노드를 append 시킵니다.
  while (que.length) {
    const [cur, depth] = que.shift();
    mem[depth - 1].appendChild(cur);
    mem[depth] = cur;
  }

  // 루트 노드를 반환합니다.
  return mem[0];
}

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
   * @param {string | HTMLElement} contents 게시글 내용 문자열 혹은 HTMLElemnt
   * @param {string | HTMLElement} footer 게시글 푸터 문자열 혹은 HTMLElement
   */
  constructor(title = '', subtitle = '', contents, footer = '') {
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

    // Layout을 구성합니다.
    const headerWrapper = createElement('div', {
      class: 'wrapper text-post-header',
      child: [titleElement, subtitleElement],
    });
    const contentWrapper = createElement('div', {
      class: 'wrapper text-post-content',
      child: contents,
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
    if (contents instanceof HTMLElement || Array.isArray(contents)) {
      this.contentWrapper.appendChild(contents);
    } else if (typeof contents === 'string') {
      this.contentWrapper.innerHTML = contents;
    }
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
