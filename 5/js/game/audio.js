/* =========================================================
   ANIT USTASI — Ses efektleri (WebAudio ile, dosya gerektirmez)
   AU.getAudio(): ortam sesleriyle paylaşılan tek ses bağlamı
   AU.sound.enabled: ses açık/kapalı (ayarlarda saklanır)
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  let audio = null;

  AU.sound = { enabled: true };

  AU.getAudio = function () {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      return audio;
    } catch (err) {
      return null; // tarayıcı ses desteklemiyor
    }
  };

  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!AU.sound.enabled) return;
    const ac = AU.getAudio();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(ac.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  AU.sfx = {
    select: () => tone(520, 0.08, 'triangle', 0.12),
    grab: () => tone(380, 0.08, 'triangle', 0.1, 520),
    place: () => { tone(140, 0.25, 'sine', 0.3, 60); tone(660, 0.12, 'triangle', 0.08, null, 0.05); },
    error: () => tone(200, 0.15, 'sawtooth', 0.07, 120),
    win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.35, 'triangle', 0.14, null, i * 0.13)),
    // Seri arttıkça yükselen "kombo" sesi
    combo: (n) => { tone(500 + n * 70, 0.12, 'triangle', 0.1, 800 + n * 90); tone(1000 + n * 90, 0.1, 'sine', 0.05, null, 0.08); },
    card: () => { tone(880, 0.09, 'sine', 0.08); tone(1320, 0.14, 'sine', 0.06, null, 0.07); },
    fail: () => [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'triangle', 0.12, null, i * 0.16)),
    tick: () => tone(1200, 0.04, 'square', 0.03),
  };
})();
