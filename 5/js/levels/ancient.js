/* =========================================================
   ANIT USTASI — Antik dünya bölümleri
   ========================================================= */

(function () {
  const AU = window.AU;
  const { triglyphs, K, arcade, octo, column, win, stairs } = AU.shapes;

  /* ---------- Antik model yardımcıları ---------- */

  // Keops dilimi: düz yüzey yerine basamaklı taş sıraları (gerçek piramidin bugünkü görünümü)
  function steppedSlice(bottom, top, h, colors, rows) {
    const n = rows || 5;
    const out = [];
    for (let i = 0; i < n; i++) {
      const b = bottom - ((bottom - top) * i) / n;
      const t = bottom - ((bottom - top) * (i + 1)) / n;
      // Her sıranın üstü bir sonrakinden biraz geniş → basamak çizgisi
      out.push({ shape: 'cyl', rb: b * K, rt: (t + (b - t) * 0.35) * K, h: h / n, seg: 4, rotY: 45, at: [0, (h * i) / n, 0], color: colors[i % colors.length] });
    }
    return out;
  }

  // Stonehenge sarsen taşı üstündeki zıvana çıkıntısı ve aşınma oyukları
  function weathering(w, h, d, color, seed) {
    const out = [];
    for (let i = 0; i < 3; i++) {
      const x = (((seed * 37 + i * 53) % 100) / 100 - 0.5) * w * 0.6;
      out.push({ shape: 'box', size: [0.05, h * (0.35 + i * 0.12), 0.02], at: [x, h * 0.15, d / 2 + 0.005], color, detail: true });
    }
    return out;
  }

  // Sfenks: yatan aslan gövdesi, insan başı ve nemes başlığı
  function sphinxModel() {
    const body = '#c9a46a', dark = '#a8844f', light = '#d6b47c';
    return [
      { shape: 'box', size: [1.05, 0.12, 2.05], color: '#b89463' },
      // Gövde ve arka kalça (yumuşak hatlı)
      { shape: 'sphere', r: 0.5, scale: [0.62, 0.62, 1.55], at: [0, 0.06, -0.3], color: body },
      { shape: 'sphere', r: 0.36, scale: [0.95, 0.85, 1.1], at: [0, 0.1, -0.85], color: dark },
      // Ön ayaklar
      ...[-0.19, 0.19].map((x) => ({ shape: 'box', size: [0.17, 0.13, 0.72], at: [x, 0.12, 0.55], color: body })),
      ...[-0.19, 0.19].map((x) => ({ shape: 'sphere', r: 0.085, scale: [1, 0.7, 1.1], at: [x, 0.12, 0.9], color: light })),
      // Göğüs ve boyun
      { shape: 'sphere', r: 0.3, scale: [1, 1.25, 0.8], at: [0, 0.22, 0.28], color: body },
      // Nemes başlığı (yanlara açılan kanatlar) ve baş
      { shape: 'extrude', pts: [[-0.32, 0], [0.32, 0], [0.24, 0.32], [0.16, 0.44], [-0.16, 0.44], [-0.24, 0.32]], d: 0.34, at: [0, 0.56, 0.36], color: '#c19a60' },
      { shape: 'sphere', r: 0.16, scale: [1, 1.15, 1], at: [0, 0.66, 0.44], color: light },
      { shape: 'box', size: [0.05, 0.08, 0.06], at: [0, 0.78, 0.6], color: dark },
      ...[-0.06, 0.06].map((x) => ({ shape: 'box', size: [0.045, 0.02, 0.02], at: [x, 0.86, 0.59], color: '#5c4630', detail: true })),
      // Nemes çizgileri
      ...[0.08, 0.18, 0.28].map((y) => ({ shape: 'box', size: [0.6 - y * 0.5, 0.018, 0.36], at: [0, 0.56 + y, 0.36], color: dark, detail: true })),
      // Kuyruk
      { shape: 'tube', pts: [[0.28, 0.1, -1.05], [0.36, 0.08, -0.7], [0.34, 0.06, -0.3]], r: 0.03, color: dark },
    ];
  }

  // Kolezyum dış kemer katı: kemerler + yarım sütunlar + silmeler
  function colosseumStorey(h, spring, y0, color, colColor, order) {
    const list = [...arcade({ n: 4, aw: 0.8, h, d: 0.5, r: 0.23, spring, y0, color })];
    for (let i = 0; i <= 4; i++) {
      list.push(...column({ r: 0.07, h: h - 0.12, at: [-1.6 + 0.8 * i, y0, 0.27], color: colColor, order, flutes: 12 }));
    }
    list.push({ shape: 'box', size: [3.26, 0.06, 0.62], at: [0, y0 + h - 0.12, 0], color: colColor });
    list.push({ shape: 'box', size: [3.3, 0.06, 0.66], at: [0, y0 + h - 0.06, 0], color: colColor });
    // Kemer içi gölgeli tonoz izlenimi
    for (let i = 0; i < 4; i++) list.push({ shape: 'box', size: [0.44, 0.02, 0.46], at: [-1.2 + 0.8 * i, y0 + spring + 0.22, 0], color: '#8c7558', detail: true });
    return list;
  }

  AU.levelDefs.push(
    /* ---------------------------------------------- 1 */
    {
      id: 'stonehenge',
      name: 'Stonehenge',
      place: 'Wiltshire, İngiltere',
      era: 'MÖ ~3000 – 1500',
      theme: { sky: '#bcd3dd', fog: '#cfdde2', ground: '#7d9a5a', pad: '#9aa37e' },
      intro:
        'Dev dikili taşları ikişer ikişer yerleştir, üstlerine yatay lento taşlarını koy. ' +
        'Bir taşa tıklayıp yuvasına tıklayabilir ya da taşı sürükleyip yuvasına bırakabilirsin.',
      facts: [
        'Yaklaşık 1500 yıl boyunca birkaç aşamada inşa edildi.',
        'Büyük "sarsen" taşlarının bazıları 25 tonu aşar.',
        'Küçük "mavi taşlar" yaklaşık 200 km uzaktaki Galler\'den getirildi.',
        'Ana ekseni yaz gündönümünde Güneş\'in doğduğu yöne hizalanır.',
      ],
      parts: {
        upright: [
          { shape: 'rock', size: [0.85, 2.4, 0.55], seed: 1, jitter: 0.07, color: '#8f8a80' },
          { shape: 'rock', size: [0.55, 1.3, 0.5], seed: 11, jitter: 0.05, at: [0.08, 0.5, 0.04], color: '#a29c90' },
          { shape: 'sphere', r: 0.09, scale: [1, 0.7, 1], at: [0, 2.33, 0], color: '#8f8a80' }, // zıvana
          ...weathering(0.85, 2.4, 0.55, '#6f6a62', 3),
          { shape: 'box', size: [0.3, 0.5, 0.02], at: [-0.18, 0.9, -0.28], color: '#9aa27a', detail: true }, // liken
        ],
        lintel: [
          { shape: 'rock', size: [2.3, 0.45, 0.6], seed: 2, jitter: 0.05, color: '#a19b90' },
          { shape: 'rock', size: [1.2, 0.2, 0.62], seed: 12, jitter: 0.03, at: [-0.4, 0.28, 0], color: '#b0aa9e' },
          { shape: 'box', size: [0.5, 0.02, 0.4], at: [0.6, 0.45, 0.05], color: '#a3ab7f', detail: true },
          ...weathering(2.3, 0.45, 0.6, '#7d776d', 7),
        ],
        altar: [
          { shape: 'rock', size: [1.5, 0.28, 0.7], seed: 3, jitter: 0.05, color: '#76695a' },
          { shape: 'rock', size: [0.6, 0.15, 0.5], seed: 13, jitter: 0.04, at: [0.45, 0.2, 0.05], color: '#867a69' },
        ],
        bluestone: [
          { shape: 'rock', size: [0.4, 1.3, 0.32], seed: 4, jitter: 0.05, color: '#6f7b86' },
          { shape: 'rock', size: [0.26, 0.6, 0.3], seed: 14, jitter: 0.03, at: [0.03, 0.4, 0.02], color: '#7d8994' },
        ],
        heel: [
          { shape: 'rock', size: [0.95, 1.7, 0.8], seed: 5, jitter: 0.12, rotZ: -6, color: '#9a9385' },
          { shape: 'rock', size: [0.6, 0.9, 0.7], seed: 15, jitter: 0.08, at: [-0.1, 0.7, 0.05], color: '#a9a294' },
        ],
      },
      structure: [
        { part: 'upright', pos: [-0.72, 0, -2], ry: 0 },
        { part: 'upright', pos: [0.72, 0, -2], ry: 0 },
        { part: 'lintel', pos: [0, 2.4, -2], ry: 0 },
        { part: 'upright', pos: [-2, 0, -0.72], ry: 1 },
        { part: 'upright', pos: [-2, 0, 0.72], ry: 1 },
        { part: 'lintel', pos: [-2, 2.4, 0], ry: 1 },
        { part: 'upright', pos: [2, 0, -0.72], ry: 1 },
        { part: 'upright', pos: [2, 0, 0.72], ry: 1 },
        { part: 'lintel', pos: [2, 2.4, 0], ry: 1 },
        { part: 'altar', pos: [0, 0, 0], ry: 0 },
        { part: 'bluestone', pos: [-0.95, 0, 0.95], ry: 0 },
        { part: 'bluestone', pos: [0, 0, 1.3], ry: 0 },
        { part: 'bluestone', pos: [0.95, 0, 0.95], ry: 0 },
        { part: 'heel', pos: [0, 0, 3.2], ry: 0 },
      ],
    },

    /* ---------------------------------------------- 2 */
    {
      id: 'giza',
      name: 'Keops Piramidi',
      place: 'Giza, Mısır',
      era: 'MÖ ~2560',
      theme: { sky: '#f2d9a6', fog: '#f0d8a8', ground: '#d8b27a', pad: '#c79f68' },
      intro:
        'Piramidi dilim dilim, büyükten küçüğe yükselt ve tepesine altın kaplı "piramidion"u koy. ' +
        'Yanına kraliçe piramitlerini ve Sfenks\'i de yerleştir.',
      facts: [
        'Antik Dünyanın Yedi Harikası\'ndan günümüze ulaşan tek yapıdır.',
        'Yapıldığında yaklaşık 146 m yüksekliğindeydi; 3800 yıl boyunca insan yapımı en yüksek yapı olarak kaldı.',
        'Tahminen 2,3 milyon taş blok kullanıldı.',
        'Yüzeyi bir zamanlar parlak beyaz Tura kireçtaşı ile kaplıydı.',
      ],
      parts: {
        s1: [...steppedSlice(5, 4.134, 0.55, ['#d8b77f', '#cfae76', '#dcbd86'], 6)],
        s2: [
          ...steppedSlice(4.134, 3.268, 0.55, ['#d6b47b', '#ccaa72', '#d9b980'], 6),
          // Kuzey girişi: üst üste çatılmış kireçtaşı kirişler (şevron)
          { shape: 'extrude', pts: [[-0.24, 0], [0.24, 0], [0.24, 0.22], [0, 0.4], [-0.24, 0.22]], d: 0.16, at: [0, 0.06, 1.94], color: '#e2cc9a' },
          { shape: 'extrude', pts: [[-0.1, 0], [0.1, 0], [0.1, 0.16], [-0.1, 0.16]], d: 0.05, at: [0, 0.08, 2.03], color: '#3d2c1c' },
        ],
        s3: [...steppedSlice(3.268, 2.402, 0.55, ['#dcbd86', '#d2b17a', '#dfc28c'], 5)],
        s4: [...steppedSlice(2.402, 1.536, 0.55, ['#d6b47b', '#ccab74', '#dbbb84'], 5)],
        s5: [...steppedSlice(1.536, 0.67, 0.55, ['#dcbd86', '#d4b47d'], 4)],
        cap: [
          { shape: 'cone', r: 0.67 * K, h: 0.43, seg: 4, rotY: 45, color: '#e8b84a', metal: true },
          { shape: 'cone', r: 0.2 * K, h: 0.13, seg: 4, rotY: 45, at: [0, 0.3, 0], color: '#f4d06a', metal: true },
        ],
        queen: [
          { shape: 'box', size: [1.5, 0.08, 1.5], color: '#c9a66d' },
          ...steppedSlice(1.35, 0.95, 0.24, ['#d3b075', '#c8a56c'], 3).map((it) => ({ ...it, at: [0, it.at[1] + 0.08, 0] })),
          ...steppedSlice(0.95, 0.5, 0.36, ['#d3b075', '#c8a56c'], 3).map((it) => ({ ...it, at: [0, it.at[1] + 0.32, 0] })),
          { shape: 'cone', r: 0.5 * K, h: 0.35, seg: 4, rotY: 45, at: [0, 0.68, 0], color: '#d8b77d' },
          // Önündeki küçük şapel kalıntısı
          { shape: 'box', size: [0.5, 0.12, 0.2], at: [0, 0.08, 0.7], color: '#bf9b62' },
        ],
        sphinx: sphinxModel(),
      },
      structure: [
        { part: 's1', pos: [0, 0, 0], ry: 0 },
        { part: 's2', pos: [0, 0.55, 0], ry: 0 },
        { part: 's3', pos: [0, 1.1, 0], ry: 0 },
        { part: 's4', pos: [0, 1.65, 0], ry: 0 },
        { part: 's5', pos: [0, 2.2, 0], ry: 0 },
        { part: 'cap', pos: [0, 2.75, 0], ry: 0 },
        { part: 'queen', pos: [3.9, 0, 1.3], ry: 0 },
        { part: 'queen', pos: [3.9, 0, -0.6], ry: 0 },
        { part: 'sphinx', pos: [-3.5, 0, 2.6], ry: 0 },
      ],
    },

    /* ---------------------------------------------- 3 */
    {
      id: 'parthenon',
      name: 'Parthenon',
      place: 'Akropolis, Atina',
      era: 'MÖ 447 – 432',
      theme: { sky: '#a9cdea', fog: '#c4dcef', ground: '#b9ad8f', pad: '#d7d0bf' },
      intro:
        'Üç basamaklı kaideyi kur, sütunları ve iç odayı (naos) diz; ardından arşitrav, ' +
        'triglifli friz ve heykelli alınlığı yerleştir.',
      facts: [
        'Tanrıça Athena Parthenos\'a adanmış bir tapınaktır.',
        'Mimarları İktinos ve Kallikrates, heykel programının yöneticisi Phidias\'tır.',
        'Dor düzeninde yapılmıştır; gerçek yapıda kısa kenarda 8, uzun kenarda 17 sütun vardır.',
        'Sütunlar hafif şişkin (entasis) yapılarak uzaktan dümdüz görünmeleri sağlanmıştır.',
      ],
      parts: {
        step1: [
          { shape: 'box', size: [6.8, 0.2, 4.0], color: '#cbc2ad' },
          { shape: 'box', size: [6.82, 0.03, 4.02], at: [0, 0.17, 0], color: '#bdb39c' },
          ...stairs({ w: 1.6, d: 0.3, h: 0.2, n: 2, at: [0, 0, 2.15], color: '#c4baa3' }),
        ],
        step2: [
          { shape: 'box', size: [6.5, 0.2, 3.7], color: '#d6cebb' },
          { shape: 'box', size: [6.52, 0.03, 3.72], at: [0, 0.17, 0], color: '#c8bfa9' },
        ],
        step3: [
          { shape: 'box', size: [6.2, 0.2, 3.4], color: '#e0d9c8' },
          { shape: 'box', size: [6.22, 0.03, 3.42], at: [0, 0.17, 0], color: '#d2cab6' },
        ],
        column: [
          // Dor sütunu: kaidesiz, 20 yivli, şişkin gövde (entasis), echinus + abakus
          { shape: 'lathe', seg: 20, flat: true, color: '#efe9dc', points: [[0, 0], [0.22, 0], [0.215, 0.5], [0.205, 1.0], [0.19, 1.5], [0.172, 1.95], [0, 1.95]] },
          { shape: 'cyl', rt: 0.178, rb: 0.178, h: 0.035, seg: 20, at: [0, 1.88, 0], color: '#d9d1bf' },
          { shape: 'lathe', seg: 20, color: '#e6dfcf', points: [[0, 0], [0.18, 0], [0.24, 0.04], [0.3, 0.1], [0.31, 0.12], [0, 0.12]], at: [0, 1.95, 0] },
          { shape: 'box', size: [0.62, 0.1, 0.62], at: [0, 2.07, 0], color: '#d9d1bf' },
        ],
        naos: [
          { shape: 'box', size: [3.2, 2.17, 1.6], color: '#d4cab5' },
          // Ön cephe: büyük kapı, çerçeve, pronaos ante'leri ve iç sütunlar
          { shape: 'box', size: [0.74, 1.46, 0.06], at: [0, 0, 0.81], color: '#e6dccb' },
          { shape: 'box', size: [0.6, 1.36, 0.06], at: [0, 0, 0.83], color: '#4a3b2c' },
          { shape: 'box', size: [0.94, 0.14, 0.1], at: [0, 1.42, 0.82], color: '#c8bca4' },
          ...[-1.5, 1.5].map((x) => ({ shape: 'box', size: [0.22, 2.17, 0.12], at: [x, 0, 0.82], color: '#e0d7c4' })),
          ...[-1.5, 1.5].map((x) => ({ shape: 'box', size: [0.26, 0.12, 0.16], at: [x, 2.05, 0.82], color: '#d0c5ae' })),
          ...[-0.9, 0.9].flatMap((x) => column({ r: 0.12, h: 2.17, at: [x, 0, 1.0], color: '#ebe4d6', flutes: 16 })),
          // Duvar taş sıraları
          ...[0.45, 0.9, 1.35, 1.8].map((y) => ({ shape: 'box', size: [3.22, 0.015, 1.62], at: [0, y, 0], color: '#c5baa3', detail: true })),
          { shape: 'box', size: [3.24, 0.1, 1.64], at: [0, 2.0, 0], color: '#c9bfa7' },
        ],
        architrave: [
          { shape: 'box', size: [6.2, 0.35, 3.2], color: '#e3dccb' },
          { shape: 'box', size: [6.26, 0.05, 3.26], at: [0, 0.3, 0], color: '#cdbfa5' },
          // Regula ve damla taşları (guttae) — triglif hizasında
          ...Array.from({ length: 15 }, (_, i) => -2.8 + i * 0.4).flatMap((x) => [
            { shape: 'box', size: [0.14, 0.03, 0.03], at: [x, 0.25, 1.61], color: '#cdbfa5', detail: true },
            { shape: 'box', size: [0.14, 0.03, 0.03], at: [x, 0.25, -1.61], color: '#cdbfa5', detail: true },
          ]),
          // Doğu arşitravındaki yaldızlı kalkanlar
          ...[-2.4, -0.8, 0.8, 2.4].map((x) => ({ shape: 'cyl', rt: 0.09, rb: 0.09, h: 0.03, seg: 14, rotX: 90, at: [x, 0.14, 1.61], color: '#c9a646', metal: true })),
        ],
        frieze: [
          { shape: 'box', size: [6.2, 0.38, 3.2], color: '#cf8a6a' },
          ...triglyphs(6.2, 3.2, 0.02, '#5e6f86'),
          // Metop kabartmaları (mücadele sahneleri) — açık renkli figürler
          ...Array.from({ length: 15 }, (_, i) => -2.8 + i * 0.4 + 0.2).filter((x) => x < 3).flatMap((x) => [
            { shape: 'box', size: [0.07, 0.2, 0.03], at: [x - 0.04, 0.08, 1.615], rotZ: 14, color: '#f2ece0', detail: true },
            { shape: 'box', size: [0.07, 0.18, 0.03], at: [x + 0.05, 0.08, 1.615], rotZ: -10, color: '#efe7d8', detail: true },
          ]),
          // Geison (saçak) ve altındaki mutuller
          { shape: 'box', size: [6.5, 0.1, 3.5], at: [0, 0.38, 0], color: '#e9e2d2' },
          ...Array.from({ length: 15 }, (_, i) => -2.8 + i * 0.4).flatMap((x) => [
            { shape: 'box', size: [0.15, 0.025, 0.12], at: [x, 0.36, 1.68], color: '#d6ccb6', detail: true },
            { shape: 'box', size: [0.15, 0.025, 0.12], at: [x, 0.36, -1.68], color: '#d6ccb6', detail: true },
          ]),
        ],
        pediment: [
          { shape: 'tri', w: 6.5, h: 0.85, d: 3.5, color: '#e9e2d2' },
          // Eğimli korniş (alınlık çerçevesi)
          ...[-1, 1].flatMap((sx) => [1.76, -1.76].map((z) => ({ shape: 'box', size: [3.4, 0.07, 0.1], at: [sx * 1.6, 0.39, z], rotZ: -sx * 14.7, color: '#f2ece0' }))),
          { shape: 'tri', w: 5.8, h: 0.66, d: 0.04, at: [0, 0.07, 1.74], color: '#8aa3bd' },
          { shape: 'tri', w: 5.8, h: 0.66, d: 0.04, at: [0, 0.07, -1.74], color: '#8aa3bd' },
          // Alınlık heykelleri: ortada ayakta, yanlara doğru oturan/uzanan figürler
          ...[[-2.3, 0.14, 1], [-1.75, 0.24, 0], [-1.2, 0.34, 0], [-0.6, 0.46, 0], [0, 0.56, 0], [0.6, 0.46, 0], [1.2, 0.34, 0], [1.75, 0.24, 0], [2.3, 0.14, 1]].flatMap(([x, h, lying]) => [
            lying
              ? { shape: 'sphere', r: 0.07, scale: [2.2, 0.8, 1], at: [x, 0.07, 1.78], color: '#f7f3ea' }
              : { shape: 'cyl', rt: 0.045, rb: 0.07, h: h - 0.07, seg: 8, at: [x, 0.07, 1.78], color: '#f7f3ea' },
            ...(lying ? [] : [{ shape: 'sphere', r: 0.045, at: [x, h - 0.02, 1.78], color: '#ffffff' }]),
          ]),
          // Akroterler (tepe ve köşe süsleri)
          { shape: 'extrude', pts: [[-0.12, 0], [0.12, 0], [0.16, 0.12], [0.06, 0.3], [0, 0.22], [-0.06, 0.3], [-0.16, 0.12]], d: 0.08, at: [0, 0.8, 1.7], color: '#d8b25a' },
          { shape: 'extrude', pts: [[-0.12, 0], [0.12, 0], [0.16, 0.12], [0.06, 0.3], [0, 0.22], [-0.06, 0.3], [-0.16, 0.12]], d: 0.08, at: [0, 0.8, -1.7], color: '#d8b25a' },
          ...[-3.15, 3.15].flatMap((x) => [1.7, -1.7].map((z) => ({ shape: 'sphere', r: 0.09, scale: [1, 1.4, 0.6], at: [x, 0, z], color: '#d8b25a' }))),
          // Çatı mermer kiremitleri
          // Çatı mermer kiremit sıraları (iki eğimli yüzey boyunca)
          ...[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].flatMap((t) => [-1, 1].map((sx) => ({ shape: 'box', size: [0.04, 0.03, 3.5], at: [sx * 3.25 * (1 - t), 0.85 * t, 0], rotZ: -sx * 14.7, color: '#d6cdb9', detail: true }))),
        ],
      },
      structure: [
        { part: 'step1', pos: [0, 0, 0], ry: 0 },
        { part: 'step2', pos: [0, 0.2, 0], ry: 0 },
        { part: 'step3', pos: [0, 0.4, 0], ry: 0 },
        { part: 'column', pos: [-2.4, 0.6, 1.25], ry: 0 },
        { part: 'column', pos: [-0.8, 0.6, 1.25], ry: 0 },
        { part: 'column', pos: [0.8, 0.6, 1.25], ry: 0 },
        { part: 'column', pos: [2.4, 0.6, 1.25], ry: 0 },
        { part: 'column', pos: [-2.4, 0.6, -1.25], ry: 0 },
        { part: 'column', pos: [-0.8, 0.6, -1.25], ry: 0 },
        { part: 'column', pos: [0.8, 0.6, -1.25], ry: 0 },
        { part: 'column', pos: [2.4, 0.6, -1.25], ry: 0 },
        { part: 'naos', pos: [0, 0.6, 0], ry: 0 },
        { part: 'architrave', pos: [0, 2.77, 0], ry: 0 },
        { part: 'frieze', pos: [0, 3.12, 0], ry: 0 },
        { part: 'pediment', pos: [0, 3.6, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- KOLEZYUM */
    {
      id: 'colosseum',
      name: 'Kolezyum',
      place: 'Roma, İtalya',
      era: 'MS 70 – 80',
      theme: { sky: '#e9d3b4', fog: '#ead9c0', ground: '#a8956f', pad: '#bca783' },
      intro:
        'Önce arena zeminini, sonra basamaklı tribünleri kur. Ardından sekiz kemerli dış cepheyi ' +
        'çember boyunca diz ve sağlam kalan arka tarafa çatı katını (attika) ekle.',
      facts: [
        'İmparator Vespasianus döneminde başlandı, MS 80\'de oğlu Titus döneminde açıldı.',
        'Yaklaşık 50.000 seyirci alabiliyordu; gladyatör dövüşleri ve gösteriler yapılırdı.',
        'Gerçek planı eliptiktir (yaklaşık 189 × 156 m); bu oyunda sekizgen olarak sadeleştirildi.',
        'Dış duvarın bir bölümü depremler ve taşlarının başka yapılarda kullanılmasıyla yıkılmıştır.',
      ],
      parts: {
        arena: [
          { shape: 'cyl', rt: 3.38, rb: 3.38, h: 0.1, seg: 40, color: '#cdb68f' },
          // Bugünkü görünüm: açıkta kalan hipojeum (yeraltı koridorları) ve kısmen yeniden kurulan ahşap zemin
          { shape: 'cyl', rt: 1.66, rb: 1.66, h: 0.02, seg: 40, at: [0, 0.1, 0], color: '#8a7357' },
          ...[-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05].map((z) => ({ shape: 'box', size: [Math.sqrt(Math.max(0.1, 2.6 - z * z)) * 2 - 0.2, 0.12, 0.06], at: [0, 0.1, z], color: '#b39878' })),
          { shape: 'box', size: [3.1, 0.12, 0.08], at: [0, 0.1, 0], color: '#c2a886' },
          ...[-1.2, -0.6, 0.6, 1.2].map((x) => ({ shape: 'box', size: [0.06, 0.12, 2.0], at: [x, 0.1, 0], color: '#a68d6d' })),
          { shape: 'box', size: [1.3, 0.13, 1.4], at: [-0.85, 0.1, 0], color: '#9a7752' }, // ahşap platform
          ...Array.from({ length: 7 }, (_, i) => -1.42 + i * 0.19).map((x) => ({ shape: 'box', size: [0.015, 0.005, 1.4], at: [x, 0.23, 0], color: '#7d5f40', detail: true })),
          // Podyum duvarı
          { shape: 'cyl', rt: 1.72, rb: 1.72, h: 0.3, seg: 40, open: true, at: [0, 0.1, 0], color: '#d6c29c', double: true },
        ],
        seating: [
          {
            shape: 'lathe', seg: 48, flat: true, color: '#bfa27a',
            points: [
              [1.7, 0], [1.7, 0.35], [2.05, 0.35], [2.05, 0.75], [2.4, 0.75], [2.4, 1.15],
              [2.75, 1.15], [2.75, 1.55], [3.1, 1.55], [3.1, 1.95], [3.35, 1.95], [3.35, 0], [1.7, 0],
            ],
          },
          { shape: 'cyl', rt: 1.72, rb: 1.72, h: 0.12, seg: 48, at: [0, 0.35, 0], color: '#e4d2ae' },
          // Basamak sıraları (oturma kademeleri)
          ...[0.55, 0.95, 1.35, 1.75].map((y, i) => ({ shape: 'torus', r: 2.05 + i * 0.35 - 0.12, tube: 0.03, radial: 4, seg: 48, rotX: 90, at: [0, y, 0], color: '#a88c66', detail: true })),
          // Vomitoria (tribün girişleri)
          ...Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180).flatMap((a) => [
            { shape: 'box', size: [0.2, 0.22, 0.08], at: [Math.sin(a) * 2.06, 0.38, Math.cos(a) * 2.06], rotY: (a * 180) / Math.PI, color: '#3e3226', detail: true },
            { shape: 'box', size: [0.2, 0.22, 0.08], at: [Math.sin(a + 0.26) * 2.76, 1.18, Math.cos(a + 0.26) * 2.76], rotY: (a * 180) / Math.PI + 15, color: '#3e3226', detail: true },
          ]),
        ],
        facade: [
          // Zemin kat Toskana, birinci kat İon yarım sütunlu kemerler
          ...colosseumStorey(1.2, 0.6, 0, '#cfae84', '#e2c9a3', 'doric'),
          ...colosseumStorey(1.1, 0.52, 1.2, '#d6b78e', '#e8d2ae', 'ionic'),
          // Kemerler üstündeki numaralar ve taş blok derzleri
          ...[-1.2, -0.4, 0.4, 1.2].map((x) => ({ shape: 'box', size: [0.12, 0.05, 0.03], at: [x, 1.06, 0.27], color: '#8a7050', detail: true })),
          ...[0.3, 0.9, 1.5, 2.0].map((y) => ({ shape: 'box', size: [3.22, 0.012, 0.52], at: [0, y, 0], color: '#b99a72', detail: true })),
        ],
        attic: [
          { shape: 'box', size: [3.2, 0.7, 0.5], color: '#c9a77c' },
          // Korint düzeni pilastırlar, dikdörtgen pencereler ve kalkan yerleri
          ...[-1.6, -0.8, 0, 0.8, 1.6].flatMap((x) => [
            { shape: 'box', size: [0.1, 0.56, 0.05], at: [x, 0.04, 0.27], color: '#dcc29c' },
            { shape: 'box', size: [0.16, 0.06, 0.07], at: [x, 0.56, 0.27], color: '#e4cca6' },
          ]),
          ...[-1.2, -0.4, 0.4, 1.2].flatMap((x, i) => (i % 2
            ? [{ shape: 'box', size: [0.18, 0.2, 0.04], at: [x, 0.22, 0.26], color: '#4a3a2a' }]
            : [{ shape: 'cyl', rt: 0.08, rb: 0.08, h: 0.02, seg: 12, rotX: 90, at: [x, 0.3, 0.26], color: '#9a8466' }])),
          // Velarium direkleri için konsollar (bugün de görülür)
          ...[-1.45, -1.05, -0.65, -0.25, 0.15, 0.55, 0.95, 1.35].map((x) => ({ shape: 'box', size: [0.07, 0.07, 0.08], at: [x, 0.52, 0.28], color: '#b6956c', detail: true })),
          { shape: 'box', size: [3.26, 0.07, 0.58], at: [0, 0.63, 0], color: '#e2c9a3' },
          { shape: 'box', size: [3.2, 0.02, 0.5], at: [0, 0.35, 0.0], color: '#b79770', detail: true },
        ],
      },
      structure: [
        { part: 'arena', pos: [0, 0, 0], ry: 0 },
        { part: 'seating', pos: [0, 0.1, 0], ry: 0 },
        ...octo('facade', 3.65, 0),
        // Sadece arka taraftaki üç cephede çatı katı kalmış (ön taraf yıkık)
        ...octo('attic', 3.65, 2.3).filter((e) => [135, 180, 225].includes(e.ryDeg)),
      ],
    },

  );
})();
