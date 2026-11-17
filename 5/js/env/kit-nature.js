/* =========================================================
   ANIT USTASI — Çevre kiti: doğa
   Ağaçlar, çalılar, çiçekler, tepeler, kayalar, martılar.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  AU.envPlugins = AU.envPlugins || [];

  AU.envPlugins.push(function nature(k) {
    const { THREE, add, range, pick, lazyGeo } = k;

    /* ---------- Organik geometriler (bir kez oluşturulur) ---------- */
    function crownGeo() {
      // Hafif pürüzlü, yuvarlak ağaç tacı
      const g = new THREE.IcosahedronGeometry(0.5, 1);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const f = 1 + Math.sin(p.getX(i) * 9 + p.getZ(i) * 7) * 0.06;
        p.setXYZ(i, p.getX(i) * f, p.getY(i) * f, p.getZ(i) * f);
      }
      g.computeVertexNormals();
      return g.translate(0, 0.5, 0);
    }
    const latheGeo = (pts, seg) => () =>
      new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
    function frondGeo() {
      // Aşağı doğru kıvrılan palmiye yaprağı
      const g = new THREE.PlaneGeometry(0.22, 1, 1, 6).translate(0, 0.5, 0);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const t = p.getY(i);
        p.setXYZ(i, p.getX(i) * (1 - t * 0.7), 0.35 * Math.sin(t * 2.2) - t * t * 0.35, t);
      }
      g.computeVertexNormals();
      return g;
    }
    function wingGeo() {
      // Martı kanadı: gövdeden uca doğru incelen, geriye yatık
      const g = new THREE.BufferGeometry();
      const v = new Float32Array([0, 0, 0.09, 0, 0, -0.07, 0.5, 0.03, -0.13, 0.5, 0.03, -0.13, 0.62, 0.02, -0.2, 0, 0, 0.09]);
      g.setAttribute('position', new THREE.BufferAttribute(v, 3));
      g.computeVertexNormals();
      return g;
    }

    function ensureGeos() {
      lazyGeo('crown', crownGeo);
      lazyGeo('flame', latheGeo([[0, 0], [0.32, 0.12], [0.42, 0.35], [0.36, 0.6], [0.2, 0.85], [0, 1]], 9));
      lazyGeo('spindle', latheGeo([[0, 0], [0.4, 0.15], [0.5, 0.45], [0.36, 0.8], [0, 1]], 9));
      lazyGeo('tulip', latheGeo([[0, 0], [0.32, 0.1], [0.5, 0.45], [0.48, 1], [0.38, 0.85], [0.28, 1], [0.15, 0.82], [0, 0.9]], 8));
      lazyGeo('stem', () => new THREE.CylinderGeometry(0.5, 0.5, 1, 5).translate(0, 0.5, 0));
      lazyGeo('frond', frondGeo, { side: THREE.DoubleSide });
      lazyGeo('rock', () => new THREE.DodecahedronGeometry(0.5, 0).translate(0, 0.3, 0));
    }

    /* ---------- Ağaçlar ---------- */
    const TREE_COLORS = {
      round: ['#3f7d2e', '#4f8f36', '#5c9a3f', '#3d6f2c', '#6aa043'],
      cypress: ['#2b5a2a', '#2f6330', '#24502a'],
      pine: ['#3d6b33', '#466f38', '#3a6430'],
      poplar: ['#5a9a3c', '#6aa845', '#4d8a33'],
      palm: ['#4f7f2e', '#5d8f35', '#46782a'],
      olive: ['#8a9a6b', '#7d8e60', '#95a376'],
      spruce: ['#2e5537', '#355f3d', '#2a4d33'],
      jungle: ['#2f6b2a', '#3a7d30', '#2a5e26', '#4a8a36'],
    };

    function roundTree(p, k, c, trunk) {
      add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.18 * k, sy: 0.9 * k, color: trunk });
      add('crown', { x: p.x, y: p.y + 0.6 * k, z: p.z, sx: 1.35 * k, sy: 1.15 * k, sz: 1.35 * k, ry: range(0, 6), color: c });
      add('crown', { x: p.x + 0.35 * k, y: p.y + 0.95 * k, z: p.z + 0.1 * k, sx: 0.85 * k, sy: 0.8 * k, sz: 0.85 * k, ry: range(0, 6), color: c });
      add('crown', { x: p.x - 0.3 * k, y: p.y + 0.9 * k, z: p.z - 0.2 * k, sx: 0.8 * k, sy: 0.75 * k, sz: 0.8 * k, ry: range(0, 6), color: c });
    }

    const TREE_BUILDERS = {
      round: roundTree,
      jungle: (p, k, c, trunk) => roundTree(p, k * 1.3, c, trunk),
      cypress: (p, k, c) => add('flame', { x: p.x, y: p.y, z: p.z, sx: 0.6 * k, sy: 2.6 * k, color: c }),
      poplar: (p, k, c, trunk) => {
        add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.12 * k, sy: 0.5 * k, color: trunk });
        add('spindle', { x: p.x, y: p.y + 0.3 * k, z: p.z, sx: 0.75 * k, sy: 3 * k, color: c });
      },
      pine: (p, k, c, trunk) => {
        // Fıstık çamı: uzun gövde, şemsiye gibi yayvan taç
        add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.2 * k, sy: 2.4 * k, rz: range(-0.08, 0.08), color: trunk });
        add('crown', { x: p.x, y: p.y + 2.1 * k, z: p.z, sx: 2.4 * k, sy: 0.75 * k, sz: 2.2 * k, ry: range(0, 6), color: c });
        add('crown', { x: p.x + 0.5 * k, y: p.y + 2.35 * k, z: p.z, sx: 1.4 * k, sy: 0.5 * k, sz: 1.3 * k, color: c });
      },
      spruce: (p, k, c, trunk) => {
        add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.14 * k, sy: 0.5 * k, color: trunk });
        [[0.3, 1.2, 1.3], [0.9, 0.95, 1.1], [1.45, 0.7, 0.9]].forEach(([y, w, h]) =>
          add('cone', { x: p.x, y: p.y + y * k, z: p.z, sx: w * k, sy: h * k, color: c }));
      },
      palm: (p, k, c) => {
        const lean = range(-0.12, 0.12);
        const h = 2.6 * k;
        add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.16 * k, sy: h, rz: lean, color: '#8a6a45' });
        const tx = p.x - Math.sin(lean) * h;
        for (let i = 0; i < 8; i++) {
          add('frond', { x: tx, y: p.y + h, z: p.z, sx: 1.3 * k, sy: 1.3 * k, sz: 1.3 * k, ry: (i / 8) * Math.PI * 2 + range(-0.2, 0.2), color: c });
        }
      },
      olive: (p, k, c) => {
        add('taper', { x: p.x, y: p.y, z: p.z, sx: 0.2 * k, sy: 0.55 * k, rz: range(-0.2, 0.2), color: '#5e4a36' });
        add('crown', { x: p.x, y: p.y + 0.4 * k, z: p.z, sx: 1.3 * k, sy: 0.85 * k, sz: 1.2 * k, ry: range(0, 6), color: c });
        add('crown', { x: p.x + 0.3 * k, y: p.y + 0.6 * k, z: p.z, sx: 0.8 * k, sy: 0.6 * k, sz: 0.8 * k, color: c });
      },
    };

    k.trees = function (pts, type, o) {
      ensureGeos();
      const opt = o || {};
      const cols = opt.colors || TREE_COLORS[type];
      const build = TREE_BUILDERS[type];
      for (const p of pts) {
        const kk = (opt.scale || 1) * range(0.8, 1.2);
        build({ x: p.x, z: p.z, y: p.y === undefined ? k.groundY : p.y }, kk, pick(cols), opt.trunk || '#6b4a2f');
      }
    };

    // Çalı / çit bitkisi
    k.bushes = function (pts, o) {
      ensureGeos();
      const opt = o || {};
      for (const p of pts) {
        const s = (opt.scale || 0.6) * range(0.7, 1.3);
        add('crown', { x: p.x, y: p.y, z: p.z, sx: s * 1.3, sy: s * 0.8, sz: s * 1.1, ry: range(0, 6), color: pick(opt.colors || ['#4f8a3a', '#5c9644', '#447a33']) });
      }
    };

    // Lale / çiçek tarhı: toprak + sıra sıra çiçekler
    k.flowerBed = function (x, z, w, d, colors, o) {
      ensureGeos();
      const opt = o || {};
      k.patch(x, z, w, d, opt.soil || '#5e4630', opt.ry || 0, undefined, opt.round);
      const step = opt.step || 0.16;
      const cols = Array.isArray(colors) ? colors : [colors];
      for (let u = -w / 2 + step / 2; u < w / 2; u += step) {
        for (let v = -d / 2 + step / 2; v < d / 2; v += step) {
          if (opt.round && (u * u) / (w * w / 4) + (v * v) / (d * d / 4) > 1) continue;
          const [px, pz] = k.local(x, z, opt.ry || 0, u + range(-0.03, 0.03), v + range(-0.03, 0.03));
          const h = range(0.16, 0.24);
          add('stem', { x: px, z: pz, sx: 0.018, sy: h, color: '#4d7f30' });
          add('tulip', { x: px, y: k.groundY + h, z: pz, sx: 0.085, sy: 0.11, ry: range(0, 6), color: pick(cols) });
        }
      }
    };

    k.rocks = function (pts, o) {
      ensureGeos();
      const opt = o || {};
      for (const p of pts) {
        const s = (opt.scale || 0.6) * range(0.5, 1.4);
        add('rock', { x: p.x, y: p.y, z: p.z, sx: s * range(0.8, 1.4), sy: s * range(0.5, 0.9), sz: s, rx: range(0, 3), ry: range(0, 6), color: pick(opt.colors || ['#8b8273', '#7c7468', '#958c7c']) });
      }
    };

    k.hills = function (pts, color, rRange, hRange) {
      for (const p of pts) {
        const r = range(rRange[0], rRange[1]);
        add('hill', { x: p.x, z: p.z, y: p.y === undefined ? k.groundY - 0.1 : p.y, sx: r * 2, sy: range(hRange[0], hRange[1]) * 2, sz: r * 2 * range(0.7, 1.3), ry: range(0, 3), color: p.color || color });
      }
    };

    /* ---------- Martılar (kanat çırparak daire çizer) ---------- */
    k.birds = function (count, cx, cz, radius, height, o) {
      const opt = o || {};
      const flock = new THREE.Group();
      const white = k.mat(opt.color || '#f6f6f2', { side: THREE.DoubleSide });
      const grey = k.mat(opt.wing || '#9aa3ab', { side: THREE.DoubleSide });
      const beak = k.mat('#e8b23a');
      const bodyGeo = new THREE.SphereGeometry(0.5, 8, 6).scale(0.16, 0.13, 0.42);
      const headGeo = new THREE.SphereGeometry(0.07, 8, 6);
      const beakGeo = new THREE.ConeGeometry(0.02, 0.08, 5).rotateX(Math.PI / 2);
      const wing = wingGeo();
      const tipGeo = new THREE.BufferGeometry();
      tipGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0.5, 0.031, -0.13, 0.62, 0.021, -0.2, 0.42, 0.03, -0.12]), 3));
      tipGeo.computeVertexNormals();
      const list = [];
      const s = opt.scale || 1;
      for (let i = 0; i < count; i++) {
        const b = new THREE.Group();
        b.add(new THREE.Mesh(bodyGeo, white));
        const head = new THREE.Mesh(headGeo, white);
        head.position.set(0, 0.04, 0.2);
        const bk = new THREE.Mesh(beakGeo, beak);
        bk.position.set(0, 0.03, 0.29);
        b.add(head, bk);
        const wings = [1, -1].map((side) => {
          const w = new THREE.Group();
          w.add(new THREE.Mesh(wing, white), new THREE.Mesh(tipGeo, grey));
          w.scale.x = side;
          b.add(w);
          return w;
        });
        b.scale.setScalar(s * range(0.85, 1.15));
        flock.add(b);
        list.push({ b, wings, phase: range(0, Math.PI * 2), rad: radius * range(0.6, 1.25), h: height + range(-1, 1.5), sp: range(0.2, 0.4) * (rand2() ? 1 : -1) });
      }
      function rand2() { return k.rand() < 0.75; }
      k.group.add(flock);
      k.onUpdate((dt, t) => {
        for (const o2 of list) {
          const a = o2.phase + t * o2.sp;
          o2.b.position.set(cx + Math.sin(a) * o2.rad, o2.h + Math.sin(t * 0.7 + o2.phase) * 0.4, cz + Math.cos(a) * o2.rad);
          o2.b.rotation.y = a + (o2.sp > 0 ? Math.PI / 2 : -Math.PI / 2);
          o2.b.rotation.z = (o2.sp > 0 ? -1 : 1) * 0.25; // dönüşte yatış
          const flap = Math.sin(t * 7 + o2.phase);
          const glide = Math.sin(t * 0.5 + o2.phase) > 0.3 ? 0.15 : 1; // arada süzülme
          o2.wings[0].rotation.z = flap * 0.55 * glide;
          o2.wings[1].rotation.z = -flap * 0.55 * glide;
        }
      });
    };
  });
})();
