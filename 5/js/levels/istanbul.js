/* =========================================================
   ANIT USTASI — İstanbul bölümleri
   ========================================================= */

(function () {
  const AU = window.AU;
  const { ring, archPart, onFaces, minaret, win, winRow, ringWins, ribbedDome, alem, cornice, balustrade } = AU.shapes;

  // Silindir gövdede taş sırası çizgileri
  const courses = (r, h, step, color) => {
    const out = [];
    for (let y = step; y < h - 0.02; y += step) out.push({ shape: 'torus', r: r + 0.004, tube: 0.008, radial: 3, seg: 28, rotX: 90, at: [0, y, 0], color, detail: true });
    return out;
  };

  AU.levelDefs.push(
    /* ---------------------------------------------- 5 */
    {
      id: 'valens',
      name: 'Bozdoğan Su Kemeri',
      place: 'Fatih, İstanbul',
      era: 'MS 368 – 375',
      theme: { sky: '#cfd8e6', fog: '#d9dfe8', ground: '#8d8a72', pad: '#a59d84' },
      intro:
        'Önce dört büyük kemeri yan yana diz, üstüne sekiz küçük kemeri, en üste su kanalını yerleştir.',
      facts: [
        'Roma İmparatoru Valens döneminde tamamlandı; bu yüzden Valens Su Kemeri olarak da bilinir.',
        'Konstantinopolis\'e kilometrelerce öteden su taşıyan dev bir şebekenin parçasıydı.',
        'Bugün yaklaşık 900 metrelik bölümü ayaktadır; en yüksek yeri ~29 metredir.',
        'Taş ve tuğla sıraları dönüşümlü örülmüştür; Osmanlı döneminde pek çok kez onarıldı.',
      ],
      parts: {
        bigArch: archPart({
          w: 2, h: 2.4, d: 0.9, r: 0.6, spring: 1.25, bands: [0.4, 0.8],
          color: '#b59472', band: '#8c4f36', trim: '#cbb393',
        }),
        smallArch: archPart({
          w: 1, h: 1.3, d: 0.8, r: 0.27, spring: 0.62, bands: [0.28],
          color: '#ad8b68', band: '#8c4f36', trim: '#c7ad8b',
        }),
        channel: [
          { shape: 'box', size: [8, 0.3, 0.9], color: '#9b7b5c' },
          { shape: 'box', size: [8.06, 0.06, 0.96], at: [0, 0, 0], color: '#8c4f36' },
          { shape: 'box', size: [8, 0.2, 0.12], at: [0, 0.3, 0.39], color: '#b39373' },
          { shape: 'box', size: [8, 0.2, 0.12], at: [0, 0.3, -0.39], color: '#b39373' },
          { shape: 'box', size: [7.95, 0.08, 0.64], at: [0, 0.3, 0], color: '#5f9fc0' },
          // Kanal üstünü örten kapak taşları (bir kısmı düşmüş)
          ...[-3.4, -2.6, -1.2, -0.4, 1.0, 1.8, 3.2].map((x) => ({ shape: 'rock', size: [0.7, 0.08, 0.86], seed: x * 10 + 40, jitter: 0.02, at: [x, 0.5, 0], color: '#a68767' })),
          // Kemerin üstünde yetişen otlar ve çalılar
          ...[-3.8, -2.0, -0.9, 0.3, 2.4, 3.7].map((x, k) => ({ shape: 'sphere', r: 0.13 + (k % 3) * 0.04, scale: [1.4, 0.7, 1], at: [x, 0.46, (k % 2 ? 0.25 : -0.2)], color: k % 2 ? '#6f8a4a' : '#5f7a3f' })),
        ],
      },
      structure: [
        { part: 'bigArch', pos: [-3, 0, 0], ry: 0 },
        { part: 'bigArch', pos: [-1, 0, 0], ry: 0 },
        { part: 'bigArch', pos: [1, 0, 0], ry: 0 },
        { part: 'bigArch', pos: [3, 0, 0], ry: 0 },
        { part: 'smallArch', pos: [-3.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [-2.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [-1.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [-0.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [0.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [1.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [2.5, 2.4, 0], ry: 0 },
        { part: 'smallArch', pos: [3.5, 2.4, 0], ry: 0 },
        { part: 'channel', pos: [0, 3.7, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- 4 */
    {
      id: 'galata',
      name: 'Galata Kulesi',
      place: 'Beyoğlu, İstanbul',
      era: '1348',
      theme: { sky: '#f4b98a', fog: '#efc4a0', ground: '#8c7f6c', pad: '#a7987f' },
      intro:
        'Kuleyi kat kat yükselt: kapılı kaide, iki gövde katı, mazgallı seyir terası, ' +
        'kemer pencereli üst kat, külah ve alem.',
      facts: [
        '1348\'de Cenevizliler tarafından "Christea Turris" (İsa Kulesi) adıyla inşa edildi.',
        'Külahıyla birlikte yaklaşık 67 metre yüksekliğindedir.',
        'Osmanlı döneminde yangın gözetleme kulesi olarak kullanıldı.',
        'Evliya Çelebi\'ye göre Hezarfen Ahmed Çelebi 17. yüzyılda buradan Üsküdar\'a uçmuştur.',
      ],
      parts: {
        base: [
          { shape: 'cyl', rt: 1.5, rb: 1.62, h: 1.0, seg: 32, color: '#9c8b74', flat: true },
          ...courses(1.55, 1.0, 0.16, '#86765f'),
          { shape: 'cyl', rt: 1.55, rb: 1.55, h: 0.08, seg: 32, at: [0, 0.9, 0], color: '#83735f' },
          // Giriş: taş çerçeveli kemerli kapı, üstünde kitabe
          ...win({ w: 0.5, h: 0.78, at: [0, 0, 1.55], top: 'round', color: '#3a2a1e', frame: '#c2b49b', fw: 0.07, d: 0.06 }),
          { shape: 'box', size: [0.46, 0.14, 0.05], at: [0, 0.86, 1.6], color: '#e2d6bd' },
          // Kaidedeki küçük mazgal pencereler
          ...ringWins(3, 1.57, 0.4, { w: 0.08, h: 0.24, top: 'round', color: '#2c2723', startDeg: 90 }),
        ],
        body: [
          { shape: 'cyl', rt: 1.3, rb: 1.3, h: 1.5, seg: 32, color: '#b5a68e', flat: true },
          ...courses(1.3, 1.5, 0.15, '#9b8c75'),
          { shape: 'cyl', rt: 1.34, rb: 1.34, h: 0.08, seg: 32, color: '#9a8b74' },
          { shape: 'cyl', rt: 1.34, rb: 1.34, h: 0.08, seg: 32, at: [0, 0.74, 0], color: '#a5967e' },
          // Her katta dört kemerli pencere (dar ve derin)
          ...ringWins(4, 1.31, 0.18, { w: 0.18, h: 0.42, top: 'round', color: '#2c2723', frame: '#d2c4aa', fw: 0.035, startDeg: 45, glow: true }),
          ...ringWins(4, 1.31, 0.9, { w: 0.18, h: 0.42, top: 'round', color: '#2c2723', frame: '#d2c4aa', fw: 0.035, glow: true }),
        ],
        terrace: [
          // Konsollar üzerinde taşan seyir terası
          { shape: 'cyl', rt: 1.6, rb: 1.38, h: 0.22, seg: 32, color: '#7e7366' },
          ...Array.from({ length: 24 }, (_, k) => (k / 24) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.08, 0.16, 0.22], at: [Math.sin(a) * 1.42, 0.0, Math.cos(a) * 1.42], rotY: (a * 180) / Math.PI, color: '#8d8172' })),
          // Demir korkuluk
          ...Array.from({ length: 48 }, (_, k) => (k / 48) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.02, 0.24, 0.02], at: [Math.sin(a) * 1.55, 0.22, Math.cos(a) * 1.55], color: '#3a3c40', detail: true })),
          { shape: 'torus', r: 1.55, tube: 0.022, radial: 4, seg: 40, rotX: 90, at: [0, 0.46, 0], color: '#3a3c40' },
        ],
        upper: [
          { shape: 'cyl', rt: 1.18, rb: 1.18, h: 0.95, seg: 32, color: '#c3b49b', flat: true },
          // 12 kemerli pencere ve aralarında pilastırlar
          ...ringWins(12, 1.19, 0.16, { w: 0.24, h: 0.5, top: 'round', color: '#2f2a26', frame: '#e0d3bb', fw: 0.03, glow: true }),
          ...Array.from({ length: 12 }, (_, k) => ((k + 0.5) / 12) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.08, 0.8, 0.05], at: [Math.sin(a) * 1.19, 0.06, Math.cos(a) * 1.19], rotY: (a * 180) / Math.PI, color: '#d6c8ae' })),
          { shape: 'cyl', rt: 1.26, rb: 1.22, h: 0.08, seg: 32, at: [0, 0.87, 0], color: '#8d8172' },
        ],
        roof: [
          { shape: 'cyl', rt: 1.38, rb: 1.38, h: 0.1, seg: 32, color: '#3d4955' },
          // Hafif içbükey kurşun külah ve kaburgaları
          { shape: 'lathe', seg: 32, color: '#4c5b6b', points: [[1.32, 0], [1.1, 0.3], [0.85, 0.7], [0.55, 1.2], [0.25, 1.65], [0.06, 1.95], [0, 2.0]], at: [0, 0.1, 0] },
          ...Array.from({ length: 16 }, (_, k) => (k / 16) * Math.PI * 2).map((a) => ({
            shape: 'tube', r: 0.018, radial: 4, color: '#5d6d7e', detail: true,
            pts: [[1.33, 0.1], [1.11, 0.4], [0.86, 0.8], [0.56, 1.3], [0.26, 1.75], [0.07, 2.05]].map(([r, y]) => [Math.sin(a) * r, y, Math.cos(a) * r]),
          })),
          // Külahtaki küçük çatı penceresi
          { shape: 'box', size: [0.2, 0.22, 0.2], at: [0, 0.35, 1.0], color: '#4c5b6b' },
          { shape: 'box', size: [0.12, 0.14, 0.02], at: [0, 0.38, 1.1], color: '#ffd77a', glow: true },
        ],
        finial: [
          { shape: 'cyl', rt: 0.04, rb: 0.06, h: 0.45, seg: 8, color: '#c9a646', metal: true },
          { shape: 'sphere', r: 0.1, at: [0, 0.22, 0], color: '#e0bb4f', metal: true },
          { shape: 'sphere', r: 0.06, at: [0, 0.45, 0], color: '#e0bb4f', metal: true },
        ],
      },
      structure: [
        { part: 'base', pos: [0, 0, 0], ry: 0 },
        { part: 'body', pos: [0, 1.0, 0], ry: 0 },
        { part: 'body', pos: [0, 2.5, 0], ry: 0 },
        { part: 'terrace', pos: [0, 4.0, 0], ry: 0 },
        { part: 'upper', pos: [0, 4.22, 0], ry: 0 },
        { part: 'roof', pos: [0, 5.17, 0], ry: 0 },
        { part: 'finial', pos: [0, 7.27, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- KIZ KULESİ */
    {
      id: 'kizkulesi',
      name: 'Kız Kulesi',
      place: 'Üsküdar, İstanbul',
      era: 'Antik Çağ – 18. yy',
      theme: { sky: '#bcd6e8', fog: '#c6dbe8', ground: '#4f8fa8', pad: '#6f665c' },
      intro:
        'Boğaz\'ın ortasındaki kayalığa önce taş rıhtımı kur. Ardından ek binayı, kuleyi kat kat, ' +
        'seyir balkonunu, fener odasını, kurşun külahı, bayrağı ve iskeleyi yerleştir.',
      facts: [
        'Üsküdar açıklarında, İstanbul Boğazı\'nın girişindeki küçük bir adacığın üzerindedir.',
        'Geçmişi Antik Çağ\'a uzanır; Bizans döneminde burada bir kule ve tahkimat bulunduğu bilinir.',
        'Osmanlı döneminde fener kulesi, gözetleme yeri ve karantina istasyonu olarak kullanıldı.',
        'Kızını yılandan korumak için onu kuleye kapatan bir kralın efsanesiyle anılır; Batı\'da "Leandros Kulesi" diye bilinir.',
      ],
      parts: {
        islet: [{ shape: 'rock', size: [3.6, 0.45, 2.8], seed: 9, jitter: 0.1, color: '#6f665c' }],
        quay: [
          { shape: 'box', size: [3.0, 0.3, 2.2], color: '#cfc6b4' },
          { shape: 'box', size: [3.06, 0.05, 2.26], at: [0, 0.25, 0], color: '#e4dccb' },
        ],
        annex: [
          { shape: 'box', size: [1.5, 0.8, 1.6], color: '#ece6d8' },
          { shape: 'box', size: [1.52, 0.12, 1.62], color: '#cfc6b4' }, // taş subasman
          ...winRow({ n: 3, span: 0.9, at: [0, 0.22, 0.8], w: 0.16, h: 0.36, top: 'round', color: '#3b4a57', frame: '#d6cdbb', glow: true }),
          ...winRow({ n: 3, span: 0.9, at: [-0.75, 0.22, 0], rotY: -90, w: 0.16, h: 0.36, top: 'round', color: '#3b4a57', frame: '#d6cdbb', glow: true }),
          ...cornice(1.5, 1.6, 0.74, '#d9d0bf'),
          // Kurşun kaplı kırma çatı
          { shape: 'hip', w: 1.58, d: 1.68, h: 0.3, ridge: 0.3, at: [0, 0.81, 0], color: '#8b98a5' },
        ],
        towerBase: [
          { shape: 'box', size: [1.0, 1.1, 1.0], color: '#f2ede2' },
          { shape: 'box', size: [1.04, 0.14, 1.04], color: '#d9d0bf' },
          ...onFaces(win({ w: 0.18, h: 0.4, at: [0, 0.5, 0.5], top: 'round', color: '#3b4a57', frame: '#d9d0bf', glow: true })),
          ...onFaces([{ shape: 'box', size: [0.09, 1.1, 0.09], at: [0.48, 0, 0.48], color: '#d9d0bf' }]),
          ...cornice(1.0, 1.0, 1.03, '#d9d0bf', { h: 0.07, over: 0.04 }),
        ],
        towerMid: [
          { shape: 'cyl', rt: 0.42, rb: 0.44, h: 0.9, seg: 24, color: '#f4efe5' },
          ...ringWins(8, 0.43, 0.24, { w: 0.11, h: 0.34, top: 'round', color: '#3b4a57', frame: '#ddd4c2', fw: 0.025, startDeg: 22.5, glow: true }),
          { shape: 'cyl', rt: 0.46, rb: 0.46, h: 0.06, seg: 24, at: [0, 0.84, 0], color: '#d9d0bf' },
        ],
        gallery: [
          { shape: 'cyl', rt: 0.58, rb: 0.46, h: 0.1, seg: 24, color: '#d9d0bf' },
          ...Array.from({ length: 24 }, (_, k) => (k / 24) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.02, 0.2, 0.02], at: [Math.sin(a) * 0.55, 0.1, Math.cos(a) * 0.55], color: '#5d6670', detail: true })),
          { shape: 'torus', r: 0.55, tube: 0.016, radial: 4, seg: 32, rotX: 90, at: [0, 0.3, 0], color: '#5d6670' },
        ],
        lantern: [
          { shape: 'cyl', rt: 0.33, rb: 0.33, h: 0.45, seg: 16, color: '#3d5a73', glow: true, glowColor: '#ffe9a8' },
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.04, 0.45, 0.04], at: [Math.sin(a) * 0.335, 0, Math.cos(a) * 0.335], color: '#efe9dc' })),
          { shape: 'cyl', rt: 0.36, rb: 0.36, h: 0.04, seg: 16, at: [0, 0.42, 0], color: '#efe9dc' },
        ],
        cupola: [
          { shape: 'lathe', seg: 24, color: '#7d8a96', points: [[0.42, 0], [0.4, 0.12], [0.32, 0.3], [0.2, 0.48], [0.08, 0.64], [0, 0.7]] },
          ...alem(0.66, 0.8),
        ],
        flag: [
          { shape: 'cyl', rt: 0.015, rb: 0.025, h: 1.0, seg: 6, color: '#dcdcdc' },
          // Dalgalanan bayrak: hilal ve yıldız
          { shape: 'extrude', pts: [[0, 0], [0.12, 0.02], [0.26, -0.01], [0.38, 0.02], [0.5, 0], [0.5, 0.32], [0.38, 0.34], [0.26, 0.31], [0.12, 0.34], [0, 0.32]], d: 0.015, at: [0.0, 0.64, 0], color: '#d1262b', double: true },
          { shape: 'torus', r: 0.07, tube: 0.018, radial: 6, arc: Math.PI * 1.4, rotZ: 70, at: [0.2, 0.8, 0.012], color: '#ffffff', detail: true },
          { shape: 'sphere', r: 0.022, at: [0.3, 0.78, 0.012], color: '#ffffff', detail: true },
          { shape: 'sphere', r: 0.03, at: [0, 1.0, 0], color: '#e0bb4f', metal: true },
        ],
        jetty: [
          { shape: 'box', size: [0.6, 0.06, 1.4], at: [0, 0.3, 0], color: '#7a5a3a' },
          ...Array.from({ length: 9 }, (_, k) => -0.62 + k * 0.155).map((z) => ({ shape: 'box', size: [0.62, 0.012, 0.13], at: [0, 0.36, z], color: '#8d6a46', detail: true })),
          ...[-0.55, 0, 0.55].flatMap((z) => [-0.26, 0.26].map((x) => ({ shape: 'cyl', rt: 0.04, rb: 0.045, h: 0.42, seg: 8, at: [x, 0, z], color: '#5a4029' }))),
          ...[-0.29, 0.29].map((x) => ({ shape: 'box', size: [0.03, 0.03, 1.4], at: [x, 0.62, 0], color: '#5a4029' })),
          ...[-0.29, 0.29].flatMap((x) => [-0.6, 0, 0.6].map((z) => ({ shape: 'box', size: [0.03, 0.28, 0.03], at: [x, 0.36, z], color: '#5a4029', detail: true }))),
        ],
      },
      structure: [
        { part: 'islet', pos: [0, 0, 0], ry: 0 },
        { part: 'quay', pos: [0, 0.45, 0], ry: 0 },
        { part: 'annex', pos: [-0.75, 0.75, 0], ry: 0 },
        { part: 'towerBase', pos: [0.6, 0.75, 0], ry: 0 },
        { part: 'towerMid', pos: [0.6, 1.85, 0], ry: 0 },
        { part: 'gallery', pos: [0.6, 2.75, 0], ry: 0 },
        { part: 'lantern', pos: [0.6, 2.85, 0], ry: 0 },
        { part: 'cupola', pos: [0.6, 3.3, 0], ry: 0 },
        { part: 'flag', pos: [-1.2, 1.61, -0.5], ry: 0 },
        { part: 'jetty', pos: [0.9, 0, 2.05], ry: 0 },
      ],
    },

    /* ---------------------------------------------- 6 */
    {
      id: 'ayasofya',
      name: 'Ayasofya-i Kebir Camii',
      place: 'Sultanahmet, İstanbul',
      era: '537 · Cami: 1453',
      theme: { sky: '#9fb6d6', fog: '#b9c8de', ground: '#7f8a77', pad: '#a39a88' },
      intro:
        'Büyük final! Ana gövde ve son cemaat yeri, Mimar Sinan\'ın payandaları, 40 pencereli kasnak, ' +
        'ana kubbe ve alem, iki yarım kubbe, köşe kuleleri ve dört minare.',
      facts: [
        'İmparator I. Justinianus döneminde kilise olarak yaklaşık 5 yılda inşa edildi (532–537).',
        '1453\'te Fatih Sultan Mehmed tarafından camiye çevrildi; 1934\'te müze oldu, 2020\'de yeniden cami olarak ibadete açıldı.',
        'Ana kubbesi yaklaşık 31 m çapındadır ve kasnağında 40 pencere vardır.',
        'Mimar Sinan 16. yüzyılda yapıyı payandalarla güçlendirdi; minarelerden ikisi onun eseridir.',
      ],
      parts: {
        body: [
          { shape: 'box', size: [4, 1.6, 4], color: '#c98f6b' },
          // Kemerli pencere sıraları (alt galeriler ve üst sıra)
          ...winRow({ n: 5, span: 3.2, at: [2.0, 0.22, 0], rotY: 90, w: 0.2, h: 0.36, color: '#3a2e27', frame: '#e0b28e', glow: true }),
          ...winRow({ n: 5, span: 3.2, at: [-2.0, 0.22, 0], rotY: -90, w: 0.2, h: 0.36, color: '#3a2e27', frame: '#e0b28e', glow: true }),
          ...winRow({ n: 7, span: 3.4, at: [2.0, 0.82, 0], rotY: 90, w: 0.17, h: 0.46, color: '#2f2a26', frame: '#e0b28e', glow: true }),
          ...winRow({ n: 7, span: 3.4, at: [-2.0, 0.82, 0], rotY: -90, w: 0.17, h: 0.46, color: '#2f2a26', frame: '#e0b28e', glow: true }),
          ...winRow({ n: 5, span: 2.8, at: [0, 0.55, -2.0], rotY: 180, w: 0.2, h: 0.5, color: '#2f2a26', frame: '#e0b28e', glow: true }),
          // Timpan duvarı: büyük yarım daire içinde pencere ızgarası
          ...[-1, 1].flatMap((sx) => winRow({ n: 3, span: 0.9, at: [sx * 2.0, 1.12, 0], rotY: sx * 90, w: 0.18, h: 0.3, color: '#2f2a26', frame: '#e0b28e', glow: true })),
          { shape: 'box', size: [4.1, 0.08, 4.1], at: [0, 1.52, 0], color: '#e0b28e' },
          { shape: 'box', size: [4.06, 0.06, 4.06], at: [0, 0.7, 0], color: '#d9a582' },
          // Sıva altından görünen tuğla bantları
          ...[0.12, 0.45, 1.05, 1.32].map((y) => ({ shape: 'box', size: [4.02, 0.025, 4.02], at: [0, y, 0], color: '#b47c5a', detail: true })),
        ],
        narthex: [
          { shape: 'box', size: [3.6, 1.1, 0.8], color: '#cf9875' },
          // İmparatorluk kapısı ve yan kapılar
          ...win({ w: 0.6, h: 0.82, at: [0, 0, 0.4], top: 'round', color: '#4b3a30', frame: '#e6c6a6', fw: 0.06, d: 0.05 }),
          ...[-1.3, -0.75, 0.75, 1.3].flatMap((x) => win({ w: 0.24, h: 0.4, at: [x, 0.36, 0.4], top: 'round', color: '#2f2a26', frame: '#e6c6a6', glow: true })),
          { shape: 'box', size: [3.64, 0.06, 0.84], at: [0, 0.92, 0], color: '#e0b28e' },
          // Kurşun kaplı eğik çatı
          { shape: 'extrude', pts: [[-0.45, 0], [0.45, 0], [0.45, 0.24], [-0.45, 0.1]], d: 3.7, at: [0, 0.98, 0], rotY: 90, color: '#8b98a5' },
        ],
        buttress: [
          // Sinan payandası: aşağı doğru genişleyen eğimli kütle
          { shape: 'extrude', pts: [[-0.45, 0], [0.45, 0], [0.45, 0.3], [0.2, 1.9], [-0.2, 1.9], [-0.25, 0.3]], d: 0.5, rotY: 90, color: '#bd8462' },
          { shape: 'box', size: [0.56, 0.08, 0.96], at: [0, 0.3, 0], color: '#d9a582' },
          { shape: 'box', size: [0.56, 0.06, 0.5], at: [0, 1.84, 0], color: '#d9a582' },
          ...[0.6, 0.9, 1.2, 1.5].map((y) => ({ shape: 'box', size: [0.52, 0.02, 0.9 - y * 0.25], at: [0, y, 0], color: '#a97355', detail: true })),
        ],
        drum: [
          { shape: 'cyl', rt: 1.3, rb: 1.32, h: 0.38, seg: 40, color: '#d5a07c', flat: true },
          // 40 pencere ve aralarındaki kısa payandalar
          ...ringWins(40, 1.31, 0.07, { w: 0.1, h: 0.22, top: 'round', color: '#2f2a26', glow: true }),
          ...Array.from({ length: 40 }, (_, k) => ((k + 0.5) / 40) * 360).map((a) => ({ shape: 'box', size: [0.05, 0.36, 0.1], at: [Math.sin((a * Math.PI) / 180) * 1.34, 0, Math.cos((a * Math.PI) / 180) * 1.34], rotY: a, color: '#c88f6a' })),
        ],
        dome: [...ribbedDome(1.3, 0.75, 40, '#8b98a5', '#9aa7b3')],
        alem: [...alem(0, 1.4)],
        halfDome: [
          { shape: 'half', r: 0.8, sy: 0.75, color: '#93a0ac' },
          ...Array.from({ length: 5 }, (_, k) => ((k + 0.5) / 5) * Math.PI).flatMap((a) => win({ w: 0.08, h: 0.12, at: [Math.cos(a) * 0.78, 0.03, Math.sin(a) * 0.78], rotY: 90 - (a * 180) / Math.PI, color: '#2f2a26', glow: true })),
        ],
        turret: [
          { shape: 'box', size: [0.5, 0.7, 0.5], color: '#cf9875' },
          ...onFaces(win({ w: 0.11, h: 0.24, at: [0, 0.28, 0.25], top: 'round', color: '#2f2a26', frame: '#e0b28e', glow: true })),
          ...cornice(0.5, 0.5, 0.64, '#e0b28e', { h: 0.06, over: 0.03 }),
          { shape: 'hemi', r: 0.22, sy: 0.8, at: [0, 0.7, 0], color: '#8b98a5' },
          ...alem(0.86, 0.5),
        ],
        minaretSinan: minaret({
          base: 0.55, baseH: 0.6, r: 0.2, shaft: 3.0, cap: 0.9, balconies: [2.3, 3.1],
          stone: '#d9cfbf', body: '#ece4d6', rail: '#cfc4b2', lead: '#6f7d8a',
        }),
        minaretOld: minaret({
          base: 0.45, baseH: 0.5, r: 0.16, shaft: 2.8, cap: 0.8, balconies: [2.5],
          stone: '#c7a088', body: '#d7b59b', rail: '#bfa088', lead: '#6f7d8a',
        }),
      },
      structure: [
        { part: 'body', pos: [0, 0, 0], ry: 0 },
        { part: 'narthex', pos: [0, 0, 2.4], ry: 0 },
        { part: 'buttress', pos: [-2.25, 0, -0.95], ry: 0 },
        { part: 'buttress', pos: [-2.25, 0, 0.95], ry: 0 },
        { part: 'buttress', pos: [2.25, 0, -0.95], ry: 0 },
        { part: 'buttress', pos: [2.25, 0, 0.95], ry: 0 },
        { part: 'drum', pos: [0, 1.6, 0], ry: 0 },
        { part: 'dome', pos: [0, 1.98, 0], ry: 0 },
        { part: 'alem', pos: [0, 2.955, 0], ry: 0 },
        { part: 'halfDome', pos: [0, 1.6, 1.32], ry: 0 },
        { part: 'halfDome', pos: [0, 1.6, -1.32], ry: 2 },
        { part: 'turret', pos: [-1.65, 1.6, -1.65], ry: 0 },
        { part: 'turret', pos: [1.65, 1.6, -1.65], ry: 0 },
        { part: 'turret', pos: [-1.65, 1.6, 1.65], ry: 0 },
        { part: 'turret', pos: [1.65, 1.6, 1.65], ry: 0 },
        { part: 'minaretSinan', pos: [-2.8, 0, 2.8], ry: 0 },
        { part: 'minaretSinan', pos: [2.8, 0, 2.8], ry: 0 },
        { part: 'minaretOld', pos: [-2.8, 0, -2.8], ry: 0 },
        { part: 'minaretOld', pos: [2.8, 0, -2.8], ry: 0 },
      ],
    },
  );
})();
