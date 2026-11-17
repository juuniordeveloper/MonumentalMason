/* =========================================================
   ANIT USTASI — İstanbul çevreleri
   Bozdoğan Kemeri, Galata Kulesi, Kız Kulesi, Ayasofya
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, PALETTE, bridge, crowd } = AU.envUtil;
  const PI = Math.PI;

  const istanbulHouses = (k, pts, extra) => k.houses(pts, {
    colors: PALETTE.istanbul, roofColors: PALETTE.tiles, w: [1.1, 1.9], h: [1.5, 3.4],
    roof: 'hip', windows: '#3e3a36', chimneys: true, ...(extra || {}),
  });

  /* ---------------------------------------------- BOZDOĞAN KEMERİ (Fatih) */
  AU.ENVIRONMENTS.valens = function (k, { R }) {
    const n = R + 2.5;
    // Kemerin iki yana devamı: iki katlı kemer dizisi, sisin içinde kaybolur
    for (const side of [-1, 1]) {
      for (let x = n; x < n + 36; x += 2) {
        const cx = side * x;
        k.add('box', { x: cx, z: 0, sx: 0.7, sy: 2.4, sz: 0.9, color: '#b08e6c' });
        k.add('box', { x: cx + side, y: 1.8, z: 0, sx: 1.4, sy: 0.6, sz: 0.9, color: '#a8865f' });
        for (const dx of [0, side]) k.add('box', { x: cx + dx, y: 2.4, z: 0, sx: 0.45, sy: 1.3, sz: 0.8, color: '#b29072' });
        k.add('box', { x: cx + side * 0.5, y: 3.4, z: 0, sx: 2.05, sy: 0.6, sz: 0.85, color: '#9e7d5d' });
        for (const y of [0.6, 1.2]) k.add('box', { x: cx, y, z: 0, sx: 0.74, sy: 0.07, sz: 0.94, color: '#8c4f36' });
      }
    }
    // Atatürk Bulvarı kemerin altından geçer (iki yönlü trafik)
    k.road(0, -n, 0, -n - 40, 3.4);
    k.road(0, n, 0, n + 40, 3.4);
    k.traffic([-0.8, -n - 1, -0.8, -n - 38], 6);
    k.traffic([0.8, n + 1, 0.8, n + 38], 5);
    k.cars(k.line(-1.9, -n - 3, -1.9, -n - 30, 1.1).filter(() => k.rand() < 0.6).map((p) => ({ ...p, ry: PI })));
    k.lamps(k.line(2, -n, 2, -n - 36, 3).concat(k.line(-2, -n, -2, -n - 36, 3)));
    // Kadınlar Pazarı (Fatih Pazarı): renkli tenteli tezgâhlar ve kalabalık
    const mx = -n - 4, mz = -5;
    k.patch(mx, mz, 9, 6, '#a9a29a');
    for (const p of k.grid(mx - 3.5, mz - 2.3, mx + 3.5, mz + 2.3, 1.15, { jitter: 0.05 })) {
      k.add('box', { x: p.x, z: p.z, sx: 0.8, sy: 0.45, sz: 0.5, color: '#8a6a45' });
      k.add('gable', { x: p.x, y: k.groundY + 0.75, z: p.z, sx: 0.9, sy: 0.25, sz: 0.6, color: k.pick(['#c0392b', '#f1f1ea', '#27ae60', '#2980b9', '#e67e22']) });
      k.add('box', { x: p.x, y: k.groundY + 0.45, z: p.z, sx: 0.03, sy: 0.3, sz: 0.03, color: '#555' });
    }
    crowd(k, 70, 0, 4.5, { cx: mx, cz: mz });
    // Şehzade Camii ve türbeleri, Saraçhane parkı ve belediye binası
    k.mosque(n + 7, -7, { s: 1.35, minarets: 2, ry: 0.15, court: true });
    for (const [dx, dz] of [[-2.5, -3], [-1.2, -3.6]]) {
      k.add('oct', { x: n + 7 + dx, z: -7 + dz, sx: 0.9, sy: 0.9, color: '#e6dccb' });
      k.add('dome', { x: n + 7 + dx, y: 0.88, z: -7 + dz, sx: 0.9, sy: 0.7, sz: 0.9, color: '#8d99a4' });
    }
    k.patch(n + 6, 7, 10, 8, '#6f9a4c');
    k.trees(k.scatter(26, 0, 4.5, { cx: n + 6, cz: 7, spacing: 1 }), 'round', { scale: 1.3 });
    k.add('box', { x: n + 14, z: 9, sx: 3, sy: 3.4, sz: 8, color: '#c9c1b3' });
    k.add('box', { x: n + 14, y: 3.4, z: 9, sx: 3.1, sy: 0.15, sz: 8.1, color: '#8f8a80' });
    // Süleymaniye tepede, Fatih Camii solda (sisin içinde)
    k.hills([{ x: -4, z: -n - 22, color: '#9a8a6f' }], '#9a8a6f', [10, 11], [1.6, 1.8]);
    k.mosque(-4, -n - 22, { s: 2.3, minarets: 4, y: 1.4, ry: 0.1, court: true });
    k.mosque(-n - 20, -10, { s: 1.8, minarets: 2, ry: PI / 2, court: true });
    // Yoğun eski İstanbul dokusu
    const avoid = any(avoidRect(-2.6, -80, 2.6, 80), avoidRect(-80, -1.4, 80, 1.4), avoidRect(mx - 5, mz - 3.5, mx + 5, mz + 3.5),
      avoidCircle(n + 7, -7, 7), avoidRect(n + 1, 3, n + 16, 13.5), avoidCircle(-4, -n - 22, 8));
    istanbulHouses(k, k.scatter(780, n, n + 36, { spacing: 1.45, avoid }), { detailR: n + 14 });
    k.trees(k.scatter(130, n, n + 30, { avoid, spacing: 1.2 }), 'round', { scale: 1.25 });
    crowd(k, 90, R + 2, n + 10, { avoid: any(avoidRect(-80, -1.4, 80, 1.4)) });
    k.birds(8, 0, 0, R + 4, 6);
    return {};
  };

  /* ---------------------------------------------- GALATA (Beyoğlu, Karaköy, Haliç) */
  AU.ENVIRONMENTS.galata = function (k, { R }) {
    const n = R + 2.5;
    const shore = -(n + 16);
    // Kule meydanı: taş döşeli, turistler ve kafe masaları
    k.patch(0, 0, (n + 2.5) * 2, (n + 2.5) * 2, '#a9a093', 0, undefined, true);
    crowd(k, 110, R + 2, n + 2);
    k.benches(k.scatter(16, R + 2.2, n + 2, { spacing: 1.2 }).map((p) => ({ ...p, ry: p.a })));
    k.lamps(k.scatter(12, n + 1.5, n + 2.4, { spacing: 2.5 }));
    // Galip Dede Caddesi (yukarı, İstiklal'e) ve Yüksek Kaldırım (aşağı, Karaköy'e)
    k.road(0, n + 2.5, 0, n + 40, 1.6, { lines: false, color: '#8c847a' });
    k.road(-1, -n - 2.5, -3, shore + 2, 1.6, { lines: false, color: '#8c847a' });
    k.people(k.line(-0.6, n + 3, -0.6, n + 26, 0.9).concat(k.line(0.6, n + 4, 0.6, n + 28, 1.1)));
    // Beyoğlu: yüksek, renkli eski apartmanlar
    const avoid = any(avoidCircle(0, 0, n + 2.6), avoidRect(-1.2, n, 1.2, 80), avoidRect(-4, shore, 0, -n), (x, z) => z < shore + 2.5,
      avoidCircle(-9, -n - 8, 2.5), avoidCircle(8, n + 6, 3));
    k.houses(k.scatter(820, n + 2.6, n + 36, { spacing: 1.5, avoid }), {
      colors: ['#e6c9a8', '#d7a689', '#c9b9a6', '#e9dcc4', '#b98f73', '#d4c3a1', '#a9b7b9', '#e3d1b9'],
      roofColors: PALETTE.tiles, w: [1.2, 2], h: [2.6, 5.4], roof: 'hip', windows: '#3c3530', trim: '#f0e8da', detailR: n + 14, chimneys: true,
    });
    // Arap Camii (kare kuleli) ve Galata Mevlevihanesi
    k.compound(-9, k.groundY, -n - 8, 0.2, [
      ['box', { sx: 2.4, sy: 1.6, sz: 3.6, color: '#d9cbb3' }],
      ['gable', { y: 1.6, sx: 2.5, sy: 0.6, sz: 3.7, color: '#8d99a4' }],
      ['box', { x: 1.6, z: 1.2, sx: 1, sy: 4.2, sz: 1, color: '#cbb89c' }],
      ['pyramid', { x: 1.6, z: 1.2, y: 4.2, sx: 1.1, sy: 1.2, color: '#8d99a4' }],
    ]);
    k.compound(8, k.groundY, n + 6, 0, [
      ['box', { sx: 3, sy: 1.4, sz: 3, color: '#c8a785' }],
      ['dome', { y: 1.4, sx: 2, sy: 1.2, sz: 2, color: '#8d99a4' }],
    ]);
    // Karaköy rıhtımı: sahil yolu, tramvay, iskele
    k.road(-80, shore + 1.2, 80, shore + 1.2, 2.4);
    k.tram([-60, shore + 1.2, 60, shore + 1.2], { speed: 1.6 });
    k.traffic([-70, shore + 1.8, 70, shore + 1.8], 6);
    k.add('box', { x: 6, y: k.groundY - 0.1, z: shore - 1.5, sx: 6, sy: 0.4, sz: 2.4, color: '#7a6e62' });
    k.add('box', { x: 6, y: k.groundY + 0.3, z: shore - 1.5, sx: 4, sy: 0.9, sz: 1.6, color: '#e9dcc6' });
    // Haliç ve Galata Köprüsü (balıkçılarla)
    k.water(0, shore - 15, 180, 30, k.groundY + 0.01, '#3f7f9e');
    k.patch(0, shore - 0.2, 180, 0.6, '#8f8a80');
    bridge(k, 12, shore, 12, shore - 30, { span: 2.5, w: 2.6, h: 0.9, color: '#8e959b', pier: '#6f767b' });
    k.people(k.line(11, shore - 1, 11, shore - 29, 0.7).map((p) => ({ ...p, y: k.groundY + 0.95 })));
    k.traffic([12.4, shore - 1, 12.4, shore - 29], 3);
    // Karşı kıyı: Tarihi Yarımada (Yeni Cami, Mısır Çarşısı, Süleymaniye, Rüstem Paşa)
    const far = shore - 30;
    k.add('box', { x: 0, y: k.groundY - 0.4, z: far - 20, sx: 180, sy: 0.4, sz: 40, color: '#8d8a7c' });
    k.mosque(10, far - 4, { s: 1.9, minarets: 2, court: true, ry: PI });
    k.add('box', { x: 2, z: far - 3, sx: 1.4, sy: 1.3, sz: 7, color: '#d9cbb3' });
    for (let z = far - 0.5; z > far - 6.5; z -= 1) k.add('dome', { x: 2, y: 1.3, z, sx: 0.8, sy: 0.5, sz: 0.8, color: '#8d99a4' });
    k.hills([{ x: -10, z: far - 18, y: k.groundY - 0.2 }], '#8f8a6e', [12, 13], [2, 2.2]);
    k.mosque(-10, far - 16, { s: 2.8, minarets: 4, y: 3.6, court: true, ry: PI });
    k.mosque(-2, far - 8, { s: 0.9, minarets: 1 });
    istanbulHouses(k, Array.from({ length: 260 }, () => ({ x: k.range(-70, 70), z: far - k.range(2, 36), a: 0 }))
      .filter((p) => !avoidCircle(10, far - 4, 7)(p.x, p.z) && !avoidCircle(-10, far - 16, 9)(p.x, p.z)), { face: false });
    // Vapurlar, tekneler ve kulenin etrafında martılar
    k.boat([-60, shore - 6, 60, shore - 9], { s: 1.2, funnel: '#1d1d1d', speed: 1.4 });
    k.boat([60, shore - 18, -60, shore - 15], { s: 1.2, funnel: '#1d1d1d', speed: 1.1 });
    k.boat([-40, shore - 11, 40, shore - 24], { s: 0.5, hull: '#c0392b', speed: 2, windows: false });
    k.birds(12, 0, 0, 4, 8.5);
    return {};
  };

  /* ---------------------------------------------- KIZ KULESİ (Boğaz) */
  AU.ENVIRONMENTS.kizkulesi = function (k, { R }) {
    const n = R + 2.5;
    const LAND = 0.35; // kıyı yüksekliği
    k.water(0, 0, 260, 260, -0.2, '#3f86a6', true);
    k.add('disc', { y: -0.21, sx: 6.6, sy: 0.02, color: '#d8e9ef' });
    // Üsküdar kıyısı (sağda): Salacak sahili, evler yamaçta yükselir
    const ux = n + 8;
    k.add('box', { x: ux + 40, y: -1, z: -10, sx: 80, sy: 1 + LAND, sz: 140, color: '#8a9a6a' });
    k.add('box', { x: ux + 0.6, y: -1, z: -10, sx: 1.2, sy: 1 + LAND, sz: 140, color: '#b9ae98' });
    k.people(k.line(ux + 0.5, -40, ux + 0.5, 30, 0.9).filter(() => k.rand() < 0.55).map((p) => ({ ...p, x: p.x + k.range(-0.3, 0.3), y: LAND })));
    k.benches(k.line(ux + 1.1, -30, ux + 1.1, 30, 3).map((p) => ({ ...p, y: LAND, ry: -PI / 2 })));
    k.lamps(k.line(ux + 0.15, -40, ux + 0.15, 30, 3).map((p) => ({ ...p, y: LAND })));
    k.road(ux + 2.4, -60, ux + 2.4, 40, 1.6);
    k.traffic([ux + 2.4, -50, ux + 2.4, 30], 5);
    const slope = (x) => LAND + Math.max(0, x - ux - 3.5) * 0.14;
    istanbulHouses(k, Array.from({ length: 520 }, () => ({ x: ux + k.range(3.6, 40), z: k.range(-55, 32), a: -PI / 2 }))
      .filter((p) => !avoidCircle(ux + 4.5, 2, 3)(p.x, p.z) && !avoidCircle(ux + 6, -12, 4.5)(p.x, p.z))
      .map((p) => ({ ...p, y: slope(p.x), r: Math.hypot(p.x, p.z) })), { detailR: n + 18 });
    k.trees(Array.from({ length: 120 }, () => ({ x: ux + k.range(4, 40), z: k.range(-55, 32) })).map((p) => ({ ...p, y: slope(p.x) })), 'round', { scale: 1.3 });
    k.mosque(ux + 4.5, 2, { s: 0.75, minarets: 1, y: slope(ux + 4.5), ry: -PI / 2 });              // Şemsi Paşa
    k.mosque(ux + 6, -12, { s: 1.45, minarets: 2, y: slope(ux + 6), ry: -PI / 2, court: true });  // Mihrimah Sultan
    k.mosque(ux + 14, -22, { s: 1.6, minarets: 2, y: slope(ux + 14), ry: -PI / 2, court: true }); // Yeni Valide
    k.hills([{ x: ux + 36, z: -30, y: slope(ux + 36) - 0.5 }], '#6f8a56', [14, 16], [5, 6]);           // Çamlıca
    // Avrupa yakası (solda, sisin içinde): Sarayburnu, Topkapı, Ayasofya, Sultanahmet, Galata
    const ex = -(n + 26);
    k.add('box', { x: ex - 30, y: -1, z: -10, sx: 60, sy: 2.2, sz: 140, color: '#8d927a' });
    const EY = 1.2;
    k.trees(Array.from({ length: 90 }, () => ({ x: ex - k.range(1, 14), z: k.range(-4, 16), y: EY })), 'round', { scale: 1.5 });
    k.add('box', { x: ex - 7, y: EY, z: 6, sx: 7, sy: 1.6, sz: 5, color: '#e8dfcf' });
    k.add('box', { x: ex - 6, y: EY, z: 3.5, sx: 0.9, sy: 4.2, sz: 0.9, color: '#e8dfcf' });
    k.add('cone', { x: ex - 6, y: EY + 4.2, z: 3.5, sx: 1.1, sy: 1.8, color: '#8d99a4' });
    k.mosque(ex - 9, -8, { s: 2.3, minarets: 4, y: EY, ry: PI / 2, stone: '#d9b39a' });  // Ayasofya
    k.mosque(ex - 10, -21, { s: 2.4, minarets: 6, y: EY, ry: PI / 2 });                   // Sultanahmet
    istanbulHouses(k, Array.from({ length: 160 }, () => ({ x: ex - k.range(2, 40), z: k.range(-45, -28), a: PI / 2, y: EY })), { face: false });
    k.add('cyl', { x: ex - 6, y: EY, z: -58, sx: 1.6, sy: 6.5, color: '#b5a68e' });         // Galata Kulesi
    k.add('cone', { x: ex - 6, y: EY + 6.5, z: -58, sx: 1.8, sy: 2.4, color: '#4c5b6b' });
    // Vapurlar, tekneler, martılar
    k.boat([ux - 3, -8, ex + 3, -16], { s: 1.3, funnel: '#1d1d1d', speed: 1.5, y: -0.21 });
    k.boat([ex + 3, n + 6, ux - 3, n + 2], { s: 1.3, funnel: '#1d1d1d', speed: 1.2, y: -0.21 });
    k.boat([-n - 2, n + 9, n + 2, n + 15], { s: 0.55, hull: '#c0392b', speed: 2.2, windows: false, y: -0.21 });
    k.boat([n + 3, -n - 7, -n - 6, -n - 11], { s: 0.5, hull: '#2c3e50', speed: 1.8, windows: false, y: -0.21 });
    k.boat([-20, -n - 30, -18, n + 30], { s: 2.2, hull: '#7f2a1d', deck: '#e2e2e2', speed: 0.8, y: -0.21 }); // şilep
    k.birds(14, 0.6, 0, R + 2, 7);
    return { hideGround: true, pedestalColor: '#5f574e' };
  };

  /* ---------------------------------------------- AYASOFYA (Sultanahmet) */
  AU.ENVIRONMENTS.ayasofya = function (k, { R }) {
    const n = R + 2.5;
    const mz = -(n + 18); // Sultanahmet Camii
    // Sultanahmet Parkı: çimen, havuz, lale tarhları, banklar, kalabalık
    k.patch(0, -(n + 5), 18, 10, '#6f9a4c');
    k.patch(0, -(n + 5), 18, 1.4, '#c9bfae');
    k.patch(0, -(n + 5), 1.4, 10, '#c9bfae');
    k.add('disc', { x: 0, z: -(n + 5), sx: 4.2, sy: 0.3, color: '#d9d1c3' });
    k.water(0, -(n + 5), 3.8, 3.8, k.groundY + 0.31, '#5b9bd5', true);
    k.add('cyl', { x: 0, z: -(n + 5), sx: 0.1, sy: 1.1, color: '#e8f2fb' });
    for (const [x, z, c] of [[-5, -n - 2.5, '#d1262b'], [5, -n - 2.5, '#f2c94c'], [-5, -n - 7.5, '#e86aa6'], [5, -n - 7.5, '#f5f1e6'], [-2.6, -n - 2.5, '#f2c94c'], [2.6, -n - 7.5, '#d1262b']]) {
      k.flowerBed(x, z, 2.2, 1.2, [c], { round: true });
    }
    k.benches(k.line(-8, -n - 4.3, 8, -n - 4.3, 2.2).map((p) => ({ ...p, ry: 0 })));
    crowd(k, 120, 0, 9, { cx: 0, cz: -(n + 5) });
    k.trees(k.scatter(40, 6, 11, { cx: 0, cz: -(n + 5), spacing: 1.5, avoid: avoidCircle(0, mz, 7) }), 'round', { scale: 1.4 });
    k.lamps(k.line(-8, -n - 0.8, 8, -n - 0.8, 2).concat(k.line(-8, -n - 9.2, 8, -n - 9.2, 2)));
    // Sultanahmet Camii (6 minare), Hipodrom: Dikilitaş, Yılanlı Sütun, Örme Dikilitaş, Alman Çeşmesi
    k.mosque(0, mz, { s: 2.8, minarets: 6, ry: PI, stone: '#d9d6cf', lead: '#7f8c98', minaretH: 4.8 });
    const hx = -(n + 9);
    k.patch(hx, mz + 2, 5, 26, '#c9bfae');
    k.add('box', { x: hx, z: mz + 6, sx: 0.5, sy: 4.2, sz: 0.5, color: '#c98f6b' });
    k.add('pyramid', { x: hx, y: k.groundY + 4.2, z: mz + 6, sx: 0.5, sy: 0.5, color: '#c98f6b' });
    k.add('box', { x: hx, z: mz + 6, sx: 0.9, sy: 0.6, sz: 0.9, color: '#d9d1c3' });
    k.add('cyl', { x: hx, z: mz + 2.8, sx: 0.22, sy: 1.6, color: '#6b5a40' });
    k.add('box', { x: hx, z: mz - 1, sx: 0.75, sy: 5.4, sz: 0.75, color: '#a58f78' });
    k.compound(hx + 0.5, k.groundY, -(n + 1.5), 0, [
      ['oct', { sx: 1.7, sy: 0.3, sz: 1.7, color: '#e2ddd0' }],
      ['oct', { y: 0.3, sx: 1.3, sy: 1.2, sz: 1.3, color: '#4f7a5e' }],
      ['dome', { y: 1.5, sx: 1.5, sy: 1.0, sz: 1.5, color: '#7d8a96' }],
    ]);
    crowd(k, 50, 0, 3, { cx: hx, cz: mz + 2 });
    // Haseki Hürrem Sultan Hamamı (iki kubbeli uzun yapı)
    k.compound(n + 4, k.groundY, -(n + 9), PI / 2, [
      ['box', { sx: 2.4, sy: 1.3, sz: 7, color: '#e3d3bd' }],
      ...[-2.4, -0.8, 0.8, 2.4].map((z) => ['dome', { z, y: 1.3, sx: 1.4, sy: 0.9, sz: 1.4, color: '#8d99a4' }]),
    ]);
    // Divanyolu ve T1 tramvayı (önde), Yerebatan Sarnıcı girişi
    const tz = n + 4;
    k.road(-70, tz, 70, tz, 2.2, { lines: false, color: '#9c968c' });
    k.tram([-55, tz, 55, tz], { speed: 1.4 });
    k.tram([50, tz + 0.01, -50, tz + 0.01], { speed: 1.1, color: '#2c3e50' });
    k.add('box', { x: -6, z: tz + 3, sx: 1.6, sy: 0.9, sz: 1.2, color: '#e3d3bd' });
    k.add('dome', { x: -6, y: k.groundY + 0.9, z: tz + 3, sx: 1, sy: 0.6, sz: 1, color: '#8d99a4' });
    k.people(k.line(-30, tz - 1.4, 30, tz - 1.4, 0.8).filter(() => k.rand() < 0.6));
    // Topkapı Sarayı yönü: Bâb-ı Hümâyun, III. Ahmet Çeşmesi, Aya İrini, saray surları, Gülhane
    const tx = n + 7;
    k.compound(tx, k.groundY, -2, PI / 2, [
      ['box', { sx: 4, sy: 2.6, sz: 1.2, color: '#ece4d6' }],
      ['box', { z: 0.62, sx: 1.2, sy: 1.8, sz: 0.04, color: '#3a2f27' }],
      ['box', { x: -2.4, sx: 0.9, sy: 3.2, sz: 0.9, color: '#e3d9c8' }],
      ['box', { x: 2.4, sx: 0.9, sy: 3.2, sz: 0.9, color: '#e3d9c8' }],
    ]);
    k.compound(tx - 2.5, k.groundY, 1.5, 0, [
      ['box', { sx: 1.4, sy: 1.1, sz: 1.4, color: '#f0e9da' }],
      ['pyramid', { y: 1.1, sx: 2.1, sy: 0.5, color: '#8d99a4' }],
      ['dome', { y: 1.35, sx: 0.5, sy: 0.4, sz: 0.5, color: '#8d99a4' }],
    ]);
    k.compound(tx + 4, k.groundY, -6, 0, [
      ['box', { sx: 2.4, sy: 1.6, sz: 4, color: '#b4614a' }],
      ['cyl', { y: 1.6, sx: 1.6, sy: 0.5, color: '#b4614a' }],
      ['dome', { y: 2.1, sx: 1.6, sy: 1.1, sz: 1.6, color: '#8d99a4' }],
    ]);
    k.walls(tx + 1, -40, tx + 1, 30, { h: 1.6, thick: 0.6, towerStep: 6, towerW: 1.2, color: '#d9cfbd' });
    k.trees(Array.from({ length: 160 }, () => ({ x: tx + k.range(2, 26), z: k.range(-36, 26) })).filter((p) => !avoidCircle(tx + 4, -6, 3)(p.x, p.z)), 'round', { scale: 1.5 });
    k.add('box', { x: tx + 10, z: -16, sx: 1.1, sy: 6, sz: 1.1, color: '#e8dfcf' });
    k.add('cone', { x: tx + 10, y: k.groundY + 6, z: -16, sx: 1.3, sy: 2.4, color: '#7d8a96' });
    for (const p of k.grid(tx + 8, -30, tx + 20, -20, 3.5)) k.houses([p], { colors: ['#ece4d6'], roofColors: ['#8d99a4'], w: [2.2, 2.8], h: [1, 1.5], roof: 'hip', face: false });
    // Çevredeki İstanbul evleri ve Marmara Denizi
    const avoid = any(avoidRect(-11, -n - 34, 11, -n + 1), avoidRect(hx - 3, mz - 14, hx + 3, -n), avoidRect(tx - 4, -45, 80, 30),
      avoidRect(-80, tz - 1.6, 80, tz + 1.6), (x) => x < -n - 26);
    istanbulHouses(k, k.scatter(620, n, n + 36, { spacing: 1.5, avoid }), { detailR: n + 14 });
    crowd(k, 60, R + 2, n + 2);
    k.water(-n - 56, -10, 60, 140, k.groundY + 0.01, '#3f7f9e');
    k.boat([-n - 34, -60, -n - 34, 20], { s: 1.3, funnel: '#1d1d1d', speed: 1.1 });
    k.boat([-n - 46, 30, -n - 46, -50], { s: 2.4, hull: '#7f2a1d', deck: '#e2e2e2', speed: 0.6 });
    k.birds(10, 0, -4, R + 4, 8);
    return {};
  };
})();
