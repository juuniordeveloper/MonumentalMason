/* =========================================================
   ANIT USTASI — Sahne: kamera, ışık, zemin, gökyüzü, sis
   ---------------------------------------------------------
   Gökyüzü kubbesi tepede tema renginde, ufukta sis renginde.
   Zemin uzaklaştıkça aynı sis rengine karışır; böylece sahne
   "havada asılı bir ada" gibi değil, ufka uzanan bir arazi
   gibi görünür.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  // Zeminin yüksekliği: platform üst yüzeyi y = 0, zemin hemen altında
  AU.GROUND_Y = -0.02;

  const SKY_RADIUS = 170;
  const FOG_CLEAR_EXTRA = 0.6; // tepsi yarıçapının ne kadarı tamamen net kalsın
  const FOG_DEPTH = 34;        // sisin tamamen kapanmasına kadar olan mesafe
  const ZENITH_TINT = '#4f86c6';

  AU.setupScene = function (ctx, OrbitControls) {
    const { THREE, $ } = ctx;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // Telefonlarda piksel yoğunluğu ve gölge çözünürlüğü düşürülür (akıcılık ve pil için)
    const light = AU.device && AU.device.touch;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    $('scene').appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#cccccc', 30, 80);

    // near çok küçük olursa uzaktaki yüzeylerde derinlik hassasiyeti düşer → titreme
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 400);
    camera.position.set(0, 10, 18);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.minDistance = 4;
    controls.maxDistance = 45;

    const hemi = new THREE.HemisphereLight('#ffffff', '#6b5a44', 1.1);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight('#fff3dc', 2.2);
    sun.position.set(8, 16, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(light ? 1024 : 2048, light ? 1024 : 2048);
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    scene.add(sun);

    const groundMat = new THREE.MeshLambertMaterial({ color: '#8a9a5a' });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(SKY_RADIUS, 64), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = AU.GROUND_Y;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ---------- Gökyüzü kubbesi (köşe renkli, sisten etkilenmez) ---------- */
    const skyGeo = new THREE.SphereGeometry(SKY_RADIUS, 32, 16);
    skyGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(skyGeo.attributes.position.count * 3), 3));
    const sky = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({
      vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false,
    }));
    sky.renderOrder = -1;
    scene.add(sky);

    function paintSky(zenithColor, horizonColor) {
      const pos = skyGeo.attributes.position;
      const col = skyGeo.attributes.color;
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const t = Math.max(0, pos.getY(i) / SKY_RADIUS); // 0 ufuk, 1 tepe
        c.copy(horizonColor).lerp(zenithColor, Math.pow(t, 0.55));
        col.setXYZ(i, c.r, c.g, c.b);
      }
      col.needsUpdate = true;
    }

    // Her bölümde içi boşaltılıp yeniden doldurulan grup
    const levelRoot = new THREE.Group();
    scene.add(levelRoot);

    // Gök renkleri (gece/gündüz sistemi her geçişte çağırır)
    function setSky(zenith, horizon) {
      scene.background = horizon;
      scene.fog.color.copy(horizon);
      paintSky(zenith, horizon);
    }

    function applyTheme(theme) {
      groundMat.color.set(theme.ground);
      ground.position.y = AU.GROUND_Y;
      ground.visible = true;
      setSky(new THREE.Color(theme.sky).lerp(new THREE.Color(ZENITH_TINT), 0.35), new THREE.Color(theme.fog));
    }

    // Sis: eser ve parçalar her zaman net, uzaklar sisin içinde kaybolur.
    // Kamera yakınlaşıp uzaklaştıkça sis mesafesi de birlikte kayar.
    function updateFog(R) {
      const d = camera.position.distanceTo(controls.target);
      scene.fog.near = d + R * FOG_CLEAR_EXTRA;
      scene.fog.far = d + R + FOG_DEPTH;
      sky.position.copy(camera.position);
      sky.position.y = Math.min(camera.position.y, 2); // ufuk çizgisi zemin hizasında kalsın
    }

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize);

    Object.assign(ctx, { renderer, scene, camera, controls, sun, hemi, ground, levelRoot });
    ctx.sceneApi = { applyTheme, updateFog, setSky };
  };
})();
