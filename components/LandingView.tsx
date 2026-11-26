"use client";

import { copy } from "@/data/copy";
import type { Locale } from "@/lib/types";
import { CozyScene } from "./CozyScene";
import { LanguageToggle } from "./LanguageToggle";

type LandingViewProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStart: () => void;
  onStartPair: () => void;
};

export function LandingView({
  locale,
  onLocaleChange,
  onStart,
  onStartPair,
}: LandingViewProps) {
  const t = copy[locale];

  return (
    <main className="landing-shell">
      <CozyScene />

      <header className="topbar">
        <a className="wordmark" href="#" aria-label="LittleMatch">
          littlematch<span>✦</span>
        </a>

        <nav className="top-actions" aria-label="Main navigation">
          <LanguageToggle locale={locale} onChange={onLocaleChange} compact />
        </nav>
      </header>

      <section className="hero-copy">
        <p className="eyebrow">{t.tagline}</p>
        <h1>
          {t.heroTitleA}
          <br />
          {t.heroTitleB}
        </h1>
        <p className="hero-description">
          {t.heroDescriptionA}
          <br />
          {t.heroDescriptionB}
        </p>
        <button className="primary-cta" type="button" onClick={onStart}>
          <span className="play-mark">▶</span>
          {t.start}
        </button>
      </section>

      <section className="feature-notes" aria-label="LittleMatch features">
        <button className="paper-note note-one" type="button" onClick={onStart}>
          <span className="note-icon" aria-hidden="true">▣</span>
          <strong>{t.featureCharacter}</strong>
        </button>
        <button className="paper-note note-two" type="button" onClick={onStartPair}>
          <span className="note-icon" aria-hidden="true">☁</span>
          <strong>{t.featureMatch}</strong>
        </button>
      </section>

      <p className="prototype-note">{t.prototype}</p>
    </main>
  );
}
