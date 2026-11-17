/* =========================================================
   ANIT USTASI — Dünya mirası bölümleri
   ========================================================= */

(function () {
  const AU = window.AU;
  const { ring, K, onFaces, onion, win, winRow, ringWins, openingPts } = AU.shapes;

  const MARBLE = '#f4f0e8', INLAY = '#9a8f80', JALI = '#d8cfbf';

  // Pishtak: dikdörtgen çerçeve içinde derin sivri kemerli eyvan ve hat kuşağı
  function pishtaq(w, h, z, archW, archH) {
    return [
      { shape: 'box', size: [w, h, 0.08], at: [0, 0, z], color: '#fbf8f2' },
      // Hat (kaligrafi) kuşağı: kemerin çevresinde koyu ince çerçeve
      { shape: 'extrude', pts: openingPts(archW + 0.16, archH + 0.1, 'pointed'), holes: [openingPts(archW + 0.06, archH + 0.04, 'pointed').map(([x, y]) => [x, y + 0.0])], d: 0.02, at: [0, 0.0, z + 0.05], color: INLAY },
      { shape: 'extrude', pts: openingPts(archW, archH, 'pointed'), d: 0.04, at: [0, 0, z + 0.03], color: '#cfc5b3' },
      // Eyvan içindeki kafesli pencereler
      { shape: 'extrude', pts: openingPts(archW * 0.4, archH * 0.32, 'pointed'), d: 0.02, at: [0, archH * 0.12, z + 0.06], color: '#5e554a' },
      { shape: 'extrude', pts: openingPts(archW * 0.36, archH * 0.22, 'pointed'), d: 0.02, at: [0, archH * 0.55, z + 0.06], color: '#8a8070' },
      // Çerçeve kenar şeritleri
      ...[-1, 1].map((sx) => ({ shape: 'box', size: [0.035, h, 0.02], at: [sx * (w / 2 - 0.04), 0, z + 0.05], color: INLAY, detail: true })),
      { shape: 'box', size: [w - 0.04, 0.035, 0.02], at: [0, h - 0.06, z + 0.05], color: INLAY, detail: true },
    ];
  }

  // Selvi: sivri, yoğun yeşil gövde
  const cypressTree = () => [
    { shape: 'cyl', rt: 0.04, rb: 0.05, h: 0.2, seg: 6, color: '#6b4a2f' },
    { shape: 'lathe', seg: 12, color: '#2f5d2c', points: [[0, 0], [0.16, 0.06], [0.2, 0.3], [0.18, 0.62], [0.12, 0.92], [0.05, 1.14], [0, 1.22]], at: [0, 0.12, 0] },
  ];

  AU.levelDefs.push(
    /* ---------------------------------------------- TAC MAHAL */
    {
      id: 'tajmahal',
      name: 'Tac Mahal',
      place: 'Agra, Hindistan',
      era: '1632 – 1653',
      theme: { sky: '#f6d7c3', fog: '#f3dccd', ground: '#7d9a5e', pad: '#d9cdb8' },
      intro:
        'Mermer kaideyi kur, üzerine büyük kemerli (eyvanlı) türbeyi, kasnağı ve soğan kubbeyi yerleştir. ' +
        'Dört köşe köşkü, dört minare, önündeki havuz ve servi ağaçlarıyla kompleksi tamamla.',
      facts: [
        'Babür İmparatoru Şah Cihan, eşi Mümtaz Mahal\'in anısına yaptırdı.',
        'Beyaz Makrana mermerinden yapılmış, değerli taş kakmalarla (pietra dura) süslenmiştir.',
        'Dört minaresi, bir depremde türbenin üzerine devrilmesin diye hafifçe dışa eğik yapılmıştır.',
        '1983\'te UNESCO Dünya Mirası Listesi\'ne alındı; mimarının Ustad Ahmad Lahauri olduğu kabul edilir.',
      ],
      parts: {
        plinth: [
          { shape: 'box', size: [6, 0.5, 6], color: '#e9e3d8' },
          { shape: 'box', size: [6.08, 0.06, 6.08], at: [0, 0.44, 0], color: '#d9d1c3' },
          // Kaide çevresinde sivri kemerli kör nişler
          ...onFaces(Array.from({ length: 9 }, (_, k) => -2.4 + k * 0.6).flatMap((x) => win({ w: 0.26, h: 0.3, at: [x, 0.06, 3.0], top: 'pointed', color: '#d2c8b7', d: 0.02 }))),
          ...onFaces([{ shape: 'box', size: [6.0, 0.03, 0.02], at: [0, 0.4, 3.01], color: '#bfb3a0', detail: true }]),
        ],
        tomb: [
          // Köşeleri pahlı kare gövde (gerçek planı düzensiz sekizgendir)
          { shape: 'extrude', axis: 'y', d: 2, color: MARBLE, pts: [[-1.5, -1.0], [-1.0, -1.5], [1.0, -1.5], [1.5, -1.0], [1.5, 1.0], [1.0, 1.5], [-1.0, 1.5], [-1.5, 1.0]] },
          ...onFaces([
            ...pishtaq(1.4, 1.95, 1.5, 0.82, 1.4),
            // Pishtakın iki yanında üst üste ikişer niş
            ...[-0.78, 0.78].flatMap((x) => [0.15, 1.05].flatMap((y) => win({ w: 0.26, h: 0.62, at: [x, y, 1.5], top: 'pointed', color: '#cfc5b3', frame: INLAY, fw: 0.02, d: 0.03 }))),
          ]),
          // Pahlı köşelerdeki nişler
          ...onFaces([0.15, 1.05].flatMap((y) => win({ w: 0.24, h: 0.6, at: [1.25, y, 1.25], rotY: 45, top: 'pointed', color: '#cfc5b3', frame: INLAY, fw: 0.02, d: 0.03 }))),
          // Köşe süs kuleleri (guldasta) ve tepelerindeki goncalar
          ...onFaces([
            { shape: 'cyl', rt: 0.05, rb: 0.07, h: 2.25, seg: 8, at: [1.3, 0, 1.3], color: '#efe9de' },
            { shape: 'sphere', r: 0.07, scale: [1, 1.4, 1], at: [1.3, 2.25, 1.3], color: '#efe9de' },
          ]),
          // Parapet ve kenar şeridi
          { shape: 'extrude', axis: 'y', d: 0.08, at: [0, 1.92, 0], color: '#e6dfd2', pts: [[-1.54, -1.0], [-1.0, -1.54], [1.0, -1.54], [1.54, -1.0], [1.54, 1.0], [1.0, 1.54], [-1.0, 1.54], [-1.54, 1.0]] },
          ...onFaces(Array.from({ length: 7 }, (_, k) => ({ shape: 'box', size: [0.08, 0.1, 0.05], at: [-0.9 + k * 0.3, 2.0, 1.5], color: '#e6dfd2', detail: true }))),
        ],
        drum: [
          { shape: 'cyl', rt: 0.85, rb: 0.85, h: 0.45, seg: 32, color: '#f1ece3' },
          ...ringWins(16, 0.85, 0.08, { w: 0.08, h: 0.24, top: 'pointed', color: '#c9bfb0', d: 0.02 }),
          { shape: 'torus', r: 0.86, tube: 0.02, radial: 4, seg: 40, rotX: 90, at: [0, 0.36, 0], color: INLAY, detail: true },
          { shape: 'cyl', rt: 0.88, rb: 0.88, h: 0.05, seg: 32, at: [0, 0.4, 0], color: '#e6dfd2' },
        ],
        dome: [
          onion(0.95, 1.5, '#f7f4ee'),
          // Kubbe tepesindeki ters lotus ve kademeli tunç alem
          { shape: 'lathe', seg: 16, color: '#efe9de', points: [[0.22, 0], [0.18, 0.05], [0.1, 0.08], [0, 0.09]], at: [0, 1.42, 0] },
          { shape: 'cyl', rt: 0.015, rb: 0.03, h: 0.45, seg: 8, at: [0, 1.48, 0], color: '#c9a646', metal: true },
          ...[1.56, 1.66, 1.76].map((y, k) => ({ shape: 'sphere', r: 0.05 - k * 0.01, at: [0, y, 0], color: '#e0bb4f', metal: true })),
          { shape: 'torus', r: 0.05, tube: 0.012, radial: 6, arc: Math.PI * 1.45, rotZ: 117, at: [0, 1.92, 0], color: '#e8c35a', metal: true },
        ],
        chhatri: [
          { shape: 'cyl', rt: 0.28, rb: 0.3, h: 0.12, seg: 8, rotY: 22.5, color: '#efe9de' },
          // Sekiz ince sütun ve aralarında sivri kemerler
          ...ring(8, 0.24, 0.12, [0.04, 0.3, 0.04], '#e6dfd2', 22.5),
          ...ringWins(8, 0.25, 0.12, { w: 0.14, h: 0.3, top: 'pointed', color: '#efe9de', d: 0.012 }),
          { shape: 'cyl', rt: 0.34, rb: 0.32, h: 0.06, seg: 8, rotY: 22.5, at: [0, 0.42, 0], color: '#e6dfd2' },
          onion(0.24, 0.36, '#f7f4ee', [0, 0.48, 0]),
          { shape: 'cyl', rt: 0.01, rb: 0.015, h: 0.12, seg: 6, at: [0, 0.83, 0], color: '#c9a646', metal: true },
        ],
        minaret: [
          { shape: 'cyl', rt: 0.26, rb: 0.28, h: 0.15, seg: 8, rotY: 22.5, color: '#e6dfd2' },
          { shape: 'cyl', rt: 0.16, rb: 0.21, h: 2.4, seg: 12, at: [0, 0.15, 0], color: '#f4f0e8', flat: true },
          // Mermer bloklarını ayıran siyah kakma çizgileri
          ...[0.45, 0.7, 1.25, 1.5, 2.05, 2.3].map((y) => ({ shape: 'torus', r: 0.2 - y * 0.018, tube: 0.006, radial: 3, seg: 16, rotX: 90, at: [0, y, 0], color: '#5a5048', detail: true })),
          ...[0.95, 1.75].flatMap((y) => [
            { shape: 'cyl', rt: 0.27, rb: 0.2, h: 0.07, seg: 12, at: [0, y, 0], color: '#e0d8ca' },
            ...Array.from({ length: 12 }, (_, k) => (k / 12) * Math.PI * 2).map((a) => ({ shape: 'box', size: [0.02, 0.07, 0.02], at: [Math.sin(a) * 0.26, y + 0.07, Math.cos(a) * 0.26], color: '#e0d8ca', detail: true })),
          ]),
          { shape: 'cyl', rt: 0.27, rb: 0.18, h: 0.07, seg: 12, at: [0, 2.55, 0], color: '#e0d8ca' },
          ...ring(8, 0.15, 2.62, [0.03, 0.22, 0.03], '#e6dfd2', 22.5),
          { shape: 'cyl', rt: 0.2, rb: 0.2, h: 0.04, seg: 8, at: [0, 2.84, 0], color: '#e6dfd2' },
          onion(0.16, 0.26, '#f7f4ee', [0, 2.88, 0]),
          { shape: 'cyl', rt: 0.008, rb: 0.012, h: 0.1, seg: 6, at: [0, 3.13, 0], color: '#c9a646', metal: true },
        ],
        pool: [
          { shape: 'box', size: [1.3, 0.06, 2.3], color: '#c9c1b3' },
          { shape: 'box', size: [1.05, 0.03, 2.05], at: [0, 0.06, 0], color: '#5b9bd5' },
          { shape: 'box', size: [1.32, 0.03, 0.06], at: [0, 0.06, 0], color: '#bfb3a0' },
          // Fıskiyeler: ince su sütunları
          ...[-0.8, -0.4, 0, 0.4, 0.8].map((z) => ({ shape: 'cyl', rt: 0.01, rb: 0.03, h: 0.22, seg: 6, at: [0, 0.06, z], color: '#e8f2fb', opacity: 0.7 })),
        ],
        cypress: cypressTree(),
      },
      structure: [
        { part: 'plinth', pos: [0, 0, 0], ry: 0 },
        { part: 'tomb', pos: [0, 0.5, 0], ry: 0 },
        { part: 'drum', pos: [0, 2.5, 0], ry: 0 },
        { part: 'dome', pos: [0, 2.95, 0], ry: 0 },
        { part: 'chhatri', pos: [-1.1, 2.5, -1.1], ry: 0 },
        { part: 'chhatri', pos: [1.1, 2.5, -1.1], ry: 0 },
        { part: 'chhatri', pos: [-1.1, 2.5, 1.1], ry: 0 },
        { part: 'chhatri', pos: [1.1, 2.5, 1.1], ry: 0 },
        { part: 'minaret', pos: [-2.6, 0.5, -2.6], ry: 0 },
        { part: 'minaret', pos: [2.6, 0.5, -2.6], ry: 0 },
        { part: 'minaret', pos: [-2.6, 0.5, 2.6], ry: 0 },
        { part: 'minaret', pos: [2.6, 0.5, 2.6], ry: 0 },
        { part: 'pool', pos: [0, 0, 4.4], ry: 0 },
        { part: 'cypress', pos: [-1.0, 0, 4.0], ry: 0 },
        { part: 'cypress', pos: [1.0, 0, 4.0], ry: 0 },
      ],
    },
    /* ---------------------------------------------- CHICHÉN ITZÁ */
    {
      id: 'chichen',
      name: 'Chichén Itzá — Kukulkan Piramidi',
      place: 'Yucatán, Meksika',
      era: '~9. – 12. yy',
      theme: { sky: '#a9d2e8', fog: '#c3dfe0', ground: '#6f9a4a', pad: '#c9bd9a' },
      intro:
        'Maya şehrinin kalbindeki "El Castillo"yu kur: dokuz basamaklı gövdeyi üç bölümde yükselt, dört yandaki ' +
        'merdivenleri yerleştir, tepeye tapınağı ve çatısını koy, kuzey merdivenin dibine iki yılan başını ekle.',
      facts: [
        'Tüylü yılan tanrısı Kukulkan\'a adanmıştır; şehrin büyük meydanının ortasında yükselir.',
        'Dört merdivenin her birinde 91 basamak vardır; tepe platformuyla birlikte toplam 365 eder — bir güneş yılı.',
        'İlkbahar ve sonbahar ekinokslarında basamakların gölgesi, merdivenden aşağı süzülen bir yılan görüntüsü oluşturur.',
        '1988\'de UNESCO Dünya Mirası Listesi\'ne alındı, 2007\'de Dünyanın Yeni Yedi Harikası\'ndan biri seçildi.',
      ],
      parts: (function () {
        // Teras: hafif eğimli (talud) gövde + üstte girintili dikey panolar (tablero)
        const terrace = (i, localY) => {
          const w = 5.4 - 0.4 * i;
          const c = i % 2 ? '#d3c7aa' : '#cdc0a2';
          const list = [
            { shape: 'cyl', rb: w * K, rt: (w - 0.08) * K, h: 0.3, seg: 4, rotY: 45, at: [0, localY, 0], color: c },
            { shape: 'box', size: [w - 0.04, 0.05, w - 0.04], at: [0, localY + 0.25, 0], color: '#b4a685' },
          ];
          // Her cephede girintili panolar (merdiven bölgesi hariç)
          const n = Math.max(2, Math.floor((w - 1.2) / 0.5));
          for (let k = 0; k < n; k++) {
            const x = -w / 2 + 0.3 + ((w - 0.6) * (k + 0.5)) / n;
            if (Math.abs(x) < 0.62) continue;
            list.push(...onFaces([{ shape: 'box', size: [((w - 0.6) / n) * 0.7, 0.16, 0.03], at: [x, localY + 0.06, w / 2 - 0.02], color: '#a89a7c', detail: true }]));
          }
          return list;
        };
        const steps = [];
        for (let j = 0; j < 12; j++) {
          const d = 1.9 / 12;
          steps.push({ shape: 'box', size: [1.0, (j + 1) * 0.225, d], at: [0, 0, 3.0 - (j + 0.5) * d], color: j % 2 ? '#d9cfb5' : '#cfc4a8' });
          steps.push({ shape: 'box', size: [1.0, 0.02, d * 0.9], at: [0, (j + 1) * 0.225, 3.0 - (j + 0.5) * d], color: '#bfb193', detail: true });
        }
        const serpentHead = () => [
          // Tüylü yılan Kukulkan başı: geniş ağız, dişler, göz ve tüylü yele
          { shape: 'box', size: [0.38, 0.12, 0.5], color: '#cfc4a8' },
          { shape: 'extrude', pts: [[-0.2, 0], [0.2, 0], [0.2, 0.24], [0.12, 0.3], [-0.12, 0.3], [-0.2, 0.24]], d: 0.5, at: [0, 0.08, 0], color: '#cfc4a8' },
          { shape: 'box', size: [0.36, 0.05, 0.3], at: [0, 0.1, 0.12], color: '#7a3b2a' }, // açık ağız
          ...[-0.12, -0.04, 0.04, 0.12].map((x) => ({ shape: 'cone', r: 0.022, h: 0.06, seg: 4, rotX: 180, at: [x, 0.2, 0.26], color: '#f2ead6', detail: true })),
          ...[-0.13, 0.13].map((x) => ({ shape: 'sphere', r: 0.04, at: [x, 0.3, 0.16], color: '#2a241c' })),
          ...[-0.15, 0, 0.15].map((x) => ({ shape: 'cone', r: 0.05, h: 0.14, seg: 5, rotX: -30, at: [x, 0.34, -0.12], color: '#bfb193' })),
          { shape: 'box', size: [0.4, 0.04, 0.54], at: [0, 0.38, 0], color: '#b4a685' },
        ];
        return {
          tier1: [...terrace(0, 0), ...terrace(1, 0.3), ...terrace(2, 0.6)],
          tier2: [...terrace(3, 0), ...terrace(4, 0.3), ...terrace(5, 0.6)],
          tier3: [...terrace(6, 0), ...terrace(7, 0.3), ...terrace(8, 0.6)],
          stairs: [
            ...steps,
            { shape: 'box', size: [0.14, 0.14, 3.3], rotX: 54.9, at: [0.57, 1.3, 2.08], color: '#bfb193' },
            { shape: 'box', size: [0.14, 0.14, 3.3], rotX: 54.9, at: [-0.57, 1.3, 2.08], color: '#bfb193' },
            // Yılan gövdesi: korkuluk boyunca dalgalı pullu şerit (ekinoksta gölgeyle canlanır)
            ...Array.from({ length: 10 }, (_, k) => k / 10).flatMap((t) => [-0.57, 0.57].map((x) => ({ shape: 'box', size: [0.15, 0.03, 0.18], rotX: 54.9, at: [x, 0.25 + t * 2.1, 2.85 - t * 1.5], color: '#a89a7c', detail: true }))),
          ],
          temple: [
            { shape: 'box', size: [1.5, 0.9, 1.5], color: '#c9bb9b' },
            // Ana kapı: iki yılan sütunuyla üçe bölünmüş giriş
            ...[-0.45, 0, 0.45].map((x) => ({ shape: 'box', size: [0.24, 0.58, 0.04], at: [x, 0, 0.76], color: '#3a3228' })),
            ...[-0.225, 0.225].map((x) => ({ shape: 'cyl', rt: 0.06, rb: 0.07, h: 0.58, seg: 10, at: [x, 0, 0.78], color: '#d6caac' })),
            ...onFaces([{ shape: 'box', size: [0.28, 0.58, 0.04], at: [0, 0, 0.76], color: '#3a3228' }]).slice(1),
            // Saçak ve taş mozaik friz
            { shape: 'box', size: [1.56, 0.08, 1.56], at: [0, 0.58, 0], color: '#b4a685' },
            ...onFaces(Array.from({ length: 7 }, (_, k) => ({ shape: 'box', size: [0.1, 0.1, 0.03], at: [-0.6 + k * 0.2, 0.7, 0.77], rotZ: 45, color: '#a89a7c', detail: true }))),
            { shape: 'box', size: [1.54, 0.06, 1.54], at: [0, 0.84, 0], color: '#b4a685' },
          ],
          templeRoof: [
            { shape: 'box', size: [1.62, 0.12, 1.62], color: '#bfb193' },
            // Çatı süsleri (mazgal benzeri taş dizisi)
            ...[-0.66, -0.33, 0, 0.33, 0.66].flatMap((t) => [[t, 0.74], [t, -0.74], [0.74, t], [-0.74, t]].map(([x, z]) => ({ shape: 'extrude', pts: [[-0.06, 0], [0.06, 0], [0.06, 0.1], [0.02, 0.18], [-0.02, 0.18], [-0.06, 0.1]], d: 0.1, at: [x, 0.12, z], rotY: Math.abs(z) > 0.7 ? 0 : 90, color: '#cfc4a8' }))),
          ],
          serpent: serpentHead(),
        };
      })(),
      structure: [
        { part: 'tier1', pos: [0, 0, 0], ry: 0 },
        { part: 'tier2', pos: [0, 0.9, 0], ry: 0 },
        { part: 'tier3', pos: [0, 1.8, 0], ry: 0 },
        { part: 'stairs', pos: [0, 0, 0], ry: 0 },
        { part: 'stairs', pos: [0, 0, 0], ry: 1 },
        { part: 'stairs', pos: [0, 0, 0], ry: 2 },
        { part: 'stairs', pos: [0, 0, 0], ry: 3 },
        { part: 'temple', pos: [0, 2.7, 0], ry: 0 },
        { part: 'templeRoof', pos: [0, 3.6, 0], ry: 0 },
        { part: 'serpent', pos: [-0.5, 0, 3.15], ry: 0 },
        { part: 'serpent', pos: [0.5, 0, 3.15], ry: 0 },
      ],
    },
  );
})();
