import { isAvatarId, type AvatarId } from "@/data/avatars";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PlayerCard = {
  user_id: string;
  nickname: string;
  avatar_id: AvatarId;
  listed: boolean;
};

const columns = "user_id,nickname,avatar_id,listed";

function readCard(value: unknown): PlayerCard | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.user_id !== "string" || typeof row.nickname !== "string" ||
      !isAvatarId(row.avatar_id) || typeof row.listed !== "boolean") return null;
  return {
    user_id: row.user_id,
    nickname: row.nickname,
    avatar_id: row.avatar_id,
    listed: row.listed,
  };
}

export async function loadPlayerCard(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from("player_cards").select(columns).eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return readCard(data);
}

export async function savePlayerCard(client: SupabaseClient, card: Omit<PlayerCard, "listed">) {
  const { data, error } = await client.from("player_cards").insert(card).select(columns).single();
  if (error) throw error;
  const saved = readCard(data);
  if (!saved) throw new Error("Player card could not be read.");
  return saved;
}

export async function publishPlayerCard(client: SupabaseClient, userId: string) {
  const { error } = await client.from("player_cards").update({ listed: true }).eq("user_id", userId).select("user_id").single();
  if (error) throw error;
}

export async function listPlayerCards(client: SupabaseClient, userId: string, page: number) {
  const pageSize = 24;
  const start = page * pageSize;
  const { data, error } = await client.from("player_cards").select(columns)
    .eq("listed", true).neq("user_id", userId).order("created_at", { ascending: false })
    .order("user_id").range(start, start + pageSize);
  if (error) throw error;
  return { cards: data.slice(0, pageSize).flatMap((row) => readCard(row) ?? []), hasMore: data.length > pageSize };
}
