"use client";

import { useState } from "react";
import { dimensionLabels } from "@/data/dimensions";
import { getCharacterMatch, relationshipDimensions, type AnswerMap } from "@/lib/scoring";
import type { Locale } from "@/lib/types";
import { CharacterPortrait } from "./CharacterPortrait";
import { LanguageToggle } from "./LanguageToggle";

export type InviteUiState =
  | "unavailable"
  | "idle"
  | "creating"
  | "ready"
  | "waiting"
  | "error";

type ResultViewProps = {
  locale: Locale;
  answers: AnswerMap;
  inviteState: InviteUiState;
  inviteLink?: string | null;
  onLocaleChange: (locale: Locale) => void;
  onRestart: () => void;
  onReview: () => void;
  onHome: () => void;
  onCreateInvite: () => void | Promise<void>;
  onCheckPair: () => void | Promise<void>;
};

const text = {
  tr: {
    eyebrow: "senin littlematch karakterin",
    strengths: "Sende öne çıkanlar",
    values: "İlişkide önemsediğin şeyler",
    communication: "İletişim ritmin",
    map: "Senin ilişki haritan",
    share: "Sonucumu paylaş",
    copied: "Bağlantı kopyalandı",
    review: "Cevaplarıma dön",
    restart: "Baştan oyna",
    together: "Birlikte Oyna",
    creating: "Davet hazırlanıyor…",
    inviteReady: "Özel davet linkin hazır.",
    copyInvite: "Linki kopyala",
    waiting: "Diğer kişinin testi henüz tamamlanmadı.",
    check: "Uyum sonucunu kontrol et",
    unavailable: "Davet özelliği Supabase bağlantısı açıldığında kullanılabilir.",
    inviteError: "Davet işlemi tamamlanamadı. Daha sonra tekrar deneyebilirsin.",
    disclaimer:
      "Bu sonuç eğlence amaçlı, cevaplarından üretilen açıklanabilir bir karakter eşleştirmesidir; psikolojik değerlendirme veya ilişki başarısı tahmini değildir.",
  },
  en: {
    eyebrow: "your littlematch character",
    strengths: "What stands out in you",
    values: "What you value in a relationship",
    communication: "Your communication rhythm",
    map: "Your relationship map",
    share: "Share my result",
    copied: "Link copied",
    review: "Review my answers",
    restart: "Play again",
    together: "Play Together",
    creating: "Preparing your invite…",
    inviteReady: "Your private invite link is ready.",
    copyInvite: "Copy link",
    waiting: "The other person has not finished the test yet.",
    check: "Check match result",
    unavailable: "Invites become available when Supabase is connected.",
    inviteError: "The invite could not be completed. You can try again later.",
    disclaimer:
      "This is an entertainment result generated from an explainable match with your answers. It is not a psychological assessment or a prediction of relationship success.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function ResultView({
  locale,
  answers,
  inviteState,
  inviteLink,
  onLocaleChange,
  onRestart,
  onReview,
  onHome,
  onCreateInvite,
  onCheckPair,
}: ResultViewProps) {
  const [shared, setShared] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
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

  const copyInvite = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 1800);
    } catch {
      // Clipboard access may be blocked by the browser.
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

          <div className={"invite-note invite-" + inviteState}>
            {inviteState === "unavailable" && <p>{t.unavailable}</p>}
            {inviteState === "idle" && (
              <button type="button" onClick={onCreateInvite}>{t.together} ✦</button>
            )}
            {inviteState === "creating" && <p>{t.creating}</p>}
            {(inviteState === "ready" || inviteState === "waiting") && inviteLink && (
              <>
                <p>{inviteState === "waiting" ? t.waiting : t.inviteReady}</p>
                <div className="invite-link-row">
                  <input value={inviteLink} readOnly aria-label={t.inviteReady} />
                  <button type="button" onClick={copyInvite}>
                    {inviteCopied ? t.copied : t.copyInvite}
                  </button>
                </div>
                <button type="button" className="check-match-button" onClick={onCheckPair}>
                  {t.check} →
                </button>
              </>
            )}
            {inviteState === "error" && <p>{t.inviteError}</p>}
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
