/* =========================================================
   ANIT USTASI — Ana menü (sekmeler)
   Bölümler   : Kartlar ↔ Dünya Haritası görünümü, Usta modu
   Meydan Okuma: süre ve hamle hedefli bölümler
   Zaman Çizelgesi: eserler yapım yılına göre
   Koleksiyon : toplanan bilgi kartları
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  AU.setupMenu = function (ctx) {
    const { $ } = ctx;
    let settings = AU.settingsStore.load();
    let tab = 'levels';

    const starHtml = (n) => [0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('');
    const saveSettings = (patch) => { settings = { ...settings, ...patch }; AU.settingsStore.save(settings); };

    function play(index, mode) {
      ctx.ui.openLevel(index, mode || (settings.master ? 'master' : 'normal'));
    }

    function span(cls, text) {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      return s;
    }

    /* ---------- Kıta ve zorluk filtresi ---------- */
    const DIFFS = ['Kolay', 'Orta', 'Zor'];
    const filter = () => ({ continent: settings.continent || 'all', difficulty: settings.difficulty || 'all' });
    const matches = (L, f) =>
      (f.continent === 'all' || AU.continentOf(L) === f.continent) && (f.difficulty === 'all' || AU.difficultyOf(L) === f.difficulty);

    // Filtreye uyan bölümler, kıta sırasına göre gruplanmış
    function groupedLevels(f) {
      const items = ctx.LEVELS.map((L, i) => ({ L, i })).filter(({ L }) => matches(L, f));
      return AU.CONTINENTS.map((c) => ({ c, items: items.filter(({ L }) => AU.continentOf(L) === c.id) })).filter((g) => g.items.length);
    }

    function chip(label, active, onClick, extraClass) {
      const b = document.createElement('button');
      b.className = 'chip' + (active ? ' active' : '') + (extraClass ? ' ' + extraClass : '');
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    }

    function setFilter(patch) {
      saveSettings(patch);
      renderLevels(patch.continent !== undefined);
    }

    function renderFilters() {
      const box = $('levelFilters');
      box.innerHTML = '';
      const f = filter();
      const countFor = (cont) => ctx.LEVELS.filter((L) => matches(L, { continent: cont, difficulty: f.difficulty })).length;
      const conts = document.createElement('div');
      conts.className = 'chip-row';
      conts.appendChild(chip(`🌍 Tüm kıtalar · ${countFor('all')}`, f.continent === 'all', () => setFilter({ continent: 'all' })));
      for (const c of AU.CONTINENTS) {
        conts.appendChild(chip(`${c.icon} ${c.name} · ${countFor(c.id)}`, f.continent === c.id, () => setFilter({ continent: c.id })));
      }
      const diffs = document.createElement('div');
      diffs.className = 'chip-row';
      diffs.appendChild(span('chip-label', 'Zorluk:'));
      diffs.appendChild(chip('Tümü', f.difficulty === 'all', () => setFilter({ difficulty: 'all' })));
      for (const d of DIFFS) diffs.appendChild(chip(d, f.difficulty === d, () => setFilter({ difficulty: d }), 'chip-' + d.toLowerCase()));
      box.append(conts, diffs);
    }

    /* ---------- Bölüm kartları (kıtalara göre gruplu) ---------- */
    function levelCard(L, i, progress) {
      const b = document.createElement('button');
      b.className = 'level-card' + (progress[L.id] ? ' done' : '');
      const diff = AU.difficultyOf(L);
      const stars = span('card-stars', '');
      stars.innerHTML = starHtml(progress[L.id] || 0);
      b.append(span('num', 'BÖLÜM ' + (i + 1)), span('badge badge-' + diff.toLowerCase(), diff), span('title', L.name), span('sub', L.place + ' · ' + L.era), stars);
      if (progress[L.id]) {
        const img = document.createElement('img');
        img.className = 'card-thumb';
        img.alt = '';
        img.src = ctx.thumbs.get(L);
        b.appendChild(img);
      }
      b.addEventListener('click', () => play(i));
      return b;
    }

    function groupHead(c, items, progress) {
      const h = document.createElement('h3');
      h.className = 'continent-head';
      const done = items.filter(({ L }) => progress[L.id]).length;
      h.append(span('ch-name', `${c.icon} ${c.name}`), span('ch-count', `${done} / ${items.length} tamamlandı`));
      return h;
    }

    function renderCards() {
      const box = $('levelGrid');
      box.innerHTML = '';
      const progress = AU.progress.load();
      const groups = groupedLevels(filter());
      if (!groups.length) box.appendChild(span('empty-note', 'Bu filtreye uyan eser yok.'));
      for (const { c, items } of groups) {
        const grid = document.createElement('div');
        grid.className = 'level-grid';
        items.forEach(({ L, i }) => grid.appendChild(levelCard(L, i, progress)));
        box.append(groupHead(c, items, progress), grid);
      }
    }

    // Harita altındaki sınıflandırılmış eser listesi: tıklayınca pine gider
    function renderMapList() {
      const box = $('mapList');
      box.innerHTML = '';
      const progress = AU.progress.load();
      for (const { c, items } of groupedLevels(filter())) {
        const sec = document.createElement('div');
        sec.className = 'map-list-group';
        sec.appendChild(groupHead(c, items, progress));
        const row = document.createElement('div');
        row.className = 'map-list-items';
        for (const { L, i } of items) {
          const diff = AU.difficultyOf(L);
          const b = chip(`${progress[L.id] ? '✓ ' : ''}${i + 1}. ${L.name}`, false, () => ctx.worldMap.focus(L.id), 'chip-' + diff.toLowerCase() + (progress[L.id] ? ' done' : ''));
          b.title = `${L.place} · ${diff}`;
          row.appendChild(b);
        }
        sec.appendChild(row);
        box.appendChild(sec);
      }
    }

    function renderLevels(continentChanged) {
      const map = settings.menuView === 'map';
      document.querySelectorAll('#viewToggle button').forEach((b) => b.classList.toggle('active', b.dataset.view === settings.menuView));
      $('levelGrid').classList.toggle('hidden', map);
      $('worldMap').classList.toggle('hidden', !map);
      $('mapList').classList.toggle('hidden', !map);
      $('masterToggle').checked = !!settings.master;
      renderFilters();
      if (map) {
        const f = filter();
        ctx.worldMap.render($('worldMap'), { filter: (L) => matches(L, f), continent: f.continent, zoom: !!continentChanged });
        renderMapList();
      } else renderCards();
    }

    /* ---------- Meydan okuma listesi ---------- */
    function renderChallenge() {
      const list = $('challengeList');
      list.innerHTML = '';
      const results = AU.challengeStore.load();
      ctx.LEVELS.forEach((L, i) => {
        const t = AU.challengeTargets(L);
        const r = results[L.id];
        const row = document.createElement('div');
        row.className = 'challenge-row';
        const diff = AU.difficultyOf(L);
        const info = document.createElement('div');
        info.append(span('title', (i + 1) + '. ' + L.name), span('badge-inline badge-' + diff.toLowerCase(), diff));
        const goals = span('goals', `⏱ ${ctx.modes.fmt(t.time)}   🎯 ${t.moves} hamle`);
        const best = span('best', '');
        best.innerHTML = r ? `${starHtml(r.stars)} <small>${ctx.modes.fmt(r.time)} · ${r.moves} hamle</small>` : '<small>Henüz denenmedi</small>';
        const go = document.createElement('button');
        go.className = 'primary';
        go.textContent = 'Başla';
        go.addEventListener('click', () => play(i, 'challenge'));
        row.append(info, goals, best, go);
        list.appendChild(row);
      });
    }

    /* ---------- Zaman çizelgesi ---------- */
    function renderTimeline() {
      const box = $('timeline');
      box.innerHTML = '';
      const progress = AU.progress.load();
      const items = ctx.LEVELS.map((L, i) => ({ L, i, year: (AU.levelMeta[L.id] || {}).year || 0 })).sort((a, b) => a.year - b.year);
      const track = document.createElement('div');
      track.className = 'timeline-track';
      items.forEach(({ L, i, year }, n) => {
        const item = document.createElement('button');
        item.className = 'timeline-item ' + (n % 2 ? 'down' : 'up') + (progress[L.id] ? ' done' : '');
        const pic = document.createElement('div');
        pic.className = 'tl-pic';
        if (progress[L.id]) {
          const img = document.createElement('img');
          img.src = ctx.thumbs.get(L);
          img.alt = '';
          pic.appendChild(img);
        } else {
          pic.textContent = '?';
        }
        item.append(pic, span('tl-year', AU.yearLabel(year)), span('tl-name', L.name), span('tl-dot', ''));
        item.title = progress[L.id] ? L.name + ' — tekrar oyna' : L.name + ' — henüz tamamlanmadı';
        item.addEventListener('click', () => play(i));
        track.appendChild(item);
      });
      box.appendChild(track);
      const done = items.filter((x) => progress[x.L.id]).length;
      $('timelineInfo').textContent = `${done} / ${items.length} eser zaman çizelgesine yerleşti. Tamamladığın eserler resimleriyle görünür.`;
    }

    function renderTab() {
      document.querySelectorAll('#menuTabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('.tab-page').forEach((p) => p.classList.toggle('hidden', p.id !== 'tab-' + tab));
      if (tab === 'levels') renderLevels();
      if (tab === 'challenge') renderChallenge();
      if (tab === 'timeline') renderTimeline();
      if (tab === 'museum') ctx.collection.renderMuseum($('museum'));
    }

    document.querySelectorAll('#menuTabs button').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; renderTab(); }));
    document.querySelectorAll('#viewToggle button').forEach((b) => b.addEventListener('click', () => { saveSettings({ menuView: b.dataset.view }); renderLevels(true); }));
    $('masterToggle').addEventListener('change', (ev) => saveSettings({ master: ev.target.checked }));

    ctx.menu = { render: renderTab, play, settings: () => settings, saveSettings };
  };
})();
