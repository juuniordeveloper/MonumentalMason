/* =========================================================
   ANIT USTASI — Antik dünya çevreleri
   Stonehenge, Giza, Akropolis, Roma Forumu, Chichén Itzá
   ========================================================= */

(function () {
  const AU = window.AU;
  const { avoidCircle, avoidRect, any, PALETTE, temple, triumphalArch, crowd } = AU.envUtil;
  const PI = Math.PI;

  /* ---------------------------------------------- STONEHENGE: Salisbury Ovası */
  AU.ENVIRONMENTS.stonehenge = function (k, { R }) {
    const n = R + 2.5;
    // Taşların çevresindeki ziyaretçi patikası ve halat çit
    k.patch(0, 0, (n + 1.2) * 2, (n + 1.2) * 2, '#b7ab88', 0, undefined, true);
    k.patch(0, 0, (n + 0.2) * 2, (n + 0.2) * 2, '#7f9a55', 0, undefined, true);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * PI * 2;
      k.add('cyl', { x: Math.sin(a) * (n - 0.3), z: Math.cos(a) * (n - 0.3), sx: 0.05, sy: 0.35, color: '#5a4630' });
    }
    crowd(k, 70, n + 0.4, n + 1.8);
    // Ova: farklı tonlarda çayır yamaları ve hendekli tümsek (henge) halkası
    for (const p of k.scatter(40, n + 3, n + 38)) {
      k.patch(p.x, p.z, k.range(6, 14), k.range(5, 12), k.pick(['#86a35f', '#748f4f', '#90ab68', '#7f9a55', '#9ab06c']), k.range(0, 3), undefined, true);
    }
    // "Avenue": taşlardan kuzeydoğuya uzanan antik tören yolu (paralel toprak setler)
    for (const dx of [-1.2, 1.2]) {
      for (const p of k.line(dx + 2, n + 1, dx + 14, n + 30, 0.9)) k.add('hill', { x: p.x, z: p.z, sx: 0.9, sy: 0.25, sz: 1.2, color: '#7b9653' });
    }
    // Mezar höyükleri (King Barrow Ridge) ve ağaç kuşağı
    k.hills(k.line(-n - 6, -n - 8, -n - 4, -n - 30, 3.2), '#6f8c4c', [1.4, 2.0], [0.55, 0.8]);
    k.hills(k.scatter(16, n + 4, n + 24, { spacing: 4 }), '#6f8c4c', [1.2, 2.2], [0.45, 0.8]);
    for (const p of k.line(-n - 10, -n - 4, -n - 9, -n - 34, 1.8)) {
      k.trees(k.scatter(4, 0, 1.2, { cx: p.x, cz: p.z }), 'round', { scale: 1.5 });
    }
    for (const c of k.scatter(8, n + 12, n + 32, { spacing: 7 })) k.trees(k.scatter(9, 0, 2.6, { cx: c.x, cz: c.z }), 'round', { scale: 1.4 });
    // A303 yolu ve trafiği (güneyde), çitler
    k.road(-90, -n - 14, 90, -n - 17, 2.2);
    k.traffic([-80, -n - 14, 80, -n - 17], 8);
    for (const p of k.line(-60, -n - 12.4, 60, -n - 15.4, 1.6)) k.add('cyl', { x: p.x, z: p.z, sx: 0.06, sy: 0.4, color: '#6b4a2f' });
    // Otlayan koyun sürüleri
    for (const herd of k.scatter(5, n + 4, n + 22, { spacing: 6 })) {
      for (const p of k.scatter(18, 0, 2.6, { cx: herd.x, cz: herd.z, spacing: 0.5 })) {
        k.compound(p.x, k.groundY, p.z, k.range(0, 6), [
          ['ball', { y: 0.12, sx: 0.5, sy: 0.32, sz: 0.36, color: '#f1eee6' }],
          ['ball', { z: 0.24, y: 0.22, sx: 0.14, sy: 0.14, sz: 0.16, color: '#2f2a26' }],
          ...[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]].map(([x, z]) => ['cyl', { x, z, sx: 0.04, sy: 0.14, color: '#2f2a26' }]),
        ]);
      }
    }
    k.hills(k.scatter(14, n + 26, n + 40, { spacing: 9 }), '#6c8750', [9, 15], [1.5, 3]);
    k.birds(5, 0, 0, n + 4, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- GİZA PLATOSU */
  AU.ENVIRONMENTS.giza = function (k, { R }) {
    const n = R + 2.5;
    // Kefren (tepesinde kaplama kalıntısı) ve Mikerinos, kraliçe piramitleri
    k.add('pyramid', { x: -n - 7, z: -n - 6, sx: 11, sy: 7.8, color: '#d8b57c' });
    k.add('pyramid', { x: -n - 7, y: k.groundY + 6.3, z: -n - 6, sx: 2.1, sy: 1.5, color: '#efe2c4' });
    k.add('pyramid', { x: -n + 2, z: -n - 19, sx: 6, sy: 4, color: '#d2ae74' });
    for (let i = 0; i < 3; i++) k.add('pyramid', { x: -n + 7 + i * 2.2, z: -n - 21, sx: 1.6, sy: 1.1, color: '#ccaa72' });
    // Vadi tapınağı ve geçit yolu
    k.add('box', { x: n + 2, z: 2, sx: 3, sy: 1.2, sz: 3, color: '#c9a66d' });
    k.patch(n / 2 + 1, 1, 0.9, n, '#cfae78', PI / 2);
    // Batı mezarlığı: ızgara düzeninde mastabalar
    const mast = k.grid(-n - 14, -n + 2, -n - 2, n - 2, 2.4, { jitter: 0.3, fill: 0.85, avoid: avoidCircle(-n - 7, -n - 6, 8) });
    k.houses(mast, { colors: ['#cfae78', '#c7a56e', '#d5b682'], w: [1.4, 2.0], d: [0.9, 1.3], h: [0.5, 0.9], roof: 'flat', face: false });
    // Kum tepeleri
    k.hills(k.scatter(30, n + 4, n + 38, { spacing: 5, arc: [PI * 0.5, PI * 1.9] }), '#d4ad72', [3, 9], [0.6, 1.8]);
    // Turistler, develer (binicili), at arabaları
    crowd(k, 90, R + 2, n + 4);
    for (const p of k.scatter(12, n, n + 8, { arc: [PI * 1.1, PI * 1.9], spacing: 2 })) {
      const ry = k.range(0, 6);
      k.compound(p.x, k.groundY, p.z, ry, [
        ...[[-0.2, -0.35], [0.2, -0.35], [-0.2, 0.35], [0.2, 0.35]].map(([dx, dz]) => ['cyl', { x: dx, z: dz, sx: 0.09, sy: 0.78, color: '#9a7046' }]),
        ['ball', { y: 0.68, sx: 0.55, sy: 0.45, sz: 1.1, color: '#b08455' }],
        ['ball', { y: 0.95, sx: 0.42, sy: 0.42, sz: 0.5, color: '#a77a4c' }],
        ['taper', { y: 0.85, z: 0.58, sx: 0.18, sy: 0.65, rx: 0.4, color: '#b08455' }],
        ['ball', { y: 1.4, z: 0.82, sx: 0.2, sy: 0.18, sz: 0.36, color: '#a77a4c' }],
        ['person', { y: 1.15, sx: 0.12, sy: 0.12, sz: 0.1, color: k.pick(['#2980b9', '#ecf0f1', '#c0392b']) }],
      ]);
    }
    // Nazlet es-Semman köyü (platonun dibinde) ve palmiye bahçeleri
    const village = k.scatter(380, n + 6, n + 34, { arc: [-0.25, 1.6], spacing: 1.5 });
    k.houses(village, { colors: PALETTE.cairo, w: [1, 2], h: [1.2, 3.4], roof: 'flat', windows: '#5e4f3e', detailR: n + 16 });
    k.trees(k.scatter(80, n + 5, n + 30, { arc: [-0.4, 1.7], spacing: 1.2 }), 'palm');
    k.road(n + 2, -n, n + 2, n + 30, 1.8);
    k.traffic([n + 2, -n + 2, n + 2, n + 28], 4, { scale: 0.42 });
    for (const p of k.scatter(10, n + 18, n + 34, { arc: [0, 1.5], spacing: 5 })) k.minaret(p.x, p.z, { s: 1.3, stone: '#d8c8a8', lead: '#b5a17a', balconies: 2 });
    k.birds(4, 0, 0, n + 6, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.9 });
    return {};
  };

  /* ---------------------------------------------- AKROPOLİS ve ATİNA */
  AU.ENVIRONMENTS.parthenon = function (k, { R }) {
    const n = R + 2.5;
    const low = -3.4;          // aşağı şehrin zemini
    const top = k.groundY;
    // Akropolis kayası: yamaçları eğimli doğal bir tepe (dik bir sütun değil)
    const geo = new k.THREE.CylinderGeometry(n + 1, n + 12, top - low, 36, 3, true);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (Math.abs(y) < (top - low) / 2 - 0.01) {
        const f = 1 + Math.sin(pos.getX(i) * 0.7) * 0.05 + Math.cos(pos.getZ(i) * 0.9) * 0.05;
        pos.setXYZ(i, pos.getX(i) * f, y, pos.getZ(i) * f);
      }
    }
    geo.computeVertexNormals();
    geo.translate(0, (top + low) / 2, 0);
    k.mesh(geo, k.mat('#a89a7f', { side: k.THREE.DoubleSide }));
    const cap = new k.THREE.CircleGeometry(n + 1, 36).rotateX(-PI / 2);
    k.mesh(cap, k.mat('#b9ad8f'), 0, top - 0.005, 0);
    // Tepedeki yapılar: Erekteion (karyatidli), Propileler, Athena Nike Tapınağı
    k.compound(-5, top, -n + 0.4, 0.15, [
      ['box', { sx: 2.6, sy: 0.25, sz: 1.6, color: '#d7cfbd' }],
      ['box', { y: 0.25, sx: 2.0, sy: 1.1, sz: 1.2, color: '#e6dfcf' }],
      ['gable', { y: 1.35, sx: 2.1, sy: 0.35, sz: 1.3, ry: PI / 2, color: '#ddd5c2' }],
      ...[-0.45, -0.15, 0.15, 0.45].map((dz) => ['person', { x: 1.2, z: dz, y: 0.25, sx: 0.12, sy: 0.4, sz: 0.1, color: '#efe8da' }]),
      ['box', { x: 1.2, y: 1.15, sx: 0.4, sy: 0.15, sz: 1.2, color: '#e3dccb' }],
    ]);
    temple(k, 2.5, -n - 0.2, { s: 0.8, w: 4, d: 1.4, cols: 6, rows: 2, h: 1.6, y: top });
    temple(k, 6.5, -n + 1.4, { s: 0.45, w: 2, d: 1.4, cols: 4, rows: 2, y: top });
    k.trees(k.scatter(10, n - 1, n + 0.6, { arc: [PI * 0.7, PI * 1.3] }).map((p) => ({ ...p, y: top })), 'olive', { scale: 0.8 });
    k.rocks(k.scatter(20, n - 1.5, n + 0.8).map((p) => ({ ...p, y: top })), { colors: ['#b5a88c', '#a89a7f'] });
    crowd(k, 80, R + 2, n + 0.5, { y: top });
    // Yamaçta Herodes Atticus Odeonu (yarım daire tiyatro) ve Dionysos Tiyatrosu
    for (const [cx, cz, rr] of [[-7, n + 13.5, 3.2], [7, n + 12.5, 2.8]]) {
      for (let i = 0; i < 4; i++) {
        for (let a = -PI / 2; a <= PI / 2; a += PI / 14) {
          const r = rr - i * 0.45;
          k.add('box', { x: cx + Math.sin(a) * r, y: low + i * 0.25, z: cz - Math.cos(a) * r, sx: 0.55, sy: 0.25 + i * 0.01, sz: 0.4, ry: -a, color: '#d7cfbd' });
        }
      }
      k.add('box', { x: cx, y: low, z: cz + 0.9, sx: rr * 2.2, sy: 1.6, sz: 0.4, color: '#c9b79a' });
    }
    // Antik Agora ve Hephaistos Tapınağı, Olympieion sütunları, Akropolis Müzesi
    temple(k, -n - 15, -4, { s: 1, w: 3.4, d: 1.8, cols: 6, rows: 2, h: 2, y: low, ry: PI / 2 });
    k.patch(-n - 15, 2, 10, 8, '#bdb193', 0, low);
    k.rocks(k.scatter(30, 0, 4.5, { cx: -n - 15, cz: 2 }).map((p) => ({ ...p, y: low })), { scale: 0.4, colors: ['#d7cfbd', '#c9bfa8'] });
    temple(k, n + 14, n + 10, { s: 1.4, w: 4, d: 2, cols: 6, rows: 3, h: 3.2, y: low, ruined: true });
    k.add('box', { x: 2, y: low, z: n + 16, sx: 7, sy: 2.2, sz: 4, color: '#c9cfd3' });
    // Plaka ve Atina: beyaz evler, kiremit çatılar, zeytin ve servi ağaçları
    const avoid = any(avoidCircle(0, 0, n + 12.5), avoidCircle(-n - 15, -1, 6), avoidCircle(-7, n + 13.5, 4), avoidCircle(7, n + 12.5, 3.6), avoidCircle(n + 14, n + 10, 5), avoidRect(-2, n + 13, 6, n + 19));
    const city = k.scatter(950, n + 11, n + 40, { spacing: 1.45, avoid }).map((p) => ({ ...p, y: low }));
    k.houses(city.slice(0, 620), { colors: PALETTE.athens, roofColors: PALETTE.athens, w: [1, 1.9], h: [1, 2.8], roof: 'flat', windows: '#5f6b76', detailR: n + 22 });
    k.houses(city.slice(620), { colors: ['#efe4cf', '#e7dcc6', '#f2c9a2'], roofColors: PALETTE.tiles, w: [1, 1.7], h: [0.9, 1.9], roof: 'hip', windows: '#5f6b76', detailR: n + 22 });
    k.trees(k.scatter(160, n + 10, n + 34, { avoid }).map((p) => ({ ...p, y: low })), 'olive');
    k.trees(k.scatter(50, n + 8, n + 30, { avoid }).map((p) => ({ ...p, y: low })), 'cypress');
    // Likabettus tepesi ve beyaz şapeli, Filopappos tepesi, uzak dağlar
    k.add('hill', { x: 20, z: -n - 22, y: low, sx: 14, sy: 18, sz: 12, color: '#8a9469' });
    k.add('box', { x: 20, z: -n - 22, y: low + 8.7, sx: 0.8, sy: 0.6, sz: 0.6, color: '#f6f3ec' });
    k.add('hill', { x: -16, z: n + 18, y: low, sx: 16, sy: 7, sz: 12, color: '#8f9a6c' });
    k.hills(k.scatter(10, n + 32, n + 44, { spacing: 10 }).map((p) => ({ ...p, y: low })), '#7d876a', [9, 15], [3, 6]);
    k.birds(6, 0, 0, n + 2, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return { groundY: low };
  };

  /* ---------------------------------------------- ROMA: Kolezyum ve Forum */
  AU.ENVIRONMENTS.colosseum = function (k, { R }) {
    const n = R + 2.5;
    // Kolezyum meydanı (sampietrini taş döşeme), turistler
    k.patch(0, 0, (n + 5) * 2, (n + 5) * 2, '#b8a98d', 0, undefined, true);
    crowd(k, 160, R + 2, n + 5);
    // Konstantin Takı ve Meta Sudans kalıntısı
    triumphalArch(k, -n - 1.5, -3, { ry: PI / 2 });
    k.add('cyl', { x: -n + 1, z: -7, sx: 1.6, sy: 0.4, color: '#b29a7a' });
    // Ludus Magnus (gladyatör okulu kalıntısı): oval alçak duvarlar
    for (let a = 0; a < PI * 2; a += PI / 12) {
      k.add('box', { x: n + 4 + Math.sin(a) * 3, z: -4 + Math.cos(a) * 2, sx: 0.8, sy: 0.6, sz: 0.3, ry: a, color: '#a6694a' });
    }
    // Via dei Fori Imperiali ve trafik (Vespa'lar, arabalar)
    k.road(-n - 2, -n - 1, -n - 30, -n - 24, 3);
    k.traffic([-n - 3, -n - 1.5, -n - 29, -n - 23], 6);
    // Roma Forumu: Titus Takı, Satürn Tapınağı (8 sütun), Castor-Pollux (3 sütun), Septimius Severus Takı, Curia
    const fx = -n - 10, fz = -n - 4;
    k.patch(fx, fz - 4, 18, 14, '#bfae8e');
    triumphalArch(k, fx + 6, fz + 2, { s: 0.6, three: false, ry: 0.3 });
    temple(k, fx - 5, fz - 7, { s: 0.9, w: 3, d: 1.2, cols: 6, rows: 1, h: 2.4, pediment: false });
    k.compound(fx, k.groundY, fz - 3, 0.2, [
      ['box', { sx: 3, sy: 1.4, sz: 2, color: '#b7a88c' }],
      ...[-0.9, 0, 0.9].map((dx) => ['cyl', { x: dx, y: 1.4, z: 0.8, sx: 0.3, sy: 3, color: '#ece2cf' }]),
      ['box', { y: 4.4, z: 0.8, sx: 2.3, sy: 0.35, sz: 0.4, color: '#e1d5bd' }],
    ]);
    triumphalArch(k, fx - 7, fz - 2, { s: 0.75, ry: 0.4 });
    k.add('box', { x: fx - 3, z: fz + 2, sx: 2.6, sy: 2.6, sz: 2, color: '#a6694a' });
    k.add('gable', { x: fx - 3, y: k.groundY + 2.6, z: fz + 2, sx: 2.7, sy: 0.6, sz: 2.1, color: '#94472a' });
    for (const p of k.scatter(30, 0, 7, { cx: fx, cz: fz - 4, spacing: 1 })) {
      if (k.rand() < 0.5) k.add('cyl', { x: p.x, z: p.z, sx: 0.28, sy: k.range(0.4, 2.4), color: '#e6dcc8' });
      else k.add('cyl', { x: p.x, y: k.groundY + 0.14, z: p.z, sx: 0.28, sy: k.range(1, 2.2), rz: PI / 2, ry: k.range(0, 3), color: '#d9ceb8' });
    }
    crowd(k, 60, 0, 6, { cx: fx, cz: fz - 4 });
    // Maxentius Bazilikası (dev tuğla tonozlar)
    k.compound(fx + 8, k.groundY, fz - 8, 0.3, [
      ['box', { sx: 6, sy: 3.4, sz: 2, color: '#a6694a' }],
      ...[-2, 0, 2].map((dx) => ['box', { x: dx, z: 1.01, sx: 1.5, sy: 2.4, sz: 0.04, color: '#3d2b20' }]),
    ]);
    // Palatin tepesi: fıstık çamları ve saray kalıntıları
    k.add('hill', { x: 10, z: -n - 12, sx: 22, sy: 6, sz: 15, color: '#7f8f5a' });
    k.trees(k.scatter(30, 0, 8, { cx: 10, cz: -n - 12, spacing: 1.6 }).map((p) => ({ ...p, y: k.groundY + 1.6 })), 'pine');
    k.add('box', { x: 12, y: k.groundY + 2, z: -n - 13, sx: 5, sy: 1.6, sz: 3, color: '#a6694a' });
    // Vittoriano (uzakta beyaz anıt)
    k.compound(-n - 26, k.groundY, -n - 24, 0.5, [
      ['box', { sx: 12, sy: 2, sz: 5, color: '#f2f0ea' }],
      ['box', { y: 2, sx: 10, sy: 2.4, sz: 1.2, color: '#f6f4ee' }],
      ['box', { y: 4.4, sx: 10.4, sy: 0.4, sz: 1.4, color: '#e8e5dc' }],
      ...[-4.6, 4.6].map((dx) => ['box', { x: dx, y: 4.8, sx: 1, sy: 1, sz: 0.8, color: '#c9a646' }]),
    ]);
    // Fıstık çamları, serviler, Roma'nın aşı boyalı binaları ve kilise kubbeleri
    const avoid = any(avoidCircle(0, 0, n + 5.5), avoidCircle(fx, fz - 4, 10), avoidCircle(10, -n - 12, 11),
      avoidRect(-n - 32, -n - 26, -n - 1, -n), avoidCircle(-n - 26, -n - 24, 8), avoidCircle(n + 4, -4, 4));
    k.trees(k.scatter(130, n + 4, n + 30, { spacing: 2, avoid }), 'pine');
    k.trees(k.scatter(40, n + 4, n + 26, { avoid }), 'cypress');
    k.houses(k.scatter(820, n + 8, n + 38, { spacing: 1.6, avoid }), {
      colors: PALETTE.rome, roofColors: PALETTE.tiles, w: [1.2, 2.2], h: [1.6, 3.8], roof: 'hip', windows: '#5b4636', detailR: n + 18, chimneys: true,
    });
    for (const p of k.scatter(6, n + 14, n + 34, { spacing: 9, avoid })) k.church(p.x, p.z, { s: 1.3, ry: k.range(0, 3), dome: true, stone: '#e6d6b8' });
    k.birds(8, 0, 0, n, 9, { color: '#2b2724', wing: '#1d1a18', scale: 0.8 });
    return {};
  };

  /* ---------------------------------------------- CHICHÉN ITZÁ: Maya şehri ve orman */
  AU.ENVIRONMENTS.chichen = function (k, { R }) {
    const n = R + 2.5;
    // Büyük meydan: geniş çimen
    k.patch(0, 0, (n + 14) * 2, (n + 14) * 2, '#7aa552', 0, undefined, true);
    crowd(k, 120, R + 2, n + 8);
    // Savaşçılar Tapınağı ve Bin Sütun
    const wx = n + 6, wz = -4;
    k.compound(wx, k.groundY, wz, -PI / 2, [
      ['box', { sx: 5, sy: 0.6, sz: 5, color: '#cdc0a2' }],
      ['box', { y: 0.6, sx: 4.2, sy: 0.6, sz: 4.2, color: '#d3c7aa' }],
      ['box', { y: 1.2, sx: 3.4, sy: 0.6, sz: 3.4, color: '#cdc0a2' }],
      ['box', { y: 1.8, sx: 2.4, sy: 0.9, sz: 2, color: '#c9bb9b' }],
      ['box', { z: 2.6, y: 0, sx: 1.2, sy: 1.8, sz: 1.2, color: '#d9cfb5' }],
    ]);
    for (const p of k.grid(wx - 3, wz + 3, wx + 3, wz + 8, 0.9)) k.add('cyl', { x: p.x, z: p.z, sx: 0.26, sy: 1.3, color: '#d9cfb5' });
    // Büyük Top Sahası: iki uzun paralel duvar, halkalar ve uçlarda tapınaklar
    const bx = -n - 6;
    for (const dx of [-1.6, 1.6]) {
      k.add('box', { x: bx + dx, z: 0, sx: 1.2, sy: 1.4, sz: 12, color: '#cdc0a2' });
      k.add('box', { x: bx + dx * 0.72, y: k.groundY + 1.4, z: 0, sx: 0.3, sy: 0.6, sz: 0.1, rz: 0, color: '#bfb193' });
    }
    for (const dz of [-6.6, 6.6]) k.add('box', { x: bx, z: dz, sx: 3, sy: 1.6, sz: 1.2, color: '#c9bb9b' });
    // El Caracol (gözlemevi): iki teras + yuvarlak kule + kubbe
    k.compound(-6, k.groundY, n + 10, 0, [
      ['box', { sx: 5, sy: 0.6, sz: 4, color: '#cdc0a2' }],
      ['box', { y: 0.6, sx: 3, sy: 0.6, sz: 3, color: '#d3c7aa' }],
      ['cyl', { y: 1.2, sx: 1.8, sy: 1.2, color: '#d9cfb5' }],
      ['dome', { y: 2.4, sx: 1.8, sy: 1.0, sz: 1.8, color: '#c9bb9b' }],
    ]);
    // Venüs Platformu ve Tzompantli
    k.add('box', { x: 0, z: n + 4, sx: 2.2, sy: 0.6, sz: 2.2, color: '#d3c7aa' });
    k.add('box', { x: -n + 1, z: -n + 1, sx: 4, sy: 0.5, sz: 1.6, color: '#cdc0a2' });
    // Kutsal Cenote'ye giden sacbe yolu ve cenote (yuvarlak su çukuru)
    k.patch(0, -n - 9, 1.6, 14, '#d8cdb0');
    k.add('disc', { x: 0, y: k.groundY - 0.6, z: -n - 19, sx: 7, sy: 0.6, color: '#7d7462' });
    k.water(0, -n - 19, 5.6, 5.6, k.groundY - 0.25, '#3f8f7e', true);
    // Hediyelik eşya tezgâhları
    for (const p of k.line(1.4, -n - 3, 1.4, -n - 15, 1.2)) {
      k.add('box', { x: p.x, z: p.z, sx: 0.6, sy: 0.5, sz: 0.9, color: '#8a6a45' });
      k.add('gable', { x: p.x, y: k.groundY + 0.8, z: p.z, sx: 0.7, sy: 0.25, sz: 1, ry: PI / 2, color: k.pick(['#e67e22', '#c0392b', '#16a085', '#f1c40f']) });
    }
    k.people(k.line(-0.4, -n - 2, -0.4, -n - 16, 0.6).filter(() => k.rand() < 0.6));
    // Yucatán ormanı: her yanı saran yoğun yeşillik
    const avoid = any(avoidCircle(0, 0, n + 13), avoidRect(-1.2, -n - 26, 1.2, -n), avoidCircle(0, -n - 19, 5));
    k.trees(k.scatter(520, n + 12, n + 40, { spacing: 1.3, avoid }), 'jungle');
    k.trees(k.scatter(60, n + 13, n + 36, { spacing: 1.6, avoid }), 'palm', { scale: 0.9 });
    k.bushes(k.scatter(140, n + 11, n + 16, { avoid }), { scale: 0.8 });
    k.birds(6, 0, 0, n + 4, 10, { color: '#2b2724', wing: '#1d1a18', scale: 0.9 });
    return {};
  };
})();
