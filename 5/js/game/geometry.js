/* =========================================================
   ANIT USTASI — Parça geometrileri
   Bölüm verisindeki şekil tanımlarından (box, cyl, arch...)
   Three.js nesneleri üretir. Her şeklin tabanı y = 0'dadır.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  AU.setupGeometry = function (ctx) {
    const { THREE, DEG } = ctx;
    const V3 = THREE.Vector3;

    // Konuma bağlı sabit "rastgele" sayı (aynı taş her seferinde aynı görünür)
    function hash3(x, y, z, seed) {
      const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453;
      return n - Math.floor(n);
    }

    function rockGeometry(s) {
      // Kutuyu bölüp köşelerini hafifçe oynatarak doğal taş görünümü
      const [w, h, d] = s.size;
      const g = new THREE.BoxGeometry(w, h, d, 2, 4, 2);
      const pos = g.attributes.position;
      const j = s.jitter || 0.06;
      const seed = s.seed || 1;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const kx = Math.round(x * 1000), ky = Math.round(y * 1000), kz = Math.round(z * 1000);
        const flat = Math.abs(Math.abs(y) - h / 2) < 1e-4; // alt ve üst yüz düz kalsın
        const taper = 1 - 0.06 * (y / h + 0.5);
        pos.setXYZ(
          i,
          x * taper + (hash3(kx, ky, kz, seed) - 0.5) * 2 * j,
          flat ? y : y + (hash3(ky, kz, kx, seed) - 0.5) * 2 * j,
          z * taper + (hash3(kz, kx, ky, seed) - 0.5) * 2 * j
        );
      }
      g.computeVertexNormals();
      return g.translate(0, h / 2, 0);
    }

    function triGeometry(s) {
      const sh = new THREE.Shape();
      sh.moveTo(-s.w / 2, 0);
      sh.lineTo(s.w / 2, 0);
      sh.lineTo(0, s.h);
      sh.closePath();
      return new THREE.ExtrudeGeometry(sh, { depth: s.d, bevelEnabled: false }).translate(0, 0, -s.d / 2);
    }

    function archGeometry(s) {
      const sh = new THREE.Shape();
      sh.moveTo(-s.w / 2, 0);
      sh.lineTo(-s.r, 0);
      sh.lineTo(-s.r, s.spring);
      sh.absarc(0, s.spring, s.r, Math.PI, 0, true);
      sh.lineTo(s.r, 0);
      sh.lineTo(s.w / 2, 0);
      sh.lineTo(s.w / 2, s.h);
      sh.lineTo(-s.w / 2, s.h);
      sh.closePath();
      return new THREE.ExtrudeGeometry(sh, { depth: s.d, bevelEnabled: false, curveSegments: 16 }).translate(0, 0, -s.d / 2);
    }

    // Serbest profil: pts = [[x, y], ...] dış hat, holes = delikler; z boyunca d kalınlık.
    // axis: 'y' → pts zemindeki taban izi [x, z], d kadar yukarı yükseltilir.
    function extrudeGeometry(s) {
      const flipY = s.axis === 'y' ? -1 : 1;
      const toShape = (pts, S) => {
        const sh = new S();
        pts.forEach(([x, y], i) => (i ? sh.lineTo(x, y * flipY) : sh.moveTo(x, y * flipY)));
        return sh;
      };
      const sh = toShape(s.pts, THREE.Shape);
      for (const h of s.holes || []) sh.holes.push(toShape(h, THREE.Path));
      const g = new THREE.ExtrudeGeometry(sh, {
        depth: s.d, curveSegments: 12,
        bevelEnabled: !!s.bevel, bevelSize: s.bevel || 0, bevelThickness: s.bevel || 0, bevelSegments: 1,
      });
      if (s.axis === 'y') return g.rotateX(-Math.PI / 2);
      return g.translate(0, 0, -s.d / 2);
    }

    // Kıvrık boru (kablo, kemer kirişi, heykel kolu): noktalar arasından yumuşak eğri
    function tubeGeometry(s) {
      const curve = new THREE.CatmullRomCurve3(s.pts.map((p) => new V3(p[0], p[1], p[2])), !!s.closed, 'catmullrom', s.tension === undefined ? 0.5 : s.tension);
      return new THREE.TubeGeometry(curve, s.segs || Math.max(8, s.pts.length * 6), s.r, s.radial || 8, !!s.closed);
    }

    // Kırma çatı: w × d taban, h yükseklik, mahya uzunluğu = w * ridge
    function hipGeometry(s) {
      const hw = s.w / 2, hd = s.d / 2, rx = (s.w * (s.ridge || 0)) / 2;
      const A = [-hw, 0, -hd], B = [hw, 0, -hd], C = [hw, 0, hd], D = [-hw, 0, hd];
      const R1 = [-rx, s.h, 0], R2 = [rx, s.h, 0];
      const tris = [D, C, R2, D, R2, R1, B, A, R1, B, R1, R2, C, B, R2, A, D, R1, A, B, C, A, C, D];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(), 3));
      g.computeVertexNormals();
      return g;
    }

    // İki nokta arasında kare kesitli ince çubuk (kafes elemanı) — TubeGeometry'den çok daha ucuz
    const UP = new V3(0, 1, 0);
    function barGeometry(s) {
      const a = new V3(...s.a), b = new V3(...s.b);
      const dir = b.clone().sub(a);
      const len = dir.length() || 0.001;
      const g = new THREE.BoxGeometry(s.r * 2, len, s.r * 2).translate(0, len / 2, 0);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
      return g.translate(a.x, a.y, a.z);
    }

    const BUILDERS = {
      bar: barGeometry,
      box: (s) => new THREE.BoxGeometry(s.size[0], s.size[1], s.size[2]).translate(0, s.size[1] / 2, 0),
      rock: rockGeometry,
      cyl: (s) => new THREE.CylinderGeometry(s.rt, s.rb, s.h, s.seg || 16, 1, !!s.open).translate(0, s.h / 2, 0),
      cone: (s) => new THREE.ConeGeometry(s.r, s.h, s.seg || 16).translate(0, s.h / 2, 0),
      sphere: (s) => new THREE.SphereGeometry(s.r, s.seg || 18, s.rings || 12).translate(0, s.r, 0),
      hemi: (s) => new THREE.SphereGeometry(s.r, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, s.sy || 1, 1),
      half: (s) => new THREE.SphereGeometry(s.r, 24, 12, 0, Math.PI, 0, Math.PI / 2).scale(1, s.sy || 1, 1),
      // Küre dilimi (kabuk): Sidney Opera Binası yelkenleri, apsis yarım kubbeleri
      shell: (s) => new THREE.SphereGeometry(s.r, s.seg || 24, s.rings || 12, s.phi0 || 0, s.phi || Math.PI, s.theta0 || 0, s.theta || Math.PI / 2),
      // Profil eğrisini Y ekseni etrafında döndürerek (soğan kubbe, tribün...)
      lathe: (s) => new THREE.LatheGeometry(s.points.map((p) => new THREE.Vector2(p[0], p[1])), s.seg || 24, s.phi0 || 0, s.phi || Math.PI * 2),
      torus: (s) => new THREE.TorusGeometry(s.r, s.tube, s.radial || 6, s.seg || 20, s.arc || Math.PI * 2),
      tri: triGeometry,
      arch: archGeometry,
      extrude: extrudeGeometry,
      tube: tubeGeometry,
      hip: hipGeometry,
    };

    function makeGeometry(s) {
      const build = BUILDERS[s.shape];
      if (!build) throw new Error('Bilinmeyen şekil: ' + s.shape);
      const g = build(s);
      if (s.scale) g.scale(s.scale[0], s.scale[1], s.scale[2]);
      return g;
    }

    const SHELLS = new Set(['hemi', 'half', 'lathe', 'shell', 'hip']);
    // Yumuşak gölgelenen (pürüzsüz) yüzeyler; flat: true ile kapatılabilir
    const SMOOTH = new Set(['sphere', 'hemi', 'half', 'shell', 'lathe', 'torus', 'tube']);
    const isSmooth = (s) => !s.flat && (s.smooth || SMOOTH.has(s.shape) || (s.shape === 'cyl' && (s.seg || 16) >= 12));

    function ghostMaterial(doubleSided) {
      return new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        // Arka yüzler çizilmez: yuvanın tabanı zeminle çakışıp titremesin
        side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
    }

    function solidMaterial(s, base, doubleSided) {
      const m = makeSolid(s, base, doubleSided);
      if (s.glow) {
        // Gece yanan yüzey (pencere, fener, vitray)
        m.userData.glow = true;
        m.userData.glowColor = s.glowColor || '#ffcf73';
        m.emissive.set(m.userData.glowColor);
        m.emissiveIntensity = 0;
      }
      return m;
    }

    function makeSolid(s, base, doubleSided) {
      return new THREE.MeshStandardMaterial({
        color: s.color || '#cccccc',
        roughness: s.metal ? 0.45 : 0.85,
        metalness: s.metal ? 0.55 : 0.03,
        flatShading: !isSmooth(s),
        side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
        // TİTREME (z-fighting) ÇÖZÜMÜ: ana gövde biraz geriye, süsler daha az
        // geriye itilir; kenar çizgileri hep en önde kalır.
        polygonOffset: true,
        polygonOffsetFactor: base ? 2 : 1,
        polygonOffsetUnits: base ? 2 : 1,
        // İsteğe bağlı yarı saydamlık (ör. Göbeklitepe'nin membran çatısı)
        transparent: s.opacity !== undefined,
        opacity: s.opacity === undefined ? 1 : s.opacity,
        depthWrite: s.opacity === undefined,
      });
    }

    function edgeLines(edges, ghost) {
      return new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({
          color: ghost ? '#ffffff' : '#2b2118',
          transparent: true,
          opacity: ghost ? 0.45 : 0.16,
          depthWrite: !ghost,
        })
      );
    }

    /* ---------- Birleştirme ----------
       PERFORMANS: Ayrıntılı modellerde bir parça yüzlerce alt şekilden oluşur.
       Aynı malzemeyi paylaşan alt şekiller tek geometride birleştirilir, böylece
       parça başına yalnızca birkaç çizim çağrısı kalır.                       */
    const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), ONE = new V3(1, 1, 1);

    function placedGeometry(s) {
      let g = makeGeometry(s);
      if (g.index) g = g.toNonIndexed();
      if (!g.attributes.normal) g.computeVertexNormals();
      // Sıra 'YXZ': önce şekil kendi içinde eğilir (X, Z), en son Y ile cepheye döndürülür.
      // Böylece onFaces/ringWins gibi yardımcılar eğik süsleri de doğru yöne çevirir.
      tmpE.set((s.rotX || 0) * DEG, (s.rotY || 0) * DEG, (s.rotZ || 0) * DEG, 'YXZ');
      tmpQ.setFromEuler(tmpE);
      const at = s.at || [0, 0, 0];
      g.applyMatrix4(tmpM.compose(new V3(at[0], at[1], at[2]), tmpQ, ONE));
      return g;
    }

    function mergeGeometries(list) {
      if (list.length === 1) return list[0];
      let n = 0;
      for (const g of list) n += g.attributes.position.count;
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
      let o = 0;
      for (const g of list) {
        pos.set(g.attributes.position.array, o);
        nor.set(g.attributes.normal.array, o);
        o += g.attributes.position.count * 3;
        g.dispose();
      }
      const m = new THREE.BufferGeometry();
      m.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      m.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      return m;
    }

    // Küçük süs mü? (hayalet yuvada çizgisi çizilmez, kenar çizgisi abartılmaz)
    function isSmall(s) {
      if (s.shape === 'box') return s.size[0] * s.size[1] * s.size[2] < 0.02;
      return !!s.detail;
    }

    function materialKey(s, base, ghost) {
      const ds = SHELLS.has(s.shape) || !!s.double;
      if (ghost) return [isSmall(s) ? 's' : 'b', ds].join('|');
      return [s.color || '#cccccc', !!s.glow, s.glowColor || '', s.opacity === undefined ? '' : s.opacity, isSmooth(s), ds, base, !!s.metal, s.shape === 'rock', !!s.noEdges].join('|');
    }

    // Aynı parça tanımı (ör. dört Eyfel ayağı) için birleştirilmiş geometriler bir kez üretilir
    let geoCache = new WeakMap();
    const cachedGeos = [];
    // Bölüm değişince önbellekteki geometriler serbest bırakılır (bellek birikmesin)
    function clearCache() {
      for (const g of cachedGeos) g.dispose();
      cachedGeos.length = 0;
      geoCache = new WeakMap();
    }
    function mergedBuckets(def, ghost) {
      let entry = geoCache.get(def);
      if (!entry) { entry = {}; geoCache.set(def, entry); }
      const k = ghost ? 'ghost' : 'solid';
      if (entry[k]) return entry[k];
      const buckets = new Map();
      def.forEach((s, index) => {
        const base = index === 0;
        const key = materialKey(s, base, ghost);
        if (!buckets.has(key)) buckets.set(key, { s, base, small: isSmall(s), geos: [] });
        buckets.get(key).geos.push(placedGeometry(s));
      });
      entry[k] = [...buckets.values()].map((b) => {
        const geo = mergeGeometries(b.geos);
        geo.computeBoundingSphere();
        const wantEdges = ghost ? !b.small : !b.s.noEdges && !isSmooth(b.s);
        const edges = wantEdges ? new THREE.EdgesGeometry(geo, b.s.shape === 'rock' ? 40 : 25) : null;
        for (const g of [geo, edges]) if (g) { g.userData.shared = true; cachedGeos.push(g); }
        return { ...b, geo, edges };
      });
      return entry[k];
    }

    // Parça tanımından 3B nesne (Group) üretir. Geometriler önbellekten paylaşılır.
    function buildPart(def, ghost) {
      const group = new THREE.Group();
      for (const { s, base, geo, edges } of mergedBuckets(def, ghost)) {
        const doubleSided = SHELLS.has(s.shape) || !!s.double;
        const mesh = new THREE.Mesh(geo, ghost ? ghostMaterial(doubleSided) : solidMaterial(s, base, doubleSided));
        if (!ghost) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
        if (edges) mesh.add(edgeLines(edges, ghost));
        group.add(mesh);
      }
      return group;
    }

    function disposeTree(obj) {
      // Önbellekte paylaşılan parça geometrileri burada değil, clearCache ile serbest bırakılır
      obj.traverse((o) => {
        if (o.geometry && !o.geometry.userData.shared) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    }

    // Parçanın köşe noktaları (tepside zemine oturtmak için sınır kutusu hesabında)
    function partPoints(def) {
      const g = buildPart(def, false);
      g.updateMatrixWorld(true);
      const pts = [];
      const v = new V3();
      g.traverse((o) => {
        if (!o.isMesh) return;
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) pts.push(v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld).clone());
      });
      disposeTree(g);
      return pts;
    }

    function rotatedBounds(points, q) {
      const box = new THREE.Box3();
      const v = new V3();
      for (const p of points) box.expandByPoint(v.copy(p).applyQuaternion(q));
      return box;
    }

    const Y_ORIENTS = [0, 1, 2, 3].map((i) =>
      new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), (i * Math.PI) / 2)
    );

    ctx.geo = { buildPart, disposeTree, clearCache, partPoints, rotatedBounds, Y_ORIENTS };
  };
})();
