/* =========================================================
   ANIT USTASI — Bitiş sinematiği
   Eser tamamlanınca: sinema şeritleri, eserin çevresinde yavaş
   bir kamera turu, altyazı gibi akan tarihçe ve gün batımından
   geceye geçiş. "Geç" düğmesiyle atlanabilir.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const LINE_SECONDS = 3.6;   // her altyazı satırının ekranda kalma süresi
  const TITLE_SECONDS = 2.4;  // açılış başlığı
  const ORBIT_TURNS = 0.85;   // kamera turunun tam tura oranı

  AU.setupCinematic = function (ctx) {
    const { camera, controls, $ } = ctx;
    let active = null;

    const show = (id, on) => $(id).classList.toggle('hidden', !on);

    function setSubtitle(text, isTitle) {
      const el = $('cinemaText');
      el.classList.remove('in');
      void el.offsetWidth; // animasyonu yeniden başlat
      el.textContent = text;
      el.classList.toggle('title', !!isTitle);
      el.classList.add('in');
    }

    function start(level, onDone) {
      const target = controls.target.clone();
      const offset = camera.position.clone().sub(target);
      const lines = [{ text: level.name + ' — ' + level.place, title: true, dur: TITLE_SECONDS }]
        .concat(level.facts.map((f) => ({ text: f, dur: LINE_SECONDS })));
      const total = lines.reduce((s, l) => s + l.dur, 0);
      active = {
        level, onDone, target, total, lines, t: 0, lineIndex: -1,
        radius: Math.hypot(offset.x, offset.z) * 0.82,
        height: offset.y * 0.75,
        angle0: Math.atan2(offset.x, offset.z),
        lookY: target.y + 0.6,
      };
      controls.enabled = false;
      controls.autoRotate = false;
      show('hud', false);
      show('controls', false);
      show('cinema', true);
      requestAnimationFrame(() => $('cinema').classList.add('on'));
      ctx.daynight.animateTo(0.5, 3.5); // gün batımı
    }

    function update(dt) {
      if (!active) return false;
      const a = active;
      a.t += dt;
      const u = Math.min(a.t / a.total, 1);
      const ease = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      const ang = a.angle0 + ease * Math.PI * 2 * ORBIT_TURNS;
      const h = a.height * (1 - 0.35 * Math.sin(u * Math.PI));
      camera.position.set(a.target.x + Math.sin(ang) * a.radius, a.target.y + h, a.target.z + Math.cos(ang) * a.radius);
      camera.lookAt(a.target.x, a.lookY, a.target.z);

      // Altyazılar
      let acc = 0, idx = 0;
      for (; idx < a.lines.length; idx++) { acc += a.lines[idx].dur; if (a.t < acc) break; }
      if (idx !== a.lineIndex && idx < a.lines.length) {
        a.lineIndex = idx;
        setSubtitle(a.lines[idx].text, a.lines[idx].title);
        if (idx === Math.max(1, a.lines.length - 2)) ctx.daynight.animateTo(1, 4); // sona doğru gece
      }
      if (a.t >= a.total) finish();
      return true;
    }

    function finish() {
      if (!active) return;
      const { onDone } = active;
      active = null;
      $('cinema').classList.remove('on');
      setTimeout(() => show('cinema', false), 400);
      show('hud', true);
      show('controls', true);
      controls.enabled = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      if (onDone) onDone();
    }

    $('btnSkip').addEventListener('click', () => {
      ctx.daynight.animateTo(1, 1);
      finish();
    });

    // Sinematik sürerken bölüm değişirse sessizce kapat
    function cancel() {
      if (!active) return;
      active = null;
      $('cinema').classList.remove('on');
      show('cinema', false);
      controls.enabled = true;
    }

    ctx.cinematic = { start, update, finish, cancel, isActive: () => !!active };
  };
})();
