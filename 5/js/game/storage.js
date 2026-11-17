/* =========================================================
   ANIT USTASI — Tarayıcıda yerel kayıt
   İlerleme (yıldızlar), koleksiyon kartları, meydan okuma
   sonuçları, en iyi puanlar ve ayarlar (ses, usta modu).
   Gizli sekmede localStorage kapalı olabilir; o zaman oyun
   kayıt tutmadan çalışmaya devam eder.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  function store(key, fallback) {
    return {
      load() {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
          return fallback;
        }
      },
      save(value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { /* kayıt yapılamıyor */ }
      },
    };
  }

  AU.progress = store('anit-ustasi-progress-v2', {});      // { levelId: yıldız }
  AU.collectionStore = store('anit-ustasi-collection-v1', []); // ['levelId:part', ...]
  AU.challengeStore = store('anit-ustasi-challenge-v1', {}); // { levelId: { stars, time, moves } }
  AU.scoreStore = store('anit-ustasi-score-v1', {});         // { levelId: en iyi puan }
  AU.settingsStore = store('anit-ustasi-settings-v1', { sound: true, master: false, menuView: 'cards' });
})();
