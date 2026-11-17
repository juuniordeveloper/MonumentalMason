/* =========================================================
   ANIT USTASI — Bölüm şekil yardımcıları
   Bölüm dosyalarının (js/levels/*.js) ortak kullandığı üreticiler.
   Şekil listesi ve koordinat kuralları için README.md'ye bakınız.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  AU.levelDefs = AU.levelDefs || [];

  // Bir çember etrafına eşit aralıklı kutular dizer (pencere, mazgal...)
  function ring(count, radius, y, size, color, startDeg) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const a = (startDeg || 0) + (360 / count) * i;
      const rad = (a * Math.PI) / 180;
      out.push({
        shape: 'box',
        size: size,
        at: [Math.sin(rad) * radius, y, Math.cos(rad) * radius],
        rotY: a,
        color: color,
      });
    }
    return out;
  }

  // Roma tarzı kemer: ayaklar, tuğla bantları, üzengi taşı ve kilit taşı
  function archPart(o) {
    const pierW = o.w / 2 - o.r;
    const px = o.r + pierW / 2;
    const list = [{ shape: 'arch', w: o.w, h: o.h, d: o.d, r: o.r, spring: o.spring, color: o.color }];
    for (const y of o.bands) {
      for (const sx of [-1, 1]) {
        list.push({ shape: 'box', size: [pierW + 0.02, 0.07, o.d + 0.02], at: [sx * px, y, 0], color: o.band });
      }
    }
    for (const sx of [-1, 1]) {
      list.push({ shape: 'box', size: [pierW + 0.06, 0.08, o.d + 0.05], at: [sx * px, o.spring - 0.08, 0], color: o.trim });
    }
    list.push({ shape: 'box', size: [o.r * 0.32, o.r * 0.42, o.d + 0.04], at: [0, o.spring + o.r - 0.04, 0], color: o.trim });
    list.push({ shape: 'box', size: [o.w, 0.08, o.d + 0.04], at: [0, o.h - 0.08, 0], color: o.band });
    // Kemer taşları (tuğla kemer halkası) iki yüzde
    for (const z of [o.d / 2, -o.d / 2]) {
      list.push({ shape: 'torus', r: o.r + 0.05, tube: 0.06, radial: 4, seg: 14, arc: Math.PI, at: [0, o.spring, z], color: o.band, flat: true });
    }
    // Taş sırası derzleri (yatay ince çizgiler)
    const step = o.course || 0.2;
    for (let y = step; y < o.h - 0.1; y += step) {
      if (Math.abs(y - o.spring) < 0.06) continue;
      for (const sx of [-1, 1]) {
        if (y < o.spring) list.push({ shape: 'box', size: [pierW, 0.012, o.d + 0.012], at: [sx * px, y, 0], color: o.joint || '#8f7558', detail: true });
      }
      if (y > o.spring + o.r + 0.08) list.push({ shape: 'box', size: [o.w, 0.012, o.d + 0.012], at: [0, y, 0], color: o.joint || '#8f7558', detail: true });
    }
    return list;
  }

  // Bir kutu cephesine pencere sırası ekler
  function windowRow(face, half, y, count, span, size, color) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : -span / 2 + (span / (count - 1)) * i;
      let at, rotY;
      if (face === 'x+') { at = [half, y, t]; rotY = 90; }
      if (face === 'x-') { at = [-half, y, t]; rotY = 90; }
      if (face === 'z+') { at = [t, y, half]; rotY = 0; }
      if (face === 'z-') { at = [t, y, -half]; rotY = 0; }
      out.push({ shape: 'box', size: size, at, rotY, color });
    }
    return out;
  }

  // Parthenon frizi: triglif blokları
  function triglyphs(w, d, y, color) {
    const out = [];
    for (let x = -w / 2 + 0.2; x <= w / 2 - 0.19; x += 0.4) {
      out.push({ shape: 'box', size: [0.14, 0.3, 0.05], at: [x, y, d / 2 + 0.01], color });
      out.push({ shape: 'box', size: [0.14, 0.3, 0.05], at: [x, y, -d / 2 - 0.01], color });
    }
    for (let z = -d / 2 + 0.2; z <= d / 2 - 0.19; z += 0.4) {
      out.push({ shape: 'box', size: [0.05, 0.3, 0.14], at: [w / 2 + 0.01, y, z], color });
      out.push({ shape: 'box', size: [0.05, 0.3, 0.14], at: [-w / 2 - 0.01, y, z], color });
    }
    return out;
  }

  // Keops piramidinin kesik piramit dilimi (kenar uzunlukları verilir)
  const K = Math.SQRT1_2;
  function slice(bottom, top, h, color) {
    return { shape: 'cyl', rb: bottom * K, rt: top * K, h, seg: 4, rotY: 45, color };
  }

  // Minare üretici: kare kaide, pabuç, yivli (çok köşeli) gövde, mukarnaslı şerefeler,
  // korkuluk, petek, kurşun külah ve alem
  function minaret(o) {
    const list = [
      { shape: 'box', size: [o.base, o.baseH, o.base], color: o.stone },
      { shape: 'box', size: [o.base + 0.04, 0.05, o.base + 0.04], at: [0, o.baseH - 0.05, 0], color: o.rail },
      // Pabuç: kareden çokgene geçiş
      { shape: 'cyl', rt: o.r * 1.12, rb: o.base * 0.62, h: 0.25, seg: 8, at: [0, o.baseH, 0], color: o.stone, flat: true },
      { shape: 'cyl', rt: o.r * 0.88, rb: o.r, h: o.shaft, seg: 16, at: [0, o.baseH + 0.25, 0], color: o.body, flat: true },
    ];
    for (const y of o.balconies) {
      // Mukarnas: alttan üste genişleyen kademeli bilezikler
      for (let k = 0; k < 3; k++) list.push({ shape: 'cyl', rt: o.r + 0.05 + k * 0.035, rb: o.r * 0.95 + k * 0.035, h: 0.04, seg: 16, at: [0, y - 0.13 + k * 0.045, 0], color: k % 2 ? o.rail : o.stone, flat: true });
      list.push({ shape: 'cyl', rt: o.r + 0.15, rb: o.r + 0.13, h: 0.05, seg: 16, at: [0, y, 0], color: o.stone });
      // Delikli korkuluk: dikmeler + küpeşte
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2;
        list.push({ shape: 'box', size: [0.025, 0.1, 0.025], at: [Math.sin(a) * (o.r + 0.13), y + 0.05, Math.cos(a) * (o.r + 0.13)], color: o.rail, detail: true });
      }
      list.push({ shape: 'torus', r: o.r + 0.13, tube: 0.018, radial: 4, seg: 24, rotX: 90, at: [0, y + 0.15, 0], color: o.rail, detail: true });
    }
    const capY = o.baseH + 0.25 + o.shaft;
    // Petek (üst gövde bileziği) ve kurşun külah
    list.push({ shape: 'cyl', rt: o.r * 0.95, rb: o.r * 0.88, h: 0.06, seg: 16, at: [0, capY - 0.06, 0], color: o.stone });
    list.push({ shape: 'cone', r: o.r * 0.98, h: o.cap, seg: 16, at: [0, capY, 0], color: o.lead });
    list.push(...alem(capY + o.cap - 0.02, 0.8));
    return list;
  }

  // Alem: kubbe ve külah tepesindeki altın topuzlar ve hilal
  function alem(y, s) {
    const k = s || 1;
    return [
      { shape: 'cyl', rt: 0.012 * k, rb: 0.018 * k, h: 0.3 * k, seg: 6, at: [0, y, 0], color: '#c9a646', metal: true },
      { shape: 'sphere', r: 0.045 * k, at: [0, y + 0.05 * k, 0], color: '#e0bb4f', metal: true },
      { shape: 'sphere', r: 0.032 * k, at: [0, y + 0.15 * k, 0], color: '#e0bb4f', metal: true },
      { shape: 'torus', r: 0.07 * k, tube: 0.016 * k, radial: 6, arc: Math.PI * 1.45, rotZ: 117, at: [0, y + 0.3 * k, 0], color: '#e8c35a', metal: true },
    ];
  }

  // Kaburgalı kubbe: kurşun kaplı yarım küre + meridyen boyunca kaburgalar
  function ribbedDome(r, sy, ribs, color, ribColor, at) {
    const [x, y, z] = at || [0, 0, 0];
    const out = [{ shape: 'hemi', r, sy, at: [x, y, z], color }];
    for (let k = 0; k < ribs; k++) {
      const a = (k / ribs) * Math.PI * 2;
      const pts = [];
      for (let t = 0; t <= 6; t++) {
        const th = (t / 6) * (Math.PI / 2) * 0.96;
        const rr = r * Math.cos(th) + 0.012;
        pts.push([x + Math.sin(a) * rr, y + r * sy * Math.sin(th) + 0.006, z + Math.cos(a) * rr]);
      }
      out.push({ shape: 'tube', pts, r: Math.max(0.012, r * 0.016), radial: 4, color: ribColor || color, detail: true });
    }
    return out;
  }

  // Çember üzerinde dışa bakan kemerli pencereler (kubbe kasnağı, kule)
  function ringWins(n, radius, y, o) {
    const out = [];
    for (let k = 0; k < n; k++) {
      const a = (o.startDeg || 0) + (360 / n) * k;
      const r = (a * Math.PI) / 180;
      out.push(...win({ ...o, at: [Math.sin(r) * radius, y, Math.cos(r) * radius], rotY: a }));
    }
    return out;
  }

  // Ön yüze (z+) göre tanımlanan süsleri 4 cepheye çoğaltır
  function onFaces(items, count) {
    const out = [];
    const n = count || 4;
    for (let k = 0; k < n; k++) {
      const a = (360 / n) * k;
      const r = (a * Math.PI) / 180;
      const c = Math.cos(r), s = Math.sin(r);
      for (const it of items) {
        const [x, y, z] = it.at || [0, 0, 0];
        out.push({ ...it, at: [x * c + z * s, y, -x * s + z * c], rotY: (it.rotY || 0) + a });
      }
    }
    return out;
  }

  // Yan yana kemerlerden oluşan revak / kemer dizisi (uzunluk = n * aw)
  function arcade(o) {
    const list = [];
    const L = o.n * o.aw;
    const y0 = o.y0 || 0;
    const z0 = o.z || 0;
    for (let i = 0; i < o.n; i++) {
      list.push({
        shape: 'arch', w: o.aw, h: o.h, d: o.d, r: o.r, spring: o.spring,
        at: [-L / 2 + o.aw * (i + 0.5), y0, z0], color: o.color,
      });
    }
    for (const y of o.stripes || []) {
      list.push({ shape: 'box', size: [L, 0.06, o.d + 0.02], at: [0, y0 + y, z0], color: o.band });
    }
    if (o.pilasters) {
      for (let i = 0; i <= o.n; i++) {
        list.push({ shape: 'box', size: [0.08, o.h - 0.14, 0.05], at: [-L / 2 + o.aw * i, y0, z0 + o.d / 2 + 0.02], color: o.pilasters });
      }
    }
    return list;
  }

  // Soğan kubbe profili (Tac Mahal tarzı); r = taban yarıçapı, h = yükseklik
  function onion(r, h, color, at) {
    const prof = [
      [0.82, 0], [0.96, 0.07], [1.06, 0.18], [1.1, 0.3], [1.06, 0.42], [0.92, 0.54],
      [0.7, 0.66], [0.46, 0.76], [0.24, 0.86], [0.09, 0.94], [0.02, 0.985], [0, 1],
    ];
    return { shape: 'lathe', points: prof.map(([x, y]) => [x * r, y * h]), seg: 28, color, at };
  }

  // Çizgili soğan kubbe (Aziz Vasil): dilimler sırayla iki renk; twist > 0 ise dilimler kademeli döner (sarmal izlenimi)
  function stripedOnion(r, h, colors, at, slices, twist) {
    const prof = [
      [0.82, 0], [0.96, 0.07], [1.06, 0.18], [1.1, 0.3], [1.06, 0.42], [0.92, 0.54],
      [0.7, 0.66], [0.46, 0.76], [0.24, 0.86], [0.09, 0.94], [0.02, 0.985], [0, 1],
    ].map(([x, y]) => [x * r, y * h]);
    const n = slices || 12;
    const out = [];
    const bands = twist ? 4 : 1;
    for (let b = 0; b < bands; b++) {
      const part = prof.slice(Math.floor((b * (prof.length - 1)) / bands), Math.floor(((b + 1) * (prof.length - 1)) / bands) + 1);
      for (let k = 0; k < n; k++) {
        out.push({ shape: 'lathe', points: part, seg: 3, phi0: (k * Math.PI * 2) / n + b * (twist || 0), phi: (Math.PI * 2) / n, color: colors[k % colors.length], at });
      }
    }
    return out;
  }

  // Ağaç (gövde + yapraklar)
  function tree(trunk, leaf, leaf2) {
    return [
      { shape: 'cyl', rt: 0.05, rb: 0.08, h: 0.45, seg: 6, color: trunk },
      { shape: 'sphere', r: 0.36, at: [0, 0.35, 0], color: leaf },
      { shape: 'sphere', r: 0.24, at: [0.14, 0.62, 0.05], color: leaf2 },
    ];
  }

  // Sekizgen düzende yerleşen parçaların konumları (Kolezyum)
  function octo(part, radius, y) {
    const out = [];
    for (let k = 0; k < 8; k++) {
      const a = 45 * k;
      const r = (a * Math.PI) / 180;
      out.push({ part, pos: [+(Math.sin(r) * radius).toFixed(4), y, +(Math.cos(r) * radius).toFixed(4)], ryDeg: a });
    }
    return out;
  }

  // Diyarbakır'ın siyah bazalt ve beyaz kireçtaşı renkleri
  const BAZALT = '#45403d', BAZALT2 = '#524b47', KIRECTASI = '#d8cdb5', KURSUN = '#6b625b';

  // Bir şekil listesini orijin etrafında döndürür (yan cepheler için)
  function turn(items, deg) {
    const r = (deg * Math.PI) / 180;
    const c = Math.cos(r), s = Math.sin(r);
    return items.map((it) => {
      const [x, y, z] = it.at || [0, 0, 0];
      return { ...it, at: [x * c + z * s, y, -x * s + z * c], rotY: (it.rotY || 0) + deg };
    });
  }

  // Bir şekil listesini topluca kaydırır
  function shift(items, dx, dy, dz) {
    return items.map((it) => {
      const [x, y, z] = it.at || [0, 0, 0];
      return { ...it, at: [x + dx, y + dy, z + dz] };
    });
  }

  /* ---------- Ayrıntı yardımcıları (gerçekçi modeller için) ---------- */

  // Kemerli açıklığın dış hattı: top = 'round' | 'pointed' | 'flat' | 'ogee'
  function openingPts(w, h, top) {
    const hw = w / 2;
    const pts = [[-hw, 0], [hw, 0]];
    if (top === 'flat') return [...pts, [hw, h], [-hw, h]];
    const N = 10;
    if (top === 'pointed') {
      const spring = h - w * 0.75;
      pts.push([hw, spring]);
      // Sağ yay merkezi solda (-hw*0.5), yarıçap 1.5*hw → sivri kemer
      const R = w * 0.75, cx = -hw * 0.5;
      const aEnd = Math.acos((0 - cx) / R);
      for (let i = 1; i <= N; i++) { const a = (aEnd * i) / N; pts.push([cx + R * Math.cos(a), spring + R * Math.sin(a)]); }
      for (let i = N - 1; i >= 0; i--) { const a = (aEnd * i) / N; pts.push([-(cx + R * Math.cos(a)), spring + R * Math.sin(a)]); }
      return pts;
    }
    if (top === 'ogee') {
      const spring = h - w * 0.8;
      pts.push([hw, spring]);
      for (let i = 1; i <= N; i++) { const t = i / N; pts.push([hw * Math.cos(t * Math.PI / 2) * (1 - 0.25 * t), spring + w * 0.8 * (0.5 - 0.5 * Math.cos(t * Math.PI)) ]); }
      for (let i = N - 1; i >= 1; i--) { const t = i / N; pts.push([-hw * Math.cos(t * Math.PI / 2) * (1 - 0.25 * t), spring + w * 0.8 * (0.5 - 0.5 * Math.cos(t * Math.PI))]); }
      pts.push([-hw, spring]);
      return pts;
    }
    const spring = h - hw;
    for (let i = 0; i <= N; i++) { const a = (Math.PI * i) / N; pts.push([hw * Math.cos(a), spring + hw * Math.sin(a)]); }
    return pts;
  }

  // Duvara oturan pencere/kapı: koyu cam + (isteğe bağlı) açık renk çerçeve ve denizlik.
  // at = alt orta nokta, rotY ile cepheye çevrilir (z+ yüze bakar).
  function win(o) {
    const top = o.top || 'round';
    const d = o.d || 0.03;
    const rot = o.rotY || 0;
    const r = (rot * Math.PI) / 180;
    const [x, y, z] = o.at;
    const off = (k) => [x + Math.sin(r) * k, y, z + Math.cos(r) * k];
    const out = [];
    if (o.frame) {
      const f = o.fw || 0.035;
      out.push({ shape: 'extrude', pts: openingPts(o.w + f * 2, o.h + f, top), d, at: off(d * 0.4), rotY: rot, color: o.frame, detail: true });
    }
    out.push({ shape: 'extrude', pts: openingPts(o.w, o.h, top), d, at: off(d), rotY: rot, color: o.color || '#2a2f38', glow: o.glow, glowColor: o.glowColor, detail: true });
    if (o.mullion) out.push({ shape: 'box', size: [0.018, o.h * 0.92, 0.02], at: off(d * 1.6), rotY: rot, color: o.frame || o.mullion, detail: true });
    if (o.sill) out.push({ shape: 'box', size: [o.w + 0.08, 0.035, 0.06], at: [...off(0.03)].map((v, i) => (i === 1 ? y - 0.035 : v)), rotY: rot, color: o.sill });
    return out;
  }

  // Bir dikdörtgen cephe boyunca (x ekseni) eşit aralıklı pencereler
  function winRow(o) {
    const out = [];
    for (let i = 0; i < o.n; i++) {
      const t = o.n === 1 ? 0 : -o.span / 2 + (o.span / (o.n - 1)) * i;
      const r = ((o.rotY || 0) * Math.PI) / 180;
      const [cx, cy, cz] = o.at;
      out.push(...win({ ...o, at: [cx + Math.cos(r) * t, cy, cz - Math.sin(r) * t] }));
    }
    return out;
  }

  // Kutu gövdenin dört cephesine pencere sırası (w × d gövde, y yüksekliğinde)
  function winAround(w, d, y, o) {
    return [
      ...winRow({ ...o, n: o.nx, span: w - (o.margin || 0.3), at: [0, y, d / 2], rotY: 0 }),
      ...winRow({ ...o, n: o.nx, span: w - (o.margin || 0.3), at: [0, y, -d / 2], rotY: 180 }),
      ...winRow({ ...o, n: o.nz, span: d - (o.margin || 0.3), at: [w / 2, y, 0], rotY: 90 }),
      ...winRow({ ...o, n: o.nz, span: d - (o.margin || 0.3), at: [-w / 2, y, 0], rotY: -90 }),
    ].filter(Boolean);
  }

  // Taşma yapan saçak / silme bandı (kutu gövdenin çevresinde)
  function cornice(w, d, y, color, o) {
    const ov = (o && o.over) || 0.06, h = (o && o.h) || 0.07;
    const list = [{ shape: 'box', size: [w + ov * 2, h, d + ov * 2], at: [0, y, 0], color }];
    if (o && o.step) list.push({ shape: 'box', size: [w + ov, h * 0.6, d + ov], at: [0, y - h * 0.6, 0], color });
    return list;
  }

  // Merdiven: n basamak, toplam w genişlik, d derinlik, h yükseklik; z+ yönüne iner
  function stairs(o) {
    const out = [];
    for (let i = 0; i < o.n; i++) {
      const sd = (o.d * (o.n - i)) / o.n;
      out.push({ shape: 'box', size: [o.w, o.h / o.n, sd], at: [o.at[0], o.at[1] + (o.h * i) / o.n, o.at[2] - (o.d - sd) / 2], rotY: o.rotY, color: o.color });
    }
    return out;
  }

  // Klasik sütun: kaide, (yivli) gövde, başlık. order: 'doric' | 'ionic' | 'corinthian'
  function column(o) {
    const r = o.r, h = o.h, [x, y, z] = o.at || [0, 0, 0];
    const order = o.order || 'doric';
    const out = [];
    let y0 = y;
    if (order !== 'doric') {
      out.push({ shape: 'cyl', rt: r * 1.25, rb: r * 1.35, h: r * 0.35, seg: 16, at: [x, y0, z], color: o.color });
      y0 += r * 0.35;
    }
    const capH = order === 'corinthian' ? r * 1.6 : r * 0.7;
    const shaftH = h - (y0 - y) - capH;
    out.push({ shape: 'cyl', rt: r * 0.84, rb: r, h: shaftH, seg: o.flutes || 20, at: [x, y0, z], color: o.color, flat: true });
    const cy = y0 + shaftH;
    if (order === 'doric') {
      out.push({ shape: 'cyl', rt: r * 1.25, rb: r * 0.86, h: capH * 0.55, seg: 16, at: [x, cy, z], color: o.color });
      out.push({ shape: 'box', size: [r * 2.6, capH * 0.45, r * 2.6], at: [x, cy + capH * 0.55, z], color: o.color });
    } else if (order === 'ionic') {
      out.push({ shape: 'box', size: [r * 2.6, capH * 0.5, r * 1.9], at: [x, cy, z], color: o.color });
      for (const s of [-1, 1]) out.push({ shape: 'cyl', rt: r * 0.38, rb: r * 0.38, h: r * 1.9, seg: 12, at: [x + s * r * 1.15, cy + capH * 0.2, z - r * 0.95], rotX: 90, color: o.color, detail: true });
      out.push({ shape: 'box', size: [r * 2.5, capH * 0.35, r * 2.5], at: [x, cy + capH * 0.6, z], color: o.color });
    } else {
      out.push({ shape: 'cyl', rt: r * 1.35, rb: r * 0.86, h: capH * 0.8, seg: 12, at: [x, cy, z], color: o.color });
      out.push({ shape: 'box', size: [r * 2.8, capH * 0.2, r * 2.8], at: [x, cy + capH * 0.8, z], color: o.color });
    }
    return out;
  }

  // Korkuluk: üst küpeşte + dikmeler (x ekseni boyunca, uzunluk len)
  function balustrade(len, h, color, at, rotY, step) {
    const out = [];
    const r = ((rotY || 0) * Math.PI) / 180;
    const [x, y, z] = at;
    const p = (t) => [x + Math.cos(r) * t, y, z - Math.sin(r) * t];
    out.push({ shape: 'box', size: [len, 0.035, 0.06], at: [x, y + h - 0.035, z], rotY, color });
    out.push({ shape: 'box', size: [len, 0.03, 0.06], at: [x, y, z], rotY, color });
    const st = step || 0.09;
    for (let t = -len / 2 + st / 2; t < len / 2; t += st) out.push({ shape: 'cyl', rt: 0.012, rb: 0.018, h: h - 0.06, seg: 6, at: [...p(t)].map((v, i) => (i === 1 ? y + 0.03 : v)), color, detail: true });
    return out;
  }

  // Mazgallı siper: x ekseni boyunca len uzunluğunda dişler
  function crenels(len, y, z, color, o) {
    const out = [];
    const w = (o && o.w) || 0.14, gap = (o && o.gap) || 0.1, h = (o && o.h) || 0.14, t = (o && o.t) || 0.12;
    const n = Math.max(1, Math.floor((len + gap) / (w + gap)));
    const used = n * w + (n - 1) * gap;
    for (let i = 0; i < n; i++) {
      const x = -used / 2 + w / 2 + i * (w + gap);
      out.push({ shape: (o && o.swallow) ? 'extrude' : 'box', ...((o && o.swallow)
        ? { pts: [[-w / 2, 0], [w / 2, 0], [w / 2, h], [w * 0.15, h * 0.62], [-w * 0.15, h * 0.62], [-w / 2, h]], d: t }
        : { size: [w, h, t] }), at: [x, y, z], color });
    }
    return out;
  }

  // Çatı kiremit sırası izlenimi: eğimli yüzeyde ince çizgiler (yalnız tri/gable üstünde)
  function roofLines(w, d, h, y, color, n) {
    const out = [];
    const len = Math.hypot(d / 2, h);
    const ang = (Math.atan2(h, d / 2) * 180) / Math.PI;
    for (let i = 1; i < (n || 4); i++) {
      const t = i / (n || 4);
      for (const s of [-1, 1]) out.push({ shape: 'box', size: [w + 0.02, 0.018, 0.03], at: [0, y + h * t, s * (d / 2) * (1 - t)], rotX: s * ang, color, detail: true });
    }
    return out;
  }

  AU.shapes = { stripedOnion, alem, ribbedDome, ringWins, openingPts, win, winRow, winAround, cornice, stairs, column, balustrade, crenels, roofLines, shift, ring, archPart, windowRow, triglyphs, K, slice, minaret, onFaces, arcade, onion, tree, octo, BAZALT, BAZALT2, KIRECTASI, KURSUN, turn };
})();
