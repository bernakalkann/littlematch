# LittleMatch

**Küçük seçimler, beklenmedik karşılaşmalar.**

### Sen nasıl bir partnersin?

Bir tartışmadan sonra hemen konuşmak mı istersin, biraz zamana mı ihtiyacın olur? Peki sevdiğin birine sevgini en çok nasıl belli edersin?

LittleMatch’in sıcak, nostaljik dünyasında **12 küçük seçim yap**, sekiz romantik karakterden hangisine benzediğini keşfet. Sonra bir arkadaşını, sevgilini ya da yeni tanıştığın birini oyuna çağır. Bakalım hangi soruda aynı cevabı vereceksiniz?

1. **Testini çöz.** Seçimlerinden çıkan romantik karakterini ve ilişki haritanı gör.
2. **Birini davet et.** Aynı cihazda sırayla oynayın veya davet bağlantısını gönderip ayrı ayrı cevaplayın.
3. **Uyumunuzu açın.** İkiniz de bitirince aynı düşündüğünüz ve farklı seçimler yaptığınız yerleri keşfedin.

**LittleMatch’e e-postanla kaydol**, takma adını koy ve hazır bir avatar seç veya görünümünü düzenle. Testini bitirince sonuç kartını PNG olarak indirebilir ya da **Keşfet**’te paylaşabilirsin. **Uyumunu keşfet** kayıtlı oyuncuların takma adlarını ve avatarlarını gösterir. Arkadaş ekleme, 18+ anonim eşleşme ve karşılıklı istekle sohbet de yol haritasında.

[**LittleMatch’i yerelde dene ↓**](#yerelde-oyna)

## Yerelde oyna

Node.js 24 önerilir.

```bash
npm install
npm run dev
```

Oyunu [localhost:3000](http://localhost:3000) adresinde aç. Supabase olmadan takma ad, avatar seçimi, kişilik testi ve aynı cihazda iki kişilik oyun yerel olarak denenebilir.

## Teknolojiler ve kod

**Next.js (App Router) · React · TypeScript · CSS / SVG · Supabase · GitHub Actions**

| Bakmak istediğin yer | Dosya |
| --- | --- |
| Sorular ve karakterler | [questions.ts](data/questions.ts) · [characters.ts](data/characters.ts) |
| Karakter puanlaması ve iki kişilik karşılaştırma | [scoring.ts](lib/scoring.ts) · [comparison.ts](lib/comparison.ts) |
| Arayüz ve API rotaları | [components/](components/) · [app/](app/) |
| Veritabanı şeması ve RLS politikaları | [littlematch-schema.sql](database/littlematch-schema.sql) |

Test, cevaplarını iletişim, bağlılık ve kişisel alan gibi yedi boyutta puanlar. Uyum haritası oyundaki cevaplarınızın ve profil puanlarınızın benzerliğini gösterir.

<details>
<summary>Çevrimiçi oyun için Supabase kurulumu</summary>

1. LittleMatch’e özel bir Supabase projesinde [SQL şemasını](database/littlematch-schema.sql), ardından [oyuncu profili migration’larını](database/migrations/) uygula. Security Advisor üzerinden RLS durumunu kontrol et.
2. Supabase Auth’ta **Email** sağlayıcısını etkinleştir. Web adresini ve `?recover=1` dönüş adresini Auth URL Configuration altında izinli adreslere ekle. Davetle kayıt için `invite` sorgu parametresini içeren dönüş adreslerini de yapılandır.
3. [`.env.example`](.env.example) dosyasını temel alarak `.env.local` oluştur. Proje URL’sini, publishable key’i ve sunucu anahtarını ekle.
4. Doğrulama ve şifre sıfırlama e-postalarını, profil görünürlüğünü ve davet akışını iki ayrı hesapla doğrula.


```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` yalnızca sunucu ortamında tutulur. Gerçek anahtarları repoya ekleme. Davet kodları veritabanında SHA-256 özetiyle saklanır.

</details>

<details>
<summary>Kalite kontrolleri</summary>

[GitHub Actions](.github/workflows/ci.yml) ile aynı kontrolleri yerelde çalıştırabilirsin.

```bash
npm run lint
npm run typecheck
npm run build
```

</details>

## Geliştirme durumu

- **Hazır:** E-posta ile kayıt ve giriş ekranları, takma ad, 10 avatar, oyuncu dizini, Türkçe ve İngilizce test, karakter sonuçları ve aynı cihazda iki kişilik oyun.
- **Doğrulanacak:** Mobil ve masaüstü görsel kontrolü, canlı e-posta doğrulama ve sıfırlama, iki ayrı oturumla profil ve davet testi.
- **Planlanan:** Arkadaş ekleme, 18+ eşleşme ve sohbet, engelleme ve şikâyet.
