import { characters } from "@/data/characters";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { playerCardColumns, readCard, type PlayerCard } from "@/lib/supabase/player-cards";
import type { CharacterId } from "@/lib/types";

export type ResultPost = {
  profile: PlayerCard;
  characterId: CharacterId;
  sharedAt: string;
};

const localKey = "littlematch-preview-posts-v1";

function parsePost(profileData: unknown, characterId: unknown, sharedAt: unknown): ResultPost | null {
  const profile = readCard(profileData);
  const character = characters.find((entry) => entry.id === characterId);
  if (!profile || !character || typeof sharedAt !== "string") return null;
  return { profile, characterId: character.id, sharedAt };
}

function readLocalPosts(): ResultPost[] {
  try {
    const data: unknown = JSON.parse(window.localStorage.getItem(localKey) ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.flatMap((row) => {
      const post = row && parsePost(row.profile, row.characterId, row.sharedAt);
      return post ? [post] : [];
    });
  } catch {
    return [];
  }
}

export async function getResultPosts(): Promise<ResultPost[]> {
  const client = getSupabaseBrowserClient();
  if (!client) return readLocalPosts();

  const { data, error } = await client.from("result_posts")
    .select(`character_id,shared_at,player_cards!inner(${playerCardColumns})`)
    .order("shared_at", { ascending: false }).limit(80);
  if (error) throw error;
  return data.flatMap((row) => parsePost(row.player_cards, row.character_id, row.shared_at) ?? []);
}

export async function writeResultPost(profile: PlayerCard, characterId: CharacterId, sessionId?: string) {
  const client = getSupabaseBrowserClient();
  const sharedAt = new Date().toISOString();
  if (!client) {
    const rest = readLocalPosts().filter((post) => post.profile.user_id !== profile.user_id);
    window.localStorage.setItem(localKey, JSON.stringify([{ profile, characterId, sharedAt }, ...rest].slice(0, 80)));
    return;
  }
  if (!sessionId) throw new Error("Completed test required.");

  const details = { session_id: sessionId, character_id: characterId, shared_at: sharedAt };
  const { error } = await client.from("result_posts").insert({ user_id: profile.user_id, ...details });
  if (!error) return;
  if (error.code !== "23505") throw error;

  const updated = await client.from("result_posts").update(details).eq("user_id", profile.user_id).select("user_id").single();
  if (updated.error) throw updated.error;
}

export async function removeResultPost(userId: string) {
  const client = getSupabaseBrowserClient();
  if (!client) {
    window.localStorage.setItem(localKey, JSON.stringify(readLocalPosts().filter((post) => post.profile.user_id !== userId)));
    return;
  }
  const { error } = await client.from("result_posts").delete().eq("user_id", userId);
  if (error) throw error;
}

export function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
