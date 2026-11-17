/* =========================================================
   ANIT USTASI — Gece / gündüz
   t = 0 gündüz, 0.5 gün batımı, 1 gece.
   Gökyüzü, sis, güneş, ortam ışığı ve "parlayan" malzemeler
   (pencereler, sokak lambaları, mumlar, fener) birlikte değişir.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const ZENITH_TINT = '#4f86c6';
  const SUNSET = { zenith: '#5d6ea6', horizon: '#f0a070', sun: '#ffb070', hemiSky: '#ffd2b0', hemiGround: '#6b4a3a' };
  const NIGHT = { zenith: '#081028', horizon: '#26324e', sun: '#9fb4ff', hemiSky: '#4a5a8a', hemiGround: '#14141c' };
  const STAGES = [
    { sunI: 2.2, hemiI: 1.1, sunLift: 1.4, glow: 0, stars: 0 },
    { sunI: 1.35, hemiI: 0.7, sunLift: 0.35, glow: 0.35, stars: 0.1 },
    { sunI: 0.35, hemiI: 0.28, sunLift: 0.9, glow: 1.6, stars: 1 },
  ];
  const LABELS = ['☀️', '🌅', '🌙'];

  AU.setupDayNight = function (ctx) {
    const { THREE, scene, sun, hemi, $ } = ctx;
    const C = (c) => new THREE.Color(c);
    let t = 0, tween = null, glowMats = [];

    /* ---------- Yıldızlar (gece görünür) ---------- */
    const starGeo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * Math.PI * 2;
      const e = Math.asin(Math.random()) * 0.95 + 0.05; // ufuk üstü
      const r = 160;
      pts.push(Math.cos(e) * Math.sin(a) * r, Math.sin(e) * r, Math.cos(e) * Math.cos(a) * r);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const starMat = new THREE.PointsMaterial({ color: '#ffffff', size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
    const stars = new THREE.Points(starGeo, starMat);
    stars.renderOrder = -1;
    scene.add(stars);

    function lerpStage(key) {
      const a = t <= 0.5 ? STAGES[0] : STAGES[1];
      const b = t <= 0.5 ? STAGES[1] : STAGES[2];
      const k = t <= 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
      return a[key] + (b[key] - a[key]) * k;
    }
    function lerpColor(day, sunset, night) {
      return t <= 0.5 ? C(day).lerp(C(sunset), t / 0.5) : C(sunset).lerp(C(night), (t - 0.5) / 0.5);
    }

    // Bölümdeki "parlayan" malzemeleri topla (yükleme sonrası bir kez)
    function collectGlow() {
      glowMats = [];
      ctx.levelRoot.traverse((o) => {
        const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        for (const m of mats) if (m.userData && m.userData.glow) glowMats.push(m);
      });
      apply();
    }

    function apply() {
      const theme = ctx.state.level ? ctx.state.level.theme : { sky: '#bcd3dd', fog: '#cfdde2' };
      const dayZenith = C(theme.sky).lerp(C(ZENITH_TINT), 0.35);
      const sunsetHorizon = C(theme.fog).lerp(C(SUNSET.horizon), 0.75);
      const horizon = t <= 0.5 ? C(theme.fog).lerp(sunsetHorizon, t / 0.5) : sunsetHorizon.clone().lerp(C(NIGHT.horizon), (t - 0.5) / 0.5);
      const zenith = t <= 0.5 ? dayZenith.clone().lerp(C(SUNSET.zenith), t / 0.5) : C(SUNSET.zenith).lerp(C(NIGHT.zenith), (t - 0.5) / 0.5);
      ctx.sceneApi.setSky(zenith, horizon);

      sun.color.copy(lerpColor('#fff3dc', SUNSET.sun, NIGHT.sun));
      sun.intensity = lerpStage('sunI');
      hemi.intensity = lerpStage('hemiI');
      hemi.color.copy(lerpColor('#ffffff', SUNSET.hemiSky, NIGHT.hemiSky));
      hemi.groundColor.copy(lerpColor('#6b5a44', SUNSET.hemiGround, NIGHT.hemiGround));
      const base = sun.userData.base;
      if (base) sun.position.set(base.x, base.y * lerpStage('sunLift') / 1.4, base.z);

      const g = lerpStage('glow');
      for (const m of glowMats) if (!m.userData.highlighted) m.emissiveIntensity = g;
      starMat.opacity = lerpStage('stars');
      stars.position.copy(ctx.camera.position);
      $('btnTime').textContent = LABELS[t < 0.25 ? 0 : t < 0.75 ? 1 : 2];
    }

    function animateTo(target, seconds) {
      tween = { from: t, to: target, t: 0, dur: seconds || 1.5 };
    }

    function set(value) {
      tween = null;
      t = value;
      apply();
    }

    function update(dt) {
      stars.position.copy(ctx.camera.position);
      if (!tween) return;
      tween.t += dt / tween.dur;
      const k = Math.min(tween.t, 1);
      t = tween.from + (tween.to - tween.from) * (k * k * (3 - 2 * k));
      apply();
      if (k >= 1) tween = null;
    }

    // HUD düğmesi: gündüz → gün batımı → gece → gündüz
    $('btnTime').addEventListener('click', () => {
      const next = t < 0.25 ? 0.5 : t < 0.75 ? 1 : 0;
      animateTo(next, 1.6);
    });

    ctx.daynight = { collectGlow, animateTo, set, update, glowLevel: () => lerpStage('glow'), value: () => t };
  };
})();
