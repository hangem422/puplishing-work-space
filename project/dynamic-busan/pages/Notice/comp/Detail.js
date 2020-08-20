import TextPost, { contentParser } from '../../../src/js/layout/TextPost';
import ShowDetail from '../../../src/js/layout/ShowDetail';

/**
 * @description Json 데이터를 기반으로 이용약관 상세 페이지를 생성합니다.
 * @param {{ title: string, date: string, contents: Array, from: string  }[]} data 약관 데이터
 * @returns {ShowDetail} Term Detail Page
 */
function createDetailPage(data) {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  const textPostList = data.map((notice) => {
    const textPostPage = new TextPost();
    textPostPage.title = notice.title;
    textPostPage.subtitle = notice.date;
    textPostPage.contents = contentParser({ contents: notice.contents });
    textPostPage.footer = notice.from;
    return textPostPage.element;
  });

  return new ShowDetail('notice-detail', textPostList);
}

export default createDetailPage;
