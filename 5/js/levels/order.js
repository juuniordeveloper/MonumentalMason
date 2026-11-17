/* =========================================================
   ANIT USTASI — Bölüm sırası
   Sırayı değiştirmek için ORDER listesini düzenle.
   ========================================================= */

(function () {
  const AU = window.AU;
  const ORDER = [
    'stonehenge', 'giza', 'parthenon', 'colosseum', 'valens',
    'hevsel', 'diyarbakir-ulu', 'chichen', 'notredame', 'galata',
    'vasil', 'selimiye', 'kizkulesi', 'tajmahal', 'ayasofya',
    // Zor seviye
    'celsus', 'gobeklitepe', 'petra', 'machupicchu', 'borobudur',
    // Kıtaların en bilinen eserleri
    'eiffel', 'bigben', 'neuschwanstein',
    'greatwall', 'angkor', 'himeji',
    'abusimbel', 'djenne', 'lalibela',
    'liberty', 'goldengate', 'empirestate',
    'cristo', 'laslajas', 'tiwanaku',
    'operahouse', 'moai', 'nanmadol',
    'portlockroy', 'terranova', 'southpole',
  ];
  // Zorluk: bölümde açıkça yazmıyorsa parça sayısına göre belirlenir
  AU.difficultyOf = (level) => level.difficulty || (level.structure.length <= 12 ? 'Kolay' : 'Orta');

  AU.LEVELS = ORDER.map((id) => {
    const level = AU.levelDefs.find((l) => l.id === id);
    if (!level) throw new Error('Bölüm bulunamadı: ' + id);
    return level;
  });
})();
