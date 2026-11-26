"use client";

import { copy } from "@/data/copy";
import type { Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";
import { SceneHeader, type SceneAccount } from "./SceneHeader";

export function LandingView({ locale, onLocaleChange, onStart, onStartPair, onDiscover, onCustomize, account }: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onStart: () => void;
  onStartPair: () => void;
  onDiscover: () => void;
  onCustomize: () => void;
  account: SceneAccount;
}) {
  const t = copy[locale];
  const { profile } = account;

  return <main className="painted-shell painted-home">
    <SceneHeader locale={locale} onLocaleChange={onLocaleChange} account={account} />
    <section className="home-stage">
      <div className="painted-art home-art" aria-hidden="true" />
      <div className="home-message">
        <h1>{t.heroTitleA}<br />{t.heroTitleB}</h1>
        <p>{t.heroDescriptionA}</p>
        <button className="scene-button scene-start" type="button" onClick={onStart}>
          <span aria-hidden="true">▶</span> {t.start}
        </button>
      </div>
    </section>
    <nav className="home-shortcuts" aria-label={t.shortcuts}>
      <button className="paper-action" type="button" onClick={onCustomize}>
        <span className="shortcut-art shortcut-avatar" aria-hidden="true">
          <span className="shortcut-portrait"><AvatarPortrait id={profile.avatar_id} look={profile.avatar_look} /></span>
          <span className="shortcut-pencil">✎</span><span className="shortcut-star">✦</span>
        </span>
        <strong>{t.featureCharacter}</strong>
      </button>
      <button className="paper-action" type="button" onClick={onStartPair}>
        <span className="shortcut-art shortcut-pair" aria-hidden="true">
          <i className="shortcut-dog" /><span className="shortcut-heart">♥</span><i className="shortcut-cat" />
        </span>
        <strong>{t.featureMatch}</strong>
      </button>
    </nav>
    <div className="home-discover"><button type="button" className="scene-button" onClick={onDiscover}>{t.discover}</button></div>
  </main>;
}
