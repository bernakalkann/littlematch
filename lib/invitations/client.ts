import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CharacterId, DimensionKey } from "@/lib/types";

export type PairResultData = {
  ready: true;
  overall_similarity: number;
  dimension_similarity: Record<DimensionKey, number>;
  common_answers: string[];
  different_answers: string[];
  character_a: CharacterId;
  character_b: CharacterId;
};

export type PairWaitingData = {
  ready: false;
  status: string;
};

async function getAccessToken(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("SUPABASE_NOT_CONFIGURED");

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("AUTH_SESSION_MISSING");
  }

  return session.access_token;
}

async function authenticatedFetch(
  input: string,
  init: RequestInit,
): Promise<Response> {
  const token = await getAccessToken();

  return fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
}

export async function createInvitation(
  creatorSessionId: string,
): Promise<{ code: string; expiresAt: string }> {
  const response = await authenticatedFetch("/api/invitations", {
    method: "POST",
    body: JSON.stringify({ creatorSessionId }),
  });

  if (!response.ok) {
    throw new Error(`INVITATION_CREATE_FAILED_${response.status}`);
  }

  return response.json() as Promise<{ code: string; expiresAt: string }>;
}

export async function claimInvitation(
  code: string,
): Promise<{ invitationId: string }> {
  const response = await authenticatedFetch("/api/invitations/claim", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`INVITATION_CLAIM_FAILED_${response.status}`);
  }

  return response.json() as Promise<{ invitationId: string }>;
}

export async function completeInvitation(
  code: string,
  inviteeSessionId: string,
): Promise<{ overallSimilarity: number }> {
  const response = await authenticatedFetch("/api/invitations/complete", {
    method: "POST",
    body: JSON.stringify({ code, inviteeSessionId }),
  });

  if (!response.ok) {
    throw new Error(`INVITATION_COMPLETE_FAILED_${response.status}`);
  }

  return response.json() as Promise<{ overallSimilarity: number }>;
}

export async function getInvitationResult(
  code: string,
): Promise<PairResultData | PairWaitingData> {
  const response = await authenticatedFetch(
    `/api/invitations/result?code=${encodeURIComponent(code)}`,
    { method: "GET" },
  );

  if (!response.ok && response.status !== 202) {
    throw new Error(`INVITATION_RESULT_FAILED_${response.status}`);
  }

  return response.json() as Promise<PairResultData | PairWaitingData>;
}
