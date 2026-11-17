/* =========================================================
   ANIT USTASI — Zor bölümlerin çevreleri
   Efes, Göbeklitepe, Petra, Machu Picchu, Borobudur
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, temple, triumphalArch, crowd } = AU.envUtil;
  const PI = Math.PI;

  /* ---------------------------------------------- EFES */
  AU.ENVIRONMENTS.celsus = function (k, { R }) {
    const n = R + 2.5;
    // Kütüphane meydanı (mermer döşeme) ve turist kalabalığı
    k.patch(0, 2, (n + 4) * 2, (n + 4) * 2, '#d9d0bd', 0, undefined, true);
    crowd(k, 170, R + 2, n + 4);
    // Mazeus-Mithridates Kapısı (kütüphanenin sağında, üç kemerli)
    triumphalArch(k, n + 2.5, -1, { s: 1.1, color: '#e3dac6' });
    // Kuretler Caddesi: yukarı doğru uzanan mermer yol, iki yanında sütunlar
    const sx = -2, sz = -n - 1;
    k.patch(sx - 6, sz - 12, 3.4, 30, '#d4cab5', 0.45);
    for (const side of [-1, 1]) {
      for (const p of k.line(sx + side * 1.9, sz, sx - 12 + side * 1.9, sz - 26, 1.6)) {
        if (k.rand() < 0.25) continue;
        const h = k.rand() < 0.3 ? k.range(0.4, 1.2) : 2.2;
        k.add('cyl', { x: p.x, z: p.z, sx: 0.24, sy: h, color: '#e8e0cf' });
        if (h > 2) k.add('box', { x: p.x, y: k.groundY + h, z: p.z, sx: 0.36, sy: 0.12, sz: 0.36, color: '#d9cfba' });
      }
    }
    k.people(k.line(sx - 0.5, sz - 1, sx - 12, sz - 25, 0.6).filter(() => k.rand() < 0.6));
    // Hadrian Tapınağı (kemerli cephe) ve yamaçtaki Yamaç Evler'in koruma çatısı
    k.compound(sx - 4, k.groundY, sz - 8, 0.45, [
      ['box', { sx: 2, sy: 0.3, sz: 1.2, color: '#d4cab5' }],
      ...[-0.8, -0.27, 0.27, 0.8].map((x) => ['cyl', { x, y: 0.3, z: 0.4, sx: 0.18, sy: 1.5, color: '#ece4d2' }]),
      ['box', { y: 1.8, z: 0.4, sx: 2, sy: 0.25, sz: 0.3, color: '#e3dac6' }],
      ['dome', { y: 1.8, z: 0.4, sx: 0.9, sy: 0.5, sz: 0.25, color: '#e3dac6' }],
    ]);
    k.add('box', { x: sx - 1, y: k.groundY + 2.6, z: sz - 14, sx: 8, sy: 0.15, sz: 5, ry: 0.45, color: '#cfd4d8' });
    // Ticaret Agorası: sütun kalıntılarıyla çevrili büyük kare
    const ax = n + 9, az = 4;
    k.patch(ax, az, 12, 12, '#c9bd9e');
    for (const p of k.line(ax - 6, az - 6, ax + 6, az - 6, 1.2).concat(k.line(ax - 6, az + 6, ax + 6, az + 6, 1.2), k.line(ax - 6, az - 6, ax - 6, az + 6, 1.2))) {
      if (k.rand() < 0.4) continue;
      k.add('cyl', { x: p.x, z: p.z, sx: 0.22, sy: k.rand() < 0.4 ? 0.6 : 1.9, color: '#e3dac6' });
    }
    // Büyük Tiyatro: Panayırdağı yamacına oyulmuş dev yarım daire (25.000 kişilik)
    const tx = n + 14, tz = -n - 10;
    k.add('hill', { x: tx + 4, z: tz - 6, sx: 30, sy: 9, sz: 22, color: '#a59a77' });
    for (let i = 0; i < 9; i++) {
      for (let a = -PI / 2; a <= PI / 2; a += PI / 20) {
        const r = 7 - i * 0.6;
        k.add('box', { x: tx + Math.sin(a) * r, y: k.groundY + i * 0.4, z: tz - Math.cos(a) * r, sx: 1.1, sy: 0.4, sz: 0.6, ry: -a, color: i % 2 ? '#d7cfbd' : '#cfc5ae' });
      }
    }
    k.add('box', { x: tx, z: tz + 1.6, sx: 9, sy: 2.2, sz: 0.8, color: '#c9b79a' });
    crowd(k, 60, 0, 5, { cx: tx, cz: tz - 2 });
    // Liman Caddesi (Arkadiane) uzakta, Bülbüldağı, zeytin ve çam ağaçları
    k.patch(tx + 6, n + 16, 3, 40, '#d4cab5', PI / 2 - 0.2);
    k.hills(k.scatter(10, n + 22, n + 40, { arc: [PI * 0.8, PI * 1.6], spacing: 10 }), '#8f9a6a', [8, 14], [2.5, 5]);
    const avoid = any(avoidCircle(0, 2, n + 4.5), avoidCircle(n + 2.5, -1, 3), avoidRect(sx - 16, sz - 28, sx + 3, sz + 1),
      avoidCircle(ax, az, 7.5), avoidCircle(tx, tz - 3, 11));
    k.trees(k.scatter(220, n + 3, n + 36, { spacing: 1.3, avoid }), 'olive', { scale: 1.1 });
    k.trees(k.scatter(80, n + 6, n + 36, { spacing: 1.8, avoid }), 'pine', { scale: 0.8 });
    k.rocks(k.scatter(80, n + 3, n + 20, { avoid }), { scale: 0.45, colors: ['#e3dac6', '#d4cab5', '#c9bfa8'] });
    k.birds(6, 0, 0, n, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- GÖBEKLİTEPE */
  AU.ENVIRONMENTS.gobeklitepe = function (k, { R }) {
    const n = R + 2.5;
    // Kazı alanını çevreleyen ahşap ziyaretçi yürüyüş yolu
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * PI * 2;
      const r = n + 0.6;
      k.add('box', { x: Math.sin(a) * r, y: k.groundY + 0.5, z: Math.cos(a) * r, sx: 1.6, sy: 0.08, sz: 1.3, ry: a, color: '#9a7a55' });
      if (i % 2 === 0) k.add('cyl', { x: Math.sin(a) * (r + 0.6), y: k.groundY, z: Math.cos(a) * (r + 0.6), sx: 0.06, sy: 1.0, color: '#7a5a3a' });
      k.add('cyl', { x: Math.sin(a) * r, y: k.groundY, z: Math.cos(a) * r, sx: 0.1, sy: 0.5, color: '#6b4a2f' });
    }
    k.people(k.scatter(80, n + 0.1, n + 1.1).map((p) => ({ ...p, y: k.groundY + 0.58 })));
    // Germuş sırtının kuru, dalgalı tepeleri ve buğday tarlaları
    k.hills(k.scatter(30, n + 6, n + 42, { spacing: 6 }), '#c2a978', [5, 11], [0.8, 2.4]);
    for (const p of k.scatter(30, n + 4, n + 36, { spacing: 5 })) {
      k.patch(p.x, p.z, k.range(5, 9), k.range(4, 8), k.pick(['#d6bb7c', '#cdb06d', '#b9a06a', '#a48c5c']), k.range(0, 3));
    }
    // Ünlü "Dilek Ağacı" (tepedeki yalnız dut ağacı)
    k.add('hill', { x: -n - 6, z: -n - 4, sx: 8, sy: 2.4, sz: 7, color: '#bba36f' });
    k.trees([{ x: -n - 6, z: -n - 4, y: k.groundY + 1.1 }], 'round', { scale: 2 });
    k.people(k.scatter(10, 1.2, 2.6, { cx: -n - 6, cz: -n - 4 }).map((p) => ({ ...p, y: k.groundY + 1 })));
    // Ziyaretçi merkezi (yuvarlak modern bina), otopark ve otobüsler
    const vx = n + 10, vz = n + 6;
    k.add('cyl', { x: vx, z: vz, sx: 6, sy: 1.6, color: '#d8d2c4' });
    k.add('cyl', { x: vx, y: k.groundY + 1.6, z: vz, sx: 6.4, sy: 0.15, color: '#8d8a84' });
    k.road(vx - 4, vz + 4, -n - 30, n + 20, 2);
    k.patch(vx + 6, vz - 2, 6, 5, '#7a7470');
    k.cars(k.grid(vx + 4, vz - 4, vx + 8, vz, 1.2).map((p) => ({ ...p, ry: 0 })));
    for (const x of [vx + 4.5, vx + 7]) {
      k.compound(x, k.groundY, vz + 1.6, 0, [
        ['box', { y: 0.12, sx: 0.9, sy: 0.85, sz: 3.2, color: '#f2f2ef' }],
        ['box', { y: 0.5, sx: 0.92, sy: 0.3, sz: 3.0, color: '#2b3640' }],
        ['box', { y: 0.12, sx: 0.92, sy: 0.18, sz: 3.22, color: '#2c3e50' }],
      ]);
    }
    // Antep fıstığı ve zeytin bahçeleri, koyun sürüleri
    const avoid = any(avoidCircle(0, 0, n + 2), avoidCircle(vx, vz, 7), avoidCircle(-n - 6, -n - 4, 5));
    for (const c of k.scatter(6, n + 8, n + 30, { spacing: 8, avoid })) {
      k.trees(k.grid(c.x - 3, c.z - 3, c.x + 3, c.z + 3, 1.5), 'olive', { scale: 0.8, colors: ['#7f9a5a', '#8aa463'] });
    }
    for (const herd of k.scatter(3, n + 6, n + 20, { spacing: 8, avoid })) {
      for (const p of k.scatter(14, 0, 2.2, { cx: herd.x, cz: herd.z, spacing: 0.5 })) {
        k.compound(p.x, k.groundY, p.z, k.range(0, 6), [
          ['ball', { y: 0.12, sx: 0.5, sy: 0.32, sz: 0.36, color: '#f1eee6' }],
          ['ball', { z: 0.24, y: 0.22, sx: 0.14, sy: 0.14, sz: 0.16, color: '#2f2a26' }],
        ]);
      }
    }
    k.hills(k.scatter(8, n + 34, n + 46, { spacing: 12 }), '#b49b6c', [12, 18], [3, 5]);
    k.birds(5, 0, 0, n + 2, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- PETRA: Siq kanyonu */
  AU.ENVIRONMENTS.petra = function (k, { R }) {
    const n = R + 2.5;
    // Hazine meydanı: kum zemin, develer, eşekler, bedevi tezgâhları, turistler
    k.patch(0, 2, (n + 3) * 2, (n + 3) * 2, '#d4a682', 0, undefined, true);
    crowd(k, 140, R + 2, n + 3);
    for (const p of k.scatter(10, n - 1, n + 3, { arc: [-1.3, 1.3], spacing: 2 })) {
      const ry = k.range(0, 6);
      k.compound(p.x, k.groundY, p.z, ry, [
        ...[[-0.2, -0.35], [0.2, -0.35], [-0.2, 0.35], [0.2, 0.35]].map(([dx, dz]) => ['cyl', { x: dx, z: dz, sx: 0.09, sy: 0.78, color: '#9a7046' }]),
        ['ball', { y: 0.68, sx: 0.55, sy: 0.45, sz: 1.1, color: '#b08455' }],
        ['ball', { y: 0.95, sx: 0.42, sy: 0.42, sz: 0.5, color: '#a77a4c' }],
        ['taper', { y: 0.85, z: 0.58, sx: 0.18, sy: 0.65, rx: 0.4, color: '#b08455' }],
        ['ball', { y: 1.4, z: 0.82, sx: 0.2, sy: 0.18, sz: 0.36, color: '#a77a4c' }],
        ['box', { y: 1.0, sx: 0.6, sy: 0.08, sz: 0.5, color: k.pick(['#c0392b', '#8e44ad', '#16a085']) }],
      ]);
    }
    for (const p of k.line(-n + 1, n - 2, -n + 6, n + 2, 1.1)) {
      k.add('box', { x: p.x, z: p.z, sx: 0.7, sy: 0.5, sz: 0.6, color: '#7a5a3a' });
      k.add('gable', { x: p.x, y: k.groundY + 0.85, z: p.z, sx: 0.8, sy: 0.25, sz: 0.7, color: k.pick(['#c0392b', '#2c3e50', '#d35400']) });
    }
    // Kanyon duvarları: her yanı saran pembe kumtaşı kayalıklar (önde Siq geçidi)
    const cliffs = ['#c48568', '#b97a5e', '#cf9273', '#a96c52'];
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * PI * 2;
      if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.12) continue; // Siq girişi (kamera tarafında)
      const r = n + 4 + k.range(0, 3);
      k.add('rock', { x: Math.sin(a) * r, z: Math.cos(a) * r, sx: k.range(4, 7), sy: k.range(10, 18), sz: k.range(3, 6), ry: a + k.range(-0.3, 0.3), color: k.pick(cliffs) });
    }
    // Siq: kameranın arkasında daralan dar kanyon
    for (let z = n + 5; z < n + 40; z += 2.2) {
      for (const side of [-1, 1]) k.add('rock', { x: side * k.range(2.2, 3), z, sx: 3, sy: k.range(12, 20), sz: 3, ry: k.range(0, 3), color: k.pick(cliffs) });
    }
    // Uzakta "Cepheler Caddesi": kayaya oyulmuş diğer mezar cepheleri
    for (const p of k.line(-n - 7, -n - 2, n + 7, -n - 9, 3.2)) {
      k.compound(p.x, k.groundY, p.z, 0, [
        ['box', { sx: 1.8, sy: 3.4, sz: 0.3, color: '#b97a5e' }],
        ['box', { y: 0.2, z: 0.16, sx: 0.6, sy: 1.2, sz: 0.04, color: '#3a2620' }],
        ['pyramid', { y: 3.4, sx: 1.6, sy: 0.5, sz: 0.3, color: '#c48568' }],
      ]);
    }
    k.rocks(k.scatter(60, n, n + 4), { scale: 0.7, colors: cliffs });
    // Gece "Petra by Night": meydanı dolduran kese kâğıdında mumlar
    for (const p of k.scatter(260, R + 1.6, n + 3, { spacing: 0.45 })) {
      k.add('box', { x: p.x, z: p.z, sx: 0.12, sy: 0.14, sz: 0.12, color: '#e8d9b8' });
      k.add('lampHead', { x: p.x, y: k.groundY + 0.1, z: p.z, sx: 0.08, color: '#ffd27a' });
    }
    k.birds(4, 0, 0, n, 11, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return { pedestalColor: '#a96c52' };
  };

  /* ---------------------------------------------- MACHU PICCHU: And Dağları */
  AU.ENVIRONMENTS.machupicchu = function (k, { R }) {
    const n = R + 2.5;
    const low = -14; // Urubamba vadisi
    // Kentin üzerinde durduğu dağ sırtı: dik yamaçlı, yeşil
    const ridge = new k.THREE.CylinderGeometry(n + 2, n + 16, -low, 32, 4, true);
    const pos = ridge.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (Math.abs(y) < -low / 2 - 0.01) {
        const f = 1 + Math.sin(pos.getX(i) * 0.4) * 0.07 + Math.cos(pos.getZ(i) * 0.5) * 0.07;
        pos.setXYZ(i, pos.getX(i) * f, y, pos.getZ(i) * f);
      }
    }
    ridge.computeVertexNormals();
    ridge.translate(0, (k.groundY + low) / 2, 0);
    k.mesh(ridge, k.mat('#4f7a3a', { side: k.THREE.DoubleSide }));
    k.mesh(new k.THREE.CircleGeometry(n + 2, 32).rotateX(-PI / 2), k.mat('#6f9a4a'), 0, k.groundY - 0.005, 0);
    // Yamaçlara basamak basamak tarım terasları
    for (let t = 0; t < 7; t++) {
      const r = n + 2.6 + t * 1.6;
      const y = k.groundY - 1.1 - t * 1.5;
      for (let a = 0; a < PI * 2; a += PI / 26) {
        if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a)) - PI * 0.85) < 0.5) continue;
        k.add('box', { x: Math.sin(a) * r, y, z: Math.cos(a) * r, sx: r * 0.13, sy: 0.6, sz: 0.9, ry: a, color: t % 2 ? '#6f9a4a' : '#678f45' });
      }
    }
    // Lamalar ve turistler (düzlükte)
    crowd(k, 90, R + 2, n + 1.8);
    for (const p of k.scatter(14, R + 2, n + 1.6, { spacing: 1.2 })) {
      k.compound(p.x, k.groundY, p.z, k.range(0, 6), [
        ...[[-0.1, -0.2], [0.1, -0.2], [-0.1, 0.2], [0.1, 0.2]].map(([x, z]) => ['cyl', { x, z, sx: 0.05, sy: 0.32, color: '#8a6a45' }]),
        ['ball', { y: 0.3, sx: 0.28, sy: 0.24, sz: 0.55, color: k.pick(['#f1eee6', '#c9a77c', '#6b4a2f']) }],
        ['taper', { y: 0.42, z: 0.24, sx: 0.08, sy: 0.4, color: '#f1eee6' }],
        ['ball', { y: 0.8, z: 0.28, sx: 0.11, sy: 0.1, sz: 0.18, color: '#f1eee6' }],
      ]);
    }
    // Huayna Picchu: arkada yükselen sivri yeşil zirve (üstünde de teraslar)
    k.add('cone', { x: 2, y: low, z: -n - 16, sx: 18, sy: 30, sz: 14, color: '#4f7a3a' });
    for (let i = 0; i < 4; i++) k.add('disc', { x: 2, y: low + 22 + i * 1.6, z: -n - 16, sx: 5 - i * 1.1, sy: 0.4, color: '#6f9a4a' });
    // Çevredeki dik And Dağları ve vadide akan Urubamba Nehri
    for (const p of k.scatter(22, n + 24, n + 54, { spacing: 10 })) {
      k.add('cone', { x: p.x, y: low, z: p.z, sx: k.range(14, 24), sy: k.range(18, 32), sz: k.range(12, 20), ry: k.range(0, 3), color: k.pick(['#3f6a32', '#4f7a3a', '#5a7f45', '#6f7f6a']) });
    }
    k.water(0, 0, 200, 200, low + 0.2, '#5d8a7a', true);
    // Yamaç yüzeyi yaklaşık 45° eğimli: yarıçap 1 artınca yükseklik 1 azalır
    k.trees(k.scatter(200, n + 4, n + 22).map((p) => ({ ...p, y: low + Math.max(0, n + 16 - p.r) - 0.3 })), 'jungle', { scale: 1.2 });
    // Yamaçtan geçen bulutlar (yavaşça sürüklenir)
    const clouds = new k.THREE.Group();
    const cmat = k.mat('#ffffff', { transparent: true, opacity: 0.7 });
    for (let i = 0; i < 14; i++) {
      const c = new k.THREE.Mesh(new k.THREE.IcosahedronGeometry(1, 1), cmat);
      const a = k.range(0, PI * 2), r = k.range(n + 6, n + 26);
      c.position.set(Math.sin(a) * r, k.range(-6, 1), Math.cos(a) * r);
      c.scale.set(k.range(3, 6), k.range(0.8, 1.4), k.range(2, 4));
      c.userData.a = a; c.userData.r = r;
      clouds.add(c);
    }
    k.group.add(clouds);
    k.onUpdate((dt, t) => { clouds.rotation.y = t * 0.01; });
    k.birds(4, 0, 0, n + 4, 6, { color: '#2b2724', wing: '#1d1a18', scale: 1.4 }); // kondorlar
    return { groundY: low };
  };

  /* ---------------------------------------------- BOROBUDUR: Kedu ovası */
  AU.ENVIRONMENTS.borobudur = function (k, { R }) {
    const n = R + 2.5;
    // Tapınak parkı: çimen, taş yollar, palmiyeler, turistler
    k.patch(0, 0, (n + 8) * 2, (n + 8) * 2, '#6fa04f', 0, undefined, true);
    for (const ry of [0, PI / 2]) k.patch(0, 0, 2.4, (n + 8) * 2, '#a39d8e', ry);
    crowd(k, 160, R + 2, n + 6, { avoid: (x, z) => Math.abs(x) < 1.2 || Math.abs(z) < 1.2 });
    k.people(k.line(-0.5, n, -0.5, n + 8, 0.6).concat(k.line(0.5, n, 0.5, n + 8, 0.7)));
    k.trees(k.scatter(60, n + 1, n + 7, { spacing: 2, avoid: (x, z) => Math.abs(x) < 1.6 || Math.abs(z) < 1.6 }), 'palm');
    k.bushes(k.scatter(60, R + 2, n + 5, { avoid: (x, z) => Math.abs(x) < 1.6 || Math.abs(z) < 1.6 }), { scale: 0.7, colors: ['#4f8a3a', '#d1262b', '#e86aa6'] });
    // Pawon ve Mendut tapınakları (aynı doğu-batı ekseninde küçük candi'ler)
    for (const [x, s] of [[n + 10, 1], [n + 22, 1.3]]) {
      k.compound(x, k.groundY, 1, 0, [
        ['box', { sx: 2.4, sy: 0.6, sz: 2.4, color: '#8f8a7e' }],
        ['box', { y: 0.6, sx: 1.8, sy: 1.4, sz: 1.8, color: '#7d786d' }],
        ['pyramid', { y: 2.0, sx: 1.9, sy: 0.6, color: '#8f8a7e' }],
        ['pyramid', { y: 2.6, sx: 1.3, sy: 0.5, color: '#7d786d' }],
        ['cone', { y: 3.1, sx: 0.4, sy: 0.6, color: '#8f8a7e' }],
      ], s);
    }
    // Pirinç tarlaları (sulu, basamaklı yeşil parseller) ve köyler
    for (const p of k.scatter(70, n + 9, n + 40, { spacing: 4 })) {
      k.patch(p.x, p.z, k.range(3, 5), k.range(2.5, 4), k.pick(['#7fbf4f', '#8fcf5f', '#6fae45', '#9cc8a8']), p.a);
    }
    const avoidTemples = any(avoidCircle(n + 10, 1, 3), avoidCircle(n + 22, 1, 4), avoidCircle(0, 0, n + 8.5));
    k.houses(k.scatter(160, n + 10, n + 38, { spacing: 2, avoid: avoidTemples }), {
      colors: ['#e9dcc6', '#d9c3a0', '#c9b79a'], roofColors: ['#9c4a2d', '#a5512f', '#7a3a24'], w: [1, 1.6], h: [0.8, 1.3], roof: 'hip', windows: '#4a3b30', detailR: n + 20,
    });
    // Cava ormanı ve hindistan cevizi palmiyeleri
    k.trees(k.scatter(360, n + 8, n + 40, { spacing: 1.6, avoid: avoidTemples }), 'jungle');
    k.trees(k.scatter(140, n + 8, n + 38, { spacing: 1.8, avoid: avoidTemples }), 'palm', { scale: 1.1 });
    // Merapi yanardağı (dumanlı) ve Menoreh tepeleri
    k.add('cone', { x: n + 30, z: -n - 30, sx: 40, sy: 22, sz: 36, color: '#6e7a62' });
    k.add('cone', { x: n + 30, y: k.groundY + 19, z: -n - 30, sx: 8, sy: 3, color: '#8a8a7e' });
    const smoke = new k.THREE.Group();
    const smat = k.mat('#e8e8e4', { transparent: true, opacity: 0.6 });
    for (let i = 0; i < 6; i++) {
      const s = new k.THREE.Mesh(new k.THREE.IcosahedronGeometry(1, 1), smat);
      s.position.set(n + 30 + i * 0.8, k.groundY + 23 + i * 1.6, -n - 30 - i * 0.4);
      s.scale.setScalar(1.6 + i * 0.6);
      smoke.add(s);
    }
    k.group.add(smoke);
    k.onUpdate((dt, t) => smoke.children.forEach((s, i) => { s.position.y = k.groundY + 23 + ((i * 1.6 + t * 0.4) % 10); }));
    k.hills(k.scatter(10, n + 30, n + 46, { arc: [PI * 0.9, PI * 1.9], spacing: 10 }), '#5f7f4a', [10, 16], [3, 6]);
    k.birds(6, 0, 0, n, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };
})();
