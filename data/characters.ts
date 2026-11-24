import type { CharacterProfile } from "@/lib/types";

export const characters: CharacterProfile[] = [
  {
    id: "fox",
    animal: { tr: "Tilki", en: "Fox" },
    name: { tr: "Yol Kıvılcımı", en: "Trail Spark" },
    tagline: { tr: "Yakınlık güzel; merak da öyle.", en: "Closeness is lovely. So is curiosity." },
    description: {
      tr: "Bağ kurarken kendi alanını da koruyan, rutine küçük sürprizler eklemeyi seven birisin. İlişkide özgürlükle merakı aynı masada tutmak sana iyi geliyor.",
      en: "You build connection without giving up your own space, and you like adding small surprises to routine. Freedom and curiosity belong at the same table for you.",
    },
    strengths: [
      { tr: "Uyum sağlamak", en: "Adapting" },
      { tr: "Yeni şeylere açık olmak", en: "Trying new things" },
      { tr: "Alan tanımak", en: "Giving space" },
    ],
    values: [
      { tr: "Özgürlük", en: "Freedom" },
      { tr: "Merak", en: "Curiosity" },
      { tr: "Doğallık", en: "Ease" },
    ],
    communication: {
      tr: "Baskısız, açık ve akışta kalan konuşmalar sana iyi gelir.",
      en: "You thrive in open, low-pressure conversations that can breathe.",
    },
    habitat: { tr: "Gün batımında patikaların ayrıldığı küçük bir tepe.", en: "A small hill where trails split at sunset." },
    target: { depth: 56, communication: 58, romance: 52, trust: 58, space: 86, adventure: 92, future: 42 },
  },
  {
    id: "cat",
    animal: { tr: "Kedi", en: "Cat" },
    name: { tr: "Sessiz Pusula", en: "Quiet Compass" },
    tagline: { tr: "Az kişiye, derinden.", en: "Few people, deep bonds." },
    description: {
      tr: "Hemen açılmak zorunda hissetmiyorsun; güven oluştuğunda bağın çok derinleşebiliyor. Yakınlık kadar kendi ritmini korumak da önemli.",
      en: "You do not rush into opening up, but once trust grows, your bonds can become very deep. Keeping your own rhythm matters as much as closeness.",
    },
    strengths: [
      { tr: "Derin bağ kurmak", en: "Building deep bonds" },
      { tr: "Sınırlarını bilmek", en: "Knowing your boundaries" },
      { tr: "İnce ayrıntıları görmek", en: "Noticing subtle details" },
    ],
    values: [
      { tr: "Güven", en: "Trust" },
      { tr: "Alan", en: "Space" },
      { tr: "Samimiyet", en: "Sincerity" },
    ],
    communication: {
      tr: "Hazır olduğunda netleşen, sakin ve zorlamayan iletişimi seversin.",
      en: "You prefer calm communication that becomes clear when you are ready, without pressure.",
    },
    habitat: { tr: "Penceresi yağmura bakan, kitaplarla dolu sıcak bir oda.", en: "A warm room full of books with a rain-facing window." },
    target: { depth: 86, communication: 52, romance: 62, trust: 78, space: 88, adventure: 40, future: 54 },
  },
  {
    id: "dog",
    animal: { tr: "Köpek", en: "Dog" },
    name: { tr: "Açık Kalp", en: "Open Heart" },
    tagline: { tr: "Seviyorsam, belli olsun.", en: "If I care, I want it to show." },
    description: {
      tr: "Sevgini saklamaktan çok göstermeyi seviyorsun. Tutarlılık, sıcaklık ve karşılıklı emek senin için ilişkinin en rahatlatıcı tarafları.",
      en: "You would rather show affection than hide it. Consistency, warmth and mutual effort are what make a relationship feel safe to you.",
    },
    strengths: [
      { tr: "Sadakat", en: "Loyalty" },
      { tr: "Duyguyu göstermek", en: "Showing affection" },
      { tr: "Yanında olmak", en: "Showing up" },
    ],
    values: [
      { tr: "Bağlılık", en: "Commitment" },
      { tr: "Açıklık", en: "Openness" },
      { tr: "Birliktelik", en: "Togetherness" },
    ],
    communication: {
      tr: "Net, sıcak ve düzenli iletişim seni güvende hissettirir.",
      en: "Clear, warm and steady communication makes you feel secure.",
    },
    habitat: { tr: "Işıkları yanan, kapısı hep misafire açık küçük bir ev.", en: "A small lit-up home with a door that is always welcoming." },
    target: { depth: 70, communication: 90, romance: 78, trust: 94, space: 32, adventure: 52, future: 72 },
  },
  {
    id: "rabbit",
    animal: { tr: "Tavşan", en: "Rabbit" },
    name: { tr: "Yumuşak Işık", en: "Soft Light" },
    tagline: { tr: "Küçük şeyler, büyük hisler.", en: "Small things, big feelings." },
    description: {
      tr: "Ayrıntıları, düşünülmüş jestleri ve duygusal sıcaklığı kolay fark ediyorsun. Sertlikten çok incelikle kurulan bağlar sana daha doğal geliyor.",
      en: "You easily notice details, thoughtful gestures and emotional warmth. Bonds built with gentleness feel more natural to you than harshness.",
    },
    strengths: [
      { tr: "Empati", en: "Empathy" },
      { tr: "İncelik", en: "Thoughtfulness" },
      { tr: "Romantik yaratıcılık", en: "Romantic creativity" },
    ],
    values: [
      { tr: "Şefkat", en: "Tenderness" },
      { tr: "Hatırlanmak", en: "Being remembered" },
      { tr: "Duygusal yakınlık", en: "Emotional closeness" },
    ],
    communication: {
      tr: "Yumuşak, düşünceli ve duyguya alan açan konuşmaları seversin.",
      en: "You like gentle, thoughtful conversations that make room for emotion.",
    },
    habitat: { tr: "Kır çiçekleri ve minik lambalarla çevrili bir bahçe.", en: "A garden surrounded by wildflowers and tiny lights." },
    target: { depth: 84, communication: 72, romance: 96, trust: 76, space: 42, adventure: 48, future: 64 },
  },
  {
    id: "owl",
    animal: { tr: "Baykuş", en: "Owl" },
    name: { tr: "Gece Gözlemcisi", en: "Night Observer" },
    tagline: { tr: "Önce anlarım, sonra anlatırım.", en: "I understand first, then I speak." },
    description: {
      tr: "Duyguların altındaki anlamı çözmeyi seviyorsun. Hızdan çok derinlik, gürültüden çok dürüst ve sakin konuşmalar sana yakın.",
      en: "You like understanding what sits beneath a feeling. Depth matters more than speed, and honest calm matters more than noise.",
    },
    strengths: [
      { tr: "Dinlemek", en: "Listening" },
      { tr: "Düşünerek konuşmak", en: "Speaking thoughtfully" },
      { tr: "Büyük resmi görmek", en: "Seeing the bigger picture" },
    ],
    values: [
      { tr: "Derinlik", en: "Depth" },
      { tr: "Anlam", en: "Meaning" },
      { tr: "Dürüstlük", en: "Honesty" },
    ],
    communication: {
      tr: "Düşünmek için zamanın olduğu, yüzeyde kalmayan konuşmalar seni besler.",
      en: "You thrive in conversations with time to think and room to go beneath the surface.",
    },
    habitat: { tr: "Göle bakan, gece lambası hiç sönmeyen küçük bir kule.", en: "A little tower overlooking the lake, with one lamp always glowing." },
    target: { depth: 98, communication: 70, romance: 54, trust: 78, space: 70, adventure: 34, future: 76 },
  },
  {
    id: "bear",
    animal: { tr: "Ayı", en: "Bear" },
    name: { tr: "Sıcak Sığınak", en: "Warm Harbor" },
    tagline: { tr: "Huzur da bir aşk dili.", en: "Peace can be a love language." },
    description: {
      tr: "İlişkide güvenilirlik ve huzur senin için güçlü bir çekim alanı. Büyük gösterilerden çok, uzun vadede yanında kalacağını hissettiren davranışları önemsiyorsun.",
      en: "Reliability and peace are powerful forms of attraction for you. More than grand gestures, you value actions that say someone will keep showing up.",
    },
    strengths: [
      { tr: "Güven vermek", en: "Creating safety" },
      { tr: "Sabır", en: "Patience" },
      { tr: "Tutarlılık", en: "Consistency" },
    ],
    values: [
      { tr: "Huzur", en: "Peace" },
      { tr: "Güvenilirlik", en: "Reliability" },
      { tr: "Ortak hayat", en: "Shared life" },
    ],
    communication: {
      tr: "Sakin, güvenilir ve sözün davranışla desteklendiği iletişimi seversin.",
      en: "You prefer calm, dependable communication where words are backed by actions.",
    },
    habitat: { tr: "Şömineli, yumuşak koltuklu küçük bir dağ evi.", en: "A tiny mountain cabin with a fireplace and soft chairs." },
    target: { depth: 74, communication: 66, romance: 62, trust: 98, space: 48, adventure: 28, future: 94 },
  },
  {
    id: "otter",
    animal: { tr: "Su Samuru", en: "Otter" },
    name: { tr: "Nehir Kahkahası", en: "River Laugh" },
    tagline: { tr: "Birlikte eğlenmek de bağ kurmaktır.", en: "Having fun together is connection too." },
    description: {
      tr: "Yakınlığı paylaşılan enerji, kahkaha ve spontane anlarla büyütüyorsun. Duygusal bağ senin için ağır olmak zorunda değil; oyun da samimiyetin bir parçası.",
      en: "You grow closeness through shared energy, laughter and spontaneous moments. Emotional connection does not have to feel heavy; play is part of intimacy.",
    },
    strengths: [
      { tr: "Neşe katmak", en: "Bringing joy" },
      { tr: "Spontane olmak", en: "Being spontaneous" },
      { tr: "İnsanları rahatlatmak", en: "Helping people relax" },
    ],
    values: [
      { tr: "Eğlence", en: "Fun" },
      { tr: "Paylaşım", en: "Sharing" },
      { tr: "Canlılık", en: "Energy" },
    ],
    communication: {
      tr: "Doğal, canlı ve gerektiğinde ciddileşebilen iletişim sana iyi gelir.",
      en: "You like communication that is lively and natural but can become serious when needed.",
    },
    habitat: { tr: "Tahta iskelesi olan, su sesi eksik olmayan küçük bir koy.", en: "A little cove with a wooden dock and constant water sounds." },
    target: { depth: 52, communication: 82, romance: 68, trust: 64, space: 58, adventure: 96, future: 38 },
  },
  {
    id: "hedgehog",
    animal: { tr: "Kirpi", en: "Hedgehog" },
    name: { tr: "Gizli Bahçe", en: "Hidden Garden" },
    tagline: { tr: "Güvenince bütün kapılar açılır.", en: "Once I trust, every door opens." },
    description: {
      tr: "İlk anda mesafeli görünsen de güven oluştuğunda oldukça sıcak ve sadıksın. Sınırlarına saygı duyulması, bağın büyümesi için anahtar.",
      en: "You may seem reserved at first, but once trust is there you become warm and loyal. Respect for your boundaries is the key that lets closeness grow.",
    },
    strengths: [
      { tr: "Sınır koymak", en: "Setting boundaries" },
      { tr: "Sadakat", en: "Loyalty" },
      { tr: "Güvenince açılmak", en: "Opening up with trust" },
    ],
    values: [
      { tr: "Saygı", en: "Respect" },
      { tr: "Güven", en: "Trust" },
      { tr: "Özel alan", en: "Privacy" },
    ],
    communication: {
      tr: "Zorlamayan, güven inşa eden ve alanına saygı duyan iletişim seni açar.",
      en: "Communication that builds trust without pressure helps you open up.",
    },
    habitat: { tr: "Çitlerin ardında, yalnızca tanıdıkların bildiği saklı bir bahçe.", en: "A hidden garden behind a hedge, known only to familiar faces." },
    target: { depth: 82, communication: 48, romance: 50, trust: 92, space: 94, adventure: 30, future: 60 },
  },
];
