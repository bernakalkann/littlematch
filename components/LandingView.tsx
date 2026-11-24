"use client";

import { CozyScene } from "./CozyScene";

type LandingViewProps = {
  onStart?: () => void;
};

export function LandingView({ onStart }: LandingViewProps) {
  return (
    <main className="landing-shell">
      <CozyScene />

      <header className="topbar">
        <a className="wordmark" href="#" aria-label="LittleMatch ana sayfa">
          littlematch<span>✦</span>
        </a>

        <nav className="top-actions" aria-label="Ana menü">
          <button className="soft-link" type="button">hakkında</button>
          <button className="soft-link" type="button">giriş</button>
        </nav>
      </header>

      <section className="hero-copy">
        <p className="eyebrow">küçük seçimler, beklenmedik karşılaşmalar.</p>
        <h1>
          Biraz merak,
          <br />
          biraz tesadüf.
        </h1>
        <p className="hero-description">
          12 küçük seçimle nasıl sevdiğini keşfet.
          <br />
          İster arkadaşınla, ister hoşlandığın kişiyle, ister yeni biriyle.
        </p>
        <button className="primary-cta" type="button" onClick={onStart}>
          <span className="play-mark">▶</span>
          Oyuna Başla
        </button>
      </section>

      <section className="feature-notes" aria-label="LittleMatch özellikleri">
        <article className="paper-note note-one">
          <span className="note-icon">▣</span>
          <strong>Kendi karakterini oluştur.</strong>
        </article>
        <article className="paper-note note-two">
          <span className="note-icon">☁</span>
          <strong>Uyumunu keşfet.</strong>
        </article>
        <article className="paper-note note-three">
          <span className="note-icon">◌</span>
          <strong>İstersen sohbet et.</strong>
        </article>
      </section>

      <p className="prototype-note">
        Eşleşme ve anonim sohbet sonraki aşamada gerçek backend ile açılacak.
      </p>
    </main>
  );
}
