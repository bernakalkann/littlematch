import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";

export async function getRegisteredUser(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user && !user.is_anonymous ? user : null;
}
