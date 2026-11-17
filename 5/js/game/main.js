/* =========================================================
   ANIT USTASI — Giriş noktası ve ana döngü
   ---------------------------------------------------------
   Tüm dosyalar normal <script> olarak yüklenir ve window.AU
   altında buluşur. Three.js burada dinamik import ile alınır;
   böylece index.html çift tıklanarak da açılabilir.
   ========================================================= */

(async function () {
  const AU = window.AU;
  const $ = (id) => document.getElementById(id);

  let THREE, OrbitControls;
  try {
    THREE = await import('three');
    ({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'));
  } catch (err) {
    console.error('Three.js yüklenemedi:', err);
    $('levelGrid').textContent = 'Three.js yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.';
    return;
  }

  const ctx = {
    THREE,
    $,
    DEG: Math.PI / 180,
    LEVELS: AU.LEVELS,
    state: {
      index: 0, level: null, points: {}, slots: [], pieces: [], selected: null, hover: null, drag: null,
      errors: 0, hints: 0, startTime: 0, elapsed: 0, running: false, done: false,
      particles: [], trayRadius: 8, envUpdate: null, winTimer: null,
      mode: 'normal', score: 0, streak: 0, bestStreak: 0, moves: 0, targets: null, failed: false,
    },
  };

  AU.setupScene(ctx, OrbitControls);
  AU.setupGeometry(ctx);
  AU.setupThumbnails(ctx);
  AU.setupEffects(ctx);
  AU.setupDayNight(ctx);
  AU.setupCollection(ctx);
  AU.setupModes(ctx);
  AU.setupCinematic(ctx);
  AU.setupUI(ctx);
  AU.setupWorldMap(ctx);
  AU.setupMenu(ctx);
  AU.setupAmbient(ctx);
  AU.setupLevel(ctx);
  AU.setupInteraction(ctx);

  const { state, camera, controls, renderer, scene } = ctx;
  const SPEED = 14;
  const DRAG_SPEED = 22;
  const ARC_HEIGHT = 1.6;

  /* ---------- Parça animasyonları ---------- */
  function animateFlight(p, dt, k) {
    // Yuvaya doğru kavisli uçuş + hedef yöne dönüş
    const f = p.fly;
    f.t += dt / f.dur;
    const e = Math.min(f.t, 1);
    const ease = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2;
    p.obj.position.lerpVectors(f.from, f.to, ease);
    p.obj.position.y += Math.sin(e * Math.PI) * ARC_HEIGHT;
    p.obj.quaternion.slerp(p.q, Math.max(k, ease));
    if (f.t < 1) return;
    p.obj.position.copy(f.to);
    p.obj.quaternion.copy(p.q);
    p.fly = null;
    AU.sfx.place();
    AU.haptic('place');
    ctx.fx.burst(f.to.clone().setY(f.slot.box.min.y + 0.05), '#d9c7a3', 26, 2.2, 0.7, 0.4);
    ctx.ui.checkWin();
  }

  function animateTrayPiece(p, dt, t, k) {
    if (p.dragPos) {
      // Sürükleniyor: imleci hızlıca takip et
      const kd = 1 - Math.exp(-dt * DRAG_SPEED);
      p.obj.position.lerp(p.dragPos, kd);
      p.obj.quaternion.slerp(p.dragQ || p.q, kd);
      return;
    }
    const sel = p === state.selected;
    const target = ctx.level.restPosition(p, sel ? 0.45 + Math.sin(t * 3) * 0.06 : 0);
    if (p.shake > 0) {
      p.shake -= dt;
      target.x += Math.sin(p.shake * 60) * 0.12 * (p.shake / 0.45);
    }
    p.obj.position.lerp(target, k);
    p.obj.quaternion.slerp(p.q, k);
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const k = 1 - Math.exp(-dt * SPEED);

    ctx.ui.updateTimer();
    for (const p of state.pieces) {
      if (p.fly) animateFlight(p, dt, k);
      else if (!p.placed) animateTrayPiece(p, dt, t, k);
    }
    ctx.fx.update(dt);
    ctx.daynight.update(dt);
    if (state.envUpdate) state.envUpdate(dt, t);
    // Sinematik sırasında kamerayı sinematik yönetir
    if (!ctx.cinematic.update(dt)) controls.update();
    ctx.sceneApi.updateFog(state.trayRadius);
    renderer.render(scene, camera);
  }

  // Başlangıç: menüyü göster, arkada ilk bölüm dönsün
  ctx.level.loadLevel(0, 'normal');
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  ctx.menu.render();
  animate();

  // Test/hata ayıklama için konsoldan erişim
  window.__game = { state, ctx, loadLevel: ctx.level.loadLevel, tryPlace: ctx.input.tryPlace };
})();
