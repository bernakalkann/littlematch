import { NextRequest, NextResponse } from "next/server";
import {
  createInvitationCode,
  hashInvitationCode,
} from "@/lib/invitations/crypto";
import {
  authenticateRequest,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const body = (await request.json()) as { creatorSessionId?: string };

    if (!body.creatorSessionId) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();

    const { data: session, error: sessionError } = await admin
      .from("test_sessions")
      .select("id,status")
      .eq("id", body.creatorSessionId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "COMPLETED_TEST_REQUIRED" },
        { status: 409 },
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("invitations")
      .select("id", { count: "exact", head: true })
      .eq("creator_id", user.id)
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= 20) {
      return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
    }

    const code = createInvitationCode();
    const codeHash = hashInvitationCode(code);
    const expiresAt = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { error } = await admin.from("invitations").insert({
      creator_id: user.id,
      creator_session_id: body.creatorSessionId,
      code_hash: codeHash,
      expires_at: expiresAt,
      status: "open",
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "INVITATION_CREATE_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ code, expiresAt }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
