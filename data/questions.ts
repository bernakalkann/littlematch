import type { Question } from "@/lib/types";

export const questions: Question[] = [
  {
    id: "late-night-thought",
    scene: { tr: "Gece 00:47. Telefonun sessizde.", en: "12:47 AM. Your phone is on silent." },
    prompt: {
      tr: "Sevdiğin biri bir anda aklına geliyor. İçinden ne yapmak geliyor?",
      en: "Someone you care about suddenly crosses your mind. What do you feel like doing?",
    },
    options: [
      {
        id: "send-now",
        label: { tr: "Kısa da olsa hemen yazarım.", en: "I send a short message right away." },
        weights: { communication: 3, romance: 2, depth: 2 },
      },
      {
        id: "save-for-morning",
        label: { tr: "Sabah söylemek için aklımda tutarım.", en: "I keep it in mind and tell them in the morning." },
        weights: { trust: 2, future: 1, space: 2 },
      },
      {
        id: "send-small-thing",
        label: { tr: "Bir şarkı ya da küçük bir şey yollarım.", en: "I send a song or one small thing." },
        weights: { romance: 3, depth: 2, adventure: 1 },
      },
      {
        id: "enjoy-thought",
        label: { tr: "Gülümserim; her duyguyu hemen paylaşmam.", en: "I smile; I do not share every feeling instantly." },
        weights: { space: 3, depth: 2, trust: 1 },
      },
    ],
  },
  {
    id: "unplanned-day",
    scene: { tr: "Cumartesi sabahı. Hiç plan yok.", en: "Saturday morning. No plans at all." },
    prompt: {
      tr: "Birlikte geçirilecek boş bir gün sana en çok nasıl güzel gelir?",
      en: "What would make an empty day together feel best to you?",
    },
    options: [
      {
        id: "wander",
        label: { tr: "Çıkarız, yol nereye götürürse.", en: "We go out and see where the day takes us." },
        weights: { adventure: 3, space: 2, romance: 1 },
      },
      {
        id: "home",
        label: { tr: "Ev, yemek, müzik; acele etmeyelim.", en: "Home, food, music; no need to rush." },
        weights: { trust: 3, depth: 2, romance: 2 },
      },
      {
        id: "tiny-plan",
        label: { tr: "Bir kahve noktası seçip gerisini akışa bırakırım.", en: "I pick one coffee spot and leave the rest open." },
        weights: { adventure: 2, future: 1, communication: 1, space: 2 },
      },
      {
        id: "separate-then-meet",
        label: { tr: "Biraz ayrı takılır, sonra buluşuruz.", en: "We do our own things for a while, then meet." },
        weights: { space: 3, trust: 2, communication: 1 },
      },
    ],
  },
  {
    id: "small-argument",
    scene: { tr: "Küçük bir tartışma oldu.", en: "A small disagreement happens." },
    prompt: {
      tr: "Ortam biraz gerildiğinde sana en doğal gelen ne?",
      en: "When things get tense, what feels most natural to you?",
    },
    options: [
      {
        id: "talk-now",
        label: { tr: "Sakinleşip o anda konuşmak.", en: "Calm down and talk about it then and there." },
        weights: { communication: 3, trust: 2, depth: 2 },
      },
      {
        id: "pause",
        label: { tr: "Biraz alan verip sonra dönmek.", en: "Take some space and come back to it later." },
        weights: { space: 3, communication: 2, trust: 2 },
      },
      {
        id: "soften",
        label: { tr: "Önce havayı yumuşatıp sonra konuşmak.", en: "Soften the mood first, then talk." },
        weights: { romance: 2, communication: 2, trust: 2 },
      },
      {
        id: "write",
        label: { tr: "Düşüncelerimi toparlayıp mesajla anlatmak.", en: "Organize my thoughts and explain them in writing." },
        weights: { depth: 3, communication: 2, space: 1 },
      },
    ],
  },
  {
    id: "surprise",
    scene: { tr: "Hiç beklemediğin bir sürpriz.", en: "A surprise you did not see coming." },
    prompt: {
      tr: "Seni en çok hangisi mutlu eder?",
      en: "Which kind would make you happiest?",
    },
    options: [
      {
        id: "thoughtful",
        label: { tr: "Daha önce söylediğim küçük bir şeyi hatırlaması.", en: "They remember one tiny thing I mentioned before." },
        weights: { depth: 3, trust: 2, romance: 2 },
      },
      {
        id: "experience",
        label: { tr: "Birlikte ilk kez yapacağımız bir şey planlaması.", en: "They plan something we have never done together." },
        weights: { adventure: 3, romance: 2, future: 1 },
      },
      {
        id: "ordinary-care",
        label: { tr: "Zor bir günümde yükümü sessizce hafifletmesi.", en: "They quietly make a hard day easier." },
        weights: { trust: 3, depth: 3, communication: 1 },
      },
      {
        id: "no-big-surprise",
        label: { tr: "Büyük sürprizden çok doğal, küçük jestler.", en: "Natural small gestures rather than big surprises." },
        weights: { space: 2, trust: 2, romance: 1 },
      },
    ],
  },
  {
    id: "time-apart",
    scene: { tr: "Bir süre görüşemeyeceksiniz.", en: "You will not be able to see each other for a while." },
    prompt: {
      tr: "Bağın sürdüğünü sana en çok ne hissettirir?",
      en: "What makes the connection still feel present to you?",
    },
    options: [
      {
        id: "regular-checkin",
        label: { tr: "Düzenli kısa konuşmalar.", en: "Regular short check-ins." },
        weights: { communication: 3, trust: 2, future: 1 },
      },
      {
        id: "long-calls",
        label: { tr: "Daha seyrek ama uzun ve derin konuşmalar.", en: "Less frequent but long, deep conversations." },
        weights: { depth: 3, communication: 2, trust: 2 },
      },
      {
        id: "shared-moments",
        label: { tr: "Günün içinden fotoğrafsız küçük notlar, şarkılar, anlar.", en: "Small notes, songs and moments from the day." },
        weights: { romance: 3, communication: 2, depth: 1 },
      },
      {
        id: "steady-trust",
        label: { tr: "Sürekli konuşmasak da bağın yerinde olduğunu bilmek.", en: "Knowing the bond is fine even without constant contact." },
        weights: { trust: 3, space: 3 },
      },
    ],
  },
  {
    id: "feelings",
    scene: { tr: "İçinde güçlü bir duygu var.", en: "You are feeling something strongly." },
    prompt: {
      tr: "Duygularını göstermenin sana en yakın yolu hangisi?",
      en: "Which way of showing feelings feels most like you?",
    },
    options: [
      {
        id: "say-it",
        label: { tr: "Açıkça söylerim.", en: "I say it openly." },
        weights: { communication: 3, depth: 2, romance: 2 },
      },
      {
        id: "do-it",
        label: { tr: "Davranışlarımla belli ederim.", en: "I show it through what I do." },
        weights: { trust: 3, depth: 2, romance: 1 },
      },
      {
        id: "small-signals",
        label: { tr: "Küçük işaretlerle belli ederim; anlamasını severim.", en: "I show it through small signals and like being understood." },
        weights: { romance: 3, depth: 2, space: 1 },
      },
      {
        id: "time-needed",
        label: { tr: "Önce kendim anlamak için zamana ihtiyaç duyarım.", en: "I need time to understand it myself first." },
        weights: { space: 3, depth: 3 },
      },
    ],
  },
  {
    id: "future",
    scene: { tr: "Sohbet gelecek hayallerine geldi.", en: "The conversation turns to future dreams." },
    prompt: {
      tr: "İlişkide gelecek konuşmaları sende nasıl bir his uyandırır?",
      en: "How do future conversations feel to you in a relationship?",
    },
    options: [
      {
        id: "love-plans",
        label: { tr: "Severim; ortak bir yönümüzü bilmek iyi gelir.", en: "I like them; knowing our shared direction feels good." },
        weights: { future: 3, trust: 3, communication: 1 },
      },
      {
        id: "dream-no-pressure",
        label: { tr: "Hayal kurmak güzel, kesin plan olmak zorunda değil.", en: "Dreaming is nice; it does not have to become a fixed plan." },
        weights: { future: 2, adventure: 2, space: 2 },
      },
      {
        id: "today-first",
        label: { tr: "Bugünün iyi olması benim için daha önemli.", en: "A good present matters more to me." },
        weights: { space: 3, adventure: 1, trust: 1 },
      },
      {
        id: "depends",
        label: { tr: "Güven oluştuğunda konuşmak çok değerli.", en: "Once trust is there, talking about it means a lot." },
        weights: { trust: 3, future: 3, depth: 2 },
      },
    ],
  },
  {
    id: "personal-space",
    scene: { tr: "İkinizin de yoğun olduğu bir hafta.", en: "You are both having a busy week." },
    prompt: {
      tr: "Kişisel alan konusunda en rahat hissettiğin denge hangisi?",
      en: "Which balance around personal space feels best?",
    },
    options: [
      {
        id: "close-often",
        label: { tr: "Yoğun olsak da sık temas bana iyi gelir.", en: "Frequent contact still feels good, even when busy." },
        weights: { communication: 3, romance: 2, trust: 1 },
      },
      {
        id: "independent-safe",
        label: { tr: "Kendi hayatımız aksın; bağımızdan emin olalım.", en: "Let our own lives flow while feeling secure in the bond." },
        weights: { space: 3, trust: 3 },
      },
      {
        id: "agree-rhythm",
        label: { tr: "İkimize uygun ritmi konuşup bulmayı tercih ederim.", en: "I prefer talking and finding a rhythm that works for both." },
        weights: { communication: 3, trust: 2, space: 2 },
      },
      {
        id: "changes",
        label: { tr: "Döneme göre değişir; sabit bir kuralım yok.", en: "It changes with life; I do not need a fixed rule." },
        weights: { adventure: 2, space: 2, communication: 1 },
      },
    ],
  },
  {
    id: "reassurance",
    scene: { tr: "Bir şey kafana takıldı.", en: "Something is on your mind." },
    prompt: {
      tr: "Karşındaki kişiden ne görmek seni daha çabuk rahatlatır?",
      en: "What helps you feel reassured most quickly?",
    },
    options: [
      {
        id: "clear-words",
        label: { tr: "Net ve doğrudan konuşması.", en: "Clear and direct words." },
        weights: { communication: 3, trust: 3 },
      },
      {
        id: "consistent-actions",
        label: { tr: "Tutarlı davranışlarını görmek.", en: "Seeing consistent actions." },
        weights: { trust: 3, depth: 2, future: 1 },
      },
      {
        id: "warm-presence",
        label: { tr: "Yanımda olması ve sıcak davranması.", en: "Warm presence and closeness." },
        weights: { romance: 3, depth: 2, trust: 2 },
      },
      {
        id: "space-to-process",
        label: { tr: "Önce biraz kendi kendime düşünmek.", en: "Having a little space to process first." },
        weights: { space: 3, depth: 2 },
      },
    ],
  },
  {
    id: "new-thing",
    scene: { tr: "Önünüzde boş bir akşam var.", en: "You have a completely free evening." },
    prompt: {
      tr: "Birlikte yeni bir şey deneme fikrine ne kadar açıksın?",
      en: "How open are you to trying something new together?",
    },
    options: [
      {
        id: "yes-first",
        label: { tr: "Ne olduğunu söyle, büyük ihtimalle varım.", en: "Tell me what it is; I am probably in." },
        weights: { adventure: 3, romance: 1, space: 1 },
      },
      {
        id: "comfort-plus",
        label: { tr: "Tanıdık bir şeyin içine küçük bir yenilik ekleyelim.", en: "Add one new twist to something familiar." },
        weights: { adventure: 2, trust: 2, romance: 1 },
      },
      {
        id: "cozy-repeat",
        label: { tr: "Sevdiğimiz rutini tekrar etmek de çok güzel.", en: "Repeating a favorite routine can be perfect." },
        weights: { trust: 3, depth: 1, future: 1 },
      },
      {
        id: "mood-based",
        label: { tr: "O günkü enerjime göre karar veririm.", en: "I decide based on my energy that day." },
        weights: { space: 3, adventure: 2 },
      },
    ],
  },
  {
    id: "remembered-detail",
    scene: { tr: "Aylar önce söylediğin küçük bir şey hatırlanmış.", en: "A tiny thing you said months ago was remembered." },
    prompt: {
      tr: "Böyle ayrıntılar senin için ne ifade eder?",
      en: "What do details like that mean to you?",
    },
    options: [
      {
        id: "means-a-lot",
        label: { tr: "Çok şey. Görüldüğümü hissettirir.", en: "A lot. It makes me feel seen." },
        weights: { depth: 3, romance: 3, trust: 2 },
      },
      {
        id: "sweet-not-required",
        label: { tr: "Tatlıdır ama sevgiyi bununla ölçmem.", en: "It is sweet, but I do not measure love by it." },
        weights: { trust: 2, space: 2, depth: 1 },
      },
      {
        id: "actions-more",
        label: { tr: "Günlük hayattaki tutarlılık benim için daha önemli.", en: "Everyday consistency matters more to me." },
        weights: { trust: 3, future: 2 },
      },
      {
        id: "i-do-that-too",
        label: { tr: "Ben de sevdiğim insanların ayrıntılarını biriktiririm.", en: "I collect little details about people I care about too." },
        weights: { depth: 3, romance: 2, communication: 1 },
      },
    ],
  },
  {
    id: "quiet-moment",
    scene: { tr: "Birlikte sessizce oturuyorsunuz.", en: "You are sitting together in silence." },
    prompt: {
      tr: "O sessizlik ne zaman sana iyi gelir?",
      en: "When does that silence feel good to you?",
    },
    options: [
      {
        id: "safe-silence",
        label: { tr: "Konuşmadan da rahat hissedebiliyorsak.", en: "When we can feel comfortable without talking." },
        weights: { trust: 3, depth: 2, space: 2 },
      },
      {
        id: "after-sharing",
        label: { tr: "Önce içimizi döküp sonra sessiz kalıyorsak.", en: "After we have shared what is on our minds." },
        weights: { communication: 2, depth: 3, trust: 2 },
      },
      {
        id: "doing-something",
        label: { tr: "Yan yana bir şeylerle uğraşırken.", en: "While doing our own little things side by side." },
        weights: { space: 3, trust: 2, adventure: 1 },
      },
      {
        id: "not-too-long",
        label: { tr: "Bir süre güzel; sonra yine konuşmak isterim.", en: "Nice for a while; then I want to talk again." },
        weights: { communication: 3, romance: 1, trust: 1 },
      },
    ],
  },
];
