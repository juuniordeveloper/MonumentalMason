/* =========================================================
   ANIT USTASI — Kıtalar (1): Avrupa ve Asya
   Eyfel Kulesi, Big Ben, Neuschwanstein,
   Çin Seddi, Angkor Wat, Himeji Kalesi
   ========================================================= */

(function () {
  const AU = window.AU;
  const { onFaces, ring, win, winRow, ringWins, balustrade, crenels, cornice } = AU.shapes;

  /* ---------- Kafes (demir örgü) yardımcıları ---------- */
  // İki nokta arasında ince çubuk
  const beam = (a, b, r, color) => ({ shape: 'bar', a, b, r, color, detail: true });
  // Kare kesitli kafes kule gövdesi: köşe kirişleri hafif içbükey eğriyle daralır,
  // her katta yatay kuşak ve yüzlerde çapraz (X) bağlar
  function towerTruss(hw0, hw1, h, n, color, chordR, dx) {
    const out = [];
    const hwAt = (t) => hw1 + (hw0 - hw1) * Math.pow(1 - t, 1.5);
    const offX = (t) => (dx || 0) * t;
    const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    for (const [cx, cz] of corners) {
      const pts = [];
      for (let k = 0; k <= n; k++) { const t = k / n; pts.push([offX(t) + cx * hwAt(t), t * h, cz * hwAt(t)]); }
      out.push({ shape: 'tube', pts, r: chordR, radial: 5, color });
    }
    for (let k = 0; k <= n; k++) {
      const t = k / n, w = hwAt(t), y = t * h, ox = offX(t);
      for (let c = 0; c < 4; c++) {
        const [ax, az] = corners[c], [bx, bz] = corners[(c + 1) % 4];
        out.push(beam([ox + ax * w, y, az * w], [ox + bx * w, y, bz * w], chordR * 0.6, color));
        if (k < n) {
          const t2 = (k + 1) / n, w2 = hwAt(t2), y2 = t2 * h, ox2 = offX(t2);
          out.push(beam([ox + ax * w, y, az * w], [ox2 + bx * w2, y2, bz * w2], chordR * 0.4, color));
          out.push(beam([ox + bx * w, y, bz * w], [ox2 + ax * w2, y2, az * w2], chordR * 0.4, color));
        }
      }
    }
    return out;
  }
  const GOLD = '#c9a646', DARKW = '#3f4650';

  /* ---------- Eyfel ---------- */
  const IRON = '#7b5a3c', IRON2 = '#664a30';
  const LEG_TILT = 28.6;
  // Platform korkuluğu (gece ışıklı) ve kenar frizi
  const rail = (s, y) => [
    ...[[0, s / 2, 0], [0, -s / 2, 0], [s / 2, 0, 90], [-s / 2, 0, 90]].flatMap(([x, z, r]) => [
      { shape: 'box', size: [s, 0.03, 0.03], at: [x, y + 0.14, z], rotY: r, color: '#ffd27a', glow: true },
      ...Array.from({ length: Math.round(s / 0.12) }, (_, k) => -s / 2 + 0.06 + k * 0.12).map((t) => ({ shape: 'box', size: [0.015, 0.14, 0.015], at: r ? [x, y, t] : [t, y, z], color: IRON2, detail: true })),
    ]),
  ];
  // Platform kenarındaki kemerli süs frizi
  const arcFrieze = (s, y, color) => [[0, s / 2, 0], [0, -s / 2, 180], [s / 2, 0, 90], [-s / 2, 0, -90]].flatMap(([x, z, r]) =>
    Array.from({ length: Math.round(s / 0.3) }, (_, k) => -s / 2 + 0.15 + k * 0.3).map((t) => {
      const rr = (r * Math.PI) / 180;
      return { shape: 'torus', r: 0.11, tube: 0.018, radial: 4, seg: 8, arc: Math.PI, at: [x + Math.cos(rr) * t, y, z - Math.sin(rr) * t], rotY: r, rotZ: 180, color, detail: true };
    }));
  const eiffelLegs = [[1.59, 1.59, -45], [-1.59, 1.59, -135], [1.59, -1.59, 45], [-1.59, -1.59, 135]];

  /* ---------- Big Ben ---------- */
  const LIME = '#d8c39a', LEAD = '#3f4b57';

  /* ---------- Çin Seddi ---------- */
  const WSTONE = '#9a9282', WSTONE2 = '#b0a796';
  // Basamaklı, yükselip alçalan sur parçası (yerden yükselen dolu duvar)
  // Basamaklı, yükselip alçalan sur parçası: dış yüzde mazgallı siper (mazgal delikli),
  // iç yüzde alçak korkuluk, üstte taş döşeli yürüme yolu
  function wallSteps(len, h1, h2) {
    const n = 6, list = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const h = h1 + (h2 - h1) * t;
      const x = -len / 2 + (len / n) * (i + 0.5);
      list.push({ shape: 'box', size: [len / n + 0.01, h, 0.7], at: [x, 0, 0], color: i % 2 ? WSTONE : WSTONE2 });
      list.push({ shape: 'box', size: [len / n + 0.01, 0.03, 0.56], at: [x, h, 0], color: '#8a8273' });
      // Taş blok sıraları
      for (let y = 0.18; y < h - 0.05; y += 0.18) list.push({ shape: 'box', size: [len / n + 0.012, 0.01, 0.712], at: [x, y, 0], color: '#857d6e', detail: true });
      // Dış siper: dişler ve mazgal delikleri
      list.push({ shape: 'box', size: [len / n, 0.12, 0.1], at: [x, h, 0.3], color: WSTONE2 });
      list.push({ shape: 'box', size: [len / n * 0.55, 0.16, 0.1], at: [x - len / n * 0.2, h + 0.12, 0.3], color: WSTONE2 });
      list.push({ shape: 'box', size: [0.03, 0.06, 0.02], at: [x - len / n * 0.2, h + 0.16, 0.36], color: '#3a3530', detail: true });
      list.push({ shape: 'box', size: [len / n, 0.12, 0.08], at: [x, h, -0.31], color: WSTONE });
      // Yaşlı surun dibinde yosun ve otlar
      if (i % 2 === 0) list.push({ shape: 'sphere', r: 0.1, seg: 6, rings: 4, scale: [1.6, 0.6, 1], at: [x, 0, 0.38], color: '#6f8a4a', detail: true });
    }
    return list;
  }
  // Çin çatısı: kırma çatı + kalkık saçak uçları + mahya süsleri
  function chineseRoof(w, h, d, color, ridge) {
    return [
      { shape: 'hip', w, d, h, ridge: 0.35, color },
      ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz]) => ({ shape: 'cone', r: 0.05, h: 0.2, seg: 5, at: [sx * w / 2, -0.02, sz * d / 2], rotX: sz * 40, rotZ: -sx * 40, color })),
      { shape: 'box', size: [w * 0.38, 0.06, 0.06], at: [0, h - 0.02, 0], color: ridge || color },
      ...[-1, 1].map((sx) => ({ shape: 'cone', r: 0.04, h: 0.12, seg: 5, at: [sx * w * 0.19, h, 0], color: ridge || color })),
    ];
  }

  /* ---------- Angkor Wat ---------- */
  const SAND = '#a89878', SAND2 = '#958566';
  // Lotus tomurcuğu biçimli prang kulesi: kademeli silmeler ve her kademede küçük süs çıkıntıları
  const lotusProfile = [[0, 0], [0.55, 0], [0.55, 0.2], [0.5, 0.35], [0.52, 0.5], [0.46, 0.7], [0.48, 0.85], [0.4, 1.05], [0.42, 1.2], [0.33, 1.4], [0.34, 1.55], [0.25, 1.75], [0.24, 1.9], [0.15, 2.1], [0.12, 2.3], [0.05, 2.5], [0, 2.6]];
  const lotus = (s) => ({
    shape: 'lathe', seg: 12, color: '#9d8d6e', flat: true,
    points: lotusProfile.map(([x, y]) => [x * s, y * s]),
  });
  function lotusTower(s, at) {
    const [x0, y0, z0] = at;
    const out = [{ ...lotus(s), at }];
    // Her kademede dışa taşan küçük alevli süsler (antefiks)
    for (const [r, y] of [[0.52, 0.5], [0.48, 0.85], [0.42, 1.2], [0.34, 1.55], [0.24, 1.9]]) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
        out.push({ shape: 'cone', r: 0.05 * s, h: 0.16 * s, seg: 4, at: [x0 + Math.sin(a) * r * s, y0 + y * s, z0 + Math.cos(a) * r * s], color: '#8f7f62', detail: true });
      }
    }
    // Giriş nişleri (dört yöne bakan kapı kemerleri)
    out.push(...[0, 90, 180, 270].flatMap((d) => win({ w: 0.24 * s, h: 0.34 * s, at: [x0 + Math.sin((d * Math.PI) / 180) * 0.55 * s, y0, z0 + Math.cos((d * Math.PI) / 180) * 0.55 * s], rotY: d, top: 'pointed', color: '#4a4033', d: 0.02 })));
    return out;
  }
  function angkorStairs() {
    const list = [];
    for (let j = 0; j < 8; j++) {
      list.push({ shape: 'box', size: [0.7, 0.22 * (j + 1), 0.24], at: [0, 0, 3.35 - j * 0.24], color: j % 2 ? SAND : SAND2 });
      list.push({ shape: 'box', size: [0.72, 0.02, 0.24], at: [0, 0.22 * (j + 1) - 0.02, 3.35 - j * 0.24], color: '#7f7258', detail: true });
    }
    // Merdiven yanlarındaki Naga yılanı korkulukları
    for (const x of [-0.38, 0.38]) list.push({ shape: 'tube', r: 0.04, radial: 6, color: '#8a7a5c', pts: [[x, 0.2, 3.5], [x, 0.9, 2.85], [x, 1.8, 1.9]] });
    return list;
  }

  /* ---------- Himeji ---------- */
  const HWHITE = '#f3f1ea', HROOF = '#5f6b6f';
  // Himeji katı: beyaz alçı sıva, siyah pencere kafesleri ve alt bantta koyu ahşap kuşak
  const hFloor = (w, h, d) => [
    { shape: 'box', size: [w, h, d], color: HWHITE },
    { shape: 'box', size: [w + 0.01, h * 0.12, d + 0.01], color: '#d8d4ca' },
    ...winRow({ n: Math.max(2, Math.round(w / 0.45)), span: w * 0.75, at: [0, h * 0.3, d / 2], w: 0.13, h: 0.2, top: 'flat', color: DARKW, frame: '#2a2e33', fw: 0.02 }),
    ...winRow({ n: Math.max(2, Math.round(w / 0.45)), span: w * 0.75, at: [0, h * 0.3, -d / 2], rotY: 180, w: 0.13, h: 0.2, top: 'flat', color: DARKW, frame: '#2a2e33', fw: 0.02 }),
    ...winRow({ n: Math.max(2, Math.round(d / 0.5)), span: d * 0.7, at: [w / 2, h * 0.3, 0], rotY: 90, w: 0.12, h: 0.2, top: 'flat', color: DARKW }),
    ...winRow({ n: Math.max(2, Math.round(d / 0.5)), span: d * 0.7, at: [-w / 2, h * 0.3, 0], rotY: -90, w: 0.12, h: 0.2, top: 'flat', color: DARKW }),
    // Pencere kafesi çubukları
    ...Array.from({ length: Math.max(2, Math.round(w / 0.45)) }, (_, k) => -w * 0.375 + (w * 0.75 * k) / Math.max(1, Math.round(w / 0.45) - 1)).map((x) => ({ shape: 'box', size: [0.012, 0.2, 0.012], at: [x, h * 0.3, d / 2 + 0.035], color: '#9aa0a6', detail: true })),
  ];
  // Kat çatısı: kavisli kenarlı kiremit etek, kiremit oluk çizgileri ve üçgen (chidori) alınlıklar
  const hRoof = (rb, rt, h) => [
    { shape: 'lathe', seg: 4, phi0: Math.PI / 4, flat: true, color: HROOF, points: [[rb * 1.04, 0], [rb * 0.98, h * 0.08], [rb * 0.86, h * 0.3], [(rb + rt) / 2, h * 0.55], [rt * 1.05, h * 0.86], [rt, h], [0, h]] },
    ...Array.from({ length: 10 }, (_, k) => -rb * 0.6 + (k * rb * 1.2) / 9).flatMap((t) => [1, -1].map((sz) => ({ shape: 'box', size: [0.015, 0.02, rb * 0.5], at: [t * 0.95, h * 0.45, sz * rb * 0.48], rotX: sz * 55, color: '#4f595d', detail: true }))),
    { shape: 'tri', w: rb * 0.55, h: h * 1.1, d: 0.3, at: [0, h * 0.2, rb * 0.6], color: HROOF },
    { shape: 'tri', w: rb * 0.42, h: h * 0.8, d: 0.04, at: [0, h * 0.28, rb * 0.6 + 0.16], color: HWHITE },
    { shape: 'tri', w: rb * 0.48, h: h * 0.9, d: 0.26, at: [0, h * 0.2, -rb * 0.6], color: HROOF },
    // Yan cephedeki küçük üçgen alınlık
    { shape: 'tri', w: rb * 0.4, h: h * 0.8, d: 0.24, rotY: 90, at: [rb * 0.6, h * 0.2, 0], color: HROOF },
    { shape: 'tri', w: rb * 0.3, h: h * 0.6, d: 0.03, rotY: 90, at: [rb * 0.6 + 0.12, h * 0.26, 0], color: HWHITE },
  ];
  // Taş kaide: içbükey (musha-gaeshi) eğri, düzensiz taş örgü çizgileri
  const stoneBaseProfile = [[2.6, 0], [2.42, 0.3], [2.25, 0.65], [2.14, 0.95], [2.1, 1.2], [0, 1.2]];

  AU.levelDefs.push(
    /* ---------------------------------------------- EYFEL KULESİ */
    {
      id: 'eiffel', name: 'Eyfel Kulesi', place: 'Paris, Fransa', era: '1887 – 1889',
      theme: { sky: '#b9cde0', fog: '#cad7e3', ground: '#8fa36a', pad: '#c9bfa9' },
      intro: 'Dört eğik ayağı ve aralarındaki süs kemerlerini yerleştir; ardından birinci platformu, orta gövdeyi, ikinci platformu, ince üst gövdeyi ve zirveyi üst üste koy.',
      facts: [
        'Gustave Eiffel\'in şirketi tarafından 1889 Paris Dünya Fuarı için inşa edildi.',
        'Yaklaşık 18.000 demir parça ve 2,5 milyon perçinle birleştirildi.',
        '1930\'a kadar dünyanın en yüksek yapısıydı; bugün antenleriyle yaklaşık 330 m\'dir.',
        '20 yıl sonra sökülmesi planlanıyordu; telsiz anteni olarak kullanılması onu kurtardı.',
      ],
      parts: {
        // Eğik kafes ayak: 2,55 birim boyunda, merkeze doğru eğilen dörtgen kafes
        leg: [
          { shape: 'box', size: [0.5, 0.12, 0.5], color: '#9a8f80' }, // taş kaide
          ...towerTruss(0.24, 0.17, 2.24, 6, IRON, 0.03, -1.22),
        ],
        archDeco: [
          // Ayakları birleştiren süs kemeri: çift eğri kiriş ve aralarında ışınsal dikmeler
          ...[1.0, 1.1].map((r) => ({ shape: 'tube', r: 0.035, radial: 5, color: IRON2, pts: Array.from({ length: 13 }, (_, k) => { const a = (k / 12) * Math.PI; return [Math.cos(a) * r * 1.3, Math.sin(a) * r * (r > 1.05 ? 1.0 : 0.94), 0]; }) })),
          ...Array.from({ length: 11 }, (_, k) => ((k + 1) / 12) * Math.PI).map((a) => beam([Math.cos(a) * 1.3, Math.sin(a) * 0.94, 0], [Math.cos(a) * 1.43, Math.min(1.1, Math.sin(a) * 1.1 + 0.08), 0], 0.015, IRON2)),
          { shape: 'box', size: [2.8, 0.06, 0.08], at: [0, 1.09, 0], color: IRON2 },
          ...Array.from({ length: 9 }, (_, k) => -1.2 + k * 0.3).map((x) => beam([x, Math.sqrt(Math.max(0, 1 - (x / 1.43) ** 2)) * 1.1, 0], [x, 1.1, 0], 0.012, IRON2)),
        ],
        platform1: [
          { shape: 'box', size: [2.7, 0.22, 2.7], color: IRON },
          ...arcFrieze(2.7, 0.04, IRON2),
          ...rail(2.74, 0.22),
          // Birinci kattaki cam cepheli pavyon
          { shape: 'box', size: [1.0, 0.3, 0.5], at: [0, 0.22, 0.95], color: '#8a6a4a' },
          { shape: 'box', size: [0.94, 0.2, 0.02], at: [0, 0.27, 1.2], color: '#cfe0ea', glow: true, glowColor: '#ffe3a0' },
        ],
        mid: [
          ...towerTruss(0.81, 0.39, 2.4, 6, IRON, 0.045),
          // İç dört ayak (asansör kafesleri) izlenimi
          ...towerTruss(0.5, 0.25, 2.4, 3, IRON2, 0.02),
        ],
        platform2: [
          { shape: 'box', size: [1.3, 0.16, 1.3], color: IRON },
          ...arcFrieze(1.3, 0.02, IRON2),
          ...rail(1.32, 0.16),
        ],
        top: [
          ...towerTruss(0.35, 0.11, 3.0, 8, IRON, 0.035),
          // Ortadaki asansör boşluğu
          { shape: 'cyl', rt: 0.05, rb: 0.08, h: 3.0, seg: 6, color: IRON2 },
        ],
        summit: [
          // Gözlem katı (camlı), Eiffel'in ofisi, fener ve antenler
          { shape: 'box', size: [0.34, 0.2, 0.34], color: IRON2 },
          { shape: 'box', size: [0.3, 0.12, 0.3], at: [0, 0.2, 0], color: '#cfe0ea', glow: true, glowColor: '#ffe3a0' },
          { shape: 'box', size: [0.36, 0.03, 0.36], at: [0, 0.32, 0], color: IRON },
          { shape: 'cyl', rt: 0.1, rb: 0.12, h: 0.12, seg: 8, at: [0, 0.35, 0], color: IRON2 },
          { shape: 'hemi', r: 0.09, sy: 0.8, at: [0, 0.47, 0], color: IRON },
          { shape: 'cyl', rt: 0.012, rb: 0.03, h: 0.45, seg: 6, at: [0, 0.54, 0], color: '#cfcfcf', metal: true },
          ...[0.7, 0.82].map((y) => ({ shape: 'box', size: [0.12, 0.02, 0.02], at: [0, y, 0], color: '#cfcfcf', metal: true })),
          { shape: 'sphere', r: 0.05, at: [0, 0.98, 0], color: '#ffd27a', glow: true },
        ],
      },
      structure: [
        ...eiffelLegs.map(([x, z, d]) => ({ part: 'leg', pos: [x, 0, z], ryDeg: d })),
        { part: 'archDeco', pos: [0, 0, 1.59], ry: 0 },
        { part: 'archDeco', pos: [0, 0, -1.59], ry: 0 },
        { part: 'archDeco', pos: [1.59, 0, 0], ry: 1 },
        { part: 'archDeco', pos: [-1.59, 0, 0], ry: 1 },
        { part: 'platform1', pos: [0, 2.2, 0], ry: 0 },
        { part: 'mid', pos: [0, 2.42, 0], ry: 0 },
        { part: 'platform2', pos: [0, 4.82, 0], ry: 0 },
        { part: 'top', pos: [0, 4.98, 0], ry: 0 },
        { part: 'summit', pos: [0, 7.98, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- BIG BEN */
    {
      id: 'bigben', name: 'Big Ben ve Westminster', place: 'Londra, Birleşik Krallık', era: '1843 – 1859',
      theme: { sky: '#b4c3cf', fog: '#c6d0d8', ground: '#7f9466', pad: '#b8ad98' },
      intro: 'Saat kulesini kat kat yükselt: gövde, dört kadranlı saat katı, çan katı ve sivri çatı. Yanına parlamento binasının iki kanadını, çatılarını ve kulelerini ekle.',
      facts: [
        'Resmî adı 2012\'den beri Elizabeth Kulesi\'dir; "Big Ben" aslında içindeki büyük çanın adıdır.',
        '1834 yangınından sonra Westminster Sarayı ile birlikte yeniden inşa edildi; kule 1859\'da tamamlandı.',
        'Mimarları Charles Barry ile Gotik Uyanış ayrıntılarını çizen Augustus Pugin\'dir.',
        'Saat kadranlarının her biri yaklaşık 7 m çapındadır.',
      ],
      parts: {
        towerBase: [
          { shape: 'box', size: [1.1, 3.2, 1.1], color: LIME },
          // Dik (Perpendicular) gotik panolar: ince dikey çubuklar ve sivri kemerli pencereler
          ...onFaces([
            { shape: 'box', size: [0.66, 2.75, 0.03], at: [0, 0.3, 0.56], color: '#c4ad82' },
            ...[-0.24, -0.12, 0, 0.12, 0.24].map((x) => ({ shape: 'box', size: [0.025, 2.75, 0.04], at: [x, 0.3, 0.575], color: '#e2cfa8', detail: true })),
            ...[-0.18, 0.18].flatMap((x) => [0.5, 1.4, 2.3].flatMap((y) => win({ w: 0.1, h: 0.36, at: [x, y, 0.57], top: 'pointed', color: DARKW, glow: true }))),
            ...[0.95, 1.85, 2.75].map((y) => ({ shape: 'box', size: [0.66, 0.04, 0.05], at: [0, y, 0.575], color: '#e2cfa8', detail: true })),
          ]),
          // Köşe payandaları
          ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz]) => ({ shape: 'box', size: [0.12, 3.2, 0.12], at: [sx * 0.52, 0, sz * 0.52], color: '#e2cfa8' })),
        ],
        clockStage: [
          { shape: 'box', size: [1.3, 1.05, 1.3], color: LIME },
          ...onFaces([
            // Altın çerçeveli kadran: opal cam, saat rakamları, akrep ve yelkovan
            { shape: 'box', size: [1.0, 1.0, 0.03], at: [0, 0.02, 0.65], color: '#c9a646', metal: true },
            { shape: 'cyl', rt: 0.42, rb: 0.42, h: 0.04, seg: 32, rotX: 90, at: [0, 0.52, 0.65], color: '#f4ecd2', glow: true },
            { shape: 'torus', r: 0.43, tube: 0.025, radial: 4, seg: 32, at: [0, 0.52, 0.69], color: '#1c1c1c' },
            ...Array.from({ length: 12 }, (_, k) => (k / 12) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.025, 0.06, 0.01], at: [Math.sin(a) * 0.35, 0.52 + Math.cos(a) * 0.35 - 0.03, 0.69], rotZ: (-a * 180) / Math.PI, color: '#1c1c1c', detail: true })),
            { shape: 'box', size: [0.025, 0.3, 0.015], at: [0, 0.52, 0.7], color: '#1c1c1c' },
            { shape: 'box', size: [0.22, 0.025, 0.015], at: [0.1, 0.52, 0.7], color: '#1c1c1c' },
            // Kadran üstündeki Latince yazıt bandı ve sivri alınlık
            { shape: 'box', size: [1.0, 0.06, 0.03], at: [0, 1.0, 0.66], color: '#c9a646', metal: true },
          ]),
          ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz]) => ({ shape: 'box', size: [0.14, 1.05, 0.14], at: [sx * 0.6, 0, sz * 0.6], color: '#e2cfa8' })),
        ],
        belfry: [
          { shape: 'box', size: [1.05, 0.6, 1.05], color: LIME },
          // Çan katı: sivri kemerli açık arkadlar, köşe tepelikleri
          ...onFaces([-0.28, 0, 0.28].flatMap((x) => win({ w: 0.16, h: 0.42, at: [x, 0.08, 0.525], top: 'pointed', color: DARKW, frame: '#e2cfa8', fw: 0.02 }))),
          ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].flatMap(([sx, sz]) => [
            { shape: 'box', size: [0.1, 0.6, 0.1], at: [sx * 0.5, 0, sz * 0.5], color: '#e2cfa8' },
            { shape: 'cone', r: 0.07, h: 0.3, seg: 4, rotY: 45, at: [sx * 0.5, 0.6, sz * 0.5], color: GOLD, metal: true },
          ]),
        ],
        spire: [
          // Dökme demir sivri çatı: çatı pencereleri (lucarne), altın süsler ve tepe haçı
          { shape: 'cone', r: 0.76, h: 1.7, seg: 4, rotY: 45, color: LEAD },
          ...onFaces([
            { shape: 'cone', r: 0.06, h: 0.42, seg: 4, at: [0.5, 0, 0.5], color: GOLD, metal: true },
            { shape: 'box', size: [0.2, 0.26, 0.12], at: [0, 0.3, 0.32], color: LEAD },
            { shape: 'tri', w: 0.24, h: 0.16, d: 0.14, at: [0, 0.56, 0.32], color: GOLD, metal: true },
            { shape: 'box', size: [0.12, 0.16, 0.02], at: [0, 0.34, 0.39], color: '#ffd27a', glow: true },
            { shape: 'box', size: [0.14, 0.2, 0.08], at: [0, 0.85, 0.18], color: LEAD },
          ]),
          ...[0.6, 1.0, 1.35].map((y) => ({ shape: 'cyl', rt: 0.76 * (1 - (y + 0.03) / 1.7) * 1.02, rb: 0.76 * (1 - y / 1.7) * 1.02, h: 0.03, seg: 4, rotY: 45, at: [0, y, 0], color: GOLD, metal: true, detail: true })),
          { shape: 'sphere', r: 0.05, at: [0, 1.68, 0], color: GOLD, metal: true },
          { shape: 'box', size: [0.02, 0.22, 0.02], at: [0, 1.72, 0], color: GOLD, metal: true },
          { shape: 'box', size: [0.1, 0.02, 0.02], at: [0, 1.85, 0], color: GOLD, metal: true },
        ],
        wing: [
          { shape: 'box', size: [3, 1.6, 1.4], color: LIME },
          // Westminster Sarayı cephesi: dikey panolu sivri pencereler, kat silmeleri, tepede mazgal ve tepelikler
          ...winRow({ n: 8, span: 2.6, at: [0, 0.22, 0.7], w: 0.14, h: 0.46, top: 'pointed', color: DARKW, frame: '#e2cfa8', fw: 0.025, mullion: true, glow: true }),
          ...winRow({ n: 8, span: 2.6, at: [0, 0.92, 0.7], w: 0.14, h: 0.46, top: 'pointed', color: DARKW, frame: '#e2cfa8', fw: 0.025, mullion: true, glow: true }),
          ...winRow({ n: 8, span: 2.6, at: [0, 0.6, -0.7], rotY: 180, w: 0.14, h: 0.46, top: 'pointed', color: DARKW, glow: true }),
          ...Array.from({ length: 9 }, (_, k) => -1.3 + k * 0.325).map((x) => ({ shape: 'box', size: [0.05, 1.6, 0.05], at: [x + 0.163 - 0.163, 0, 0.72], color: '#e2cfa8', detail: true })),
          ...[0.8, 1.5].map((y) => ({ shape: 'box', size: [3.02, 0.04, 1.44], at: [0, y, 0], color: '#e2cfa8' })),
          ...crenels(3.0, 1.54, 0.66, '#e2cfa8', { w: 0.1, gap: 0.08, h: 0.1, t: 0.06 }),
          ...Array.from({ length: 5 }, (_, k) => -1.4 + k * 0.7).map((x) => ({ shape: 'cone', r: 0.04, h: 0.22, seg: 4, rotY: 45, at: [x, 1.54, 0.68], color: '#e2cfa8' })),
        ],
        wingRoof: [
          { shape: 'tri', w: 1.5, h: 0.55, d: 3.05, rotY: 90, color: LEAD },
          // Mahyada dökme demir süs şeridi ve küçük çatı pencereleri
          { shape: 'box', size: [3.05, 0.08, 0.03], at: [0, 0.55, 0], color: GOLD, metal: true },
          ...Array.from({ length: 15 }, (_, k) => -1.4 + k * 0.2).map((x) => ({ shape: 'cone', r: 0.02, h: 0.08, seg: 4, at: [x, 0.58, 0], color: GOLD, metal: true, detail: true })),
          ...[-1, 0, 1].map((x) => ({ shape: 'box', size: [0.14, 0.14, 0.12], at: [x, 0.12, 0.5], color: LEAD })),
        ],
        turret: [
          { shape: 'box', size: [0.5, 2.3, 0.5], color: LIME },
          ...onFaces([
            ...win({ w: 0.12, h: 0.5, at: [0, 1.3, 0.25], top: 'pointed', color: DARKW, frame: '#e2cfa8', glow: true }),
            ...win({ w: 0.1, h: 0.36, at: [0, 0.5, 0.25], top: 'pointed', color: DARKW, glow: true }),
          ]),
          ...cornice(0.5, 0.5, 2.2, '#e2cfa8', { h: 0.06, over: 0.04 }),
          { shape: 'cone', r: 0.38, h: 0.65, seg: 4, rotY: 45, at: [0, 2.3, 0], color: LEAD },
          ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz]) => ({ shape: 'cone', r: 0.04, h: 0.25, seg: 4, at: [sx * 0.23, 2.26, sz * 0.23], color: '#e2cfa8' })),
          { shape: 'sphere', r: 0.03, at: [0, 2.94, 0], color: GOLD, metal: true },
        ],
      },
      structure: [
        { part: 'towerBase', pos: [2.2, 0, 0], ry: 0 },
        { part: 'clockStage', pos: [2.2, 3.2, 0], ry: 0 },
        { part: 'belfry', pos: [2.2, 4.25, 0], ry: 0 },
        { part: 'spire', pos: [2.2, 4.85, 0], ry: 0 },
        { part: 'wing', pos: [0, 0, 0], ry: 0 },
        { part: 'wing', pos: [-3.0, 0, 0], ry: 0 },
        { part: 'wingRoof', pos: [0, 1.6, 0], ry: 0 },
        { part: 'wingRoof', pos: [-3.0, 1.6, 0], ry: 0 },
        { part: 'turret', pos: [-4.75, 0, 0], ry: 0 },
        { part: 'turret', pos: [-1.5, 0, 0.55], ry: 0 },
      ],
    },

    /* ---------------------------------------------- NEUSCHWANSTEIN */
    {
      id: 'neuschwanstein', name: 'Neuschwanstein Şatosu', place: 'Bavyera, Almanya', era: '1869 – 1886',
      theme: { sky: '#aecbe3', fog: '#c3d6e3', ground: '#5f8a45', pad: '#8a8576' },
      intro: 'Kayalık tepenin üstüne masal şatosunu kur: beyaz saray binası ve mavi çatısı, yuvarlak ana kule ve külahı, ince kuleler, kırmızı tuğla kapı binası ve sur duvarı.',
      facts: [
        'Bavyera Kralı II. Ludwig\'in emriyle 1869\'da başlandı; kral 1886\'da öldüğünde tamamlanmamıştı.',
        'Ortaçağ şatosu görünümünde olsa da kalorifer ve akan su gibi dönemine göre modern olanaklara sahipti.',
        'Kralın ölümünden yalnızca haftalar sonra ziyaretçilere açıldı.',
        'Disney\'in Uyuyan Güzel şatosuna ilham verdiği kabul edilir.',
      ],
      parts: {
        cliff: [
          { shape: 'rock', size: [6.2, 1.2, 3.4], seed: 51, jitter: 0.12, color: '#8b8576' },
          ...[[-2.6, 1.2], [2.4, -1.3], [-1.0, -1.5], [2.8, 1.0]].map(([x, z], k) => ({ shape: 'sphere', r: 0.25, seg: 8, rings: 6, scale: [1.3, 0.8, 1], at: [x, 1.0, z], color: k % 2 ? '#4f7a3a' : '#5f8a45' })),
        ],
        palas: [
          { shape: 'box', size: [2.8, 2.6, 1.2], color: '#efece4' },
          // Romanesk ikiz ve üçlü kemerli pencereler, kat silmeleri
          ...[0.4, 1.2].flatMap((y) => winRow({ n: 7, span: 2.4, at: [0, y, 0.6], w: 0.16, h: 0.42, top: 'round', color: '#4a5562', frame: '#d9d4c8', fw: 0.025, glow: true })),
          ...[-0.9, -0.3, 0.3, 0.9].flatMap((x) => [-0.07, 0.07].flatMap((dx) => win({ w: 0.11, h: 0.34, at: [x + dx, 1.98, 0.6], top: 'round', color: '#4a5562', glow: true }))),
          ...[0.95, 1.75, 2.45].map((y) => ({ shape: 'box', size: [2.84, 0.05, 1.24], at: [0, y, 0], color: '#d9d4c8' })),
          // Balkon (Sängersaal tarafı)
          { shape: 'box', size: [0.9, 0.06, 0.3], at: [0.6, 1.75, 0.72], color: '#d9d4c8' },
          ...balustrade(0.9, 0.16, '#d9d4c8', [0.6, 1.81, 0.86], 0, 0.08),
        ],
        palasRoof: [
          { shape: 'tri', w: 1.3, h: 0.9, d: 2.9, rotY: 90, color: '#5d7184' },
          // Çatı pencereleri, uçlarda kademeli alınlık
          ...[-0.9, 0, 0.9].flatMap((x) => [
            { shape: 'box', size: [0.2, 0.22, 0.2], at: [x, 0.15, 0.36], color: '#efece4' },
            { shape: 'tri', w: 0.26, h: 0.14, d: 0.24, at: [x, 0.37, 0.36], color: '#5d7184' },
            { shape: 'box', size: [0.1, 0.13, 0.02], at: [x, 0.19, 0.47], color: '#4a5562', glow: true },
          ]),
          { shape: 'box', size: [0.16, 0.4, 0.16], at: [0.9, 0.5, 0], color: '#efece4' },
          { shape: 'cone', r: 0.12, h: 0.3, seg: 8, at: [0.9, 0.9, 0], color: '#5d7184' },
          { shape: 'box', size: [2.9, 0.04, 0.04], at: [0, 0.9, 0], color: GOLD, metal: true },
        ],
        mainTower: [
          { shape: 'cyl', rt: 0.48, rb: 0.5, h: 3.6, seg: 20, color: '#efece4' },
          ...ringWins(6, 0.49, 2.35, { w: 0.13, h: 0.36, top: 'round', color: '#4a5562', frame: '#d9d4c8', glow: true }),
          ...ringWins(4, 0.5, 1.3, { w: 0.1, h: 0.3, top: 'round', color: '#4a5562', glow: true, startDeg: 45 }),
          // Konsollu çıkıntı ve köşe kuleciği
          { shape: 'cyl', rt: 0.55, rb: 0.5, h: 0.14, seg: 20, at: [0, 3.0, 0], color: '#d9d4c8' },
          ...Array.from({ length: 16 }, (_, k) => (k / 16) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.05, 0.1, 0.08], at: [Math.sin(a) * 0.5, 2.9, Math.cos(a) * 0.5], rotY: (a * 180) / Math.PI, color: '#d9d4c8', detail: true })),
          { shape: 'cyl', rt: 0.1, rb: 0.06, h: 0.6, seg: 10, at: [0.42, 2.6, 0.2], color: '#efece4' },
        ],
        towerCap: [
          { shape: 'cone', r: 0.58, h: 1.3, seg: 20, color: '#5d7184' },
          ...[0, 1, 2, 3].map((k) => ({ shape: 'box', size: [0.12, 0.18, 0.1], at: [Math.sin(k * Math.PI / 2) * 0.42, 0.18, Math.cos(k * Math.PI / 2) * 0.42], rotY: k * 90, color: '#5d7184' })),
          { shape: 'sphere', r: 0.05, at: [0, 1.28, 0], color: GOLD, metal: true },
          { shape: 'cyl', rt: 0.008, rb: 0.012, h: 0.2, seg: 5, at: [0, 1.32, 0], color: GOLD, metal: true },
        ],
        turret: [
          { shape: 'cyl', rt: 0.22, rb: 0.22, h: 2.6, seg: 14, color: '#efece4' },
          ...ringWins(3, 0.22, 1.8, { w: 0.07, h: 0.2, top: 'round', color: '#4a5562', glow: true }),
          { shape: 'cyl', rt: 0.26, rb: 0.22, h: 0.1, seg: 14, at: [0, 2.5, 0], color: '#d9d4c8' },
          { shape: 'cone', r: 0.28, h: 0.8, seg: 14, at: [0, 2.6, 0], color: '#5d7184' },
          { shape: 'sphere', r: 0.03, at: [0, 3.38, 0], color: GOLD, metal: true },
        ],
        gatehouse: [
          { shape: 'box', size: [1.6, 1.4, 1.0], color: '#b5654a' },
          // Kırmızı tuğla kapı yapısı: beyaz taş kemerli kapı, köşe kuleleri, tuğla bantlar
          ...win({ w: 0.42, h: 0.72, at: [0, 0, 0.5], top: 'round', color: '#3a2a22', frame: '#efece4', fw: 0.05 }),
          ...[-0.5, 0.5].flatMap((x) => win({ w: 0.12, h: 0.24, at: [x, 0.8, 0.5], top: 'round', color: '#3a2a22', frame: '#efece4' })),
          ...[0.3, 0.6, 0.9].map((y) => ({ shape: 'box', size: [1.62, 0.02, 1.02], at: [0, y, 0], color: '#9b4a36', detail: true })),
          ...[-0.78, 0.78].map((x) => ({ shape: 'cyl', rt: 0.12, rb: 0.12, h: 1.4, seg: 10, at: [x, 0, 0.48], color: '#efece4' })),
          { shape: 'box', size: [1.68, 0.1, 1.08], at: [0, 1.3, 0], color: '#efece4' },
        ],
        gateRoof: [
          { shape: 'tri', w: 1.1, h: 0.5, d: 1.7, rotY: 90, color: '#9b4a36' },
          ...[-0.7, 0.7].map((x) => ({ shape: 'cone', r: 0.14, h: 0.6, seg: 10, at: [x, 0, 0.42], color: '#5d7184' })),
          ...crenels(1.6, 0, 0.5, '#efece4', { w: 0.1, gap: 0.1, h: 0.12, t: 0.08 }),
        ],
        wall: [
          { shape: 'box', size: [2.2, 0.9, 0.3], color: '#e6e1d6' },
          ...crenels(2.2, 0.9, 0, '#e6e1d6', { w: 0.18, gap: 0.12, h: 0.2, t: 0.3 }),
          ...[-0.6, 0.3].flatMap((x) => win({ w: 0.05, h: 0.18, at: [x, 0.4, 0.15], top: 'flat', color: '#3a2a22' })),
          ...[0.3, 0.6].map((y) => ({ shape: 'box', size: [2.21, 0.012, 0.31], at: [0, y, 0], color: '#cfc9bc', detail: true })),
        ],
      },
      structure: [
        { part: 'cliff', pos: [0, 0, 0], ry: 0 },
        { part: 'palas', pos: [0.5, 1.2, -0.6], ry: 0 },
        { part: 'palasRoof', pos: [0.5, 3.8, -0.6], ry: 0 },
        { part: 'mainTower', pos: [-1.5, 1.2, 0.3], ry: 0 },
        { part: 'towerCap', pos: [-1.5, 4.8, 0.3], ry: 0 },
        { part: 'turret', pos: [2.15, 1.2, 0.2], ry: 0 },
        { part: 'turret', pos: [-0.6, 1.2, 0.55], ry: 0 },
        { part: 'gatehouse', pos: [1.6, 1.2, 1.1], ry: 0 },
        { part: 'gateRoof', pos: [1.6, 2.6, 1.1], ry: 0 },
        { part: 'wall', pos: [-0.75, 1.2, 1.35], ry: 0 },
      ],
    },

    /* ---------------------------------------------- ÇİN SEDDİ */
    {
      id: 'greatwall', name: 'Çin Seddi', place: 'Mutianyu, Pekin', era: 'MÖ 7. yy – 1644',
      theme: { sky: '#bcd2e4', fog: '#cfdbe2', ground: '#6f8f4f', pad: '#7d8a62' },
      intro: 'Yeşil sırtlardaki üç tepeyi yerleştir, tepelerin üstüne gözetleme kulelerini koy. Kuleleri yükselip alçalan sur parçalarıyla birleştir; ortadaki kuleye köşk çatısını ekle.',
      facts: [
        'İlk duvarlar MÖ 7. yüzyıldan itibaren yapıldı; en çok görülen bölümleri Ming Hanedanı (1368–1644) dönemindendir.',
        'Tüm kolları ve dönemleriyle toplam uzunluğunun 21.000 km\'yi aştığı ölçülmüştür.',
        'Gözetleme kulelerinde ateş ve dumanla haberleşilirdi.',
        '1987\'de UNESCO Dünya Mirası Listesi\'ne alındı; uzaydan çıplak gözle görüldüğü ise bir efsanedir.',
      ],
      parts: {
        moundLow: [{ shape: 'rock', size: [3, 0.6, 2.4], seed: 61, jitter: 0.1, color: '#6f7a55' }],
        moundHigh: [{ shape: 'rock', size: [3, 1.4, 2.4], seed: 62, jitter: 0.12, color: '#677450' }],
        moundMid: [{ shape: 'rock', size: [3, 1.0, 2.4], seed: 63, jitter: 0.12, color: '#6f7a55' }],
        tower: [
          { shape: 'box', size: [1.1, 1.1, 1.1], color: WSTONE2 },
          // Gözetleme kulesi: kemerli ok pencereleri, taş sıraları, mazgallı siper
          ...onFaces([-0.28, 0.28].flatMap((x) => win({ w: 0.16, h: 0.3, at: [x, 0.38, 0.55], top: 'round', color: '#3a3530', frame: '#c2b9a8', fw: 0.03 }))),
          ...[0.25, 0.55, 0.85].map((y) => ({ shape: 'box', size: [1.112, 0.012, 1.112], at: [0, y, 0], color: '#8a8273', detail: true })),
          { shape: 'box', size: [1.16, 0.06, 1.16], at: [0, 1.04, 0], color: WSTONE },
          ...onFaces(crenels(1.1, 1.1, 0.5, WSTONE, { w: 0.16, gap: 0.12, h: 0.18, t: 0.1 })),
        ],
        wallAB: wallSteps(2.5, 0.9, 1.7),
        wallBC: wallSteps(2.5, 1.7, 1.3),
        wallEndL: wallSteps(1.9, 0.5, 0.9),
        wallEndR: wallSteps(1.9, 1.3, 0.5),
        pavilion: [
          { shape: 'box', size: [1.25, 0.08, 1.25], color: WSTONE },
          // Kırmızı ahşap sütunlar, kirişler ve kalkık saçaklı kiremit çatı
          ...onFaces([{ shape: 'cyl', rt: 0.04, rb: 0.045, h: 0.45, seg: 8, at: [0.5, 0.08, 0.5], color: '#8a3b2a' }]),
          ...onFaces([{ shape: 'box', size: [1.04, 0.06, 0.06], at: [0, 0.48, 0.5], color: '#8a3b2a' }]),
          ...onFaces([{ shape: 'box', size: [0.9, 0.04, 0.03], at: [0, 0.42, 0.52], color: '#2e6b4f', detail: true }]),
          ...chineseRoof(1.9, 0.5, 1.9, '#5b4a3c', '#3f342b').map((it) => ({ ...it, at: [(it.at || [0, 0, 0])[0], (it.at || [0, 0, 0])[1] + 0.53, (it.at || [0, 0, 0])[2]] })),
        ],
      },
      structure: [
        { part: 'moundLow', pos: [-3.6, 0, 0], ry: 0 },
        { part: 'moundHigh', pos: [0, 0, 0], ry: 0 },
        { part: 'moundMid', pos: [3.6, 0, 0], ry: 0 },
        { part: 'tower', pos: [-3.6, 0.6, 0], ry: 0 },
        { part: 'tower', pos: [0, 1.4, 0], ry: 0 },
        { part: 'tower', pos: [3.6, 1.0, 0], ry: 0 },
        { part: 'wallAB', pos: [-1.8, 0, 0], ry: 0 },
        { part: 'wallBC', pos: [1.8, 0, 0], ry: 0 },
        { part: 'wallEndL', pos: [-5.1, 0, 0], ry: 0 },
        { part: 'wallEndR', pos: [5.1, 0, 0], ry: 0 },
        { part: 'pavilion', pos: [0, 2.5, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- ANGKOR WAT */
    {
      id: 'angkor', name: 'Angkor Wat', place: 'Siem Reap, Kamboçya', era: '~1113 – 1150',
      theme: { sky: '#b9d3df', fog: '#cfdfd8', ground: '#5f9447', pad: '#8f8a6e' },
      intro: 'Üç kademeli tapınak dağını kur: geniş taban terası ve galerisi, ikinci ve üçüncü teraslar. Tepeye ortadaki büyük lotus kulesini ve dört köşe kulesini, dört yana merdivenleri yerleştir.',
      facts: [
        'Khmer Kralı II. Suryavarman tarafından 12. yüzyılda Vişnu\'ya adanarak yapıldı; zamanla Budist tapınağına dönüştü.',
        'Dünyanın en büyük dinî yapılarından biridir.',
        'Beş kulesi, Hindu ve Budist kozmolojisindeki Meru Dağı\'nın zirvelerini simgeler.',
        'Kamboçya bayrağında yer alır; Angkor 1992\'de UNESCO Dünya Mirası oldu.',
      ],
      parts: {
        terrace1: [
          { shape: 'box', size: [6.4, 0.45, 6.4], color: SAND },
          ...[0.08, 0.36].map((y) => ({ shape: 'box', size: [6.44, 0.05, 6.44], at: [0, y, 0], color: '#7f7258' })),
          ...[0.16, 0.24].map((y) => ({ shape: 'box', size: [6.41, 0.012, 6.41], at: [0, y, 0], color: '#8a7c62', detail: true })),
        ],
        gallery: [
          // Kabartmalı galeriler: sütunlu dış cephe, pencerelerde taş parmaklıklar (baluster)
          ...[[0, 2.95, 0], [0, -2.95, 180], [2.95, 0, 90], [-2.95, 0, -90]].flatMap(([x, z, r]) => {
            const rr = (r * Math.PI) / 180;
            const along = (t, out) => [x + Math.cos(rr) * t + Math.sin(rr) * out, z - Math.sin(rr) * t + Math.cos(rr) * out];
            return [
              { shape: 'box', size: [6.0, 0.4, 0.3], at: [x, 0, z], rotY: r, color: SAND2 },
              { shape: 'box', size: [6.1, 0.08, 0.42], at: [x, 0.4, z], rotY: r, color: '#7f7258' },
              ...Array.from({ length: 13 }, (_, k) => -2.7 + k * 0.45).flatMap((t) => {
                const [px, pz] = along(t, 0.17);
                return [{ shape: 'cyl', rt: 0.035, rb: 0.04, h: 0.4, seg: 8, at: [px, 0, pz], color: '#a89878' }];
              }),
              ...Array.from({ length: 6 }, (_, k) => -2.25 + k * 0.9).flatMap((t) => {
                const [px, pz] = along(t, 0.155);
                return [0, 1, 2, 3].map((q) => ({ shape: 'cyl', rt: 0.012, rb: 0.012, h: 0.18, seg: 6, at: [px + Math.cos(rr) * (q - 1.5) * 0.06, 0.12, pz - Math.sin(rr) * (q - 1.5) * 0.06], color: '#7f7258', detail: true }));
              }),
            ];
          }),
          ...[[2.95, 2.95], [-2.95, 2.95], [2.95, -2.95], [-2.95, -2.95]].flatMap(([x, z]) => lotusTower(0.35, [x, 0, z])),
        ],
        terrace2: [
          { shape: 'box', size: [4.4, 0.6, 4.4], color: SAND2 },
          { shape: 'box', size: [4.44, 0.08, 4.44], at: [0, 0.45, 0], color: '#7f7258' },
          ...onFaces(Array.from({ length: 9 }, (_, k) => ({ shape: 'box', size: [0.36, 0.2, 0.02], at: [-1.8 + k * 0.45, 0.15, 2.2], color: '#8a7c62', detail: true }))), // apsara kabartmaları
        ],
        terrace3: [
          { shape: 'box', size: [3.0, 0.7, 3.0], color: SAND },
          { shape: 'box', size: [3.04, 0.08, 3.04], at: [0, 0.55, 0], color: '#7f7258' },
          ...onFaces([-0.9, 0.9].flatMap((x) => win({ w: 0.22, h: 0.3, at: [x, 0.15, 1.5], top: 'pointed', color: '#4a4033', d: 0.02 }))),
        ],
        towerMain: [{ shape: 'box', size: [1.2, 0.3, 1.2], color: SAND2 }, ...lotusTower(1, [0, 0.3, 0])],
        towerCorner: [{ shape: 'box', size: [0.8, 0.22, 0.8], color: SAND2 }, ...lotusTower(0.65, [0, 0.22, 0])],
        stairs: angkorStairs(),
      },
      structure: [
        { part: 'terrace1', pos: [0, 0, 0], ry: 0 },
        { part: 'gallery', pos: [0, 0.45, 0], ry: 0 },
        { part: 'terrace2', pos: [0, 0.45, 0], ry: 0 },
        { part: 'terrace3', pos: [0, 1.05, 0], ry: 0 },
        { part: 'towerMain', pos: [0, 1.75, 0], ry: 0 },
        ...[[1.1, 1.1], [-1.1, 1.1], [1.1, -1.1], [-1.1, -1.1]].map(([x, z]) => ({ part: 'towerCorner', pos: [x, 1.75, z], ry: 0 })),
        ...[0, 1, 2, 3].map((ry) => ({ part: 'stairs', pos: [0, 0, 0], ry })),
      ],
    },

    /* ---------------------------------------------- HİMEJİ KALESİ */
    {
      id: 'himeji', difficulty: 'Orta', name: 'Himeji Kalesi', place: 'Hyōgo, Japonya', era: '1609',
      theme: { sky: '#bcd6ea', fog: '#d3e0e8', ground: '#7a9a5a', pad: '#b9b0a0' },
      intro: 'Eğimli taş kaideyi kur, ardından beyaz katları ve kanatlı gri çatıları sırayla üst üste diz: kat, çatı, kat, çatı... En üste altın balık süslü çatıyı, iki yana küçük kuleleri yerleştir.',
      facts: [
        'Ana kulesi 1609\'da tamamlandı; Japonya\'nın özgün haliyle günümüze ulaşmış en büyük şatosudur.',
        'Beyaz sıvalı duvarları nedeniyle "Beyaz Balıkçıl Şatosu" (Shirasagi-jō) diye anılır.',
        'Savaş bombardımanlarını ve depremleri büyük hasar görmeden atlattı.',
        '1993\'te Japonya\'nın ilk UNESCO Dünya Mirası alanlarından biri oldu.',
      ],
      parts: {
        stoneBase: [
          { shape: 'lathe', seg: 4, phi0: Math.PI / 4, flat: true, color: '#8f8a80', points: stoneBaseProfile },
          ...[0.25, 0.5, 0.75, 1.0].map((y) => ({ shape: 'cyl', rt: 2.6 - (2.6 - 2.1) * Math.pow(y / 1.2, 0.6) + 0.01, rb: 2.6 - (2.6 - 2.1) * Math.pow(y / 1.2, 0.6) + 0.01, h: 0.012, seg: 4, rotY: 45, at: [0, y, 0], color: '#77736a', detail: true })),
        ],
        floor1: hFloor(2.8, 0.8, 2.2),
        roof1: hRoof(2.05, 1.25, 0.35),
        floor2: hFloor(2.3, 0.7, 1.8),
        roof2: hRoof(1.7, 1.0, 0.35),
        floor3: hFloor(1.8, 0.65, 1.4),
        roof3: hRoof(1.35, 0.8, 0.35),
        floor4: hFloor(1.3, 0.6, 1.0),
        topRoof: [
          { shape: 'lathe', seg: 4, phi0: Math.PI / 4, flat: true, color: HROOF, points: [[1.02, 0], [0.96, 0.05], [0.7, 0.25], [0.4, 0.45], [0.22, 0.55], [0, 0.55]] },
          { shape: 'box', size: [0.75, 0.08, 0.08], at: [0, 0.55, 0], color: '#4f595d' },
          // Mahya uçlarındaki altın şaçihoko (balık-kaplan) heykelleri
          ...[-1, 1].flatMap((sx) => [
            { shape: 'sphere', r: 0.06, scale: [0.8, 1.6, 0.8], at: [sx * 0.33, 0.6, 0], color: GOLD, metal: true },
            { shape: 'cone', r: 0.04, h: 0.1, seg: 5, at: [sx * 0.36, 0.76, 0], rotZ: sx * 30, color: GOLD, metal: true },
          ]),
          { shape: 'tri', w: 0.5, h: 0.3, d: 0.2, at: [0, 0.15, 0.55], color: HROOF },
          { shape: 'tri', w: 0.38, h: 0.2, d: 0.04, at: [0, 0.18, 0.66], color: HWHITE },
        ],
        sideKeep: [
          { shape: 'box', size: [1.2, 1.6, 1.2], color: HWHITE },
          { shape: 'box', size: [1.21, 0.5, 1.21], color: '#8f8a80' },
          ...winRow({ n: 2, span: 0.6, at: [0, 0.85, 0.6], w: 0.13, h: 0.2, top: 'flat', color: DARKW, frame: '#2a2e33', fw: 0.02 }),
          ...winRow({ n: 2, span: 0.6, at: [0.6, 0.85, 0], rotY: 90, w: 0.13, h: 0.2, top: 'flat', color: DARKW }),
          // Ok ve tüfek mazgalları (üçgen, kare, daire)
          ...[-0.35, 0, 0.35].map((x, k) => (k === 1 ? { shape: 'cyl', rt: 0.04, rb: 0.04, h: 0.02, seg: 10, rotX: 90, at: [x, 1.3, 0.6], color: '#2a2e33' } : { shape: 'tri', w: 0.08, h: 0.08, d: 0.02, at: [x, 1.26, 0.6], color: '#2a2e33' })),
          { shape: 'lathe', seg: 4, phi0: Math.PI / 4, flat: true, color: HROOF, at: [0, 1.6, 0], points: [[0.98, 0], [0.92, 0.05], [0.65, 0.25], [0.35, 0.48], [0.25, 0.55], [0, 0.55]] },
          { shape: 'box', size: [0.4, 0.06, 0.06], at: [0, 2.13, 0], color: '#4f595d' },
        ],
      },
      structure: [
        { part: 'stoneBase', pos: [0, 0, 0], ry: 0 },
        { part: 'floor1', pos: [0, 1.2, 0], ry: 0 },
        { part: 'roof1', pos: [0, 2.0, 0], ry: 0 },
        { part: 'floor2', pos: [0, 2.35, 0], ry: 0 },
        { part: 'roof2', pos: [0, 3.05, 0], ry: 0 },
        { part: 'floor3', pos: [0, 3.4, 0], ry: 0 },
        { part: 'roof3', pos: [0, 4.05, 0], ry: 0 },
        { part: 'floor4', pos: [0, 4.4, 0], ry: 0 },
        { part: 'topRoof', pos: [0, 5.0, 0], ry: 0 },
        { part: 'sideKeep', pos: [3.1, 0, 0.8], ry: 0 },
        { part: 'sideKeep', pos: [-3.1, 0, 0.8], ry: 0 },
      ],
    },
  );
})();
