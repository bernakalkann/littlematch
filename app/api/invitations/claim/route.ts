import { NextRequest, NextResponse } from "next/server";
import { hashInvitationCode } from "@/lib/invitations/crypto";
import {
  authenticateRequest,
  getSupabaseAdminClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const body = (await request.json()) as { code?: string };
    const code = body.code?.trim();

    if (!code || code.length > 200) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const codeHash = hashInvitationCode(code);

    const { data: invitation, error } = await admin
      .from("invitations")
      .select("id,creator_id,invitee_id,status,expires_at")
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (error || !invitation) {
      return NextResponse.json({ error: "INVITATION_NOT_FOUND" }, { status: 404 });
    }

    if (new Date(invitation.expires_at as string).getTime() <= Date.now()) {
      await admin
        .from("invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return NextResponse.json({ error: "INVITATION_EXPIRED" }, { status: 410 });
    }

    if (invitation.creator_id === user.id) {
      return NextResponse.json({ error: "CANNOT_CLAIM_OWN_INVITE" }, { status: 409 });
    }

    if (invitation.invitee_id && invitation.invitee_id !== user.id) {
      return NextResponse.json({ error: "INVITATION_ALREADY_CLAIMED" }, { status: 409 });
    }

    if (!["open", "claimed"].includes(invitation.status as string)) {
      return NextResponse.json({ error: "INVITATION_NOT_OPEN" }, { status: 409 });
    }

    const { data: claimed, error: claimError } = await admin
      .from("invitations")
      .update({
        invitee_id: user.id,
        status: "claimed",
        claimed_at: new Date().toISOString(),
      })
      .eq("id", invitation.id)
      .or(`invitee_id.is.null,invitee_id.eq.${user.id}`)
      .select("id")
      .maybeSingle();

    if (claimError || !claimed) {
      return NextResponse.json({ error: "INVITATION_CLAIM_CONFLICT" }, { status: 409 });
    }

    return NextResponse.json({ invitationId: claimed.id });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    console.error(error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
