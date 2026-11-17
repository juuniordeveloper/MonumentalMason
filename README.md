# Anıt Ustası — Tarihi Yapı Bulmacası (Web Prototip)

Dağınık 3B parçaları doğru yuvalarına, doğru sırayla yerleştirerek tarihi yapıları yeniden kurduğun bir bulmaca oyunu.

## Çalıştırma
- VS Code'da **Live Server** ile `index.html`'i aç **veya** dosyaya çift tıkla.
- İnternet bağlantısı gerekir (Three.js CDN'den yüklenir).

## Kurallar
1. **Tıkla:** kenardaki bir parçaya tıkla, sonra yarı saydam yuvasına tıkla.
2. **veya Sürükle:** parçayı tutup yuvasının üstüne bırak.
3. Parça doğru yuvaya gelince kendiliğinden doğru yöne döner ve oturur. Yerleşmesi için:
   - doğru parça tipi olmalı,
   - altındaki parçalar önceden yerleşmiş olmalı (yerçekimi).
4. Hata ve ipucu (H) sayısına göre 1–3 yıldız. R = bölümü baştan başlat.

Kamera: sürükle = döndür, tekerlek = yakınlaş, sağ tık = kaydır.

## Özellikler
- **Bilgi kartı koleksiyonu:** her parça ilk kez yerleşince o parçayla ilgili bir bilgi kartı açılır; hepsi menüdeki *Koleksiyon* sekmesinde toplanır.
- **Bitiş sinematiği:** eser tamamlanınca sinema şeritleri, kamera turu ve altyazı gibi akan tarihçe (*Geç* ile atlanabilir).
- **Gece / gündüz:** ☀️ düğmesi gündüz → gün batımı → gece. Gece pencereler, sokak lambaları, Petra'nın mumları ve Kız Kulesi'nin feneri yanar, yıldızlar çıkar.
- **Zaman çizelgesi:** eserler yapım yılına göre (MÖ 9600 Göbeklitepe → 1632 Tac Mahal).
- **Dünya haritası:** *Bölümler* sekmesinde *Kartlar / Dünya Haritası* görünümü. Gerçek ülke sınırları (Natural Earth verisi, CDN'den; bağlantı yoksa sade harita), eser bulunan ülkeler vurgulu, okyanus ve deniz adları. Pinin üstüne gelince resimli bölüm kartı açılır (Oyna / ⏱ Meydan Okuma); bitirdiğin eser pinin üstünde belirir. Yakın pinler sayılı küme olur, kümeye tıklayınca o bölgeye yakınlaşır. Tekerlek veya iki parmak = yakınlaş, sürükle = gezin.
- **Mobil:** dar ekranda iki satırlı HUD, iki sütunlu kartlar, kayan sekmeler, çentikli ekranlar için güvenli boşluklar; dikey ekranda kamera her şeyi sığdıracak kadar geri çekilir. Parmağa yakın parça yakalanır, sürüklenen parça parmağın altında kalmaz, titreşimli geri bildirim vardır. Telefonlarda grafik ayarları hafifletilir.
- **Meydan Okuma:** ayrı sekme; her bölüm için süre ve hamle sınırı. Süre dolarsa veya hamle hakkı biterse kaybedersin.
- **Seri ve puan:** her doğru yerleştirme 100 puan; arka arkaya doğru yerleştirmeler çarpanı ×3'e kadar çıkarır, yanlış hamle seriyi bozar.
- **Usta modu:** yuvalar görünmez; sağ üstte yalnızca tamamlanmış yapının resmi durur.
- **Ortam sesleri:** her eserin çevresine göre deniz ve martılar, rüzgâr, kuşlar, şehir, orman veya nehir sesi (🔊 ile aç/kapat).

## Bölümler
Tüm bölümler açıktır; istediğin yapıyla başlayabilirsin.

1. Stonehenge · 2. Keops Piramidi · 3. Parthenon · 4. Kolezyum · 5. Bozdoğan Su Kemeri ·
6. Diyarbakır Surları ve Hevsel Bahçeleri · 7. Diyarbakır Ulu Camii · 8. Chichén Itzá ·
9. Notre-Dame Katedrali · 10. Galata Kulesi · 11. Aziz Vasil Katedrali · 12. Selimiye Camii ·
13. Kız Kulesi · 14. Tac Mahal · 15. Ayasofya-i Kebir Camii

**Zor seviye:** 16. Celsus Kütüphanesi · 17. Göbeklitepe · 18. Petra — El Hazne · 19. Machu Picchu · 20. Borobudur

**Yedi kıtanın simgeleri (her kıtadan 3 eser):**
- Avrupa: 21. Eyfel Kulesi · 22. Big Ben ve Westminster · 23. Neuschwanstein Şatosu
- Asya: 24. Çin Seddi · 25. Angkor Wat · 26. Himeji Kalesi
- Afrika: 27. Ebu Simbel Tapınağı · 28. Djenné Büyük Camii · 29. Lalibela — Aziz George Kilisesi
- Kuzey Amerika: 30. Özgürlük Heykeli · 31. Golden Gate Köprüsü · 32. Empire State Binası
- Güney Amerika: 33. Kurtarıcı İsa Heykeli · 34. Las Lajas Katedrali · 35. Tiwanaku — Güneş Kapısı
- Okyanusya: 36. Sidney Opera Binası · 37. Paskalya Adası Moaileri · 38. Nan Madol
- Antarktika: 39. Port Lockroy · 40. Scott'ın Terra Nova Kulübesi · 41. Amundsen-Scott Güney Kutbu İstasyonu
  (Antarktika'da kalıcı anıt olmadığından en bilinen keşif kulübeleri ve araştırma istasyonu seçildi.)

**Sınıflandırma:** *Bölümler* sekmesinde kıta çipleri (Tüm kıtalar, Avrupa, Asya, …, Antarktika) ve zorluk çipleri (Tümü / Kolay / Orta / Zor) birlikte çalışır. Kart görünümünde eserler kıta başlıkları altında gruplanır. Harita görünümünde kıta seçince harita o kıtaya yakınlaşır, diğer pinler soluklaşır ve haritanın altında o kıtanın eserleri listelenir; listeden bir esere tıklayınca harita onun pinine gider. Seçimler hatırlanır.

Zorluk rozeti: bölümde `difficulty` yazmıyorsa 12 parçaya kadar *Kolay*, üstü *Orta*. Zor bölümlerde parçalar daha çok ve birbirine benzer; hangi yuvanın hazır olduğu gösterilmez.

Her bölümde eserin gerçek çevresi vardır (komşu tarihi yapılar, şehir dokusu, doğa, su).
Uzaktaki yapılar sisin içinde kaybolur. Bölüm sırası `js/levels/order.js` dosyasındadır.

## Modeller
Her eser, gerçek yapıya olabildiğince yakın olacak şekilde ayrıntılı modellendi: sivri/yuvarlak kemerli pencereler,
yivli sütunlar ve başlıklar, kaburgalı kubbeler, mukarnaslı şerefeler, gül pencereler, kafes (demir örgü) gövdeler,
heykel figürleri ve kabartmalar. Parça bölümlemesi (hangi parçanın nereye oturduğu) değişmedi.

Şekil türleri (`js/game/geometry.js`): `box`, `rock`, `cyl` (`open`), `cone`, `sphere`, `hemi`, `half`, `shell`,
`lathe` (`phi0`, `phi` ile dilim), `torus`, `tri`, `arch`, `extrude` (serbest profil, `holes`, `axis: 'y'`),
`tube` (noktalardan eğri boru), `bar` (iki nokta arası ince çubuk), `hip` (kırma çatı). Ortak seçenekler:
`at`, `rotX/rotY/rotZ` (sıra YXZ: önce eğim, en son yön), `scale`, `color`, `glow`, `opacity`, `metal`, `flat`
(köşeli gölgeleme), `detail` (küçük süs). Aynı renkteki alt şekiller tek geometride birleştirilir ve parça
geometrileri bölüm boyunca önbellekte paylaşılır.

Yapı girdisinde `after: ['parçaAdı']` ile bir parçanın hangi parçalardan sonra takılabileceği açıkça
belirtilebilir (asma köprü tabliyesi, heykel kolları gibi otomatik algılanamayan durumlar için).

Yardımcılar (`js/levels/helpers.js`): `win`, `winRow`, `ringWins`, `openingPts`, `column`, `cornice`, `stairs`,
`balustrade`, `crenels`, `minaret`, `alem`, `ribbedDome`, `stripedOnion`, `archPart`, `arcade`, `onion`.

## Dosyalar
- `index.html`, `style.css` — arayüz
- `js/levels/` — bölüm verileri
  - `helpers.js` ortak şekil üreticileri · `ancient.js` · `istanbul.js` · `anatolia.js` · `world.js` · `cathedrals.js` · `hard-a.js` · `hard-b.js` (zor bölümler) · `continents-a/b/c.js` (kıta eserleri) · `order.js` (sıra ve zorluk) · `meta.js` (kıtalar, yıl, harita konumu, ortam sesi) · `part-info.js` + `part-info-continents.js` (bilgi kartları)
- `js/env/` — çevreler
  - `kit-core.js` toplu çizim (InstancedMesh), yerleşim, zemin, su
  - `kit-nature.js` ağaç, çiçek, çalı, kaya, tepe, martı
  - `kit-city.js` ev, cami, kilise, sur, yol, araba, tramvay, insan, tekne
  - `env-common.js` ortak yardımcılar · `env-ancient.js` · `env-istanbul.js` · `env-anatolia.js` · `env-world.js` · `env-hard.js` · `env-continents-a.js` (Avrupa, Asya, Afrika) · `env-continents-b.js` (Amerika, Okyanusya, Antarktika)
- `css/features.css` — menü sekmeleri, harita, zaman çizelgesi, koleksiyon, sinematik stilleri
- `css/mobile.css` — telefon ve tablet düzeni
- `js/game/` — oyun motoru
  - `scene.js` kamera, ışık, gökyüzü, sis · `geometry.js` parça şekilleri · `level.js` bölüm kurulumu
  - `interaction.js` tıkla / sürükle-bırak · `ui.js` HUD, tanıtım ve kazanma · `menu.js` sekmeli menü · `worldmap.js` + `worldmap-geo.js` + `world-shapes.js` harita · `device.js` dokunmatik algılama ve titreşim
  - `modes.js` Meydan Okuma, seri ve Usta modu · `collection.js` bilgi kartları · `cinematic.js` bitiş sinematiği · `daynight.js` gece/gündüz
  - `thumbnails.js` eser küçük resimleri · `ambient.js` ortam sesleri · `storage.js` kayıt · `effects.js` · `audio.js` · `main.js` ana döngü
