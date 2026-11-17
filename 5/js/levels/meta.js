/* =========================================================
   ANIT USTASI — Eserlerin ek bilgileri
   year     : zaman çizelgesi için yaklaşık yapım yılı (MÖ = eksi)
   lat/lon  : gerçek konum (harita pini)
   mapLat/mapLon: çok yakın eserler haritada üst üste binmesin (ve
                  Antarktika pinleri dünya görünümüne sığsın) diye
                  pinin gösterildiği nokta
   continent: kıta (sınıflandırma ve harita filtresi)
   ambient  : ortam sesi türü (sea, wind, birds, city, jungle, river)
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  // Kıtalar: ad, simge ve haritada yakınlaşılacak bölge (harita birimi)
  AU.CONTINENTS = [
    { id: 'europe', name: 'Avrupa', icon: '🏰', view: { x: 465, y: 70, w: 155, h: 85 } },
    { id: 'asia', name: 'Asya', icon: '🏯', view: { x: 560, y: 70, w: 350, h: 210 } },
    { id: 'africa', name: 'Afrika', icon: '🐪', view: { x: 440, y: 140, w: 215, h: 212 } },
    { id: 'namerica', name: 'Kuzey Amerika', icon: '🗽', view: { x: 120, y: 75, w: 240, h: 150 } },
    { id: 'samerica', name: 'Güney Amerika', icon: '🦙', view: { x: 255, y: 210, w: 165, h: 200 } },
    { id: 'oceania', name: 'Okyanusya', icon: '🌊', view: { x: 790, y: 200, w: 210, h: 190 } },
    { id: 'antarctica', name: 'Antarktika', icon: '🐧', view: { x: 290, y: 400, w: 690, h: 100 } },
  ];

  const E = 'europe', A = 'asia', F = 'africa', N = 'namerica', S = 'samerica', O = 'oceania', X = 'antarctica';

  AU.levelMeta = {
    // --- İlk 20 eser
    stonehenge: { year: -3000, lat: 51.179, lon: -1.826, continent: E, ambient: 'birds' },
    giza: { year: -2560, lat: 29.979, lon: 31.134, continent: F, ambient: 'wind' },
    parthenon: { year: -447, lat: 37.972, lon: 23.727, continent: E, ambient: 'birds' },
    colosseum: { year: 80, lat: 41.890, lon: 12.492, continent: E, ambient: 'city' },
    valens: { year: 368, lat: 41.016, lon: 28.955, mapLat: 41.1, mapLon: 27.7, continent: E, ambient: 'city' },
    hevsel: { year: 349, lat: 37.905, lon: 40.240, mapLat: 37.62, mapLon: 40.62, continent: A, ambient: 'river' },
    'diyarbakir-ulu': { year: 1091, lat: 37.913, lon: 40.231, mapLat: 38.2, mapLon: 39.9, continent: A, ambient: 'city' },
    chichen: { year: 900, lat: 20.683, lon: -88.569, continent: N, ambient: 'jungle' },
    notredame: { year: 1163, lat: 48.853, lon: 2.350, mapLat: 48.4, mapLon: 2.9, continent: E, ambient: 'river' },
    galata: { year: 1348, lat: 41.026, lon: 28.974, mapLat: 42.2, mapLon: 28.9, continent: E, ambient: 'sea' },
    vasil: { year: 1555, lat: 55.753, lon: 37.623, continent: E, ambient: 'city' },
    selimiye: { year: 1568, lat: 41.678, lon: 26.559, continent: E, ambient: 'birds' },
    kizkulesi: { year: 1110, lat: 41.021, lon: 29.004, mapLat: 41.2, mapLon: 30.3, continent: A, ambient: 'sea' },
    tajmahal: { year: 1632, lat: 27.175, lon: 78.042, continent: A, ambient: 'birds' },
    ayasofya: { year: 537, lat: 41.008, lon: 28.980, mapLat: 40.15, mapLon: 29.1, continent: E, ambient: 'city' },
    celsus: { year: 117, lat: 37.939, lon: 27.341, continent: A, ambient: 'wind' },
    gobeklitepe: { year: -9600, lat: 37.223, lon: 38.922, continent: A, ambient: 'wind' },
    petra: { year: -50, lat: 30.322, lon: 35.451, continent: A, ambient: 'wind' },
    machupicchu: { year: 1450, lat: -13.163, lon: -72.545, continent: S, ambient: 'wind' },
    borobudur: { year: 800, lat: -7.608, lon: 110.204, continent: A, ambient: 'jungle' },
    // --- Kıta eserleri
    eiffel: { year: 1889, lat: 48.858, lon: 2.294, mapLat: 49.3, mapLon: 1.8, continent: E, ambient: 'city' },
    bigben: { year: 1859, lat: 51.501, lon: -0.125, continent: E, ambient: 'river' },
    neuschwanstein: { year: 1869, lat: 47.558, lon: 10.750, continent: E, ambient: 'birds' },
    greatwall: { year: -220, lat: 40.432, lon: 116.570, continent: A, ambient: 'wind' },
    angkor: { year: 1113, lat: 13.412, lon: 103.867, continent: A, ambient: 'jungle' },
    himeji: { year: 1609, lat: 34.839, lon: 134.694, continent: A, ambient: 'birds' },
    abusimbel: { year: -1264, lat: 22.337, lon: 31.626, continent: F, ambient: 'wind' },
    djenne: { year: 1907, lat: 13.906, lon: -4.556, continent: F, ambient: 'wind' },
    lalibela: { year: 1200, lat: 12.032, lon: 39.041, continent: F, ambient: 'wind' },
    liberty: { year: 1886, lat: 40.689, lon: -74.045, mapLat: 40.0, mapLon: -74.6, continent: N, ambient: 'sea' },
    goldengate: { year: 1937, lat: 37.820, lon: -122.478, continent: N, ambient: 'sea' },
    empirestate: { year: 1931, lat: 40.748, lon: -73.986, mapLat: 41.5, mapLon: -73.4, continent: N, ambient: 'city' },
    cristo: { year: 1931, lat: -22.952, lon: -43.210, continent: S, ambient: 'birds' },
    laslajas: { year: 1916, lat: 0.805, lon: -77.586, continent: S, ambient: 'river' },
    tiwanaku: { year: 500, lat: -16.555, lon: -68.673, continent: S, ambient: 'wind' },
    operahouse: { year: 1973, lat: -33.857, lon: 151.215, continent: O, ambient: 'sea' },
    moai: { year: 1300, lat: -27.126, lon: -109.277, continent: O, ambient: 'sea' },
    nanmadol: { year: 1180, lat: 6.844, lon: 158.336, continent: O, ambient: 'sea' },
    portlockroy: { year: 1944, lat: -64.825, lon: -63.494, continent: X, ambient: 'sea' },
    terranova: { year: 1911, lat: -77.636, lon: 166.418, mapLat: -72.5, mapLon: 162, continent: X, ambient: 'wind' },
    southpole: { year: 1956, lat: -90, lon: 0, mapLat: -74, mapLon: 30, continent: X, ambient: 'wind' },
  };

  AU.yearLabel = (y) => (y < 0 ? 'MÖ ' + Math.abs(y).toLocaleString('tr-TR') : 'MS ' + y);
  AU.continentOf = (level) => (AU.levelMeta[level.id] || {}).continent || 'europe';
  AU.continentInfo = (id) => AU.CONTINENTS.find((c) => c.id === id);
})();
