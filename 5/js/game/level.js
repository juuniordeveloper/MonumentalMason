/* =========================================================
   ANIT USTASI — Bölüm kurulumu
   Yuvalar (hedef konumlar), yerçekimi kuralı, platform,
   parça tepsisi ve eserin çevresi burada kurulur.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const SUPPORT_MARGIN = 0.06;  // yatay çakışma toleransı
  const SUPPORT_REACH = 0.45;   // taşıyıcının tepesi tabandan en fazla bu kadar yukarı taşabilir
  const TRAY_GAP = 0.7;         // tepsideki parçalar arası boşluk
  const TRAY_ARC = Math.PI * 1.45;

  AU.setupLevel = function (ctx) {
    const { THREE, DEG, state, levelRoot, camera, controls, sun } = ctx;
    const V3 = THREE.Vector3;
    const { buildPart, disposeTree, partPoints, rotatedBounds, Y_ORIENTS } = ctx.geo;

    const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    function shuffle(list) {
      const arr = [...list];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function clearLevel() {
      for (const child of [...levelRoot.children]) {
        levelRoot.remove(child);
        disposeTree(child);
      }
      ctx.geo.clearCache();
      ctx.fx.clear();
    }

    /* ---------- Yuvalar ---------- */
    function slotQuaternion(entry) {
      // ry: çeyrek tur (0-3), ryDeg: derece (ör. sekizgen yapılar için 45°)
      if (entry.ryDeg !== undefined) {
        return new THREE.Quaternion().setFromAxisAngle(new V3(0, 1, 0), entry.ryDeg * DEG);
      }
      return Y_ORIENTS[entry.ry || 0].clone();
    }

    function createSlots(L) {
      return L.structure.map((entry) => {
        const ghost = buildPart(L.parts[entry.part], true);
        const q = slotQuaternion(entry);
        ghost.position.set(entry.pos[0], entry.pos[1], entry.pos[2]);
        ghost.quaternion.copy(q);
        ghost.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(ghost, true); // köşe noktalarına göre kesin hesap
        const slot = { part: entry.part, pos: ghost.position.clone(), q, ghost, box, filled: false, requires: [], after: entry.after || [] };
        ghost.traverse((o) => { if (o.isMesh) o.userData.slot = slot; });
        levelRoot.add(ghost);
        return slot;
      });
    }

    // Bir yuvanın tabanının hemen altına uzanan ve yatayda onunla
    // çakışan yuvalar, onun "taşıyıcısı" sayılır (yerçekimi kuralı).
    function linkSupports(slots) {
      const M = SUPPORT_MARGIN;
      const overlapXZ = (a, b) =>
        a.min.x + M < b.max.x && a.max.x - M > b.min.x && a.min.z + M < b.max.z && a.max.z - M > b.min.z;
      for (const b of slots) {
        if (b.box.min.y < 0.05) continue;
        b.requires = slots.filter((a) =>
          a !== b &&
          a.box.min.y < b.box.min.y - 0.02 &&
          a.box.max.y > b.box.min.y - M &&
          a.box.max.y < b.box.min.y + SUPPORT_REACH &&
          overlapXZ(a.box, b.box));
      }
      // Asma parçalar (köprü tabliyesi, kablo): "after" ile adı verilen parçalara bağlanır
      for (const b of slots) {
        if (!b.after.length) continue;
        const extra = slots.filter((a) => a !== b && b.after.includes(a.part) && !b.requires.includes(a));
        b.requires = [...b.requires, ...extra];
      }
    }

    /* ---------- Platform (zeminle neredeyse aynı hizada) ---------- */
    function createPad(L, extent) {
      let padR = 0;
      for (const x of [extent.min.x, extent.max.x])
        for (const z of [extent.min.z, extent.max.z]) padR = Math.max(padR, Math.hypot(x, z));
      padR += 0.7;
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(padR, padR, 0.08, 64),
        new THREE.MeshStandardMaterial({ color: L.theme.pad, roughness: 0.95 })
      );
      pad.position.y = -0.04;
      pad.receiveShadow = true;
      levelRoot.add(pad);
      // Düz taş bordür (yükselti hissi vermesin diye zeminle aynı hizada)
      const border = new THREE.Mesh(
        new THREE.RingGeometry(padR, padR + 0.28, 64).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(L.theme.pad).multiplyScalar(0.82), roughness: 1 })
      );
      border.position.y = 0.002;
      border.receiveShadow = true;
      levelRoot.add(border);
      return padR;
    }

    /* ---------- Parçalar ve tepsi ---------- */
    function createPieces(L) {
      return shuffle(L.structure).map((entry) => {
        const q = randItem(Y_ORIENTS).clone(); // sadece görsel çeşitlilik
        const obj = buildPart(L.parts[entry.part], false);
        obj.quaternion.copy(q);
        const piece = {
          part: entry.part, points: state.points[entry.part], obj, q,
          placed: false, home: new V3(), pedestal: null, shake: 0, fly: null, dragPos: null, dragQ: null,
        };
        obj.traverse((o) => { if (o.isMesh) o.userData.piece = piece; });
        levelRoot.add(obj);
        return piece;
      });
    }

    // Parçalar platformun önünde yay şeklinde dizilir
    function layoutTray(pieces, padR) {
      const widths = pieces.map((p) => {
        const b = rotatedBounds(p.points, p.q);
        return Math.max(b.max.x - b.min.x, b.max.z - b.min.z, 0.8);
      });
      const total = widths.reduce((a, w) => a + w + TRAY_GAP, 0);
      const R = Math.max(padR + 0.6 + Math.max(...widths) / 2, total / TRAY_ARC);
      let cursor = -total / 2;
      pieces.forEach((p, i) => {
        const mid = cursor + (widths[i] + TRAY_GAP) / 2;
        cursor += widths[i] + TRAY_GAP;
        const x = Math.sin(mid / R) * R;
        const z = Math.cos(mid / R) * R;
        const ped = new THREE.Mesh(
          new THREE.CylinderGeometry(widths[i] / 2 + 0.15, widths[i] / 2 + 0.22, 0.12, 24),
          new THREE.MeshStandardMaterial({ color: '#6e5a40', roughness: 0.9, flatShading: true })
        );
        ped.position.set(x, -0.02, z);
        ped.receiveShadow = true;
        levelRoot.add(ped);
        p.pedestal = ped;
        p.home.set(x, 0.04, z);
        p.obj.position.copy(restPosition(p));
      });
      return R;
    }

    /* ---------- Çevre (js/env/*.js) ---------- */
    function buildEnvironment(L, index, R, padR, pieces) {
      state.envUpdate = null;
      const builder = AU.ENVIRONMENTS && AU.ENVIRONMENTS[L.id];
      if (!builder || !AU.createEnvKit) return;
      try {
        const kit = AU.createEnvKit(THREE, { seed: index + 7, groundY: AU.GROUND_Y });
        const env = builder(kit, { R, padR }) || {};
        levelRoot.add(kit.finish());
        state.envUpdate = kit.update;
        if (env.groundY !== undefined) ctx.ground.position.y = env.groundY;
        if (env.hideGround) ctx.ground.visible = false;
        if (env.pedestalColor) pieces.forEach((p) => p.pedestal.material.color.set(env.pedestalColor));
      } catch (err) {
        // Çevre kurulamazsa oyun yine de oynanabilir kalsın
        console.error('Çevre oluşturulamadı:', L.id, err);
      }
    }

    function frameCamera(R, height) {
      const S = R + 4;
      Object.assign(sun.shadow.camera, { left: -S, right: S, top: S, bottom: -S, near: 1, far: 90 });
      sun.shadow.camera.updateProjectionMatrix();
      sun.position.set(S * 0.6, S * 1.4, S * 0.8);
      sun.userData.base = sun.position.clone();
      controls.target.set(0, Math.max(1, height * 0.35), R * 0.2);
      camera.position.set(0, height * 0.6 + R * 0.95, R * 1.65 + 3);
      state.camBase = camera.position.distanceTo(controls.target);
      fitAspect();
    }

    // Dar/dikey ekranda yatay görüş açısı daraldığı için kamera geri çekilir;
    // böylece eser ve parça tepsisi telefonda da ekrana sığar.
    const WIDE_ASPECT = 1.25;
    const aspectFactor = () => {
      const a = window.innerWidth / window.innerHeight;
      return a >= WIDE_ASPECT ? 1 : Math.min(2.3, Math.pow(WIDE_ASPECT / a, 0.85));
    };
    function fitAspect() {
      if (!state.camBase) return;
      const f = aspectFactor();
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).addScaledVector(dir, state.camBase * f);
      controls.maxDistance = 45 * f;
      controls.update();
    }
    // Yalnızca ekran yönü değişince yeniden sığdır (mobil adres çubuğu her
    // açılıp kapandığında kullanıcının yakınlaştırması bozulmasın)
    let lastPortrait = AU.device.portrait;
    window.addEventListener('resize', () => {
      if (AU.device.portrait === lastPortrait || ctx.cinematic.isActive()) return;
      lastPortrait = AU.device.portrait;
      fitAspect();
    });

    function loadLevel(index, mode) {
      clearTimeout(state.winTimer);
      ctx.cinematic.cancel();
      ctx.input.endDrag();
      clearLevel();

      const L = ctx.LEVELS[index];
      Object.assign(state, {
        index, level: L, points: {}, slots: [], pieces: [], selected: null, hover: null, drag: null,
        errors: 0, hints: 0, elapsed: 0, running: false, done: false,
      });
      controls.autoRotate = false;
      ctx.sceneApi.applyTheme(L.theme);

      for (const name in L.parts) state.points[name] = partPoints(L.parts[name]);
      state.slots = createSlots(L);
      linkSupports(state.slots);

      const extent = new THREE.Box3();
      state.slots.forEach((s) => extent.union(s.box));
      const padR = createPad(L, extent);
      const pieces = createPieces(L);
      const R = layoutTray(pieces, padR);
      buildEnvironment(L, index, R, padR, pieces);

      state.pieces = pieces;
      state.trayRadius = R;
      frameCamera(R, extent.max.y);
      ctx.modes.reset(mode);
      ctx.daynight.set(0);
      ctx.daynight.collectGlow();
      refreshGhosts();
      ctx.ui.updateHud();
      ctx.ui.setHint();
    }

    /* ---------- Ortak yardımcılar ---------- */
    // Parçanın tepsideki dinlenme konumu (alt sınır önbelleğe alınır)
    function restPosition(p, lift) {
      if (p.minY === undefined) p.minY = rotatedBounds(p.points, p.q).min.y;
      return new V3(p.home.x, p.home.y - p.minY + (lift || 0), p.home.z);
    }

    const isReady = (slot) => slot.requires.every((s) => s.filled);

    // Yuvaların saydamlık/renk durumunu güncelle
    // Zor seviyede hangi yuvanın hazır olduğu gösterilmez: sırayı oyuncu bulur
    function refreshGhosts(pulseSlot) {
      const hard = state.level && AU.difficultyOf(state.level) === 'Zor';
      const master = state.mode === 'master';
      for (const s of state.slots) {
        // Usta modunda yuvalar gizlidir (ipucu sırasında kısa süre görünür);
        // gizli yuvalar yine de tıklama ve bırakma için algılanır.
        s.ghost.visible = !s.filled && (!master || s === pulseSlot);
        if (s.filled) continue;
        const ready = hard ? true : isReady(s);
        let color = '#ffffff', fill = ready ? (hard ? 0.09 : 0.14) : 0.05, line = ready ? (hard ? 0.38 : 0.55) : 0.18;
        if (state.selected && s === state.hover) { color = '#ffe08a'; fill = 0.34; line = 0.95; }
        if (s === pulseSlot) { color = '#ffd257'; fill = 0.42; line = 1; }
        s.ghost.traverse((o) => {
          if (o.isMesh) { o.material.color.set(color); o.material.opacity = fill; }
          else if (o.isLineSegments) { o.material.color.set(color); o.material.opacity = line; }
        });
      }
    }

    // Seçili parçayı turuncu parlat; bırakınca (varsa) gece ışığını geri ver
    function setHighlight(piece, on) {
      piece.obj.traverse((o) => {
        if (!o.isMesh) return;
        const m = o.material;
        m.userData.highlighted = on;
        m.emissive.set(on ? '#5a3a08' : (m.userData.glowColor || '#000000'));
        m.emissiveIntensity = on ? 1 : (m.userData.glow ? ctx.daynight.glowLevel() : 1);
      });
    }

    ctx.level = { loadLevel, restPosition, isReady, refreshGhosts, setHighlight };
  };
})();
