"use client";

import { copy } from "@/data/copy";
import type { PlayerCard } from "@/lib/supabase/player-cards";
import type { Locale } from "@/lib/types";
import { CozyScene } from "./CozyScene";
import { LanguageToggle } from "./LanguageToggle";
import { AvatarPortrait } from "./AvatarPortrait";

type LandingViewProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStart: () => void;
  onStartPair: () => void;
  onDiscover: () => void;
  onCustomize: () => void;
  profile: PlayerCard;
  onSignOut: () => void | Promise<void>;
  accountNotice?: string;
};

export function LandingView({
  locale,
  onLocaleChange,
  onStart,
  onStartPair,
  onDiscover,
  onCustomize,
  profile,
  onSignOut,
  accountNotice,
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
          <button className="account-chip avatar-edit-button" type="button" onClick={onCustomize}
            aria-label={locale === "tr" ? "Avatarımı kişiselleştir" : "Customize my avatar"}
            title={locale === "tr" ? "Avatarımı kişiselleştir" : "Customize my avatar"}>
            <AvatarPortrait id={profile.avatar_id} look={profile.avatar_look} /><strong>{profile.nickname}</strong>
            <span aria-hidden="true">✎</span>
          </button>
          <button type="button" className="soft-link" onClick={onSignOut}>{locale === "tr" ? "Çıkış yap" : "Log out"}</button>
        </nav>
      </header>

      <section className="hero-copy">
        {accountNotice && <p role="status">{accountNotice}</p>}
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
        <button className="paper-note note-three" type="button" onClick={onDiscover}>
          <span className="note-icon" aria-hidden="true">✦</span>
          <strong>{locale === "tr" ? "Keşfet" : "Discover"}</strong>
        </button>
      </section>

      <p className="prototype-note">{t.prototype}</p>
    </main>
  );
}
