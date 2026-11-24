import type { CharacterId, DimensionScores, Locale } from "@/lib/types";
import { ensureAnonymousUser } from "./auth";
import { getSupabaseBrowserClient } from "./client";

export type RemoteTestSession = {
  id: string;
  userId: string;
};

export async function createRemoteTestSession(
  locale: Locale,
): Promise<RemoteTestSession | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;

  const user = await ensureAnonymousUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("test_sessions")
    .insert({
      user_id: user.id,
      locale,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Remote test session could not be created.", {
      cause: error,
    });
  }

  return { id: data.id as string, userId: user.id };
}

export async function saveRemoteAnswer(
  session: RemoteTestSession | null,
  questionId: string,
  optionId: string,
): Promise<void> {
  if (!session) return;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const { error } = await supabase.from("test_answers").upsert(
    {
      session_id: session.id,
      user_id: session.userId,
      question_id: questionId,
      option_id: optionId,
    },
    { onConflict: "session_id,question_id" },
  );

  if (error) {
    throw new Error("Remote answer could not be saved.", { cause: error });
  }
}

export async function completeRemoteTest(
  session: RemoteTestSession | null,
  characterId: CharacterId,
  scores: DimensionScores,
): Promise<void> {
  if (!session) return;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const { error: resultError } = await supabase
    .from("character_results")
    .upsert(
      {
        session_id: session.id,
        user_id: session.userId,
        character_id: characterId,
        scores,
      },
      { onConflict: "session_id" },
    );

  if (resultError) {
    throw new Error("Character result could not be saved.", {
      cause: resultError,
    });
  }

  const { error: sessionError } = await supabase
    .from("test_sessions")
    .update({
      status: "completed",
      character_id: characterId,
      scores,
      completed_at: new Date().toISOString(),
    })
    .eq("id", session.id)
    .eq("user_id", session.userId);

  if (sessionError) {
    throw new Error("Remote test session could not be completed.", {
      cause: sessionError,
    });
  }
}
