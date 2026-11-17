/* =========================================================
   ANIT USTASI — Zor bölümler (2): Machu Picchu, Borobudur
   ========================================================= */

(function () {
  const AU = window.AU;

  /* ---------- Machu Picchu ---------- */
  const GRASS = '#6f9a4a', STONE = '#9a9488', STONE2 = '#857f73', THATCH = '#b89a5a', MDARK = '#3a3530';

  const { win } = AU.shapes;

  // Tarım terası: çok köşeli (poligonal) İnka taş örgüsü, üstte çim ve kenar otları
  function terrace(w, d) {
    const list = [
      { shape: 'box', size: [w, 0.4, d], color: STONE },
      { shape: 'box', size: [w + 0.02, 0.04, d + 0.02], at: [0, 0.14, 0], color: STONE2 },
      { shape: 'box', size: [w - 0.04, 0.06, d - 0.04], at: [0, 0.35, 0], color: GRASS },
    ];
    // Ön ve yan yüzlerde düzensiz taş blok yüzeyleri (taş örgüsü izlenimi)
    const faces = [[0, d / 2, 0, w], [0, -d / 2, 180, w], [w / 2, 0, 90, d], [-w / 2, 0, -90, d]];
    for (const [fx, fz, ry, len] of faces) {
      const n = Math.floor(len / 0.32);
      for (let k = 0; k < n; k++) {
        const t = -len / 2 + 0.16 + k * (len / n);
        const r = (ry * Math.PI) / 180;
        const x = fx + Math.cos(r) * t, z = fz - Math.sin(r) * t;
        list.push({ shape: 'rock', size: [len / n - 0.03, 0.16, 0.04], seed: k * 7 + ry, jitter: 0.012, at: [x, 0.02 + (k % 2) * 0.02, z], rotY: ry, color: k % 3 ? STONE2 : '#a29c90', detail: true });
        list.push({ shape: 'rock', size: [len / n - 0.05, 0.14, 0.04], seed: k * 11 + ry, jitter: 0.012, at: [x + (k % 2 ? 0.05 : -0.05) * Math.cos(r), 0.2, z], rotY: ry, color: k % 2 ? '#a29c90' : STONE, detail: true });
      }
    }
    // Teras kenarındaki ot tutamları
    for (let k = 0; k < Math.floor(w / 0.6); k++) list.push({ shape: 'sphere', r: 0.06, seg: 6, rings: 4, scale: [1.6, 0.6, 1], at: [-w / 2 + 0.3 + k * 0.6, 0.38, d / 2 - 0.06], color: '#7fae55', detail: true });
    return list;
  }
  // İnka kapısı/penceresi: yukarı doğru daralan (trapez) açıklık ve tek parça taş lento
  const trapezoid = (x, y, z, w, h) => [
    { shape: 'extrude', pts: [[-w / 2, 0], [w / 2, 0], [w * 0.36, h], [-w * 0.36, h]], d: 0.04, at: [x, y, z], color: MDARK },
    { shape: 'box', size: [w * 1.05, 0.06, 0.06], at: [x, y + h, z], color: '#b0aa9c' },
  ];
  // İnce işçilikli taş duvar derzleri (harçsız kesme taş)
  const ashlar = (w, h, z, rows) => {
    const out = [];
    for (let r = 1; r < rows; r++) out.push({ shape: 'box', size: [w, 0.012, 0.012], at: [0, (h * r) / rows, z], color: '#6f6a60', detail: true });
    for (let r = 0; r < rows; r++) for (let x = -w / 2 + 0.18 + (r % 2) * 0.1; x < w / 2 - 0.05; x += 0.22) out.push({ shape: 'box', size: [0.012, h / rows, 0.012], at: [x, (h * r) / rows, z], color: '#6f6a60', detail: true });
    return out;
  };
  // Saman çatı: dik eğimli, katmanlı saman ve ahşap mahya
  const thatchRoof = (w, h, d) => [
    { shape: 'tri', w, h, d, color: THATCH },
    ...[0.2, 0.4, 0.6, 0.8].flatMap((t) => [-1, 1].map((sx) => ({ shape: 'box', size: [0.03, Math.hypot(w / 2, h) * 0.06, d + 0.02], at: [sx * (w / 2) * (1 - t), h * t - 0.01, 0], rotZ: sx * (90 - (Math.atan2(h, w / 2) * 180) / Math.PI), color: '#a3874a', detail: true }))),
    { shape: 'box', size: [0.06, 0.06, d + 0.04], at: [0, h - 0.03, 0], color: '#8a7240' },
    // Saçak sarkıntısı
    ...[-1, 1].map((sx) => ({ shape: 'box', size: [0.08, 0.04, d + 0.06], at: [sx * (w / 2 - 0.02), 0, 0], color: '#a3874a' })),
  ];

  /* ---------- Borobudur ---------- */
  const BSTONE = '#8f8a7e', BSTONE2 = '#7d786d', BRELIEF = '#6e6a60';
  const SQUARES = [6.4, 5.8, 5.2, 4.6, 4.0, 3.4];

  // Kare teras: kabartmalı galeri duvarı, korkuluk üzerinde Buda nişleri ve küçük stupalar
  function squareTerrace(s) {
    const list = [
      { shape: 'box', size: [s, 0.35, s], color: BSTONE },
      { shape: 'box', size: [s + 0.02, 0.05, s + 0.02], at: [0, 0.03, 0], color: BSTONE2 },
      { shape: 'box', size: [s + 0.03, 0.04, s + 0.03], at: [0, 0.27, 0], color: BSTONE2 },
    ];
    const edge = s / 2 - 0.12;
    for (let t = -edge; t <= edge + 0.01; t += 0.55) {
      for (const [x, z, ry] of [[t, edge, 0], [t, -edge, 180], [edge, t, 90], [-edge, t, -90]]) {
        list.push({ shape: 'lathe', seg: 8, color: BSTONE2, points: [[0.07, 0], [0.07, 0.04], [0.05, 0.1], [0.02, 0.15], [0, 0.2]], at: [x, 0.35, z] });
      }
    }
    // Kabartma panoları (yaşam sahneleri) ve aralarındaki Buda nişleri
    for (let t = -s / 2 + 0.3; t <= s / 2 - 0.3; t += 0.4) {
      for (const [x, z, ry] of [[t, s / 2, 0], [t, -s / 2, 180], [s / 2, t, 90], [-s / 2, t, -90]]) {
        list.push({ shape: 'box', size: [0.3, 0.14, 0.02], at: [x, 0.09, z], rotY: ry, color: BRELIEF, detail: true });
      }
    }
    return list;
  }

  // Delikli çan stupa: elmas biçimli kafes delikleri (koyu) ve kare tepe
  function perforatedBell(r, h, at) {
    const out = [{ ...bell(r, h), at }];
    const [x0, y0, z0] = at;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      out.push({ shape: 'box', size: [r * 0.22, r * 0.22, 0.01], at: [x0 + Math.sin(a) * r * 0.97, y0 + h * 0.22, z0 + Math.cos(a) * r * 0.97], rotY: (a * 180) / Math.PI, rotZ: 45, color: '#4a463f', detail: true });
      out.push({ shape: 'box', size: [r * 0.16, r * 0.16, 0.01], at: [x0 + Math.sin(a + 0.39) * r * 0.84, y0 + h * 0.55, z0 + Math.cos(a + 0.39) * r * 0.84], rotY: (a * 180) / Math.PI + 22, rotZ: 45, color: '#4a463f', detail: true });
    }
    return out;
  }

  const bell = (r, h) => ({
    shape: 'lathe', seg: 14, color: BSTONE,
    points: [[0, 0], [r, 0], [r, h * 0.12], [r * 0.95, h * 0.4], [r * 0.78, h * 0.7], [r * 0.45, h * 0.92], [0, h]],
  });
  const stupa = (r, x, z, ry) => [
    ...perforatedBell(r, r * 2, [x, 0, z]),
    { shape: 'box', size: [r * 0.45, r * 0.35, r * 0.45], at: [x, r * 1.95, z], color: BSTONE2 },
    { shape: 'cone', r: r * 0.18, h: r * 0.8, seg: 6, at: [x, r * 2.3, z], color: BSTONE2 },
  ];
  function stupaHalfRing(radius, count, r) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI / count) * (i + 0.5) - Math.PI / 2; // −90°..+90° → +z yarısı
      out.push(...stupa(r, +(Math.sin(a) * radius).toFixed(3), +(Math.cos(a) * radius).toFixed(3), 0));
    }
    return out;
  }
  function borobudurStairs() {
    const list = [];
    const n = 10, run = 1.65, rise = 2.1;
    for (let j = 0; j < n; j++) {
      list.push({ shape: 'box', size: [0.5, (rise / n) * (j + 1), run / n], at: [0, 0, 3.35 - (j + 0.5) * (run / n)], color: j % 2 ? BSTONE : BSTONE2 });
    }
    for (const x of [-0.3, 0.3]) list.push({ shape: 'box', size: [0.1, 0.12, 2.05], rotX: 51.8, at: [x, 1.0, 2.6], color: BRELIEF });
    list.push({ shape: 'box', size: [0.7, 0.35, 0.18], at: [0, 2.1, 1.75], color: BSTONE2 }); // kala kapı başı
    return list;
  }

  AU.levelDefs.push(
    /* ---------------------------------------------- MACHU PICCHU */
    {
      id: 'machupicchu',
      name: 'Machu Picchu',
      place: 'Cusco, Peru',
      era: '~1450',
      difficulty: 'Zor',
      theme: { sky: '#b9d4e6', fog: '#d7e3e6', ground: '#5f8a45', pad: '#7d9a5c' },
      intro:
        'And Dağları\'nın sırtındaki İnka kentini kuruyorsun. Üç teras katını üst üste koy, merdivenleri ekle; ' +
        'ikinci teras üzerine altı taş evi ve sazdan çatılarını, Güneş Tapınağı\'nı (Torreón), en üste Intihuatana taşını, ' +
        'Ana Tapınak\'ı ve Üç Pencereli Tapınak\'ı yerleştir.',
      facts: [
        'İnka hükümdarı Pachacútec için 15. yüzyılın ortalarında, deniz seviyesinden yaklaşık 2.430 m yükseklikte kuruldu.',
        'Taşlar harç kullanılmadan, aralarına bıçak sığmayacak kadar sıkı oturtulmuştur; bu teknik depremlere dayanıklıdır.',
        'İspanyollar tarafından hiç bulunamadı; 1911\'de Hiram Bingham\'ın ziyaretiyle dünyaca tanındı.',
        '1983\'te UNESCO Dünya Mirası Listesi\'ne alındı, 2007\'de Dünyanın Yeni Yedi Harikası\'ndan biri seçildi.',
      ],
      parts: {
        t1: terrace(8, 7),
        t2: terrace(6.6, 5.6),
        t3: terrace(4.2, 3.2),
        house: [
          { shape: 'box', size: [0.9, 0.7, 1.1], color: STONE },
          ...ashlar(0.9, 0.7, 0.555, 4),
          ...trapezoid(0, 0, 0.56, 0.24, 0.48),
          // Yan duvarlarda trapez nişler ve taş çatı tutamakları
          ...trapezoid(0.46, 0.3, 0.2, 0.12, 0.2).map((it) => ({ ...it, rotY: 90 })),
          ...trapezoid(-0.46, 0.3, -0.2, 0.12, 0.2).map((it) => ({ ...it, rotY: 90 })),
          ...[-0.3, 0.3].map((z) => ({ shape: 'cyl', rt: 0.025, rb: 0.025, h: 0.08, seg: 6, rotZ: 90, at: [0.49, 0.6, z], color: '#a29c90', detail: true })),
        ],
        thatch: thatchRoof(1.12, 0.6, 1.3),
        torreon: [
          { shape: 'cyl', rt: 0.68, rb: 0.72, h: 1.0, seg: 24, color: STONE },
          ...[0.2, 0.4, 0.6, 0.8].map((y) => ({ shape: 'torus', r: 0.7 - y * 0.04, tube: 0.006, radial: 3, seg: 24, rotX: 90, at: [0, y, 0], color: '#6f6a60', detail: true })),
          ...trapezoid(0, 0.4, 0.71, 0.16, 0.3),
          ...trapezoid(0.5, 0.4, 0.5, 0.14, 0.28).map((it) => ({ ...it, rotY: 45 })),
          { shape: 'rock', size: [1.0, 0.25, 0.8], seed: 31, jitter: 0.06, at: [0, 0, -0.2], color: STONE2 },
        ],
        torreonRoof: [
          { shape: 'lathe', seg: 20, color: THATCH, points: [[0.82, 0], [0.78, 0.05], [0.55, 0.25], [0.3, 0.45], [0.08, 0.58], [0, 0.6]] },
          ...[0.12, 0.26, 0.4].map((y) => ({ shape: 'torus', r: 0.8 - y * 1.25, tube: 0.015, radial: 3, seg: 20, rotX: 90, at: [0, y, 0], color: '#a3874a', detail: true })),
        ],
        intihuatana: [
          { shape: 'rock', size: [0.7, 0.3, 0.55], seed: 33, jitter: 0.05, color: STONE2 },
          // Kayadan oyulmuş basamaklı kaide ve güneş saati dikmesi
          { shape: 'box', size: [0.45, 0.1, 0.35], at: [0.05, 0.28, 0], color: STONE },
          { shape: 'extrude', pts: [[-0.1, 0], [0.1, 0], [0.08, 0.3], [0.03, 0.42], [-0.06, 0.36], [-0.1, 0.2]], d: 0.16, at: [0, 0.36, 0], color: STONE },
        ],
        mainTemple: [
          { shape: 'box', size: [1.4, 0.8, 0.25], at: [0, 0, -0.38], color: STONE },
          { shape: 'box', size: [0.25, 0.8, 0.8], at: [-0.58, 0, 0], color: STONE },
          { shape: 'box', size: [0.25, 0.8, 0.8], at: [0.58, 0, 0], color: STONE },
          ...ashlar(1.4, 0.8, -0.25, 5),
          // İç duvardaki trapez nişler ve dev sunak taşı
          ...[-0.45, -0.15, 0.15, 0.45].flatMap((x) => trapezoid(x, 0.36, -0.245, 0.13, 0.24)),
          { shape: 'rock', size: [0.7, 0.18, 0.3], seed: 35, jitter: 0.02, at: [0, 0, -0.1], color: STONE2 },
        ],
        threeWindows: [
          { shape: 'box', size: [1.4, 0.8, 0.25], color: STONE },
          ...ashlar(1.4, 0.8, 0.13, 5),
          ...[-0.4, 0, 0.4].flatMap((x) => trapezoid(x, 0.24, 0.13, 0.22, 0.38)),
          { shape: 'box', size: [0.25, 0.8, 0.6], at: [-0.58, 0, -0.42], color: STONE },
        ],
        stairs: [
          ...[0, 1, 2].map((j) => ({ shape: 'box', size: [0.6, 0.135 * (j + 1), 0.24], at: [0, 0, 0.36 - j * 0.24], color: j % 2 ? STONE : STONE2 })),
          ...[0, 1, 2].map((j) => ({ shape: 'rock', size: [0.58, 0.03, 0.22], seed: 50 + j, jitter: 0.01, at: [0, 0.135 * (j + 1), 0.36 - j * 0.24], color: '#a29c90', detail: true })),
        ],
      },
      structure: [
        { part: 't1', pos: [0, 0, 0], ry: 0 },
        { part: 't2', pos: [0, 0.4, 0], ry: 0 },
        { part: 't3', pos: [0, 0.8, -0.6], ry: 0 },
        { part: 'stairs', pos: [-1.4, 0.4, 3.0], ry: 0 },
        { part: 'stairs', pos: [1.4, 0.4, 3.0], ry: 0 },
        ...[-1.7, 0.2, 2.1].flatMap((z) => [
          { part: 'house', pos: [-2.75, 0.8, z], ry: 0 },
          { part: 'house', pos: [2.75, 0.8, z], ry: 0 },
          { part: 'thatch', pos: [-2.75, 1.5, z], ry: 0 },
          { part: 'thatch', pos: [2.75, 1.5, z], ry: 0 },
        ]),
        { part: 'torreon', pos: [0, 0.8, 2.0], ry: 0 },
        { part: 'torreonRoof', pos: [0, 1.8, 2.0], ry: 0 },
        { part: 'intihuatana', pos: [0, 1.2, -0.6], ry: 0 },
        { part: 'mainTemple', pos: [-1.3, 1.2, -1.5], ry: 0 },
        { part: 'threeWindows', pos: [1.3, 1.2, -1.6], ry: 0 },
      ],
    },

    /* ---------------------------------------------- BOROBUDUR */
    {
      id: 'borobudur',
      name: 'Borobudur',
      place: 'Orta Cava, Endonezya',
      era: '~MS 780 – 830',
      difficulty: 'Zor',
      theme: { sky: '#b4d2e2', fog: '#d4e2dc', ground: '#5f9447', pad: '#8e9a74' },
      intro:
        'Dünyanın en büyük Budist tapınağını kuruyorsun. Altı kare terası büyükten küçüğe, sonra üç dairesel terası diz. ' +
        'Dairesel teraslara 72 küçük stupayı (altı yarım halka) ve tepeye ana stupayı koy; dört merdiveni ve aslan heykellerini unutma.',
      facts: [
        'Şailendra hanedanı döneminde 8.–9. yüzyılda inşa edildi; yaklaşık 2 milyon taş blokla dünyanın en büyük Budist tapınağıdır.',
        'Kare teraslarda Buda\'nın öğretilerini anlatan 2.600\'den fazla kabartma paneli vardır.',
        'Üst dairesel teraslarda delikli 72 stupa, her birinin içinde bir Buda heykeli bulunur.',
        'Yüzyıllarca volkanik kül ve orman altında kaldı; 1991\'de UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        ...Object.fromEntries(SQUARES.map((s, i) => ['sq' + i, squareTerrace(s)])),
        c1: [{ shape: 'cyl', rt: 1.55, rb: 1.55, h: 0.25, seg: 36, color: BSTONE }],
        c2: [{ shape: 'cyl', rt: 1.25, rb: 1.25, h: 0.25, seg: 36, color: BSTONE2 }],
        c3: [{ shape: 'cyl', rt: 0.95, rb: 0.95, h: 0.25, seg: 36, color: BSTONE }],
        ring1: stupaHalfRing(1.42, 16, 0.11),
        ring2: stupaHalfRing(1.1, 12, 0.1),
        ring3: stupaHalfRing(0.8, 8, 0.095),
        mainStupa: [
          { shape: 'box', size: [0.75, 0.12, 0.75], color: BSTONE2 },
          { shape: 'cyl', rt: 0.56, rb: 0.6, h: 0.08, seg: 20, at: [0, 0.12, 0], color: BSTONE },
          // Lotus kaideli büyük çan ve sekizgen tepe (harmika) üzerinde katmanlı chattra
          ...Array.from({ length: 16 }, (_, k) => (k / 16) * Math.PI * 2).map((a) => ({ shape: 'sphere', r: 0.06, scale: [1, 0.6, 0.6], at: [Math.sin(a) * 0.52, 0.2, Math.cos(a) * 0.52], color: BSTONE2, detail: true })),
          { ...bell(0.5, 0.75), at: [0, 0.18, 0] },
          { shape: 'box', size: [0.28, 0.2, 0.28], at: [0, 0.88, 0], color: BSTONE2 },
          { shape: 'cyl', rt: 0.16, rb: 0.16, h: 0.04, seg: 8, at: [0, 1.06, 0], color: BSTONE },
          { shape: 'lathe', seg: 8, color: BSTONE2, points: [[0.1, 0], [0.08, 0.1], [0.06, 0.12], [0.06, 0.18], [0.045, 0.2], [0.045, 0.3], [0.03, 0.32], [0.02, 0.45], [0, 0.5]], at: [0, 1.1, 0] },
        ],
        stairs: borobudurStairs(),
        lion: [
          // Kapı aslanı (singa): oturan aslan, yeleli baş, açık ağız
          { shape: 'box', size: [0.3, 0.12, 0.42], color: BSTONE2 },
          { shape: 'sphere', r: 0.16, scale: [0.9, 1.1, 1.2], at: [0, 0.1, -0.06], color: BSTONE },
          ...[-0.08, 0.08].map((x) => ({ shape: 'cyl', rt: 0.035, rb: 0.04, h: 0.22, seg: 8, at: [x, 0.12, 0.12], color: BSTONE })),
          { shape: 'sphere', r: 0.14, seg: 10, rings: 8, at: [0, 0.3, 0.08], color: BSTONE2 }, // yele
          { shape: 'sphere', r: 0.1, at: [0, 0.35, 0.14], color: BSTONE },
          { shape: 'box', size: [0.1, 0.03, 0.04], at: [0, 0.38, 0.23], color: '#4a463f', detail: true },
          ...[-0.04, 0.04].map((x) => ({ shape: 'sphere', r: 0.015, at: [x, 0.45, 0.22], color: '#4a463f', detail: true })),
        ],
      },
      structure: [
        ...SQUARES.map((s, i) => ({ part: 'sq' + i, pos: [0, 0.35 * i, 0], ry: 0 })),
        { part: 'c1', pos: [0, 2.1, 0], ry: 0 },
        { part: 'c2', pos: [0, 2.35, 0], ry: 0 },
        { part: 'c3', pos: [0, 2.6, 0], ry: 0 },
        { part: 'ring1', pos: [0, 2.35, 0], ry: 0 },
        { part: 'ring1', pos: [0, 2.35, 0], ry: 2 },
        { part: 'ring2', pos: [0, 2.6, 0], ry: 0 },
        { part: 'ring2', pos: [0, 2.6, 0], ry: 2 },
        { part: 'ring3', pos: [0, 2.85, 0], ry: 0 },
        { part: 'ring3', pos: [0, 2.85, 0], ry: 2 },
        { part: 'mainStupa', pos: [0, 2.85, 0], ry: 0 },
        ...[0, 1, 2, 3].map((ry) => ({ part: 'stairs', pos: [0, 0, 0], ry })),
        { part: 'lion', pos: [-0.7, 0, 3.55], ry: 0 },
        { part: 'lion', pos: [0.7, 0, 3.55], ry: 0 },
      ],
    },
  );
})();
