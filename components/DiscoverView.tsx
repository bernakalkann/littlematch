"use client";

import { useEffect, useState } from "react";
import { characters } from "@/data/characters";
import { getResultPosts, removeResultPost, shuffled, type ResultPost } from "@/lib/result-posts";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { PlayerCard } from "@/lib/supabase/player-cards";
import type { Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";
import { CharacterPortrait } from "./CharacterPortrait";

const copy = {
  tr: {
    title: "Keşfet", intro: "Oyuncuların paylaştığı LittleMatch sonuçları.",
    home: "Ana sayfa", shuffle: "Karıştır", loading: "Kartlar geliyor…",
    empty: "Henüz paylaşılmış bir sonuç yok.", failed: "İşlem tamamlanamadı. Tekrar dene.",
    retry: "Tekrar dene", remove: "Paylaşımı kaldır", myResult: "Sonucuma git",
    local: "Bu önizlemede aynı tarayıcıdan paylaşılan kartları görürsün.",
  },
  en: {
    title: "Discover", intro: "LittleMatch results shared by players.",
    home: "Home", shuffle: "Shuffle", loading: "Loading cards…",
    empty: "No results have been shared yet.", failed: "Something went wrong. Try again.",
    retry: "Try again", remove: "Remove post", myResult: "My result",
    local: "This preview shows cards shared from this browser.",
  },
};

export function DiscoverView({ locale, profile, onHome, onMyResult }: {
  locale: Locale;
  profile: PlayerCard;
  onHome: () => void;
  onMyResult?: () => void;
}) {
  const [posts, setPosts] = useState<ResultPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [removing, setRemoving] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    let active = true;
    getResultPosts().then((result) => {
      if (active) setPosts(shuffled(result));
    }).catch(() => {
      if (active) setFailed(true);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  async function remove() {
    setRemoving(true);
    setFailed(false);
    try {
      await removeResultPost(profile.user_id);
      setPosts((current) => current.filter((post) => post.profile.user_id !== profile.user_id));
    } catch {
      setFailed(true);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <main className="pair-result-shell discover-page">
      <header className="game-topbar">
        <button type="button" className="game-wordmark" onClick={onHome}>littlematch<span>✦</span></button>
        <button type="button" className="secondary-result-action" onClick={onHome}>{t.home}</button>
      </header>
      <section className="discover-content">
        <div className="discover-heading">
          <div><h1>{t.title}</h1><p>{t.intro}</p></div>
          {posts.length > 1 && <button type="button" className="secondary-result-action" onClick={() => setPosts(shuffled(posts))}>{t.shuffle}</button>}
        </div>
        {!isSupabaseConfigured() && <p className="discover-note">{t.local}</p>}
        {loading && <p role="status">{t.loading}</p>}
        {failed && <p role="status">{t.failed} <button type="button" className="account-link" onClick={() => {
          setLoading(true); setFailed(false); setRetry(retry + 1);
        }}>{t.retry}</button></p>}
        {!loading && !failed && posts.length === 0 && <div className="discover-empty">
          <p>{t.empty}</p>
          {onMyResult && <button type="button" className="primary-result-action" onClick={onMyResult}>{t.myResult}</button>}
        </div>}
        <div className="discover-grid">
          {posts.map((post) => {
            const owner = post.profile.user_id === profile.user_id;
            const author = owner ? profile : post.profile;
            const character = characters.find((item) => item.id === post.characterId)!;
            return (
              <article key={author.user_id} className={`discover-card result-${character.id}`}>
                <span className="account-chip"><AvatarPortrait id={author.avatar_id} look={author.avatar_look} /><strong>{author.nickname}</strong></span>
                <div className="discover-art"><CharacterPortrait id={character.id} /></div>
                <h2>{character.name[locale]}</h2>
                <p>{character.tagline[locale]}</p>
                {owner && <button type="button" className="account-link" onClick={remove} disabled={removing}>{t.remove}</button>}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
