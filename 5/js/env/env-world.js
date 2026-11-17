/* =========================================================
   ANIT USTASI — Dünya çevreleri
   Notre-Dame (Paris), Aziz Vasil (Moskova), Tac Mahal (Agra)
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, PALETTE, bridge, crowd } = AU.envUtil;
  const PI = Math.PI;

  /* ---------------------------------------------- NOTRE-DAME: Île de la Cité, Seine */
  AU.ENVIRONMENTS.notredame = function (k, { R }) {
    const n = R + 2.5;
    // Katedral adanın üzerinde: Seine iki yandan akar (ada doğu-batı uzanır, cephe batıya bakar)
    const rx = n + 5;      // nehrin ada kıyısına uzaklığı
    const W = 7;           // nehir genişliği
    for (const side of [-1, 1]) {
      k.water(side * (rx + W / 2), 0, W, 200, k.groundY + 0.008, '#4f7f94');
      k.add('box', { x: side * rx, y: k.groundY - 0.6, z: 0, sx: 0.5, sy: 0.6, sz: 200, color: '#cfc4ad' });
      k.add('box', { x: side * (rx + W), y: k.groundY - 0.6, z: 0, sx: 0.5, sy: 0.6, sz: 200, color: '#cfc4ad' });
      // Rıhtım ağaçları ve sahafların (bouquinistes) yeşil kutuları
      k.trees(k.line(side * (rx + W + 1), -70, side * (rx + W + 1), 70, 2.2), 'round', { scale: 1.3 });
      for (const p of k.line(side * (rx + W + 0.45), -50, side * (rx + W + 0.45), 50, 1.1)) {
        k.add('box', { x: p.x, z: p.z, sx: 0.3, sy: 0.35, sz: 0.8, color: '#2f5a3a' });
      }
      k.trees(k.line(side * (rx - 1), -60, side * (rx - 1), 60, 2.4), 'round', { scale: 1.2 });
      k.boat([side * (rx + W * 0.3), -70, side * (rx + W * 0.3), 70], { s: 1.1, hull: '#f4f4f0', deck: '#9fc3d8', speed: 1.1 + side * 0.2 });
      k.boat([side * (rx + W * 0.7), 60, side * (rx + W * 0.7), -60], { s: 0.9, hull: '#2c3e50', deck: '#f2efe8', speed: 1.4 });
    }
    // Köprüler: Petit-Pont, Pont au Double, Pont d'Arcole, Pont Saint-Louis
    for (const [z, side] of [[n + 4, 1], [n + 1, -1], [-2, -1], [-n - 6, 1], [-n - 14, -1]]) {
      bridge(k, side * (rx - 0.6), z, side * (rx + W + 0.6), z, { span: W / 3, w: 2, h: 1, color: '#d4c9b2', pier: '#bdb29b' });
      k.traffic([side * (rx - 0.6), z, side * (rx + W + 0.6), z], 2, { scale: 0.32 });
    }
    // Katedral önündeki meydan (Parvis) ve Point Zéro, turistler
    k.patch(0, n + 6, 12, 12, '#cfc5b2');
    crowd(k, 160, R + 2, n + 10, { avoid: (x) => Math.abs(x) > rx - 1.4 });
    // Arkadaki Jean XXIII bahçesi
    k.patch(0, -n - 4, 8, 7, '#6f9a4c');
    k.trees(k.scatter(18, 0, 3.2, { cx: 0, cz: -n - 4 }), 'round', { scale: 1.2 });
    k.flowerBed(-1.8, -n - 4, 1.4, 1.4, ['#e86aa6', '#f5f1e6'], { round: true });
    k.flowerBed(1.8, -n - 4, 1.4, 1.4, ['#d1262b', '#f2c94c'], { round: true });
    // Ada üzerinde: Hôtel-Dieu (kuzeyde), Sainte-Chapelle ve Conciergerie kuleleri (batıda)
    k.houses([{ x: -rx + 3.2, z: n + 8, ry: 0 }], { colors: ['#e2d7c0'], roofColors: ['#5d6873'], w: [4.2, 4.2], d: [9, 9], h: [3, 3], roof: 'mansard', windows: '#3a4552' });
    k.compound(1, k.groundY, n + 24, 0, [
      ['box', { sx: 1.6, sy: 3.4, sz: 4, color: '#e2d7c0' }],
      ['gable', { y: 3.4, sx: 1.7, sy: 1.4, sz: 4.1, color: '#5d6873' }],
      ['pyramid', { y: 4.6, sx: 0.3, sy: 2.4, color: '#c9a646' }],
    ]);
    for (const dz of [0, 1.6, 3.2]) {
      k.add('cyl', { x: -rx + 1.6, z: n + 28 + dz, sx: 1.2, sy: 3.2, color: '#d9cdb3' });
      k.add('cone', { x: -rx + 1.6, y: k.groundY + 3.2, z: n + 28 + dz, sx: 1.3, sy: 1.6, color: '#4f5a66' });
    }
    // Haussmann binaları: krem taş cephe, mavi-gri mansard çatı, bacalar (ada üzerinde ve iki kıyıda)
    const haussmann = { colors: PALETTE.paris, roofColors: ['#5d6873', '#646e78', '#55606b'], w: [1.6, 2.4], h: [3.2, 4.2], roof: 'mansard', windows: '#3a4552', trim: '#f4ede0', detailR: n + 20, chimneys: true };
    const islandAvoid = any(avoidCircle(0, 0, n + 1), avoidRect(-6, n, 6, n + 12), avoidRect(-rx, n + 3, -rx + 5.5, n + 13),
      avoidRect(-1, n + 21, 3, n + 27), avoidRect(-rx, n + 27, -rx + 3, n + 33), avoidRect(-4.5, -n - 8, 4.5, -n));
    k.houses(k.grid(-rx + 1.6, -60, rx - 1.6, 70, 2.6, { jitter: 0.2, avoid: islandAvoid }).map((p) => ({ ...p, ry: 0 })), haussmann);
    const bankAvoid = (x) => Math.abs(x) < rx + W + 2.4;
    k.houses(k.scatter(700, n + 6, n + 40, { spacing: 2.2, avoid: bankAvoid }).map((p) => ({ ...p, ry: Math.round(p.a / (PI / 2)) * (PI / 2) })), haussmann);
    // Uzakta Panthéon kubbesi ve Eyfel Kulesi (batıda, sisin içinde)
    k.compound(rx + 18, k.groundY, -12, 0, [
      ['box', { sx: 5, sy: 2.6, sz: 6, color: '#e6dcc6' }],
      ['cyl', { y: 2.6, sx: 2.8, sy: 1.6, color: '#e6dcc6' }],
      ['dome', { y: 4.2, sx: 3, sy: 2.6, sz: 3, color: '#a7b0b8' }],
    ]);
    const ex = -10, ez = n + 46;
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      k.add('taper', { x: ex + dx * 2.2, z: ez + dz * 2.2, sx: 0.9, sy: 6, rx: -dz * 0.3, rz: dx * 0.3, color: '#7a6a55' });
    }
    k.add('box', { x: ex, y: k.groundY + 5.4, z: ez, sx: 4.6, sy: 0.5, sz: 4.6, color: '#7a6a55' });
    k.add('taper', { x: ex, y: k.groundY + 5.9, z: ez, sx: 2.6, sy: 9, color: '#7a6a55' });
    k.add('cone', { x: ex, y: k.groundY + 14.9, z: ez, sx: 0.8, sy: 4, color: '#7a6a55' });
    k.birds(10, 0, 0, n, 9, { color: '#9aa3ab', wing: '#5d666e', scale: 0.8 }); // güvercinler
    return {};
  };

  /* ---------------------------------------------- AZİZ VASİL: Kızıl Meydan, Kremlin */
  AU.ENVIRONMENTS.vasil = function (k, { R }) {
    const n = R + 2.5;
    const RED = '#a8432f', GREEN_ROOF = '#2f6f4f';
    // Kızıl Meydan: katedralin önünden kuzeye uzanan taş döşeli meydan
    k.patch(0, n + 18, 24, 44, '#6f6966');
    k.patch(0, 0, (n + 3) * 2, (n + 3) * 2, '#7a7470', 0, undefined, true);
    crowd(k, 220, R + 2, n + 30, { avoid: (x, z) => Math.abs(x) > 10 || z < -n });
    // Lobnoye Mesto (yuvarlak taş kürsü) ve Minin-Pojarski anıtı
    k.add('disc', { x: 2, z: n + 1.5, sx: 2.4, sy: 0.5, color: '#d8cfbe' });
    k.add('box', { x: -1.5, z: n + 0.5, sx: 1, sy: 1, sz: 1.6, color: '#a89f94' });
    k.add('person', { x: -1.5, y: k.groundY + 1, z: n + 0.5, sx: 0.3, sy: 0.55, sz: 0.25, color: '#6b5a3a' });
    // Kremlin duvarı (solda): kırlangıç kuyruğu mazgallı kırmızı tuğla, yeşil külahlı kuleler
    const kx = -11;
    for (const p of k.line(kx, -n - 20, kx, n + 44, 0.45)) {
      k.add('box', { x: p.x, y: k.groundY + 2.6, z: p.z, sx: 0.8, sy: 0.35, sz: 0.25, color: RED });
    }
    k.add('box', { x: kx, z: n + 12, sx: 0.8, sy: 2.6, sz: 64, color: RED });
    for (const z of [-n - 20, -n - 4, n + 12, n + 28, n + 44]) {
      k.add('box', { x: kx, z, sx: 1.6, sy: 4.2, sz: 1.6, color: RED });
      k.add('pyramid', { x: kx, y: k.groundY + 4.2, z, sx: 1.8, sy: 2.2, color: GREEN_ROOF });
    }
    // Spasskaya Kulesi (saatli, kırmızı yıldızlı)
    k.compound(kx, k.groundY, -2, 0, [
      ['box', { sx: 2.4, sy: 4.6, sz: 2.4, color: RED }],
      ['box', { y: 4.6, sx: 1.8, sy: 1.8, sz: 1.8, color: RED }],
      ['disc', { x: 0.91, y: 5.0, rz: PI / 2, sx: 1.2, sy: 0.05, sz: 1.2, color: '#f2ead8' }],
      ['oct', { y: 6.4, sx: 1.3, sy: 1.2, sz: 1.3, color: '#f2ead8' }],
      ['pyramid', { y: 7.6, sx: 1.4, sy: 3, color: GREEN_ROOF }],
      ['ball', { y: 10.6, sx: 0.4, color: '#d1262b' }],
    ]);
    // Lenin Anıtmezarı (basamaklı kırmızı-siyah granit)
    k.compound(kx + 2.2, k.groundY, n + 10, 0, [
      ['box', { sx: 2.8, sy: 0.9, sz: 4, color: '#6b2a24' }],
      ['box', { y: 0.9, sx: 2.2, sy: 0.5, sz: 3.2, color: '#2a2220' }],
      ['box', { y: 1.4, sx: 1.6, sy: 0.4, sz: 2.4, color: '#6b2a24' }],
      ['box', { y: 1.8, sx: 1, sy: 0.4, sz: 1.4, color: '#2a2220' }],
    ]);
    // Kremlin içinde: Büyük İvan Çan Kulesi ve altın kubbeli katedraller
    k.compound(kx - 8, k.groundY, -4, 0, [
      ['oct', { sx: 2.2, sy: 3, sz: 2.2, color: '#f2ead8' }],
      ['oct', { y: 3, sx: 1.8, sy: 3, sz: 1.8, color: '#f2ead8' }],
      ['oct', { y: 6, sx: 1.4, sy: 2.4, sz: 1.4, color: '#f2ead8' }],
      ['onion', { y: 8.4, sx: 1.5, sy: 1.8, sz: 1.5, color: '#d4a531' }],
    ]);
    for (const [x, z] of [[kx - 14, 2], [kx - 6, 6], [kx - 15, -9]]) k.onionChurch(x, z, { s: 1.4, domeColor: '#d4a531' });
    k.add('box', { x: kx - 10, z: n + 18, sx: 6, sy: 2.6, sz: 14, color: '#e9d9b5' });
    k.add('box', { x: kx - 10, y: k.groundY + 2.6, z: n + 18, sx: 6.1, sy: 0.3, sz: 14.1, color: GREEN_ROOF });
    k.trees(k.scatter(60, 0, 10, { cx: kx - 12, cz: -n - 10 }), 'spruce');
    // GUM (sağda): uzun cepheli, cam çatılı alışveriş merkezi
    const gx = 11;
    k.compound(gx + 3, k.groundY, n + 18, 0, [
      ['box', { sx: 6, sy: 3, sz: 40, color: '#e2d6bf' }],
      ...[-1.6, 0, 1.6].map((dx) => ['gable', { x: dx, y: 3, sx: 1.6, sy: 0.9, sz: 40, color: '#9fb3bf' }]),
      ...[-16, -8, 0, 8, 16].map((dz) => ['pyramid', { x: -2.8, z: dz, y: 3, sx: 1, sy: 1.4, color: GREEN_ROOF }]),
    ]);
    for (const p of k.line(gx - 0.02, n, gx - 0.02, n + 37, 1)) k.add('box', { x: p.x, y: k.groundY + 0.5, z: p.z, sx: 0.04, sy: 0.6, sz: 0.4, color: '#3a3632' });
    // Devlet Tarih Müzesi (meydanın kuzey ucu) ve Kazan Katedrali
    k.compound(0, k.groundY, n + 44, 0, [
      ['box', { sx: 14, sy: 3.6, sz: 5, color: '#b24a36' }],
      ...[-5.5, -2.5, 2.5, 5.5].map((dx) => ['box', { x: dx, y: 3.6, sx: 1.2, sy: 2.2, sz: 1.2, color: '#b24a36' }]),
      ...[-5.5, -2.5, 2.5, 5.5].map((dx) => ['pyramid', { x: dx, y: 5.8, sx: 1.3, sy: 1.6, color: '#f2ead8' }]),
    ]);
    k.onionChurch(gx - 1, n + 36, { s: 0.9, wall: '#c9583f', domeColor: '#2f8f5b' });
    // Arkada Moskova Nehri ve Büyük Moskvoretski Köprüsü, sağda Zaryadye Parkı
    const rz = -n - 9;
    k.water(0, rz - 4, 220, 8, k.groundY + 0.008, '#4f7487');
    k.road(-90, rz + 0.8, 90, rz + 0.8, 2.4);
    k.traffic([-80, rz + 0.8, 80, rz + 0.8], 8);
    bridge(k, 3, rz + 0.2, 3, rz - 8.2, { span: 2.8, w: 3, h: 1, color: '#9b9690', pier: '#7e7a75' });
    k.traffic([3, rz, 3, rz - 30], 4);
    k.patch(gx + 8, -n - 2, 14, 12, '#6f9a4c');
    k.hills([{ x: gx + 8, z: -n - 2 }], '#6f9a4c', [5, 6], [0.8, 1]);
    k.trees(k.scatter(50, 0, 6.5, { cx: gx + 8, cz: -n - 2 }), 'spruce');
    k.trees(k.scatter(30, 0, 6.5, { cx: gx + 8, cz: -n - 2 }), 'round', { colors: ['#9cbf5a', '#b2cc6a'] });
    // Moskova binaları
    const avoid = any(avoidRect(kx - 22, -90, kx + 1, 90), avoidRect(-11, -n - 15, gx + 7, n + 48), avoidRect(-90, rz - 9, 90, rz + 2.2), avoidCircle(gx + 8, -n - 2, 8));
    k.houses(k.scatter(700, n + 8, n + 46, { spacing: 1.9, avoid }), {
      colors: PALETTE.moscow, roofColors: ['#5d6b5c', '#7a6a5a', '#8d99a4', '#4f5f52'], w: [1.6, 2.6], h: [2.4, 4.4], roof: 'hip', windows: '#3a3a3a', detailR: n + 18, chimneys: true,
    });
    k.birds(8, 0, 0, n, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- TAC MAHAL: Çarbağ bahçesi, Yamuna */
  AU.ENVIRONMENTS.tajmahal = function (k, { R }) {
    const n = R + 2.5;
    const red = '#a8503a', redDark = '#8f412f', marble = '#f2ede4';
    // Çarbağ bahçesi: çimenler, ortadaki su kanalı, kırmızı taş yollar, servi sıraları
    k.patch(0, n + 11, 30, 24, '#6f9a4c');
    k.patch(0, n + 11, 3.4, 24, '#b9654b');
    k.water(0, n + 11, 1.2, 24, k.groundY + 0.02, '#5b9bd5');
    k.patch(0, n + 10, 30, 2.4, '#b9654b');
    k.water(0, n + 10, 28, 0.8, k.groundY + 0.022, '#5b9bd5');
    k.add('box', { x: 0, z: n + 10, sx: 3, sy: 0.25, sz: 3, color: marble });
    k.water(0, n + 10, 2.4, 2.4, k.groundY + 0.26, '#5b9bd5');
    for (const p of k.line(0, n, 0, n + 22, 1.6)) k.add('cyl', { x: p.x, z: p.z, sx: 0.06, sy: 0.5, color: '#e8f2fb' });
    for (const sx of [-1, 1]) {
      k.trees(k.line(sx * 2.2, n - 0.5, sx * 2.2, n + 22, 1.3), 'cypress');
      k.trees(k.line(sx * 7.5, n - 0.5, sx * 7.5, n + 22, 2.6), 'round', { scale: 1.2 });
      for (const zz of [n + 5, n + 16]) {
        k.trees(k.scatter(12, 0, 3.5, { cx: sx * 9, cz: zz }), 'round', { scale: 1.2 });
        k.flowerBed(sx * 4.6, zz, 2, 3.4, ['#e86aa6', '#f2c94c', '#d1262b'], {});
      }
    }
    crowd(k, 150, R + 2, n + 20, { avoid: (x) => Math.abs(x) < 1.8 });
    // Büyük Kapı (Darwaza-i Rauza)
    const gz = n + 24;
    k.compound(0, k.groundY, gz, 0, [
      ['box', { sx: 8, sy: 5, sz: 3, color: red }],
      ['box', { z: -1.52, sx: 3, sy: 4.2, sz: 0.06, color: marble }],
      ['box', { z: -1.56, sx: 2, sy: 3.2, sz: 0.06, color: '#3a2a22' }],
      ...[-3.5, -1.75, 0, 1.75, 3.5].map((dx) => ['dome', { x: dx, y: 5, sx: 0.7, sy: 0.6, sz: 0.7, color: marble }]),
      ...[-4, 4].map((dx) => ['oct', { x: dx, sx: 1, sy: 5.8, sz: 1, color: redDark }]),
      ...[-4, 4].map((dx) => ['dome', { x: dx, y: 5.8, sx: 1.1, sy: 0.9, sz: 1.1, color: marble }]),
    ]);
    // Cami (batı) ve Cevap (doğu): kırmızı kumtaşı, üç beyaz kubbe
    for (const sx of [-1, 1]) {
      k.compound(sx * (n + 2.5), k.groundY, -1, sx * PI / 2, [
        ['box', { sx: 7, sy: 0.6, sz: 3.6, color: redDark }],
        ['box', { y: 0.6, sx: 6, sy: 2.4, sz: 2.4, color: red }],
        ['box', { y: 0.6, z: -1.22, sx: 1.8, sy: 2.2, sz: 0.06, color: marble }],
        ['cyl', { y: 3, sx: 1.6, sy: 0.4, color: red }],
        ['dome', { y: 3.4, sx: 1.6, sy: 1.6, sz: 1.6, color: marble }],
        ...[-2, 2].map((dx) => ['dome', { x: dx, y: 3, sx: 1.1, sy: 1.1, sz: 1.1, color: marble }]),
        ...[-3, 3].map((dx) => ['oct', { x: dx, y: 0.6, sx: 0.5, sy: 3.2, sz: 0.5, color: redDark }]),
      ]);
    }
    // Çevre duvarları ve köşe köşkleri
    for (const sx of [-1, 1]) {
      k.add('box', { x: sx * (n + 9), z: n * 0.4, sx: 0.6, sy: 2.2, sz: n * 2.6 + 8, color: red });
      for (const z of [-n + 1, gz]) {
        k.add('oct', { x: sx * (n + 9), z, sx: 1.6, sy: 3.4, sz: 1.6, color: redDark });
        k.add('dome', { x: sx * (n + 9), y: k.groundY + 3.4, z, sx: 1.6, sy: 1.2, sz: 1.6, color: marble });
      }
    }
    // Arkada Yamuna Nehri, kayıklar ve karşı kıyıda Mehtab Bagh
    k.water(0, -n - 10, 200, 14, k.groundY + 0.008, '#7aa3b5');
    k.patch(0, -n - 2.6, 200, 1.4, '#c8b48f');
    k.boat([-40, -n - 7, 40, -n - 9], { s: 0.5, hull: '#7a5a3a', windows: false, speed: 0.8 });
    k.boat([40, -n - 13, -40, -n - 12], { s: 0.5, hull: '#7a5a3a', windows: false, speed: 0.6 });
    k.trees(Array.from({ length: 140 }, () => ({ x: k.range(-50, 50), z: -n - 19 - k.range(0, 18) })), 'round', { scale: 1.3 });
    // Tac Ganj çarşısı (kapının dışında), Agra şehri ve uzakta Agra Kalesi
    const avoid = any(avoidRect(-n - 9.5, -n - 1, n + 9.5, gz + 2), avoidRect(-90, -n - 40, 90, -n - 1));
    k.houses(k.scatter(700, n + 8, n + 42, { spacing: 1.7, avoid }), {
      colors: PALETTE.agra, roofColors: PALETTE.agra, w: [1.2, 2], h: [1.3, 3.2], roof: 'flat', windows: '#5e4434', detailR: n + 20,
    });
    k.people(k.scatter(80, gz + 3, gz + 14, { spacing: 0.5 }));
    k.trees(k.scatter(80, n + 10, n + 38, { avoid }), 'palm');
    k.walls(-n - 40, -n - 30, -n - 22, -n - 40, { h: 3, thick: 1, towerStep: 4, towerW: 2, roundTowers: true, color: red, tower: redDark });
    k.birds(8, 0, 0, n, 10, { color: '#3a3430', wing: '#2a2420', scale: 0.9 });
    return {};
  };
})();
