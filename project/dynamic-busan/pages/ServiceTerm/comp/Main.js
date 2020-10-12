/* eslint-disable no-unused-vars */
import { createElement } from '../../../src/js/util/dom';
import TextPost from '../../../src/js/layout/TextPost';

/**
 * @description 현재 시행중인 서비스 이용 약관 페이지를 생성합니다.
 * @param {{ 
    title: string,
    date: string,
    history: { [propName: string]: string },
    contents: string,
  }} data
 * @param {(file: string) => void} historyOnclick 이력 항목 온클릭 이벤트 콜백 함수
 */
function createMainPage(data, historyOnclick) {
  /* ------------ */
  /*  Create View */
  /* ------------ */

  // Subtitle 생성
  const subTitle = `시행일 ${data.date}`;

  // Footer 생성
  const [year, month, date] = data.date.split('.');
  const footerEnforce = createElement('li', {
    child: `이 약관은 ${year}년 ${month}월 ${date}일부터 적용됩니다.`,
  });

  // const historyListItem = Object.keys(data.history).map((key) => {
  //   const item = createElement('li', {
  //     class: 'font-link',
  //     child: `비패스(B PASS)앱 서비스 이용약관 (${key})`,
  //   });
  //   item.addEventListener('click', () => historyOnclick(key));
  //   return item;
  // });
  // const historyList = createElement('ul', { child: historyListItem });
  // const footerHistory = createElement('li', {
  //   child: [
  //     '이전의 개인정보 처리방침은 아래에서 확인할 수 있습니다.',
  //     historyList,
  //   ],
  // });

  const footerTitle = createElement('p', { child: '부칙' });
  const footerContents = createElement('ul', {
    child: [
      footerEnforce,
      // footerHistory
    ],
  });
  const footer = [footerTitle, footerContents];

  return new TextPost(data.title, subTitle, data.contents, footer).element;
}

export default createMainPage;
