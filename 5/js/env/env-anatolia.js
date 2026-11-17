/* =========================================================
   ANIT USTASI — Anadolu çevreleri
   Hevsel Bahçeleri, Diyarbakır Ulu Camii, Selimiye (Edirne)
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, PALETTE, bridge, crowd } = AU.envUtil;
  const PI = Math.PI;
  const BAZALT = '#45403d', KIRECTASI = '#d8cdb5', KURSUN = '#6b625b';

  const basaltHouses = (k, pts, extra) => k.houses(pts, {
    colors: PALETTE.basalt, roofColors: ['#6a625b', '#5d5650'], w: [1.3, 2.3], h: [1.1, 2.6],
    roof: 'flat', windows: '#d8cdb5', face: false, ...(extra || {}),
  });

  /* ---------------------------------------------- HEVSEL: Dicle vadisi */
  AU.ENVIRONMENTS.hevsel = function (k, { R }) {
    const n = R + 2.5;
    // Dicle Nehri: ortadaki parça bulmacanın; iki yanda ve önde genişleyerek akar
    k.water(-38, 2.2, 68, 1.6, k.groundY + 0.008, '#4e8fb8');
    k.water(38, 2.2, 68, 1.6, k.groundY + 0.008, '#4e8fb8');
    k.water(0, n + 10, 200, 12, k.groundY + 0.008, '#4a88ae');
    // Surların devamı: siyah bazalt duvar ve burçlar (Evli Beden ve Yedi Kardeş gibi)
    const wz = -1.6;
    k.walls(-R - 1.5, wz, -70, wz - 6, { h: 2.1, thick: 0.7, towerStep: 4.2, towerW: 1.3, roundTowers: true, color: BAZALT, tower: '#3c3836' });
    k.walls(R + 1.5, wz, 70, wz - 6, { h: 2.1, thick: 0.7, towerStep: 4.2, towerW: 1.3, roundTowers: true, color: BAZALT, tower: '#3c3836' });
    k.rocks(k.line(-R - 1, wz + 0.6, -70, wz - 5.4, 0.8).concat(k.line(R + 1, wz + 0.6, 70, wz - 5.4, 0.8)), { scale: 1.1, colors: ['#6d6259', '#5f554d'] });
    // Surların ardında Diyarbakır: bazalt evler, İçkale, Hz. Süleyman Camii minaresi
    const back = -(R + 3);
    basaltHouses(k, k.scatter(560, 0, n + 34, { spacing: 1.55, arc: [PI * 0.62, PI * 1.38], avoid: (x, z) => z > back }), { detailR: n + 16 });
    k.compound(-6, k.groundY, back - 6, 0, [
      ['box', { sx: 1.1, sy: 5, sz: 1.1, color: BAZALT }],
      ...[1.5, 2.6, 3.7].map((y) => ['box', { y, sx: 1.14, sy: 0.08, sz: 1.14, color: KIRECTASI }]),
      ['pyramid', { y: 5, sx: 1.2, sy: 0.7, color: KURSUN }],
      ['box', { x: 2, sx: 3, sy: 1.6, sz: 2.4, color: '#4a4441' }],
      ['dome', { x: 2, y: 1.6, sx: 1.6, sy: 1.1, sz: 1.6, color: KURSUN }],
    ]);
    k.compound(7, k.groundY, back - 4, 0, [
      ['box', { sx: 2, sy: 1.6, sz: 3.2, color: '#56504c' }],
      ['gable', { y: 1.6, sx: 2.1, sy: 0.6, sz: 3.3, color: KURSUN }],
    ]);
    for (const x of [-18, 16, 26]) k.minaret(x, back - k.range(8, 16), { s: 1.3, stone: KIRECTASI, lead: KURSUN });
    // Hevsel Bahçeleri: bostanlar, tarlalar, meyve bahçeleri, kavaklar
    const fields = ['#5f9e3a', '#6faf45', '#4f8f33', '#7a5b3a', '#86b552', '#3f7d2e', '#9cc25e'];
    for (let x = -46; x <= 46; x += 3.6) {
      if (Math.abs(x) < R + 1.5) continue;
      k.patch(x, -0.1, 3.4, 2.2, k.pick(fields));
      k.patch(x + k.range(-0.3, 0.3), 4.7, 3.4, 3.2, k.pick(fields));
      if (k.rand() < 0.5) {
        for (let r = -1.2; r <= 1.2; r += 0.4) k.add('box', { x: x + r, y: k.groundY, z: 4.7, sx: 0.12, sy: 0.12, sz: 2.8, color: '#5f9e3a' });
      }
    }
    for (let x = -60; x <= 60; x += 4) {
      k.patch(x, n + 19, 3.8, 5, k.pick(fields));
      k.patch(x + 2, n + 25, 3.8, 5, k.pick(fields));
    }
    const poplars = [];
    for (let x = -55; x <= 55; x += 1.25) {
      if (Math.abs(x) > R + 1.5) poplars.push({ x, z: 1.1 }, { x: x + 0.6, z: 3.45 });
      poplars.push({ x, z: n + 16.6 });
    }
    k.trees(poplars, 'poplar', { scale: 1.25 });
    const gardenAvoid = (x, z) => (z > 0.8 && z < 3.6) || (z > n + 3.5 && z < n + 16.4) || z < -0.6 || Math.hypot(x, z) < R + 1.5;
    k.trees(k.scatter(260, R + 1.5, n + 34, { spacing: 1.3, avoid: gardenAvoid }), 'round', { colors: ['#4f8f36', '#5c9a3f', '#6aa043', '#3f7d2e'] });
    // Bahçe kulübeleri ve çiftçiler
    k.houses(k.scatter(18, R + 4, n + 30, { spacing: 4, avoid: gardenAvoid }), { colors: ['#b59c7a', '#9c8467'], roofColors: ['#7a6a55'], w: [0.8, 1.1], h: [0.6, 0.8], roof: 'gable', face: false });
    k.people(k.scatter(40, R + 3, n + 24, { avoid: gardenAvoid }));
    // On Gözlü (Dicle) Köprüsü: nehrin üzerinde on kemer
    const bx = -(n + 16);
    k.water(bx, n + 4, 14, 22, k.groundY + 0.009, '#4a88ae');
    bridge(k, bx, -2.5, bx, n + 12, { span: (n + 14.5) / 10, w: 1.4, h: 1.2, color: '#4a4441', pier: '#3f3a37' });
    k.people(k.line(bx, -1, bx, n + 10, 1.2).map((p) => ({ ...p, y: k.groundY + 1.32 })));
    // Uzak dağlar (Karacadağ)
    k.hills(k.scatter(10, n + 32, n + 44, { arc: [0.1, PI * 0.9], spacing: 10 }), '#6f8456', [10, 16], [2, 4]);
    k.birds(8, 0, 2, n, 7, { color: '#f4f4f0', wing: '#2b2724' }); // leylekler
    return {};
  };

  /* ---------------------------------------------- ULU CAMİİ: Sur ilçesi */
  AU.ENVIRONMENTS['diyarbakir-ulu'] = function (k, { R }) {
    const n = R + 2.5;
    // Gazi Caddesi (doğuda, kuzey-güney) ve İzzet Paşa Caddesi
    const gx = n + 1.6;
    k.road(gx, -80, gx, 80, 2.4);
    k.traffic([gx, -60, gx, 60], 8);
    k.road(-80, n + 2, gx - 1.2, n + 2, 1.6, { lines: false, color: '#5a534e' });
    k.people(k.line(gx - 1.6, -40, gx - 1.6, 40, 0.8).filter(() => k.rand() < 0.6).concat(k.line(gx + 1.6, -40, gx + 1.6, 40, 0.8).filter(() => k.rand() < 0.6)));
    // Hasan Paşa Hanı (Gazi Caddesi'nin karşısında): iki katlı, siyah-beyaz şeritli avlulu han
    const hx = gx + 6;
    k.compound(hx, k.groundY, 0, 0, [
      ['box', { x: -3.2, sx: 0.9, sy: 2.2, sz: 7.4, color: BAZALT }],
      ['box', { x: 3.2, sx: 0.9, sy: 2.2, sz: 7.4, color: BAZALT }],
      ['box', { z: -3.3, sx: 7.2, sy: 2.2, sz: 0.9, color: BAZALT }],
      ['box', { z: 3.3, sx: 7.2, sy: 2.2, sz: 0.9, color: BAZALT }],
      ...[0.6, 1.2, 1.8].map((y) => ['box', { y, sx: 7.3, sy: 0.1, sz: 7.5, color: KIRECTASI }]),
      ['box', { x: -3.66, sx: 0.04, sy: 1.0, sz: 1.2, color: '#2a2523' }],
      ['box', { y: 2.2, sx: 7.3, sy: 0.1, sz: 7.5, color: KURSUN }],
    ]);
    crowd(k, 30, 0, 2.2, { cx: hx, cz: 0 });
    // Mesudiye Medresesi (kuzeyde), Zinciriye Medresesi (kuzeybatıda), Sülüklü Han
    k.compound(-1, k.groundY, -n - 2.5, 0, [
      ['box', { sx: 6, sy: 1.7, sz: 3.4, color: '#4a4441' }],
      ...[0.5, 1.1].map((y) => ['box', { y, sx: 6.05, sy: 0.08, sz: 3.45, color: KIRECTASI }]),
      ['dome', { x: -1.5, y: 1.7, sx: 1.3, sy: 0.9, sz: 1.3, color: KURSUN }],
      ['box', { x: 1.6, z: 1.72, sx: 1, sy: 1.4, sz: 0.06, color: '#2a2523' }],
    ]);
    k.compound(-n - 4, k.groundY, -6, 0.1, [
      ['box', { sx: 4, sy: 1.5, sz: 3, color: '#56504c' }],
      ['dome', { y: 1.5, sx: 1.2, sy: 0.8, sz: 1.2, color: KURSUN }],
    ]);
    k.compound(n + 4, k.groundY, -n - 8, 0, [
      ['box', { sx: 4.5, sy: 1.8, sz: 4.5, color: BAZALT }],
      ['box', { y: 0.9, sx: 4.55, sy: 0.08, sz: 4.55, color: KIRECTASI }],
    ]);
    // Dört Ayaklı Minare ve Şeyh Mutahhar (Kasım Padişah) Camii
    const [mx, mz] = [-6, n + 8];
    for (const [dx, dz] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) k.add('cyl', { x: mx + dx, z: mz + dz, sx: 0.22, sy: 1.0, color: '#3c3836' });
    k.add('box', { x: mx, y: k.groundY + 1.0, z: mz, sx: 1.1, sy: 3.4, sz: 1.1, color: BAZALT });
    for (const y of [1.6, 2.4, 3.2]) k.add('box', { x: mx, y: k.groundY + y, z: mz, sx: 1.13, sy: 0.08, sz: 1.13, color: KIRECTASI });
    k.add('box', { x: mx, y: k.groundY + 4.4, z: mz, sx: 0.6, sy: 0.5, sz: 0.6, color: '#524b47' });
    k.add('pyramid', { x: mx, y: k.groundY + 4.9, z: mz, sx: 0.8, sy: 0.4, color: KURSUN });
    k.compound(mx + 2.6, k.groundY, mz, 0, [['box', { sx: 2.6, sy: 1.6, sz: 2.2, color: '#4a4441' }], ['dome', { y: 1.6, sx: 1.6, sy: 1.1, sz: 1.6, color: KURSUN }]]);
    crowd(k, 20, 0, 2, { cx: mx, cz: mz + 2 });
    // Surp Giragos Ermeni Kilisesi ve Meryem Ana Süryani Kilisesi
    k.church(-n - 12, n + 4, { s: 1.5, ry: PI / 2, stone: '#56504c', roof: '#6a625b', spire: true });
    k.church(n + 14, n + 10, { s: 1.1, ry: 0, stone: '#5f5752', roof: '#6a625b' });
    // Diğer camiler (Nebi, Behram Paşa, Melik Ahmet Paşa)
    for (const [x, z] of [[n + 10, -n - 18], [-n - 16, -n - 10], [-n - 20, n + 18]]) {
      k.minaret(x, z, { s: 1.3, stone: KIRECTASI, lead: KURSUN });
      k.add('box', { x: x + 2, z, sx: 2.8, sy: 1.6, sz: 2.8, color: '#4a4441' });
      k.add('dome', { x: x + 2, y: k.groundY + 1.6, z, sx: 2.2, sy: 1.4, sz: 2.2, color: KURSUN });
    }
    // Sur içi: dar sokaklar ve avlulu bazalt evler, avlularda dut ve incir ağaçları
    const avoid = any(avoidRect(gx - 2, -90, gx + 2, 90), avoidRect(hx - 4.5, -4.5, hx + 4.5, 4.5), avoidRect(-5, -n - 5, 3, -n), avoidCircle(mx + 1, mz, 3.5),
      avoidCircle(-n - 4, -6, 3), avoidCircle(n + 4, -n - 8, 3.5), avoidRect(-80, n + 1, gx, n + 3));
    basaltHouses(k, k.scatter(760, n, n + 36, { spacing: 1.6, avoid }), { detailR: n + 16 });
    k.trees(k.scatter(120, n, n + 30, { avoid, spacing: 1.4 }), 'round', { scale: 1.1 });
    crowd(k, 80, R + 2, n + 1);
    // Uzakta Dağ Kapı ve şehir surları
    k.walls(-60, -n - 30, 60, -n - 30, { h: 2.6, thick: 0.8, towerStep: 5, towerW: 1.7, roundTowers: true, color: '#3f3a37', tower: '#36322f' });
    k.birds(6, 0, 0, n, 7, { color: '#f4f4f0', wing: '#2b2724' });
    return {};
  };

  /* ---------------------------------------------- SELİMİYE: Edirne */
  AU.ENVIRONMENTS.selimiye = function (k, { R }) {
    const n = R + 2.5;
    // Külliye bahçesi (cami bir tepenin üstünde, etrafı yeşil)
    k.patch(0, 0, (n + 6) * 2, (n + 6) * 2, '#7fa058', 0, undefined, true);
    k.trees(k.scatter(60, R + 2, n + 5, { spacing: 1.6 }), 'round', { scale: 1.3 });
    crowd(k, 70, R + 2, n + 5);
    k.benches(k.scatter(14, R + 2.5, n + 3, { spacing: 2 }).map((p) => ({ ...p, ry: p.a })));
    // Darülhadis ve Darülkurra medreseleri (köşelerde, kubbe sıralı)
    for (const [x, z] of [[-n - 3, -n - 1], [n + 3, -n - 1]]) {
      k.add('box', { x, z, sx: 4, sy: 1.1, sz: 4, color: '#e4dccb' });
      for (let i = -1.4; i <= 1.41; i += 0.7) k.add('dome', { x: x + i, y: k.groundY + 1.1, z: z + 1.6, sx: 0.55, sy: 0.4, sz: 0.55, color: '#8b98a5' });
      k.add('dome', { x, y: k.groundY + 1.1, z: z - 0.6, sx: 1.4, sy: 0.9, sz: 1.4, color: '#8b98a5' });
    }
    // Kavaflar (Selimiye) Arastası: caminin altında uzun kubbeli çarşı
    k.compound(0, k.groundY, n + 7, 0, [
      ['box', { sx: 14, sy: 1.2, sz: 1.8, color: '#e4dccb' }],
      ['gable', { y: 1.2, sx: 14.1, sy: 0.4, sz: 1.9, ry: PI / 2, color: '#8b98a5' }],
      ...[-6, -4, -2, 0, 2, 4, 6].map((x) => ['box', { x, z: 0.92, sx: 0.5, sy: 0.7, sz: 0.04, color: '#3a3632' }]),
    ]);
    crowd(k, 40, 0, 6, { cx: 0, cz: n + 8.6 });
    // Eski Cami (dokuz kubbeli) ve Üç Şerefeli Cami
    const ex = -n - 9, ez = n + 12;
    k.add('box', { x: ex, z: ez, sx: 5, sy: 1.8, sz: 5, color: '#d9c7a8' });
    for (const dx of [-1.6, 0, 1.6]) for (const dz of [-1.6, 0, 1.6]) k.add('dome', { x: ex + dx, y: k.groundY + 1.8, z: ez + dz, sx: 1.4, sy: 1.0, sz: 1.4, color: '#8b98a5' });
    k.minaret(ex - 2.9, ez + 2.5, { s: 1.3 });
    k.minaret(ex + 2.9, ez + 2.5, { s: 1.3 });
    k.mosque(n + 10, n + 14, { s: 1.8, minarets: 4, ry: PI, court: true, balconies: 3 });
    // Rüstem Paşa Kervansarayı, Makedonya Kulesi
    k.compound(n + 22, k.groundY, n + 2, 0.2, [
      ['box', { sx: 8, sy: 1.8, sz: 3, color: '#c9a079' }],
      ...[0.7, 1.2].map((y) => ['box', { y, sx: 8.05, sy: 0.08, sz: 3.05, color: '#e4dccb' }]),
      ['gable', { y: 1.8, sx: 8.1, sy: 0.6, sz: 3.1, ry: PI / 2, color: '#a5512f' }],
    ]);
    k.add('box', { x: -n - 18, z: n + 24, sx: 1.8, sy: 4.2, sz: 1.8, color: '#a89a82' });
    k.add('pyramid', { x: -n - 18, y: k.groundY + 4.2, z: n + 24, sx: 1.9, sy: 1.1, color: '#8b98a5' });
    // Saraçlar Caddesi ve trafik
    k.road(-70, n + 10, 70, n + 10, 2.2);
    k.traffic([-60, n + 10, 60, n + 10], 7);
    // Edirne evleri: cumbalı, kiremit çatılı
    const avoid = any(avoidCircle(0, 0, n + 6.5), avoidRect(-8, n + 5.5, 8, n + 11.4), avoidCircle(ex, ez, 4.5), avoidCircle(n + 10, n + 14, 8),
      avoidCircle(n + 22, n + 2, 5.5), avoidRect(-80, n + 8.8, 80, n + 11.2), avoidCircle(-n - 18, n + 24, 2.5));
    k.houses(k.scatter(780, n + 6, n + 38, { spacing: 1.5, avoid }), {
      colors: PALETTE.edirne, roofColors: PALETTE.tiles, w: [1.1, 1.9], h: [1.4, 3], roof: 'hip', windows: '#3e3a36', detailR: n + 18, chimneys: true,
    });
    k.trees(k.scatter(160, n + 6, n + 34, { avoid, spacing: 1.3 }), 'round', { scale: 1.3 });
    // Meriç Nehri ve tarihi Meriç Köprüsü (uzakta, sisin içinde)
    k.water(0, -n - 30, 200, 9, k.groundY + 0.008, '#5f97b0');
    bridge(k, 10, -n - 24.5, 10, -n - 35.5, { span: 1.4, w: 1.8, h: 1.1, color: '#cbbfa8', pier: '#b5a990' });
    k.trees(k.line(-80, -n - 25, 80, -n - 25, 1.4), 'poplar', { scale: 1.2 });
    k.birds(8, 0, -1, n, 9);
    return {};
  };
})();
