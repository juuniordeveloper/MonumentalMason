/* =========================================================
   ANIT USTASI — Çevre kiti: şehir
   Evler, camiler, kiliseler, surlar, yollar, arabalar,
   tramvay, insanlar, lambalar ve tekneler.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  AU.envPlugins = AU.envPlugins || [];

  AU.envPlugins.push(function city(k) {
    const { THREE, add, range, pick, lazyGeo, compound } = k;
    const PI = Math.PI;

    /* ---------- Geometriler ---------- */
    function shapeExtrude(points, depth, bevel) {
      const s = new THREE.Shape();
      points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
      s.closePath();
      const g = new THREE.ExtrudeGeometry(s, bevel
        ? { depth, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }
        : { depth, bevelEnabled: false });
      return g.translate(0, 0, -depth / 2).rotateY(-PI / 2); // uzunluk +z yönünde
    }
    function ensureGeos() {
      lazyGeo('carBody', () => shapeExtrude([[-1, 0.2], [1, 0.2], [1.02, 0.46], [0.55, 0.52], [0.28, 0.86], [-0.5, 0.86], [-0.82, 0.55], [-1.02, 0.5]], 0.86, true));
      lazyGeo('carGlass', () => shapeExtrude([[0.63, 0.5], [0.34, 0.86], [-0.55, 0.86], [-0.9, 0.52]], 0.98, false));
      lazyGeo('wheel', () => new THREE.CylinderGeometry(0.2, 0.2, 0.16, 12).rotateZ(PI / 2).translate(0, 0.2, 0));
      lazyGeo('person', () => new THREE.CapsuleGeometry(0.5, 1, 2, 6).translate(0, 1, 0));
      lazyGeo('onion', () => new THREE.LatheGeometry(
        [[0.82, 0], [1.02, 0.15], [1.1, 0.32], [1.0, 0.5], [0.72, 0.68], [0.36, 0.84], [0.12, 0.95], [0, 1]].map(([x, y]) => new THREE.Vector2(x * 0.5, y)), 14));
      lazyGeo('hull', () => shapeExtrude([[-1, 0.4], [-1, 0.05], [0.7, 0], [1.05, 0.45]], 0.5, false).scale(1, 1, 1));
    }

    /* ---------- Evler ---------- */
    const WIN = [0.17, 0.28, 0.04];

    function houseWindows(p, w, d, h, ry, y, color, floorH) {
      const floors = Math.max(1, Math.floor(h / floorH));
      const parts = [];
      const colsW = Math.max(1, Math.floor(w / 0.5));
      const colsD = Math.max(1, Math.floor(d / 0.5));
      for (let f = 0; f < floors; f++) {
        const wy = 0.28 + f * floorH;
        if (wy + WIN[1] > h - 0.08) break;
        for (let c = 0; c < colsW; c++) {
          const x = -w / 2 + (w / colsW) * (c + 0.5);
          if (f === 0 && c === Math.floor(colsW / 2)) {
            parts.push(['box', { x, y: 0, z: d / 2 + 0.01, sx: 0.24, sy: 0.46, sz: 0.04, color: '#4a3527' }]); // kapı
          } else {
            parts.push(['win', { x, y: wy, z: d / 2 + 0.01, sx: WIN[0], sy: WIN[1], sz: WIN[2], color }]);
          }
          parts.push(['win', { x, y: wy, z: -d / 2 - 0.01, sx: WIN[0], sy: WIN[1], sz: WIN[2], color }]);
        }
        for (let c = 0; c < colsD; c++) {
          const z = -d / 2 + (d / colsD) * (c + 0.5);
          parts.push(['win', { x: w / 2 + 0.01, y: wy, z, sx: WIN[2], sy: WIN[1], sz: WIN[0], color }]);
          parts.push(['win', { x: -w / 2 - 0.01, y: wy, z, sx: WIN[2], sy: WIN[1], sz: WIN[0], color }]);
        }
      }
      compound(p.x, y, p.z, ry, parts);
    }

    function houseBands(p, w, d, h, ry, y, color, floorH) {
      const floors = Math.max(1, Math.floor(h / floorH));
      for (let f = 0; f < floors; f++) {
        const wy = y + 0.28 + f * floorH;
        if (wy - y + 0.2 > h) break;
        add('win', { x: p.x, y: wy, z: p.z, sx: w + 0.03, sy: 0.2, sz: d * 0.7, ry, color });
        add('win', { x: p.x, y: wy, z: p.z, sx: w * 0.7, sy: 0.2, sz: d + 0.03, ry, color });
      }
    }

    function houseRoof(p, w, d, h, ry, y, o) {
      const roof = o.roof || 'hip';
      const rc = pick(o.roofColors || o.colors);
      const top = y + h;
      if (roof === 'hip') add('pyramid', { x: p.x, y: top, z: p.z, sx: w * 1.1, sy: range(0.35, 0.55) * Math.min(w, d), sz: d * 1.1, ry, color: rc });
      else if (roof === 'gable') add('gable', { x: p.x, y: top, z: p.z, sx: w * 1.08, sy: range(0.3, 0.5) * w, sz: d * 1.08, ry, color: rc });
      else if (roof === 'mansard') add('mansard', { x: p.x, y: top, z: p.z, sx: w * 1.02, sy: 0.55, sz: d * 1.02, ry, color: rc });
      else add('box', { x: p.x, y: top, z: p.z, sx: w * 1.04, sy: 0.08, sz: d * 1.04, ry, color: rc }); // düz dam + korkuluk
      if (o.chimneys && k.rand() < 0.35) {
        const [cx, cz] = k.local(p.x, p.z, ry, w * 0.25, d * 0.2);
        add('box', { x: cx, y: top, z: cz, sx: 0.14, sy: 0.55, sz: 0.14, ry, color: '#7a5a48' });
      }
    }

    // o: {colors, roofColors, w:[a,b], d:[a,b], h:[a,b], roof:'hip'|'gable'|'flat'|'mansard',
    //     windows: renk, detailR: bu yarıçapın içinde tek tek pencere, floorH, y, face, chimneys}
    k.houses = function (pts, o) {
      const floorH = o.floorH || 0.75;
      for (const p of pts) {
        const w = range(o.w[0], o.w[1]);
        const d = range((o.d || o.w)[0], (o.d || o.w)[1]);
        const h = range(o.h[0], o.h[1]);
        const y = p.y !== undefined ? p.y : (o.y === undefined ? k.groundY : o.y);
        const ry = p.ry !== undefined ? p.ry : (o.face === false ? pick([0, PI / 2]) : p.a || 0) + range(-0.12, 0.12);
        add('box', { x: p.x, y, z: p.z, sx: w, sy: h, sz: d, ry, color: pick(o.colors) });
        if (o.windows) {
          const r = p.r !== undefined ? p.r : Math.hypot(p.x, p.z);
          if (r < (o.detailR || 999)) houseWindows(p, w, d, h, ry, y, o.windows, floorH);
          else houseBands(p, w, d, h, ry, y, o.windows, floorH);
        }
        if (o.trim) add('box', { x: p.x, y: y + h - 0.12, z: p.z, sx: w + 0.05, sy: 0.08, sz: d + 0.05, ry, color: o.trim });
        houseRoof(p, w, d, h, ry, y, o);
      }
    };

    /* ---------- Camiler ve minareler ---------- */
    function minaretParts(dx, dz, s, h, stone, lead, balconies) {
      const parts = [
        ['oct', { x: dx, z: dz, sx: 0.42, sy: 0.5, color: stone }],
        ['cyl', { x: dx, z: dz, y: 0.5, sx: 0.26, sy: h - 0.5, color: stone }],
        ['cone', { x: dx, z: dz, y: h, sx: 0.3, sy: 0.95, color: lead }],
      ];
      for (let i = 0; i < balconies; i++) {
        parts.push(['cyl', { x: dx, z: dz, y: h * (0.62 + i * 0.13), sx: 0.44, sy: 0.07, color: stone }]);
      }
      return parts;
    }

    k.minaret = function (x, z, o) {
      const s = o.s || 1;
      compound(x, o.y === undefined ? k.groundY : o.y, z, 0, minaretParts(0, 0, s, o.h || 3.8, o.stone || '#e6dccb', o.lead || '#8d99a4', o.balconies || 1), s);
    };

    // Osmanlı camisi: gövde + pencereler, kasnak, kubbe, yarım kubbeler, köşe kubbeleri, minareler
    k.mosque = function (x, z, o) {
      const s = o.s || 1, ry = o.ry || 0, y = o.y === undefined ? k.groundY : o.y;
      const stone = o.stone || '#e6dccb', lead = o.lead || '#8d99a4';
      const parts = [
        ['box', { sx: 3, sy: 1.3, sz: 3, color: stone }],
        ['box', { y: 1.22, sx: 3.06, sy: 0.08, sz: 3.06, color: '#d2c7b4' }],
        ['cyl', { y: 1.3, sx: 2.1, sy: 0.28, color: stone }],
        ['dome', { y: 1.58, sx: 2.1, sy: 1.5, sz: 2.1, color: lead }],
        ['cone', { y: 2.3, sx: 0.06, sy: 0.35, color: '#c9a646' }],
        ['dome', { y: 1.3, z: 1.1, sx: 1.25, sy: 0.9, sz: 1.25, color: lead }],
        ['dome', { y: 1.3, z: -1.1, sx: 1.25, sy: 0.9, sz: 1.25, color: lead }],
      ];
      for (const [dx, dz] of [[-1.15, -1.15], [1.15, -1.15], [-1.15, 1.15], [1.15, 1.15]]) {
        parts.push(['cyl', { x: dx, z: dz, y: 1.3, sx: 0.5, sy: 0.12, color: stone }]);
        parts.push(['dome', { x: dx, z: dz, y: 1.42, sx: 0.5, sy: 0.42, sz: 0.5, color: lead }]);
      }
      for (const face of [1.51, -1.51]) {
        for (const wx of [-0.9, -0.3, 0.3, 0.9]) {
          parts.push(['box', { x: wx, z: face, y: 0.35, sx: 0.18, sy: 0.32, sz: 0.03, color: '#3b3a3a' }]);
          parts.push(['box', { x: face, z: wx, y: 0.35, sx: 0.03, sy: 0.32, sz: 0.18, color: '#3b3a3a' }]);
        }
      }
      if (o.minarets === 6 || o.court) {
        // Revaklı avlu: çevre duvarı ve küçük kubbe sıraları
        parts.push(['box', { z: 3.3, sx: 3.4, sy: 0.6, sz: 3.2, color: stone }]);
        for (let i = -1.2; i <= 1.21; i += 0.6) {
          parts.push(['dome', { x: i, z: 4.75, y: 0.6, sx: 0.4, sy: 0.3, sz: 0.4, color: lead }]);
          parts.push(['dome', { x: -1.55, z: 3.3 + i, y: 0.6, sx: 0.4, sy: 0.3, sz: 0.4, color: lead }]);
          parts.push(['dome', { x: 1.55, z: 3.3 + i, y: 0.6, sx: 0.4, sy: 0.3, sz: 0.4, color: lead }]);
        }
      }
      const spots = {
        1: [[1.8, 1.6]],
        2: [[-1.8, 1.6], [1.8, 1.6]],
        4: [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]],
        6: [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8], [-1.85, 4.9], [1.85, 4.9]],
      }[o.minarets || 0] || [];
      for (const [dx, dz] of spots) {
        parts.push(...minaretParts(dx, dz, 1, o.minaretH || 4.4, stone, lead, o.balconies || (o.minarets >= 4 ? 3 : 2)));
      }
      compound(x, y, z, ry, parts, s);
    };

    /* ---------- Kiliseler ---------- */
    // Latin kilisesi: nef + üçgen çatı + çan kulesi (+ istenirse kubbe)
    k.church = function (x, z, o) {
      const s = o.s || 1, ry = o.ry || 0, y = o.y === undefined ? k.groundY : o.y;
      const stone = o.stone || '#e3d6bd', roof = o.roof || '#a5512f';
      const parts = [
        ['box', { sx: 1.6, sy: 1.5, sz: 3.6, color: stone }],
        ['gable', { y: 1.5, sx: 1.7, sy: 0.8, sz: 3.7, ry: 0, color: roof }],
        ['box', { x: 0.55, z: 1.9, sx: 0.8, sy: 3.4, sz: 0.8, color: stone }],
        [o.spire ? 'pyramid' : 'dome', o.spire
          ? { x: 0.55, z: 1.9, y: 3.4, sx: 0.85, sy: 1.6, color: roof }
          : { x: 0.55, z: 1.9, y: 3.4, sx: 0.8, sy: 0.6, sz: 0.8, color: roof }],
      ];
      if (o.dome) {
        parts.push(['cyl', { y: 1.5, z: -0.6, sx: 1.4, sy: 0.6, color: stone }]);
        parts.push(['dome', { y: 2.1, z: -0.6, sx: 1.45, sy: 1.3, sz: 1.45, color: o.domeColor || '#8f9aa3' }]);
      }
      compound(x, y, z, ry, parts, s);
    };

    // Rus Ortodoks kilisesi: gövde + 5 soğan kubbe + çan kulesi
    k.onionChurch = function (x, z, o) {
      ensureGeos();
      const s = o.s || 1, ry = o.ry || 0, y = o.y === undefined ? k.groundY : o.y;
      const wall = o.wall || '#f1ead8', dome = o.domeColor || '#d4a531';
      const parts = [
        ['box', { sx: 2, sy: 1.6, sz: 2, color: wall }],
        ['box', { y: 1.6, sx: 2.05, sy: 0.12, sz: 2.05, color: '#c9bfa8' }],
        ['box', { z: 1.6, sx: 1.2, sy: 1.0, sz: 1.2, color: wall }],
        ['box', { z: 2.7, sx: 0.8, sy: 2.6, sz: 0.8, color: wall }],
        ['pyramid', { z: 2.7, y: 2.6, sx: 0.7, sy: 1.1, color: o.tent || '#2f6f4f' }],
        ['cyl', { y: 1.7, sx: 0.7, sy: 0.7, color: wall }],
        ['onion', { y: 2.4, sx: 0.9, sy: 0.9, sz: 0.9, color: dome }],
      ];
      for (const [dx, dz] of [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]]) {
        parts.push(['cyl', { x: dx, z: dz, y: 1.7, sx: 0.4, sy: 0.45, color: wall }]);
        parts.push(['onion', { x: dx, z: dz, y: 2.15, sx: 0.55, sy: 0.6, sz: 0.55, color: dome }]);
      }
      compound(x, y, z, ry, parts, s);
    };

    /* ---------- Surlar ---------- */
    k.walls = function (x1, z1, x2, z2, o) {
      const pts = k.line(x1, z1, x2, z2, o.towerStep || 5);
      const y = o.y === undefined ? k.groundY : o.y;
      const h = o.h || 2;
      const towerW = o.towerW || 1.3;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        add(o.roundTowers ? 'oct' : 'box', { x: p.x, y, z: p.z, sx: towerW, sy: h + 0.7, sz: towerW, ry: p.ry, color: o.tower || o.color });
        for (let m = 0; m < 6; m++) {
          const a = (m / 6) * PI * 2;
          add('box', { x: p.x + Math.sin(a) * towerW * 0.42, y: y + h + 0.7, z: p.z + Math.cos(a) * towerW * 0.42, sx: 0.2, sy: 0.22, sz: 0.2, ry: a, color: o.tower || o.color });
        }
        if (i === pts.length - 1) break;
        const q = pts[i + 1];
        const len = Math.hypot(q.x - p.x, q.z - p.z);
        add('box', { x: (p.x + q.x) / 2, y, z: (p.z + q.z) / 2, sx: o.thick || 0.6, sy: h, sz: len, ry: p.ry, color: o.color });
        // Mazgallar
        for (let t = 0.6; t < len - 0.4; t += 0.5) {
          const f = t / len;
          add('box', { x: p.x + (q.x - p.x) * f, y: y + h, z: p.z + (q.z - p.z) * f, sx: (o.thick || 0.6) + 0.02, sy: 0.2, sz: 0.24, ry: p.ry, color: o.color });
        }
      }
    };

    /* ---------- Yollar ve araçlar ---------- */
    k.road = function (x1, z1, x2, z2, w, o) {
      const opt = o || {};
      const len = Math.hypot(x2 - x1, z2 - z1);
      const ry = Math.atan2(x2 - x1, z2 - z1);
      const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
      if (opt.sidewalk !== false) k.patch(cx, cz, w + 0.8, len, opt.walk || '#b9b2a6', ry);
      k.patch(cx, cz, w, len, opt.color || '#4d4d4f', ry);
      if (opt.lines !== false) {
        for (let t = 0.5; t < len; t += 1.2) {
          const [px, pz] = k.local(x1, z1, ry, 0, t);
          add('box', { x: px, y: k.groundY + 0.004, z: pz, sx: 0.07, sy: 0.02, sz: 0.55, ry, color: '#f1f1ea' });
        }
      }
    };

    const CAR_COLORS = ['#c0392b', '#2c3e50', '#f1c40f', '#ecf0f1', '#2980b9', '#7f8c8d', '#1e1e1e', '#8e44ad', '#27ae60'];
    function carParts(color) {
      return [
        ['carBody', { color }],
        ['carGlass', { color: '#2b3640' }],
        ...[[0.44, 0.6], [-0.44, 0.6], [0.44, -0.62], [-0.44, -0.62]].map(([x, z]) => ['wheel', { x, z, sx: 1, color: '#1a1a1a' }]),
      ];
    }

    // Duran araçlar (yol kenarında, trafikte)
    k.cars = function (pts, o) {
      ensureGeos();
      const opt = o || {};
      for (const p of pts) {
        const y = p.y === undefined ? k.groundY : p.y;
        compound(p.x, y, p.z, p.ry || 0, carParts(opt.color || pick(CAR_COLORS)), opt.scale || 0.42);
      }
    };

    // Bir hat boyunca gidip gelen araçlar (tek tek mesh; az sayıda)
    function vehicleGroup(parts, scale) {
      ensureGeos();
      const g = new THREE.Group();
      const geoMap = {
        carBody: 'carBody', carGlass: 'carGlass', wheel: 'wheel', box: 'box',
      };
      for (const [name, p] of parts) {
        const def = k.getGeo(geoMap[name]);
        const m = new THREE.Mesh(def, k.mat(p.color));
        m.position.set((p.x || 0) * scale, (p.y || 0) * scale, (p.z || 0) * scale);
        m.scale.set((p.sx || 1) * scale, (p.sy || 1) * scale, (p.sz || p.sx || 1) * scale);
        g.add(m);
      }
      k.group.add(g);
      return g;
    }

    function animateAlong(g, path, speed, offset, y) {
      const [x1, z1, x2, z2] = path;
      const len = Math.hypot(x2 - x1, z2 - z1);
      const dir = Math.atan2(x2 - x1, z2 - z1);
      k.onUpdate((dt, t) => {
        const u = ((t * speed) / len + offset) % 2;
        const f = u < 1 ? u : 2 - u; // gidip gel
        g.position.set(x1 + (x2 - x1) * f, y, z1 + (z2 - z1) * f);
        g.rotation.y = dir + (u < 1 ? 0 : PI);
      });
    }

    k.traffic = function (path, count, o) {
      const opt = o || {};
      for (let i = 0; i < count; i++) {
        const g = vehicleGroup(carParts(pick(CAR_COLORS)), opt.scale || 0.42);
        const side = i % 2 ? 1 : -1;
        const nx = Math.cos(Math.atan2(path[2] - path[0], path[3] - path[1])) * 0.35 * side;
        const nz = -Math.sin(Math.atan2(path[2] - path[0], path[3] - path[1])) * 0.35 * side;
        animateAlong(g, [path[0] + nx, path[1] + nz, path[2] + nx, path[3] + nz], opt.speed || range(1.5, 2.6), i / count, k.groundY);
      }
    };

    // Tramvay / otobüs
    k.tram = function (path, o) {
      const opt = o || {};
      const c = opt.color || '#c0392b';
      const parts = [
        ['box', { y: 0.15, sx: 0.9, sy: 0.9, sz: 4.6, color: '#f2f2ef' }],
        ['box', { y: 0.15, sx: 0.92, sy: 0.25, sz: 4.62, color: c }],
        ['box', { y: 0.55, sx: 0.94, sy: 0.32, sz: 4.3, color: '#2b3640' }],
        ['box', { y: 1.05, sx: 0.7, sy: 0.08, sz: 3.6, color: '#bdbdbd' }],
      ];
      const g = vehicleGroup(parts, opt.scale || 0.42);
      animateAlong(g, path, opt.speed || 1.2, 0, k.groundY);
    };

    /* ---------- İnsanlar, lambalar, banklar ---------- */
    const CLOTHES = ['#c0392b', '#2c3e50', '#f1c40f', '#ecf0f1', '#2980b9', '#16a085', '#8e44ad', '#d35400', '#34495e', '#e8d9c0'];
    k.people = function (pts, o) {
      ensureGeos();
      const s = (o && o.scale) || 0.13;
      for (const p of pts) {
        const y = p.y === undefined ? k.groundY : p.y;
        const h = range(0.9, 1.1);
        add('person', { x: p.x, y, z: p.z, sx: s, sy: s * h, sz: s * 0.8, ry: range(0, 6), color: pick(CLOTHES) });
        add('ball', { x: p.x, y: y + s * 2.05 * h, z: p.z, sx: s * 0.75, color: pick(['#e0b896', '#c99a74', '#8d5a3b', '#f1d0b0']) });
      }
    };

    k.lamps = function (pts, o) {
      for (const p of pts) {
        const y = p.y === undefined ? k.groundY : p.y;
        add('cyl', { x: p.x, y, z: p.z, sx: 0.05, sy: 1.0, color: (o && o.color) || '#2f3337' });
        add('lampHead', { x: p.x, y: y + 1.0, z: p.z, sx: 0.14, color: '#fff2c4' });
      }
    };

    k.benches = function (pts) {
      for (const p of pts) {
        compound(p.x, k.groundY, p.z, p.ry || 0, [
          ['box', { y: 0.12, sx: 0.6, sy: 0.04, sz: 0.2, color: '#7a5a3a' }],
          ['box', { y: 0.16, z: -0.09, sx: 0.6, sy: 0.16, sz: 0.03, color: '#7a5a3a' }],
          ['box', { x: -0.26, sx: 0.04, sy: 0.12, sz: 0.18, color: '#2f3337' }],
          ['box', { x: 0.26, sx: 0.04, sy: 0.12, sz: 0.18, color: '#2f3337' }],
        ]);
      }
    };

    /* ---------- Tekneler ---------- */
    k.boat = function (path, o) {
      ensureGeos();
      const opt = o || {};
      const s = opt.s || 1;
      const g = new THREE.Group();
      const hull = new THREE.Mesh(k.getGeo('hull'), k.mat(opt.hull || '#ffffff'));
      hull.scale.set(1.8 * s, 1 * s, 1.5 * s);
      g.add(hull);
      const deck = new THREE.Mesh(k.getGeo('box'), k.mat(opt.deck || '#f2efe8'));
      deck.scale.set(0.7 * s, 0.38 * s, 1.7 * s);
      deck.position.set(0, 0.42 * s, -0.15 * s);
      g.add(deck);
      if (opt.windows !== false) {
        const band = new THREE.Mesh(k.getGeo('box'), k.mat('#2b3640'));
        band.scale.set(0.72 * s, 0.12 * s, 1.6 * s);
        band.position.set(0, 0.56 * s, -0.15 * s);
        g.add(band);
      }
      if (opt.funnel) {
        const f = new THREE.Mesh(k.getGeo('cyl'), k.mat(opt.funnel));
        f.scale.set(0.2 * s, 0.42 * s, 0.2 * s);
        f.position.set(0, 0.8 * s, -0.1 * s);
        g.add(f);
      }
      k.group.add(g);
      animateAlong(g, path, opt.speed || 1, range(0, 1), opt.y === undefined ? k.groundY - 0.01 : opt.y);
      k.onUpdate((dt, t) => { g.rotation.z = Math.sin(t * 1.3 + s) * 0.03; });
    };
  });
})();
