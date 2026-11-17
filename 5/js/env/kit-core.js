/* =========================================================
   ANIT USTASI — Çevre kiti: çekirdek
   ---------------------------------------------------------
   PERFORMANS: Tekrar eden her şey (ev, ağaç, araba, pencere...)
   önce bir listeye toplanır; finish() çağrılınca her geometri
   tipi için TEK bir InstancedMesh oluşturulur. Yüzlerce ev
   ekran kartına tek seferde çizilir.

   Diğer kit dosyaları (kit-nature.js, kit-city.js) kendi
   yardımcılarını AU.envPlugins listesine ekler.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  AU.envPlugins = AU.envPlugins || [];

  AU.createEnvKit = function (THREE, opts) {
    const group = new THREE.Group();
    const updates = [];
    const batches = new Map();   // geometri adı → örnek listesi
    const geos = new Map();      // geometri adı → { geometry, matOpts }
    const groundY = opts.groundY === undefined ? -0.02 : opts.groundY;

    /* ---------- Tekrarlanabilir rastgele sayı (her açılışta aynı manzara) ---------- */
    let seed = opts.seed || 1;
    function rand() {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    const range = (a, b) => a + (b - a) * rand();
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];

    /* ---------- Geometri kaydı ---------- */
    function defineGeo(name, geometry, matOpts) {
      geos.set(name, { geometry, matOpts: matOpts || {} });
    }
    function lazyGeo(name, factory, matOpts) {
      if (!geos.has(name)) defineGeo(name, factory(), matOpts);
    }
    // Tekil (hareketli) nesneler için geometriyi doğrudan ver
    const directUse = new Set();
    function getGeo(name) {
      directUse.add(name);
      return geos.get(name).geometry;
    }

    const gable = (() => {
      const sh = new THREE.Shape();
      sh.moveTo(-0.5, 0);
      sh.lineTo(0.5, 0);
      sh.lineTo(0, 1);
      sh.closePath();
      return new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
    })();
    defineGeo('box', new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));
    defineGeo('pyramid', new THREE.ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4).translate(0, 0.5, 0));
    defineGeo('mansard', new THREE.CylinderGeometry(0.5, Math.SQRT1_2, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0));
    defineGeo('gable', gable);
    defineGeo('cone', new THREE.ConeGeometry(0.5, 1, 12).translate(0, 0.5, 0));
    defineGeo('cyl', new THREE.CylinderGeometry(0.5, 0.5, 1, 12).translate(0, 0.5, 0));
    defineGeo('taper', new THREE.CylinderGeometry(0.35, 0.5, 1, 7).translate(0, 0.5, 0));
    defineGeo('disc', new THREE.CylinderGeometry(0.5, 0.5, 1, 32).translate(0, 0.5, 0));
    defineGeo('oct', new THREE.CylinderGeometry(0.5, 0.5, 1, 8).translate(0, 0.5, 0));
    defineGeo('ball', new THREE.SphereGeometry(0.5, 12, 8).translate(0, 0.5, 0));
    defineGeo('dome', new THREE.SphereGeometry(0.5, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2));
    // Gece yanan: pencereler ve lamba başlıkları
    defineGeo('win', new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), { glow: true });
    defineGeo('lampHead', new THREE.SphereGeometry(0.5, 10, 7).translate(0, 0.5, 0), { glow: true });
    defineGeo('hill', new THREE.SphereGeometry(0.5, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2));

    /* ---------- Temel ekleme ---------- */
    // Ölçek: verilmeyen eksen sx ile aynı alınır (sx de yoksa 1)
    function uniformScale(p, s) {
      const sx = p.sx === undefined ? 1 : p.sx;
      return {
        sx: sx * s,
        sy: (p.sy === undefined ? sx : p.sy) * s,
        sz: (p.sz === undefined ? sx : p.sz) * s,
      };
    }

    // item: {x, y, z, sx, sy, sz, rx, ry, rz, color}  (y verilmezse zemin seviyesi)
    function add(geoName, item) {
      if (!batches.has(geoName)) batches.set(geoName, []);
      batches.get(geoName).push(item);
    }

    // (cx, cz) merkezli, ry açısıyla dönmüş bir nesnenin yerel (dx, dz) noktası
    function local(cx, cz, ry, dx, dz) {
      const c = Math.cos(ry), s = Math.sin(ry);
      return [cx + dx * c + dz * s, cz - dx * s + dz * c];
    }

    // Yerel koordinatlarda tanımlı parçaları döndürüp ekler. parts: [[geo, item], ...]
    function compound(cx, cy, cz, ry, parts, scale) {
      const s = scale || 1;
      for (const [geoName, p] of parts) {
        const [x, z] = local(cx, cz, ry, (p.x || 0) * s, (p.z || 0) * s);
        add(geoName, {
          ...p, x, z, y: cy + (p.y || 0) * s, ry: ry + (p.ry || 0),
          ...uniformScale(p, s),
        });
      }
    }

    function mat(color, extra) {
      return new THREE.MeshLambertMaterial({ color, flatShading: true, ...(extra || {}) });
    }

    // Tekil, özel malzemeli parça (su, kaya plato vb.)
    function mesh(geometry, material, x, y, z) {
      const m = new THREE.Mesh(geometry, material);
      m.position.set(x || 0, y || 0, z || 0);
      group.add(m);
      return m;
    }

    /* ---------- Yerleşim yardımcıları ---------- */
    // a: açı (0 = kameraya doğru +z, π = eserin arkası)
    function scatter(n, rMin, rMax, o) {
      const opt = o || {};
      const out = [];
      const sp2 = (opt.spacing || 0) ** 2;
      const cell = Math.max(opt.spacing || 1, 0.5);
      const grid = new Map();
      const key = (x, z) => Math.floor(x / cell) + ',' + Math.floor(z / cell);
      const near = (x, z) => {
        if (!sp2) return false;
        const cx = Math.floor(x / cell), cz = Math.floor(z / cell);
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
          const arr = grid.get((cx + i) + ',' + (cz + j));
          if (arr && arr.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < sp2)) return true;
        }
        return false;
      };
      for (let tries = 0; out.length < n && tries < n * 30; tries++) {
        const a = opt.arc ? range(opt.arc[0], opt.arc[1]) : range(0, Math.PI * 2);
        const r = Math.sqrt(range(rMin * rMin, rMax * rMax));
        const x = (opt.cx || 0) + Math.sin(a) * r, z = (opt.cz || 0) + Math.cos(a) * r;
        if (opt.avoid && opt.avoid(x, z)) continue;
        if (near(x, z)) continue;
        const p = { x, z, a, r };
        out.push(p);
        const k = key(x, z);
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(p);
      }
      return out;
    }

    // Dikdörtgen alan içinde ızgara düzeninde noktalar (şehir blokları için)
    function grid(x1, z1, x2, z2, step, o) {
      const opt = o || {};
      const out = [];
      for (let x = x1; x <= x2; x += step) {
        for (let z = z1; z <= z2; z += step) {
          const px = x + range(-1, 1) * (opt.jitter || 0);
          const pz = z + range(-1, 1) * (opt.jitter || 0);
          if (opt.avoid && opt.avoid(px, pz)) continue;
          if (opt.fill !== undefined && rand() > opt.fill) continue;
          out.push({ x: px, z: pz, a: Math.atan2(px, pz), r: Math.hypot(px, pz), ry: opt.ry });
        }
      }
      return out;
    }

    // Bir çizgi boyunca eşit aralıklı noktalar
    function line(x1, z1, x2, z2, step) {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const n = Math.max(1, Math.floor(len / step));
      const ry = Math.atan2(x2 - x1, z2 - z1);
      const out = [];
      for (let i = 0; i <= n; i++) out.push({ x: x1 + ((x2 - x1) * i) / n, z: z1 + ((z2 - z1) * i) / n, ry });
      return out;
    }

    /* ---------- Zemin ---------- */
    // Her yama bir öncekinden biraz daha yüksek → üst üste binenler titremez.
    // Yükseklik platformun (y = 0) altında kalsın diye döngüsel sınırlanır.
    const LAYER_STEP = 0.0003, LAYER_MAX = 0.016;
    let layer = 0;
    // İnce zemin yaması (çimen, tarla, yol...)
    function patch(x, z, w, d, color, ry, baseY, round) {
      layer = (layer + LAYER_STEP) % LAYER_MAX;
      add(round ? 'disc' : 'box', {
        x, z, y: baseY === undefined ? groundY - 0.01 : baseY, sx: w, sy: 0.012 + layer, sz: d, ry: ry || 0, color,
      });
    }

    function water(x, z, w, d, y, color, round) {
      const geo = round ? new THREE.CircleGeometry(0.5, 64) : new THREE.PlaneGeometry(1, 1);
      geo.rotateX(-Math.PI / 2);
      const material = new THREE.MeshPhongMaterial({ color, shininess: 90, specular: '#a9cde0' });
      const m = mesh(geo, material, x, y === undefined ? groundY + 0.01 : y, z);
      m.scale.set(w, 1, d);
      return m;
    }

    function onUpdate(fn) { updates.push(fn); }

    /* ---------- Bitir: her geometri tipi için tek InstancedMesh ---------- */
    function finish() {
      const dummy = new THREE.Object3D();
      const color = new THREE.Color();
      for (const [name, list] of batches) {
        const def = geos.get(name);
        if (!def) throw new Error('Tanımsız çevre geometrisi: ' + name);
        const { glow, ...matOpts } = def.matOpts;
        const material = mat('#ffffff', matOpts);
        if (glow) {
          material.emissive.set('#ffc86b');
          material.emissiveIntensity = 0;
          material.userData.glow = true;
          material.userData.glowColor = '#ffc86b';
        }
        const m = new THREE.InstancedMesh(def.geometry, material, list.length);
        list.forEach((it, i) => {
          dummy.position.set(it.x || 0, it.y === undefined ? groundY : it.y, it.z || 0);
          dummy.rotation.set(it.rx || 0, it.ry || 0, it.rz || 0);
          const sc = uniformScale(it, 1);
          dummy.scale.set(sc.sx, sc.sy, sc.sz);
          dummy.updateMatrix();
          m.setMatrixAt(i, dummy.matrix);
          m.setColorAt(i, color.set(it.color || '#cccccc'));
        });
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        m.frustumCulled = false; // örnekler geniş alana yayıldığı için
        group.add(m);
      }
      // Hiç kullanılmayan geometrileri bellekten at
      for (const [name, def] of geos) if (!batches.has(name) && !directUse.has(name)) def.geometry.dispose();
      return group;
    }

    function update(dt, t) {
      for (const fn of updates) fn(dt, t);
    }

    const kit = {
      THREE, group, groundY, rand, range, pick, defineGeo, lazyGeo, getGeo, add, local, compound, mesh, mat,
      scatter, grid, line, patch, water, onUpdate, finish, update,
    };
    // Eklentiler (doğa, şehir) kendi yardımcılarını kite ekler
    for (const plugin of AU.envPlugins) plugin(kit);
    return kit;
  };
})();
