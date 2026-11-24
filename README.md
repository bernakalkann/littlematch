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
- [ ] Manuel mobil/masaüstü görsel QA
- [x] CI kalite kontrolünün ilk başarılı koşusu

### Sonraki aşamalar
- [ ] Supabase entegrasyonu ve anonim oturumlar
- [ ] Test ve sonuç kayıtları
- [ ] Davet bağlantıları ve iki kişilik karşılaştırma
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

Ardından tarayıcıdan Next.js'in gösterdiği yerel adresi aç.

Kalite kontrolleri:

```bash
npm run lint
npm run typecheck
npm run build
```

Aynı kontroller `.github/workflows/ci.yml` üzerinden GitHub Actions'ta da çalışacak şekilde yapılandırılmıştır.

## Mimari

- `app/`: Next.js App Router, global görsel stiller ve metadata.
- `components/`: ana sahne, oyun akışı, karakter illüstrasyonları ve sonuç ekranı.
- `data/questions.ts`: 12 hikâyeleştirilmiş soru ve cevap ağırlıkları.
- `data/characters.ts`: 8 karakterin açıklamaları ve hedef ilişki profilleri.
- `lib/scoring.ts`: cevapları 7 boyuta normalize eden ve en yakın karakter profilini seçen deterministik algoritma.
- `data/copy.ts`: temel TR/EN arayüz metinleri.

Test soruları, karakter tanımları ve puanlama sistemi arayüz bileşenlerinden ayrı tutulur.

## Karakter eşleştirmesi

Her cevap; duygusal derinlik, iletişim, romantik yaklaşım, güven ve bağlılık, kişisel alan, yenilik/macera ve gelecek odağı boyutlarına puan ekler.

Puanlar soru seti içindeki mümkün maksimum değere göre 0–100 aralığına normalize edilir. Kullanıcının profil vektörü ile sekiz karakterin hedef profilleri arasındaki uzaklık hesaplanır; en yakın profil sonuç olarak seçilir. Bu nedenle sonuç rastgele değildir ve aynı cevaplar her zaman aynı karakteri üretir.

Bu sonuç eğlence amaçlıdır; psikolojik değerlendirme, ilişki teşhisi veya ilişki başarısı tahmini olarak sunulmaz.

## Tasarım ilkesi

Referans görsel doğrudan statik arka plan olarak kullanılmaz. Aynı sıcak, organik ve nostaljik atmosfer; gerçek arayüz bileşenleri, katmanlı CSS sahneleri, özgün SVG karakterler ve küçük hareketlerle yeniden oluşturulur.

Sıradan SaaS/dashboard görünümü, aşırı kart kullanımı, neon/gradient ağırlığı, glassmorphism ve klasik dating-app kalıplarından kaçınılır.

## Henüz gerçek olmayan özellikler

Supabase, davet bağlantıları, iki kişilik güvenli karşılaştırma, anonim eşleşme ve sohbet **henüz bağlanmadı**. Arayüz bunları çalışıyormuş gibi sahte veriyle göstermiyor. Bu özellikler Aşama 2–4 kapsamında gerçek backend ve erişim politikalarıyla eklenecek.
