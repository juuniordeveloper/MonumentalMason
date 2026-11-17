/* =========================================================
   ANIT USTASI — Eser küçük resimleri
   Tamamlanmış yapının modelini ayrı, şeffaf zeminli küçük bir
   tuvale çizip resim (dataURL) üretir. Haritadaki pinlerde,
   zaman çizelgesinde ve Usta modunun önizlemesinde kullanılır.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const SIZE = 192;

  AU.setupThumbnails = function (ctx) {
    const { THREE } = ctx;
    const cache = new Map();
    let renderer = null;

    function getRenderer() {
      if (renderer) return renderer;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(1);
      renderer.setSize(SIZE, SIZE);
      renderer.setClearColor(0x000000, 0);
      return renderer;
    }

    function buildStructure(L) {
      const group = new THREE.Group();
      for (const entry of L.structure) {
        const obj = ctx.geo.buildPart(L.parts[entry.part], false);
        obj.position.set(entry.pos[0], entry.pos[1], entry.pos[2]);
        const deg = entry.ryDeg !== undefined ? entry.ryDeg : (entry.ry || 0) * 90;
        obj.rotation.y = (deg * Math.PI) / 180;
        group.add(obj);
      }
      return group;
    }

    // Bir bölümün tamamlanmış halinin resmi (önbellekli)
    function get(L) {
      if (cache.has(L.id)) return cache.get(L.id);
      const r = getRenderer();
      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight('#ffffff', '#6b5a44', 1.3));
      const sun = new THREE.DirectionalLight('#fff3dc', 2.2);
      sun.position.set(6, 12, 9);
      scene.add(sun);
      const group = buildStructure(L);
      scene.add(group);
      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
      camera.position.set(center.x + size * 0.75, center.y + size * 0.55, center.z + size * 1.15);
      camera.lookAt(center);
      r.render(scene, camera);
      const url = r.domElement.toDataURL('image/png');
      ctx.geo.disposeTree(group);
      cache.set(L.id, url);
      return url;
    }

    ctx.thumbs = { get };
  };
})();
