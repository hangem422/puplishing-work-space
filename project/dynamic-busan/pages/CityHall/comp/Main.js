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
  const footerEnforce = createElement('p', {
    child: `본 개인정보 수집 및 이용은 ${year}년${month}월${date}일부터 적용됩니다.`,
  });

  // const line = createElement('hr');

  // const footerHistory = new History(
  //   'administarion',
  //   '개인정보 수집 및 이용 동의',
  //   historyOnclick,
  //   data.history,
  // ).element;

  const footer = createElement('div', {
    child: [
      footerEnforce,
      // line,
      // footerHistory,
    ],
  });

  return new TextPost(data.title, subTitle, data.contents, footer).element;
}

export default createMainPage;
