/* =========================================================
   ANIT USTASI — Oyun modları ve puan
   normal   : klasik oyun
   master   : USTA — yuvalar görünmez, köşede eserin resmi durur
   challenge: MEYDAN OKUMA — süre ve hamle sınırı
   Tüm modlarda: arka arkaya doğru yerleştirme = seri çarpanı
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const BASE_POINTS = 100;
  const MAX_MULT_STEPS = 4;   // en fazla ×3
  const COMBO_FROM = 3;       // kaçıncı doğru hamleden itibaren kutlama
  const WARN_SECONDS = 10;

  // Meydan okuma hedefleri: parça sayısı ve zorluğa göre
  AU.challengeTargets = function (L) {
    const n = L.structure.length;
    const diff = AU.difficultyOf(L);
    const perPiece = diff === 'Zor' ? 9 : diff === 'Orta' ? 7 : 6;
    return {
      time: Math.round((n * perPiece + 20) / 5) * 5,
      moves: n + (diff === 'Zor' ? 4 : 3),
    };
  };

  AU.setupModes = function (ctx) {
    const { state, $ } = ctx;
    let lastWarn = -1;

    const multiplier = () => 1 + Math.min(Math.max(state.streak - 1, 0), MAX_MULT_STEPS) * 0.5;

    function reset(mode) {
      Object.assign(state, { mode: mode || 'normal', score: 0, streak: 0, bestStreak: 0, moves: 0, failed: false });
      state.targets = state.mode === 'challenge' ? AU.challengeTargets(state.level) : null;
      lastWarn = -1;
      document.body.dataset.mode = state.mode;
      const preview = $('preview');
      if (state.mode === 'master') {
        $('previewImg').src = ctx.thumbs.get(state.level);
        preview.classList.remove('hidden');
      } else {
        preview.classList.add('hidden');
      }
      updateHud();
    }

    function popup(text, cls) {
      const el = document.createElement('div');
      el.className = 'float-text ' + (cls || '');
      el.textContent = text;
      $('floatLayer').appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }

    function onPlace() {
      state.moves++;
      state.streak++;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const mult = multiplier();
      const gain = Math.round(BASE_POINTS * mult);
      state.score += gain;
      popup('+' + gain, mult > 1 ? 'combo' : '');
      if (state.streak >= COMBO_FROM) {
        popup(`🔥 ${state.streak}'li seri! ×${mult.toFixed(1)}`, 'streak');
        AU.sfx.combo(Math.min(state.streak, 10));
      }
      updateHud();
    }

    function onFail() {
      state.moves++;
      if (state.streak >= COMBO_FROM) popup('Seri bozuldu', 'broken');
      state.streak = 0;
      updateHud();
      if (state.mode === 'challenge' && state.moves >= state.targets.moves) fail('Hamle hakkın bitti!');
    }

    // Meydan okumada süreyi denetler (her karede)
    function tick() {
      if (state.mode !== 'challenge' || !state.running || state.done) return;
      const left = state.targets.time - state.elapsed;
      if (left <= WARN_SECONDS && Math.ceil(left) !== lastWarn) {
        lastWarn = Math.ceil(left);
        AU.sfx.tick();
        $('statTime').parentElement.classList.add('warn');
      }
      if (left <= 0) fail('Süre doldu!');
    }

    function fail(reason) {
      if (state.done) return;
      state.done = true;
      state.running = false;
      state.failed = true;
      ctx.input.select(null, true);
      AU.sfx.fail();
      $('failReason').textContent = reason;
      $('failStats').textContent = `${state.slots.filter((s) => s.filled).length} / ${state.slots.length} parça yerleştirildi · Puan ${state.score}`;
      $('fail').classList.remove('hidden');
    }

    // Bölüm bitince sonucu hesapla ve kaydet
    function finishResult() {
      const L = state.level;
      const scores = AU.scoreStore.load();
      const bestScore = Math.max(scores[L.id] || 0, state.score);
      AU.scoreStore.save({ ...scores, [L.id]: bestScore });
      if (state.mode !== 'challenge') return { bestScore };
      const t = state.targets;
      const timeLeft = Math.max(0, t.time - state.elapsed);
      const stars = 1 + (timeLeft / t.time >= 0.35 ? 1 : 0) + (state.moves <= state.slots.length + 1 ? 1 : 0);
      const all = AU.challengeStore.load();
      const prev = all[L.id];
      if (!prev || stars > prev.stars || (stars === prev.stars && state.elapsed < prev.time)) {
        AU.challengeStore.save({ ...all, [L.id]: { stars, time: Math.round(state.elapsed), moves: state.moves } });
      }
      return { bestScore, stars, timeLeft };
    }

    function fmt(sec) {
      const s = Math.max(0, Math.ceil(sec));
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }

    function updateHud() {
      $('statScore').textContent = state.score;
      const st = $('statStreak');
      st.textContent = state.streak >= 2 ? '🔥' + state.streak : '';
      if (state.mode === 'challenge' && state.targets) {
        $('statErrorsLabel').textContent = 'Hamle';
        $('statErrors').textContent = state.moves + '/' + state.targets.moves;
        $('statTimeLabel').textContent = 'Kalan';
      } else {
        $('statErrorsLabel').textContent = 'Hata';
        $('statErrors').textContent = state.errors;
        $('statTimeLabel').textContent = 'Süre';
        $('statTime').parentElement.classList.remove('warn');
      }
    }

    function timeText() {
      if (state.mode === 'challenge' && state.targets) return fmt(state.targets.time - state.elapsed);
      return null;
    }

    $('btnFailRetry').addEventListener('click', () => {
      $('fail').classList.add('hidden');
      ctx.ui.restart();
    });
    $('btnFailMenu').addEventListener('click', () => {
      $('fail').classList.add('hidden');
      ctx.ui.openMenu();
    });

    ctx.modes = { reset, onPlace, onFail, tick, finishResult, updateHud, timeText, fmt };
  };
})();
