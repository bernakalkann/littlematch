import type { CharacterId, DimensionScores, Locale } from "@/lib/types";
import type { AnswerMap } from "@/lib/scoring";
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

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      locale,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (profileError) {
    throw new Error("Remote profile could not be prepared.", {
      cause: profileError,
    });
  }

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

export async function completeRemoteTest(
  session: RemoteTestSession,
  answers: AnswerMap,
  characterId: CharacterId,
  scores: DimensionScores,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const updatedAt = new Date().toISOString();
  const { error: answerError } = await supabase.from("test_answers").upsert(
    Object.entries(answers).map(([questionId, optionId]) => ({
      session_id: session.id,
      user_id: session.userId,
      question_id: questionId,
      option_id: optionId,
      updated_at: updatedAt,
    })),
    { onConflict: "session_id,question_id" },
  );

  if (answerError) {
    throw new Error("Remote answers could not be saved.", { cause: answerError });
  }

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
      completed_at: updatedAt,
    })
    .eq("id", session.id)
    .eq("user_id", session.userId)
    .select("id")
    .single();

  if (sessionError) {
    throw new Error("Remote test session could not be completed.", {
      cause: sessionError,
    });
  }
}
