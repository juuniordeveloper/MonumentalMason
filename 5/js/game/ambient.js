/* =========================================================
   ANIT USTASI — Ortam sesleri (WebAudio ile üretilir)
   sea   : dalga sesi + martı çığlıkları
   wind  : rüzgâr uğultusu
   birds : hafif rüzgâr + kuş cıvıltıları
   city  : uzak trafik uğultusu + ara sıra korna/çan
   jungle: böcek vızıltısı + orman kuşları
   river : akan su + kuşlar
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  AU.setupAmbient = function (ctx) {
    const { $ } = ctx;
    let nodes = [], timers = [], master = null, noiseBuf = null;

    function noise(ac) {
      if (noiseBuf) return noiseBuf;
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return noiseBuf;
    }

    // Sürekli filtrelenmiş gürültü katmanı (dalga, rüzgâr, uğultu)
    function bed(ac, type, freq, q, vol, lfoRate, lfoDepth) {
      const src = ac.createBufferSource();
      src.buffer = noise(ac);
      src.loop = true;
      const f = ac.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ac.createGain();
      g.gain.value = vol;
      src.connect(f).connect(g).connect(master);
      if (lfoRate) {
        const lfo = ac.createOscillator();
        const lg = ac.createGain();
        lfo.frequency.value = lfoRate;
        lg.gain.value = lfoDepth;
        lfo.connect(lg).connect(g.gain);
        lfo.start();
        nodes.push(lfo);
      }
      src.start();
      nodes.push(src);
    }

    function chirp(ac, f1, f2, dur, vol, type, delay) {
      const t0 = ac.currentTime + (delay || 0);
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f1, t0);
      o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g).connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.05);
    }

    // Rastgele aralıklarla tekrar eden ses olayı
    function every(minS, maxS, fn) {
      const loop = () => {
        fn();
        timers.push(setTimeout(loop, (minS + Math.random() * (maxS - minS)) * 1000));
      };
      timers.push(setTimeout(loop, Math.random() * maxS * 500));
    }

    const birdsong = (ac) => every(1.2, 3.5, () => {
      const base = 2200 + Math.random() * 1600;
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) chirp(ac, base, base * 1.3, 0.09, 0.03, 'sine', i * 0.12);
    });
    const gulls = (ac) => every(4, 9, () => {
      chirp(ac, 1500, 900, 0.35, 0.035, 'triangle');
      chirp(ac, 1400, 850, 0.3, 0.03, 'triangle', 0.4);
    });

    const PROFILES = {
      sea: (ac) => { bed(ac, 'lowpass', 520, 0.6, 0.09, 0.13, 0.05); gulls(ac); },
      wind: (ac) => { bed(ac, 'bandpass', 380, 0.7, 0.07, 0.07, 0.04); },
      birds: (ac) => { bed(ac, 'bandpass', 450, 0.6, 0.025, 0.08, 0.015); birdsong(ac); },
      city: (ac) => {
        bed(ac, 'lowpass', 260, 0.7, 0.06, 0.05, 0.015);
        every(9, 18, () => chirp(ac, 420, 400, 0.35, 0.02, 'square'));
        birdsong(ac);
      },
      jungle: (ac) => {
        bed(ac, 'highpass', 5200, 0.8, 0.012, 14, 0.008);
        every(0.8, 2.6, () => chirp(ac, 900 + Math.random() * 700, 1800 + Math.random() * 600, 0.18, 0.03, 'sine'));
      },
      river: (ac) => { bed(ac, 'bandpass', 950, 0.5, 0.05, 0.3, 0.015); birdsong(ac); },
    };

    function stop() {
      for (const t of timers) clearTimeout(t);
      timers = [];
      for (const n of nodes) { try { n.stop(); } catch (err) { /* zaten durmuş */ } }
      nodes = [];
      if (master) { master.disconnect(); master = null; }
    }

    function start(level) {
      stop();
      if (!AU.sound.enabled || !level) return;
      const ac = AU.getAudio();
      if (!ac) return;
      master = ac.createGain();
      master.gain.value = 0.9;
      master.connect(ac.destination);
      const type = (AU.levelMeta[level.id] || {}).ambient || 'birds';
      PROFILES[type](ac);
    }

    function applySoundButton() {
      $('btnSound').textContent = AU.sound.enabled ? '🔊' : '🔇';
    }

    $('btnSound').addEventListener('click', () => {
      AU.sound.enabled = !AU.sound.enabled;
      ctx.menu.saveSettings({ sound: AU.sound.enabled });
      applySoundButton();
      if (AU.sound.enabled && ctx.state.running) start(ctx.state.level);
      else stop();
    });

    AU.sound.enabled = AU.settingsStore.load().sound !== false;
    applySoundButton();
    ctx.ambient = { start, stop };
  };
})();
