"use client";

import { useState } from "react";
import { defaultLook, readLook } from "@/data/avatars";
import type { Locale } from "@/lib/types";
import { AvatarStudio } from "./AvatarStudio";

export function AvatarEditView({ locale, initial, onSave, onHome }: {
  locale: Locale;
  initial?: string | null;
  onSave: (look: string | null) => Promise<void>;
  onHome: () => void;
}) {
  const [look, setLook] = useState(readLook(initial) ?? defaultLook);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const tr = locale === "tr";

  async function save(next: string | null) {
    setSaving(true);
    setError(false);
    try {
      await onSave(next);
      onHome();
    } catch {
      setSaving(false);
      setError(true);
    }
  }

  return <main className="pair-result-shell">
    <header className="game-topbar">
      <button type="button" className="game-wordmark" onClick={onHome} disabled={saving}>littlematch<span>✦</span></button>
    </header>
    <section className="account-card avatar-edit-page">
      <h1>{tr ? "Avatarımı kişiselleştir" : "Customize my avatar"}</h1>
      <AvatarStudio locale={locale} look={look} onChange={setLook} />
      <div className="studio-mode">
        <button type="button" className="primary-result-action" disabled={saving} onClick={() => save(look)}>{tr ? "Görünümü kaydet" : "Save look"}</button>
        {initial && <button type="button" className="secondary-result-action" disabled={saving} onClick={() => save(null)}>{tr ? "Hazır avatarıma dön" : "Restore my preset"}</button>}
        <button type="button" className="account-link" disabled={saving} onClick={onHome}>{tr ? "Vazgeç" : "Cancel"}</button>
      </div>
      {error && <p role="status">{tr ? "Görünüm kaydedilemedi. Tekrar dene." : "Could not save your look. Try again."}</p>}
    </section>
  </main>;
}
