import { createElementNS, appendAllChild } from '../util/dom';

/**
 * @description Empty Alarm SVG Image을 생성합니다.
 * @param {number} size Image을 크기
 * @returns {HTMLElement} Empty Alarm SVG Image
 */
export function emptyAlarmImage(size = 200) {
  const xmlns = 'http://www.w3.org/2000/svg';

  const wrapper = createElementNS(xmlns, 'g', {
    fill: 'none',
    'fill-rule': 'evenodd',
  });

  const p1 = createElementNS(xmlns, 'path', {
    fill: '#F2F2F2',
    'fill-rule': 'nonzero',
    d:
      'M25.29 187.5c-1.795 0-3.25-1.455-3.25-3.25s1.455-3.25 3.25-3.25 3.25 1.455 3.25 3.25c-.005 1.793-1.457 3.245-3.25 3.25zm0-5c-.711-.016-1.362.4-1.645 1.052-.284.653-.144 1.412.353 1.92.498.51 1.253.667 1.912.398.659-.268 1.09-.909 1.09-1.62-.005-.949-.761-1.723-1.71-1.75z',
  });

  const p2 = createElementNS(xmlns, 'g', {
    fill: '#E0E0E0',
    'fill-rule': 'nonzero',
  });
  const p2c1 = createElementNS(xmlns, 'path', {
    d:
      'M6.5 5c-.414 0-.75-.336-.75-.75V.75c0-.414.336-.75.75-.75s.75.336.75.75v3.5c-.005.412-.338.745-.75.75zM6.5 13c-.2.003-.392-.075-.533-.217-.142-.14-.22-.333-.217-.533v-3.5c0-.414.336-.75.75-.75s.75.336.75.75v3.5c0 .414-.336.75-.75.75zM0 6.5c0-.414.336-.75.75-.75h3.5c.414 0 .75.336.75.75s-.336.75-.75.75H.75c-.2.003-.392-.075-.533-.217C.075 6.893-.003 6.7 0 6.5zM8 6.5c0-.414.336-.75.75-.75h3.5c.414 0 .75.336.75.75s-.336.75-.75.75h-3.5c-.2.003-.392-.075-.533-.217-.142-.14-.22-.333-.217-.533z',
    transform: 'translate(187)',
  });
  p2.appendChild(p2c1);

  const p3 = createElementNS(xmlns, 'g', {
    fill: '#E0E0E0',
    'fill-rule': 'nonzero',
  });
  const p3c1 = createElementNS(xmlns, 'path', {
    d:
      'M5 3.5c-.414 0-.75-.336-.75-.75v-2C4.25.336 4.586 0 5 0s.75.336.75.75v2c0 .414-.336.75-.75.75zM3.5 5.03c0 .414-.336.75-.75.75h-2c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2c.412.005.745.338.75.75zM10 5.03c0 .414-.336.75-.75.75h-2c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2c.412.005.745.338.75.75zM5 10.03c-.414 0-.75-.336-.75-.75v-2c0-.414.336-.75.75-.75s.75.336.75.75v2c0 .199-.079.39-.22.53-.14.141-.331.22-.53.22z',
    transform: 'translate(158 13)',
  });
  p3.appendChild(p3c1);

  const p4 = createElementNS(xmlns, 'g', {
    fill: '#E0E0E0',
    'fill-rule': 'nonzero',
  });
  const p4c1 = createElementNS(xmlns, 'path', {
    d:
      'M5 3.5c-.412-.005-.745-.338-.75-.75v-2C4.25.336 4.586 0 5 0s.75.336.75.75v2c-.005.412-.338.745-.75.75zM3.5 5c-.005.412-.338.745-.75.75h-2C.336 5.75 0 5.414 0 5s.336-.75.75-.75h2c.412.005.745.338.75.75zM10 5c-.005.412-.338.745-.75.75h-2c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2c.412.005.745.338.75.75zM5 10c-.412-.005-.745-.338-.75-.75v-2c0-.414.336-.75.75-.75s.75.336.75.75v2c-.005.412-.338.745-.75.75z',
    transform: 'translate(0 152)',
  });
  p4.appendChild(p4c1);

  const p5 = createElementNS(xmlns, 'path', {
    fill: '#F2F2F2',
    'fill-rule': 'nonzero',
    d:
      'M3.25 198.5c-1.795 0-3.25-1.455-3.25-3.25S1.455 192 3.25 192s3.25 1.455 3.25 3.25c-.005 1.793-1.457 3.245-3.25 3.25zm0-5c-.708 0-1.346.426-1.617 1.08-.27.654-.12 1.407.38 1.907s1.253.65 1.907.38c.654-.271 1.08-.91 1.08-1.617 0-.966-.784-1.75-1.75-1.75z',
  });

  const p6 = createElementNS(xmlns, 'path', {
    fill: '#B0B0B0',
    'fill-rule': 'nonzero',
    d:
      'M178.85 145.81h-47L99.88 170l4.3-24.19H29.51c-3.805 0-6.89-3.085-6.89-6.89V65.24c0-1.826.726-3.578 2.019-4.868 1.292-1.291 3.045-2.015 4.871-2.012h149.34c3.8 0 6.88 3.08 6.88 6.88v73.68c0 3.801-3.079 6.884-6.88 6.89z',
    opacity: '.17',
    style: 'mix-blend-mode:multiply',
  });

  const p7 = createElementNS(xmlns, 'path', {
    fill: '#F7F7F7',
    'fill-rule': 'nonzero',
    d:
      'M170.49 137.65h-47l-32 24.19 4.29-24.19H21.15c-3.8 0-6.88-3.08-6.88-6.88V57.08c0-3.8 3.08-6.88 6.88-6.88h149.34c1.826-.003 3.579.721 4.871 2.012 1.293 1.29 2.019 3.042 2.019 4.868v73.69c0 1.826-.726 3.578-2.019 4.868-1.292 1.291-3.045 2.015-4.871 2.012z',
  });

  const p8 = createElementNS(xmlns, 'rect', {
    width: '68',
    height: '6',
    x: '95',
    y: '75',
    fill: '#E5E5E5',
    rx: '3',
  });

  const p9 = createElementNS(xmlns, 'rect', {
    width: '68',
    height: '6',
    x: '95',
    y: '89',
    fill: '#E5E5E5',
    rx: '3',
  });

  const p10 = createElementNS(xmlns, 'rect', {
    width: '68',
    height: '6',
    x: '95',
    y: '103',
    fill: '#E5E5E5',
    rx: '3',
  });

  const p11 = createElementNS(xmlns, 'circle', {
    cx: '54.05',
    cy: '92.46',
    r: '25',
    fill: '#E5E5E5',
    'fill-rule': 'nonzero',
  });

  const p12 = createElementNS(xmlns, 'path', {
    fill: '#FFF',
    d:
      'M50.55 104c-.048-.937.297-1.851.952-2.523.655-.672 1.56-1.04 2.498-1.017 1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5c-.923.022-1.815-.335-2.468-.99-.652-.654-1.007-1.547-.982-2.47M51.16 80.16v14.6c.125 1.503 1.382 2.66 2.89 2.66 1.508 0 2.765-1.157 2.89-2.66V80c-.155-1.504-1.439-2.637-2.95-2.603-1.511.034-2.743 1.224-2.83 2.733v.03z',
  });

  appendAllChild(wrapper, [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12]);
  return createElementNS(xmlns, 'svg', {
    xmlns,
    width: size.toString(),
    height: size.toString(),
    viewBox: '0 0 200 200',
    child: wrapper,
  });
}
