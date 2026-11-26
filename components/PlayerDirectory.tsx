"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { listPlayerCards, type PlayerCard } from "@/lib/supabase/player-cards";
import type { Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";

const copy = {
  tr: {
    title: "Uyumunu keşfet", players: "LittleMatch oyuncuları",
    local: "Diğer oyuncuların profilleri bağlı web sürümünde görünür.",
    logged: "Sen", empty: "Şimdilik burada başka oyuncu görünmüyor.",
    failed: "Profiller yüklenemedi.", retry: "Tekrar dene", loading: "Profiller yükleniyor…",
    home: "Ana sayfa", pair: "Aynı cihazda iki kişi oyna", next: "Sonraki", previous: "Önceki",
  },
  en: {
    title: "Discover your match", players: "LittleMatch players",
    local: "Other players appear in the connected web version.",
    logged: "You", empty: "No other players to show yet.",
    failed: "Profiles could not be loaded.", retry: "Try again", loading: "Loading profiles…",
    home: "Home", pair: "Play together on this device", next: "Next", previous: "Previous",
  },
};

export function PlayerDirectory({ locale, profile, onHome, onPair }: {
  locale: Locale;
  profile: PlayerCard;
  onHome: () => void;
  onPair: () => void;
}) {
  const client = getSupabaseBrowserClient();
  const [page, setPage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Awaited<ReturnType<typeof listPlayerCards>>>();
  const [failed, setFailed] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    if (!client) return;
    let active = true;
    listPlayerCards(client, profile.user_id, page).then((data) => {
      if (active) setResult(data);
    }).catch(() => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, [attempt, client, page, profile.user_id]);

  function load(pageNumber: number) {
    setResult(undefined);
    setFailed(false);
    setPage(pageNumber);
    setAttempt(attempt + 1);
  }

  const otherCards = result?.cards ?? [];

  return <main className="pair-result-shell">
    <header className="game-topbar">
      <button type="button" className="game-wordmark" onClick={onHome}>littlematch<span>✦</span></button>
      <button type="button" className="secondary-result-action" onClick={onHome}>{t.home}</button>
    </header>
    <section className="player-directory">
      <h1>{t.title}</h1>
      <button type="button" className="primary-result-action" onClick={onPair}>{t.pair}</button>
      <h2>{t.players}</h2>
      {!client && <p>{t.local}</p>}
      {client && !result && !failed && <p role="status">{t.loading}</p>}
      {failed && <p role="status">{t.failed} <button type="button" className="account-link" onClick={() => load(page)}>{t.retry}</button></p>}
      <ul className="player-grid">
        {page === 0 && <li><AvatarPortrait id={profile.avatar_id} look={profile.avatar_look} /><strong>{profile.nickname}</strong><small>{t.logged}</small></li>}
        {otherCards.map((card) => <li key={card.user_id}><AvatarPortrait id={card.avatar_id} look={card.avatar_look} /><strong>{card.nickname}</strong></li>)}
      </ul>
      {result && otherCards.length === 0 && <p>{t.empty}</p>}
      {(page > 0 || result?.hasMore) && <div className="account-tabs">
        <button type="button" disabled={page === 0} onClick={() => load(page - 1)}>{t.previous}</button>
        <button type="button" disabled={!result?.hasMore} onClick={() => load(page + 1)}>{t.next}</button>
      </div>}
    </section>
  </main>;
}
