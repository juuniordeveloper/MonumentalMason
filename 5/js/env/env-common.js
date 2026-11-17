/* =========================================================
   ANIT USTASI — Çevre dosyalarının ortak yardımcıları
   Bölüm çevreleri AU.ENVIRONMENTS[id] = (k, info) => {...}
   şeklinde kaydedilir. k: çevre kiti, info: { R, padR }.
   Açı kuralı: 0 = kamera tarafı (+z), π = eserin arkası (−z).
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  AU.ENVIRONMENTS = AU.ENVIRONMENTS || {};

  const avoidCircle = (cx, cz, r) => (x, z) => (x - cx) ** 2 + (z - cz) ** 2 < r * r;
  const avoidRect = (x1, z1, x2, z2) => (x, z) => x > Math.min(x1, x2) && x < Math.max(x1, x2) && z > Math.min(z1, z2) && z < Math.max(z1, z2);
  const any = (...fns) => (x, z) => fns.some((f) => f(x, z));

  const PALETTE = {
    istanbul: ['#e9dcc6', '#d98c6a', '#e7c07a', '#c9d3c0', '#b6866a', '#f0ebe0', '#d6a78e', '#9fb5c4', '#c96f5a'],
    tiles: ['#a5512f', '#b45f38', '#8a3f25', '#9c4a2d'],
    basalt: ['#4a4441', '#56504c', '#3f3a37', '#5f5752'],
    athens: ['#f2eee6', '#e9e1d2', '#f5f0e6', '#ddd3c1', '#efe4cf'],
    rome: ['#d9a55f', '#c98b4f', '#e2b878', '#b8774a', '#e8c891', '#c46a43', '#dcb48a'],
    paris: ['#e9e0cc', '#e2d7c0', '#efe7d6', '#d8ccb3'],
    moscow: ['#e8dcc4', '#d9c3a0', '#c9b79a', '#e6d2b5', '#b9a58c', '#f0e6d2'],
    cairo: ['#d8c4a0', '#cdb894', '#e2d2b4', '#bfa883', '#c9b08a'],
    agra: ['#d9b48a', '#cfa57a', '#e2c7a3', '#c99673', '#e8d3b5'],
    edirne: ['#efe6d4', '#e2d2b4', '#d9b991', '#f2ece0', '#cfd6c9'],
  };

  // Antik tapınak: kaide + sütun sırası + saçak (+ istenirse alınlık)
  function temple(k, x, z, o) {
    const s = o.s || 1, ry = o.ry || 0, y = o.y === undefined ? k.groundY : o.y;
    const W = o.w || 3, D = o.d || 2, H = o.h || 1.8;
    const parts = [['box', { sx: W + 0.4, sy: 0.35, sz: D + 0.4, color: o.base || '#cfc5ae' }]];
    const cols = o.cols || 6, rows = o.rows || 2;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (o.ruined && k.rand() < 0.35) continue;
        const cx = -W / 2 + (W / (cols - 1)) * i;
        const cz = rows === 1 ? D / 2 : -D / 2 + (D / (rows - 1)) * j;
        parts.push(['cyl', { x: cx, z: cz, y: 0.35, sx: 0.24, sy: H, color: o.color || '#ece4d2' }]);
      }
    }
    if (!o.ruined) {
      parts.push(['box', { y: 0.35 + H, sx: W + 0.3, sy: 0.35, sz: D + 0.3, color: o.color || '#e3dac6' }]);
      if (o.pediment !== false) parts.push(['gable', { y: 0.7 + H, sx: W + 0.3, sy: 0.55, sz: D + 0.3, ry: Math.PI / 2, color: o.roof || '#e3dac6' }]);
    }
    k.compound(x, y, z, ry, parts, s);
  }

  // Zafer takı: kütle + 1 veya 3 açıklık + attika
  function triumphalArch(k, x, z, o) {
    const s = o.s || 1, ry = o.ry || 0;
    const stone = o.color || '#e3d6bd';
    const parts = [
      ['box', { sx: 3.2, sy: 2.2, sz: 1.1, color: stone }],
      ['box', { y: 2.2, sx: 3.2, sy: 0.7, sz: 1.1, color: '#d8caae' }],
      ['box', { z: 0.56, sx: 0.8, sy: 1.5, sz: 0.04, color: '#3d342b' }],
      ['box', { z: -0.56, sx: 0.8, sy: 1.5, sz: 0.04, color: '#3d342b' }],
    ];
    if (o.three !== false) {
      for (const dx of [-1.1, 1.1]) {
        parts.push(['box', { x: dx, z: 0.56, sx: 0.45, sy: 0.9, sz: 0.04, color: '#3d342b' }]);
        parts.push(['box', { x: dx, z: -0.56, sx: 0.45, sy: 0.9, sz: 0.04, color: '#3d342b' }]);
      }
    }
    for (const dx of [-1.45, -0.6, 0.6, 1.45]) parts.push(['cyl', { x: dx, z: 0.62, sx: 0.16, sy: 2.1, color: '#f0e6d2' }]);
    k.compound(x, k.groundY, z, ry, parts, s);
  }

  // Kemerli köprü (nehir boyunca değil, nehri kesen yönde)
  function bridge(k, x1, z1, x2, z2, o) {
    const pts = k.line(x1, z1, x2, z2, o.span || 1.2);
    const y = o.y === undefined ? k.groundY : o.y;
    const h = o.h || 0.9;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      k.add('box', { x: p.x, y: y - 0.3, z: p.z, sx: o.w || 1.2, sy: h * 0.75 + 0.3, sz: 0.28, ry: p.ry, color: o.pier || o.color });
    }
    const len = Math.hypot(x2 - x1, z2 - z1);
    const ry = Math.atan2(x2 - x1, z2 - z1);
    k.add('box', { x: (x1 + x2) / 2, y: y + h * 0.75, z: (z1 + z2) / 2, sx: o.w || 1.2, sy: h * 0.25, sz: len, ry, color: o.color });
    k.add('box', { x: (x1 + x2) / 2, y: y + h, z: (z1 + z2) / 2, sx: (o.w || 1.2) + 0.1, sy: 0.12, sz: len, ry, color: o.parapet || o.color });
  }

  // Bir merkez etrafında turist kalabalığı
  function crowd(k, n, rMin, rMax, o) {
    k.people(k.scatter(n, rMin, rMax, { spacing: 0.35, ...(o || {}) }), o);
  }

  AU.envUtil = { avoidCircle, avoidRect, any, PALETTE, temple, triumphalArch, bridge, crowd };
})();
