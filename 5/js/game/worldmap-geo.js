/* =========================================================
   ANIT USTASI — Harita coğrafya verisi
   Gerçek ülke sınırları Natural Earth (kamu malı) verisinden,
   "world-atlas" paketi üzerinden CDN'den yüklenir. Bağlantı
   yoksa world-shapes.js'teki sade kıta çizimleri kullanılır.
   ========================================================= */

(function () {
  const AU = (window.AU = window.AU || {});

  const ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
  const TOPO_URL = 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm';
  const W = 1000, H = 500;

  // Eser bulunan ülkeler (İngilizce ad → Türkçe ad)
  AU.mapCountriesTR = {
    'United Kingdom': 'Birleşik Krallık', Egypt: 'Mısır', Greece: 'Yunanistan', Italy: 'İtalya',
    Turkey: 'Türkiye', 'Türkiye': 'Türkiye', Mexico: 'Meksika', France: 'Fransa', Russia: 'Rusya',
    India: 'Hindistan', Jordan: 'Ürdün', Peru: 'Peru', Indonesia: 'Endonezya',
    Germany: 'Almanya', China: 'Çin', Cambodia: 'Kamboçya', Japan: 'Japonya', Mali: 'Mali',
    Ethiopia: 'Etiyopya', 'United States of America': 'ABD', Brazil: 'Brezilya', Colombia: 'Kolombiya',
    Bolivia: 'Bolivya', Australia: 'Avustralya', Chile: 'Şili', Micronesia: 'Mikronezya', Antarctica: 'Antarktika',
  };

  AU.mapProject = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];

  const pt = (x, y) => x.toFixed(1) + ',' + y.toFixed(1);

  // Bir halkayı SVG yoluna çevirir; 180. boylamı geçen kenarlarda çizgiyi böler.
  // Antarktika gibi kutbu çevreleyen halkalar haritanın alt kenarından dolaşarak kapanır.
  function ringToPath(ring) {
    let d = '';
    let prevLon = null;
    ring.forEach(([lon, lat], i) => {
      const [x, y] = AU.mapProject(lon, lat);
      const jump = prevLon !== null && Math.abs(lon - prevLon) > 180;
      if (jump && lat < -60) {
        const fromX = prevLon < 0 ? 0 : W, toX = W - fromX;
        d += 'L' + pt(fromX, y) + 'L' + pt(fromX, H) + 'L' + pt(toX, H) + 'L' + pt(toX, y) + 'L' + pt(x, y);
      } else {
        d += (i === 0 || jump ? 'M' : 'L') + pt(x, y);
      }
      prevLon = lon;
    });
    return d + 'Z';
  }

  function geometryToPath(geom) {
    if (!geom) return '';
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    return polys.map((poly) => poly.map(ringToPath).join('')).join('');
  }

  let pending = null;

  // { source: 'atlas' | 'fallback', countries: [{ name, d }] }
  AU.loadWorldGeo = function () {
    if (pending) return pending;
    pending = (async () => {
      try {
        const [topo, topojson] = await Promise.all([fetch(ATLAS_URL).then((r) => {
          if (!r.ok) throw new Error('Harita verisi alınamadı: ' + r.status);
          return r.json();
        }), import(TOPO_URL)]);
        const fc = topojson.feature(topo, topo.objects.countries);
        const countries = fc.features.map((f) => ({ name: f.properties.name, d: geometryToPath(f.geometry) }));
        return { source: 'atlas', countries };
      } catch (err) {
        console.warn('Ayrıntılı harita yüklenemedi, sade harita kullanılıyor:', err);
        return {
          source: 'fallback',
          countries: AU.worldShapes.land.map((pts) => ({ name: '', d: ringToPath(pts) })),
          water: AU.worldShapes.water.map((pts) => ringToPath(pts)),
        };
      }
    })();
    return pending;
  };
})();
