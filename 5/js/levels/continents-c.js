/* =========================================================
   ANIT USTASI — Kıtalar (3): Güney Amerika, Okyanusya, Antarktika
   Kurtarıcı İsa, Las Lajas, Tiwanaku,
   Sidney Opera Binası, Moai (Ahu Tongariki), Nan Madol,
   Port Lockroy, Terra Nova Kulübesi, Güney Kutbu İstasyonu
   ========================================================= */

(function () {
  const AU = window.AU;
  const { onFaces, win, winRow, ringWins, balustrade, cornice, openingPts } = AU.shapes;
  const bar = (a, b, r, color) => ({ shape: 'bar', a, b, r, color, detail: true });

  // Ahşap kaplama tahta çizgileri (yatay), kutu gövdenin dört yüzünde
  const boards = (w, h, d, step, color) => {
    const out = [];
    for (let y = step; y < h - 0.02; y += step) out.push({ shape: 'box', size: [w + 0.012, 0.012, d + 0.012], at: [0, y, 0], color, detail: true });
    return out;
  };
  // Panjurlu pencere: çerçeve + cam + iki yanda kanat
  const shutterWin = (x, y, z, ry, w, h, glass, frame, shutter) => {
    const r = ((ry || 0) * Math.PI) / 180;
    const side = (k) => [x + Math.cos(r) * k, y, z - Math.sin(r) * k];
    return [
      ...win({ w, h, at: [x, y, z], rotY: ry, top: 'flat', color: glass, frame, fw: 0.03, mullion: true, glow: true }),
      ...(shutter ? [-1, 1].map((sx) => ({ shape: 'box', size: [w * 0.5, h, 0.03], at: side(sx * (w * 0.75 + 0.03)), rotY: ry, color: shutter })) : []),
    ];
  };

  /* ---------- Nan Madol: çapraz istiflenmiş bazalt sütun duvarı ---------- */
  const BAS = '#3b3a3c', BAS2 = '#4a494b';
  // Doğal altıgen bazalt sütunları: boyuna ve enine katmanlar halinde, düzensiz uzunluk ve hafif sapmalarla
  function logWall(len, layers) {
    const list = [];
    for (let k = 0; k < layers; k++) {
      const y = 0.09 + k * 0.18;
      if (k % 2 === 0) {
        for (const z of [-0.22, 0.22]) {
          list.push({ shape: 'cyl', rt: 0.09, rb: 0.095, h: len * 0.52, seg: 6, rotZ: 90, rotX: (k * 7 + z * 10) % 3, at: [len / 2, y, z], color: k % 4 ? BAS : BAS2, flat: true });
          list.push({ shape: 'cyl', rt: 0.085, rb: 0.09, h: len * 0.5, seg: 6, rotZ: 90, at: [-0.02, y + 0.005, z + 0.01], color: BAS2, flat: true });
        }
        // Aradaki moloz dolgu
        list.push({ shape: 'rock', size: [len - 0.1, 0.12, 0.24], seed: k * 13 + len, jitter: 0.03, at: [0, y - 0.07, 0], color: '#5a5552', detail: true });
      } else {
        for (let x = -len / 2 + 0.2; x <= len / 2 - 0.19; x += 0.5) {
          list.push({ shape: 'cyl', rt: 0.09, rb: 0.09, h: 0.66 + ((x * 7) % 3) * 0.04, seg: 6, rotX: 90, rotY: ((x * 11) % 5) - 2, at: [x, y, -0.33], color: BAS2, flat: true });
        }
      }
    }
    // Duvar tepesindeki eğreltiotu ve otlar
    for (let x = -len / 2 + 0.4; x < len / 2; x += 1.1) list.push({ shape: 'sphere', r: 0.12, seg: 6, rings: 4, scale: [1.5, 0.6, 1], at: [x, layers * 0.18 + 0.05, 0], color: '#4f7f3a', detail: true });
    return list;
  }

  /* ---------- Moai ---------- */
  const TUFF = '#7c7266';
  // Moai: tüf gövde, iri baş, çıkık kaş, uzun burun, büzük dudak, uzun kulaklar, karna uzanan ince parmaklı kollar
  const moai = [
    { shape: 'box', size: [0.52, 0.9, 0.42], color: TUFF },
    { shape: 'lathe', seg: 10, flat: true, color: TUFF, scale: [1, 1, 0.8], points: [[0.27, 0], [0.28, 0.4], [0.26, 0.8], [0.24, 0.92], [0, 0.92]] },
    // Kollar ve karın üzerinde birleşen uzun parmaklar
    ...[-1, 1].flatMap((sx) => [
      { shape: 'tube', r: 0.04, radial: 6, color: '#6f665a', pts: [[sx * 0.27, 0.85, -0.02], [sx * 0.28, 0.5, 0.08], [sx * 0.2, 0.3, 0.2], [sx * 0.08, 0.28, 0.23]] },
      ...[0, 1, 2].map((k) => ({ shape: 'box', size: [0.12, 0.015, 0.02], at: [sx * 0.1, 0.26 + k * 0.03, 0.235], color: '#5d554b', detail: true })),
    ]),
    // Baş: yan profili çıkık kaş ve çene ile kesilmiş blok
    { shape: 'extrude', pts: [[-0.22, 0], [0.18, 0], [0.24, 0.08], [0.22, 0.2], [0.26, 0.32], [0.22, 0.42], [0.26, 0.62], [0.2, 0.68], [0.18, 0.92], [-0.22, 0.92]], d: 0.44, rotY: -90, at: [0, 0.9, 0], color: '#857b6e' },
    { shape: 'box', size: [0.48, 0.07, 0.12], at: [0, 1.52, 0.2], color: '#6f665a' },                 // kaş
    { shape: 'extrude', pts: [[-0.06, 0], [0.06, 0], [0.04, 0.38], [-0.04, 0.38]], d: 0.12, at: [0, 1.12, 0.24], color: '#857b6e' }, // burun
    { shape: 'box', size: [0.12, 0.05, 0.08], at: [0, 1.1, 0.27], color: '#7c7266' },                // burun kanatları
    { shape: 'box', size: [0.2, 0.035, 0.04], at: [0, 1.02, 0.25], color: '#5d554b' },               // dudak
    ...[-0.12, 0.12].map((x) => ({ shape: 'box', size: [0.1, 0.06, 0.03], at: [x, 1.36, 0.22], color: '#5d554b', detail: true })), // göz çukuru
    ...[-1, 1].map((sx) => ({ shape: 'extrude', pts: [[-0.06, 0], [0.06, 0], [0.05, 0.5], [-0.04, 0.46]], d: 0.06, rotY: sx * 90, at: [sx * 0.24, 1.0, 0], color: '#6f665a' })), // uzun kulaklar
    // Likenler ve aşınma lekeleri
    ...[[0.12, 0.6, 0.21], [-0.15, 1.3, 0.2], [0.1, 1.75, 0.18]].map((p) => ({ shape: 'sphere', r: 0.04, scale: [1.6, 1, 0.3], at: p, color: '#9a9a6a', detail: true })),
  ];

  /* ---------- Antarktika renkleri ---------- */
  const SNOW = '#f4f7fa';

  AU.levelDefs.push(
    /* ---------------------------------------------- KURTARICI İSA */
    {
      id: 'cristo', name: 'Kurtarıcı İsa Heykeli', place: 'Rio de Janeiro, Brezilya', era: '1922 – 1931',
      theme: { sky: '#a9cfe8', fog: '#c6dde8', ground: '#4f7f45', pad: '#5f7a52' },
      intro: 'Corcovado Dağı\'nın zirvesini ve yamaçlarını kur, üstüne seyir terasını, şapeli ve kaideyi koy. Heykeli aşağıdan yukarı yerleştir: cüppe, açık kollar ve baş.',
      facts: [
        '1922–1931 yılları arasında Corcovado Dağı\'nın tepesine inşa edildi.',
        'Fransız heykeltıraş Paul Landowski tasarladı, mühendisi Heitor da Silva Costa\'dır.',
        'Heykel yaklaşık 30 m yüksekliğindedir; kaidesiyle birlikte 38 m\'ye ulaşır.',
        'Betonarme gövdesi sabuntaşı mozaiklerle kaplıdır; 2007\'de Dünyanın Yeni Yedi Harikası\'ndan biri seçildi.',
      ],
      parts: {
        peak: [
          { shape: 'rock', size: [5, 2.6, 4], seed: 121, jitter: 0.2, color: '#4f6b48' },
          // Granit zirvenin çıplak kaya yüzleri ve Atlantik ormanı kümeleri
          { shape: 'rock', size: [2.6, 1.2, 2.2], seed: 124, jitter: 0.12, at: [0.6, 1.5, -0.6], color: '#7d776c' },
          ...Array.from({ length: 10 }, (_, k) => [((k * 37) % 44) / 10 - 2.2, 0.8 + (k % 3) * 0.5, ((k * 23) % 34) / 10 - 1.7]).map((p, k) => ({ shape: 'sphere', r: 0.28 + (k % 3) * 0.06, seg: 8, rings: 6, at: p, color: k % 2 ? '#3f6a38' : '#4f7a42' })),
        ],
        slopeA: [
          { shape: 'rock', size: [2.5, 1.6, 3], seed: 122, jitter: 0.2, color: '#557552' },
          ...[[-0.6, 1.3, 0.4], [0.5, 1.2, -0.6], [0, 1.4, 0.9]].map((p, k) => ({ shape: 'sphere', r: 0.3, seg: 8, rings: 6, at: p, color: k % 2 ? '#3f6a38' : '#4f7a42' })),
        ],
        slopeB: [
          { shape: 'rock', size: [2.5, 1.6, 3], seed: 123, jitter: 0.2, color: '#557552' },
          ...[[0.6, 1.3, -0.4], [-0.5, 1.2, 0.6], [0, 1.4, -0.9]].map((p, k) => ({ shape: 'sphere', r: 0.3, seg: 8, rings: 6, at: p, color: k % 2 ? '#3f6a38' : '#4f7a42' })),
        ],
        terrace: [
          { shape: 'box', size: [3.2, 0.25, 3.2], color: '#cfc8b8' },
          // Portekiz mozaiği dalga deseni ve korkuluk
          ...Array.from({ length: 6 }, (_, k) => ({ shape: 'box', size: [3.0, 0.005, 0.06], at: [0, 0.25, -1.25 + k * 0.5], rotY: (k % 2 ? 4 : -4), color: '#3a3a3a', detail: true })),
          ...onFaces(balustrade(3.2, 0.2, '#e8e4da', [0, 0.25, 1.58], 0, 0.1)),
        ],
        chapel: [
          { shape: 'box', size: [1.4, 0.9, 1.4], color: '#d9d3c4' },
          ...win({ w: 0.4, h: 0.62, at: [0, 0, 0.7], top: 'round', color: '#4a3a30', frame: '#e8e4da', fw: 0.05 }),
          ...onFaces([{ shape: 'box', size: [1.42, 0.04, 0.04], at: [0, 0.78, 0.7], color: '#e8e4da' }]),
        ],
        pedestal: [
          { shape: 'box', size: [1.0, 1.0, 1.0], color: '#e8e4da' },
          // Art Deco kaide: dikey yivler ve kademeli üst başlık
          ...onFaces([-0.3, -0.15, 0, 0.15, 0.3].map((x) => ({ shape: 'box', size: [0.04, 0.8, 0.02], at: [x, 0.05, 0.5], color: '#d6d0c2', detail: true }))),
          { shape: 'box', size: [1.06, 0.1, 1.06], at: [0, 0.9, 0], color: '#d6d0c2' },
          { shape: 'box', size: [0.92, 0.06, 0.92], at: [0, 0.84, 0], color: '#cfc9bb' },
        ],
        robe: [
          // Sabuntaşı mozaik kaplı cüppe: dikey kıvrımlar, göğüste kalp, bel kuşağı
          { shape: 'lathe', seg: 20, color: '#e8e4da', points: [[0, 0], [0.45, 0], [0.42, 0.6], [0.38, 1.4], [0.34, 2.0], [0.26, 2.3], [0, 2.3]] },
          ...Array.from({ length: 16 }, (_, k) => (k / 16) * Math.PI * 2).map((a, k) => ({ shape: 'tube', r: 0.03 + (k % 2) * 0.012, radial: 5, color: k % 2 ? '#ddd8cc' : '#e8e4da', pts: [[Math.sin(a) * 0.45, 0.02, Math.cos(a) * 0.45], [Math.sin(a) * 0.41, 0.8, Math.cos(a) * 0.41], [Math.sin(a) * 0.36, 1.6, Math.cos(a) * 0.36], [Math.sin(a) * 0.3, 2.1, Math.cos(a) * 0.3]] })),
          { shape: 'torus', r: 0.39, tube: 0.03, radial: 5, seg: 20, rotX: 90, at: [0, 1.25, 0], color: '#d6d0c2' },
          { shape: 'sphere', r: 0.07, scale: [1, 1, 0.4], at: [0, 1.85, 0.3], color: '#d6d0c2' },
          ...[-0.12, 0.12].map((x) => ({ shape: 'sphere', r: 0.06, scale: [0.8, 0.5, 1.6], at: [x, 0, 0.42], color: '#ddd8cc' })), // ayaklar
        ],
        arms: [
          // Açık kollar: bol kollu cüppe sarkıntıları ve avuçları öne bakan eller
          { shape: 'tube', r: 0.11, radial: 8, color: '#e8e4da', pts: [[-1.5, 0.08, 0], [-0.8, 0.1, 0], [0, 0.12, 0], [0.8, 0.1, 0], [1.5, 0.08, 0]] },
          ...[-1, 1].flatMap((sx) => [
            { shape: 'extrude', pts: [[0, 0], [1.1, 0.02], [0.95, -0.36], [0.4, -0.44], [0.1, -0.3]], d: 0.06, at: [sx > 0 ? 0.25 : -0.25, 0.04, 0.05], rotY: sx > 0 ? 0 : 180, color: '#ddd8cc' },
            { shape: 'extrude', pts: [[0, 0], [1.1, 0.02], [0.95, -0.36], [0.4, -0.44], [0.1, -0.3]], d: 0.06, at: [sx > 0 ? 0.25 : -0.25, 0.04, -0.05], rotY: sx > 0 ? 0 : 180, color: '#ddd8cc' },
            { shape: 'box', size: [0.14, 0.2, 0.06], at: [sx * 1.56, -0.02, 0.02], color: '#ddd8cc' },
            ...[0, 1, 2, 3].map((k) => ({ shape: 'box', size: [0.025, 0.08, 0.025], at: [sx * (1.51 + k * 0.03), -0.08, 0.04], color: '#ddd8cc', detail: true })),
          ]),
        ],
        head: [
          { shape: 'sphere', r: 0.2, scale: [1, 1.15, 1], color: '#e8e4da' },
          { shape: 'cyl', rt: 0.09, rb: 0.11, h: 0.12, seg: 10, at: [0, -0.04, 0], color: '#ddd8cc' },
          // Omuza dökülen saçlar, sakal ve yüz hatları
          { shape: 'sphere', r: 0.21, scale: [1.05, 1.1, 0.9], at: [0, 0.05, -0.05], color: '#ddd8cc' },
          { shape: 'sphere', r: 0.1, scale: [1, 1.2, 0.7], at: [0, 0.08, 0.15], color: '#ddd8cc' },
          { shape: 'box', size: [0.04, 0.09, 0.05], at: [0, 0.24, 0.19], color: '#e8e4da' },
          ...[-0.06, 0.06].map((x) => ({ shape: 'box', size: [0.05, 0.012, 0.02], at: [x, 0.3, 0.18], color: '#bdb8ac', detail: true })),
        ],
      },
      structure: [
        { part: 'peak', pos: [0, 0, 0], ry: 0 },
        { part: 'slopeA', pos: [-3.4, 0, 0.4], ry: 0 },
        { part: 'slopeB', pos: [3.4, 0, -0.4], ry: 0 },
        { part: 'terrace', pos: [0, 2.6, 0], ry: 0 },
        { part: 'chapel', pos: [0, 2.85, 0], ry: 0 },
        { part: 'pedestal', pos: [0, 3.75, 0], ry: 0 },
        { part: 'robe', pos: [0, 4.75, 0], ry: 0 },
        { part: 'arms', pos: [0, 6.72, 0], ry: 0, after: ['robe'] },
        { part: 'head', pos: [0, 7.05, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- LAS LAJAS */
    {
      id: 'laslajas', name: 'Las Lajas Katedrali', place: 'Nariño, Kolombiya', era: '1916 – 1949',
      theme: { sky: '#b9d3e2', fog: '#cfdde2', ground: '#4f7a45', pad: '#5f7a6a' },
      intro: 'Derin kanyonun iki kaya duvarını kur, aralarına dev köprü kemerini ve tabliyeyi yerleştir. Köprünün üstüne kilisenin gövdesini, çatısını, gül pencereli cephesini ve üç sivri kuleyi koy.',
      facts: [
        'Guáitara Nehri kanyonunun içinde, nehrin üzerindeki bir köprüye oturur.',
        'Bugünkü Gotik Uyanış üslubundaki yapı 1916–1949 yılları arasında inşa edildi.',
        'Rivayete göre 18. yüzyılda kayalarda Meryem Ana tasviri görülmesi üzerine burası hac yeri oldu.',
        'Kilisenin arka duvarı, tasvirin bulunduğu kanyon kayasının kendisidir.',
      ],
      parts: {
        canyonL: [
          { shape: 'rock', size: [2.2, 4.0, 4.4], seed: 131, jitter: 0.2, color: '#6f6a5f' },
          // Kanyon duvarına asılı adak levhaları ve yosun kümeleri
          ...[[0.9, 1.4, 1.2], [0.95, 2.2, 0.4], [0.9, 1.8, -0.8]].map((p, k) => ({ shape: 'box', size: [0.03, 0.16, 0.24], at: p, color: k % 2 ? '#e8e4da' : '#d9cfb8', detail: true })),
          ...[[-0.4, 3.9, 0.8], [0.3, 3.95, -1.2], [0.6, 3.6, 1.6]].map((p, k) => ({ shape: 'sphere', r: 0.35, seg: 8, rings: 6, scale: [1.3, 0.7, 1], at: p, color: k % 2 ? '#4f7a42' : '#5f8a4a' })),
        ],
        canyonR: [
          { shape: 'rock', size: [2.2, 4.0, 4.4], seed: 132, jitter: 0.2, color: '#6f6a5f' },
          ...[[-0.9, 1.5, 1.0], [-0.95, 2.4, -0.2]].map((p) => ({ shape: 'box', size: [0.03, 0.16, 0.24], at: p, color: '#e8e4da', detail: true })),
          ...[[0.4, 3.9, -0.8], [-0.3, 3.95, 1.2]].map((p, k) => ({ shape: 'sphere', r: 0.35, seg: 8, rings: 6, scale: [1.3, 0.7, 1], at: p, color: k % 2 ? '#4f7a42' : '#5f8a4a' })),
        ],
        bridgeArch: [
          { shape: 'arch', w: 4.2, h: 2.4, d: 2.2, r: 1.6, spring: 0.6, color: '#a8a296' },
          { shape: 'box', size: [4.22, 0.1, 2.24], at: [0, 2.3, 0], color: '#bdb8ae' },
          // Kemer taşları, kesme taş sıraları
          ...[1.1, -1.1].map((z) => ({ shape: 'torus', r: 1.68, tube: 0.08, radial: 4, seg: 20, arc: Math.PI, at: [0, 0.6, z], color: '#bdb8ae', flat: true })),
          ...[0.3, 0.9, 1.5, 2.0].map((y) => ({ shape: 'box', size: [4.21, 0.012, 2.21], at: [0, y, 0], color: '#948e83', detail: true })),
        ],
        bridgeDeck: [
          { shape: 'box', size: [4.6, 0.3, 2.4], color: '#bdb8ae' },
          ...[-1.15, 1.15].flatMap((z) => balustrade(4.6, 0.25, '#e8e4da', [0, 0.3, z], 0, 0.12)),
          ...[-2.0, 2.0].flatMap((x) => [-1.15, 1.15].map((z) => ({ shape: 'cyl', rt: 0.03, rb: 0.04, h: 0.45, seg: 8, at: [x, 0.3, z], color: '#2f2f2f' }))),
          ...[-2.0, 2.0].flatMap((x) => [-1.15, 1.15].map((z) => ({ shape: 'sphere', r: 0.06, at: [x, 0.74, z], color: '#ffe6a0', glow: true }))),
        ],
        nave: [
          { shape: 'box', size: [1.8, 1.8, 2.2], color: '#c9c4ba' },
          // Gri-beyaz taş bantlar ve sivri vitray pencereler
          ...[0.3, 0.6, 0.9, 1.2, 1.5].map((y, k) => ({ shape: 'box', size: [1.82, 0.08, 2.22], at: [0, y, 0], color: k % 2 ? '#e8e4da' : '#9c978c' })),
          ...[0.9, -0.9].flatMap((x) => winRow({ n: 3, span: 1.4, at: [x, 0.35, 0], rotY: x > 0 ? 90 : -90, w: 0.2, h: 0.85, top: 'pointed', color: '#3a4f75', frame: '#e8e4da', fw: 0.03, mullion: true, glow: true, glowColor: '#9fb8ff' })),
          ...[0.9, -0.9].flatMap((x) => [-0.7, 0, 0.7].map((z) => ({ shape: 'box', size: [0.12, 1.8, 0.1], at: [x, 0, z + 0.35], color: '#9c978c' }))),
        ],
        naveRoof: [
          { shape: 'tri', w: 1.9, h: 0.7, d: 2.3, color: '#7d7f88' },
          ...[-0.6, 0, 0.6].map((z) => ({ shape: 'cone', r: 0.06, h: 0.3, seg: 4, at: [0, 0.68, z], color: '#d2cdc2' })),
        ],
        facade: [
          { shape: 'box', size: [2.6, 2.4, 0.4], color: '#d2cdc2' },
          // Gri ve beyaz taş şeritler, sivri kemerli üçlü portal, gül pencere, çatı tepelikleri
          ...[0.4, 0.8, 1.2, 1.6, 2.0].map((y) => ({ shape: 'box', size: [2.62, 0.1, 0.42], at: [0, y, 0], color: '#9c978c' })),
          ...win({ w: 0.56, h: 1.0, at: [0, 0, 0.2], top: 'pointed', color: '#3a2f27', frame: '#e8e4da', fw: 0.06 }),
          ...[-0.75, 0.75].flatMap((x) => win({ w: 0.3, h: 0.7, at: [x, 0, 0.2], top: 'pointed', color: '#3a2f27', frame: '#e8e4da', fw: 0.04 })),
          { shape: 'cyl', rt: 0.3, rb: 0.3, h: 0.04, seg: 24, rotX: 90, at: [0, 1.5, 0.2], color: '#3a4f75', glow: true, glowColor: '#9fb8ff' },
          { shape: 'torus', r: 0.32, tube: 0.04, at: [0, 1.5, 0.24], color: '#e8e4da' },
          ...Array.from({ length: 8 }, (_, k) => ({ shape: 'box', size: [0.02, 0.28, 0.03], at: [0, 1.5, 0.24], rotZ: k * 22.5, color: '#e8e4da', detail: true })),
          ...[-1.2, -0.6, 0.6, 1.2].map((x) => ({ shape: 'cone', r: 0.06, h: 0.35, seg: 4, at: [x, 2.4, 0.15], color: '#e8e4da' })),
          { shape: 'tri', w: 1.2, h: 0.4, d: 0.3, at: [0, 2.4, 0.05], color: '#d2cdc2' },
        ],
        spire: [
          { shape: 'cyl', rt: 0.26, rb: 0.28, h: 1.0, seg: 8, color: '#d2cdc2' },
          ...ringWins(4, 0.27, 0.25, { w: 0.1, h: 0.42, top: 'pointed', color: '#3a2f27', startDeg: 22.5 }),
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'cone', r: 0.035, h: 0.22, seg: 4, at: [Math.sin(a) * 0.27, 1.0, Math.cos(a) * 0.27], color: '#e8e4da' })),
          { shape: 'cone', r: 0.3, h: 1.4, seg: 8, at: [0, 1.0, 0], color: '#bdb8ae' },
          ...[0.4, 0.8].map((y) => ({ shape: 'cyl', rt: 0.3 * (1 - (y + 0.03) / 1.4), rb: 0.3 * (1 - y / 1.4), h: 0.03, seg: 8, at: [0, 1.0 + y, 0], color: '#9c978c', detail: true })),
          { shape: 'box', size: [0.02, 0.18, 0.02], at: [0, 2.38, 0], color: '#c9a646', metal: true },
          { shape: 'box', size: [0.1, 0.02, 0.02], at: [0, 2.5, 0], color: '#c9a646', metal: true },
        ],
        centralSpire: [
          { shape: 'cyl', rt: 0.3, rb: 0.34, h: 0.5, seg: 8, color: '#d2cdc2' },
          ...ringWins(8, 0.32, 0.1, { w: 0.08, h: 0.3, top: 'pointed', color: '#3a2f27' }),
          { shape: 'cone', r: 0.34, h: 1.8, seg: 8, at: [0, 0.5, 0], color: '#bdb8ae' },
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'cone', r: 0.04, h: 0.26, seg: 4, at: [Math.sin(a) * 0.33, 0.5, Math.cos(a) * 0.33], color: '#e8e4da' })),
          { shape: 'box', size: [0.025, 0.24, 0.025], at: [0, 2.28, 0], color: '#c9a646', metal: true },
          { shape: 'box', size: [0.12, 0.025, 0.025], at: [0, 2.44, 0], color: '#c9a646', metal: true },
        ],
      },
      structure: [
        { part: 'canyonL', pos: [-3.2, 0, 0], ry: 0 },
        { part: 'canyonR', pos: [3.2, 0, 0], ry: 0 },
        { part: 'bridgeArch', pos: [0, 0, 0], ry: 0 },
        { part: 'bridgeDeck', pos: [0, 2.4, 0], ry: 0 },
        { part: 'nave', pos: [0, 2.7, -0.15], ry: 0, after: ['bridgeDeck'] },
        { part: 'naveRoof', pos: [0, 4.5, -0.15], ry: 0 },
        { part: 'facade', pos: [0, 2.7, 1.0], ry: 0, after: ['bridgeDeck'] },
        { part: 'spire', pos: [-1.05, 5.1, 1.0], ry: 0 },
        { part: 'spire', pos: [1.05, 5.1, 1.0], ry: 0 },
        { part: 'centralSpire', pos: [0, 5.1, 1.0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- TİWANAKU */
    {
      id: 'tiwanaku', difficulty: 'Orta', name: 'Tiwanaku — Güneş Kapısı', place: 'La Paz, Bolivya', era: '~MS 500 – 1000',
      theme: { sky: '#a8c8e4', fog: '#cad9e2', ground: '#9a8a62', pad: '#b7a07c' },
      intro: 'And Dağları\'ndaki tören merkezini kur: Kalasasaya platformunu, arka sıradaki dev dikilitaşları, tek bloktan oyulmuş Güneş Kapısı\'nı, Ponce heykelini, giriş merdivenini ve önündeki çukur tapınağı yerleştir.',
      facts: [
        'Titicaca Gölü yakınında, yaklaşık 3.850 m yükseklikte kurulmuş bir And uygarlığının merkeziydi.',
        'Güneş Kapısı tek bir andezit bloktan oyulmuştur; üzerinde "Kapı Tanrısı" kabartması vardır.',
        'Kalasasaya, dev dikili taşlarla çevrili büyük bir tören platformudur.',
        '2000\'de UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        platform: [
          { shape: 'box', size: [6, 0.4, 5], color: '#b7a07c' },
          ...Array.from({ length: 12 }, (_, k) => ({ shape: 'rock', size: [0.5, 0.42, 0.06], seed: 170 + k, jitter: 0.02, at: [-2.75 + k * 0.5, 0, 2.5], color: k % 2 ? '#a8926f' : '#b29c78', detail: true })),
          { shape: 'box', size: [6.02, 0.04, 5.02], at: [0, 0.36, 0], color: '#a38c6e' },
        ],
        pillar: [
          // Kalasasaya duvarının dev dikme taşları ve aralarındaki dolgu taşları
          { shape: 'rock', size: [0.4, 2.0, 0.32], seed: 175, jitter: 0.03, color: '#8f7f6a' },
          { shape: 'rock', size: [0.5, 0.6, 0.2], seed: 176, jitter: 0.03, at: [0.45, 0, 0], color: '#a39074' },
          { shape: 'rock', size: [0.46, 0.45, 0.2], seed: 177, jitter: 0.03, at: [0.45, 0.6, 0], color: '#9a8768' },
          { shape: 'rock', size: [0.44, 0.35, 0.2], seed: 178, jitter: 0.03, at: [0.45, 1.05, 0], color: '#a39074' },
        ],
        gateOfSun: [
          // Tek blok andezit kapı: geçit, köşe nişleri, üstte Güneş Tanrısı (Viracocha) ve
          // üç sıra kanatlı figür, altında menderes kuşağı; sağ üst köşedeki kırık
          { shape: 'box', size: [0.55, 1.5, 0.32], at: [-0.55, 0, 0], color: '#7a6c5a' },
          { shape: 'box', size: [0.55, 1.5, 0.32], at: [0.55, 0, 0], color: '#7a6c5a' },
          { shape: 'box', size: [1.65, 0.55, 0.32], at: [0, 0.95, 0], color: '#7a6c5a' },
          { shape: 'box', size: [0.58, 1.0, 0.04], at: [0, 0, 0.15], color: '#4a4034' },
          ...[-0.55, 0.55].flatMap((x) => [0.3, 0.75].map((y) => ({ shape: 'box', size: [0.24, 0.3, 0.03], at: [x, y, 0.16], color: '#6a5d4c', detail: true }))),
          ...[0, 1, 2].flatMap((row) => Array.from({ length: 8 }, (_, i) => (i < 4 ? -0.72 + i * 0.12 : 0.36 + (i - 4) * 0.12)).map((x) => ({ shape: 'box', size: [0.08, 0.08, 0.03], at: [x, 1.12 + row * 0.11, 0.165], color: '#5f5444', detail: true }))),
          { shape: 'box', size: [0.26, 0.3, 0.05], at: [0, 1.12, 0.17], color: '#5f5444' },
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.02, 0.07, 0.02], at: [Math.sin(a) * 0.15, 1.27 + Math.cos(a) * 0.15, 0.18], rotZ: (-a * 180) / Math.PI, color: '#5f5444', detail: true })),
          ...Array.from({ length: 11 }, (_, i) => ({ shape: 'box', size: [0.1, 0.05, 0.03], at: [-0.75 + i * 0.15, 1.02, 0.165], rotZ: i % 2 ? 0 : 90, color: '#5f5444', detail: true })),
          { shape: 'rock', size: [0.2, 0.18, 0.33], seed: 179, jitter: 0.02, at: [0.75, 1.32, 0], color: '#6a5d4c' },
        ],
        ponce: [
          // Ponce monoliti: dikdörtgen gövde, kare yüz, kollarda kadeh ve asa, oyma desenli giysi
          { shape: 'box', size: [0.42, 1.2, 0.32], color: '#9a8366' },
          { shape: 'box', size: [0.44, 0.42, 0.34], at: [0, 1.2, 0], color: '#a38c6e' },
          ...[-0.12, 0.12].map((x) => ({ shape: 'box', size: [0.08, 0.08, 0.04], at: [x, 1.4, 0.17], color: '#5f5444' })),
          { shape: 'box', size: [0.12, 0.04, 0.03], at: [0, 1.28, 0.17], color: '#5f5444' },
          { shape: 'box', size: [0.46, 0.08, 0.36], at: [0, 0.75, 0], color: '#8a755a' },
          ...[-1, 1].flatMap((sx) => [
            { shape: 'box', size: [0.06, 0.4, 0.04], at: [sx * 0.18, 0.75, 0.16], color: '#8a755a' },
            { shape: 'cyl', rt: 0.04, rb: 0.03, h: 0.14, seg: 8, at: [sx * 0.08, 0.95, 0.19], color: '#8a755a' },
          ]),
          ...Array.from({ length: 6 }, (_, k) => ({ shape: 'box', size: [0.3, 0.02, 0.02], at: [0, 0.15 + k * 0.1, 0.165], color: '#7d6a50', detail: true })),
        ],
        sunkenTemple: [
          ...[[0, 1.2, 0], [0, -1.2, 0], [1.2, 0, 90], [-1.2, 0, 90]].map(([x, z, r]) => ({ shape: 'box', size: [2.6, 0.6, 0.25], at: [x, 0, z], rotY: r, color: '#a8926f' })),
          // Duvarlara geçmeli taş başlar (175 tenon başı)
          ...[[0, 1.2, 0], [0, -1.2, 180], [1.2, 0, 90], [-1.2, 0, -90]].flatMap(([x, z, r]) => [-0.8, -0.3, 0.3, 0.8].map((t) => {
            const rr = (r * Math.PI) / 180;
            const px = x + Math.cos(rr) * t - Math.sin(rr) * 0.14, pz = z - Math.sin(rr) * t - Math.cos(rr) * 0.14;
            return { shape: 'sphere', r: 0.07, scale: [1, 1.2, 0.9], at: [px, 0.26, pz], color: '#d9cdb4' };
          })),
          ...Array.from({ length: 4 }, (_, k) => ({ shape: 'rock', size: [0.3, 0.6, 0.26], seed: 180 + k, jitter: 0.02, at: [[1.2, -1.2][k % 2], 0, [1.2, -1.2][k >> 1]], color: '#8f7f6a' })),
        ],
        stairs: [
          ...[0, 1, 2].map((i) => ({ shape: 'box', size: [1.6, 0.14 * (i + 1), 0.3], at: [0, 0, 0.3 - i * 0.3], color: '#a8926f' })),
          ...[0, 1, 2].map((i) => ({ shape: 'box', size: [1.62, 0.02, 0.3], at: [0, 0.14 * (i + 1) - 0.02, 0.3 - i * 0.3], color: '#8f7f6a', detail: true })),
          ...[-0.75, 0.75].map((x) => ({ shape: 'rock', size: [0.3, 1.5, 0.3], seed: 185 + x * 10, jitter: 0.02, at: [x, 0, -0.4], color: '#8f7f6a' })),
          { shape: 'rock', size: [1.9, 0.3, 0.34], seed: 187, jitter: 0.02, at: [0, 1.5, -0.4], color: '#8f7f6a' },
        ],
      },
      structure: [
        { part: 'platform', pos: [0, 0, 0], ry: 0 },
        ...[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x) => ({ part: 'pillar', pos: [x - 0.2, 0.4, -2.2], ry: 0 })),
        { part: 'gateOfSun', pos: [-1.6, 0.4, 0.4], ry: 0 },
        { part: 'ponce', pos: [1.5, 0.4, 0.0], ry: 0 },
        { part: 'stairs', pos: [0, 0, 2.85], ry: 0 },
        { part: 'sunkenTemple', pos: [0, 0, 4.9], ry: 0 },
      ],
    },

    /* ---------------------------------------------- SİDNEY OPERA BİNASI */
    {
      id: 'operahouse', name: 'Sidney Opera Binası', place: 'Sidney, Avustralya', era: '1959 – 1973',
      theme: { sky: '#a9cfe8', fog: '#c5dce8', ground: '#5f8a55', pad: '#c9a38a' },
      intro: 'Kırmızı granit kaideyi ve önündeki geniş merdiveni kur. Ardından iki konser salonunun yelken biçimli kabuklarını büyükten küçüğe, birbirine sırt dönerek yerleştir; en sona küçük restoran kabuğunu ekle.',
      facts: [
        'Danimarkalı mimar Jørn Utzon\'un tasarımıdır; 1973\'te açıldı.',
        'Yelken biçimli kabuklar bir milyondan fazla beyaz ve krem rengi seramik karoyla kaplıdır.',
        'Kabukların karmaşık biçimi, hepsi aynı küreden kesilmiş parçalar olarak çözüldü.',
        '2007\'de UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: (function () {
        // Yelken kabuk: kaburgalı yarım küre parçası (beyaz-krem fayans şeritleri),
        // açık yüzünde bronz camlı cephe
        const sail = (r, sy, white, cream) => {
          // Sivri (ogival) kabuk profili: tabanda geniş, tepede keskin sırt
          const h = r * sy;
          const rad = (t) => r * Math.pow(Math.max(0, 1 - Math.pow(t, 1.8)), 0.75);
          const prof = Array.from({ length: 13 }, (_, k) => { const t = k / 12; return [rad(t), t * h]; });
          const list = [{ shape: 'lathe', points: prof, seg: 18, phi0: -Math.PI / 2, phi: Math.PI, color: white }];
          // Fayans şeritleri: meridyen boyunca kaburgalar (ortadaki sırt daha kalın)
          for (let k = 1; k < 12; k++) {
            const phi = -Math.PI / 2 + (k / 12) * Math.PI;
            const pts = prof.map(([x, y]) => [Math.sin(phi) * (x + 0.006), y + 0.003, Math.cos(phi) * (x + 0.006)]);
            list.push({ shape: 'tube', pts, r: k === 6 ? 0.028 : 0.011, radial: 4, color: k % 2 ? cream : white, detail: true });
          }
          // Açık uçtaki bronz camlı cephe ve dikey kayıtlar
          const glass = [...prof.map(([x, y]) => [x * 0.97, y * 0.97]), ...prof.slice(0, -1).reverse().map(([x, y]) => [-x * 0.97, y * 0.97])];
          list.push({ shape: 'extrude', pts: glass, d: 0.02, at: [0, 0, 0.02], color: '#6b5a3a', glow: true, glowColor: '#ffd79a', double: true });
          for (let k = 1; k < 8; k++) {
            const x = -r * 0.9 + (k * r * 1.8) / 8;
            const t = Math.pow(1 - Math.pow(Math.min(1, Math.abs(x) / (r * 0.97)), 1 / 0.75), 1 / 1.8);
            list.push({ shape: 'box', size: [0.015, t * h * 0.97, 0.03], at: [x, 0, 0.02], color: '#3a3226', detail: true });
          }
          return list;
        };
        return {
          podium: [
            { shape: 'box', size: [7, 0.6, 3.6], color: '#c9a38a' },
            { shape: 'box', size: [7.04, 0.06, 3.64], at: [0, 0.55, 0], color: '#b58d73' },
            // Pembe granit kaplama paneller ve yan girişler
            ...Array.from({ length: 14 }, (_, k) => ({ shape: 'box', size: [0.45, 0.4, 0.02], at: [-3.25 + k * 0.5, 0.08, 1.81], color: '#bf987f', detail: true })),
            ...[-2.9, 2.9].flatMap((x) => win({ w: 0.4, h: 0.4, at: [x, 0, 1.8], top: 'flat', color: '#3a3226', glow: true })),
          ],
          steps: [
            ...[0, 1, 2, 3].map((i) => ({ shape: 'box', size: [3.4, 0.15 * (i + 1), 0.3], at: [0, 0, 0.45 - i * 0.3], color: '#c9a38a' })),
            ...[0, 1, 2, 3].map((i) => ({ shape: 'box', size: [3.42, 0.02, 0.3], at: [0, 0.15 * (i + 1) - 0.02, 0.45 - i * 0.3], color: '#b58d73', detail: true })),
          ],
          shellL: sail(1.15, 1.75, '#f3f1ea', '#e6e0cf'),
          shellM: sail(0.95, 1.65, '#f1eee4', '#e3dccb'),
          shellS: sail(0.72, 1.5, '#efeadf', '#e0d9c7'),
          restaurant: [...sail(0.55, 1.3, '#f1eee4', '#e3dccb'), ...sail(0.45, 1.2, '#efeadf', '#e0d9c7').map((it) => ({ ...it, at: [(it.at || [0, 0, 0])[0], (it.at || [0, 0, 0])[1], (it.at || [0, 0, 0])[2] - 0.3], rotY: (it.rotY || 0) + 180 }))],
        };
      })(),
      structure: [
        { part: 'podium', pos: [0, 0, 0], ry: 0 },
        { part: 'steps', pos: [0, 0, 2.25], ry: 0 },
        { part: 'shellL', pos: [-1.6, 0.6, 0.55], ry: 0 },
        { part: 'shellM', pos: [-1.6, 0.6, -0.05], ry: 2 },
        { part: 'shellS', pos: [-1.6, 0.6, -0.75], ry: 0 },
        { part: 'shellL', pos: [1.3, 0.6, 0.55], ry: 0 },
        { part: 'shellM', pos: [1.3, 0.6, -0.05], ry: 2 },
        { part: 'shellS', pos: [1.3, 0.6, -0.75], ry: 0 },
        { part: 'restaurant', pos: [3.0, 0.6, 1.05], ry: 0 },
      ],
    },

    /* ---------------------------------------------- MOAİ (AHU TONGARİKİ) */
    {
      id: 'moai', name: 'Paskalya Adası Moaileri', place: 'Rapa Nui, Şili (Polinezya)', era: '~1250 – 1500',
      theme: { sky: '#a8cde6', fog: '#c8dde6', ground: '#7a9a55', pad: '#8a8178' },
      intro: 'Ahu Tongariki tören platformunu kur ve yedi moai heykelini sırayla üstüne dik. İki moainin başına kırmızı tüften "pukao" şapkalarını yerleştir.',
      facts: [
        'Rapa Nui halkı tarafından yontulan moai heykelleri atalarını temsil eder.',
        'Ahu Tongariki adadaki en büyük tören platformudur; 15 moai yan yana dizilir.',
        'Moailerin çoğu Rano Raraku yanardağının volkanik tüfünden yontulmuştur.',
        '1960 tsunamisinde devrilen heykeller 1990\'larda yeniden dikildi; Rapa Nui 1995\'te UNESCO Dünya Mirası oldu.',
      ],
      parts: {
        ahu: [
          { shape: 'box', size: [8.6, 0.6, 1.6], color: '#8a8178' },
          // Ön duvarın iri, düzgün kesilmiş bazalt blokları ve önündeki taş döşeme (rampa)
          ...Array.from({ length: 12 }, (_, i) => ({ shape: 'rock', size: [0.66, 0.4, 0.06], seed: 200 + i, jitter: 0.015, at: [-3.95 + i * 0.72, 0.05, 0.81], color: i % 2 ? '#7a7268' : '#837a6f' })),
          { shape: 'box', size: [8.6, 0.12, 0.5], at: [0, 0, 1.05], color: '#77706a' },
          ...Array.from({ length: 16 }, (_, i) => ({ shape: 'rock', size: [0.3, 0.06, 0.26], seed: 220 + i, jitter: 0.02, at: [-4.0 + i * 0.53, 0.12, 1.06], color: '#8a8178', detail: true })),
        ],
        moai,
        pukao: [
          // Kırmızı skorya şapka: silindir, üstte topuz, altında oyuk
          { shape: 'cyl', rt: 0.26, rb: 0.24, h: 0.24, seg: 14, color: '#9c4a36', flat: true },
          { shape: 'cyl', rt: 0.13, rb: 0.16, h: 0.08, seg: 12, at: [0, 0.24, 0], color: '#8a3f2e' },
          ...[0.08, 0.16].map((y) => ({ shape: 'torus', r: 0.255, tube: 0.008, radial: 3, seg: 16, rotX: 90, at: [0, y, 0], color: '#7d3a2a', detail: true })),
        ],
      },
      structure: [
        { part: 'ahu', pos: [0, 0, 0], ry: 0 },
        ...[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((x) => ({ part: 'moai', pos: [x, 0.6, 0], ry: 0 })),
        { part: 'pukao', pos: [-2.4, 2.42, 0], ry: 0 },
        { part: 'pukao', pos: [1.2, 2.42, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- NAN MADOL */
    {
      id: 'nanmadol', difficulty: 'Orta', name: 'Nan Madol', place: 'Pohnpei, Mikronezya', era: '~1180 – 1628',
      theme: { sky: '#a5cfe6', fog: '#c3dde3', ground: '#3f86a6', pad: '#8f8a7a' },
      intro: 'Mercan kayalıkları üzerindeki yapay adacığı kur. Dört dış duvarı ve dört iç duvarı, çapraz istiflenmiş bazalt sütunlardan yükselt; ortaya kral mezarını yerleştir.',
      facts: [
        'Pohnpei adası açıklarında, mercan kayalıklarına kurulmuş yaklaşık 100 yapay adacıktan oluşan bir kenttir.',
        'Duvarlar, doğal olarak köşeli bazalt sütunların çapraz istiflenmesiyle örülmüştür.',
        'Saudeleur Hanedanı\'nın tören ve yönetim merkeziydi.',
        '2016\'da UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        islet: [{ shape: 'rock', size: [6.6, 0.5, 6.6], seed: 141, jitter: 0.12, color: '#8f8a7a' }],
        outerWall: logWall(5.8, 6),
        innerWall: logWall(3.0, 5),
        tomb: [
          // Kral mezarı (Nandauwas): bazalt sütun kapaklı kript ve giriş
          { shape: 'box', size: [1.0, 0.5, 1.0], color: BAS },
          ...[-0.3, -0.1, 0.1, 0.3].map((x) => ({ shape: 'cyl', rt: 0.08, rb: 0.085, h: 1.2, seg: 6, rotX: 90, at: [x, 0.58, -0.6], color: BAS2, flat: true })),
          ...[-0.2, 0, 0.2].map((x) => ({ shape: 'cyl', rt: 0.075, rb: 0.08, h: 1.1, seg: 6, rotX: 90, at: [x, 0.72, -0.55], color: BAS, flat: true })),
          { shape: 'box', size: [0.3, 0.32, 0.04], at: [0, 0, 0.51], color: '#1f1e20' },
          ...[0.12, 0.3].map((y) => ({ shape: 'box', size: [1.01, 0.012, 1.01], at: [0, y, 0], color: '#2c2b2d', detail: true })),
        ],
      },
      structure: [
        { part: 'islet', pos: [0, 0, 0], ry: 0 },
        { part: 'outerWall', pos: [0, 0.5, 2.7], ry: 0 },
        { part: 'outerWall', pos: [0, 0.5, -2.7], ry: 0 },
        { part: 'outerWall', pos: [2.7, 0.5, 0], ry: 1 },
        { part: 'outerWall', pos: [-2.7, 0.5, 0], ry: 1 },
        { part: 'innerWall', pos: [0, 0.5, 1.35], ry: 0 },
        { part: 'innerWall', pos: [0, 0.5, -1.35], ry: 0 },
        { part: 'innerWall', pos: [1.35, 0.5, 0], ry: 1 },
        { part: 'innerWall', pos: [-1.35, 0.5, 0], ry: 1 },
        { part: 'tomb', pos: [0, 0.5, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- PORT LOCKROY */
    {
      id: 'portlockroy', name: 'Port Lockroy', place: 'Goudier Adası, Antarktika', era: '1944',
      theme: { sky: '#bfd6ea', fog: '#dbe6ee', ground: '#e9eff4', pad: '#5a5650' },
      intro: 'Buzlu kayalık adacığı kur. Bransfield House\'u yerleştir: temel, siyah ahşap kulübe, çatı ve baca. Ardından giriş sundurmasını, yarım silindir Nissen barakasını, tekne barınağını ve bayrak direğini ekle.',
      facts: [
        'İkinci Dünya Savaşı sırasında gizli bir İngiliz harekâtı kapsamında 1944\'te kuruldu.',
        'Bransfield House bugün bir müze ve dünyanın en güneydeki postanelerinden biridir.',
        'Adacık bir Papua (gentoo) penguen kolonisine ev sahipliği yapar.',
        'Antarktika\'da turistlerin en çok ziyaret ettiği yerlerden biridir.',
      ],
      parts: {
        islet: [
          { shape: 'rock', size: [6, 0.6, 4.4], seed: 151, jitter: 0.15, color: '#5a5650' },
          // Kar lekeleri ve guano izleri
          ...[[-2.2, 0.58, -1.4], [1.8, 0.6, 1.6], [2.4, 0.55, -1.6], [-1.6, 0.6, 1.8]].map((p, k) => ({ shape: 'sphere', r: 0.45, seg: 8, rings: 5, scale: [1.6, 0.18, 1], at: p, color: k % 2 ? '#eef3f6' : '#f4f7fa' })),
        ],
        foundation: [
          { shape: 'box', size: [3.0, 0.3, 1.6], color: '#6f6a63' },
          ...Array.from({ length: 8 }, (_, k) => ({ shape: 'rock', size: [0.36, 0.28, 0.04], seed: 240 + k, jitter: 0.02, at: [-1.3 + k * 0.37, 0, 0.8], color: k % 2 ? '#7a756d' : '#65605a', detail: true })),
        ],
        hut: [
          // Bransfield House: siyah ahşap kaplama, kırmızı panjurlu beyaz çerçeveli pencereler
          { shape: 'box', size: [2.8, 1.3, 1.4], color: '#2b2b2e' },
          ...boards(2.8, 1.3, 1.4, 0.1, '#1f1f22'),
          ...[-0.75, -0.25, 0.25].flatMap((x) => shutterWin(x, 0.45, 0.7, 0, 0.26, 0.36, '#cfe0ea', '#f2f2ee', '#b0302a')),
          ...[-0.9, 0, 0.9].flatMap((x) => shutterWin(x, 0.5, -0.7, 180, 0.24, 0.34, '#cfe0ea', '#f2f2ee', '#b0302a')),
          ...win({ w: 0.36, h: 0.85, at: [1.0, 0, 0.7], top: 'flat', color: '#b0302a', frame: '#f2f2ee', fw: 0.03 }),
          ...[[1.4, 0.7], [-1.4, 0.7], [1.4, -0.7], [-1.4, -0.7]].map(([x, z]) => ({ shape: 'box', size: [0.06, 1.3, 0.06], at: [x, 0, z], color: '#f2f2ee' })),
        ],
        hutRoof: [
          { shape: 'tri', w: 1.6, h: 0.7, d: 3.0, rotY: 90, color: '#2f2f2f' },
          // Oluklu sac çatı çizgileri ve beyaz saçak tahtası
          ...Array.from({ length: 14 }, (_, k) => -1.4 + k * 0.215).flatMap((x) => [-1, 1].map((sz) => ({ shape: 'box', size: [0.015, 0.02, 0.9], at: [x, 0.35, sz * 0.4], rotX: sz * 41, color: '#3f3f3f', detail: true }))),
          ...[-1, 1].map((sx) => ({ shape: 'box', size: [0.04, 0.05, 0.95], at: [sx * 1.5, 0.35, 0], rotX: 0, color: '#f2f2ee', detail: true })),
        ],
        chimney: [
          { shape: 'box', size: [0.2, 0.5, 0.2], color: '#b0302a' },
          { shape: 'box', size: [0.24, 0.05, 0.24], at: [0, 0.5, 0], color: '#8a2420' },
          { shape: 'cyl', rt: 0.05, rb: 0.05, h: 0.1, seg: 8, at: [0, 0.55, 0], color: '#3a3a3a' },
        ],
        porch: [
          { shape: 'box', size: [0.9, 0.9, 0.7], color: '#2b2b2e' },
          ...boards(0.9, 0.9, 0.7, 0.1, '#1f1f22'),
          ...win({ w: 0.3, h: 0.7, at: [0, 0, 0.35], top: 'flat', color: '#b0302a', frame: '#f2f2ee', fw: 0.03 }),
          { shape: 'tri', w: 1.0, h: 0.25, d: 0.8, at: [0, 0.9, 0], color: '#2f2f2f' },
        ],
        nissen: [
          { shape: 'cyl', rt: 0.6, rb: 0.6, h: 1.8, seg: 16, rotX: 90, at: [0, 0, -0.9], color: '#7d8278' },
          // Oluklu metal kaburgalar ve ön duvar
          ...Array.from({ length: 10 }, (_, k) => -0.85 + k * 0.19).map((z) => ({ shape: 'torus', r: 0.605, tube: 0.012, radial: 3, seg: 16, arc: Math.PI, at: [0, 0, z], color: '#6a6f66', detail: true })),
          ...win({ w: 0.3, h: 0.5, at: [0, 0, 0.9], top: 'flat', color: '#3a3a3a', frame: '#f2f2ee' }),
        ],
        boatShed: [
          { shape: 'box', size: [1.0, 0.7, 1.2], color: '#4a4a4c' },
          ...boards(1.0, 0.7, 1.2, 0.1, '#3a3a3c'),
          { shape: 'box', size: [0.6, 0.55, 0.03], at: [0, 0, 0.61], color: '#b0302a' },
          { shape: 'tri', w: 1.1, h: 0.35, d: 1.3, at: [0, 0.7, 0], color: '#2f2f2f' },
        ],
        flag: [
          { shape: 'cyl', rt: 0.02, rb: 0.03, h: 1.6, seg: 6, color: '#dcdcdc' },
          // Birleşik Krallık bayrağı (dalgalı): mavi zemin, beyaz ve kırmızı çaprazlar
          { shape: 'box', size: [0.55, 0.32, 0.02], at: [0.28, 1.25, 0], color: '#1f3b7a' },
          ...[-31, 31].map((rz) => ({ shape: 'box', size: [0.62, 0.06, 0.025], at: [0.28, 1.41 - 0.03, 0], rotZ: rz, color: '#f2f2ee', detail: true })),
          { shape: 'box', size: [0.55, 0.1, 0.026], at: [0.28, 1.36, 0], color: '#f2f2ee' },
          { shape: 'box', size: [0.12, 0.32, 0.026], at: [0.28, 1.25, 0], color: '#f2f2ee' },
          { shape: 'box', size: [0.55, 0.06, 0.03], at: [0.28, 1.38, 0], color: '#c8102e' },
          { shape: 'box', size: [0.07, 0.32, 0.03], at: [0.28, 1.25, 0], color: '#c8102e' },
          { shape: 'sphere', r: 0.03, at: [0, 1.6, 0], color: '#dcdcdc' },
        ],
      },
      structure: [
        { part: 'islet', pos: [0, 0, 0], ry: 0 },
        { part: 'foundation', pos: [-0.4, 0.6, -0.2], ry: 0 },
        { part: 'hut', pos: [-0.4, 0.9, -0.2], ry: 0 },
        { part: 'hutRoof', pos: [-0.4, 2.2, -0.2], ry: 0 },
        { part: 'chimney', pos: [0.4, 2.5, -0.2], ry: 0 },
        { part: 'porch', pos: [-1.3, 0.6, 1.0], ry: 0 },
        { part: 'nissen', pos: [2.1, 0.6, 0.6], ry: 0 },
        { part: 'boatShed', pos: [2.1, 0.6, -1.3], ry: 0 },
        { part: 'flag', pos: [-2.4, 0.6, 1.4], ry: 0 },
      ],
    },

    /* ---------------------------------------------- TERRA NOVA KULÜBESİ */
    {
      id: 'terranova', name: 'Scott\'ın Terra Nova Kulübesi', place: 'Cape Evans, Antarktika', era: '1911',
      theme: { sky: '#c2d6e8', fog: '#dde7ee', ground: '#eef3f7', pad: '#4a4642' },
      intro: 'Volkanik kıyı şeridini kur, üstüne keşif ekibinin ahşap kulübesini ve çatısını, at ahırını ve çatısını yerleştir. Önüne erzak sandıklarını, iki kızağı ve tepedeki anı haçını ekle.',
      facts: [
        'Robert Falcon Scott\'ın Terra Nova keşif ekibi tarafından 1911\'de Cape Evans\'ta kuruldu.',
        'Scott ve ekibi Güney Kutbu yolculuğuna buradan çıktı.',
        'Kulübe, içindeki erzak ve eşyalarla birlikte soğuk iklim sayesinde yüz yılı aşkın süredir korunuyor.',
        'Antarktika Miras Vakfı (Antarctic Heritage Trust) tarafından titizlikle restore edildi.',
      ],
      parts: {
        shore: [
          { shape: 'rock', size: [6.4, 0.4, 4.2], seed: 161, jitter: 0.12, color: '#4a4642' },
          ...Array.from({ length: 12 }, (_, k) => [((k * 37) % 60) / 10 - 3, 0.38, ((k * 23) % 40) / 10 - 2]).map((p, k) => ({ shape: 'rock', size: [0.2 + (k % 3) * 0.08, 0.12, 0.18], seed: 260 + k, jitter: 0.04, at: p, color: k % 2 ? '#3f3b38' : '#55504b', detail: true })),
          ...[[-2.6, 0.38, 1.6], [2.6, 0.38, -1.7]].map((p) => ({ shape: 'sphere', r: 0.5, seg: 8, rings: 5, scale: [1.6, 0.16, 1], at: p, color: '#f4f7fa' })),
        ],
        hutBody: [
          // Hava almış ahşap kaplama, küçük çok bölmeli pencereler, rüzgarlık giriş kapısı
          { shape: 'box', size: [3.2, 1.2, 1.8], color: '#7a6450' },
          ...boards(3.2, 1.2, 1.8, 0.09, '#5e4b3a'),
          ...[-1.0, -0.2, 0.6].flatMap((x) => shutterWin(x, 0.5, 0.9, 0, 0.22, 0.26, '#2f3a44', '#8a7360')),
          ...[-0.6, 0.6].flatMap((z) => shutterWin(-1.6, 0.5, z, -90, 0.22, 0.26, '#2f3a44', '#8a7360')),
          ...win({ w: 0.36, h: 0.85, at: [1.2, 0, 0.9], top: 'flat', color: '#5e4b3a', frame: '#8a7360', fw: 0.03 }),
          // Duvar dibine yığılmış kar ve rüzgârla aşınmış köşe tahtaları
          ...[[1.6, 0.9], [-1.6, 0.9], [1.6, -0.9], [-1.6, -0.9]].map(([x, z]) => ({ shape: 'box', size: [0.06, 1.2, 0.06], at: [x, 0, z], color: '#6a5642' })),
          { shape: 'sphere', r: 0.3, seg: 8, rings: 5, scale: [3.5, 0.5, 0.6], at: [0, 0, -0.95], color: '#eef3f6' },
        ],
        hutRoof: [
          { shape: 'tri', w: 2.0, h: 0.6, d: 3.3, rotY: 90, color: '#3d3a36' },
          // Katranlı keçe çatı şeritleri ve soba borusu
          ...Array.from({ length: 6 }, (_, k) => -1.4 + k * 0.56).flatMap((x) => [-1, 1].map((sz) => ({ shape: 'box', size: [0.02, 0.02, 1.15], at: [x, 0.3, sz * 0.5], rotX: sz * 31, color: '#2e2b28', detail: true }))),
          { shape: 'cyl', rt: 0.05, rb: 0.05, h: 0.5, seg: 8, at: [0.6, 0.3, 0.3], color: '#3a3a3a', metal: true },
          { shape: 'cyl', rt: 0.08, rb: 0.07, h: 0.06, seg: 8, at: [0.6, 0.8, 0.3], color: '#3a3a3a', metal: true },
        ],
        stable: [
          { shape: 'box', size: [1.2, 0.9, 1.8], color: '#5e4b3a' },
          ...boards(1.2, 0.9, 1.8, 0.09, '#4a3a2c'),
          // Midilli ahırı: yem çuvalı duvarı ve küçük kapı
          ...Array.from({ length: 5 }, (_, k) => ({ shape: 'sphere', r: 0.12, seg: 8, rings: 5, scale: [1.4, 0.8, 1], at: [0.62, 0.1 + (k % 2) * 0.2, -0.6 + k * 0.3], color: '#a08a62' })),
          ...win({ w: 0.3, h: 0.6, at: [0, 0, 0.9], top: 'flat', color: '#3a2c20', frame: '#6a5642' }),
        ],
        stableRoof: [
          { shape: 'tri', w: 1.9, h: 0.3, d: 1.3, rotY: 90, color: '#3d3a36' },
          ...Array.from({ length: 4 }, (_, k) => -0.6 + k * 0.4).map((x) => ({ shape: 'box', size: [0.02, 0.02, 1.32], at: [x, 0.15, 0], color: '#2e2b28', detail: true })),
        ],
        crate: [
          // Konserve ve erzak sandıkları: tahta çıtalar, kenar demirleri, etiket
          { shape: 'box', size: [0.6, 0.35, 0.4], color: '#9a7a52' },
          { shape: 'box', size: [0.5, 0.3, 0.35], at: [0.05, 0.35, 0], color: '#8a6a45' },
          ...[0.12, 0.24].map((y) => ({ shape: 'box', size: [0.61, 0.012, 0.41], at: [0, y, 0], color: '#6b4a2f', detail: true })),
          ...[0.45, 0.55].map((y) => ({ shape: 'box', size: [0.51, 0.012, 0.36], at: [0.05, y, 0], color: '#6b4a2f', detail: true })),
          { shape: 'box', size: [0.2, 0.1, 0.01], at: [0, 0.14, 0.205], color: '#e8dcc0', detail: true },
        ],
        sledge: [
          // Nansen tipi kızak: öne kıvrık kayaklar, dikmeler ve yük çıtaları
          ...[-0.2, 0.2].map((z) => ({ shape: 'tube', r: 0.025, radial: 5, color: '#5e4b3a', pts: [[-0.65, 0.02, z], [0.4, 0.02, z], [0.6, 0.06, z], [0.68, 0.16, z]] })),
          ...[-0.45, -0.15, 0.15, 0.45].flatMap((x) => [
            { shape: 'box', size: [0.04, 0.12, 0.04], at: [x, 0.02, -0.2], color: '#8a6a45' },
            { shape: 'box', size: [0.04, 0.12, 0.04], at: [x, 0.02, 0.2], color: '#8a6a45' },
            { shape: 'box', size: [0.06, 0.03, 0.48], at: [x, 0.13, 0], color: '#8a6a45' },
          ]),
          ...[-0.18, 0.18].map((z) => ({ shape: 'box', size: [1.1, 0.025, 0.03], at: [0, 0.16, z], color: '#8a6a45' })),
        ],
        cross: [
          { shape: 'rock', size: [0.9, 0.5, 0.9], seed: 162, jitter: 0.08, color: '#4a4642' },
          // Rüzgâr Gülü Tepesi'ndeki anma haçı ve dibindeki taş yığını
          { shape: 'box', size: [0.08, 1.2, 0.08], at: [0, 0.5, 0], color: '#6b4a2f' },
          { shape: 'box', size: [0.5, 0.08, 0.08], at: [0, 1.35, 0], color: '#6b4a2f' },
          ...[[0.2, 0.45, 0.15], [-0.18, 0.45, -0.1], [0.05, 0.5, -0.22]].map((p, k) => ({ shape: 'rock', size: [0.2, 0.14, 0.18], seed: 165 + k, jitter: 0.03, at: p, color: '#55504b' })),
        ],
      },
      structure: [
        { part: 'shore', pos: [0, 0, 0], ry: 0 },
        { part: 'hutBody', pos: [-0.4, 0.4, -0.4], ry: 0 },
        { part: 'hutRoof', pos: [-0.4, 1.6, -0.4], ry: 0 },
        { part: 'stable', pos: [1.8, 0.4, -0.4], ry: 0 },
        { part: 'stableRoof', pos: [1.8, 1.3, -0.4], ry: 0 },
        { part: 'crate', pos: [-1.6, 0.4, 1.3], ry: 0 },
        { part: 'crate', pos: [-0.8, 0.4, 1.4], ry: 0 },
        { part: 'sledge', pos: [0.9, 0.4, 1.2], ry: 0 },
        { part: 'sledge', pos: [0.9, 0.4, 1.75], ry: 0 },
        { part: 'cross', pos: [-2.5, 0.4, -1.4], ry: 0 },
      ],
    },

    /* ---------------------------------------------- GÜNEY KUTBU İSTASYONU */
    {
      id: 'southpole', name: 'Amundsen-Scott Güney Kutbu İstasyonu', place: 'Güney Kutbu, Antarktika', era: '1956 · bugünkü yapı 2008',
      theme: { sky: '#c4d8ec', fog: '#e2ebf2', ground: '#f2f6f9', pad: '#dfe6ec' },
      intro: 'Sıkıştırılmış kar zeminini kur, dört çift taşıyıcı ayağı diz, üstlerine iki yaşam modülünü ve çatı katını yerleştir. Önüne tören direğini ve Antarktika Antlaşması bayraklarını ekle.',
      facts: [
        'İlk istasyon 1956–57\'de kuruldu; adını kutba ilk ulaşan Roald Amundsen ve Robert Scott\'tan alır.',
        'Bugünkü istasyon 2008\'de tamamlandı; kar birikip altını gömmesin diye ayaklar üzerinde yükselir.',
        'Önündeki tören direği, Antarktika Antlaşması\'nı ilk imzalayan 12 ülkenin bayraklarıyla çevrilidir.',
        'Coğrafi Güney Kutbu, buzul kaydığı için her yıl yaklaşık 10 m yer değiştiren bir işaretle gösterilir.',
      ],
      parts: {
        snowBase: [
          { shape: 'box', size: [7, 0.3, 4], color: SNOW },
          // Rüzgârın oyduğu kar sırtları (sastrugi)
          ...Array.from({ length: 8 }, (_, k) => ({ shape: 'sphere', r: 0.3, seg: 8, rings: 5, scale: [2.4, 0.18, 0.5], at: [-3 + ((k * 37) % 60) / 10, 0.28, -1.6 + ((k * 23) % 32) / 10], rotY: 20, color: '#e9eef2' })),
        ],
        stilt: [
          // Ayarlanabilir çelik ayaklar ve çapraz bağlar (bina kar birikince yükseltilebilir)
          ...[-0.6, 0.6].map((z) => ({ shape: 'cyl', rt: 0.12, rb: 0.14, h: 1.1, seg: 10, at: [0, 0, z], color: '#7d8a96', metal: true })),
          ...[-0.6, 0.6].map((z) => ({ shape: 'cyl', rt: 0.2, rb: 0.22, h: 0.08, seg: 10, at: [0, 0, z], color: '#6a7682' })),
          { shape: 'box', size: [0.12, 0.12, 1.3], at: [0, 0.75, 0], color: '#6a7682' },
          bar([0, 0.1, -0.6], [0, 0.7, 0.6], 0.025, '#6a7682'),
          bar([0, 0.1, 0.6], [0, 0.7, -0.6], 0.025, '#6a7682'),
        ],
        module: [
          // Yükseltilmiş modül: eğik alt kenar (rüzgârı alttan geçirir), pencere bandı, panel derzleri
          { shape: 'box', size: [3.2, 1.0, 1.6], color: '#5f7590' },
          { shape: 'extrude', pts: [[-0.8, 0], [0.8, 0], [0.95, 0.25], [-0.95, 0.25]], d: 3.2, rotY: 90, at: [0, -0.05, 0], color: '#56697f' },
          ...winRow({ n: 7, span: 2.8, at: [0, 0.38, 0.8], w: 0.24, h: 0.22, top: 'flat', color: '#cfe3f2', frame: '#d9e0e6', fw: 0.02, glow: true }),
          ...winRow({ n: 7, span: 2.8, at: [0, 0.38, -0.8], rotY: 180, w: 0.24, h: 0.22, top: 'flat', color: '#cfe3f2', frame: '#d9e0e6', fw: 0.02, glow: true }),
          ...Array.from({ length: 9 }, (_, k) => -1.6 + k * 0.4).map((x) => ({ shape: 'box', size: [0.015, 1.0, 1.62], at: [x, 0, 0], color: '#52657b', detail: true })),
          { shape: 'box', size: [3.22, 0.05, 1.62], at: [0, 0.95, 0], color: '#8a96a2' },
        ],
        roofDeck: [
          { shape: 'box', size: [6.6, 0.12, 1.7], color: '#8a96a2' },
          // Teleskop kubbesi, iletişim antenleri, uydu çanağı ve korkuluk
          { shape: 'cyl', rt: 0.3, rb: 0.3, h: 0.15, seg: 16, at: [-2.2, 0.12, 0], color: '#e6e6e6' },
          { shape: 'hemi', r: 0.3, sy: 1, at: [-2.2, 0.27, 0], color: '#f2f2f2' },
          { shape: 'box', size: [0.08, 0.3, 0.02], at: [-2.2, 0.35, 0.28], color: '#3a3a3a' },
          { shape: 'cyl', rt: 0.03, rb: 0.03, h: 0.7, seg: 6, at: [2.4, 0.12, 0], color: '#cfcfcf', metal: true },
          ...[0.4, 0.6].map((y) => ({ shape: 'box', size: [0.3, 0.02, 0.02], at: [2.4, 0.12 + y, 0], color: '#cfcfcf', metal: true })),
          { shape: 'shell', r: 0.25, seg: 16, rings: 6, theta: Math.PI / 3, rotX: 140, at: [1.4, 0.45, 0], color: '#f2f2f2' },
          { shape: 'cyl', rt: 0.025, rb: 0.03, h: 0.33, seg: 6, at: [1.4, 0.12, 0], color: '#9a9a9a', metal: true },
          ...balustrade(6.6, 0.15, '#9aa4ae', [0, 0.12, 0.84], 0, 0.3),
        ],
        pole: [
          // Törensel kutup: kırmızı-beyaz direk üzerinde ayna küre
          ...Array.from({ length: 6 }, (_, i) => ({ shape: 'cyl', rt: 0.06, rb: 0.06, h: 0.2, seg: 12, at: [0, i * 0.2, 0], color: i % 2 ? '#c8102e' : '#f4f4f4' })),
          { shape: 'sphere', r: 0.14, seg: 20, rings: 14, at: [0, 1.2, 0], color: '#e3ecf2', metal: true },
          { shape: 'cyl', rt: 0.1, rb: 0.12, h: 0.04, seg: 12, color: '#7d8a96' },
        ],
        flagRing: Array.from({ length: 12 }, (_, i) => {
          const a = Math.PI * (0.15 + (0.7 * i) / 11);
          const x = Math.cos(a) * 1.0, z = -Math.sin(a) * 0.55;
          const colors = ['#c8102e', '#1f3b7a', '#f2c94c', '#27ae60', '#f4f4f4', '#d35400'];
          return [
            { shape: 'cyl', rt: 0.012, rb: 0.016, h: 0.8, seg: 6, at: [x, 0, z], color: '#dcdcdc', metal: true },
            { shape: 'extrude', pts: [[0, 0], [0.08, 0.01], [0.16, -0.01], [0.24, 0.01], [0.24, 0.15], [0.16, 0.17], [0.08, 0.14], [0, 0.15]], d: 0.012, at: [x, 0.62, z], color: colors[i % colors.length], double: true },
            { shape: 'box', size: [0.2, 0.03, 0.014], at: [x + 0.12, 0.68, z], color: colors[(i + 2) % colors.length], detail: true },
          ];
        }).flat(),
      },
      structure: [
        { part: 'snowBase', pos: [0, 0, 0], ry: 0 },
        ...[-2.4, -0.8, 0.8, 2.4].map((x) => ({ part: 'stilt', pos: [x, 0.3, -0.6], ry: 0 })),
        { part: 'module', pos: [-1.6, 1.4, -0.6], ry: 0 },
        { part: 'module', pos: [1.6, 1.4, -0.6], ry: 0 },
        { part: 'roofDeck', pos: [0, 2.4, -0.6], ry: 0 },
        { part: 'pole', pos: [0, 0.3, 1.6], ry: 0 },
        { part: 'flagRing', pos: [0, 0.3, 1.75], ry: 0 },
      ],
    },
  );
})();
