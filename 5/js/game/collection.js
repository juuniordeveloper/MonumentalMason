/* =========================================================
   ANIT USTASI — Bilgi kartı koleksiyonu
   Bir parça tipi ilk kez yerleştirildiğinde ekranda bilgi kartı
   açılır ve oyuncunun "müze koleksiyonu"na eklenir.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const CARD_MS = 4200;

  AU.setupCollection = function (ctx) {
    const { $ } = ctx;
    let owned = new Set(AU.collectionStore.load());
    const queue = [];
    let showing = false;

    const keyOf = (levelId, part) => levelId + ':' + part;
    const infoOf = (levelId, part) => (AU.partInfo[levelId] && AU.partInfo[levelId][part]) || [part, ''];

    function showNext() {
      if (showing || !queue.length) return;
      showing = true;
      const { level, part } = queue.shift();
      const [name, fact] = infoOf(level.id, part);
      $('cardLevel').textContent = level.name;
      $('cardName').textContent = name;
      $('cardFact').textContent = fact;
      $('cardCount').textContent = countFor(level).have + ' / ' + countFor(level).total + ' kart';
      const el = $('partCard');
      el.classList.add('show');
      AU.sfx.card();
      setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => { showing = false; showNext(); }, 350);
      }, CARD_MS);
    }

    // Yerleştirilen parça yeni bir kart açıyorsa kaydet ve göster
    function unlock(level, part) {
      const key = keyOf(level.id, part);
      if (owned.has(key)) return false;
      owned = new Set([...owned, key]);
      AU.collectionStore.save([...owned]);
      queue.push({ level, part });
      showNext();
      return true;
    }

    function countFor(level) {
      const parts = Object.keys(level.parts);
      return { have: parts.filter((p) => owned.has(keyOf(level.id, p))).length, total: parts.length };
    }

    function totals() {
      return ctx.LEVELS.reduce((acc, L) => {
        const c = countFor(L);
        return { have: acc.have + c.have, total: acc.total + c.total };
      }, { have: 0, total: 0 });
    }

    // Müze ekranı: her bölüm için kartlar (bulunmayanlar kilitli)
    function renderMuseum(container) {
      container.innerHTML = '';
      const t = totals();
      const head = document.createElement('p');
      head.className = 'museum-total';
      head.textContent = `Koleksiyon: ${t.have} / ${t.total} bilgi kartı`;
      container.appendChild(head);
      for (const L of ctx.LEVELS) {
        const c = countFor(L);
        const section = document.createElement('section');
        section.className = 'museum-level';
        const h = document.createElement('h3');
        h.textContent = `${L.name} — ${c.have}/${c.total}`;
        const grid = document.createElement('div');
        grid.className = 'museum-grid';
        for (const part of Object.keys(L.parts)) {
          const card = document.createElement('div');
          const has = owned.has(keyOf(L.id, part));
          card.className = 'museum-card' + (has ? '' : ' locked');
          const [name, fact] = infoOf(L.id, part);
          const b = document.createElement('b');
          b.textContent = has ? name : '???';
          const p = document.createElement('p');
          p.textContent = has ? fact : 'Bu parçayı yerleştirince açılır.';
          card.append(b, p);
          grid.appendChild(card);
        }
        section.append(h, grid);
        container.appendChild(section);
      }
    }

    ctx.collection = { unlock, renderMuseum, countFor, totals };
  };
})();
