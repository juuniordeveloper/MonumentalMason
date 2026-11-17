/* =========================================================
   ANIT USTASI — Kıtalar (2): Afrika ve Kuzey Amerika
   Ebu Simbel, Djenné Büyük Camii, Lalibela,
   Özgürlük Heykeli, Golden Gate, Empire State
   ========================================================= */

(function () {
  const AU = window.AU;
  const { onFaces, win, winRow, ringWins, crenels, balustrade, cornice, openingPts } = AU.shapes;
  const bar = (a, b, r, color) => ({ shape: 'bar', a, b, r, color, detail: true });
  const GOLD = '#c9a646';

  /* ---------- Ebu Simbel ---------- */
  const ASAND = '#c9a57a', ASAND2 = '#b8956a', ADARK = '#3a2a1e';
  // Oturan II. Ramses heykeli: taht, bacaklar ve ayaklar, dizlerdeki eller, gövde,
  // nemes başlık, yüz, takma sakal ve Yukarı-Aşağı Mısır çift tacı (pşent)
  function colossus(broken) {
    const list = [
      { shape: 'box', size: [0.95, 1.2, 0.9], color: ASAND2 },                       // taht
      ...[0.3, 0.6, 0.9].map((y) => ({ shape: 'box', size: [0.96, 0.02, 0.91], at: [0, y, 0], color: '#a8855c', detail: true })),
      // Bacaklar (iki ayrı baldır), ayaklar ve aralarında aile üyesi küçük heykeller
      ...[-0.19, 0.19].flatMap((x) => [
        { shape: 'box', size: [0.3, 0.9, 0.36], at: [x, 0, 0.62], color: ASAND },
        { shape: 'box', size: [0.3, 0.12, 0.5], at: [x, 0, 0.72], color: '#d6b689' },
        { shape: 'box', size: [0.34, 0.22, 0.62], at: [x, 0.88, 0.52], color: ASAND },   // uyluk
      ]),
      { shape: 'cyl', rt: 0.06, rb: 0.08, h: 0.55, seg: 8, at: [0, 0, 0.85], color: '#d6b689' },
      { shape: 'sphere', r: 0.06, at: [0, 0.55, 0.85], color: '#d6b689' },
    ];
    if (!broken) {
      list.push(
        // Gövde, kollar ve dizlerdeki eller
        { shape: 'lathe', seg: 12, color: ASAND, points: [[0.3, 0], [0.34, 0.3], [0.38, 0.65], [0.36, 0.9], [0.2, 1.0], [0, 1.0]], scale: [1, 1, 0.6], at: [0, 1.1, 0.12] },
        ...[-1, 1].flatMap((sx) => [
          { shape: 'tube', r: 0.08, radial: 8, color: ASAND, pts: [[sx * 0.4, 1.95, 0.12], [sx * 0.42, 1.5, 0.2], [sx * 0.3, 1.15, 0.55], [sx * 0.22, 1.12, 0.78]] },
          { shape: 'box', size: [0.16, 0.06, 0.22], at: [sx * 0.2, 1.1, 0.74], color: '#d6b689' },
        ]),
        // Nemes başlık: yanlara sarkan çizgili kanatlar
        { shape: 'extrude', pts: [[-0.36, 0], [0.36, 0], [0.3, 0.36], [0.22, 0.56], [-0.22, 0.56], [-0.3, 0.36]], d: 0.38, at: [0, 1.9, 0.08], color: '#b58f62' },
        ...[0.1, 0.2, 0.3, 0.4].map((y) => ({ shape: 'box', size: [0.66 - y * 0.4, 0.02, 0.4], at: [0, 1.9 + y, 0.08], color: '#9f7b52', detail: true })),
        // Yüz: alın, burun, gözler, dudak; takma sakal
        { shape: 'sphere', r: 0.17, scale: [1, 1.2, 0.9], at: [0, 2.12, 0.22], color: ASAND },
        { shape: 'box', size: [0.05, 0.1, 0.06], at: [0, 2.28, 0.37], color: '#d6b689' },
        ...[-0.06, 0.06].map((x) => ({ shape: 'box', size: [0.06, 0.02, 0.02], at: [x, 2.38, 0.36], color: '#5a4630', detail: true })),
        { shape: 'box', size: [0.08, 0.15, 0.06], at: [0, 2.0, 0.3], color: '#b58f62' },
        // Çift taç: alt kırmızı taç ve üstte beyaz taç
        { shape: 'cyl', rt: 0.18, rb: 0.2, h: 0.12, seg: 12, at: [0, 2.46, 0.12], color: ASAND2 },
        { shape: 'lathe', seg: 12, color: '#d6b689', points: [[0.12, 0], [0.13, 0.08], [0.1, 0.2], [0.06, 0.26], [0, 0.28]], at: [0, 2.58, 0.12] },
        { shape: 'tube', r: 0.012, radial: 4, color: ASAND2, pts: [[0, 2.5, 0.31], [0.0, 2.56, 0.36], [0, 2.6, 0.33]] }, // ureus
        // Cartuş kabartmaları kolda
        { shape: 'box', size: [0.08, 0.14, 0.02], at: [0.44, 1.7, 0.18], color: '#a8855c', detail: true },
      );
    } else {
      // Depremde kırılan heykel: gövdenin üstü yok, başı ve tacı önde yerde
      list.push(
        { shape: 'rock', size: [0.72, 0.5, 0.45], seed: 72, jitter: 0.06, at: [0, 1.2, 0.1], color: ASAND },
        { shape: 'extrude', pts: [[-0.3, 0], [0.3, 0], [0.24, 0.3], [-0.24, 0.3]], d: 0.34, at: [0.25, 0, 1.15], rotY: 30, color: '#b58f62' },
        { shape: 'sphere', r: 0.15, scale: [1, 1.15, 0.9], at: [0.3, 0.05, 1.32], color: ASAND },
        { shape: 'rock', size: [0.3, 0.25, 0.3], seed: 74, jitter: 0.04, at: [-0.4, 0, 1.25], color: ASAND2 },
      );
    }
    return list;
  }

  /* ---------- Djenné ---------- */
  const MUD = '#b98a5a', MUD2 = '#a87a4c', WOOD = '#6b4a2f';
  // Toron: kerpiç duvardan dışarı taşan palmiye kirişleri (iskele ve sıva bakımı için)
  const toron = (w, h, rows, z) => {
    const out = [];
    for (let r = 0; r < rows; r++) {
      for (let x = -w / 2 + 0.2; x <= w / 2 - 0.19; x += 0.4) {
        out.push({ shape: 'cyl', rt: 0.022, rb: 0.028, h: 0.3, seg: 5, rotX: 90, at: [x + (r % 2) * 0.05, h * ((r + 1) / (rows + 1)), z], color: WOOD });
      }
    }
    return out;
  };
  // Yuvarlak hatlı kerpiç sivri payandalar, tepelerinde devekuşu yumurtası
  const pinnacles = (w, y, z) => {
    const out = [];
    for (let x = -w / 2 + 0.15; x <= w / 2 - 0.14; x += 0.45) {
      out.push({ shape: 'lathe', seg: 8, color: MUD, points: [[0.13, 0], [0.12, 0.15], [0.09, 0.3], [0.05, 0.42], [0, 0.46]], at: [x, y, z] });
      out.push({ shape: 'sphere', r: 0.035, scale: [1, 1.3, 1], at: [x, y + 0.44, z], color: '#f2ece0' });
    }
    return out;
  };
  // Duvar boyunca sıvalı yarım sütun (payanda) dizisi
  const pilasters = (w, h, z) => {
    const out = [];
    for (let x = -w / 2 + 0.15; x <= w / 2 - 0.14; x += 0.45) out.push({ shape: 'cyl', rt: 0.09, rb: 0.12, h, seg: 8, at: [x, 0, z], color: MUD2 });
    return out;
  };

  /* ---------- Lalibela ---------- */
  const LROCK = '#a46b4e', LROCK2 = '#93604a';
  const crossOf = (long, short, h, color, y) => [
    { shape: 'box', size: [long, h, short], at: [0, y || 0, 0], color },
    { shape: 'box', size: [short, h, long], at: [0, y || 0, 0], color },
  ];
  // Aksum tarzı pencere: üstü soğan kemerli, yanında çıkıntılı "maymun başı" kiriş uçları
  const aksumWin = (x, y, z, ry, w, h) => [
    ...win({ w, h, at: [x, y, z], rotY: ry, top: 'ogee', color: '#3a2218', frame: LROCK2, fw: 0.03 }),
  ];

  /* ---------- Özgürlük Heykeli ---------- */
  const COPPER = '#6fa595', COPPER2 = '#5f9585', GRANITE = '#b8b0a2';

  /* ---------- Golden Gate ---------- */
  const GRED = '#c0362c', CONC = '#b0aaa0';
  // Ana kablo: kule tepelerinden ortaya sarkan zincir eğrisi (pürüzsüz boru) ve askı halatları
  function cable() {
    const pts = [];
    for (let x = -5.2; x <= 5.21; x += 0.26) {
      const ax = Math.abs(x);
      const y = ax <= 2.6 ? 1.95 + 3.25 * (ax / 2.6) ** 2 : 5.2 - (ax - 2.6) / 2.6 * 3.4;
      pts.push([x, y]);
    }
    const list = [
      { shape: 'tube', r: 0.045, radial: 8, color: GRED, pts: pts.map(([x, y]) => [x, y - 0.03, 0]), tension: 0.3 },
    ];
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      if (Math.abs(x1) < 2.5 && i % 2 === 0) list.push({ shape: 'box', size: [0.015, Math.max(0.05, y1 - 1.82), 0.015], at: [x1, 1.82, 0], color: '#a8302a' });
      if (Math.abs(x1) > 2.7 && Math.abs(x1) < 4.6 && i % 2 === 0) list.push({ shape: 'box', size: [0.015, Math.max(0.05, y1 - 1.82), 0.015], at: [x1, 1.82, 0], color: '#a8302a' });
    }
    return list;
  }
  // Köprü tabliyesi: yol + altında Warren kafes kirişi + yan korkuluklar
  function deck(len) {
    const list = [
      { shape: 'box', size: [len, 0.08, 1.1], at: [0, 0.14, 0], color: '#5a5f66' },
      ...[-0.18, 0.18].map((z) => ({ shape: 'box', size: [len, 0.005, 0.02], at: [0, 0.22, z], color: '#e8e2c8', detail: true })),
      ...[-0.55, 0.55].flatMap((z) => [
        { shape: 'box', size: [len, 0.04, 0.05], color: GRED, at: [0, 0, z] },
        { shape: 'box', size: [len, 0.04, 0.05], color: GRED, at: [0, 0.18, z] },
        { shape: 'box', size: [len, 0.025, 0.03], color: GRED, at: [0, 0.32, z] },
      ]),
    ];
    const n = Math.round(len / 0.3);
    for (let k = 0; k < n; k++) {
      const x0 = -len / 2 + (k * len) / n, x1 = -len / 2 + ((k + 1) * len) / n;
      for (const z of [-0.55, 0.55]) {
        list.push(bar([x0, k % 2 ? 0.2 : 0.02, z], [x1, k % 2 ? 0.02 : 0.2, z], 0.015, GRED));
        list.push(bar([x0, 0.22, z], [x0, 0.32, z], 0.008, GRED));
      }
    }
    return list;
  }

  /* ---------- Empire State ---------- */
  const ELIME = '#cfc6b6', EDARK = '#4b5563';
  // Dikey pencere şeritleri arasında kireçtaşı paye ve alüminyum kat panelleri
  const winStrips = (w, h, d, step) => {
    const out = [];
    const faces = [[0, d / 2, 0, w], [0, -d / 2, 180, w], [w / 2, 0, 90, d], [-w / 2, 0, -90, d]];
    for (const [fx, fz, ry, len] of faces) {
      const rr = (ry * Math.PI) / 180;
      for (let t = -len / 2 + step / 2; t < len / 2; t += step) {
        const x = fx + Math.cos(rr) * t, z = fz - Math.sin(rr) * t;
        const ox = Math.sin(rr) * 0.01, oz = Math.cos(rr) * 0.01;
        out.push({ shape: 'box', size: [0.07, h * 0.94, 0.02], at: [x + ox, h * 0.03, z + oz], rotY: ry, color: EDARK, glow: true, glowColor: '#ffd77a' });
      }
    }
    // Kat aralarındaki alüminyum (spandrel) paneller
    for (let y = 0.25; y < h - 0.05; y += 0.25) out.push({ shape: 'box', size: [w + 0.04, 0.018, d + 0.04], at: [0, y, 0], color: '#9aa3ab', detail: true });
    return out;
  };

  AU.levelDefs.push(
    /* ---------------------------------------------- EBU SİMBEL */
    {
      id: 'abusimbel', name: 'Ebu Simbel Tapınağı', place: 'Asvan, Mısır', era: 'MÖ ~1264',
      theme: { sky: '#f0d6a8', fog: '#efd7ae', ground: '#d4ad72', pad: '#c79f68' },
      intro: 'Kayalığa oyulmuş tapınağı kur: kaya yüzünü ve terası yerleştir, dört dev oturan Ramses heykelini diz (biri depremde kırılmıştır!), kapıyı, tepedeki babun frizini ve yanındaki Nefertari tapınağını ekle.',
      facts: [
        'Firavun II. Ramses tarafından MÖ 13. yüzyılda Nil kıyısındaki kayalara oyuldu.',
        'Girişteki dört dev oturan Ramses heykeli yaklaşık 20 m yüksekliğindedir.',
        'Asvan Barajı\'nın suları altında kalmasın diye 1964–1968\'de parçalara ayrılarak 65 m daha yükseğe taşındı.',
        'Yılda iki kez güneş ışığı tapınağın en iç odasına ulaşarak heykelleri aydınlatır.',
      ],
      parts: {
        cliff: [
          { shape: 'rock', size: [8, 4.2, 1.6], seed: 71, jitter: 0.14, color: '#c39f72' },
          // Kayaya oyulmuş düz cephe (pilon) ve üst korniş
          { shape: 'box', size: [6.6, 4.1, 0.1], at: [0, 0, 0.78], color: '#ccab7f' },
          { shape: 'box', size: [6.7, 0.12, 0.2], at: [0, 3.95, 0.8], color: '#b8956a' },
          ...Array.from({ length: 6 }, (_, k) => ({ shape: 'box', size: [6.6, 0.015, 0.02], at: [0, 0.6 + k * 0.55, 0.84], color: '#b8956a', detail: true })),
        ],
        terrace: [
          { shape: 'box', size: [6.2, 0.35, 1.6], color: ASAND2 },
          ...Array.from({ length: 12 }, (_, k) => ({ shape: 'box', size: [0.12, 0.2, 0.12], at: [-2.9 + k * 0.53, 0.35, 0.74], color: '#a8855c' })), // falcon statues base
          ...Array.from({ length: 12 }, (_, k) => ({ shape: 'sphere', r: 0.06, scale: [0.8, 1.2, 1], at: [-2.9 + k * 0.53, 0.58, 0.74], color: ASAND })),
        ],
        colossus: colossus(false),
        colossusBroken: colossus(true),
        door: [
          { shape: 'box', size: [0.9, 1.75, 0.06], color: ASAND2 },
          { shape: 'box', size: [0.6, 1.35, 0.07], color: ADARK },
          ...[-0.38, 0.38].map((x) => ({ shape: 'box', size: [0.06, 1.75, 0.08], at: [x, 0, 0.02], color: '#a8855c', detail: true })),
          // Kapı üstünde şahin başlı Ra-Horakhti nişi
          { shape: 'box', size: [0.4, 0.62, 0.1], at: [0, 1.82, 0], color: '#a8855c' },
          { shape: 'lathe', seg: 10, color: ASAND, points: [[0.1, 0], [0.09, 0.3], [0.07, 0.42], [0, 0.44]], at: [0, 1.85, 0.08] },
          { shape: 'sphere', r: 0.06, at: [0, 2.3, 0.08], color: ASAND },
          { shape: 'cyl', rt: 0.07, rb: 0.07, h: 0.02, seg: 12, rotX: 90, at: [0, 2.44, 0.08], color: '#d6b689' }, // güneş kursu
        ],
        frieze: [
          { shape: 'box', size: [6.4, 0.25, 0.6], color: ASAND2 },
          // Doğan güneşi selamlayan babun heykelleri sırası
          ...Array.from({ length: 16 }, (_, i) => -3 + i * 0.4).flatMap((x) => [
            { shape: 'sphere', r: 0.11, scale: [1, 1.3, 0.9], at: [x, 0.25, 0.15], color: ASAND },
            { shape: 'sphere', r: 0.07, at: [x, 0.45, 0.2], color: ASAND },
            { shape: 'box', size: [0.2, 0.04, 0.06], at: [x, 0.36, 0.28], color: '#b58f62', detail: true }, // kalkık kollar
          ]),
          { shape: 'box', size: [6.4, 0.06, 0.04], at: [0, 0.12, 0.31], color: '#a8855c', detail: true },
        ],
        smallTemple: [
          { shape: 'rock', size: [2.6, 2.4, 0.9], seed: 73, jitter: 0.1, color: '#c39f72' },
          // Nefertari tapınağı: eğimli payandalar arasında ayakta duran heykeller
          ...[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].flatMap((x, k) => (k % 2 === 0
            ? [{ shape: 'extrude', pts: [[-0.12, 0], [0.12, 0], [0.08, 1.7], [-0.08, 1.7]], d: 0.22, at: [x, 0.1, 0.5], color: '#bf9b6c' }]
            : [
              { shape: 'lathe', seg: 10, color: ASAND, points: [[0.1, 0], [0.11, 0.6], [0.09, 1.1], [0.06, 1.25], [0, 1.3]], at: [x, 0.1, 0.52] },
              { shape: 'sphere', r: 0.07, at: [x, 1.42, 0.52], color: ASAND },
              { shape: 'cyl', rt: 0.03, rb: 0.06, h: 0.16, seg: 8, at: [x, 1.5, 0.52], color: '#d6b689' },
            ])),
          { shape: 'box', size: [0.3, 0.9, 0.05], at: [0, 0, 0.47], color: ADARK },
          { shape: 'box', size: [2.2, 0.12, 0.12], at: [0, 1.82, 0.5], color: '#b8956a' },
        ],
      },
      structure: [
        { part: 'cliff', pos: [0, 0, -1.2], ry: 0 },
        { part: 'terrace', pos: [0, 0, 0.6], ry: 0 },
        { part: 'colossus', pos: [-2.25, 0.35, 0.45], ry: 0 },
        { part: 'colossusBroken', pos: [-0.75, 0.35, 0.45], ry: 0 },
        { part: 'colossus', pos: [0.75, 0.35, 0.45], ry: 0 },
        { part: 'colossus', pos: [2.25, 0.35, 0.45], ry: 0 },
        { part: 'door', pos: [0, 0, -0.36], ry: 0 },
        { part: 'frieze', pos: [0, 4.2, -1.2], ry: 0 },
        { part: 'smallTemple', pos: [4.6, 0, -0.6], ry: 0 },
      ],
    },

    /* ---------------------------------------------- DJENNÉ */
    {
      id: 'djenne', name: 'Djenné Büyük Camii', place: 'Djenné, Mali', era: '1907',
      theme: { sky: '#e9d3ac', fog: '#ead8b8', ground: '#c99f6b', pad: '#b98f62' },
      intro: 'Dünyanın en büyük kerpiç yapısını kur: yüksek kaideyi, ibadet salonunu, kıble duvarındaki üç kuleyi, avlu duvarlarını ve kapı kulesini yerleştir. Duvarlardan çıkan ahşap çubuklar (toron) iskele görevi görür.',
      facts: [
        'Dünyanın en büyük kerpiç yapısıdır; bugünkü cami 1907\'de inşa edildi.',
        'Duvarlardan çıkan hurma ağacı kirişleri (toron) hem süs hem de bakım için iskele görevi görür.',
        'Her yıl bütün kasabanın katıldığı bir şenlikte duvarlar yeni çamur sıvayla yenilenir.',
        'Djenné\'nin eski kenti 1988\'de UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        platform: [
          { shape: 'box', size: [6.4, 0.6, 5.0], color: MUD2 },
          { shape: 'box', size: [1.4, 0.3, 0.6], at: [0, 0, 2.75], color: MUD2 },
          // Platform kenarındaki yuvarlatılmış kerpiç korkuluk ve merdiven basamakları
          ...[0.1, 0.2].map((y, k) => ({ shape: 'box', size: [1.4, 0.02, 0.6 - k * 0.2], at: [0, y + 0.08, 2.75 + k * 0.1], color: '#94693f', detail: true })),
          ...[[0, 2.5, 6.4, 0], [0, -2.5, 6.4, 0], [3.2, 0, 5.0, 90], [-3.2, 0, 5.0, 90]].map(([x, z, len, r]) => ({ shape: 'box', size: [len, 0.12, 0.12], at: [x, 0.6, z], rotY: r, color: MUD })),
        ],
        hall: [
          { shape: 'box', size: [5.6, 1.4, 2.6], color: MUD },
          ...pilasters(5.6, 1.4, 1.32),
          ...toron(5.6, 1.4, 3, 1.38),
          ...pinnacles(5.6, 1.4, 1.32),
          // Sıva yüzeyindeki el izi dokusu: düzensiz yumuşak tümsekler
          ...Array.from({ length: 10 }, (_, k) => ({ shape: 'sphere', r: 0.1, seg: 6, rings: 4, scale: [1.5, 0.6, 0.3], at: [-2.5 + ((k * 37) % 50) / 10, 0.2 + ((k * 13) % 10) / 10, 1.3], color: '#c39566', detail: true })),
          { shape: 'box', size: [5.66, 0.08, 2.66], at: [0, 1.32, 0], color: MUD2 },
        ],
        minaret: [
          { shape: 'cyl', rb: 0.55, rt: 0.36, h: 3.0, seg: 4, rotY: 45, color: MUD },
          // Dikey kaburgalar (payandalar), sıra sıra toron kirişleri ve yumurtalı tepe
          ...onFaces([-0.2, 0.2].map((x) => ({ shape: 'extrude', pts: [[-0.05, 0], [0.05, 0], [0.04, 3.0], [-0.04, 3.0]], d: 0.12, at: [x * 0.8, 0, 0.36], rotX: -3.8, color: MUD2 }))),
          ...onFaces([0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8].map((y) => ({ shape: 'cyl', rt: 0.022, rb: 0.028, h: 0.28, seg: 5, rotX: 90, at: [0, y, 0.37 - y * 0.05], color: WOOD }))),
          { shape: 'lathe', seg: 8, color: MUD2, points: [[0.3, 0], [0.28, 0.15], [0.2, 0.32], [0.1, 0.46], [0, 0.5]], at: [0, 3.0, 0] },
          { shape: 'sphere', r: 0.08, scale: [1, 1.3, 1], at: [0, 3.45, 0], color: '#f2ece0' },
          ...onFaces([{ shape: 'sphere', r: 0.04, scale: [1, 1.3, 1], at: [0.3, 3.02, 0.3], color: '#f2ece0' }]),
        ],
        courtWall: [
          { shape: 'box', size: [0.3, 1.0, 2.0], color: MUD },
          ...[-0.8, -0.35, 0.1, 0.55].flatMap((z) => [
            { shape: 'lathe', seg: 8, color: MUD, points: [[0.11, 0], [0.1, 0.12], [0.07, 0.26], [0.03, 0.34], [0, 0.36]], at: [0, 1.0, z] },
            { shape: 'cyl', rt: 0.02, rb: 0.024, h: 0.24, seg: 5, rotZ: 90, at: [0.12, 0.6, z], color: WOOD },
          ]),
        ],
        frontHalf: [
          { shape: 'box', size: [2.3, 0.9, 0.3], color: MUD },
          ...pilasters(2.3, 0.9, 0.16),
          ...pinnacles(2.3, 0.9, 0),
          ...toron(2.3, 0.9, 1, 0.24),
        ],
        gate: [
          { shape: 'box', size: [1.4, 1.7, 0.6], color: MUD2 },
          ...win({ w: 0.46, h: 0.85, at: [0, 0, 0.3], top: 'flat', color: '#3a2618', frame: '#94693f', fw: 0.05 }),
          ...win({ w: 0.12, h: 0.18, at: [0, 1.15, 0.3], top: 'flat', color: '#3a2618' }),
          ...pilasters(1.4, 1.7, 0.32),
          ...pinnacles(1.4, 1.7, 0.1),
          ...toron(1.4, 1.7, 3, 0.44),
        ],
      },
      structure: [
        { part: 'platform', pos: [0, 0, 0], ry: 0 },
        { part: 'hall', pos: [0, 0.6, -0.9], ry: 0 },
        { part: 'minaret', pos: [-1.8, 0.6, -2.35], ry: 0 },
        { part: 'minaret', pos: [0, 0.6, -2.35], ry: 0 },
        { part: 'minaret', pos: [1.8, 0.6, -2.35], ry: 0 },
        { part: 'courtWall', pos: [-2.9, 0.6, 1.4], ry: 0 },
        { part: 'courtWall', pos: [2.9, 0.6, 1.4], ry: 0 },
        { part: 'frontHalf', pos: [-1.85, 0.6, 2.35], ry: 0 },
        { part: 'frontHalf', pos: [1.85, 0.6, 2.35], ry: 0 },
        { part: 'gate', pos: [0, 0.6, 2.25], ry: 0 },
      ],
    },

    /* ---------------------------------------------- LALİBELA */
    {
      id: 'lalibela', name: 'Lalibela — Aziz George Kilisesi', place: 'Amhara, Etiyopya', era: '12. – 13. yy',
      theme: { sky: '#c9dbe6', fog: '#d9dfdc', ground: '#9a7a5a', pad: '#8f6a50' },
      intro: 'Kayaya yukarıdan aşağı oyulmuş haç planlı kiliseyi kur: çukurun dört kaya duvarını, giriş hendeğini, basamaklı haç kaideyi, kilise gövdesini ve çatıdaki iç içe haç kabartmasını yerleştir.',
      facts: [
        'Kral Lalibela döneminde (12.–13. yüzyıl) yekpare volkanik kayaya yukarıdan aşağıya oyuldu.',
        'Haç planlı Aziz George Kilisesi, Lalibela\'nın 11 kaya kilisesinin en ünlüsüdür.',
        'Kilise yaklaşık 12 m derinliğinde bir çukurun içinde durur.',
        '1978\'de UNESCO Dünya Mirası Listesi\'ne giren ilk alanlar arasındadır ve hâlâ bir hac yeridir.',
      ],
      parts: {
        pitWall: [
          { shape: 'rock', size: [6.4, 1.8, 0.8], seed: 81, jitter: 0.12, color: LROCK2 },
          // Kayadaki oyma izleri ve keşiş hücreleri (küçük mağara ağızları)
          ...Array.from({ length: 6 }, (_, k) => ({ shape: 'box', size: [6.3, 0.015, 0.02], at: [0, 0.25 + k * 0.27, 0.41], color: '#7d4f3c', detail: true })),
          ...[-2.0, 1.4].flatMap((x) => win({ w: 0.24, h: 0.32, at: [x, 0.4, 0.4], top: 'round', color: '#2a1810', d: 0.03 })),
          ...[-2.6, -0.5, 1.9].map((x, k) => ({ shape: 'sphere', r: 0.16, seg: 6, rings: 4, scale: [1.5, 0.6, 1], at: [x, 1.78, (k % 2 ? 0.2 : -0.2)], color: '#6f7d45' })),
        ],
        trench: [
          { shape: 'rock', size: [1.0, 1.8, 2.4], seed: 82, jitter: 0.1, color: LROCK2 },
          ...[0, 1, 2, 3].map((i) => ({ shape: 'box', size: [0.7, 0.35 * (i + 1), 0.3], at: [-0.85, 0, 0.9 - i * 0.3], color: LROCK })),
          ...[0, 1, 2, 3].map((i) => ({ shape: 'box', size: [0.72, 0.02, 0.3], at: [-0.85, 0.35 * (i + 1), 0.9 - i * 0.3], color: '#7d4f3c', detail: true })),
          ...win({ w: 0.36, h: 0.7, at: [-0.5, 0, -0.6], rotY: -90, top: 'round', color: '#2a1810', d: 0.03 }), // tünel ağzı
        ],
        plinth: [
          ...crossOf(3.4, 1.3, 0.25, LROCK2), ...crossOf(3.1, 1.15, 0.2, LROCK, 0.25),
          ...crossOf(3.42, 1.32, 0.02, '#7d4f3c', 0.12).map((it) => ({ ...it, detail: true })),
        ],
        church: [
          ...crossOf(2.8, 1.0, 1.9, LROCK),
          // Alt sıra kör pencereler, üst sıra Aksum tarzı soğan kemerli pencereler
          ...onFaces([
            ...aksumWin(0, 1.12, 1.4, 0, 0.18, 0.42),
            ...win({ w: 0.2, h: 0.52, at: [0, 0, 1.4], top: 'round', color: '#3a2218', frame: LROCK2, fw: 0.04 }), // kapı
            ...[-0.32, 0.32].flatMap((x) => win({ w: 0.12, h: 0.24, at: [x, 0.45, 0.5], top: 'flat', color: '#4a2c20', d: 0.02 })),
            ...[-0.32, 0.32].flatMap((x) => aksumWin(x, 1.0, 0.5, 0, 0.12, 0.3)),
          ]),
          // Yatay silmeler (Aksum duvar katmanları)
          ...[0.72, 1.55].flatMap((y) => crossOf(2.84, 1.04, 0.04, LROCK2, y)),
          ...crossOf(2.82, 1.02, 0.08, LROCK2, 1.82),
        ],
        roofRelief: [
          ...crossOf(2.4, 0.5, 0.06, LROCK2),
          ...crossOf(1.6, 0.3, 0.06, '#b07a5c', 0.06),
          ...crossOf(0.9, 0.14, 0.06, LROCK2, 0.12),
          // Çatı kenarındaki yağmur oluğu çıkıntıları
          ...onFaces([{ shape: 'box', size: [0.08, 0.05, 0.16], at: [0.35, 0, 1.45], color: LROCK2 }]),
        ],
      },
      structure: [
        { part: 'pitWall', pos: [0, 0, -2.6], ry: 0 },
        { part: 'pitWall', pos: [0, 0, 2.6], ry: 0 },
        { part: 'pitWall', pos: [-2.6, 0, 0], ry: 1 },
        { part: 'pitWall', pos: [2.6, 0, 0], ry: 1 },
        { part: 'trench', pos: [3.9, 0, 2.4], ry: 0 },
        { part: 'plinth', pos: [0, 0, 0], ry: 0 },
        { part: 'church', pos: [0, 0.45, 0], ry: 0 },
        { part: 'roofRelief', pos: [0, 2.35, 0], ry: 0 },
      ],
    },

    /* ---------------------------------------------- ÖZGÜRLÜK HEYKELİ */
    {
      id: 'liberty', name: 'Özgürlük Heykeli', place: 'New York, ABD', era: '1886',
      theme: { sky: '#b3cde2', fog: '#c8d8e3', ground: '#6f8f5a', pad: '#9c9688' },
      intro: 'Yıldız biçimli kale tabanını ve granit kaideyi kur. Heykeli aşağıdan yukarı yerleştir: etek, gövde, baş ve yedi ışınlı taç; ardından meşaleyi tutan kolu, meşaleyi ve yazıtlı tableti ekle.',
      facts: [
        'Fransa\'nın ABD\'ye hediyesidir; heykeltıraşı Frédéric Auguste Bartholdi\'dir.',
        'İç demir iskeletini Gustave Eiffel\'in şirketi tasarladı.',
        'Bakır kaplaması zamanla oksitlenerek bugünkü yeşil rengini aldı.',
        '1886\'da açıldı; 1984\'te UNESCO Dünya Mirası Listesi\'ne alındı.',
      ],
      parts: {
        fort: [
          { shape: 'cyl', rt: 2.4, rb: 2.5, h: 0.6, seg: 11, color: '#9c9688' },
          // Fort Wood'un 11 köşeli yıldız burçları, taş sıraları ve siper
          ...Array.from({ length: 11 }, (_, i) => {
            const a = (i / 11) * 360;
            const r = (a * Math.PI) / 180;
            return { shape: 'cone', r: 0.55, h: 0.6, seg: 3, rotY: a, at: [Math.sin(r) * 2.35, 0, Math.cos(r) * 2.35], color: '#8f897b' };
          }),
          ...[0.2, 0.4].map((y) => ({ shape: 'torus', r: 2.45, tube: 0.012, radial: 3, seg: 11, rotX: 90, at: [0, y, 0], color: '#7f796d', detail: true })),
          { shape: 'cyl', rt: 2.42, rb: 2.42, h: 0.06, seg: 11, at: [0, 0.56, 0], color: '#aaa496' },
          ...[0, 1, 2].map((k) => ({ shape: 'box', size: [0.5, 0.35, 0.04], at: [Math.sin(k * 2.1) * 2.47, 0, Math.cos(k * 2.1) * 2.47], rotY: (k * 2.1 * 180) / Math.PI, color: '#5a554c' })),
        ],
        pedestalBase: [
          { shape: 'box', size: [1.6, 0.9, 1.6], color: GRANITE },
          // Hunt kaidesi: kesme granit, kemerli girişler, kalkan medalyonları
          ...onFaces([
            ...win({ w: 0.42, h: 0.62, at: [0, 0.05, 0.8], top: 'round', color: '#5a554c', frame: '#a59d90', fw: 0.05 }),
            { shape: 'box', size: [1.62, 0.04, 0.04], at: [0, 0.8, 0.8], color: '#a59d90' },
          ]),
          ...[0.2, 0.45].map((y) => ({ shape: 'box', size: [1.61, 0.012, 1.61], at: [0, y, 0], color: '#a39b8e', detail: true })),
        ],
        pedestalTop: [
          { shape: 'cyl', rb: 1.0, rt: 0.85, h: 1.1, seg: 4, rotY: 45, color: GRANITE },
          { shape: 'cyl', rb: 0.95, rt: 0.95, h: 0.1, seg: 4, rotY: 45, at: [0, 0.75, 0], color: '#a59d90' },
          // Her yüzde sütunlu loca (balkon) ve kalkan dizisi
          ...onFaces([
            ...[-0.18, 0.18].map((x) => ({ shape: 'cyl', rt: 0.035, rb: 0.035, h: 0.32, seg: 8, at: [x, 0.38, 0.62], color: '#d4cdbf' })),
            ...win({ w: 0.28, h: 0.32, at: [0, 0.38, 0.6], top: 'flat', color: '#5a554c' }),
            { shape: 'box', size: [0.5, 0.05, 0.12], at: [0, 0.36, 0.62], color: '#a59d90' },
            ...[-0.3, -0.1, 0.1, 0.3].map((x) => ({ shape: 'cyl', rt: 0.045, rb: 0.045, h: 0.02, seg: 10, rotX: 90, at: [x, 0.92, 0.48], color: '#a59d90', detail: true })),
          ]),
          { shape: 'box', size: [1.25, 0.08, 1.25], at: [0, 1.04, 0], color: '#a59d90' },
        ],
        robeLower: [
          // Dökümlü bakır elbise: düzensiz kıvrımlar (dikey kıvrım çizgileri) ve öne çıkan sol ayak
          { shape: 'lathe', seg: 20, color: COPPER, points: [[0, 0], [0.5, 0], [0.48, 0.6], [0.42, 1.2], [0.38, 1.4], [0, 1.4]] },
          ...Array.from({ length: 14 }, (_, k) => (k / 14) * Math.PI * 2 + 0.2).map((a, k) => ({ shape: 'tube', r: 0.035 + (k % 3) * 0.01, radial: 5, color: k % 2 ? COPPER2 : COPPER, pts: [[Math.sin(a) * 0.5, 0.02, Math.cos(a) * 0.5], [Math.sin(a + 0.1) * 0.46, 0.6, Math.cos(a + 0.1) * 0.46], [Math.sin(a + 0.15) * 0.4, 1.2, Math.cos(a + 0.15) * 0.4], [Math.sin(a + 0.15) * 0.37, 1.38, Math.cos(a + 0.15) * 0.37]] })),
          { shape: 'sphere', r: 0.1, scale: [0.8, 0.5, 1.4], at: [-0.12, 0, 0.48], color: COPPER2 },
          // Kırık zincir (ayağın dibinde)
          ...[0, 1, 2].map((k) => ({ shape: 'torus', r: 0.05, tube: 0.012, radial: 4, seg: 8, rotY: k * 50, at: [0.2 + k * 0.08, 0.03, 0.46], color: COPPER2, detail: true })),
        ],
        robeUpper: [
          { shape: 'lathe', seg: 20, color: COPPER, points: [[0, 0], [0.38, 0], [0.36, 0.5], [0.3, 0.9], [0.16, 1.0], [0, 1.0]] },
          // Omuzdan çapraz inen pelerin (toga) kıvrımları
          ...Array.from({ length: 8 }, (_, k) => -0.3 + k * 0.08).map((x, k) => ({ shape: 'tube', r: 0.03, radial: 5, color: k % 2 ? COPPER2 : COPPER, pts: [[x - 0.05, 0.05, 0.34], [x + 0.05, 0.45, 0.33], [x + 0.18, 0.85, 0.2]] })),
          { shape: 'tube', r: 0.06, radial: 6, color: COPPER2, pts: [[-0.36, 0.1, 0.0], [-0.2, 0.5, 0.25], [0.1, 0.9, 0.18]] },
        ],
        head: [
          { shape: 'sphere', r: 0.17, scale: [1, 1.12, 1], color: COPPER2 },
          // Klasik yüz: burun, kaşlar, dalgalı saçlar, boyun
          { shape: 'box', size: [0.05, 0.1, 0.05], at: [0, 0.14, 0.17], color: COPPER },
          ...[-0.06, 0.06].map((x) => ({ shape: 'box', size: [0.06, 0.015, 0.02], at: [x, 0.24, 0.16], color: '#4f8577', detail: true })),
          ...[-1, 1].map((sx) => ({ shape: 'sphere', r: 0.09, scale: [0.8, 1.2, 1], at: [sx * 0.13, 0.08, -0.04], color: COPPER })),
          { shape: 'cyl', rt: 0.09, rb: 0.11, h: 0.12, seg: 12, at: [0, -0.1, -0.01], color: COPPER },
        ],
        crown: [
          { shape: 'torus', r: 0.17, tube: 0.035, rotX: 90, color: COPPER2 },
          ...Array.from({ length: 25 }, (_, k) => (k / 25) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.02, 0.04, 0.02], at: [Math.sin(a) * 0.175, 0.01, Math.cos(a) * 0.175], color: '#bfe0f0', glow: true, glowColor: '#ffe6a0', detail: true })), // 25 pencere
          // Yedi ışın: yedi kıta ve yedi deniz
          ...Array.from({ length: 7 }, (_, i) => {
            const a = ((-60 + i * 20) * Math.PI) / 180;
            return { shape: 'cone', r: 0.028, h: 0.32, seg: 4, rotX: 72, rotY: (a * 180) / Math.PI, at: [Math.sin(a) * 0.17, 0.03, Math.cos(a) * 0.17], color: COPPER };
          }),
        ],
        arm: [
          // Yukarı kalkmış sağ kol: omuz, kol ve el
          { shape: 'sphere', r: 0.14, at: [-0.3, 0, 0], color: COPPER2 },
          { shape: 'tube', r: 0.075, radial: 8, color: COPPER, pts: [[-0.3, 0.05, 0], [-0.36, 0.5, 0], [-0.42, 0.95, 0], [-0.46, 1.18, 0]] },
          { shape: 'tube', r: 0.05, radial: 6, color: COPPER2, pts: [[-0.3, 0.1, 0.09], [-0.36, 0.55, 0.08], [-0.41, 0.9, 0.06]] }, // kol kıvrımı
          { shape: 'sphere', r: 0.07, scale: [1, 1.3, 1], at: [-0.47, 1.12, 0], color: COPPER2 },
        ],
        torch: [
          { shape: 'cyl', rt: 0.07, rb: 0.05, h: 0.25, seg: 10, color: COPPER2 },
          { shape: 'cyl', rt: 0.12, rb: 0.1, h: 0.05, seg: 12, at: [0, 0.25, 0], color: GOLD, metal: true },
          ...Array.from({ length: 16 }, (_, k) => (k / 16) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.01, 0.05, 0.01], at: [Math.sin(a) * 0.12, 0.3, Math.cos(a) * 0.12], color: GOLD, metal: true, detail: true })),
          { shape: 'lathe', seg: 12, color: '#e8b84a', metal: true, glow: true, glowColor: '#ffd27a', points: [[0.09, 0], [0.1, 0.06], [0.07, 0.14], [0.08, 0.18], [0.04, 0.24], [0, 0.28]], at: [0, 0.3, 0] },
        ],
        tablet: [
          { shape: 'box', size: [0.32, 0.42, 0.08], rotZ: -18, color: COPPER2 },
          // "JULY IV MDCCLXXVI" yazısı izlenimi
          ...[0.12, 0.2, 0.28].map((y) => ({ shape: 'box', size: [0.18, 0.02, 0.01], at: [0.04 - y * 0.32, y, 0.045], rotZ: -18, color: '#4f8577', detail: true })),
        ],
      },
      structure: [
        { part: 'fort', pos: [0, 0, 0], ry: 0 },
        { part: 'pedestalBase', pos: [0, 0.6, 0], ry: 0 },
        { part: 'pedestalTop', pos: [0, 1.5, 0], ry: 0 },
        { part: 'robeLower', pos: [0, 2.6, 0], ry: 0 },
        { part: 'robeUpper', pos: [0, 4.0, 0], ry: 0 },
        { part: 'head', pos: [0, 5.0, 0.02], ry: 0 },
        { part: 'crown', pos: [0, 5.25, 0.02], ry: 0 },
        { part: 'arm', pos: [0, 4.75, 0], ry: 0 },
        { part: 'torch', pos: [-0.47, 5.94, 0], ry: 0 },
        { part: 'tablet', pos: [0.3, 4.6, 0.12], ry: 0 },
      ],
    },

    /* ---------------------------------------------- GOLDEN GATE */
    {
      id: 'goldengate', difficulty: 'Orta', name: 'Golden Gate Köprüsü', place: 'San Francisco, ABD', era: '1933 – 1937',
      theme: { sky: '#bcd2e3', fog: '#d6dfe5', ground: '#6f8a5a', pad: '#4f86a6' },
      intro: 'İki kıyıdaki beton ankrajları ve denizdeki iki dev kuleyi kur. Önce yan açıklıkları ve ortadaki tabliyeyi, en son kuleleri birbirine bağlayan iki ana kabloyu yerleştir.',
      facts: [
        '1937\'de açıldığında dünyanın en uzun asma köprü açıklığına (1.280 m) sahipti.',
        'Rengi "Uluslararası Turuncu"dur; sisli havada görünür olsun diye seçildi.',
        'Kuleleri deniz seviyesinden yaklaşık 227 m yüksekliğe ulaşır.',
        'Baş mühendisi Joseph Strauss\'tur.',
      ],
      parts: {
        tower: [
          { shape: 'box', size: [0.9, 0.6, 1.9], color: CONC },
          { shape: 'box', size: [0.95, 0.06, 1.95], at: [0, 0.54, 0], color: '#9a948a' },
          // Art Deco kule ayakları: yukarı doğru kademeli daralan, dikey yivli paneller
          ...[-0.65, 0.65].flatMap((z) => [
            { shape: 'box', size: [0.35, 2.0, 0.35], at: [0, 0.6, z], color: GRED },
            { shape: 'box', size: [0.31, 1.4, 0.31], at: [0, 2.6, z], color: GRED },
            { shape: 'box', size: [0.27, 1.2, 0.27], at: [0, 4.0, z], color: GRED },
            ...[-0.08, 0, 0.08].map((dx) => ({ shape: 'box', size: [0.03, 3.9, 0.02], at: [dx, 0.8, z + 0.18], color: '#a82f26', detail: true })),
            { shape: 'box', size: [0.29, 0.08, 0.29], at: [0, 5.2, z], color: '#a82f26' },
            { shape: 'box', size: [0.2, 0.1, 0.2], at: [0, 5.28, z], color: GRED },
          ]),
          // Portal kirişleri: içi kademeli girintili kemer açıklıkları
          ...[2.6, 3.7, 4.8].flatMap((y, k) => [
            { shape: 'box', size: [0.3, 0.25 + (k === 0 ? 0.15 : 0), 1.6], at: [0, y - (k === 0 ? 0.15 : 0), 0], color: GRED },
            ...[0.16, -0.16].map((x) => ({ shape: 'extrude', pts: openingPts(1.0, 0.6, 'flat'), d: 0.02, at: [x, y - 0.65, 0], rotY: 90, color: '#9e2b22', detail: true })),
          ]),
        ],
        anchorage: [
          { shape: 'box', size: [1.2, 1.6, 1.4], color: CONC },
          { shape: 'box', size: [1.24, 0.1, 1.44], at: [0, 1.0, 0], color: '#9a948a' },
          // Art Deco beton bloğu: dikey nervürler ve kablo bağlantı payesi
          ...onFaces([-0.4, -0.2, 0, 0.2, 0.4].map((x) => ({ shape: 'box', size: [0.05, 0.9, 0.03], at: [x, 0.1, 0.7], color: '#a49e93', detail: true }))),
          { shape: 'box', size: [0.4, 0.45, 1.5], at: [0, 1.1, 0], color: '#a8a296' },
        ],
        deckCenter: [...deck(5.6)],
        deckSide: [...deck(2.2)],
        cable: cable(),
      },
      structure: [
        { part: 'tower', pos: [-2.6, 0, 0], ry: 0 },
        { part: 'tower', pos: [2.6, 0, 0], ry: 0 },
        { part: 'anchorage', pos: [-4.6, 0, 0], ry: 0 },
        { part: 'anchorage', pos: [4.6, 0, 0], ry: 0 },
        { part: 'deckCenter', pos: [0, 1.6, 0], ry: 0, after: ['cable'] },
        { part: 'deckSide', pos: [-4.3, 1.6, 0], ry: 0 },
        { part: 'deckSide', pos: [4.3, 1.6, 0], ry: 0 },
        { part: 'cable', pos: [0, 0, 0.6], ry: 0, after: ['tower', 'anchorage'] },
        { part: 'cable', pos: [0, 0, -0.6], ry: 0, after: ['tower', 'anchorage'] },
      ],
    },

    /* ---------------------------------------------- EMPIRE STATE */
    {
      id: 'empirestate', name: 'Empire State Binası', place: 'New York, ABD', era: '1930 – 1931',
      theme: { sky: '#b6c8d8', fog: '#c9d4dd', ground: '#7d7d7d', pad: '#9a958c' },
      intro: 'Art Deco gökdeleni kademe kademe yükselt: alçak taban, yüksek ana gövde ve iki yan kanat, iki geri çekilme katı, ışıklı taç, gözlem direği ve en tepede anten.',
      facts: [
        '1930–1931 arasında yalnızca yaklaşık 14 ayda inşa edildi.',
        '102 katlıdır; 1970\'e kadar dünyanın en yüksek binasıydı.',
        'Art Deco üslubunun simgelerindendir; tepesindeki ışıklar özel günlerde renk değiştirir.',
        'Anteniyle birlikte yaklaşık 443 m yüksekliğindedir.',
      ],
      parts: {
        podium: [
          { shape: 'box', size: [4, 1.0, 3], color: ELIME },
          ...winStrips(4, 1.0, 3, 0.3),
          // Beşinci Cadde girişi: yüksek giriş kemeri, bronz kapılar ve markiz
          { shape: 'box', size: [0.8, 0.85, 0.06], at: [0, 0, 1.52], color: '#bfb7a6' },
          { shape: 'box', size: [0.5, 0.5, 0.06], at: [0, 0, 1.55], color: '#5b4a2f' },
          { shape: 'box', size: [0.9, 0.05, 0.2], at: [0, 0.55, 1.6], color: '#c9a646', metal: true },
          { shape: 'box', size: [4.04, 0.08, 3.04], at: [0, 0.94, 0], color: '#e0d8c8' },
        ],
        shaft: [
          { shape: 'box', size: [2.6, 4.2, 2.0], color: ELIME },
          ...winStrips(2.6, 4.2, 2.0, 0.24),
          // Köşe pahları ve üstteki Art Deco silme
          ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sz]) => ({ shape: 'box', size: [0.1, 4.2, 0.1], at: [sx * 1.27, 0, sz * 0.97], color: '#d9d0c0' })),
          { shape: 'box', size: [2.64, 0.06, 2.04], at: [0, 4.14, 0], color: '#e0d8c8' },
        ],
        wing: [
          { shape: 'box', size: [0.6, 3.2, 1.6], color: '#c6bdac' },
          ...winStrips(0.6, 3.2, 1.6, 0.24),
          { shape: 'box', size: [0.64, 0.05, 1.64], at: [0, 3.15, 0], color: '#e0d8c8' },
        ],
        setbackA: [
          { shape: 'box', size: [2.0, 0.8, 1.6], color: ELIME },
          ...winStrips(2.0, 0.8, 1.6, 0.24),
          { shape: 'box', size: [2.04, 0.05, 1.64], at: [0, 0.75, 0], color: '#e0d8c8' },
        ],
        setbackB: [
          { shape: 'box', size: [1.4, 0.6, 1.1], color: ELIME },
          ...winStrips(1.4, 0.6, 1.1, 0.24),
          { shape: 'box', size: [1.44, 0.05, 1.14], at: [0, 0.55, 0], color: '#e0d8c8' },
        ],
        crown: [
          // Işıklı Art Deco taç: kademeli basamaklar ve dikey kanatçıklar
          { shape: 'box', size: [0.9, 0.7, 0.9], color: '#e6dfcf' },
          ...[0.15, 0.4].map((y) => ({ shape: 'box', size: [0.94, 0.1, 0.94], at: [0, y, 0], color: '#f5e6b0', glow: true, glowColor: '#ffe08a' })),
          ...onFaces([-0.3, -0.15, 0, 0.15, 0.3].map((x) => ({ shape: 'box', size: [0.04, 0.7 - Math.abs(x) * 0.6, 0.06], at: [x, 0, 0.47], color: '#d9d2c2' }))),
          { shape: 'box', size: [0.7, 0.06, 0.7], at: [0, 0.66, 0], color: '#d9d2c2' },
        ],
        mast: [
          // Zeplin direği: alüminyum kaburgalı silindir, 102. kat gözlem odası
          { shape: 'cyl', rt: 0.22, rb: 0.38, h: 0.9, seg: 8, color: '#d9d2c2' },
          ...Array.from({ length: 8 }, (_, k) => (k / 8) * Math.PI * 2 + Math.PI / 8).map((a) => ({ shape: 'bar', a: [Math.sin(a) * 0.38, 0, Math.cos(a) * 0.38], b: [Math.sin(a) * 0.22, 0.9, Math.cos(a) * 0.22], r: 0.02, color: '#bfbfbf', metal: true })),
          { shape: 'cyl', rt: 0.3, rb: 0.3, h: 0.08, seg: 8, at: [0, 0.35, 0], color: '#f5e6b0', glow: true },
          ...ringWins(8, 0.27, 0.55, { w: 0.07, h: 0.14, top: 'flat', color: EDARK, glow: true, glowColor: '#ffd77a', startDeg: 22.5 }),
        ],
        antenna: [
          { shape: 'cyl', rt: 0.025, rb: 0.05, h: 1.2, seg: 6, color: '#bfbfbf', metal: true },
          ...[0.3, 0.6, 0.85].map((y) => ({ shape: 'cyl', rt: 0.045 - y * 0.02, rb: 0.05 - y * 0.02, h: 0.06, seg: 6, at: [0, y, 0], color: '#9a9a9a', metal: true })),
          { shape: 'sphere', r: 0.04, at: [0, 1.18, 0], color: '#ff5a4a', glow: true, glowColor: '#ff5a4a' },
        ],
      },
      structure: [
        { part: 'podium', pos: [0, 0, 0], ry: 0 },
        { part: 'shaft', pos: [0, 1.0, 0], ry: 0 },
        { part: 'wing', pos: [-1.6, 1.0, 0], ry: 0 },
        { part: 'wing', pos: [1.6, 1.0, 0], ry: 0 },
        { part: 'setbackA', pos: [0, 5.2, 0], ry: 0 },
        { part: 'setbackB', pos: [0, 6.0, 0], ry: 0 },
        { part: 'crown', pos: [0, 6.6, 0], ry: 0 },
        { part: 'mast', pos: [0, 7.3, 0], ry: 0 },
        { part: 'antenna', pos: [0, 8.2, 0], ry: 0 },
      ],
    },
  );
})();
