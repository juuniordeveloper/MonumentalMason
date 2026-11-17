/* =========================================================
   ANIT USTASI — Arayüz: HUD, tanıtım kartı, kazanma ekranı
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const TOAST_MS = 2200;
  const MODE_LABEL = { normal: '', master: 'USTA MODU', challenge: 'MEYDAN OKUMA' };

  AU.setupUI = function (ctx) {
    const { state, $ } = ctx;
    const LEVELS = ctx.LEVELS;

    const show = (id, on) => $(id).classList.toggle('hidden', !on);
    const starHtml = (n) => [0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('');

    function fmtTime(sec) {
      const s = Math.floor(sec);
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function updateHud() {
      const L = state.level;
      if (!L) return;
      $('levelName').textContent = L.name;
      $('levelMeta').textContent = [L.place, L.era, MODE_LABEL[state.mode]].filter(Boolean).join(' · ');
      $('statPieces').textContent = state.slots.filter((s) => s.filled).length + '/' + state.slots.length;
      if (ctx.modes) ctx.modes.updateHud();
    }

    function updateTimer() {
      if (!state.running) return;
      state.elapsed = (performance.now() - state.startTime) / 1000;
      $('statTime').textContent = ctx.modes.timeText() || fmtTime(state.elapsed);
      ctx.modes.tick();
    }

    function setHint(text) {
      const el = $('hintText');
      if (text) el.textContent = text;
      else if (state.done) el.textContent = state.failed ? 'Tekrar dene!' : 'Tebrikler! Yapı tamamlandı.';
      else if (state.drag && state.drag.active) el.textContent = 'Parçayı yuvasının üstüne bırak';
      else if (!state.selected) el.textContent = state.mode === 'master'
        ? 'Usta modu: yuvalar gizli — köşedeki resme bakarak yerleri bul'
        : (AU.device.touch ? 'Bir parçaya dokun ya da sürükleyip yuvasına bırak' : 'Bir parçaya tıkla ya da sürükleyip yuvasına bırak');
      else el.textContent = AU.device.touch ? 'Şimdi parçanın yuvasına dokun' : 'Şimdi parçanın yuvasına tıkla';
    }

    let toastTimer = null;
    function toast(msg, kind) {
      const t = $('toast');
      t.textContent = msg;
      t.className = 'show ' + (kind || '');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => (t.className = ''), TOAST_MS);
    }

    const starsFor = (errors, hints) => {
      const pen = errors + hints * 0.5;
      return pen <= 1 ? 3 : pen <= 4 ? 2 : 1;
    };

    function fillFacts(ul, facts) {
      ul.innerHTML = '';
      for (const f of facts) {
        const li = document.createElement('li');
        li.textContent = f;
        ul.appendChild(li);
      }
    }

    function showIntro(resumeMode) {
      const L = state.level;
      const diff = AU.difficultyOf(L);
      $('introEra').textContent = [L.era, diff.toUpperCase() + ' SEVİYE', MODE_LABEL[state.mode]].filter(Boolean).join(' · ');
      $('introEra').className = 'card-era era-' + diff.toLowerCase();
      $('introName').textContent = L.name;
      $('introPlace').textContent = L.place;
      let text = L.intro;
      if (state.mode === 'challenge') {
        const t = state.targets;
        text = `Meydan okuma: ${ctx.modes.fmt(t.time)} içinde ve en fazla ${t.moves} hamlede bitir! ` + text;
      } else if (state.mode === 'master') {
        text = 'Usta modu: yuvalar görünmez. Köşedeki resme bakarak her parçanın yerini kendin bul. ' + text;
      }
      $('introText').textContent = text;
      fillFacts($('introFacts'), L.facts);
      $('btnStart').textContent = resumeMode ? 'Devam' : 'Başla';
      state.running = false;
      show('intro', true);
    }

    function openLevel(i, mode) {
      ctx.level.loadLevel(i, mode || state.mode || 'normal');
      show('menu', false);
      show('win', false);
      show('fail', false);
      show('hud', true);
      show('controls', true);
      showIntro(false);
    }

    const restart = () => openLevel(state.index, state.mode);

    function resume() {
      if (state.done) return;
      state.running = true;
      state.startTime = performance.now() - state.elapsed * 1000;
      ctx.ambient.start(state.level);
    }

    function openMenu() {
      state.running = false;
      ctx.ambient.stop();
      ctx.menu.render();
      show('menu', true);
    }

    function showWin(result) {
      const L = state.level;
      const stars = state.mode === 'challenge' ? result.stars : starsFor(state.errors, state.hints);
      $('winStars').innerHTML = starHtml(stars);
      $('winTitle').textContent = L.name + ' tamamlandı!';
      const lines = [`Süre ${fmtTime(state.elapsed)}`, `${state.errors} hata`, `${state.hints} ipucu`];
      $('winStats').textContent = lines.join(' · ');
      $('winScore').innerHTML = `Puan <b>${state.score}</b> · En uzun seri <b>${state.bestStreak}</b> · Rekor <b>${result.bestScore}</b>`
        + (state.mode === 'challenge' ? `<br>Meydan okuma: ${ctx.modes.fmt(result.timeLeft)} süre ve ${state.targets.moves - state.moves} hamle arttı` : '');
      const c = ctx.collection.countFor(L);
      $('winCards').textContent = `Bilgi kartları: ${c.have} / ${c.total}`;
      fillFacts($('winFacts'), L.facts);
      const last = state.index === LEVELS.length - 1;
      $('btnNext').textContent = last ? 'Tüm yapılar bitti — Menü' : 'Sonraki Yapı →';
      show('win', true);
    }

    function checkWin() {
      if (state.done || !state.slots.every((s) => s.filled)) return;
      if (state.pieces.some((p) => p.fly)) return;
      state.done = true;
      state.running = false;
      ctx.input.select(null, true);
      AU.sfx.win();
      AU.haptic('win');
      ctx.fx.celebrate();
      setHint();

      const L = state.level;
      const result = ctx.modes.finishResult();
      if (state.mode !== 'challenge') {
        const progress = AU.progress.load();
        AU.progress.save({ ...progress, [L.id]: Math.max(progress[L.id] || 0, starsFor(state.errors, state.hints)) });
      } else {
        // Meydan okumayı bitirmek bölümü de tamamlanmış sayar
        const progress = AU.progress.load();
        AU.progress.save({ ...progress, [L.id]: Math.max(progress[L.id] || 0, 1) });
      }
      setTimeout(() => ctx.cinematic.start(L, () => showWin(result)), 900);
    }

    $('btnStart').addEventListener('click', () => { show('intro', false); resume(); });
    $('btnInfo').addEventListener('click', () => showIntro(true));
    $('btnMenu').addEventListener('click', openMenu);
    $('btnReplay').addEventListener('click', restart);
    $('btnNext').addEventListener('click', () => {
      const next = state.index + 1;
      if (next < LEVELS.length) { openLevel(next, state.mode); return; }
      show('win', false);
      openMenu();
    });
    $('btnWinMenu').addEventListener('click', () => { show('win', false); openMenu(); });
    // Menü açıkken boşluğa tıklayınca oyuna geri dön
    $('menu').addEventListener('click', (ev) => {
      if (ev.target !== $('menu') || !state.level || $('hud').classList.contains('hidden')) return;
      show('menu', false);
      resume();
    });

    ctx.ui = { updateHud, updateTimer, setHint, toast, openLevel, restart, checkWin, openMenu };
  };
})();
