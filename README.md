# LittleMatch

**Küçük seçimler, beklenmedik karşılaşmalar.**

LittleMatch; klasik bir dating uygulaması veya sıradan bir kişilik testi değil, romantik karakter keşfi, iki kişilik uyum deneyimi ve sonraki aşamalarda eklenecek anonim eşleşme/sohbet özelliklerini tek bir cozy indie-game dünyasında birleştiren interaktif bir web uygulamasıdır.

## Geliştirme durumu

### Aşama 1 — Görsel kimlik ve temel oyun
- [x] Next.js + TypeScript proje iskeleti
- [x] Responsive, illüstratif ana sayfa
- [x] 12 soruluk hikâyeleştirilmiş test akışı
- [x] 7 boyutlu deterministik karakter puanlama sistemi
- [x] 8 özgün LittleMatch karakter sonucu
- [x] Türkçe / İngilizce temel dil desteği
- [x] İlerleme göstergesi, geri dönüş ve cihazda kaldığı yerden devam
- [x] Sonuç ekranında karakter profili ve ilişki haritası
- [x] Reduced-motion desteği ve mobil breakpoint'ler
- [x] CI: lint + TypeScript + production build
- [ ] Manuel mobil / masaüstü görsel QA

### Aşama 2 — Supabase ve iki kişilik uyum
Veritabanı şeması LittleMatch'e özel Supabase projesinde kurulu. Davet akışını kullanmak için anonim giriş ve çalışma ortamı değişkenlerinin yapılandırılması gerekiyor.

- [x] Supabase browser istemcisi ve environment değişkeni yapısı
- [x] Anonim kullanıcı oturumu kodu
- [x] Test oturumu / cevap / karakter sonucu kayıt servisi
- [x] RLS içeren LittleMatch SQL şeması
- [x] Davet kodunun düz metin yerine SHA-256 özetiyle saklanacağı güvenli tasarım
- [x] Davet oluşturma, claim etme ve tamamlama API rotaları
- [x] İki kişilik deterministik karşılaştırma algoritması
- [x] İki kişilik uyum sonucu ekranı
- [x] Davet linki ile uçtan uca birlikte oynama istemci akışı
- [x] SQL şemasını LittleMatch Supabase projesine uygulama
- [ ] Supabase Anonymous Sign-Ins özelliğini etkinleştirme
- [ ] Publishable / secret key'leri çalışma ortamına bağlama
- [x] RLS ve güvenlik advisor kontrolü
- [ ] Gerçek iki tarayıcı / iki anonim kullanıcı ile E2E test

### Sonraki aşamalar
- [ ] Paylaşılabilir görsel sonuç kartları
- [ ] 18+ anonim eşleşme ve karşılıklı tercih algoritması
- [ ] Gerçek zamanlı anonim sohbet
- [ ] Engelleme, şikâyet, spam ve rate limiting
- [ ] Güvenlik, performans ve yayınlama hazırlığı

## Yerelde çalıştırma

Node.js 24 önerilir.

```bash
npm install
npm run dev
```

Supabase olmadan Aşama 1 tamamen yerel çalışır. Supabase özellikleri için önce `.env.example` dosyasını temel alarak yerel `.env.local` oluşturulmalıdır.

Kalite kontrolleri:

```bash
npm run lint
npm run typecheck
npm run build
```

Aynı kontroller `.github/workflows/ci.yml` üzerinden GitHub Actions'ta da çalışır.

## Supabase kurulumu

LittleMatch için **ayrı Supabase projesi** kullanılmalıdır. fixCampus veritabanı ile paylaşılmamalıdır.

1. Supabase projesinde **Anonymous Sign-Ins** etkinleştirilir.
2. `database/littlematch-schema.sql` yalnızca LittleMatch veritabanına uygulanır.
3. Security advisor çalıştırılır ve RLS uyarıları kontrol edilir.
4. Proje URL'si ve publishable key istemci ortam değişkenlerine eklenir.
5. Secret key yalnızca sunucu tarafında `SUPABASE_SECRET_KEY` olarak tutulur; hiçbir `NEXT_PUBLIC_` değişkenine yazılmaz.
6. İki ayrı anonim kullanıcıyla test → davet → ikinci test → karşılaştırma akışı doğrulanır.

Gerekli değişkenler:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Gerçek anahtarlar repoya commit edilmez.

## Mimari

- `app/`: Next.js App Router, global stiller, metadata ve sunucu API rotaları.
- `components/`: ana sahne, test akışı, karakter illüstrasyonları, bireysel ve iki kişilik sonuç ekranları.
- `data/questions.ts`: 12 hikâyeleştirilmiş soru ve cevap ağırlıkları.
- `data/characters.ts`: 8 karakterin açıklamaları ve hedef ilişki profilleri.
- `lib/scoring.ts`: cevapları 7 boyuta normalize eden ve en yakın karakter profilini seçen deterministik algoritma.
- `lib/comparison.ts`: iki kişinin boyut ve cevap benzerliğini hesaplayan karşılaştırma algoritması.
- `lib/supabase/`: istemci, anonim auth ve test kayıt servisleri.
- `lib/invitations/`: güvenli davet kodu ve istemci işlemleri.
- `database/littlematch-schema.sql`: Supabase tablo, indeks, grant ve RLS politikaları.
- `data/copy.ts`: temel TR/EN arayüz metinleri.

Test soruları, karakter tanımları ve puanlama sistemi arayüz bileşenlerinden ayrı tutulur.

## Karakter eşleştirmesi

Her cevap; duygusal derinlik, iletişim, romantik yaklaşım, güven ve bağlılık, kişisel alan, yenilik/macera ve gelecek odağı boyutlarına puan ekler.

Puanlar soru seti içindeki mümkün maksimum değere göre 0–100 aralığına normalize edilir. Kullanıcının profil vektörü ile sekiz karakterin hedef profilleri arasındaki uzaklık hesaplanır; en yakın profil sonuç olarak seçilir. Aynı cevaplar aynı karakteri üretir.

İki kişilik sonuçta boyut benzerliği ile aynı cevapların oranı birlikte değerlendirilir. Bu yüzdeler yalnızca LittleMatch cevaplarının benzerliğini gösterir; ilişki başarısı veya bilimsel uyum tahmini değildir.

## Tasarım ilkesi

Referans görsel doğrudan statik arka plan olarak kullanılmaz. Aynı sıcak, organik ve nostaljik atmosfer; gerçek arayüz bileşenleri, katmanlı CSS sahneleri, özgün SVG karakterler ve küçük hareketlerle yeniden oluşturulur.

Sıradan SaaS/dashboard görünümü, aşırı kart kullanımı, neon/gradient ağırlığı, glassmorphism ve klasik dating-app kalıplarından kaçınılır.

## Şu anki blokaj

LittleMatch Supabase projesi oluşturuldu ancak bu sohbet oturumundaki Supabase bağlantısı yeni organizasyonu henüz araç erişimine yansıtmıyor. Bu nedenle SQL şeması veritabanına uygulanmadı ve gerçek backend testi yapılmadı. Kod bu bağlantı açıldığında devam edecek şekilde hazırdır.
