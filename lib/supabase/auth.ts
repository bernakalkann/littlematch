import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./client";

export async function ensureAnonymousUser(): Promise<User | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (user && !userError) return user;

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw new Error("Anonymous Supabase session could not be created.", {
      cause: error,
    });
  }

  return data.user;
}
