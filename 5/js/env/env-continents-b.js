/* =========================================================
   ANIT USTASI — Kıta eserlerinin çevreleri (2)
   Kuzey Amerika: Özgürlük Heykeli, Golden Gate, Empire State
   Güney Amerika: Kurtarıcı İsa, Las Lajas, Tiwanaku
   Okyanusya    : Sidney Opera Binası, Moai, Nan Madol
   Antarktika   : Port Lockroy, Terra Nova, Güney Kutbu
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, crowd, bridge } = AU.envUtil;
  const PI = Math.PI;

  // Gökdelenli şehir silueti (uzakta)
  function skyline(k, pts, o) {
    k.houses(pts, { colors: ['#9aa3ab', '#b8bec4', '#8a939b', '#c9c4ba', '#6f7a84'], roofColors: ['#6f7a84'], w: [1.4, 2.6], h: o.h || [5, 16], roof: 'flat', windows: '#ffd77a', detailR: 0, ...o });
  }
  // Penguen: siyah sırt, beyaz göğüs, turuncu gaga
  function penguins(k, pts, y) {
    for (const p of pts) {
      k.compound(p.x, y, p.z, k.range(0, 6), [
        ['ball', { sx: 0.2, sy: 0.32, sz: 0.18, color: '#1f1f22' }],
        ['ball', { z: 0.04, y: 0.02, sx: 0.15, sy: 0.26, sz: 0.12, color: '#f4f4f0' }],
        ['ball', { y: 0.3, sx: 0.12, color: '#1f1f22' }],
        ['cone', { y: 0.36, z: 0.07, sx: 0.04, sy: 0.08, rx: PI / 2, color: '#e87a2b' }],
      ]);
    }
  }
  // Doğrudan k.add('rock') kullanan sahneler için kaya geometrisini kaydet
  const ensureRock = (k) => k.lazyGeo('rock', () => new k.THREE.DodecahedronGeometry(0.5, 0).translate(0, 0.3, 0));

  function icebergs(k, pts) {
    ensureRock(k);
    for (const p of pts) k.add('rock', { x: p.x, y: k.groundY - 0.3, z: p.z, sx: k.range(2, 6), sy: k.range(1, 3.5), sz: k.range(2, 5), ry: k.range(0, 6), color: k.pick(['#e8f2f8', '#d6e8f2', '#f4f9fc']) });
  }

  /* ---------------------------------------------- ÖZGÜRLÜK HEYKELİ: Liberty Adası, Manhattan */
  AU.ENVIRONMENTS.liberty = function (k, { R }) {
    const n = R + 2.5;
    k.water(0, 0, 260, 260, -0.12, '#4f7f94', true);
    k.add('disc', { y: -0.29, sx: (n + 3) * 2, sy: 0.25, color: '#7a9a5a' });
    k.trees(k.scatter(40, R + 2, n + 2.5, { spacing: 1.5 }), 'round', { scale: 1.1 });
    crowd(k, 120, R + 2, n + 2.5, { y: 0 });
    k.boat([-n - 20, n + 6, n + 20, n + 10], { s: 1.4, hull: '#f4f4f0', deck: '#2c5a8a', speed: 1.2, y: -0.12 });
    k.boat([n + 30, -n - 4, -n - 30, -n - 10], { s: 1.6, hull: '#e67e22', deck: '#f2f2ee', speed: 0.9, y: -0.12 }); // Staten Island vapuru
    // Manhattan silueti (arkada, sisin içinde) ve Ellis Adası
    const mz = -(n + 22);
    k.add('box', { x: 0, y: -0.6, z: mz - 10, sx: 60, sy: 0.7, sz: 24, color: '#7d7d7d' });
    skyline(k, k.grid(-24, mz - 20, 24, mz + 1, 2.6, { jitter: 0.5, fill: 0.85 }).map((p) => ({ ...p, y: 0.1, ry: 0 })), { h: [4, 18] });
    k.add('box', { x: 0, y: 0.1, z: mz - 6, sx: 2.2, sy: 26, sz: 2.2, color: '#9fb6c8' }); // One World Trade Center
    k.add('cone', { x: 0, y: 26.1, z: mz - 6, sx: 0.4, sy: 5, color: '#cfd8df' });
    k.compound(n + 10, -0.2, -n - 2, 0, [['disc', { sx: 7, sy: 0.25, color: '#7a9a5a' }], ['box', { y: 0.25, sx: 4, sy: 1.4, sz: 2, color: '#c96f4a' }], ['dome', { y: 1.65, sx: 0.8, sy: 0.7, sz: 0.8, color: '#9fb6c8' }]]);
    k.birds(10, 0, 0, n, 9);
    return { hideGround: true, pedestalColor: '#7a9a5a' };
  };

  /* ---------------------------------------------- GOLDEN GATE: körfez, sis */
  AU.ENVIRONMENTS.goldengate = function (k, { R }) {
    const n = R + 2.5;
    ensureRock(k);
    k.water(0, 0, 260, 260, -0.12, '#3f6f88', true);
    // Köprü iki yana (kıyılara) uzanır
    for (const s of [-1, 1]) {
      for (let x = n; x < n + 30; x += 2.2) k.add('box', { x: s * x, y: 1.6, z: 0, sx: 2.3, sy: 0.22, sz: 1.1, color: '#8a3a2f' });
      for (let x = n; x < n + 30; x += 4.4) k.add('box', { x: s * x, z: 0, sx: 0.5, sy: 1.6, sz: 0.9, color: '#b0aaa0' });
    }
    // Kıyılar: Marin tepeleri (kuzey) ve San Francisco (güney)
    k.add('hill', { x: -n - 34, y: -0.5, z: -6, sx: 46, sy: 14, sz: 50, color: '#8a9a5a' });
    k.add('hill', { x: n + 34, y: -0.5, z: 4, sx: 46, sy: 8, sz: 50, color: '#7a8a55' });
    k.houses(k.scatter(260, 0, 1).map(() => ({ x: n + k.range(16, 46), z: k.range(-20, 26), y: 1.2, a: 0 })), { colors: ['#f2ece0', '#e9dcc6', '#d6c3a5', '#c9d3d6'], roofColors: ['#8a5a3a', '#6f7a84'], w: [1, 1.6], h: [1, 2.4], roof: 'hip', windows: '#4a3b30', face: false });
    // Alcatraz adası ve yelkenliler, kayan sis bulutu
    k.compound(14, -0.3, -n - 18, 0, [['rock', { sx: 8, sy: 1.6, sz: 4, color: '#7d7468' }], ['box', { y: 1.4, sx: 4, sy: 1.2, sz: 1.6, color: '#d9d2c2' }], ['cyl', { x: 2, y: 1.4, sx: 0.5, sy: 2.2, color: '#d9d2c2' }]]);
    for (let i = 0; i < 5; i++) k.boat([k.range(-30, 30), -n - k.range(4, 20), k.range(-30, 30), n + k.range(4, 20)], { s: 0.45, hull: '#f4f4f0', windows: false, speed: k.range(0.6, 1.2), y: -0.12 });
    const fog = new k.THREE.Group();
    const fm = k.mat('#ffffff', { transparent: true, opacity: 0.55 });
    for (let i = 0; i < 12; i++) {
      const c = new k.THREE.Mesh(new k.THREE.IcosahedronGeometry(1, 1), fm);
      c.position.set(-n - 20 + i * 4, k.range(3, 6), -n - 10 + k.range(-3, 3));
      c.scale.set(k.range(4, 7), k.range(1, 1.8), k.range(3, 5));
      fog.add(c);
    }
    k.group.add(fog);
    k.onUpdate((dt, t) => { fog.position.x = Math.sin(t * 0.05) * 8; });
    k.birds(8, 0, 0, n, 9);
    return { hideGround: true, pedestalColor: '#6f7a84' };
  };

  /* ---------------------------------------------- EMPIRE STATE: Manhattan ızgarası */
  AU.ENVIRONMENTS.empirestate = function (k, { R }) {
    const n = R + 2.5;
    // Manhattan cadde ızgarası: Fifth Avenue ve 34. Cadde, sarı taksiler
    k.road(0, -n - 40, 0, -n - 1, 3);
    k.road(0, n + 1, 0, n + 40, 3);
    k.road(-n - 40, n + 1, n + 40, n + 1, 2.6);
    k.road(-n - 40, -n - 1, n + 40, -n - 1, 2.6);
    k.traffic([0.8, -n - 36, 0.8, -n - 3], 4);
    k.traffic([0.8, n + 3, 0.8, n + 36], 4);
    k.traffic([-n - 36, n + 1, n + 36, n + 1], 6);
    for (const p of k.line(-0.8, -n - 30, -0.8, n + 30, 2.4).filter((q) => Math.abs(q.z) > n + 2)) k.cars([{ x: p.x, z: p.z + k.range(-0.3, 0.3), ry: PI }], { color: '#f2c94c', scale: 0.4 });
    crowd(k, 140, R + 2, n);
    // Gökdelenler: yakında tek tek pencereli, uzakta siluet; Chrysler Binası
    const avoid = any(avoidRect(-2, -90, 2, 90), avoidRect(-90, n - 0.4, 90, n + 2.4), avoidRect(-90, -n - 2.4, 90, -n + 0.4), avoidCircle(0, 0, n + 0.5));
    const blocks = k.grid(-n - 34, -n - 34, n + 34, n + 34, 3.2, { jitter: 0.2, avoid }).map((p) => ({ ...p, ry: 0 }));
    k.houses(blocks, { colors: ['#9aa3ab', '#b8bec4', '#c9c4ba', '#8a939b', '#d6cfc0', '#7d6a5a'], roofColors: ['#6f7a84', '#8a939b'], w: [2, 2.8], d: [2, 2.8], h: [2.5, 9], roof: 'flat', windows: '#ffd77a', detailR: n + 12, floorH: 0.6 });
    k.compound(-9, k.groundY, -n - 9, 0, [
      ['box', { sx: 2.2, sy: 8, sz: 2.2, color: '#cfc8b8' }],
      ...[0, 1, 2, 3, 4].map((i) => ['cyl', { y: 8 + i * 0.5, sx: 1.6 - i * 0.28, sy: 0.5, color: '#d9dde0' }]),
      ['cone', { y: 10.5, sx: 0.3, sy: 1.6, color: '#d9dde0' }],
    ]); // Chrysler Binası
    k.birds(8, 0, 0, n, 10, { color: '#9aa3ab', wing: '#5d666e', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- KURTARICI İSA: Rio, Tijuca Ormanı */
  AU.ENVIRONMENTS.cristo = function (k, { R }) {
    const n = R + 2.5;
    const low = -6;
    // Heykel dağın zirvesinde: aşağıda yağmur ormanı, şehir ve okyanus
    const hill = new k.THREE.CylinderGeometry(n + 1, n + 16, -low, 28, 3, true).translate(0, (k.groundY + low) / 2, 0);
    k.mesh(hill, k.mat('#3f6a38', { side: k.THREE.DoubleSide }));
    k.mesh(new k.THREE.CircleGeometry(n + 1, 28).rotateX(-PI / 2), k.mat('#5f7a52'), 0, k.groundY - 0.005, 0);
    crowd(k, 90, R + 2, n + 0.5);
    k.trees(k.scatter(260, n + 2, n + 16).map((p) => ({ ...p, y: low + Math.max(0, (n + 16 - p.r) / 15) * -low - 0.3 })), 'jungle', { scale: 1.2 });
    k.water(0, -n - 30, 260, 40, low + 0.05, '#3f86a6'); // Guanabara Körfezi / Atlantik
    k.houses(k.scatter(420, n + 16, n + 34, { arc: [-1.2, 1.2], spacing: 1.8 }).map((p) => ({ ...p, y: low })), { colors: ['#f2ece0', '#e9dcc6', '#f2c94c', '#d98c6a', '#9fb5c4', '#ffffff'], roofColors: ['#b45f38', '#9c4a2d'], w: [1.2, 2.2], h: [1.5, 6], roof: 'flat', windows: '#3a4552', detailR: 0 });
    k.add('cone', { x: 14, y: low, z: -n - 22, sx: 8, sy: 14, sz: 7, color: '#5f6b4a' }); // Şekerkamışı Dağı
    k.patch(0, -n - 10, 80, 3, '#e8d8b0', 0, low + 0.02); // Copacabana kumsalı
    k.birds(6, 0, 0, n, 8, { color: '#2b2724', wing: '#1d1a18', scale: 1.1 });
    return { groundY: low };
  };

  /* ---------------------------------------------- LAS LAJAS: Guáitara kanyonu */
  AU.ENVIRONMENTS.laslajas = function (k, { R }) {
    const n = R + 2.5;
    ensureRock(k);
    // Kanyon iki yana uzar; dipte nehir, yamaçlarda yeşillik
    k.water(0, 0, 4.4, 200, k.groundY + 0.01, '#6f9a8a');
    for (const s of [-1, 1]) {
      for (let z = -60; z <= 60; z += 4) {
        if (Math.abs(z) < n + 2) continue;
        k.add('rock', { x: s * k.range(3, 4.5), z, sx: k.range(3, 5), sy: k.range(3.5, 6), sz: 4.6, color: k.pick(['#6f6a5f', '#5f5a50', '#7a7468']) });
      }
      k.add('box', { x: s * (n + 20), y: k.groundY, z: 0, sx: 36, sy: 4, sz: 200, color: '#5f7a4a' });
    }
    k.trees(k.scatter(300, n + 4, n + 34, { avoid: (x) => Math.abs(x) < 5.5 }).map((p) => ({ ...p, y: 4 })), 'round', { scale: 1.2 });
    // Ziyaretçi yolu, adak levhaları ve Ipiales kasabası
    k.road(-2.2, n + 1, -6, n + 20, 1.4, { lines: false, color: '#9a948a' });
    crowd(k, 90, R + 2, n + 2);
    k.houses(k.scatter(160, n + 12, n + 32, { avoid: (x) => Math.abs(x) < 10, spacing: 1.8 }).map((p) => ({ ...p, y: 4 })), { colors: ['#f2ece0', '#e9dcc6', '#d98c6a'], roofColors: ['#b45f38'], w: [1, 1.8], h: [1, 2.2], roof: 'hip', windows: '#4a3b30', detailR: 0 });
    k.birds(6, 0, 0, n, 7, { color: '#2b2724', wing: '#1d1a18', scale: 0.9 });
    return {};
  };

  /* ---------------------------------------------- TİWANAKU: Altiplano */
  AU.ENVIRONMENTS.tiwanaku = function (k, { R }) {
    const n = R + 2.5;
    // Yüksek, kurak And platosu; uzakta karlı Illimani zirveleri
    k.patch(0, 0, (n + 4) * 2, (n + 4) * 2, '#a8946a', 0, undefined, true);
    for (const p of k.scatter(10, n + 26, n + 44, { arc: [PI * 0.6, PI * 1.4], spacing: 12 })) {
      const h = k.range(12, 20);
      k.add('cone', { x: p.x, z: p.z, sx: k.range(16, 26), sy: h, sz: 18, color: '#7a7466' });
      k.add('cone', { x: p.x, y: k.groundY + h * 0.6, z: p.z, sx: 7, sy: h * 0.4, color: '#f2f5f7' });
    }
    // Akapana piramidi (kalıntı tepe), Puma Punku taşları, lamalar
    k.add('hill', { x: -n - 6, z: -n - 3, sx: 14, sy: 4, sz: 12, color: '#8f7f62' });
    k.rocks(k.scatter(40, 0, 5, { cx: n + 8, cz: -n - 6 }), { scale: 0.7, colors: ['#a0705a', '#8f6a55'] });
    for (const p of k.scatter(24, n + 3, n + 16, { spacing: 1.2 })) {
      k.compound(p.x, k.groundY, p.z, k.range(0, 6), [
        ...[[-0.1, -0.2], [0.1, -0.2], [-0.1, 0.2], [0.1, 0.2]].map(([x, z]) => ['cyl', { x, z, sx: 0.05, sy: 0.32, color: '#8a6a45' }]),
        ['ball', { y: 0.3, sx: 0.28, sy: 0.24, sz: 0.55, color: k.pick(['#f1eee6', '#c9a77c', '#6b4a2f']) }],
        ['taper', { y: 0.42, z: 0.24, sx: 0.08, sy: 0.4, color: '#f1eee6' }],
        ['ball', { y: 0.8, z: 0.28, sx: 0.11, sy: 0.1, sz: 0.18, color: '#f1eee6' }],
      ]);
    }
    crowd(k, 60, R + 2, n + 3);
    k.houses(k.scatter(80, n + 16, n + 30, { arc: [-0.8, 0.8], spacing: 2 }), { colors: ['#b8865a', '#a87a52', '#c49562'], roofColors: ['#8a7a6a'], w: [1, 1.6], h: [0.9, 1.4], roof: 'gable', windows: '#3a2618', detailR: 0 });
    k.birds(3, 0, 0, n + 6, 12, { color: '#2b2724', wing: '#1d1a18', scale: 1.5 }); // And kondoru
    return {};
  };

  /* ---------------------------------------------- SİDNEY: liman ve Harbour Bridge */
  AU.ENVIRONMENTS.operahouse = function (k, { R }) {
    const n = R + 2.5;
    k.water(0, 0, 260, 260, -0.12, '#2f7aa0', true);
    k.add('box', { x: 0, y: -0.44, z: n * 0.5 + 6, sx: 16, sy: 0.4, sz: n + 14, color: '#b9a48a' }); // Bennelong Burnu
    crowd(k, 160, R + 2, n + 4, { avoid: (x, z) => Math.abs(x) > 7.5 || z < 1 }); // yalnız burnun üstünde
    // Harbour Bridge (çelik kemer köprü, solda)
    const bx = -n - 14;
    const arch = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, x = -12 + t * 24, y = 1.8 + Math.sin(t * PI) * 6;
      arch.push(['box', { x, y, sx: 1.1, sy: 0.3, sz: 1.6, color: '#6f7a84' }]);
      if (i % 2 === 0) arch.push(['box', { x, y: 1.9, sx: 0.08, sy: Math.max(0.1, y - 1.9), sz: 0.08, color: '#6f7a84' }]);
    }
    arch.push(['box', { y: 1.6, sx: 30, sy: 0.3, sz: 2, color: '#5d6670' }]);
    for (const x of [-13.5, 13.5]) arch.push(['box', { x, sx: 2, sy: 4.5, sz: 2.4, color: '#c9bfa8' }]);
    k.compound(bx, -0.1, -4, PI / 2, arch);
    // Merkez iş bölgesi gökdelenleri ve Kraliyet Botanik Bahçesi
    skyline(k, k.grid(-30, -n - 30, 10, -n - 8, 3, { jitter: 0.6, fill: 0.8 }).map((p) => ({ ...p, y: -0.1, ry: 0 })), { h: [4, 14] });
    k.add('box', { x: 0, y: -0.4, z: -n - 20, sx: 70, sy: 0.4, sz: 30, color: '#8a8478' });
    k.patch(n + 10, -n - 4, 20, 20, '#6f9a4c', 0, -0.05);
    k.trees(k.scatter(80, 0, 9, { cx: n + 10, cz: -n - 4 }).map((p) => ({ ...p, y: -0.05 })), 'round', { colors: ['#5f8a45', '#6f9a4f'] });
    k.boat([-40, n + 8, 40, n + 12], { s: 1.4, hull: '#2f8a4f', deck: '#f2c94c', speed: 1.3, y: -0.12 }); // Manly vapuru
    for (let i = 0; i < 6; i++) k.boat([k.range(-40, 40), n + k.range(14, 30), k.range(-40, 40), n + k.range(14, 30)], { s: 0.45, hull: '#f4f4f0', windows: false, speed: k.range(0.5, 1.2), y: -0.12 });
    k.birds(10, 0, 0, n, 8);
    return { hideGround: true, pedestalColor: '#b9a48a' };
  };

  /* ---------------------------------------------- MOAİ: Rapa Nui kıyısı */
  AU.ENVIRONMENTS.moai = function (k, { R }) {
    const n = R + 2.5;
    // Moailer denize sırtını döner: arkada Pasifik, önde çimenli yamaçlar ve Rano Raraku
    k.water(0, -n - 30, 260, 50, k.groundY + 0.006, '#2f6f9a');
    k.patch(0, -n - 4, 200, 4, '#3f3a36');
    k.rocks(k.line(-60, -n - 5.5, 60, -n - 5.5, 1.2), { scale: 1, colors: ['#3f3a36', '#4a4440'] });
    k.add('hill', { x: 4, z: n + 20, sx: 30, sy: 12, sz: 22, color: '#6f8a4a' }); // Rano Raraku
    for (const p of k.scatter(12, 0, 8, { cx: 4, cz: n + 14 })) k.compound(p.x, k.groundY, p.z, k.range(-0.4, 0.4), [['box', { sx: 0.4, sy: 1.2, sz: 0.35, color: '#7c7266' }], ['box', { y: 1.2, sx: 0.36, sy: 0.6, sz: 0.36, color: '#857b6e' }]]);
    for (const p of k.scatter(8, n + 2, n + 10, { arc: [-1.2, 1.2] })) k.add('box', { x: p.x, y: k.groundY, z: p.z, sx: 0.5, sy: 0.3, sz: 1.8, ry: k.range(0, 3), color: '#7c7266' }); // devrik moai
    k.hills(k.scatter(16, n + 6, n + 36, { arc: [-1.5, 1.5], spacing: 8 }), '#7a9a55', [5, 10], [1, 3]);
    crowd(k, 60, R + 2, n + 2);
    // Yabani atlar
    for (const p of k.scatter(10, n + 3, n + 14, { arc: [-1.4, 1.4], spacing: 2 })) {
      k.compound(p.x, k.groundY, p.z, k.range(0, 6), [
        ...[[-0.14, -0.3], [0.14, -0.3], [-0.14, 0.3], [0.14, 0.3]].map(([x, z]) => ['cyl', { x, z, sx: 0.07, sy: 0.6, color: '#5a3f2a' }]),
        ['ball', { y: 0.5, sx: 0.36, sy: 0.32, sz: 0.85, color: k.pick(['#6b4a2f', '#8a6a45', '#3a2a1e']) }],
        ['taper', { y: 0.7, z: 0.42, sx: 0.12, sy: 0.45, rx: 0.5, color: '#6b4a2f' }],
      ]);
    }
    k.birds(6, 0, -n, n, 8);
    return {};
  };

  /* ---------------------------------------------- NAN MADOL: mercan lagün */
  AU.ENVIRONMENTS.nanmadol = function (k, { R }) {
    const n = R + 2.5;
    ensureRock(k);
    k.water(0, 0, 260, 260, -0.12, '#3fa0b0', true);
    // Diğer bazalt adacıklar (uzaktan duvarlarıyla), mangrovlar, Pohnpei'nin yeşil dağları
    for (const p of k.scatter(26, n + 3, n + 30, { spacing: 5 })) {
      const s = k.range(2.4, 4.4);
      k.add('rock', { x: p.x, y: -0.4, z: p.z, sx: s, sy: 0.7, sz: s, color: '#8f8a7a' });
      for (const [dx, dz, r] of [[0, s / 2 - 0.2, 0], [0, -s / 2 + 0.2, 0], [s / 2 - 0.2, 0, PI / 2], [-s / 2 + 0.2, 0, PI / 2]]) {
        k.add('box', { x: p.x + dx, y: 0.2, z: p.z + dz, sx: s * 0.9, sy: k.range(0.4, 1.1), sz: 0.4, ry: r, color: '#3b3a3c' });
      }
    }
    k.trees(k.scatter(160, n + 3, n + 30).map((p) => ({ ...p, y: -0.05 })), 'round', { colors: ['#3f6f32', '#4f7f3a', '#2f5f2a'], scale: 1.1 });
    k.trees(k.scatter(60, n + 3, n + 30), 'palm');
    k.add('hill', { x: -10, y: -0.5, z: -n - 30, sx: 60, sy: 24, sz: 30, color: '#3f6a38' });
    k.boat([-30, n + 6, 30, n + 9], { s: 0.5, hull: '#7a5a3a', windows: false, speed: 0.7, y: -0.12 });
    crowd(k, 30, R + 2, n + 1.5);
    k.birds(6, 0, 0, n, 7);
    return { hideGround: true, pedestalColor: '#8f8a7a' };
  };

  /* ---------------------------------------------- PORT LOCKROY: Antarktika yarımadası */
  AU.ENVIRONMENTS.portlockroy = function (k, { R }) {
    const n = R + 2.5;
    k.water(0, 0, 260, 260, -0.12, '#2f5f78', true);
    // Goudier Adası: karla lekeli kayalık ada, üstünde penguen kolonisi
    k.add('disc', { y: -0.29, sx: (n + 3) * 2, sy: 0.25, color: '#5a5650' });
    for (const p of k.scatter(14, R + 2, n + 2.5, { spacing: 2 })) k.patch(p.x, p.z, k.range(1, 2.4), k.range(0.8, 1.8), '#eef3f6', k.range(0, 3), -0.035, true);
    penguins(k, k.scatter(70, R + 1.6, n + 2.5), -0.04);
    icebergs(k, k.scatter(18, n + 5, n + 34, { spacing: 6 }));
    // Karla kaplı sarp dağlar (Wiencke Adası) ve demirli kruvaziyer gemisi
    for (const p of k.scatter(12, n + 16, n + 42, { arc: [PI * 0.5, PI * 1.5], spacing: 9 })) {
      const h = k.range(10, 20);
      k.add('cone', { x: p.x, y: -0.3, z: p.z, sx: k.range(12, 20), sy: h, sz: 14, color: '#f2f6f9' });
      k.add('cone', { x: p.x + 1, y: -0.3, z: p.z + 2, sx: 6, sy: h * 0.6, color: '#5a5650' });
    }
    k.boat([n + 14, n + 4, n + 16, n + 6], { s: 3, hull: '#f4f4f0', deck: '#2c3e50', funnel: '#c0392b', speed: 0.05, y: -0.12 });
    k.boat([-n - 4, n + 6, n + 6, n + 3], { s: 0.4, hull: '#2b2b2e', windows: false, speed: 1.2, y: -0.12 }); // Zodiac
    k.people(k.scatter(16, R + 2, n + 2.5).map((p) => ({ ...p, y: -0.04 })), { scale: 0.13 });
    k.birds(6, 0, 0, n, 7, { color: '#f4f4f0', wing: '#3a3a3a' });
    return { hideGround: true, pedestalColor: '#5a5650' };
  };

  /* ---------------------------------------------- TERRA NOVA: Ross Adası, Erebus */
  AU.ENVIRONMENTS.terranova = function (k, { R }) {
    const n = R + 2.5;
    k.water(0, n + 18, 260, 30, k.groundY + 0.008, '#2f5f78');
    k.patch(0, 0, (n + 4) * 2, (n + 4) * 2, '#4a4642', 0, undefined, true);
    // Erebus Yanardağı (dumanlı) ve buz sahanlığı
    k.add('cone', { x: -8, z: -n - 30, sx: 50, sy: 26, sz: 40, color: '#e8eef2' });
    k.add('cone', { x: -8, y: k.groundY + 20, z: -n - 30, sx: 10, sy: 6, color: '#5a5650' });
    icebergs(k, k.scatter(14, n + 6, n + 30, { arc: [-1.2, 1.2], spacing: 7 }));
    k.rocks(k.scatter(60, n + 1, n + 12), { scale: 0.6, colors: ['#4a4642', '#3f3b38'] });
    penguins(k, k.scatter(30, n + 2, n + 6, { arc: [-0.8, 0.8] }), k.groundY);
    k.people(k.scatter(10, R + 2, n + 2), { scale: 0.13 });
    k.birds(4, 0, 0, n, 8, { color: '#f4f4f0', wing: '#3a3a3a' });
    return { pedestalColor: '#4a4642' };
  };

  /* ---------------------------------------------- GÜNEY KUTBU: kutup platosu */
  AU.ENVIRONMENTS.southpole = function (k, { R }) {
    const n = R + 2.5;
    // Bembeyaz ve dümdüz buz platosu: pist, kayak uçağı, antenler, bilim binaları
    k.patch(-n - 8, 0, 5, 80, '#e3e9ee');
    k.compound(-n - 8, k.groundY, -10, 0, [
      ['box', { sx: 0.9, sy: 0.8, sz: 5, color: '#c0392b' }], ['box', { y: 0.5, sx: 7, sy: 0.12, sz: 1, color: '#c0392b' }],
      ['box', { y: 0.6, z: -2.4, sx: 2.2, sy: 0.08, sz: 0.6, color: '#c0392b' }], ['box', { y: 0, sx: 0.12, sy: 0.4, sz: 5, color: '#5d6670' }],
    ]); // LC-130 kayaklı uçak
    for (const [x, z, w] of [[n + 6, -4, 3], [n + 10, 6, 4], [-6, -n - 10, 5]]) {
      k.add('box', { x, z, sx: w, sy: 1.6, sz: 2, color: k.pick(['#5f7590', '#c0392b', '#7d8a96']) });
    }
    k.compound(n + 14, k.groundY, -n - 6, 0, [['cyl', { sx: 1.2, sy: 2.4, color: '#e8e8e8' }], ['dome', { y: 2.4, sx: 1.4, sy: 1.0, sz: 1.4, color: '#e8e8e8' }]]); // teleskop
    k.add('dome', { x: 8, z: -n - 16, sx: 10, sy: 6, sz: 10, color: '#c9d3dc' }); // eski jeodezik kubbe (anı)
    for (const p of k.line(-n - 4, n + 2, n + 4, n + 2, 1.5)) k.add('cyl', { x: p.x, z: p.z, sx: 0.05, sy: 0.7, color: '#c0392b' }); // bayrak hattı
    k.people(k.scatter(14, R + 2, n + 3), { scale: 0.14 });
    return { pedestalColor: '#dfe6ec' };
  };
})();
