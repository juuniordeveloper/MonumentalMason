/* =========================================================
   ANIT USTASI — Anadolu bölümleri
   ========================================================= */

(function () {
  const AU = window.AU;
  const { ring, archPart, minaret, onFaces, arcade, BAZALT, BAZALT2, KIRECTASI, KURSUN, turn, shift, win, winRow, ringWins, ribbedDome, alem, cornice, crenels, column } = AU.shapes;

  // Silindir gövdede taş sırası çizgileri
  const courses = (r, h, step, color, y0) => {
    const out = [];
    for (let y = step; y < h - 0.02; y += step) out.push({ shape: 'torus', r: r + 0.004, tube: 0.008, radial: 3, seg: 24, rotX: 90, at: [0, (y0 || 0) + y, 0], color, detail: true });
    return out;
  };

  // Yapraklı ağaç: birkaç yumuşak yaprak kümesi
  function leafyTree(trunk, leaf, leaf2) {
    return [
      { shape: 'cyl', rt: 0.045, rb: 0.08, h: 0.5, seg: 7, color: trunk },
      { shape: 'tube', r: 0.025, radial: 5, color: trunk, pts: [[0, 0.35, 0], [0.12, 0.5, 0.05], [0.2, 0.62, 0.06]] },
      { shape: 'sphere', r: 0.3, seg: 10, rings: 8, at: [0, 0.38, 0], color: leaf },
      { shape: 'sphere', r: 0.22, seg: 10, rings: 8, at: [0.18, 0.5, 0.08], color: leaf2 },
      { shape: 'sphere', r: 0.2, seg: 10, rings: 8, at: [-0.16, 0.52, -0.06], color: leaf2 },
      { shape: 'sphere', r: 0.17, seg: 10, rings: 8, at: [0.02, 0.72, 0.02], color: leaf },
    ];
  }

  // Şadırvan: sekizgen havuz, sütunlar, kurşun külah
  function sadirvan(r, H, stone, col, lead) {
    const out = [
      { shape: 'cyl', rt: r * 0.84, rb: r * 0.84, h: 0.22, seg: 8, rotY: 22.5, color: stone },
      { shape: 'cyl', rt: r * 0.72, rb: r * 0.72, h: 0.02, seg: 8, rotY: 22.5, at: [0, 0.22, 0], color: '#5b9bd5' },
      { shape: 'cyl', rt: 0.06, rb: 0.08, h: 0.16, seg: 8, at: [0, 0.22, 0], color: stone },
      ...Array.from({ length: 8 }, (_, k) => ((22.5 + k * 45) * Math.PI) / 180).flatMap((a) => [
        { shape: 'cyl', rt: 0.025, rb: 0.03, h: H - 0.25, seg: 8, at: [Math.sin(a) * r * 0.9, 0.22, Math.cos(a) * r * 0.9], color: col },
        { shape: 'box', size: [0.03, 0.025, 0.03], at: [Math.sin(a) * r * 0.78, 0.2, Math.cos(a) * r * 0.78], color: '#c9a646', detail: true }, // musluk
      ]),
      { shape: 'cyl', rt: r * 1.28, rb: r * 1.28, h: 0.05, seg: 8, rotY: 22.5, at: [0, H - 0.03, 0], color: stone },
      { shape: 'lathe', seg: 8, flat: true, color: lead, points: [[r * 1.28, 0], [r * 1.0, H * 0.18], [r * 0.6, H * 0.4], [r * 0.15, H * 0.6], [0, H * 0.64]], at: [0, H + 0.02, 0] },
      ...alem(H + H * 0.62, 0.5),
    ];
    return out;
  }

  AU.levelDefs.push(
    /* ---------------------------------------------- HEVSEL */
    {
      id: 'hevsel',
      name: 'Diyarbakır Surları ve Hevsel Bahçeleri',
      place: 'Sur, Diyarbakır',
      era: 'Antik Çağ – Günümüz',
      theme: { sky: '#cfe3ee', fog: '#d6e6ee', ground: '#7f9a4f', pad: '#8ea25e' },
      intro:
        'Kayalık yamacın üstüne siyah bazalt burçları ve sur duvarlarını, aşağıya Dicle kıyısındaki ' +
        'bostanları ve meyve bahçelerini yerleştir. Ağaçlar ancak bahçeler kurulunca dikilebilir!',
      facts: [
        '"Diyarbakır Kalesi ve Hevsel Bahçeleri Kültürel Peyzaj Alanı" 2015\'te UNESCO Dünya Mirası Listesi\'ne alındı.',
        'Siyah bazalt taşından örülen surlar yaklaşık 5,8 km uzunluğundadır ve onlarca burca sahiptir.',
        'Hevsel Bahçeleri surlarla Dicle Nehri arasında uzanır ve binlerce yıldır şehri beslemiştir.',
        'Yakındaki On Gözlü (Dicle) Köprüsü 1065\'te Mervaniler döneminde yapılmıştır.',
      ],
      parts: {
        ridge: [
          { shape: 'rock', size: [9.4, 0.8, 1.6], seed: 7, jitter: 0.08, color: '#6d6259' },
          { shape: 'rock', size: [9.0, 0.3, 1.2], seed: 17, jitter: 0.06, at: [0, 0.55, 0.1], color: '#7a6e63' },
          ...[-4, -2.6, -1.1, 0.8, 2.3, 3.6].map((x, k) => ({ shape: 'sphere', r: 0.16 + (k % 2) * 0.06, scale: [1.4, 0.6, 1], seg: 8, rings: 6, at: [x, 0.62, 0.72], color: k % 2 ? '#7f8a52' : '#6f7d45' })),
        ],
        tower: [
          // Yuvarlak bazalt burç: taş sıraları, mazgal pencereler, kitabe kuşağı ve mazgallar
          { shape: 'cyl', rt: 0.55, rb: 0.62, h: 1.9, seg: 24, color: '#3f3a37', flat: true },
          ...courses(0.58, 1.9, 0.16, '#2d2927'),
          { shape: 'cyl', rt: 0.6, rb: 0.6, h: 0.1, seg: 24, at: [0, 1.25, 0], color: '#8d847a' },
          ...ringWins(4, 0.585, 0.7, { w: 0.07, h: 0.32, top: 'flat', color: '#1d1a19', startDeg: 45 }),
          ...ringWins(3, 0.565, 1.42, { w: 0.08, h: 0.2, top: 'round', color: '#1d1a19', startDeg: 0 }),
          // Kabartma kartal/aslan figürleri izlenimi
          { shape: 'box', size: [0.22, 0.1, 0.03], at: [0, 1.38, 0.57], color: '#b9ae9e' },
          { shape: 'cyl', rt: 0.6, rb: 0.56, h: 0.08, seg: 24, at: [0, 1.82, 0], color: '#4a4441' },
          ...Array.from({ length: 12 }, (_, k) => (k / 12) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.16, 0.18, 0.12], at: [Math.sin(a) * 0.52, 1.9, Math.cos(a) * 0.52], rotY: (a * 180) / Math.PI, color: '#4a4441' })),
        ],
        wall: [
          { shape: 'box', size: [2.9, 1.3, 0.5], color: '#4a4441' },
          ...[0.2, 0.4, 0.8, 1.0].map((y) => ({ shape: 'box', size: [2.91, 0.012, 0.51], at: [0, y, 0], color: '#333', detail: true })),
          { shape: 'box', size: [2.92, 0.06, 0.52], at: [0, 0.6, 0], color: '#7f766c' },
          // Payanda ve mazgal dişleri, arkada seğirdim yolu
          ...[-0.95, 0.95].map((x) => ({ shape: 'extrude', pts: [[-0.12, 0], [0.12, 0], [0.12, 0.2], [0.06, 1.0], [-0.06, 1.0], [-0.12, 0.2]], d: 0.14, at: [x, 0, 0.3], color: '#3f3a37' })),
          ...crenels(2.9, 1.3, 0.18, '#3f3a37', { w: 0.18, gap: 0.14, h: 0.22, t: 0.14 }),
          { shape: 'box', size: [2.9, 0.04, 0.3], at: [0, 1.28, -0.08], color: '#5a534e' },
          ...[-0.9, 0, 0.9].flatMap((x) => win({ w: 0.06, h: 0.3, at: [x, 0.72, 0.25], top: 'flat', color: '#1d1a19' })),
        ],
        plotVeg: [
          { shape: 'box', size: [2.0, 0.15, 1.4], color: '#7a5b3a' },
          // Karık sıraları ve sebze bitkileri (yumuşak kümeler)
          ...[-0.5, -0.25, 0, 0.25, 0.5].flatMap((z, r) => [
            { shape: 'box', size: [1.84, 0.04, 0.1], at: [0, 0.15, z], color: '#6a4d30' },
            ...Array.from({ length: 9 }, (_, k) => -0.8 + k * 0.2).map((x, k) => ({ shape: 'sphere', r: 0.06 + ((k + r) % 3) * 0.01, seg: 8, rings: 6, scale: [1, 0.75, 1], at: [x, 0.17, z], color: r % 2 ? '#5f9e3a' : '#7aae45' })),
          ]),
          // Su kanalı (ark) ve kenar taşları
          { shape: 'box', size: [2.0, 0.04, 0.08], at: [0, 0.15, 0.66], color: '#4e8fb8' },
        ],
        plotOrchard: [
          { shape: 'box', size: [2.0, 0.15, 1.4], color: '#5f8f3a' },
          { shape: 'box', size: [2.04, 0.14, 0.06], at: [0, 0, 0.7], color: '#8a6a45' },
          { shape: 'box', size: [2.04, 0.14, 0.06], at: [0, 0, -0.7], color: '#8a6a45' },
          // Çim tutamları ve çiçekler
          ...Array.from({ length: 14 }, (_, k) => k).map((k) => ({ shape: 'sphere', r: 0.05, seg: 6, rings: 4, scale: [1.3, 0.5, 1], at: [-0.9 + ((k * 37) % 18) / 10, 0.15, -0.6 + ((k * 23) % 12) / 10], color: k % 3 ? '#6fa045' : '#e8d35a' })),
        ],
        tree: leafyTree('#6b4a2f', '#3f7d2e', '#4f9338'),
        river: [
          { shape: 'box', size: [9.4, 0.05, 1.6], color: '#4e8fb8' },
          { shape: 'box', size: [9.4, 0.08, 0.14], at: [0, 0, 0.82], color: '#9b8a6a' },
          { shape: 'box', size: [9.4, 0.08, 0.14], at: [0, 0, -0.82], color: '#9b8a6a' },
          // Akıntı çizgileri ve kıyı sazlıkları
          ...[-3.4, -1.8, 0.4, 2.6].map((x, k) => ({ shape: 'box', size: [0.9, 0.006, 0.03], at: [x, 0.05, -0.3 + (k % 2) * 0.5], color: '#9fc8e0', detail: true })),
          ...Array.from({ length: 16 }, (_, k) => -4.4 + k * 0.6).map((x, k) => ({ shape: 'cone', r: 0.06, h: 0.24 + (k % 3) * 0.06, seg: 5, at: [x, 0.04, (k % 2 ? 0.74 : -0.74)], color: k % 2 ? '#6f8f45' : '#7f9f4f' })),
        ],
        bridge: [
          // On Gözlü Köprü tarzı: sivri hatlı gözler, selyaranlar ve korkuluk
          ...arcade({ n: 5, aw: 0.5, h: 0.5, d: 0.45, r: 0.16, spring: 0.18, color: '#5a524c', band: '#8d847a', stripes: [0.42] }),
          ...[-1.0, -0.5, 0, 0.5, 1.0].map((x) => x + 0.25).filter((x) => x < 1.2).flatMap((x) => [0.26, -0.26].map((z) => ({ shape: 'cyl', rt: 0.01, rb: 0.1, h: 0.22, seg: 3, rotY: z > 0 ? 0 : 180, at: [x - 0.25 + 0.0, 0, z], color: '#4f4843' }))),
          { shape: 'box', size: [2.52, 0.06, 0.5], at: [0, 0.5, 0], color: '#6a615a' },
          { shape: 'box', size: [2.52, 0.12, 0.06], at: [0, 0.56, 0.22], color: '#4a4441' },
          { shape: 'box', size: [2.52, 0.12, 0.06], at: [0, 0.56, -0.22], color: '#4a4441' },
          { shape: 'box', size: [0.3, 0.14, 0.08], at: [0, 0.6, 0.23], color: '#b9ae9e' }, // kitabe
        ],
      },
      structure: [
        { part: 'ridge', pos: [0, 0, -1.6], ry: 0 },
        { part: 'tower', pos: [-3.9, 0.8, -1.6], ry: 0 },
        { part: 'tower', pos: [0, 0.8, -1.6], ry: 0 },
        { part: 'tower', pos: [3.9, 0.8, -1.6], ry: 0 },
        { part: 'wall', pos: [-1.95, 0.8, -1.6], ry: 0 },
        { part: 'wall', pos: [1.95, 0.8, -1.6], ry: 0 },
        { part: 'plotVeg', pos: [-3.3, 0, 0.3], ry: 0 },
        { part: 'plotOrchard', pos: [-1.1, 0, 0.3], ry: 0 },
        { part: 'plotVeg', pos: [1.1, 0, 0.3], ry: 0 },
        { part: 'plotOrchard', pos: [3.3, 0, 0.3], ry: 0 },
        { part: 'tree', pos: [-1.55, 0.15, 0.3], ry: 0 },
        { part: 'tree', pos: [-0.65, 0.15, 0.3], ry: 0 },
        { part: 'tree', pos: [2.85, 0.15, 0.3], ry: 0 },
        { part: 'tree', pos: [3.75, 0.15, 0.3], ry: 0 },
        { part: 'river', pos: [0, 0, 2.2], ry: 0 },
        { part: 'bridge', pos: [2.0, 0, 2.3], ry: 1 },
      ],
    },

    /* ---------------------------------------------- ULU CAMİİ */
    {
      id: 'diyarbakir-ulu',
      name: 'Diyarbakır Ulu Camii',
      place: 'Sur, Diyarbakır',
      era: '1091',
      theme: { sky: '#e7d7bf', fog: '#e8dcc8', ground: '#8f8170', pad: '#9e917f' },
      intro:
        'Önce avluyu döşe. Sonra harim kanatlarını, yüksek orta nefi ve üçgen çatısını kur; ' +
        'avlunun iki yanına iki katlı revakları, öne kapılı avlu duvarını, kare minareyi ve şadırvanı yerleştir.',
      facts: [
        'Anadolu\'nun en eski camilerinden biridir; bugünkü yapı 1091\'de Büyük Selçuklu Sultanı Melikşah döneminde yapıldı.',
        'Planı Şam\'daki Emevi Camii\'ne benzer: geniş bir avlu ve yüksek orta nefli bir harim.',
        'Avlu cepheleri antik yapılardan alınmış (devşirme) sütun ve başlıklarla süslüdür.',
        'Siyah bazalt ile beyaz kireçtaşının dönüşümlü kullanımı ve kare gövdeli minaresi ile tanınır.',
      ],
      parts: {
        courtyard: [
          { shape: 'box', size: [6.4, 0.1, 5.2], color: '#5a534e' },
          // Bazalt ve kireçtaşı döşeme deseni
          ...[-1.8, -0.6, 0.6, 1.8].flatMap((z) => [-2.4, -1.2, 0, 1.2, 2.4].map((x, k) => ({ shape: 'box', size: [1.1, 0.012, 1.1], at: [x, 0.1, z], color: (k + Math.round(z)) % 2 ? '#6a625c' : '#7d746c', detail: true }))),
        ],
        wing: [
          { shape: 'box', size: [2.6, 1.32, 0.6], at: [0, 0, -0.3], color: BAZALT },
          ...arcade({ n: 3, aw: 2.6 / 3, h: 1.32, d: 0.6, r: 0.24, spring: 0.65, z: 0.3, color: BAZALT2, band: KIRECTASI, stripes: [1.0, 1.18] }),
          // Antik devşirme sütunlar ve süslü friz kuşağı
          ...[-1.3, -0.433, 0.433, 1.3].flatMap((x) => column({ r: 0.07, h: 0.95, at: [x, 0, 0.64], color: '#d6ccb8', order: 'corinthian', flutes: 12 })),
          { shape: 'box', size: [2.62, 0.14, 0.05], at: [0, 1.06, 0.62], color: '#cbbfa6' },
          ...Array.from({ length: 13 }, (_, k) => -1.2 + k * 0.2).map((x) => ({ shape: 'box', size: [0.08, 0.08, 0.02], at: [x, 1.09, 0.65], rotZ: 45, color: '#8f8577', detail: true })),
          { shape: 'box', size: [2.66, 0.08, 1.26], at: [0, 1.32, 0], color: KURSUN },
        ],
        nave: [
          { shape: 'box', size: [1.2, 1.9, 1.5], color: BAZALT2 },
          ...[0.4, 0.8, 1.2, 1.6].map((y) => ({ shape: 'box', size: [1.22, 0.06, 1.52], at: [0, y, 0], color: KIRECTASI })),
          // Yüksek sivri kemerli taçkapı ve çerçeveleri
          ...win({ w: 0.7, h: 1.4, at: [0, 0, 0.75], top: 'pointed', color: KIRECTASI, d: 0.04 }),
          ...win({ w: 0.52, h: 1.18, at: [0, 0, 0.8], top: 'pointed', color: '#241f1d', d: 0.04 }),
          ...win({ w: 0.16, h: 0.36, at: [0, 1.45, 0.75], top: 'round', color: '#241f1d', frame: KIRECTASI }),
        ],
        gable: [
          { shape: 'tri', w: 1.3, h: 0.5, d: 1.6, color: KURSUN },
          { shape: 'tri', w: 1.05, h: 0.36, d: 0.04, at: [0, 0.05, 0.8], color: KIRECTASI },
          ...win({ w: 0.14, h: 0.18, at: [0, 0.1, 0.82], top: 'round', color: '#241f1d' }),
        ],
        arcadeLow: [
          ...arcade({ n: 4, aw: 0.9, h: 0.94, d: 0.6, r: 0.26, spring: 0.42, color: BAZALT2, band: KIRECTASI, stripes: [0.8] }),
          ...[-1.8, -0.9, 0, 0.9, 1.8].flatMap((x) => column({ r: 0.065, h: 0.78, at: [x, 0, 0.36], color: '#d6ccb8', order: 'corinthian', flutes: 12 })),
          { shape: 'box', size: [3.6, 0.06, 0.62], at: [0, 0.94, 0], color: KIRECTASI },
          ...Array.from({ length: 18 }, (_, k) => -1.7 + k * 0.2).map((x) => ({ shape: 'box', size: [0.07, 0.07, 0.02], at: [x, 0.85, 0.31], rotZ: 45, color: '#8f8577', detail: true })),
        ],
        arcadeUp: [
          ...arcade({ n: 6, aw: 0.6, h: 0.74, d: 0.6, r: 0.17, spring: 0.34, color: BAZALT, band: KIRECTASI, stripes: [0.64] }),
          ...[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].flatMap((x) => column({ r: 0.05, h: 0.6, at: [x, 0, 0.35], color: '#e0d7c4', order: 'ionic', flutes: 10 })),
          { shape: 'box', size: [3.6, 0.06, 0.62], at: [0, 0.74, 0], color: KURSUN },
        ],
        gateWall: archPart({
          w: 6.4, h: 1.2, d: 0.4, r: 0.38, spring: 0.6, bands: [0.25, 0.45],
          color: BAZALT, band: KIRECTASI, trim: KIRECTASI, joint: '#2d2927', course: 0.15,
        }),
        minaret: [
          // Kare gövdeli bazalt minare (Diyarbakır'a özgü), beyaz taş bantlar
          { shape: 'box', size: [0.8, 3.4, 0.8], color: BAZALT },
          ...[0.6, 1.2, 1.8, 2.4, 3.0].map((y) => ({ shape: 'box', size: [0.82, 0.07, 0.82], at: [0, y, 0], color: KIRECTASI })),
          ...onFaces([...win({ w: 0.12, h: 0.32, at: [0, 2.5, 0.4], top: 'pointed', color: '#1d1a19', frame: KIRECTASI })]),
          ...onFaces([...win({ w: 0.08, h: 0.2, at: [0, 1.4, 0.4], top: 'flat', color: '#1d1a19' })]),
          { shape: 'box', size: [1.0, 0.08, 1.0], at: [0, 3.4, 0], color: KIRECTASI },
          ...onFaces([...Array.from({ length: 5 }, (_, k) => ({ shape: 'box', size: [0.03, 0.12, 0.03], at: [-0.4 + k * 0.2, 3.48, 0.47], color: KIRECTASI, detail: true }))]),
          { shape: 'box', size: [0.5, 0.4, 0.5], at: [0, 3.48, 0], color: BAZALT2 },
          ...onFaces(win({ w: 0.1, h: 0.22, at: [0, 3.55, 0.25], top: 'pointed', color: '#1d1a19' })),
          { shape: 'cone', r: 0.42, h: 0.35, seg: 4, rotY: 45, at: [0, 3.88, 0], color: KURSUN },
          ...alem(4.18, 0.5),
        ],
        fountain: [
          ...sadirvan(0.55, 0.85, '#cfc4ad', BAZALT, KURSUN),
        ],
      },
      structure: [
        { part: 'courtyard', pos: [0, 0, 0], ry: 0 },
        { part: 'wing', pos: [-1.9, 0.1, -2.0], ry: 0 },
        { part: 'wing', pos: [1.9, 0.1, -2.0], ry: 0 },
        { part: 'nave', pos: [0, 0.1, -1.85], ry: 0 },
        { part: 'gable', pos: [0, 2.0, -1.85], ry: 0 },
        { part: 'arcadeLow', pos: [-2.9, 0.1, 0.4], ry: 1 },
        { part: 'arcadeLow', pos: [2.9, 0.1, 0.4], ry: 3 },
        { part: 'arcadeUp', pos: [-2.9, 1.1, 0.4], ry: 1 },
        { part: 'arcadeUp', pos: [2.9, 1.1, 0.4], ry: 3 },
        { part: 'gateWall', pos: [0, 0.1, 2.4], ry: 0 },
        { part: 'fountain', pos: [0, 0.1, 0.5], ry: 0 },
        { part: 'minaret', pos: [3.75, 0, 2.4], ry: 0 },
      ],
    },
    /* ---------------------------------------------- SELİMİYE */
    {
      id: 'selimiye',
      name: 'Selimiye Camii',
      place: 'Edirne',
      era: '1568 – 1575',
      theme: { sky: '#bcd4e8', fog: '#cddcea', ground: '#8fa06a', pad: '#d8cfbe' },
      intro:
        'Mimar Sinan\'ın "ustalık eserim" dediği camiyi kuruyorsun. Kaideye harim gövdesini ve revaklı avluyu oturt; ' +
        'sekizgen kasnağı, sekiz payanda kulesini, dev kubbeyi ve alemi, ardından üç şerefeli dört minareyi ve şadırvanı yerleştir.',
      facts: [
        'Sultan II. Selim\'in emriyle Mimar Sinan tarafından yapıldı; Sinan onu "ustalık eserim" olarak niteledi.',
        'Yaklaşık 31 metre çapındaki kubbesi sekiz büyük ayağa oturur ve içeride kesintisiz bir mekân yaratır.',
        'Dört minaresi yaklaşık 71 metre ile en yüksek Osmanlı minareleri arasındadır; her biri üç şerefelidir.',
        'Külliyesiyle birlikte 2011\'de UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        platform: [
          { shape: 'box', size: [5.2, 0.2, 7.8], color: '#cfc6b4' },
          { shape: 'box', size: [5.24, 0.04, 7.84], at: [0, 0.16, 0], color: '#bdb4a2' },
        ],
        hall: [
          { shape: 'box', size: [4, 1.6, 4], color: '#e4dccb' },
          // Kat kat sivri ve yuvarlak kemerli pencereler (Selimiye ışıkla doludur)
          ...[2.0, -2.0].flatMap((x) => [
            ...winRow({ n: 6, span: 3.2, at: [x, 0.2, 0], rotY: x > 0 ? 90 : -90, w: 0.17, h: 0.38, top: 'pointed', color: '#3a3632', frame: '#d2c7b4', glow: true }),
            ...winRow({ n: 6, span: 3.2, at: [x, 0.84, 0], rotY: x > 0 ? 90 : -90, w: 0.15, h: 0.34, top: 'round', color: '#3a3632', frame: '#d2c7b4', glow: true }),
            ...winRow({ n: 3, span: 1.6, at: [x, 1.28, 0], rotY: x > 0 ? 90 : -90, w: 0.12, h: 0.2, top: 'round', color: '#3a3632', glow: true }),
          ]),
          ...winRow({ n: 6, span: 3.2, at: [0, 0.5, -2.0], rotY: 180, w: 0.17, h: 0.45, top: 'pointed', color: '#3a3632', frame: '#d2c7b4', glow: true }),
          // Mukarnaslı taçkapı
          ...win({ w: 1.0, h: 1.3, at: [0, 0, 2.0], top: 'pointed', color: '#d2c7b4', d: 0.06 }),
          ...win({ w: 0.6, h: 0.9, at: [0, 0, 2.06], top: 'pointed', color: '#4b3a30', d: 0.04 }),
          ...Array.from({ length: 4 }, (_, k) => ({ shape: 'box', size: [0.8 - k * 0.14, 0.05, 0.08], at: [0, 0.98 + k * 0.06, 2.06], color: '#c4b8a2', detail: true })),
          // Payanda kuleleri arasındaki dış galeriler: köşe ağırlık paye izleri
          ...[[-2, -2], [2, -2], [-2, 2], [2, 2]].map(([x, z]) => ({ shape: 'box', size: [0.3, 1.6, 0.3], at: [x * 0.98, 0, z * 0.98], color: '#d8cfbd' })),
          ...cornice(4, 4, 1.5, '#d2c7b4', { h: 0.08, over: 0.05, step: true }),
        ],
        court: [
          { shape: 'box', size: [3.2, 0.02, 2.6], color: '#bfb6a3' },
          // Revaklar: sütunlu sivri kemerler, her gözde küçük kurşun kubbe
          ...shift(arcade({ n: 5, aw: 0.8, h: 0.9, d: 0.5, r: 0.22, spring: 0.4, color: '#e4dccb' }), 0, 0, 1.5),
          ...shift(turn(arcade({ n: 4, aw: 0.8, h: 0.9, d: 0.5, r: 0.22, spring: 0.4, color: '#e4dccb' }), 90), 1.85, 0, 0),
          ...shift(turn(arcade({ n: 4, aw: 0.8, h: 0.9, d: 0.5, r: 0.22, spring: 0.4, color: '#e4dccb' }), -90), -1.85, 0, 0),
          ...[-2, -1.2, -0.4, 0.4, 1.2, 2].flatMap((x) => column({ r: 0.055, h: 0.62, at: [x, 0, 1.24], color: '#f2ece0', order: 'ionic', flutes: 12 })),
          ...[-1.6, -0.8, 0, 0.8, 1.6].map((x) => ({ shape: 'hemi', r: 0.26, sy: 0.8, at: [x, 0.9, 1.5], color: '#8b98a5' })),
          ...[-1.2, -0.4, 0.4, 1.2].flatMap((z) => [
            { shape: 'hemi', r: 0.26, sy: 0.8, at: [1.85, 0.9, z], color: '#8b98a5' },
            { shape: 'hemi', r: 0.26, sy: 0.8, at: [-1.85, 0.9, z], color: '#8b98a5' },
          ]),
          // Kırmızı-beyaz almaşık kemer taşları izlenimi
          ...[-1.6, -0.8, 0, 0.8, 1.6].map((x) => ({ shape: 'torus', r: 0.25, tube: 0.03, radial: 4, seg: 12, arc: Math.PI, at: [x, 0.4, 1.76], color: '#b5503a', detail: true })),
        ],
        drum: [
          { shape: 'cyl', rt: 1.72, rb: 1.75, h: 0.55, seg: 8, rotY: 22.5, color: '#e9e2d3' },
          ...ringWins(16, 1.66, 0.12, { w: 0.13, h: 0.3, top: 'round', color: '#3a3632', glow: true, startDeg: 11.25 }),
          { shape: 'cyl', rt: 1.78, rb: 1.78, h: 0.06, seg: 8, rotY: 22.5, at: [0, 0.5, 0], color: '#d2c7b4' },
        ],
        turrets: [0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => {
          // Sekiz ağırlık kulesi: sekizgen gövde, pencere, kurşun kubbecik ve alem
          const a = ((22.5 + 45 * i) * Math.PI) / 180;
          const x = Math.sin(a) * 1.98, z = Math.cos(a) * 1.98;
          return [
            { shape: 'cyl', rt: 0.2, rb: 0.22, h: 0.85, seg: 8, at: [x, 0, z], color: '#e4dccb' },
            { shape: 'cyl', rt: 0.23, rb: 0.23, h: 0.05, seg: 8, at: [x, 0.8, z], color: '#d2c7b4' },
            ...win({ w: 0.08, h: 0.22, at: [x + Math.sin(a) * 0.21, 0.4, z + Math.cos(a) * 0.21], rotY: (a * 180) / Math.PI, top: 'round', color: '#3a3632' }),
            { shape: 'hemi', r: 0.22, sy: 0.9, at: [x, 0.85, z], color: '#8b98a5' },
            { shape: 'cyl', rt: 0.008, rb: 0.012, h: 0.14, seg: 5, at: [x, 1.04, z], color: '#c9a646', metal: true },
          ];
        }),
        dome: [...ribbedDome(1.72, 0.62, 32, '#8b98a5', '#9aa6b2')],
        alem: [...alem(0, 1.4)],
        minaret: minaret({
          base: 0.42, baseH: 0.5, r: 0.15, shaft: 5.0, cap: 1.0, balconies: [3.2, 4.0, 4.8],
          stone: '#e8e0d0', body: '#f1ebdf', rail: '#d8cfbe', lead: '#7d8a96',
        }),
        fountain: [...sadirvan(0.46, 0.72, '#e8e0d0', '#d8cfbe', '#8b98a5')],
      },
      structure: [
        { part: 'platform', pos: [0, 0, 0.5], ry: 0 },
        { part: 'hall', pos: [0, 0.2, -1.0], ry: 0 },
        { part: 'court', pos: [0, 0.2, 2.6], ry: 0 },
        { part: 'drum', pos: [0, 1.8, -1.0], ry: 0 },
        { part: 'turrets', pos: [0, 1.8, -1.0], ry: 0 },
        { part: 'dome', pos: [0, 2.35, -1.0], ry: 0 },
        { part: 'alem', pos: [0, 3.42, -1.0], ry: 0 },
        { part: 'minaret', pos: [-2.2, 0.2, 0.72], ry: 0 },
        { part: 'minaret', pos: [2.2, 0.2, 0.72], ry: 0 },
        { part: 'minaret', pos: [-2.2, 0.2, -2.8], ry: 0 },
        { part: 'minaret', pos: [2.2, 0.2, -2.8], ry: 0 },
        { part: 'fountain', pos: [0, 0.2, 2.5], ry: 0 },
      ],
    },
  );
})();
