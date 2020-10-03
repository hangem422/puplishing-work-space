import { createElement } from '../../../src/js/util/dom';
import ShowDetail from '../../../src/js/layout/ShowDetail';

/**
 * @description Json 데이터를 기반으로 이용약관 상세 페이지를 생성합니다.
 * @param {{ 
   title: string,
   date: string,
   iframe?: string,
   link?: string,
  }[]} data 약관 데이터
 * @returns {ShowDetail} Term Detail Page
 */
function createDetailPage(data) {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  const textPostList = data.map((term) => {
    if (term.link) return createElement('div');
    return createElement('iframe', { src: term.iframe });
  });

  return new ShowDetail('term-detail', textPostList);
}

export default createDetailPage;
