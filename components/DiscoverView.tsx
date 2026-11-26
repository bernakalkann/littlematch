"use client";

import { useEffect, useRef, useState } from "react";
import { characters } from "@/data/characters";
import { getResultPosts, removeResultPost, shuffled, type ResultPost } from "@/lib/result-posts";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { CharacterId, Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";
import { SceneHeader, type SceneAccount } from "./SceneHeader";

const copy = {
  tr: {
    title: "Keşfet", intro: "Oyuncuların paylaştığı sonuçlar",
    shuffle: "Karıştır", loading: "Kartlar geliyor…", detail: "Sonucu gör", close: "Kapat",
    empty: "Henüz paylaşılmış bir sonuç yok.", failed: "İşlem tamamlanamadı. Tekrar dene.",
    retry: "Tekrar dene", remove: "Paylaşımı kaldır", myResult: "Sonucuma git",
    local: "Bu önizlemede aynı tarayıcıdan paylaşılan kartları görürsün.",
  },
  en: {
    title: "Discover", intro: "Results shared by players",
    shuffle: "Shuffle", loading: "Loading cards…", detail: "View result", close: "Close",
    empty: "No results have been shared yet.", failed: "Something went wrong. Try again.",
    retry: "Try again", remove: "Remove post", myResult: "My result",
    local: "This preview shows cards shared from this browser.",
  },
};

const postcardScenes: Record<CharacterId, "harbor" | "journey" | "book"> = {
  fox: "journey", cat: "harbor", dog: "journey", rabbit: "book",
  owl: "book", bear: "harbor", otter: "journey", hedgehog: "book",
};

function PostcardArt({ characterId }: { characterId: CharacterId }) {
  return <div className={`postcard-art postcard-${postcardScenes[characterId]}`} aria-hidden="true" />;
}

export function DiscoverView({ locale, account, onLocaleChange, onHome, onMyResult }: {
  locale: Locale;
  account: SceneAccount;
  onLocaleChange: (locale: Locale) => void;
  onHome: () => void;
  onMyResult?: () => void;
}) {
  const { profile } = account;
  const [posts, setPosts] = useState<ResultPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [removing, setRemoving] = useState(false);
  const [detail, setDetail] = useState<ResultPost | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
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

  function shuffle() {
    setPosts((current) => {
      const next = shuffled(current);
      if (next.length > 1 && next[0] === current[0]) next.push(next.shift()!);
      return next;
    });
  }

  const detailCharacter = detail && characters.find(({ id }) => id === detail.characterId);
  const detailAuthor = detail?.profile.user_id === profile.user_id ? profile : detail?.profile;

  return (
    <main className="painted-shell painted-discover">
      <SceneHeader locale={locale} onLocaleChange={onLocaleChange} account={account} onHome={onHome} />
      <section className="discover-board" aria-labelledby="discover-title">
        <h1 id="discover-title" className="paper-panel board-title">{t.title}</h1>
        <div className="board-toolbar">
          <p>{t.intro}</p>
          <button type="button" className="scene-button" onClick={shuffle} disabled={posts.length < 2}>
            <span aria-hidden="true">⤨</span> {t.shuffle}
          </button>
        </div>
        {!isSupabaseConfigured() && <p className="board-status">{t.local}</p>}
        {loading && <p className="board-status" role="status">{t.loading}</p>}
        {failed && <p className="board-status" role="alert">{t.failed} <button type="button" className="account-link" onClick={() => {
          setLoading(true); setFailed(false); setRetry((current) => current + 1);
        }}>{t.retry}</button></p>}
        {!loading && !failed && posts.length === 0 && <div className="paper-panel board-empty">
          <p>{t.empty}</p>
          {onMyResult && <button type="button" className="scene-button scene-gold" onClick={onMyResult}>{t.myResult}</button>}
        </div>}
        <div className="postcard-grid">
          {posts.map((post) => {
            const owner = post.profile.user_id === profile.user_id;
            const author = owner ? profile : post.profile;
            const character = characters.find((item) => item.id === post.characterId)!;
            return (
              <article key={author.user_id} className="paper-panel postcard">
                <div className="postcard-author"><AvatarPortrait id={author.avatar_id} look={author.avatar_look} /><strong>{author.nickname}</strong></div>
                <h2>{character.name[locale]}</h2>
                <PostcardArt characterId={character.id} />
                <button type="button" className="scene-button" onClick={() => {
                  setDetail(post);
                  dialog.current?.showModal();
                }}>{t.detail}</button>
                {owner && <button type="button" className="account-link" onClick={remove} disabled={removing}>{t.remove}</button>}
              </article>
            );
          })}
        </div>
      </section>
      <dialog ref={dialog} className="paper-panel postcard-detail" aria-labelledby="postcard-title" onClose={() => setDetail(null)}>
        <form method="dialog"><button type="submit" className="scene-button">{t.close}</button></form>
        {detailCharacter && detailAuthor && <>
          <div className="postcard-author"><AvatarPortrait id={detailAuthor.avatar_id} look={detailAuthor.avatar_look} /><strong>{detailAuthor.nickname}</strong></div>
          <h2 id="postcard-title">{detailCharacter.name[locale]}</h2>
          <PostcardArt characterId={detailCharacter.id} />
          <p><strong>{detailCharacter.tagline[locale]}</strong></p>
          <p>{detailCharacter.description[locale]}</p>
        </>}
      </dialog>
    </main>
  );
}
