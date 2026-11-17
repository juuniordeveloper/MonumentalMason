/* =========================================================
   ANIT USTASI — Etkileşim
   - TIKLA: parçaya tıkla, sonra yuvasına tıkla
   - SÜRÜKLE: parçayı tutup yuvasının üstüne bırak
   Doğru yuvaya gelen parça kendiliğinden döner ve oturur.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const CLICK_TOLERANCE = 6; // px: bundan az hareket "tıklama" sayılır
  const DRAG_HEIGHT = 0.6;
  const HOVER_LIFT = 0.5;
  const PULSE_MS = 1600;
  const TOUCH_RADIUS = 44; // px: parmağın bu kadar yakınındaki parça yakalanır
  const TOUCH_LIFT = 0.9;  // sürüklenen parça parmağın altında kaybolmasın

  AU.setupInteraction = function (ctx) {
    const { THREE, state, camera, controls, renderer, $ } = ctx;
    const V3 = THREE.Vector3;
    const sfx = AU.sfx;
    const canvas = renderer.domElement;

    /* ---------- Seçim ve yerleştirme ---------- */
    function select(piece, silent) {
      if (state.selected) ctx.level.setHighlight(state.selected, false);
      state.selected = piece;
      if (piece) {
        ctx.level.setHighlight(piece, true);
        if (!silent) { sfx.select(); AU.haptic('select'); }
      }
      state.hover = null;
      ctx.level.refreshGhosts();
      ctx.ui.setHint();
    }

    function fail(piece, msg) {
      state.errors++;
      ctx.modes.onFail();
      piece.shake = 0.45;
      sfx.error();
      AU.haptic('error');
      ctx.ui.toast(msg, 'bad');
      ctx.ui.updateHud();
    }

    function tryPlace(piece, slot) {
      if (!slot || state.done) return false;
      if (piece.part !== slot.part) {
        fail(piece, 'Bu parça bu yuvaya ait değil.');
        return false;
      }
      if (!ctx.level.isReady(slot)) {
        fail(piece, 'Önce altındaki parçaları yerleştir — havada taş durmaz!');
        return false;
      }
      // Başarılı yerleşim: parça kendiliğinden doğru yöne döner
      Object.assign(piece, { placed: true, q: slot.q.clone(), dragPos: null, dragQ: null });
      slot.filled = true;
      ctx.level.setHighlight(piece, false);
      state.selected = null;
      state.hover = null;
      piece.pedestal.visible = false;
      piece.fly = { from: piece.obj.position.clone(), to: slot.pos.clone(), t: 0, dur: 0.6, slot };
      ctx.modes.onPlace();
      ctx.collection.unlock(state.level, piece.part);
      ctx.level.refreshGhosts();
      ctx.ui.updateHud();
      ctx.ui.setHint();
      return true;
    }

    function useHint() {
      if (state.done || !state.running) return;
      state.hints++;
      const readySlots = state.slots.filter((s) => !s.filled && ctx.level.isReady(s));
      const p = state.selected;
      if (!p) {
        // Şu an yerleştirilebilecek bir parçayı göster
        const parts = new Set(readySlots.map((s) => s.part));
        const cand = state.pieces.find((x) => !x.placed && parts.has(x.part));
        if (cand) {
          select(cand);
          ctx.ui.toast('Bu parça şu an yerleştirilebilir.', 'ok');
        }
        return;
      }
      const match = readySlots.find((s) => s.part === p.part);
      if (!match) {
        ctx.ui.toast('Bu parçanın sırası henüz gelmedi. Önce alt katları bitir.');
        return;
      }
      ctx.level.refreshGhosts(match);
      setTimeout(() => ctx.level.refreshGhosts(), PULSE_MS);
      ctx.ui.toast('Parlayan yuva bu parçanın yeri!', 'ok');
    }

    /* ---------- Işın (raycast) ---------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new V3(0, 1, 0), -DRAG_HEIGHT);
    let downPos = null;

    function setRay(ev) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
    }

    // includePieces=false → sadece yuvalar (sürüklerken kullanılır)
    function pick(ev, includePieces) {
      setRay(ev);
      const targets = [];
      if (includePieces) {
        for (const p of state.pieces) if (!p.placed) p.obj.traverse((o) => o.isMesh && targets.push(o));
      }
      for (const s of state.slots) if (!s.filled) s.ghost.traverse((o) => o.isMesh && targets.push(o));
      return raycaster.intersectObjects(targets, false);
    }

    const isTouch = (ev) => ev.pointerType === 'touch' || ev.pointerType === 'pen';

    // Dokunmatikte parmak ucu küçük parçaları ıskalayabilir: ekranda en yakın parçayı bul
    function nearPiece(ev) {
      const rect = canvas.getBoundingClientRect();
      const v = new V3();
      let best = null, bestD = TOUCH_RADIUS;
      for (const p of state.pieces) {
        if (p.placed || p.fly) continue;
        v.copy(p.obj.position).project(camera);
        const sx = rect.left + ((v.x + 1) / 2) * rect.width;
        const sy = rect.top + ((1 - v.y) / 2) * rect.height;
        const d = Math.hypot(sx - ev.clientX, sy - ev.clientY);
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    }

    // Aynı ışın birden fazla yuvaya değiyorsa uygun olanı tercih et
    function chooseSlot(hits) {
      const slotHits = hits.filter((h) => h.object.userData.slot).map((h) => h.object.userData.slot);
      const sel = state.selected;
      if (sel) {
        const best = slotHits.find((s) => s.part === sel.part && ctx.level.isReady(s));
        if (best) return best;
        const same = slotHits.find((s) => s.part === sel.part);
        if (same) return same;
      }
      return slotHits[0] || null;
    }

    function setHover(slot) {
      if (slot === state.hover) return;
      state.hover = slot;
      ctx.level.refreshGhosts();
    }

    function endDrag() {
      if (state.drag && state.drag.piece) {
        state.drag.piece.dragPos = null;
        state.drag.piece.dragQ = null;
      }
      state.drag = null;
      controls.enabled = true;
      canvas.style.cursor = '';
    }

    /* ---------- Sürükleme ---------- */
    function startDrag(ev) {
      const first = pick(ev, true)[0];
      let piece = first && first.object.userData.piece;
      if (!piece && isTouch(ev) && !(first && first.object.userData.slot && state.selected)) piece = nearPiece(ev);
      if (!piece) return;
      state.drag = { piece, x: ev.clientX, y: ev.clientY, active: false };
      controls.enabled = false; // parça tutulduysa kamera dönmesin
      try { canvas.setPointerCapture(ev.pointerId); } catch (err) { /* bazı tarayıcılarda desteklenmez */ }
    }

    function moveDrag(ev) {
      const d = state.drag;
      if (!d.active && Math.hypot(ev.clientX - d.x, ev.clientY - d.y) > CLICK_TOLERANCE) {
        d.active = true;
        select(d.piece, true);
        sfx.grab();
        ctx.ui.setHint();
      }
      if (!d.active) return;
      canvas.style.cursor = 'grabbing';
      const slot = chooseSlot(pick(ev, false));
      setHover(slot);
      const p = d.piece;
      if (slot && state.mode !== 'master') {
        // Yuvanın üstünde: parça hedef yönüne döner ve yuvanın üzerinde süzülür
        // (Usta modunda yer ele verilmez)
        p.dragPos = slot.pos.clone().add(new V3(0, HOVER_LIFT, 0));
        p.dragQ = slot.q;
        return;
      }
      const hit = new V3();
      if (raycaster.ray.intersectPlane(dragPlane, hit)) {
        hit.y = DRAG_HEIGHT - ctx.geo.rotatedBounds(p.points, p.q).min.y + (isTouch(ev) ? TOUCH_LIFT : 0);
        p.dragPos = hit;
      }
      p.dragQ = null;
    }

    function hoverWhileSelected(ev) {
      const hits = pick(ev, true);
      const first = hits[0] && hits[0].object.userData;
      if (!state.selected) {
        canvas.style.cursor = first && first.piece ? 'grab' : '';
        return;
      }
      const s = first && first.slot ? chooseSlot(hits) : null;
      setHover(s);
      canvas.style.cursor = s || (first && first.piece) ? 'pointer' : '';
    }

    function finishDrag() {
      const slot = state.hover;
      const piece = state.drag.piece;
      endDrag();
      if (!slot || !tryPlace(piece, slot)) select(null); // boşluğa bırakıldı → yerine döner
      ctx.ui.setHint();
    }

    function handleClick(ev) {
      const hits = pick(ev, true);
      const top = hits[0] && hits[0].object.userData;
      if (isTouch(ev) && !(top && top.piece) && !(top && top.slot && state.selected)) {
        const np = nearPiece(ev);
        if (np) { select(np === state.selected ? null : np); return; }
      }
      if (!hits.length) { select(null); return; }
      const first = hits[0].object.userData;
      if (first.piece) {
        select(first.piece === state.selected ? null : first.piece);
        return;
      }
      if (!state.selected) { ctx.ui.toast('Önce kenardan bir parça seç.'); return; }
      tryPlace(state.selected, chooseSlot(hits));
    }

    // capture: true → OrbitControls'ten ÖNCE çalışır
    canvas.addEventListener('pointerdown', (ev) => {
      downPos = { x: ev.clientX, y: ev.clientY };
      if (!state.running || state.done || ev.button !== 0) return;
      startDrag(ev);
    }, { capture: true });

    canvas.addEventListener('pointermove', (ev) => {
      if (!state.running || state.done) return;
      if (state.drag) moveDrag(ev);
      else hoverWhileSelected(ev);
    });

    canvas.addEventListener('pointerup', (ev) => {
      const moved = downPos ? Math.hypot(ev.clientX - downPos.x, ev.clientY - downPos.y) : 99;
      downPos = null;
      if (state.drag && state.drag.active) { finishDrag(); return; }
      endDrag();
      if (moved > CLICK_TOLERANCE || !state.running || state.done || ev.button !== 0) return;
      handleClick(ev);
    });
    canvas.addEventListener('pointercancel', () => { endDrag(); select(null); });
    // Uzun basışta tarayıcı menüsü açılmasın
    canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());

    window.addEventListener('keydown', (ev) => {
      if (!state.running || ev.repeat) return;
      const k = ev.key.toLowerCase();
      if (k === 'h') useHint();
      else if (k === 'r') ctx.ui.restart();
      else if (k === 'escape') select(null);
    });

    $('btnHint').addEventListener('click', useHint);
    $('btnReset').addEventListener('click', () => ctx.ui.restart());

    ctx.input = { select, tryPlace, endDrag };
  };
})();
