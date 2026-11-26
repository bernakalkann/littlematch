"use client";

import { useState, type FormEvent } from "react";
import { avatarIds, defaultLook, nicknamePattern, randomLook, readLook, type AvatarId } from "@/data/avatars";
import type { Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";
import { AvatarStudio } from "./AvatarStudio";
import { CustomAvatar } from "./CustomAvatar";
import { SceneHeader, type SceneAccount } from "./SceneHeader";

const copy = {
  tr: {
    title: "Avatarını kişiselleştir", nickname: "Takma ad", shuffle: "Karıştır", save: "Kaydet ve devam et",
    saving: "Kaydediliyor…", failed: "Profil kaydedilemedi. Tekrar dene.", taken: "Bu takma ad kullanılıyor.",
    rule: "3–20 harf, rakam veya alt çizgi kullan.", preset: "Hazır avatarımı göster",
    choosePreset: "Hazır avatar seç", mirror: "Avatar önizlemesi", cancel: "Vazgeç",
    visibility: "Testi bitirdiğinde takma adın ve görünümün kayıtlı oyunculara görünür.",
  },
  en: {
    title: "Customize your avatar", nickname: "Nickname", shuffle: "Shuffle", save: "Save and continue",
    saving: "Saving…", failed: "Could not save your profile. Try again.", taken: "This nickname is taken.",
    rule: "Use 3–20 letters, numbers, or underscores.", preset: "Show my preset avatar",
    choosePreset: "Choose a preset", mirror: "Avatar preview", cancel: "Cancel",
    visibility: "After the quiz, registered players can see your nickname and avatar.",
  },
};

export function AvatarEditView({
  locale, onLocaleChange, account, initialAvatar, initialNickname, initialLook, onSave, onHome, onLogin, onLogout, onLeave, online,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  account?: SceneAccount;
  initialAvatar?: AvatarId;
  initialNickname: string;
  initialLook?: string | null;
  onSave: (nickname: string, avatar: AvatarId, look: string | null) => Promise<void>;
  onHome?: () => void;
  onLogin?: () => void;
  onLogout?: () => void | Promise<void>;
  onLeave?: () => void | Promise<void>;
  online?: boolean;
}) {
  const [nickname, setNickname] = useState(initialNickname);
  const [avatar, setAvatar] = useState<AvatarId>(initialAvatar ?? "girl-1");
  const [look, setLook] = useState(readLook(initialLook) ?? (initialAvatar ? null : defaultLook));
  const [showPresets, setShowPresets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<"failed" | "taken" | "rule">();
  const t = copy[locale];

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const name = nickname.trim();
    if (!nicknamePattern.test(name)) {
      setError("rule");
      return;
    }
    setSaving(true);
    setError(undefined);
    try {
      await onSave(name, avatar, look);
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? error.code : null;
      setError(code === "23505" ? "taken" : "failed");
      setSaving(false);
    }
  }

  function shuffle() {
    const next = randomLook();
    setLook(next === look ? ((Number(next[0]) + 1) % 6) + next.slice(1) : next);
  }

  return <main className="painted-shell painted-studio">
    <SceneHeader locale={locale} onLocaleChange={onLocaleChange} onHome={saving ? undefined : onHome}
      account={account && { ...account, onCustomize: undefined }} onLogin={onLogin} onLogout={onLogout} />
    <section className="painted-split atelier-layout">
      <div className="atelier-stage">
        <div className="atelier-mirror" role="img" aria-label={t.mirror}>
          {look ? <div className="mirror-character">
            <CustomAvatar look={look} />
            <div className="mirror-legs" aria-hidden="true"><i /><i /></div>
          </div> : <AvatarPortrait id={avatar} />}
        </div>
      </div>
      <form className="paper-panel atelier-panel" onSubmit={save}>
        <h1>{t.title}</h1>
        <fieldset className="atelier-form" disabled={saving}>
          <AvatarStudio locale={locale} look={look ?? defaultLook} active={look !== null} onChange={setLook} />
          {initialAvatar ? (look && <button type="button" className="account-link" onClick={() => setLook(null)}>{t.preset}</button>)
            : <div>
              <button type="button" className="account-link" aria-expanded={showPresets}
                onClick={() => setShowPresets((current) => !current)}>{t.choosePreset}</button>
              {showPresets && <div className="wardrobe-presets">
                {avatarIds.map((id, index) => <button type="button" key={id} aria-label={`${t.choosePreset} ${index + 1}`}
                  aria-pressed={look === null && avatar === id}
                  onClick={() => { setAvatar(id); setLook(null); }}>
                  <AvatarPortrait id={id} />
                </button>)}
              </div>}
            </div>}
          <label className="atelier-name">{t.nickname}
            <input required minLength={3} maxLength={20} value={nickname} autoComplete="nickname"
              onChange={(event) => setNickname(event.target.value)} />
          </label>
          {online && <p className="quiz-save">{t.visibility}</p>}
          <div className="atelier-actions">
            <button type="button" className="scene-button" onClick={shuffle}>{t.shuffle}</button>
            <button type="submit" className="scene-button scene-gold">{saving ? t.saving : t.save}</button>
          </div>
          {onLeave && <button type="button" className="account-link" onClick={onLeave}>{t.cancel}</button>}
        </fieldset>
        {error && <p className="account-message" role="alert">{t[error]}</p>}
      </form>
    </section>
  </main>;
}
