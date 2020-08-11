/**
 * @description 약관 데이터의 세부 내용을 보여줍니다.
 */
export function showDetail(detail, index) {
  for (let i = 0; i < detail.length; i += 1) {
    if (i === index) {
      detail[i].style.display = 'block';
      detail[i].style.width = '100%';
      detail[i].style.height = '100%';
    } else {
      detail[i].style.display = 'none';
    }
  }
}
