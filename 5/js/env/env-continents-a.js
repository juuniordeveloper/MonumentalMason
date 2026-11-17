/* =========================================================
   ANIT USTASI — Kıta eserlerinin çevreleri (1)
   Avrupa: Eyfel, Big Ben, Neuschwanstein
   Asya  : Çin Seddi, Angkor Wat, Himeji
   Afrika: Ebu Simbel, Djenné, Lalibela
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, PALETTE, bridge, crowd } = AU.envUtil;
  const PI = Math.PI;

  const haussmann = { colors: PALETTE.paris, roofColors: ['#5d6873', '#646e78', '#55606b'], w: [1.6, 2.4], h: [3.2, 4.2], roof: 'mansard', windows: '#3a4552', trim: '#f4ede0', chimneys: true };

  /* ---------------------------------------------- EYFEL: Champ de Mars, Seine */
  AU.ENVIRONMENTS.eiffel = function (k, { R }) {
    const n = R + 2.5;
    // Champ de Mars çimenleri (arkada) ve Trocadéro bahçeleri (önde, nehrin karşısında)
    k.patch(0, -n - 12, 12, 22, '#7fa858');
    k.patch(0, -n - 12, 2.2, 22, '#cfc4ad');
    k.trees(k.line(-6.5, -n, -6.5, -n - 24, 1.6).concat(k.line(6.5, -n, 6.5, -n - 24, 1.6)), 'round', { scale: 1.2 });
    k.compound(0, k.groundY, -n - 25, 0, [['box', { sx: 7, sy: 1.6, sz: 2, color: '#e6dcc6' }], ['dome', { y: 1.6, sx: 1.8, sy: 1.2, sz: 1.8, color: '#5d6873' }]]); // École Militaire
    crowd(k, 180, R + 2, n + 6);
    const river = n + 6;
    k.water(0, river + 3, 220, 6, k.groundY + 0.008, '#4f7f94');
    bridge(k, 0, river - 0.5, 0, river + 6.5, { span: 2.4, w: 3, h: 1, color: '#d4c9b2' }); // Pont d'Iéna
    k.traffic([0, river - 0.5, 0, river + 6.5], 3, { scale: 0.32 });
    k.boat([-60, river + 2, 60, river + 2], { s: 1.1, hull: '#f4f4f0', deck: '#9fc3d8', speed: 1.2 });
    k.compound(0, k.groundY, river + 14, PI, [['box', { sx: 12, sy: 2, sz: 2, color: '#e9e0cc' }], ['box', { x: -5, sx: 2, sy: 2.6, sz: 2, color: '#e9e0cc' }], ['box', { x: 5, sx: 2, sy: 2.6, sz: 2, color: '#e9e0cc' }]]); // Trocadéro
    const avoid = any(avoidRect(-7.5, -n - 30, 7.5, -n + 1), avoidRect(-90, river - 1, 90, river + 7), avoidCircle(0, river + 14, 8), avoidCircle(0, 0, n + 6));
    k.houses(k.scatter(700, n + 4, n + 40, { spacing: 2.2, avoid }).map((p) => ({ ...p, ry: Math.round(p.a / (PI / 2)) * (PI / 2) })), { ...haussmann, detailR: n + 18 });
    k.trees(k.scatter(120, n + 4, n + 30, { avoid, spacing: 1.4 }), 'round', { scale: 1.2 });
    k.birds(8, 0, 0, n, 10, { color: '#9aa3ab', wing: '#5d666e', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- BIG BEN: Thames, Westminster */
  AU.ENVIRONMENTS.bigben = function (k, { R }) {
    const n = R + 2.5;
    // Thames nehri (önde), Westminster Köprüsü, London Eye karşı kıyıda
    const rz = n + 4;
    k.water(0, rz + 4, 240, 8, k.groundY + 0.008, '#5d7f86');
    bridge(k, 4, rz - 0.5, 4, rz + 8.5, { span: 1.8, w: 2.6, h: 0.9, color: '#5f8a6a', pier: '#b0a890' });
    k.traffic([4, rz - 0.5, 4, rz + 8.5], 4, { scale: 0.34 });
    k.tram([3.4, rz - 0.5, 3.4, rz + 8.5], { color: '#c0392b', speed: 0.9 }); // kırmızı otobüs
    const ex = -6, ez = rz + 12;
    const eye = [];
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * PI * 2;
      eye.push(['box', { x: Math.cos(a) * 4, y: 4.4 + Math.sin(a) * 4, sx: 0.8, sy: 0.08, sz: 0.08, rz: a + PI / 2, color: '#e8eef2' }]);
      if (i % 4 === 0) eye.push(['ball', { x: Math.cos(a) * 4, y: 4.2 + Math.sin(a) * 4, sx: 0.4, color: '#9fc3d8' }]);
    }
    eye.push(['box', { x: -1, sx: 0.12, sy: 4.4, sz: 0.12, rz: -0.25, color: '#e8eef2' }], ['box', { x: 1, sx: 0.12, sy: 4.4, sz: 0.12, rz: 0.25, color: '#e8eef2' }]);
    k.compound(ex, k.groundY, ez, 0, eye);
    k.boat([-70, rz + 3, 70, rz + 3], { s: 1, hull: '#f4f4f0', speed: 1.3 });
    // Parlamento Meydanı ve Westminster Abbey (arkada)
    k.patch(-2, -n - 4, 8, 6, '#7fa858');
    crowd(k, 120, R + 2, n + 3);
    k.church(-4, -n - 12, { s: 1.9, ry: PI / 2, stone: '#d8c39a', roof: '#4b5563', spire: false });
    k.road(-90, -n - 1, 90, -n - 1, 2.4);
    k.traffic([-80, -n - 1, 80, -n - 1], 8, { scale: 0.42 });
    const avoid = any(avoidRect(-90, rz - 1, 90, rz + 9), avoidRect(-90, -n - 2.4, 90, -n + 0.2), avoidCircle(-4, -n - 12, 6), avoidCircle(-2, -n - 4, 5), avoidCircle(0, 0, n + 3));
    k.houses(k.scatter(650, n + 4, n + 40, { spacing: 2, avoid }), { colors: ['#c9b38a', '#b98c6a', '#d8c39a', '#e2d6bf', '#9a7a62'], roofColors: ['#4b5563', '#5d6873', '#7a4a3a'], w: [1.4, 2.4], h: [2.2, 4.4], roof: 'hip', windows: '#3a4552', detailR: n + 18, chimneys: true });
    k.trees(k.scatter(80, n + 2, n + 30, { avoid }), 'round', { scale: 1.3 });
    k.birds(8, 0, 0, n, 9, { color: '#9aa3ab', wing: '#5d666e', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- NEUSCHWANSTEIN: Bavyera Alpleri */
  AU.ENVIRONMENTS.neuschwanstein = function (k, { R }) {
    const n = R + 2.5;
    // Alpler: karlı zirveli dağlar, çam ormanları, Alpsee ve Hohenschwangau Şatosu
    for (const p of k.scatter(14, n + 18, n + 40, { arc: [PI * 0.55, PI * 1.45], spacing: 10 })) {
      const h = k.range(12, 22);
      k.add('cone', { x: p.x, z: p.z, sx: k.range(16, 24), sy: h, sz: k.range(14, 20), color: '#5f6f5a' });
      k.add('cone', { x: p.x, y: k.groundY + h * 0.65, z: p.z, sx: k.range(5, 8), sy: h * 0.35, color: '#f2f5f7' });
    }
    k.trees(k.scatter(420, n + 2, n + 34, { spacing: 1.3, avoid: (x, z) => z > n + 4 && Math.abs(x) < 9 }), 'spruce', { scale: 1.3 });
    k.water(0, n + 12, 16, 10, k.groundY + 0.01, '#4f86a6', true); // Alpsee
    k.compound(9, k.groundY, n + 4, 0.3, [
      ['box', { sx: 3, sy: 1.6, sz: 1.6, color: '#f2d27a' }], ['gable', { y: 1.6, sx: 3.1, sy: 0.7, sz: 1.7, ry: PI / 2, color: '#7a4a3a' }],
      ['cyl', { x: 1.6, sx: 0.8, sy: 2.4, color: '#f2d27a' }], ['cone', { x: 1.6, y: 2.4, sx: 0.9, sy: 0.6, color: '#7a4a3a' }],
    ]); // Hohenschwangau
    k.patch(-4, n + 2, 10, 14, '#7fa858');
    k.houses(k.scatter(40, 0, 6, { cx: -6, cz: n + 6, spacing: 2 }), { colors: ['#f2ece0', '#e9dcc6'], roofColors: ['#7a4a3a', '#8a5a3a'], w: [1.2, 1.8], h: [1.2, 1.8], roof: 'gable', windows: '#4a3b30', chimneys: true });
    crowd(k, 60, R + 2, n + 1.5);
    k.birds(6, 0, 0, n, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- ÇİN SEDDİ: Mutianyu dağları */
  AU.ENVIRONMENTS.greatwall = function (k, { R }) {
    const n = R + 2.5;
    // Sur dağ sırtları boyunca iki yana kıvrılarak devam eder
    for (const side of [-1, 1]) {
      let x = side * (R + 1.5), y = 0;
      for (let i = 0; i < 14; i++) {
        const nx = x + side * 3.2, ny = Math.max(0.3, y + k.range(-0.9, 1.3));
        const z = Math.sin(i * 0.7) * 3;
        k.add('hill', { x: (x + nx) / 2, z, y: k.groundY - 0.1, sx: 5, sy: ny * 2 + 1, sz: 4, color: '#5f7a4a' });
        k.add('box', { x: (x + nx) / 2, z, y: k.groundY, sx: 3.3, sy: ny + 0.9, sz: 0.7, ry: Math.atan2(0, 1), color: '#9a9282' });
        if (i % 2 === 0) k.add('box', { x: nx, z, y: k.groundY, sx: 1.1, sy: ny + 1.6, sz: 1.1, color: '#b0a796' });
        x = nx; y = ny;
      }
    }
    // Ormanlık yeşil dağlar, teleferik, turistler
    k.hills(k.scatter(30, n + 6, n + 42, { spacing: 7 }), '#4f6f42', [6, 12], [3, 7]);
    k.trees(k.scatter(360, n, n + 34, { spacing: 1.3, avoid: (x, z) => Math.abs(z) < 4 }), 'round', { colors: ['#4f7f3a', '#5f8f45', '#3f6f32', '#6f9a4a'], scale: 1.1 });
    for (const p of k.line(2, n, 6, n + 20, 2.5)) k.add('cyl', { x: p.x, z: p.z, sx: 0.12, sy: 3, color: '#5d6670' });
    crowd(k, 70, R + 2, n + 1);
    k.birds(5, 0, 0, n, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- ANGKOR WAT: hendek, orman */
  AU.ENVIRONMENTS.angkor = function (k, { R }) {
    const n = R + 2.5;
    // Tapınağı çevreleyen geniş hendek ve batıdaki taş geçit
    const m1 = n + 3, m2 = n + 8;
    for (const [x, z, w, d] of [[0, (m1 + m2) / 2, (m2) * 2, m2 - m1], [0, -(m1 + m2) / 2, m2 * 2, m2 - m1], [(m1 + m2) / 2, 0, m2 - m1, m1 * 2], [-(m1 + m2) / 2, 0, m2 - m1, m1 * 2]]) {
      k.water(x, z, w, d, k.groundY + 0.008, '#5d8a7a');
    }
    k.add('box', { x: 0, z: (m1 + m2) / 2, y: k.groundY - 0.05, sx: 2.4, sy: 0.3, sz: m2 - m1 + 1, color: '#a89878' });
    for (const s of [-1, 1]) k.add('box', { x: s * 6, z: n + 1.2, sx: 9, sy: 1.0, sz: 0.6, color: '#958566' }); // dış duvar
    k.compound(0, k.groundY, n + 1.2, 0, [['box', { sx: 3, sy: 1.6, sz: 1, color: '#958566' }], ['cone', { y: 1.6, sx: 1, sy: 1.4, color: '#9d8d6e' }]]);
    k.patch(0, 0, n * 2 + 5, n * 2 + 5, '#6f9a4f', 0, undefined, true);
    k.trees(k.scatter(40, R + 2, m1 - 0.5, { spacing: 2 }), 'palm');
    crowd(k, 120, R + 2, m1 - 0.8);
    // Kamboçya ormanı ve şeker palmiyeleri
    k.trees(k.scatter(420, m2 + 1, m2 + 34, { spacing: 1.4 }), 'jungle');
    k.trees(k.scatter(80, m2 + 1, m2 + 30, { spacing: 1.8 }), 'palm', { scale: 1.1 });
    k.birds(6, 0, 0, n, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- HİMEJİ: kale bahçeleri ve şehir */
  AU.ENVIRONMENTS.himeji = function (k, { R }) {
    const n = R + 2.5;
    // Kale çevresindeki hendek, taş surlar, kiraz ağaçları
    k.water(0, 0, (n + 7) * 2, (n + 7) * 2, k.groundY + 0.006, '#4f7f8a', true);
    k.add('disc', { y: k.groundY - 0.05, sx: (n + 4.5) * 2, sy: 0.1, color: '#7a9a5a' });
    k.walls(-(n + 4), -(n + 4), n + 4, -(n + 4), { h: 1.4, thick: 0.6, towerStep: 6, towerW: 1.2, color: '#8f8a80', tower: '#f1efe9' });
    k.trees(k.scatter(60, R + 2, n + 4, { spacing: 1.4 }), 'round', { colors: ['#f4b6c8', '#f7c6d4', '#eea3ba', '#f9d3de'], scale: 1.1 }); // kiraz
    crowd(k, 90, R + 2, n + 3.5);
    k.road(0, n + 7.5, 0, n + 40, 3); // Otemae Caddesi
    k.traffic([0, n + 8, 0, n + 38], 6);
    const avoid = any(avoidCircle(0, 0, n + 8), avoidRect(-2, n + 7, 2, 80));
    k.houses(k.scatter(650, n + 8, n + 40, { spacing: 1.8, avoid }), { colors: ['#e9e4d8', '#d9d4c8', '#cfc8b8', '#f2efe6'], roofColors: ['#4b5563', '#5d6873', '#6f7b85'], w: [1.2, 2.2], h: [1.2, 3.6], roof: 'hip', windows: '#3a4552', detailR: n + 18 });
    k.trees(k.scatter(80, n + 8, n + 30, { avoid }), 'round');
    k.hills(k.scatter(8, n + 32, n + 44, { spacing: 10 }), '#5f7a4a', [10, 16], [3, 6]);
    k.birds(8, 0, 0, n, 9, { color: '#f4f4f0', wing: '#c9ccd0' });
    return {};
  };

  /* ---------------------------------------------- EBU SİMBEL: Nasır Gölü */
  AU.ENVIRONMENTS.abusimbel = function (k, { R }) {
    const n = R + 2.5;
    // Tapınak Nasır Gölü kıyısındaki yapay tepenin içindedir
    k.add('hill', { x: 0, z: -n - 6, sx: 40, sy: 12, sz: 18, color: '#c39f72' });
    k.water(0, n + 12, 240, 18, k.groundY + 0.008, '#3f8fa8');
    k.patch(0, n + 2.5, 60, 2, '#d9be8f');
    k.boat([-50, n + 8, 50, n + 10], { s: 1.2, hull: '#f4f4f0', deck: '#e8dcc0', speed: 0.8 });
    crowd(k, 120, R + 2, n + 2);
    k.hills(k.scatter(24, n + 4, n + 36, { arc: [PI * 0.55, PI * 1.45], spacing: 6 }), '#d4ad72', [4, 9], [0.8, 2]);
    k.trees(k.scatter(30, n + 2, n + 10, { arc: [PI * 0.3, PI * 0.6] }), 'palm');
    // Ebu Simbel kasabası ve havalimanı yolu
    k.houses(k.scatter(120, n + 10, n + 30, { arc: [PI * 1.5, PI * 1.9], spacing: 1.8 }), { colors: PALETTE.cairo, w: [1, 1.8], h: [1, 2.2], roof: 'flat', windows: '#5e4f3e', detailR: n + 16 });
    k.road(n + 2, -n, n + 26, -n - 20, 2);
    k.traffic([n + 2, -n, n + 26, -n - 20], 3);
    k.birds(4, 0, 0, n + 4, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.9 });
    return { pedestalColor: '#a8825a' };
  };

  /* ---------------------------------------------- DJENNÉ: pazar meydanı */
  AU.ENVIRONMENTS.djenne = function (k, { R }) {
    const n = R + 2.5;
    // Caminin önündeki Pazartesi pazarı: renkli şemsiyeler ve kalabalık
    for (const p of k.grid(-n, n + 1, n, n + 9, 1.4, { jitter: 0.3, fill: 0.8 })) {
      k.add('cyl', { x: p.x, z: p.z, sx: 0.04, sy: 0.9, color: '#6b4a2f' });
      k.add('cone', { x: p.x, y: k.groundY + 0.8, z: p.z, sx: 1.2, sy: 0.3, color: k.pick(['#c0392b', '#f1c40f', '#27ae60', '#2980b9', '#e67e22', '#8e44ad']) });
    }
    crowd(k, 220, R + 2, n + 10);
    // Kerpiç evler (iki katlı, düz damlı, Sudan üslubu cepheler)
    const avoid = any(avoidRect(-n - 1, n, n + 1, n + 10), avoidCircle(0, 0, n + 1));
    k.houses(k.scatter(520, n, n + 34, { spacing: 1.7, avoid }), { colors: ['#b98a5a', '#a87a4c', '#c49562', '#9c6f45'], roofColors: ['#a87a4c'], w: [1.2, 2.2], h: [1.2, 2.4], roof: 'flat', windows: '#3a2618', detailR: n + 16 });
    k.trees(k.scatter(60, n + 2, n + 30, { avoid }), 'round', { colors: ['#6f8f3a', '#5f7f35'] });
    // Bani Nehri'nin taşkın ovası (uzakta)
    k.water(0, -n - 36, 240, 20, k.groundY + 0.008, '#7a8f6a');
    k.birds(6, 0, 0, n, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- LALİBELA: Etiyopya yaylası */
  AU.ENVIRONMENTS.lalibela = function (k, { R }) {
    const n = R + 2.5;
    // Kayalık yaylada yuvarlak taş evler (tukul) ve okaliptüs ağaçları
    k.patch(0, 0, (n + 3) * 2, (n + 3) * 2, '#a07a5a', 0, undefined, true);
    for (const p of k.scatter(160, n + 2, n + 32, { spacing: 2.2 })) {
      k.add('cyl', { x: p.x, z: p.z, sx: 1.4, sy: 0.9, color: k.pick(['#9a7a5a', '#a8885f', '#8f6f50']) });
      k.add('cone', { x: p.x, y: k.groundY + 0.9, z: p.z, sx: 1.7, sy: 1.0, color: k.pick(['#8a7a4a', '#9a8a55']) });
    }
    k.trees(k.scatter(160, n + 2, n + 34, { spacing: 1.6 }), 'poplar', { colors: ['#6f8a5a', '#7f9a6a', '#5f7a4f'], scale: 1.3 });
    // Diğer kaya kiliselerinin çukurları (koyu açıklıklar) ve beyaz giysili hacılar
    for (const p of k.scatter(5, n + 3, n + 12, { spacing: 6 })) {
      k.add('box', { x: p.x, y: k.groundY - 0.01, z: p.z, sx: 3, sy: 0.02, sz: 3, color: '#4a3022' });
      k.add('box', { x: p.x, z: p.z, sx: 1.6, sy: 0.4, sz: 1.6, color: '#93604a' });
    }
    k.people(k.scatter(160, R + 2, n + 8, { spacing: 0.35 }).map((p) => p), { scale: 0.13 });
    k.hills(k.scatter(10, n + 26, n + 42, { spacing: 10 }), '#7a6a50', [10, 16], [4, 8]);
    k.birds(4, 0, 0, n + 4, 10, { color: '#2b2724', wing: '#1d1a18', scale: 1.2 });
    return {};
  };
})();
