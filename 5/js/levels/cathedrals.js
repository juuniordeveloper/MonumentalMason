/* =========================================================
   ANIT USTASI — Katedral bölümleri: Notre-Dame, Aziz Vasil
   ========================================================= */

(function () {
  const AU = window.AU;
  const { ring, onFaces, onion, stripedOnion, win, winRow, ringWins, openingPts, balustrade, cornice } = AU.shapes;

  const STONE = '#d9cfb8', STONE2 = '#e3d9c3', GLASS = '#2d3a55', LEAD = '#6e7884', DARK = '#3b3226';

  // Gül pencere: renkli cam, taş çerçeve ve ışınsal taş oymalar
  function rose(r, at, rotY) {
    const out = [
      // Disk z eksenine (veya rotY = 90 ise x eksenine) baksın
      { shape: 'cyl', rt: r, rb: r, h: 0.04, seg: 32, ...(rotY ? { rotZ: 90 } : { rotX: 90 }), at, color: '#34528a', glow: true, glowColor: '#9fb8ff' },
      { shape: 'torus', r: r + 0.05, tube: 0.05, seg: 32, radial: 6, at, rotY, color: STONE },
      { shape: 'torus', r: r * 0.45, tube: 0.025, seg: 24, radial: 4, at, rotY, color: STONE2 },
      { shape: 'cyl', rt: r * 0.14, rb: r * 0.14, h: 0.06, seg: 16, ...(rotY ? { rotZ: 90 } : { rotX: 90 }), at, color: '#b03a3a', glow: true, glowColor: '#ff9a7a' },
    ];
    for (let k = 0; k < 12; k++) out.push({ shape: 'box', size: [0.02, r * 0.95, 0.05], at, rotY, rotZ: k * 15, color: STONE2, detail: true });
    for (let k = 0; k < 12; k++) out.push({ shape: 'box', size: [0.02, r * 0.95, 0.05], at, rotY, rotZ: 180 + k * 15, color: STONE2, detail: true });
    return out;
  }

  // Gotik portal: içe doğru daralan sivri kemer halkaları (arşivolt), timpan ve kapı
  function portal(w, h, x, z) {
    const out = [];
    for (let k = 0; k < 4; k++) {
      out.push({ shape: 'extrude', pts: openingPts(w - k * 0.08, h - k * 0.06, 'pointed'), d: 0.04, at: [x, 0, z + 0.02 + k * 0.012], color: k % 2 ? '#cfc3a8' : '#bcb096' });
    }
    out.push({ shape: 'extrude', pts: openingPts(w - 0.36, h - 0.26, 'pointed'), d: 0.04, at: [x, 0, z + 0.08], color: '#c9bc9e' }); // timpan
    out.push({ shape: 'box', size: [w - 0.38, (h - 0.26) * 0.55, 0.04], at: [x, 0, z + 0.1], color: DARK }); // kapı kanatları
    out.push({ shape: 'box', size: [0.03, (h - 0.26) * 0.55, 0.05], at: [x, 0, z + 0.11], color: '#a89c84', detail: true }); // trumeau
    // Timpandaki figür sıraları
    for (const y of [0.62, 0.74]) out.push({ shape: 'box', size: [w - 0.5, 0.05, 0.02], at: [x, (h - 0.26) * y, z + 0.115], color: '#e8dcc2', detail: true });
    return out;
  }

  // Notre-Dame uçan payandası: ayak + sivri tepelik + nefe uzanan çift kemerli kol (sağ taraf; sol = ry 2)
  const buttressRow = [-1.2, -0.4, 0.4, 1.2].flatMap((z) => [
    { shape: 'box', size: [0.28, 1.7, 0.3], at: [0, 0, z], color: STONE },
    { shape: 'box', size: [0.32, 0.06, 0.34], at: [0, 0.8, z], color: STONE2 },
    // Tepelik: ince kule + çiçek süslü külah
    { shape: 'box', size: [0.18, 0.3, 0.18], at: [0, 1.7, z], color: STONE2 },
    { shape: 'cone', r: 0.12, h: 0.45, seg: 4, rotY: 45, at: [0, 2.0, z], color: STONE2 },
    ...[0.1, 0.22, 0.34].map((y) => ({ shape: 'sphere', r: 0.025, at: [0.08 - y * 0.15, 2.0 + y, z], color: STONE2, detail: true })),
    // Kemerli uçan kol (eğri boru) ve üstünde su oluğu
    { shape: 'tube', r: 0.05, radial: 5, color: STONE2, pts: [[0, 1.55, z], [-0.25, 1.75, z], [-0.55, 1.9, z], [-0.75, 1.95, z]] },
    { shape: 'tube', r: 0.035, radial: 5, color: STONE, pts: [[0, 1.05, z], [-0.3, 1.3, z], [-0.6, 1.45, z], [-0.75, 1.48, z]] },
    // Gargoyl
    { shape: 'box', size: [0.2, 0.05, 0.05], at: [0.18, 1.62, z], color: '#a39880', detail: true },
  ]);

  // Aziz Vasil kuleleri: sekizgen gövde, kokoşnik kemerleri, kasnak, desenli soğan kubbe
  function vasilTower(r, h, domeR, domeH, body, domeColors, ringColor, twist) {
    const list = [
      { shape: 'cyl', rt: r, rb: r, h, seg: 8, rotY: 22.5, color: body },
      { shape: 'cyl', rt: r + 0.03, rb: r + 0.03, h: 0.07, seg: 8, rotY: 22.5, at: [0, h * 0.45, 0], color: '#f2ead8' },
      // Beyaz taş süslü pencereler
      ...ringWins(4, r * 0.93, h * 0.15, { w: r * 0.35, h: h * 0.22, top: 'round', color: '#3a2a24', frame: '#f2ead8', fw: 0.03, startDeg: 22.5 }),
      // Kokoşnik: üst kenarda soğan kemer biçimli alınlıklar (iki kademe)
      ...ringWins(8, r * 0.98, h - 0.3, { w: r * 0.7, h: 0.32, top: 'ogee', color: '#f2ead8', d: 0.05 }),
      ...ringWins(8, r * 0.82, h - 0.08, { w: r * 0.5, h: 0.24, top: 'ogee', color: body, d: 0.05, startDeg: 22.5 }),
      { shape: 'cyl', rt: r * 0.6, rb: r * 0.65, h: 0.35, seg: 12, at: [0, h, 0], color: body },
      ...ringWins(6, r * 0.62, h + 0.08, { w: 0.06, h: 0.18, top: 'round', color: '#3a2a24' }),
      ...stripedOnion(domeR, domeH, domeColors, [0, h + 0.35, 0], 12, twist),
      { shape: 'torus', r: domeR * 0.84, tube: 0.03, radial: 6, seg: 24, rotX: 90, at: [0, h + 0.37, 0], color: ringColor },
      // Ortodoks haç
      { shape: 'cyl', rt: 0.012, rb: 0.02, h: 0.34, seg: 6, at: [0, h + 0.35 + domeH - 0.04, 0], color: '#e0bb4f', metal: true },
      { shape: 'box', size: [0.14, 0.02, 0.02], at: [0, h + 0.35 + domeH + 0.18, 0], color: '#e0bb4f', metal: true },
      { shape: 'box', size: [0.09, 0.02, 0.02], at: [0, h + 0.35 + domeH + 0.08, 0], rotZ: 20, color: '#e0bb4f', metal: true },
    ];
    return list;
  }

  AU.levelDefs.push(
    /* ---------------------------------------------- NOTRE-DAME */
    {
      id: 'notredame',
      name: 'Notre-Dame Katedrali',
      place: 'Île de la Cité, Paris',
      era: '1163 – 1345',
      theme: { sky: '#b9cde0', fog: '#c9d6e2', ground: '#a19d90', pad: '#cbc4b5' },
      intro:
        'Seine Nehri\'nin ortasındaki adada Gotik bir şaheser kuruyorsun. Önce kaideyi, nefi, transepti ve apsisi diz; ' +
        'uçan payandaları, çatıları, gül pencereli batı cephesini, iki kuleyi ve sivri kuleyi yerleştir.',
      facts: [
        'Yapımına 1163\'te başlandı ve büyük ölçüde 1345\'te tamamlandı; Gotik mimarinin simgelerindendir.',
        'Duvarları dıştan destekleyen "uçan payandalar" sayesinde yüksek duvarlara büyük vitraylar açılabildi.',
        'Batı cephesi gül penceresi ve İncil krallarını gösteren "Krallar Galerisi" ile ünlüdür.',
        '15 Nisan 2019 yangınında çatısı ve sivri kulesi çöktü; restorasyonun ardından Aralık 2024\'te yeniden açıldı.',
      ],
      parts: {
        base: [
          { shape: 'box', size: [3.9, 0.2, 8.2], color: '#bfb7a6' },
          { shape: 'box', size: [3.94, 0.03, 8.24], at: [0, 0.17, 0], color: '#aaa290' },
        ],
        nave: [
          { shape: 'box', size: [2.2, 2.6, 5.4], color: STONE },
          // Alt sıra uzun sivri pencereler ve üst sıra (clerestory) çift pencereler
          ...[1.1, -1.1].flatMap((x) => [
            ...winRow({ n: 6, span: 4.4, at: [x, 0.4, 0], rotY: x > 0 ? 90 : -90, w: 0.24, h: 0.95, top: 'pointed', color: GLASS, frame: STONE2, fw: 0.03, mullion: true, glow: true, glowColor: '#9fb8ff' }),
            ...winRow({ n: 6, span: 4.4, at: [x, 1.6, 0], rotY: x > 0 ? 90 : -90, w: 0.22, h: 0.7, top: 'pointed', color: GLASS, frame: STONE2, fw: 0.03, mullion: true, glow: true, glowColor: '#9fb8ff' }),
          ]),
          ...[0.3, 1.45].map((y) => ({ shape: 'box', size: [2.24, 0.05, 5.42], at: [0, y, 0], color: STONE2 })),
          ...balustrade(5.4, 0.16, STONE2, [1.1, 2.6, 0], 90, 0.12),
          ...balustrade(5.4, 0.16, STONE2, [-1.1, 2.6, 0], 90, 0.12),
          { shape: 'box', size: [2.26, 0.08, 5.44], at: [0, 2.52, 0], color: STONE2 },
        ],
        transept: [
          { shape: 'box', size: [4.4, 2.6, 1.4], color: STONE },
          ...[1, -1].flatMap((sx) => [
            ...rose(0.42, [sx * 2.22, 1.6, 0], 90),
            ...win({ w: 0.9, h: 0.9, at: [sx * 2.2, 0.25, 0], rotY: sx * 90, top: 'pointed', color: GLASS, frame: STONE2, fw: 0.05, glow: true, glowColor: '#9fb8ff' }),
            // Transept cephesinin sivri tepelikleri
            ...[-0.6, 0.6].flatMap((z) => [
              { shape: 'box', size: [0.14, 2.6, 0.14], at: [sx * 2.2, 0, z], color: STONE2 },
              { shape: 'cone', r: 0.1, h: 0.4, seg: 4, rotY: 45, at: [sx * 2.2, 2.6, z], color: STONE2 },
            ]),
          ]),
          { shape: 'box', size: [4.44, 0.08, 1.44], at: [0, 2.52, 0], color: STONE2 },
        ],
        apse: [
          { shape: 'cyl', rt: 1.1, rb: 1.1, h: 2.6, seg: 14, color: STONE },
          ...ringWins(7, 1.08, 0.5, { w: 0.24, h: 1.25, top: 'pointed', color: GLASS, frame: STONE2, fw: 0.03, mullion: true, startDeg: 115.7, glow: true, glowColor: '#9fb8ff' }).filter((w) => w.at[2] < 0.2),
          { shape: 'cyl', rt: 1.13, rb: 1.13, h: 0.08, seg: 14, at: [0, 2.52, 0], color: STONE2 },
        ],
        naveRoof: [
          { shape: 'tri', w: 2.4, h: 1.3, d: 5.5, color: LEAD },
          { shape: 'box', size: [0.06, 0.08, 5.5], at: [0, 1.28, 0], color: '#c9a646', metal: true }, // mahya süsü
          // Kurşun levha derzleri: saçaktan mahyaya eğim boyunca
          ...Array.from({ length: 10 }, (_, k) => -2.5 + k * 0.55).flatMap((z) => [-1, 1].map((sx) => ({ shape: 'box', size: [0.025, 1.76, 0.025], at: [sx * 1.19, 0.01, z], rotZ: sx * 42.7, color: '#5d6670', detail: true }))),
        ],
        transeptRoof: [
          { shape: 'tri', w: 1.6, h: 1.3, d: 4.5, rotY: 90, color: LEAD },
          { shape: 'box', size: [4.5, 0.08, 0.06], at: [0, 1.28, 0], color: '#c9a646', metal: true },
        ],
        apseRoof: [
          { shape: 'cone', r: 1.2, h: 1.3, seg: 14, color: LEAD },
          ...Array.from({ length: 14 }, (_, k) => (k / 14) * Math.PI * 2).map((a) => ({ shape: 'tube', r: 0.012, radial: 3, color: '#5d6670', detail: true, pts: [[Math.sin(a) * 1.18, 0.02, Math.cos(a) * 1.18], [Math.sin(a) * 0.6, 0.66, Math.cos(a) * 0.6], [0, 1.3, 0]] })),
        ],
        facade: [
          { shape: 'box', size: [3.4, 3.4, 1.0], color: STONE2 },
          // Üç portal: Bakire, Kıyamet ve Aziz Anna kapıları
          ...portal(0.78, 1.5, -1.05, 0.5), ...portal(0.86, 1.6, 0, 0.5), ...portal(0.78, 1.5, 1.05, 0.5),
          // Krallar Galerisi: 28 heykel nişi
          { shape: 'box', size: [3.44, 0.1, 1.04], at: [0, 1.58, 0], color: '#cdbfa3' },
          ...Array.from({ length: 14 }, (_, k) => -1.56 + k * 0.24).flatMap((x) => [
            ...win({ w: 0.15, h: 0.32, at: [x, 1.68, 0.5], top: 'pointed', color: '#5d5444', d: 0.03 }),
            { shape: 'cyl', rt: 0.035, rb: 0.045, h: 0.22, seg: 6, at: [x, 1.69, 0.54], color: '#c8bba0' },
            { shape: 'sphere', r: 0.03, at: [x, 1.92, 0.54], color: '#c8bba0' },
          ]),
          { shape: 'box', size: [3.44, 0.06, 1.04], at: [0, 2.0, 0], color: '#cdbfa3' },
          // Gül pencere ve iki yanında ikiz sivri pencereler
          ...rose(0.55, [0, 2.55, 0.5], 0),
          ...[-1.2, 1.2].flatMap((x) => win({ w: 0.36, h: 0.8, at: [x, 2.1, 0.5], top: 'pointed', color: '#3b3226', frame: STONE, fw: 0.04, mullion: true })),
          // Sütunlu galeri (Grande Galerie) ve korkuluk
          { shape: 'box', size: [3.44, 0.08, 1.04], at: [0, 3.18, 0], color: '#cdbfa3' },
          ...Array.from({ length: 16 }, (_, k) => -1.6 + k * 0.213).map((x) => ({ shape: 'cyl', rt: 0.02, rb: 0.02, h: 0.18, seg: 6, at: [x, 3.22, 0.5], color: STONE, detail: true })),
          { shape: 'box', size: [3.44, 0.08, 1.04], at: [0, 3.3, 0], color: '#cdbfa3' },
          // Cephe payandaları (dört dikey ayak)
          ...[-1.62, -0.55, 0.55, 1.62].map((x) => ({ shape: 'box', size: [0.16, 3.3, 0.12], at: [x, 0, 0.52], color: '#d3c6aa' })),
        ],
        tower: [
          { shape: 'box', size: [1.2, 2.0, 1.0], color: STONE2 },
          // Her yüzde ikiz uzun sivri çan pencereleri (panjurlu)
          ...[-0.25, 0.25].flatMap((x) => [0.5, -0.5].flatMap((z) => win({ w: 0.2, h: 1.3, at: [x, 0.3, z], rotY: z > 0 ? 0 : 180, top: 'pointed', color: '#2a2620', frame: '#cdbfa3', fw: 0.035 }))),
          ...[0.6, -0.6].flatMap((x) => win({ w: 0.22, h: 1.3, at: [x, 0.3, 0], rotY: x > 0 ? 90 : -90, top: 'pointed', color: '#2a2620', frame: '#cdbfa3', fw: 0.035 })),
          // Panjur çıtaları
          ...[-0.25, 0.25].flatMap((x) => Array.from({ length: 6 }, (_, k) => ({ shape: 'box', size: [0.2, 0.02, 0.03], at: [x, 0.4 + k * 0.15, 0.53], color: '#5a4e3e', detail: true }))),
          // Köşe payandaları ve tepe korkuluğu
          ...[[-0.6, 0.5], [0.6, 0.5], [-0.6, -0.5], [0.6, -0.5]].map(([x, z]) => ({ shape: 'box', size: [0.14, 2.0, 0.14], at: [x, 0, z], color: '#d3c6aa' })),
          { shape: 'box', size: [1.26, 0.1, 1.06], at: [0, 1.9, 0], color: '#cdbfa3' },
          ...balustrade(1.2, 0.14, STONE, [0, 2.0, 0.5], 0, 0.1),
          ...balustrade(1.2, 0.14, STONE, [0, 2.0, -0.5], 0, 0.1),
          ...balustrade(1.0, 0.14, STONE, [0.6, 2.0, 0], 90, 0.1),
          ...balustrade(1.0, 0.14, STONE, [-0.6, 2.0, 0], 90, 0.1),
        ],
        spire: [
          // Viollet-le-Duc'ün kurşun ve ahşap sivri kulesi: sekizgen kasnak, sivri pencereler, çiçek süsleri
          { shape: 'cyl', rt: 0.22, rb: 0.28, h: 0.45, seg: 8, color: LEAD },
          ...ringWins(8, 0.25, 0.06, { w: 0.07, h: 0.3, top: 'pointed', color: '#2a2620' }),
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'cone', r: 0.03, h: 0.25, seg: 4, at: [Math.sin(a) * 0.28, 0.45, Math.cos(a) * 0.28], color: LEAD })),
          { shape: 'cone', r: 0.24, h: 2.4, seg: 8, at: [0, 0.45, 0], color: LEAD },
          ...Array.from({ length: 7 }, (_, k) => 0.8 + k * 0.28).flatMap((y) => [0, 1, 2, 3].map((q) => {
            const a = (q * Math.PI) / 2 + Math.PI / 8;
            const rr = 0.24 * (1 - (y - 0.45) / 2.4) + 0.02;
            return { shape: 'sphere', r: 0.022, at: [Math.sin(a) * rr, y, Math.cos(a) * rr], color: '#8a939c', detail: true };
          })),
          { shape: 'box', size: [0.03, 0.22, 0.03], at: [0, 2.85, 0], color: '#c9a646', metal: true },
          { shape: 'box', size: [0.12, 0.03, 0.03], at: [0, 2.98, 0], color: '#c9a646', metal: true },
          { shape: 'sphere', r: 0.03, scale: [1.6, 0.8, 0.8], at: [0, 3.06, 0], color: '#c9a646', metal: true }, // horoz
        ],
        buttress: buttressRow,
      },
      structure: [
        { part: 'base', pos: [0, 0, 0.6], ry: 0 },
        { part: 'nave', pos: [0, 0.2, 0.7], ry: 0 },
        { part: 'transept', pos: [0, 0.2, -0.4], ry: 0 },
        { part: 'apse', pos: [0, 0.2, -2.0], ry: 0 },
        { part: 'facade', pos: [0, 0.2, 3.9], ry: 0 },
        { part: 'buttress', pos: [1.75, 0.2, 1.9], ry: 0 },
        { part: 'buttress', pos: [-1.75, 0.2, 1.9], ry: 2 },
        { part: 'naveRoof', pos: [0, 2.8, 0.7], ry: 0 },
        { part: 'transeptRoof', pos: [0, 2.8, -0.4], ry: 0 },
        { part: 'apseRoof', pos: [0, 2.8, -2.0], ry: 0 },
        { part: 'tower', pos: [-1.1, 3.6, 3.9], ry: 0 },
        { part: 'tower', pos: [1.1, 3.6, 3.9], ry: 0 },
        { part: 'spire', pos: [0, 3.75, -0.4], ry: 0 },
      ],
    },

    /* ---------------------------------------------- AZİZ VASİL */
    {
      id: 'vasil',
      name: 'Aziz Vasil Katedrali',
      place: 'Kızıl Meydan, Moskova',
      era: '1555 – 1561',
      theme: { sky: '#c4d3e6', fog: '#d3dde8', ground: '#8c8a86', pad: '#9b8f86' },
      intro:
        'Kızıl Meydan\'ın ucunda rengârenk bir masal yapısı kuruyorsun. Kırmızı tuğla kaideyi kur, ortadaki çadır kuleyi ' +
        've dört yanındaki büyük, köşelerdeki küçük soğan kubbeli kuleleri, en son çan kulesini yerleştir.',
      facts: [
        'Çar IV. İvan (Korkunç İvan), Kazan Hanlığı\'nın fethini anmak için yaptırdı (1555–1561).',
        'Ortadaki çadır kubbeli kilisenin etrafında sekiz küçük kilise yer alır; hepsi tek bir kaide üzerinde birleşir.',
        'Mimarlarının Barma ve Postnik Yakovlev olduğu kabul edilir.',
        'Bugünkü canlı renklerini büyük ölçüde 17.–19. yüzyıllarda kazandı; Kremlin ve Kızıl Meydan ile birlikte UNESCO Dünya Mirası\'dır.',
      ],
      parts: {
        platform: [
          { shape: 'box', size: [5.2, 0.8, 5.2], color: '#a8432f' },
          // Tuğla kaide: kemerli galeri açıklıkları ve beyaz taş süsler
          ...onFaces([-1.8, -0.9, 0, 0.9, 1.8].flatMap((x) => [
            ...win({ w: 0.46, h: 0.48, at: [x, 0.1, 2.6], top: 'round', color: '#f2ead8', d: 0.03 }),
            ...win({ w: 0.34, h: 0.38, at: [x, 0.12, 2.63], top: 'round', color: '#5a2a20', d: 0.03 }),
          ])),
          ...onFaces(Array.from({ length: 26 }, (_, k) => ({ shape: 'box', size: [0.1, 0.06, 0.03], at: [-2.5 + k * 0.2, 0.64, 2.61], rotZ: 45, color: '#f2ead8', detail: true }))),
          { shape: 'box', size: [5.26, 0.08, 5.26], at: [0, 0.72, 0], color: '#f2ead8' },
          ...balustrade(5.2, 0.12, '#f2ead8', [0, 0.8, 2.56], 0, 0.14),
        ],
        center: [
          { shape: 'cyl', rt: 0.8, rb: 0.82, h: 2.2, seg: 8, rotY: 22.5, color: '#c75b3a' },
          { shape: 'cyl', rt: 0.84, rb: 0.84, h: 0.08, seg: 8, rotY: 22.5, at: [0, 1.0, 0], color: '#f2ead8' },
          ...ringWins(8, 0.8, 0.32, { w: 0.18, h: 0.5, top: 'round', color: '#3a2a24', frame: '#f2ead8', fw: 0.03, startDeg: 22.5 }),
          // Çok kademeli kokoşnik tacı
          ...ringWins(8, 0.8, 1.78, { w: 0.48, h: 0.42, top: 'ogee', color: '#f2ead8', d: 0.05 }),
          ...ringWins(8, 0.7, 2.0, { w: 0.34, h: 0.3, top: 'ogee', color: '#c75b3a', d: 0.05, startDeg: 22.5 }),
          // Dikey beyaz taş pilastırlar
          ...Array.from({ length: 8 }, (_, k) => (k * 45 * Math.PI) / 180).map((a) => ({ shape: 'box', size: [0.05, 1.7, 0.05], at: [Math.sin(a) * 0.82, 0.08, Math.cos(a) * 0.82], rotY: (a * 180) / Math.PI, color: '#f2ead8', detail: true })),
        ],
        tent: [
          // Çadır çatı: renkli çini bantlar ve elmas desenler
          { shape: 'cone', r: 0.8, h: 2.4, seg: 8, rotY: 22.5, color: '#efe3c8' },
          ...[0.5, 1.1, 1.7].map((y, i) => ({ shape: 'cyl', rt: 0.8 * (1 - (y + 0.06) / 2.4), rb: 0.8 * (1 - y / 2.4), h: 0.06, seg: 8, rotY: 22.5, at: [0, y, 0], color: i % 2 ? '#2f8f5b' : '#c0392b' })),
          ...[0.25, 0.8, 1.4].flatMap((y, i) => Array.from({ length: 8 }, (_, k) => (k * 45 * Math.PI) / 180 + Math.PI / 8).map((a) => {
            const rr = 0.8 * (1 - (y + 0.1) / 2.4) * 0.93;
            return { shape: 'box', size: [0.09, 0.09, 0.02], at: [Math.sin(a) * rr, y, Math.cos(a) * rr], rotY: (a * 180) / Math.PI, rotX: -18, rotZ: 45, color: i % 2 ? '#c0392b' : '#2f8f5b', detail: true };
          })),
          { shape: 'cyl', rt: 0.13, rb: 0.16, h: 0.3, seg: 8, at: [0, 2.2, 0], color: '#efe3c8' },
          ...stripedOnion(0.2, 0.45, ['#d4a531', '#e8c15a'], [0, 2.5, 0], 8),
          { shape: 'cyl', rt: 0.012, rb: 0.02, h: 0.35, seg: 6, at: [0, 2.9, 0], color: '#e0bb4f', metal: true },
          { shape: 'box', size: [0.14, 0.02, 0.02], at: [0, 3.15, 0], color: '#e0bb4f', metal: true },
        ],
        bigA: vasilTower(0.55, 1.8, 0.48, 1.0, '#c0503a', ['#2e8b57', '#f1c40f'], '#f1c40f', 0.35),
        bigB: vasilTower(0.55, 1.6, 0.46, 0.9, '#b8483a', ['#2f6fae', '#f2ead8'], '#f2ead8', 0.3),
        small: vasilTower(0.33, 1.3, 0.3, 0.6, '#c75b3a', ['#d4a531', '#c0392b', '#2e8b57'], '#c0392b', 0),
        belfry: [
          { shape: 'box', size: [0.9, 1.3, 0.9], color: '#a8432f' },
          ...onFaces(win({ w: 0.2, h: 0.42, at: [0, 0.4, 0.45], top: 'round', color: '#3a2a24', frame: '#f2ead8' })),
          { shape: 'box', size: [0.94, 0.08, 0.94], at: [0, 1.22, 0], color: '#f2ead8' },
          // Açık çan kemerleri ve içinde çanlar
          ...ring(8, 0.36, 1.3, [0.07, 0.6, 0.07], '#f2ead8', 22.5),
          ...[-0.15, 0.15].map((x) => ({ shape: 'lathe', seg: 12, color: '#b58b3a', metal: true, points: [[0.1, 0], [0.08, 0.06], [0.05, 0.16], [0.04, 0.2], [0, 0.21]], at: [x, 1.55, 0] })),
          { shape: 'cyl', rt: 0.44, rb: 0.42, h: 0.08, seg: 8, rotY: 22.5, at: [0, 1.9, 0], color: '#f2ead8' },
          { shape: 'cone', r: 0.42, h: 0.9, seg: 8, rotY: 22.5, at: [0, 1.98, 0], color: '#2f6f4f' },
          ...[0.25, 0.5].flatMap((y) => ringWins(8, 0.42 * (1 - y / 0.9) * 0.95, 1.98 + y - 0.08, { w: 0.06, h: 0.1, top: 'round', color: '#f2ead8', d: 0.02 })),
          ...stripedOnion(0.12, 0.26, ['#d4a531', '#e8c15a'], [0, 2.82, 0], 8),
        ],
      },
      structure: [
        { part: 'platform', pos: [0, 0, 0], ry: 0 },
        { part: 'center', pos: [0, 0.8, 0], ry: 0 },
        { part: 'tent', pos: [0, 3.0, 0], ry: 0 },
        { part: 'bigA', pos: [0, 0.8, 1.75], ry: 0 },
        { part: 'bigA', pos: [0, 0.8, -1.75], ry: 0 },
        { part: 'bigB', pos: [1.75, 0.8, 0], ry: 0 },
        { part: 'bigB', pos: [-1.75, 0.8, 0], ry: 0 },
        { part: 'small', pos: [1.25, 0.8, 1.25], ry: 0 },
        { part: 'small', pos: [-1.25, 0.8, 1.25], ry: 0 },
        { part: 'small', pos: [1.25, 0.8, -1.25], ry: 0 },
        { part: 'small', pos: [-1.25, 0.8, -1.25], ry: 0 },
        { part: 'belfry', pos: [3.4, 0, 2.6], ry: 0 },
      ],
    },
  );

})();
