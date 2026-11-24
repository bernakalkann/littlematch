import { NextRequest, NextResponse } from "next/server";
import { hashInvitationCode } from "@/lib/invitations/crypto";
import {
  authenticateRequest,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const code = request.nextUrl.searchParams.get("code")?.trim();

    if (!code) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const codeHash = hashInvitationCode(code);

    const { data: invitation } = await admin
      .from("invitations")
      .select("id,creator_id,invitee_id,status")
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (
      !invitation ||
      (invitation.creator_id !== user.id && invitation.invitee_id !== user.id)
    ) {
      return NextResponse.json({ error: "INVITATION_NOT_FOUND" }, { status: 404 });
    }

    if (invitation.status !== "completed") {
      return NextResponse.json(
        { status: invitation.status, ready: false },
        { status: 202 },
      );
    }

    const { data: comparison } = await admin
      .from("comparison_results")
      .select(
        "overall_similarity,dimension_similarity,common_answers,different_answers",
      )
      .eq("invitation_id", invitation.id)
      .maybeSingle();

    if (!comparison) {
      return NextResponse.json({ error: "RESULT_NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ready: true, ...comparison });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
