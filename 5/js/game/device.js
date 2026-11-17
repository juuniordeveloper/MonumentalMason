/* =========================================================
   ANIT USTASI — Cihaz algılama ve dokunsal geri bildirim
   touch : parmakla kullanılan cihaz (telefon / tablet)
   small : dar ekran (telefon)
   haptic: destekleyen cihazlarda kısa titreşim
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const touch = coarse || 'ontouchstart' in window;

  AU.device = {
    touch,
    get small() { return Math.min(window.innerWidth, window.innerHeight) < 600; },
    get portrait() { return window.innerHeight > window.innerWidth; },
  };

  const PATTERNS = { place: 18, error: [30, 40, 30], win: [40, 60, 40, 60, 80], select: 8 };

  AU.haptic = function (kind) {
    if (!touch || !navigator.vibrate) return;
    try { navigator.vibrate(PATTERNS[kind] || 10); } catch (err) { /* titreşim desteklenmiyor */ }
  };

  document.documentElement.classList.toggle('is-touch', touch);
})();
