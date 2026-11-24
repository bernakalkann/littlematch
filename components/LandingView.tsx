"use client";

import { copy } from "@/data/copy";
import type { Locale } from "@/lib/types";
import { CozyScene } from "./CozyScene";
import { LanguageToggle } from "./LanguageToggle";

type LandingViewProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStart: () => void;
};

export function LandingView({
  locale,
  onLocaleChange,
  onStart,
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
          <button className="soft-link" type="button">{t.about}</button>
          <button className="soft-link" type="button">{t.login}</button>
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
        <article className="paper-note note-one">
          <span className="note-icon">▣</span>
          <strong>{t.featureCharacter}</strong>
        </article>
        <article className="paper-note note-two">
          <span className="note-icon">☁</span>
          <strong>{t.featureMatch}</strong>
        </article>
        <article className="paper-note note-three">
          <span className="note-icon">◌</span>
          <strong>{t.featureChat}</strong>
        </article>
      </section>

      <p className="prototype-note">{t.prototype}</p>
    </main>
  );
}
