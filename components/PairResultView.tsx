"use client";

import { characters } from "@/data/characters";
import { dimensionLabels } from "@/data/dimensions";
import { questions } from "@/data/questions";
import type { PairResultData } from "@/lib/invitations/client";
import { relationshipDimensions } from "@/lib/scoring";
import type { Locale } from "@/lib/types";
import { CharacterPortrait } from "./CharacterPortrait";
import { SceneHeader, type SceneAccount } from "./SceneHeader";

type PairResultViewProps = {
  locale: Locale;
  data: PairResultData;
  account: SceneAccount;
  onLocaleChange: (locale: Locale) => void;
  onHome: () => void;
};

const text = {
  tr: {
    eyebrow: "iki küçük dünya buluştu",
    title: "Uyum haritanız",
    overall: "cevap ve tercih benzerliği",
    dimensions: "Birlikte nasıl görünüyorsunuz?",
    common: "Aynı yere vardığınız seçimler",
    different: "Farklı baktığınız seçimler",
    differentNote:
      "Farklı cevaplar kötü uyum anlamına gelmez. Bunlar birbirinizi daha iyi tanımak için konuşma başlıklarıdır.",
    home: "ana sayfaya dön",
    disclaimer:
      "Bu yüzdeler yalnızca LittleMatch cevaplarının benzerliğini gösterir; ilişki başarısı veya bilimsel uyum tahmini değildir.",
  },
  en: {
    eyebrow: "two little worlds met",
    title: "Your match map",
    overall: "answer and preference similarity",
    dimensions: "How do you look together?",
    common: "Choices where you landed together",
    different: "Choices where you saw things differently",
    differentNote:
      "Different answers do not mean a bad match. They are conversation starters for getting to know each other better.",
    home: "back home",
    disclaimer:
      "These percentages only show similarity across LittleMatch answers; they are not a scientific compatibility or relationship-success prediction.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function PairResultView({
  locale,
  data,
  account,
  onLocaleChange,
  onHome,
}: PairResultViewProps) {
  const t = text[locale];
  const characterA = characters.find((item) => item.id === data.character_a);
  const characterB = characters.find((item) => item.id === data.character_b);

  if (!characterA || !characterB) return null;

  const questionLabel = (id: string) =>
    questions.find((question) => question.id === id)?.scene[locale] ?? id;

  return (
    <main className="painted-shell">
      <SceneHeader locale={locale} account={account} onLocaleChange={onLocaleChange} onHome={onHome} />

      <section className="pair-hero">
        <p className="pair-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>

        <div className="pair-characters">
          <div>
            <CharacterPortrait id={characterA.id} />
            <strong>{characterA.name[locale]}</strong>
          </div>
          <span className="pair-bridge" aria-hidden="true">✦</span>
          <div>
            <CharacterPortrait id={characterB.id} />
            <strong>{characterB.name[locale]}</strong>
          </div>
        </div>

        <div className="overall-match">
          <strong>{data.overall_similarity}%</strong>
          <span>{t.overall}</span>
        </div>
      </section>

      <section className="pair-details">
        <article className="pair-paper pair-dimensions">
          <h2>{t.dimensions}</h2>
          {relationshipDimensions.map((dimension) => (
            <div className="score-row" key={dimension}>
              <div>
                <span>{dimensionLabels[dimension][locale]}</span>
                <strong>{data.dimension_similarity[dimension]}%</strong>
              </div>
              <div className="score-track">
                <span style={{ width: data.dimension_similarity[dimension] + "%" }} />
              </div>
            </div>
          ))}
        </article>

        <article className="pair-paper pair-conversation">
          <h2>{t.common}</h2>
          <div className="conversation-tags">
            {data.common_answers.map((id) => (
              <span key={id}>✓ {questionLabel(id)}</span>
            ))}
          </div>

          <h2>{t.different}</h2>
          <div className="conversation-tags different">
            {data.different_answers.map((id) => (
              <span key={id}>↗ {questionLabel(id)}</span>
            ))}
          </div>
          <p>{t.differentNote}</p>
        </article>
      </section>

      <footer className="pair-footer">
        <p>{t.disclaimer}</p>
        <button type="button" onClick={onHome}>{t.home}</button>
      </footer>
    </main>
  );
}
