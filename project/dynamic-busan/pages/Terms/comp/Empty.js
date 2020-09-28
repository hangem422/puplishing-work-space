import { createElement, wrapping } from '../../../src/js/util/dom';
import { emptyAlarmImage } from '../../../src/js/component/image';

/* ------------- */
/*  Config Data  */
/* ------------- */

const EMPTY_PAGE_TEXT = '아직 등록된 이용약관이 없습니다.';

/**
 * @description 이용 약관이 없을 시 빈 페이지를 생성합니다.
 * @returns {HTMLElement} 빈 화면 Element
 */
function createEmptyPage() {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  const image = emptyAlarmImage();
  const text = createElement('div', {
    class: 'font-text-body1 font-color-light empty-page-text',
    child: EMPTY_PAGE_TEXT,
  });

  return wrapping('empty-page', [image, text]);
}

export default createEmptyPage;
