/* =========================================================
   ANIT USTASI — Dünya haritası menüsü
   - Gerçek ülke sınırları (eser bulunan ülkeler vurgulu)
   - Pinin üstüne gelince / dokununca bölüm kartı
   - Bitirilen eserin modeli pinin üstünde belirir
   - Birbirine çok yakın pinler sayılı küme baloncuğu olur;
     baloncuğa tıklayınca o bölgeye yakınlaşır
   - Tekerlek / iki parmak = yakınlaş, sürükle = gezin
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});
  const NS = 'http://www.w3.org/2000/svg';

  const W = 1000, H = 500;
  const PRESETS = {
    world: { x: 0, y: 50, w: 1000, h: 430 }, // Antarktika pinleri de görünsün
    europe: { x: 455, y: 85, w: 150, h: 95 },
    turkey: { x: 568, y: 118, w: 52, h: 30 },
    home: { x: 470, y: 90, w: 190, h: 150 }, // Avrupa, Akdeniz ve Orta Doğu (dikey ekran)
  };
  const PIN_PX = 8;
  const THUMB_PX = 60;
  const CLUSTER_PX = 34;      // bu kadar pikselden yakın pinler kümelenir
  const MIN_W = 24, MAX_W = 1000;
  const DIFF_COLOR = { Kolay: '#3f8a4a', Orta: '#c8962f', Zor: '#b23a2a' };
  const SEA_LABELS = [
    ['Atlas Okyanusu', -38, 28, 0], ['Büyük Okyanus', -140, 8, 0], ['Büyük Okyanus', 165, 18, 0],
    ['Hint Okyanusu', 78, -22, 0], ['Akdeniz', 17, 34.6, 1], ['Karadeniz', 34.5, 43.3, 1], ['Kızıldeniz', 38.3, 20.5, 1],
  ];

  AU.setupWorldMap = function (ctx) {
    const { $ } = ctx;
    const project = AU.mapProject;
    let svg = null, pinLayer = null, clusterLayer = null, labelLayer = null;
    let view = { ...PRESETS.world }, hideTimer = null, pins = [];
    let isVisible = () => true; // menüdeki kıta / zorluk filtresi
    const pointers = new Map();
    let drag = null, pinch = null;

    function el(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    }

    /* ---------- Görünüm ----------
       PERFORMANS: Yakınlaştırma/kaydırma sürerken SVG yeniden çizilmez;
       mevcut görüntü GPU'da CSS dönüşümüyle büyütülüp kaydırılır ("canlı"
       görünüm). Hareket durunca görünüm bir kez işlenir (commit) ve harita
       keskin olarak yeniden çizilir. Kutu ölçüsü önbellekte tutulur.      */
    let live = null, frameReq = 0, commitTimer = 0;
    let box = { w: 800, h: 400, left: 0, top: 0 };
    const COMMIT_MS = 120;

    // Dönüşümden etkilenmesin diye SVG'nin kendisini değil, onu taşıyan kutuyu ölçeriz
    function measure() {
      const host = svg.parentElement;
      const r = host.getBoundingClientRect();
      const w = host.clientWidth, h = host.clientHeight;
      if (w > 0 && h > 0) box = { w, h, left: r.left + host.clientLeft, top: r.top + host.clientTop };
    }
    // Görünüm, kutuyla aynı en-boy oranında tutulur (telefonda da tüm alanı doldurur)
    const boxAspect = () => box.h / box.w;
    const maxW = () => MAX_W; // dünyanın tamamı her zaman görülebilsin
    const current = () => live || view;
    // Ekranda 1 harita biriminin kaç piksel olduğu
    const pxPerUnit = (v) => box.w / (v || view).w;

    function clampView(v) {
      const a = boxAspect();
      const w = Math.min(maxW(), Math.max(MIN_W, v.w));
      const h = w * a;
      return { x: Math.min(W - w * 0.3, Math.max(-w * 0.7, v.x)), y: Math.min(H - h * 0.3, Math.max(-h * 0.7, v.y)), w, h };
    }

    // Hazır bölge: alanın tamamı kutuya sığacak genişlik, aynı merkez
    function regionView(p) {
      const a = boxAspect();
      const w = Math.min(maxW(), Math.max(p.w, p.h / a));
      const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
      return { x: cx - w / 2, y: cy - (w * a) / 2, w };
    }

    // Keskin çizim: viewBox, pin ölçekleri, etiketler, kümeler (hareket bitince bir kez)
    function applyView() {
      if (!svg) return;
      svg.style.transform = '';
      svg.setAttribute('viewBox', `${view.x} ${view.y} ${view.w} ${view.h}`);
      const k = 1 / pxPerUnit(); // 1 piksel kaç harita birimi
      for (const p of pins) p.g.setAttribute('transform', `translate(${p.x},${p.y}) scale(${k})`);
      for (const t of labelLayer.children) {
        t.setAttribute('font-size', 12 * k);
        t.style.display = t.dataset.small === '1' && view.w > 320 ? 'none' : '';
      }
      updateClusters();
    }

    // Canlı görünümü GPU dönüşümüyle göster (yeniden çizim yok)
    function paintLive() {
      frameReq = 0;
      if (!live) return;
      const s = view.w / live.w;
      const ppu = pxPerUnit(view);
      const tx = s * ppu * (view.x - live.x);
      const ty = s * ppu * (view.y - live.y);
      svg.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
    }

    function commit() {
      clearTimeout(commitTimer);
      if (!live) return;
      view = live;
      live = null;
      applyView();
    }

    // autoCommit=false: çağıran taraf (animasyon, parmak kaldırma) kendisi işler
    function setLive(v, autoCommit) {
      live = clampView(v);
      if (!frameReq) frameReq = requestAnimationFrame(paintLive);
      $('mapCard').classList.remove('show');
      clearTimeout(commitTimer);
      if (autoCommit !== false) commitTimer = setTimeout(commit, COMMIT_MS);
    }

    function animateTo(target, onDone) {
      commit();
      const from = { ...view };
      const to = clampView(target.h ? regionView(target) : target);
      const t0 = performance.now();
      const step = (now) => {
        const u = Math.min((now - t0) / 500, 1);
        const e = u * u * (3 - 2 * u);
        setLive({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, w: from.w + (to.w - from.w) * e }, false);
        if (u < 1) requestAnimationFrame(step);
        else { commit(); if (onDone) onDone(); }
      };
      requestAnimationFrame(step);
    }

    function zoomAt(factor, cx, cy, autoCommit) {
      const cur = current();
      const w = Math.min(maxW(), Math.max(MIN_W, cur.w * factor));
      const s = w / cur.w;
      setLive({ x: cx - (cx - cur.x) * s, y: cy - (cy - cur.y) * s, w }, autoCommit);
    }

    // Ekran noktası → harita koordinatı (canlı görünüme göre)
    function toMap(clientX, clientY) {
      const cur = current();
      const ppu = pxPerUnit(cur);
      return [cur.x + (clientX - box.left) / ppu, cur.y + (clientY - box.top) / ppu];
    }

    /* ---------- Kümeleme ---------- */
    function updateClusters() {
      const ppu = pxPerUnit();
      const groups = [];
      for (const p of pins) {
        if (!p.visible) { p.g.style.display = ''; continue; } // soluk pinler kümelenmez
        const g = groups.find((gr) => Math.hypot((gr.x - p.x) * ppu, (gr.y - p.y) * ppu) < CLUSTER_PX);
        if (g) { g.items.push(p); g.x = (g.x * (g.items.length - 1) + p.x) / g.items.length; g.y = (g.y * (g.items.length - 1) + p.y) / g.items.length; }
        else groups.push({ x: p.x, y: p.y, items: [p] });
      }
      clusterLayer.innerHTML = '';
      const k = 1 / ppu;
      for (const gr of groups) {
        const single = gr.items.length === 1;
        for (const p of gr.items) p.g.style.display = single ? '' : 'none';
        if (single) continue;
        const done = gr.items.filter((p) => p.done).length;
        const c = el('g', { class: 'cluster', transform: `translate(${gr.x},${gr.y}) scale(${k})` }, clusterLayer);
        el('circle', { r: 17, class: 'cluster-ring' }, c);
        el('circle', { r: 13, class: 'cluster-dot' }, c);
        el('text', { y: 4.5, class: 'cluster-num' }, c).textContent = gr.items.length;
        if (done) el('text', { y: 30, class: 'cluster-done' }, c).textContent = `${done} ✓`;
        c.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const xs = gr.items.map((p) => p.x), ys = gr.items.map((p) => p.y);
          const spanX = Math.max(...xs) - Math.min(...xs);
          const spanY = (Math.max(...ys) - Math.min(...ys)) / 0.39; // yüksekliği genişliğe çevir
          const w = Math.max(MIN_W * 1.3, Math.max(spanX, spanY) * 3 + 12);
          const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
          animateTo({ x: cx - w / 2, y: cy - (w * boxAspect()) / 2, w });
        });
        c.addEventListener('mouseenter', () => showTip(gr.items.map((p) => p.L.name).join(' · '), c));
        c.addEventListener('mouseleave', hideTip);
      }
    }

    /* ---------- Kart ve ipucu baloncuğu ---------- */
    function placeOver(node, target, offsetY) {
      const wrap = $('worldMap').getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const w = node.offsetWidth || 230;
      node.style.left = Math.min(wrap.width - w - 8, Math.max(8, r.left - wrap.left + r.width / 2 - w / 2)) + 'px';
      const top = r.top - wrap.top - (node.offsetHeight || 180) - offsetY;
      node.style.top = (top < 8 ? r.bottom - wrap.top + 10 : top) + 'px';
    }

    function showTip(text, target) {
      const tip = $('mapTip');
      tip.textContent = text;
      tip.classList.add('show');
      placeOver(tip, target, 6);
    }
    function hideTip() { $('mapTip').classList.remove('show'); }

    function showCard(p) {
      clearTimeout(hideTimer);
      const { L, index } = p;
      const card = $('mapCard');
      const progress = AU.progress.load();
      const diff = AU.difficultyOf(L);
      card.innerHTML = '';
      const pic = document.createElement('div');
      pic.className = 'mc-pic' + (progress[L.id] ? '' : ' locked');
      const img = document.createElement('img');
      img.alt = '';
      img.src = ctx.thumbs.get(L);
      pic.appendChild(img);
      const body = document.createElement('div');
      body.className = 'mc-body';
      const badge = document.createElement('span');
      badge.className = 'badge badge-' + diff.toLowerCase();
      badge.textContent = diff;
      const title = document.createElement('b');
      title.textContent = (index + 1) + '. ' + L.name;
      const sub = document.createElement('span');
      sub.className = 'sub';
      sub.textContent = `${L.place} · ${L.era} · ${L.structure.length} parça`;
      const stars = document.createElement('span');
      stars.className = 'card-stars';
      stars.innerHTML = [0, 1, 2].map((i) => `<span class="${i < (progress[L.id] || 0) ? 'on' : ''}">★</span>`).join('');
      const row = document.createElement('div');
      row.className = 'mc-row';
      const play = document.createElement('button');
      play.className = 'primary';
      play.textContent = progress[L.id] ? 'Tekrar oyna' : 'Oyna';
      play.addEventListener('click', () => ctx.menu.play(index));
      const chal = document.createElement('button');
      chal.textContent = '⏱';
      chal.title = 'Meydan okuma';
      chal.addEventListener('click', () => ctx.menu.play(index, 'challenge'));
      row.append(play, chal);
      body.append(badge, title, sub, stars, row);
      card.append(pic, body);
      card.classList.add('show');
      placeOver(card, p.g.querySelector('.pin-dot'), p.done ? THUMB_PX * 0.6 : 14);
    }
    function hideCardSoon() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => $('mapCard').classList.remove('show'), 380);
    }

    /* ---------- Pinler ---------- */
    function drawPins() {
      pinLayer.innerHTML = '';
      const progress = AU.progress.load();
      pins = [];
      ctx.LEVELS.forEach((L, index) => {
        const m = AU.levelMeta[L.id];
        if (!m) return;
        const [x, y] = project(m.mapLon !== undefined ? m.mapLon : m.lon, m.mapLat !== undefined ? m.mapLat : m.lat);
        const done = !!progress[L.id];
        const visible = isVisible(L);
        const g = el('g', { class: 'pin' + (done ? ' done' : '') + (visible ? '' : ' dim') }, pinLayer);
        if (done) {
          // Bitirilen eser pinin üstüne gelir
          el('ellipse', { cx: 0, cy: -2, rx: THUMB_PX * 0.3, ry: 4, class: 'pin-shadow' }, g);
          const img = el('image', { x: -THUMB_PX / 2, y: -THUMB_PX - 2, width: THUMB_PX, height: THUMB_PX, class: 'pin-thumb' }, g);
          img.setAttribute('href', ctx.thumbs.get(L));
        }
        el('circle', { r: PIN_PX + 4, class: 'pin-halo' }, g);
        el('circle', { r: PIN_PX, fill: DIFF_COLOR[AU.difficultyOf(L)], class: 'pin-dot' }, g);
        el('text', { y: 3.5, class: 'pin-num' }, g).textContent = index + 1;
        const p = { L, index, x, y, g, done, visible };
        g.addEventListener('mouseenter', () => showCard(p));
        g.addEventListener('mouseleave', hideCardSoon);
        g.addEventListener('click', (ev) => { ev.stopPropagation(); showCard(p); });
        pins.push(p);
      });
      // Soluk pinler altta, seçili olanlar üstte kalsın
      for (const p of pins) if (p.visible) pinLayer.appendChild(p.g);
      const shown = pins.filter((p) => p.visible);
      const done = shown.filter((p) => p.done).length;
      $('mapProgress').textContent = `${done} / ${shown.length} eser tamamlandı`;
      applyView();
    }

    /* ---------- Coğrafya ---------- */
    async function drawGeo(landLayer, waterLayer) {
      const geo = await AU.loadWorldGeo();
      landLayer.innerHTML = '';
      for (const c of geo.countries) {
        const tr = AU.mapCountriesTR[c.name];
        const path = el('path', { d: c.d, class: tr ? 'country has-site' : 'country' }, landLayer);
        if (tr) {
          path.addEventListener('mouseenter', () => { const t = $('mapCountry'); t.textContent = tr; t.classList.add('show'); });
          path.addEventListener('mouseleave', () => $('mapCountry').classList.remove('show'));
        }
      }
      if (geo.water) geo.water.forEach((d) => el('path', { d }, waterLayer));
      svg.classList.toggle('fallback', geo.source !== 'atlas');
    }

    /* ---------- Etkileşim: sürükle, tekerlek, iki parmak ---------- */
    function bindGestures() {
      svg.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        measure(); // sayfa kaymış olabilir
        const [cx, cy] = toMap(ev.clientX, ev.clientY);
        // Dokunmatik yüzeylerin küçük adımlarını da yumuşak karşıla
        const factor = Math.pow(1.0015, Math.max(-300, Math.min(300, ev.deltaY)));
        zoomAt(factor, cx, cy);
      }, { passive: false });

      svg.addEventListener('pointerdown', (ev) => {
        measure();
        pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
          drag = null;
        } else {
          const cur = current();
          drag = { x: ev.clientX, y: ev.clientY, vx: cur.x, vy: cur.y, w: cur.w, captured: false };
        }
      });
      svg.addEventListener('pointermove', (ev) => {
        if (!pointers.has(ev.pointerId)) return;
        pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (pinch && pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const [cx, cy] = toMap((a.x + b.x) / 2, (a.y + b.y) / 2);
          zoomAt(pinch.dist / Math.max(dist, 1), cx, cy, false);
          pinch.dist = dist;
          return;
        }
        if (!drag) return;
        // Pinlere tıklamayı bozmamak için yakalama ancak hareket başlayınca
        if (!drag.captured) {
          if (Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) < 5) return;
          drag.captured = true;
          svg.setPointerCapture(ev.pointerId);
        }
        const ppu = box.w / drag.w;
        setLive({ x: drag.vx - (ev.clientX - drag.x) / ppu, y: drag.vy - (ev.clientY - drag.y) / ppu, w: drag.w }, false);
      });
      const end = (ev) => {
        pointers.delete(ev.pointerId);
        if (pointers.size < 2) pinch = null;
        if (pointers.size === 0) { drag = null; commit(); }
      };
      svg.addEventListener('pointerup', end);
      svg.addEventListener('pointercancel', end);
      svg.addEventListener('click', () => $('mapCard').classList.remove('show'));
      // Kutu boyutu değişince ölçüyü ve görünümü yenile
      new ResizeObserver(() => {
        if (!svg.isConnected) return;
        measure();
        commit();
        view = clampView(view);
        applyView();
      }).observe(svg);
    }

    function build(container) {
      container.innerHTML = '';
      svg = el('svg', { class: 'map-svg', preserveAspectRatio: 'xMidYMid meet' }, container);
      const grid = el('g', { class: 'graticule' }, svg);
      for (let lon = -150; lon <= 180; lon += 30) el('line', { x1: project(lon, 0)[0], y1: 0, x2: project(lon, 0)[0], y2: H }, grid);
      for (let lat = -60; lat <= 80; lat += 20) el('line', { x1: 0, y1: project(0, lat)[1], x2: W, y2: project(0, lat)[1] }, grid);
      el('line', { x1: 0, y1: H / 2, x2: W, y2: H / 2, class: 'equator' }, grid);
      const landLayer = el('g', { class: 'land' }, svg);
      const waterLayer = el('g', { class: 'water' }, svg);
      labelLayer = el('g', { class: 'sea-labels' }, svg);
      for (const [name, lon, lat, small] of SEA_LABELS) {
        const [x, y] = project(lon, lat);
        const t = el('text', { x, y }, labelLayer);
        t.textContent = name;
        t.dataset.small = small;
      }
      clusterLayer = el('g', { class: 'clusters' }, svg);
      pinLayer = el('g', { class: 'pins' }, svg);
      // Kümeler pinlerin üstünde olsun
      svg.appendChild(clusterLayer);

      const tools = document.createElement('div');
      tools.className = 'map-tools';
      for (const [label, key] of [['🌍 Dünya', 'world'], ['🇹🇷 Türkiye', 'turkey']]) {
        const b = document.createElement('button');
        b.textContent = label;
        b.addEventListener('click', () => animateTo(PRESETS[key]));
        tools.appendChild(b);
      }
      for (const [label, fz] of [['+', 0.6], ['−', 1.6]]) {
        const b = document.createElement('button');
        b.textContent = label;
        b.className = 'zoom';
        b.addEventListener('click', () => {
          const cur = current();
          const w = cur.w * fz;
          animateTo({ x: cur.x + cur.w / 2 - w / 2, y: cur.y + cur.h / 2 - (w * boxAspect()) / 2, w });
        });
        tools.appendChild(b);
      }
      const legend = document.createElement('div');
      legend.className = 'map-legend';
      legend.innerHTML = '<span><i style="background:#3f8a4a"></i>Kolay</span><span><i style="background:#c8962f"></i>Orta</span><span><i style="background:#b23a2a"></i>Zor</span><span><i class="cl"></i>Küme: tıkla, yakınlaş</span>';
      const progress = document.createElement('div');
      progress.id = 'mapProgress';
      progress.className = 'map-progress';
      const country = document.createElement('div');
      country.id = 'mapCountry';
      country.className = 'map-country';
      const card = document.createElement('div');
      card.id = 'mapCard';
      card.className = 'map-card';
      card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      card.addEventListener('mouseleave', hideCardSoon);
      const tip = document.createElement('div');
      tip.id = 'mapTip';
      tip.className = 'map-tip';
      container.append(tools, legend, progress, country, card, tip);

      bindGestures();
      drawGeo(landLayer, waterLayer);
    }

    // Seçili kıtanın bölgesi; "tümü"de geniş ekranda dünya, dikey ekranda eserlerin yoğun olduğu bölge
    function continentView(id) {
      const c = id && id !== 'all' && AU.continentInfo(id);
      if (c) return regionView(c.view);
      return regionView(boxAspect() > 0.75 ? PRESETS.home : PRESETS.world);
    }

    // opts: { filter(L) → bool, continent: kıta kimliği | 'all', zoom: kıtaya yakınlaş }
    function render(container, opts) {
      const o = opts || {};
      isVisible = o.filter || (() => true);
      const fresh = !svg || !container.contains(svg);
      if (fresh) build(container);
      requestAnimationFrame(() => {
        measure();
        if (fresh) view = clampView(continentView(o.continent));
        drawPins();
        if (!fresh && o.zoom) animateTo(continentView(o.continent));
      });
    }

    // Listeden seçilen esere yakınlaş ve kartını aç
    function focus(id) {
      const p = pins.find((q) => q.L.id === id);
      if (!p) return;
      const w = 60;
      animateTo({ x: p.x - w / 2, y: p.y - (w * boxAspect()) / 2, w }, () => {
        p.g.style.display = '';
        showCard(p);
      });
      $('worldMap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    ctx.worldMap = { render, focus };
  };
})();
