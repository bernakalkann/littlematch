import { createHash, randomBytes } from "node:crypto";

export function createInvitationCode(): string {
  return randomBytes(18).toString("base64url");
}

export function hashInvitationCode(code: string): string {
  return createHash("sha256").update(code, "utf8").digest("hex");
}
