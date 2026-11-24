"use client";

import { useState } from "react";
import { dimensionLabels } from "@/data/dimensions";
import { getCharacterMatch, relationshipDimensions, type AnswerMap } from "@/lib/scoring";
import type { Locale } from "@/lib/types";
import { CharacterPortrait } from "./CharacterPortrait";
import { LanguageToggle } from "./LanguageToggle";

type ResultViewProps = {
  locale: Locale;
  answers: AnswerMap;
  onLocaleChange: (locale: Locale) => void;
  onRestart: () => void;
  onReview: () => void;
  onHome: () => void;
};

const text = {
  tr: {
    eyebrow: "senin littlematch karakterin",
    strengths: "Sende öne çıkanlar",
    values: "İlişkide önemsediğin şeyler",
    communication: "İletişim ritmin",
    map: "Senin ilişki haritan",
    habitat: "Karakterinin küçük dünyası",
    share: "Sonucumu paylaş",
    copied: "Bağlantı kopyalandı",
    review: "Cevaplarıma dön",
    restart: "Baştan oyna",
    disclaimer:
      "Bu sonuç eğlence amaçlı, cevaplarından üretilen açıklanabilir bir karakter eşleştirmesidir; psikolojik değerlendirme veya ilişki başarısı tahmini değildir.",
  },
  en: {
    eyebrow: "your littlematch character",
    strengths: "What stands out in you",
    values: "What you value in a relationship",
    communication: "Your communication rhythm",
    map: "Your relationship map",
    habitat: "Your character's little world",
    share: "Share my result",
    copied: "Link copied",
    review: "Review my answers",
    restart: "Play again",
    disclaimer:
      "This is an entertainment result generated from an explainable match with your answers. It is not a psychological assessment or a prediction of relationship success.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ResultView({
  locale,
  answers,
  onLocaleChange,
  onRestart,
  onReview,
  onHome,
}: ResultViewProps) {
  const [shared, setShared] = useState(false);
  const result = getCharacterMatch(answers);
  const character = result.character;
  const t = text[locale];

  const share = async () => {
    const shareText =
      character.animal[locale] +
      " — " +
      character.name[locale] +
      "\n" +
      character.tagline[locale];

    try {
      if (navigator.share) {
        await navigator.share({
          title: "LittleMatch",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          shareText + "\n" + window.location.href,
        );
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // Closing the share sheet or blocking clipboard is harmless.
    }
  };

  return (
    <main className={"result-shell result-" + character.id}>
      <header className="result-topbar">
        <button type="button" className="game-wordmark" onClick={onHome}>
          littlematch<span>✦</span>
        </button>
        <LanguageToggle locale={locale} onChange={onLocaleChange} compact />
      </header>

      <section className="result-hero">
        <div className="portrait-world">
          <span className="portrait-sun" />
          <span className="portrait-hill hill-back" />
          <span className="portrait-hill hill-front" />
          <CharacterPortrait id={character.id} />
          <p className="habitat-label">
            <span>⌂</span>
            {character.habitat[locale]}
          </p>
        </div>

        <div className="result-copy">
          <p className="result-eyebrow">{t.eyebrow}</p>
          <p className="animal-name">{character.animal[locale]}</p>
          <h1>{character.name[locale]}</h1>
          <p className="character-tagline">“{character.tagline[locale]}”</p>
          <p className="character-description">{character.description[locale]}</p>

          <div className="result-actions">
            <button type="button" className="primary-result-action" onClick={share}>
              {shared ? t.copied : t.share}
            </button>
            <button type="button" className="secondary-result-action" onClick={onReview}>
              {t.review}
            </button>
          </div>
        </div>
      </section>

      <section className="result-details">
        <article className="result-paper">
          <h2>{t.strengths}</h2>
          <ul className="soft-list">
            {character.strengths.map((item) => (
              <li key={item.tr}>{item[locale]}</li>
            ))}
          </ul>

          <h2>{t.values}</h2>
          <div className="value-chips">
            {character.values.map((item) => (
              <span key={item.tr}>{item[locale]}</span>
            ))}
          </div>

          <h2>{t.communication}</h2>
          <p>{character.communication[locale]}</p>
        </article>

        <article className="score-paper">
          <h2>{t.map}</h2>
          <div className="score-list">
            {relationshipDimensions.map((dimension) => (
              <div className="score-row" key={dimension}>
                <div>
                  <span>{dimensionLabels[dimension][locale]}</span>
                  <strong>{result.scores[dimension]}</strong>
                </div>
                <div className="score-track">
                  <span style={{ width: result.scores[dimension] + "%" }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="result-footer">
        <p>{t.disclaimer}</p>
        <button type="button" onClick={onRestart}>{t.restart} ↻</button>
      </footer>
    </main>
  );
}
