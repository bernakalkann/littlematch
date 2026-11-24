import { NextRequest, NextResponse } from "next/server";
import { comparePair } from "@/lib/comparison";
import { hashInvitationCode } from "@/lib/invitations/crypto";
import {
  authenticateRequest,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";
import type { DimensionScores } from "@/lib/types";

export const dynamic = "force-dynamic";

function answersToMap(
  rows: Array<{ question_id: string; option_id: string }>,
): Record<string, string> {
  return Object.fromEntries(
    rows.map((row) => [row.question_id, row.option_id]),
  );
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const body = (await request.json()) as {
      code?: string;
      inviteeSessionId?: string;
    };

    const code = body.code?.trim();
    if (!code || !body.inviteeSessionId) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const codeHash = hashInvitationCode(code);

    const { data: invitation, error: invitationError } = await admin
      .from("invitations")
      .select("id,creator_id,creator_session_id,invitee_id,status,expires_at")
      .eq("code_hash", codeHash)
      .eq("invitee_id", user.id)
      .maybeSingle();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: "INVITATION_NOT_FOUND" }, { status: 404 });
    }

    if (new Date(invitation.expires_at as string).getTime() <= Date.now()) {
      return NextResponse.json({ error: "INVITATION_EXPIRED" }, { status: 410 });
    }

    const { data: inviteeSession } = await admin
      .from("test_sessions")
      .select("id,user_id,status,scores")
      .eq("id", body.inviteeSessionId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .maybeSingle();

    const { data: creatorSession } = await admin
      .from("test_sessions")
      .select("id,user_id,status,scores")
      .eq("id", invitation.creator_session_id)
      .eq("user_id", invitation.creator_id)
      .eq("status", "completed")
      .maybeSingle();

    if (!creatorSession || !inviteeSession) {
      return NextResponse.json(
        { error: "BOTH_TESTS_MUST_BE_COMPLETED" },
        { status: 409 },
      );
    }

    const [{ data: creatorAnswers }, { data: inviteeAnswers }] = await Promise.all([
      admin
        .from("test_answers")
        .select("question_id,option_id")
        .eq("session_id", creatorSession.id),
      admin
        .from("test_answers")
        .select("question_id,option_id")
        .eq("session_id", inviteeSession.id),
    ]);

    const comparison = comparePair(
      creatorSession.scores as DimensionScores,
      inviteeSession.scores as DimensionScores,
      answersToMap((creatorAnswers ?? []) as Array<{ question_id: string; option_id: string }>),
      answersToMap((inviteeAnswers ?? []) as Array<{ question_id: string; option_id: string }>),
    );

    const { error: resultError } = await admin
      .from("comparison_results")
      .upsert(
        {
          invitation_id: invitation.id,
          user_a_id: invitation.creator_id,
          user_b_id: user.id,
          overall_similarity: comparison.overallSimilarity,
          dimension_similarity: comparison.dimensionSimilarity,
          common_answers: comparison.commonAnswers,
          different_answers: comparison.differentAnswers,
        },
        { onConflict: "invitation_id" },
      );

    if (resultError) {
      console.error(resultError);
      return NextResponse.json({ error: "COMPARISON_SAVE_FAILED" }, { status: 500 });
    }

    const { error: updateError } = await admin
      .from("invitations")
      .update({
        invitee_session_id: inviteeSession.id,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", invitation.id)
      .eq("invitee_id", user.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ error: "INVITATION_UPDATE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({
      overallSimilarity: comparison.overallSimilarity,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
