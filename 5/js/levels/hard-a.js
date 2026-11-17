/* =========================================================
   ANIT USTASI — Zor bölümler (1): Celsus, Göbeklitepe, Petra
   Zor seviye: daha çok ve birbirine benzeyen parça; hangi
   yuvanın hazır olduğu gösterilmez, sırayı oyuncu bulur.
   ========================================================= */

(function () {
  const AU = window.AU;
  const { ring, column, win, openingPts } = AU.shapes;

  /* ---------- Celsus renkleri ve parçaları ---------- */
  const MARBLE = '#e8e0cf', MARBLE2 = '#d9cfba', DARK = '#3a3228';

  // Çift Korint sütunu: kaide bloğu + yivli gövde + akantus başlık
  const celsusColPairLow = [-0.26, 0.26].flatMap((x) => [
    { shape: 'box', size: [0.3, 0.3, 0.3], at: [x, 0, 0], color: MARBLE2 },
    { shape: 'box', size: [0.33, 0.04, 0.33], at: [x, 0.26, 0], color: MARBLE },
    ...column({ r: 0.1, h: 2.02, at: [x, 0.3, 0], color: MARBLE, order: 'corinthian', flutes: 16 }),
    // Akantus yaprakları: başlık çevresinde küçük kıvrımlar
    ...[0, 1, 2, 3].map((k) => ({ shape: 'sphere', r: 0.045, scale: [1, 1.3, 0.6], at: [x + Math.sin((k * Math.PI) / 2) * 0.11, 2.17, Math.cos((k * Math.PI) / 2) * 0.11], color: '#f2ece0', detail: true })),
  ]);
  const celsusColPairUp = [-0.7, 0.7].flatMap((x) => [
    { shape: 'box', size: [0.24, 0.12, 0.24], at: [x, 0, 0], color: MARBLE2 },
    ...column({ r: 0.08, h: 1.55, at: [x, 0.12, 0], color: MARBLE, order: 'ionic', flutes: 16 }),
  ]);
  // Alınlık: dişli silme (dentil), kenar korniş, ortada kabartma madalyon
  const pediment = (h, segmental) => {
    const list = [
      { shape: 'box', size: [1.8, 0.22, 0.55], color: MARBLE },
      ...Array.from({ length: 16 }, (_, k) => ({ shape: 'box', size: [0.05, 0.05, 0.05], at: [-0.8 + k * 0.107, 0.12, 0.29], color: MARBLE2, detail: true })),
      { shape: 'box', size: [1.86, 0.04, 0.6], at: [0, 0.2, 0], color: MARBLE2 },
    ];
    if (segmental) {
      // Kemerli (segmental) alınlık
      list.push({ shape: 'extrude', pts: [[-0.95, 0], [0.95, 0], ...Array.from({ length: 11 }, (_, k) => { const a = (k / 10) * Math.PI; return [Math.cos(a) * 0.95, Math.sin(a) * h]; })], d: 0.55, at: [0, 0.22, 0], color: MARBLE2 });
    } else {
      list.push({ shape: 'tri', w: 1.9, h, d: 0.55, at: [0, 0.22, 0], color: MARBLE2 });
      list.push({ shape: 'tri', w: 1.5, h: h * 0.62, d: 0.04, at: [0, 0.28, 0.28], color: '#c8bca3' });
    }
    list.push({ shape: 'cyl', rt: 0.1, rb: 0.1, h: 0.03, seg: 14, rotX: 90, at: [0, 0.22 + h * 0.35, 0.3], color: '#f2ece0' });
    return list;
  };
  // Erdem heykeli (Sophia, Arete, Ennoia, Episteme): dökümlü elbiseli kadın figürü
  const virtue = () => [
    { shape: 'box', size: [0.22, 0.12, 0.2], color: MARBLE2 },
    { shape: 'lathe', seg: 12, color: '#f1ebde', points: [[0.11, 0], [0.1, 0.25], [0.085, 0.5], [0.075, 0.62], [0.06, 0.7], [0.07, 0.76], [0.04, 0.8], [0, 0.8]], at: [0, 0.12, 0] },
    { shape: 'tube', r: 0.022, radial: 5, color: '#f1ebde', pts: [[0.07, 0.86, 0], [0.11, 0.7, 0.04], [0.08, 0.56, 0.08]] },
    { shape: 'sphere', r: 0.055, at: [0, 0.92, 0], color: '#f1ebde' },
    ...[0.3, 0.45, 0.6].map((y) => ({ shape: 'torus', r: 0.1 - y * 0.04, tube: 0.006, radial: 3, seg: 12, rotX: 90, at: [0, 0.12 + y, 0], color: '#ddd3c2', detail: true })),
  ];

  /* ---------- Göbeklitepe parçaları ---------- */
  const LIME = '#cdbb98', LIME2 = '#bfae8a', RELIEF = '#9d8b6a';
  // Bir yay boyunca dizili kuru taş duvar (derece cinsinden aralık)
  function stoneArc(radius, fromDeg, toDeg, count, size, seed) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const deg = fromDeg + ((toDeg - fromDeg) / (count - 1)) * i;
      const a = (deg * Math.PI) / 180;
      out.push({ shape: 'rock', size, seed: seed + i, jitter: 0.07, at: [Math.sin(a) * radius, 0, Math.cos(a) * radius], rotY: deg, color: i % 2 ? LIME : LIME2 });
    }
    return out;
  }
  // Hayvan kabartması: dikmenin yan yüzüne yapışık yassı siluet (tilki, yaban domuzu, turna, yılan)
  const ANIMALS = {
    fox: [[-0.16, 0], [0.12, 0], [0.16, 0.06], [0.2, 0.14], [0.12, 0.12], [0.1, 0.2], [-0.08, 0.2], [-0.14, 0.12], [-0.22, 0.18], [-0.2, 0.08]],
    boar: [[-0.16, 0], [0.14, 0], [0.18, 0.08], [0.22, 0.1], [0.16, 0.18], [-0.12, 0.2], [-0.18, 0.12]],
    bird: [[-0.06, 0], [0.06, 0], [0.08, 0.18], [0.14, 0.26], [0.04, 0.28], [-0.02, 0.36], [-0.08, 0.26], [-0.04, 0.16]],
    snake: [[-0.02, 0], [0.02, 0], [0.05, 0.08], [0.0, 0.16], [0.05, 0.24], [0.0, 0.32], [0.04, 0.36], [-0.03, 0.36], [-0.04, 0.24], [-0.06, 0.16], [-0.02, 0.08]],
  };
  const reliefOn = (kind, x, y, z, side) => ({ shape: 'extrude', pts: ANIMALS[kind], d: 0.025, at: [x, y, z], rotY: side * 90, color: RELIEF });

  // T biçimli dikme: aşınmış kireçtaşı gövde + başlık + yan yüzlerde kabartmalar
  function tPillar(w, h, d, headH, headD, relief, seed) {
    const list = [
      { shape: 'rock', size: [w, h, d], seed: seed || 3, jitter: 0.02, color: LIME },
      { shape: 'rock', size: [w * 1.25, headH, headD], seed: (seed || 3) + 1, jitter: 0.025, at: [0, h, headD * 0.15], color: LIME2 },
    ];
    if (relief) {
      list.push(reliefOn('fox', w / 2 + 0.012, h * 0.4, 0, 1));
      list.push(reliefOn('boar', -w / 2 - 0.012, h * 0.3, 0, -1));
      list.push(reliefOn('snake', w / 2 + 0.012, h * 0.08, 0.12, 1));
      list.push(reliefOn('bird', -w / 2 - 0.012, h * 0.62, -0.05, -1));
    }
    return list;
  }
  // Merkezdeki büyük insansı dikme: kollar, eller, kemer ve tilki postu
  const bigPillar = [
    ...tPillar(0.3, 2.3, 0.75, 0.45, 1.3, false, 9),
    { shape: 'box', size: [0.32, 0.1, 0.77], at: [0, 1.3, 0], color: RELIEF },
    ...[-1, 1].flatMap((sx) => [
      { shape: 'tube', r: 0.03, radial: 5, color: RELIEF, pts: [[sx * 0.16, 2.05, -0.25], [sx * 0.165, 1.75, 0.0], [sx * 0.165, 1.5, 0.22]] },
      ...[0, 1, 2, 3].map((k) => ({ shape: 'box', size: [0.02, 0.012, 0.09], at: [sx * 0.165, 1.44 + k * 0.025, 0.24], color: RELIEF, detail: true })),
    ]),
    // Kemerden sarkan tilki postu
    { shape: 'extrude', pts: [[-0.06, 0], [0.06, 0], [0.09, 0.2], [0.05, 0.35], [-0.05, 0.35], [-0.09, 0.2]], d: 0.02, at: [0.16, 0.95, 0.1], rotY: 90, color: '#8a7858' },
    // Başlıkta kolye/sembol kabartmaları
    { shape: 'torus', r: 0.06, tube: 0.012, radial: 4, seg: 12, arc: Math.PI, rotY: 90, rotZ: 180, at: [0.17, 2.25, 0.1], color: RELIEF, detail: true },
    { shape: 'cyl', rt: 0.04, rb: 0.04, h: 0.02, seg: 10, rotZ: 90, at: [0.17, 2.35, 0.1], color: RELIEF, detail: true },
  ];
  const ringPillarPositions = (radius, count, startDeg) =>
    Array.from({ length: count }, (_, i) => {
      const deg = startDeg + (360 / count) * i;
      const a = (deg * Math.PI) / 180;
      return { pos: [+(Math.sin(a) * radius).toFixed(3), 0.2, +(Math.cos(a) * radius).toFixed(3)], ryDeg: deg };
    });

  /* ---------- Petra renkleri ---------- */
  const ROSE = '#c98a6d', ROSE2 = '#b97a5e', PDARK = '#3a2620';
  // Nebati Korint sütunu: kaide, düz gövde, çiçekli başlık
  const petraColumn = (h, r) => [
    { shape: 'box', size: [r * 2.3, 0.08, r * 2.3], color: ROSE2 },
    { shape: 'cyl', rt: r * 1.2, rb: r * 1.3, h: 0.06, seg: 14, at: [0, 0.08, 0], color: ROSE2 },
    { shape: 'cyl', rt: r * 0.9, rb: r, h: h - 0.06, seg: 16, at: [0, 0.14, 0], color: ROSE },
    { shape: 'lathe', seg: 14, color: ROSE2, points: [[r * 0.9, 0], [r * 1.05, 0.06], [r * 1.3, 0.14], [r * 1.45, 0.2], [0, 0.2]], at: [0, h + 0.08, 0] },
    ...[0, 1, 2, 3].map((k) => ({ shape: 'sphere', r: r * 0.35, scale: [1, 1.3, 0.6], at: [Math.sin((k * Math.PI) / 2 + 0.78) * r * 1.05, h + 0.12, Math.cos((k * Math.PI) / 2 + 0.78) * r * 1.05], color: '#d79a7c', detail: true })),
  ];
  // Kumtaşı katman çizgileri (kayaya oyulmuş cephenin doğal damarları)
  const strata = (w, d, ys, color) => ys.map((y) => ({ shape: 'box', size: [w, 0.025, d], at: [0, y, 0], color, detail: true }));

  AU.levelDefs.push(
    /* ---------------------------------------------- CELSUS KÜTÜPHANESİ */
    {
      id: 'celsus',
      name: 'Celsus Kütüphanesi',
      place: 'Efes, İzmir',
      era: 'MS 110 – 135',
      difficulty: 'Zor',
      theme: { sky: '#b8d3e8', fog: '#cfdde6', ground: '#b9ab8c', pad: '#d9d0bd' },
      intro:
        'İki katlı mermer cepheyi kur. Basamaklar ve kaideden sonra alt duvarı, dört çift sütunu, nişlerdeki dört heykeli ' +
        've saçak bloklarını yerleştir. Üst kattaki sütun çiftleri iki alt saçağın üstüne basar; üçgen ve alçak alınlıkları karıştırma!',
      facts: [
        'Roma valisi Celsus\'un anısına oğlu Gaius Julius Aquila tarafından yaptırıldı; Celsus\'un mezarı binanın altındadır.',
        'Yaklaşık 12.000 parşömen rulosu barındırdığı tahmin edilir; antik dünyanın en büyük kütüphanelerinden biriydi.',
        'Cephedeki dört heykel Bilgelik, Erdem, Düşünce ve Bilgi\'yi (Sophia, Arete, Ennoia, Episteme) temsil eder.',
        'Cephe 1970\'lerde yeniden ayağa kaldırıldı; Efes 2015\'te UNESCO Dünya Mirası Listesi\'ne girdi.',
      ],
      parts: {
        stairs: [
          { shape: 'box', size: [6.4, 0.15, 1.2], color: MARBLE2 },
          { shape: 'box', size: [6.4, 0.15, 0.8], at: [0, 0.15, -0.2], color: MARBLE },
          { shape: 'box', size: [6.4, 0.15, 0.4], at: [0, 0.3, -0.4], color: MARBLE2 },
          ...[0.15, 0.3, 0.45].map((y, k) => ({ shape: 'box', size: [6.42, 0.015, 0.02], at: [0, y - 0.015, 0.6 - k * 0.4], color: '#bfb39b', detail: true })),
          // Merdiven kenarındaki heykel kaideleri
          ...[-3.05, 3.05].map((x) => ({ shape: 'box', size: [0.3, 0.45, 1.2], at: [x, 0, 0], color: '#d4c9b2' })),
        ],
        podium: [
          { shape: 'box', size: [6.4, 0.45, 1.5], color: '#d4c9b2' },
          { shape: 'box', size: [6.44, 0.05, 1.54], at: [0, 0.4, 0], color: MARBLE },
          { shape: 'box', size: [6.44, 0.05, 1.54], color: MARBLE2 },
        ],
        wallLow: [
          { shape: 'box', size: [6.2, 2.32, 0.4], color: '#e1d8c6' },
          // Üç kapı: profilli çerçeve, lento ve üstte pencere
          ...[-1.6, 0, 1.6].flatMap((x) => [
            { shape: 'box', size: [0.78, 1.5, 0.03], at: [x, 0, 0.205], color: MARBLE2 },
            { shape: 'box', size: [0.55, 1.3, 0.04], at: [x, 0, 0.21], color: DARK },
            { shape: 'box', size: [0.9, 0.14, 0.08], at: [x, 1.5, 0.22], color: MARBLE },
            ...win({ w: 0.36, h: 0.4, at: [x, 1.72, 0.2], top: 'flat', color: DARK, frame: MARBLE2, fw: 0.04 }),
          ]),
          // Erdem heykeli nişleri
          ...[-2.4, -0.8, 0.8, 2.4].flatMap((x) => win({ w: 0.34, h: 1.15, at: [x, 0.1, 0.2], top: 'round', color: '#6d6252', frame: MARBLE2, fw: 0.03 })),
          // Kesme taş derzleri
          ...[0.5, 1.0, 1.95].map((y) => ({ shape: 'box', size: [6.22, 0.012, 0.41], at: [0, y, 0], color: '#cbbfa8', detail: true })),
        ],
        colPairLow: celsusColPairLow,
        statue: virtue(),
        entLow: [
          // Sütun çiftinin üstündeki çıkıntılı saçaklık: arşitrav, friz ve korniş
          { shape: 'box', size: [1.0, 0.3, 0.8], color: MARBLE },
          { shape: 'box', size: [1.02, 0.04, 0.82], at: [0, 0.1, 0], color: MARBLE2 },
          ...Array.from({ length: 8 }, (_, k) => ({ shape: 'sphere', r: 0.025, at: [-0.42 + k * 0.12, 0.17, 0.41], color: '#f2ece0', detail: true })),
          { shape: 'box', size: [1.06, 0.06, 0.86], at: [0, 0.24, 0], color: MARBLE2 },
          ...Array.from({ length: 9 }, (_, k) => ({ shape: 'box', size: [0.04, 0.04, 0.04], at: [-0.44 + k * 0.11, 0.2, 0.43], color: MARBLE, detail: true })),
        ],
        wallUp: [
          { shape: 'box', size: [6.0, 1.9, 0.35], color: '#e1d8c6' },
          ...[-1.6, 0, 1.6].flatMap((x) => win({ w: 0.5, h: 0.8, at: [x, 0.5, 0.17], top: 'flat', color: DARK, frame: MARBLE2, fw: 0.05 })),
          ...[-0.8, 0.8].flatMap((x) => win({ w: 0.26, h: 0.55, at: [x, 0.6, 0.17], top: 'round', color: '#8f8574', d: 0.02 })),
          { shape: 'box', size: [6.04, 0.08, 0.39], at: [0, 0.2, 0], color: MARBLE2 },
          ...[0.7, 1.3].map((y) => ({ shape: 'box', size: [6.02, 0.012, 0.36], at: [0, y, 0], color: '#cbbfa8', detail: true })),
        ],
        colPairUp: celsusColPairUp,
        pedTri: pediment(0.5, false),
        pedLow: pediment(0.32, true),
        attic: [
          { shape: 'box', size: [6.2, 0.25, 0.6], color: MARBLE2 },
          ...Array.from({ length: 30 }, (_, k) => ({ shape: 'box', size: [0.08, 0.06, 0.06], at: [-2.9 + k * 0.2, 0.12, 0.31], color: MARBLE, detail: true })),
        ],
      },
      structure: [
        { part: 'stairs', pos: [0, 0, 1.05], ry: 0 },
        { part: 'podium', pos: [0, 0, -0.15], ry: 0 },
        { part: 'wallLow', pos: [0, 0.45, -0.55], ry: 0 },
        ...[-2.4, -0.8, 0.8, 2.4].map((x) => ({ part: 'colPairLow', pos: [x, 0.45, 0.3], ry: 0 })),
        ...[-2.4, -0.8, 0.8, 2.4].map((x) => ({ part: 'statue', pos: [x, 0.45, -0.12], ry: 0 })),
        ...[-2.4, -0.8, 0.8, 2.4].map((x) => ({ part: 'entLow', pos: [x, 2.77, 0.15], ry: 0 })),
        { part: 'wallUp', pos: [0, 2.77, -0.55], ry: 0 },
        ...[-1.6, 0, 1.6].map((x) => ({ part: 'colPairUp', pos: [x, 3.07, 0.2], ry: 0 })),
        { part: 'pedTri', pos: [0, 4.74, 0.2], ry: 0 },
        { part: 'pedLow', pos: [-1.6, 4.74, 0.2], ry: 0 },
        { part: 'pedLow', pos: [1.6, 4.74, 0.2], ry: 0 },
        { part: 'attic', pos: [0, 4.67, -0.55], ry: 0 },
      ],
    },

    /* ---------------------------------------------- GÖBEKLİTEPE */
    {
      id: 'gobeklitepe',
      name: 'Göbeklitepe',
      place: 'Örencik, Şanlıurfa',
      era: 'MÖ ~9600 – 8200',
      difficulty: 'Zor',
      theme: { sky: '#c9dcea', fog: '#dfe2dc', ground: '#c2a978', pad: '#b3a283' },
      intro:
        'İnsanlık tarihinin bilinen en eski anıtsal yapısını kazıyorsun! Önce iki çukurun ana kaya tabanını, ' +
        'sonra taş duvar yaylarını ve T biçimli dikilitaşları yerleştir. En son dört direk ve koruma çatısı gelir.',
      facts: [
        'Yaklaşık 11.600 yıl önce, yerleşik tarımdan önce avcı-toplayıcılar tarafından inşa edildi.',
        'T biçimli dikilitaşlar stilize insan figürleridir; üzerlerinde kol, el, kemer ve tilki, yaban domuzu, akrep gibi hayvan kabartmaları vardır.',
        'Stonehenge\'den yaklaşık 6.000 yıl daha eskidir; "tarihin sıfır noktası" olarak anılır.',
        '2018\'de UNESCO Dünya Mirası Listesi\'ne alındı; kazılar bugün koruma çatısı altında sürmektedir.',
      ],
      parts: {
        floorD: [{ shape: 'cyl', rt: 2.9, rb: 3.0, h: 0.2, seg: 28, color: '#b3a283' }],
        floorC: [{ shape: 'cyl', rt: 1.9, rb: 2.0, h: 0.2, seg: 24, color: '#ad9c7c' }],
        wallQ: stoneArc(2.65, 6, 84, 6, [0.92, 0.85, 0.5], 20),
        wallHalfC: stoneArc(1.68, 12, 168, 6, [0.78, 0.7, 0.45], 40),
        pillar: tPillar(0.22, 1.5, 0.55, 0.32, 0.95, true, 21),
        pillarBig: bigPillar,
        pillarSmall: tPillar(0.18, 1.1, 0.42, 0.25, 0.7, true, 31),
        pillarMid: tPillar(0.24, 1.6, 0.6, 0.35, 1.0, true, 41),
        pole: [
          { shape: 'box', size: [0.4, 0.15, 0.4], color: '#8d8a84' },
          { shape: 'cyl', rt: 0.07, rb: 0.09, h: 3.45, seg: 10, at: [0, 0.15, 0], color: '#d9d9d5', metal: true },
          // Gergi halatları ve tepe başlığı
          ...[[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dz]) => ({ shape: 'tube', r: 0.012, radial: 4, color: '#9a9a96', pts: [[0, 3.4, 0], [dx * 0.5, 1.8, dz * 0.5], [dx * 0.9, 0.15, dz * 0.9]], tension: 0 })),
          { shape: 'cyl', rt: 0.14, rb: 0.1, h: 0.12, seg: 10, at: [0, 3.48, 0], color: '#bdbdb8', metal: true },
        ],
        canopy: [
          { shape: 'hemi', r: 5.2, sy: 0.1, color: '#f1efe8', opacity: 0.38 },
          ...ring(8, 4.9, 0.0, [0.08, 0.1, 0.5], '#c9c7c0', 0),
          // Membranı taşıyan çelik kirişler (ışınsal) ve halka
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'tube', r: 0.03, radial: 4, color: '#c9c7c0', metal: true, pts: Array.from({ length: 6 }, (_, t) => { const rr = (t / 5) * 5.1; return [Math.sin(a) * rr, 0.52 * Math.sqrt(Math.max(0, 1 - (rr / 5.2) ** 2)) - 0.01, Math.cos(a) * rr]; }) })),
          { shape: 'torus', r: 2.6, tube: 0.025, radial: 4, seg: 40, rotX: 90, at: [0, 0.44, 0], color: '#c9c7c0', metal: true },
        ],
      },
      structure: [
        { part: 'floorD', pos: [0, 0, 0], ry: 0 },
        { part: 'floorC', pos: [5.4, 0, -0.6], ry: 0 },
        ...[0, 90, 180, 270].map((d) => ({ part: 'wallQ', pos: [0, 0.2, 0], ryDeg: d })),
        ...ringPillarPositions(2.2, 8, 22.5).map((p) => ({ part: 'pillar', ...p })),
        { part: 'pillarBig', pos: [-0.55, 0.2, 0], ry: 0 },
        { part: 'pillarBig', pos: [0.55, 0.2, 0], ry: 0 },
        { part: 'wallHalfC', pos: [5.4, 0.2, -0.6], ry: 0 },
        { part: 'wallHalfC', pos: [5.4, 0.2, -0.6], ry: 2 },
        ...ringPillarPositions(1.35, 4, 45).map((p) => ({ part: 'pillarSmall', pos: [p.pos[0] + 5.4, 0.2, p.pos[2] - 0.6], ryDeg: p.ryDeg })),
        { part: 'pillarMid', pos: [5.4, 0.2, -0.6], ry: 0 },
        ...[[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]].map(([x, z]) => ({ part: 'pole', pos: [x, 0, z], ry: 0 })),
        { part: 'canopy', pos: [0, 3.6, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- PETRA — EL HAZNE */
    {
      id: 'petra',
      name: 'Petra — El Hazne',
      place: 'Ma\'an, Ürdün',
      era: 'MÖ 1. yy – MS 1. yy',
      difficulty: 'Zor',
      theme: { sky: '#e8c9a8', fog: '#ecd2b8', ground: '#c99a76', pad: '#c08e6d' },
      intro:
        'Pembe kayaya oyulmuş Nebati cephesini kuruyorsun. Kaya duvarlarını, basamakları, altı sütunu ve atlı kabartmaları diz; ' +
        'saçak, alınlık ve üst kaideden sonra ortadaki tholosu, yarım köşkleri, külahı ve tepedeki vazoyu yerleştir. Her şey aynı renk — dikkat!',
      facts: [
        'Nebatiler tarafından doğrudan kaya yüzeyine oyulmuştur; yaklaşık 40 metre yüksekliğindedir.',
        'Muhtemelen bir Nebati kralının (IV. Aretas olduğu düşünülür) anıt mezarı olarak yapıldı.',
        'Adı, tepedeki taş vazonun içinde hazine saklandığı efsanesinden gelir; vazodaki kurşun izleri bu yüzdendir.',
        'Petra 1985\'te UNESCO Dünya Mirası, 2007\'de Dünyanın Yeni Yedi Harikası\'ndan biri oldu.',
      ],
      parts: {
        cliffBack: [
          { shape: 'rock', size: [8.6, 7.2, 1.4], seed: 11, jitter: 0.14, color: ROSE },
          // Kayadaki kırmızı-pembe-sarı damar katmanları
          ...Array.from({ length: 10 }, (_, k) => ({ shape: 'box', size: [8.4, 0.05, 0.02], at: [0, 0.4 + k * 0.68, 0.72], rotZ: (k % 3 - 1) * 1.5, color: k % 2 ? '#b5735a' : '#d79a7c', detail: true })),
          // İç mezar odası kapısı
          { shape: 'box', size: [1.1, 2.0, 0.04], at: [0, 0.3, 0.71], color: ROSE2 },
          { shape: 'box', size: [0.9, 1.8, 0.05], at: [0, 0.3, 0.72], color: PDARK },
        ],
        cliffL: [
          { shape: 'rock', size: [2, 7.6, 3.4], seed: 12, jitter: 0.2, color: '#c48568' },
          ...strata(2.05, 3.45, [1.1, 2.4, 3.9, 5.3, 6.6], '#b07258'),
        ],
        cliffR: [
          { shape: 'rock', size: [2, 7.6, 3.4], seed: 13, jitter: 0.2, color: '#c48568' },
          ...strata(2.05, 3.45, [0.8, 2.1, 3.5, 5.0, 6.4], '#b07258'),
        ],
        steps: [
          { shape: 'box', size: [5.8, 0.15, 1.6], color: ROSE2 },
          { shape: 'box', size: [5.6, 0.15, 1.3], at: [0, 0.15, -0.15], color: ROSE },
          ...[-0.6, 0.6].map((x) => ({ shape: 'rock', size: [0.5, 0.12, 0.4], seed: 30 + x * 10, jitter: 0.04, at: [x * 3.6, 0.15, 0.4], color: '#b97a5e' })),
        ],
        colLow: petraColumn(2.44, 0.18),
        rider: [
          // Kastor ve Polluks kabartması: at ve süvari silueti (aşınmış)
          { shape: 'box', size: [0.62, 1.6, 0.12], color: ROSE2 },
          { shape: 'extrude', pts: [[-0.24, 0], [-0.18, 0], [-0.14, 0.3], [0.12, 0.3], [0.16, 0], [0.22, 0], [0.2, 0.36], [0.26, 0.52], [0.18, 0.56], [0.12, 0.44], [-0.2, 0.46], [-0.26, 0.36]], d: 0.06, at: [0, 0.2, 0.09], color: '#a96c52' },
          { shape: 'cyl', rt: 0.05, rb: 0.07, h: 0.4, seg: 8, at: [0, 0.72, 0.1], color: '#a96c52' },
          { shape: 'sphere', r: 0.06, at: [0, 1.12, 0.1], color: '#a96c52' },
          { shape: 'tube', r: 0.02, radial: 4, color: '#a96c52', pts: [[0.04, 1.0, 0.1], [0.14, 1.12, 0.12], [0.18, 1.3, 0.12]] },
        ],
        lowEnt: [
          { shape: 'box', size: [5.9, 0.42, 1.3], color: ROSE },
          // Friz: kıvrık dal ve vazo motifleri, dişli silme
          { shape: 'box', size: [5.94, 0.05, 1.34], at: [0, 0.1, 0], color: ROSE2 },
          ...Array.from({ length: 14 }, (_, k) => -2.6 + k * 0.4).map((x) => ({ shape: 'torus', r: 0.06, tube: 0.012, radial: 4, seg: 10, arc: Math.PI, at: [x, 0.2, 0.66], color: '#d79a7c', detail: true })),
          ...[-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((x) => ({ shape: 'box', size: [0.12, 0.12, 0.04], at: [x, 0.17, 0.67], color: ROSE2 })),
          { shape: 'box', size: [5.96, 0.06, 1.36], at: [0, 0.36, 0], color: ROSE2 },
        ],
        pediment: [
          { shape: 'tri', w: 2.3, h: 0.62, d: 0.6, color: ROSE },
          { shape: 'tri', w: 1.8, h: 0.42, d: 0.04, at: [0, 0.08, 0.3], color: ROSE2 },
          // Alınlık ortasındaki çiçekli kıvrık dal kabartması
          ...[-0.35, 0, 0.35].map((x) => ({ shape: 'torus', r: 0.07, tube: 0.012, radial: 4, seg: 12, at: [x, 0.2, 0.33], color: '#d79a7c', detail: true })),
          ...[-1.1, 1.1].map((x) => ({ shape: 'sphere', r: 0.07, scale: [1, 1.3, 0.8], at: [x, 0, 0.25], color: ROSE2 })),
        ],
        upperPlinth: [
          { shape: 'box', size: [5.9, 0.3, 1.1], color: ROSE2 },
          { shape: 'box', size: [5.94, 0.05, 1.14], at: [0, 0.25, 0], color: ROSE },
        ],
        tholosBase: [
          { shape: 'cyl', rt: 0.72, rb: 0.72, h: 1.7, seg: 20, color: ROSE2 },
          // İsis heykeli kabartması ve çevresindeki sütunlar
          { shape: 'lathe', seg: 10, color: '#a96c52', points: [[0.12, 0], [0.1, 0.4], [0.07, 0.75], [0.05, 0.85], [0, 0.88]], at: [0, 0.3, 0.72] },
          ...Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return petraColumn(1.4, 0.085).map((s) => ({ ...s, at: [Math.sin(a) * 0.82 + (s.at ? s.at[0] : 0), s.at ? s.at[1] : 0, Math.cos(a) * 0.82 + (s.at ? s.at[2] : 0)] }));
          }).flat(),
          { shape: 'cyl', rt: 0.92, rb: 0.92, h: 0.12, seg: 20, at: [0, 1.6, 0], color: ROSE },
          ...Array.from({ length: 20 }, (_, k) => (k / 20) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.04, 0.04, 0.04], at: [Math.sin(a) * 0.93, 1.64, Math.cos(a) * 0.93], rotY: (a * 180) / Math.PI, color: ROSE2, detail: true })),
        ],
        tholosRoof: [
          // Hafif içbükey konik çatı
          { shape: 'lathe', seg: 20, color: ROSE, points: [[0.92, 0], [0.7, 0.12], [0.46, 0.3], [0.24, 0.52], [0.1, 0.7], [0, 0.75]] },
          ...Array.from({ length: 10 }, (_, k) => (k / 10) * Math.PI * 2).map((a) => ({ shape: 'tube', r: 0.012, radial: 3, color: ROSE2, detail: true, pts: [[Math.sin(a) * 0.9, 0.02, Math.cos(a) * 0.9], [Math.sin(a) * 0.47, 0.31, Math.cos(a) * 0.47], [Math.sin(a) * 0.1, 0.71, Math.cos(a) * 0.1]] })),
        ],
        urn: [
          // Hazine efsanesinin doğduğu taş vazo (üzerinde kurşun izleri)
          { shape: 'cyl', rt: 0.1, rb: 0.14, h: 0.15, seg: 12, color: ROSE2 },
          { shape: 'lathe', seg: 14, color: ROSE, points: [[0.06, 0], [0.14, 0.06], [0.17, 0.16], [0.14, 0.28], [0.08, 0.34], [0.07, 0.4], [0.1, 0.44], [0, 0.46]], at: [0, 0.12, 0] },
          ...[[0.1, 0.24, 0.09], [-0.08, 0.3, 0.1], [0.04, 0.2, 0.15]].map((p) => ({ shape: 'sphere', r: 0.018, at: p, color: PDARK, detail: true })),
        ],
        halfPav: [
          { shape: 'box', size: [1.3, 1.7, 0.8], color: ROSE2 },
          ...[-0.45, 0.45].flatMap((x) => petraColumn(1.42, 0.1).map((s) => ({ ...s, at: [x + (s.at ? s.at[0] : 0), (s.at ? s.at[1] : 0), 0.42 + (s.at ? s.at[2] : 0)] }))),
          // Amazon / Nike figürleri: sütunlar arasında dans eden kadın kabartması
          { shape: 'lathe', seg: 8, color: '#a96c52', points: [[0.1, 0], [0.08, 0.4], [0.05, 0.7], [0, 0.8]], at: [0, 0.3, 0.41] },
          { shape: 'sphere', r: 0.05, at: [0, 1.1, 0.41], color: '#a96c52' },
        ],
        pedHalf: [
          { shape: 'box', size: [1.4, 0.15, 0.85], color: ROSE },
          { shape: 'tri', w: 1.4, h: 0.45, d: 0.85, at: [0, 0.15, 0], color: ROSE2 },
          { shape: 'box', size: [1.44, 0.04, 0.89], at: [0, 0.11, 0], color: ROSE2 },
          { shape: 'sphere', r: 0.06, scale: [1, 1.4, 0.8], at: [0, 0.58, 0.3], color: ROSE },
        ],
      },
      structure: [
        { part: 'cliffBack', pos: [0, 0, -1.0], ry: 0 },
        { part: 'cliffL', pos: [-5.3, 0, -0.2], ry: 0 },
        { part: 'cliffR', pos: [5.3, 0, -0.2], ry: 0 },
        { part: 'steps', pos: [0, 0, 0.4], ry: 0 },
        ...[-2.45, -1.47, -0.49, 0.49, 1.47, 2.45].map((x) => ({ part: 'colLow', pos: [x, 0.3, 0.5], ry: 0 })),
        { part: 'rider', pos: [-1.96, 0.3, -0.15], ry: 0 },
        { part: 'rider', pos: [1.96, 0.3, -0.15], ry: 0 },
        { part: 'lowEnt', pos: [0, 3.02, 0.05], ry: 0 },
        { part: 'pediment', pos: [0, 3.44, 0.35], ry: 0 },
        { part: 'upperPlinth', pos: [0, 3.44, -0.15], ry: 0 },
        { part: 'tholosBase', pos: [0, 3.74, -0.35], ry: 0 },
        { part: 'halfPav', pos: [-2.25, 3.74, -0.3], ry: 0 },
        { part: 'halfPav', pos: [2.25, 3.74, -0.3], ry: 0 },
        { part: 'tholosRoof', pos: [0, 5.46, -0.35], ry: 0 },
        { part: 'urn', pos: [0, 6.21, -0.35], ry: 0 },
        { part: 'pedHalf', pos: [-2.25, 5.44, -0.3], ry: 0 },
        { part: 'pedHalf', pos: [2.25, 5.44, -0.3], ry: 0 },
      ],
    },
  );
})();
