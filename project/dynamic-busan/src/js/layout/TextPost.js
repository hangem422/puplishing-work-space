import { filterToValidChild, appendAllChild } from '../util/dom';
import * as model from './model/TextPost.model';

/* TextPost Layout Element */

class TextPost {
  /**
   * @description TextPost Component 생성자
   * @param {string} title 게시글의 제목 문자열
   * @param {string} subtitle 게시글의 부제목 문자열
   * @param {string | HTMLElement | HTMLElement[]} contents 게시글 내용 문자열 혹은 HTMLElemnt
   * @param {string | HTMLElement | HTMLElement[]} footer 게시글 푸터 문자열 혹은 HTMLElement
   */
  constructor(title, subtitle, contents, footer) {
    model.createTextPost(
      typeof title === 'string' ? title : '',
      typeof subtitle === 'string' ? subtitle : '',
      filterToValidChild(contents),
      filterToValidChild(footer),
      this,
    );
  }

  get element() {
    return model.getElement(this);
  }

  /**
   * @description 제목을 수정합니다.
   * @param {string} title 게시글의 제목 문자열
   */
  set title(title) {
    const titleElement = model.getTitleElement(this);
    titleElement.innerHTML = typeof title === 'string' ? title : '';
  }

  /**
   * @description 부제목을 수정합니다.
   * @param {string} subtitle 게시글의 부제목 문자열
   */
  set subtitle(subtitle) {
    const subtitleElement = model.getSubtitleElement(this);
    subtitleElement.innerHTML = typeof subtitle === 'string' ? subtitle : '';
  }

  /**
   * @description 게시글 내용을 수정합니다.
   * @param {string | HTMLElement | HTMLElement[]} contents 게시글의 내용 문자열 리스트
   */
  set contents(contents) {
    const contentWrapper = model.getContentWrapper(this);
    contentWrapper.innerHTML = '';
    appendAllChild(contentWrapper, filterToValidChild(contents));
  }

  /**
   * @description 게시글 푸터를 수정합니다.
   * @param {string | HTMLElement | HTMLElement[]} footer 게시글 푸터 문자열 혹은 HTMLElement
   */
  set footer(footer) {
    const footerWrapper = model.getFooterWrapper(this);
    footerWrapper.innerHTML = '';
    appendAllChild(this.footerWrapper, filterToValidChild(footer));
  }
}

export default TextPost;
