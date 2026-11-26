export type AvatarGroup = "girl" | "boy";
export type AvatarId = `${AvatarGroup}-${1 | 2 | 3 | 4 | 5}`;

export const avatarIds = [
  "girl-1", "girl-2", "girl-3", "girl-4", "girl-5",
  "boy-1", "boy-2", "boy-3", "boy-4", "boy-5",
] as const satisfies readonly AvatarId[];

export function isAvatarId(value: unknown): value is AvatarId {
  return avatarIds.some((id) => id === value);
}

export const lookPattern = /^[0-5][0-4][0-4][0-3][0-4][0-4]$/;
export const defaultLook = "001020";

export function readLook(value: unknown): string | null {
  return typeof value === "string" && lookPattern.test(value) ? value : null;
}

export function randomLook(): string {
  return [6, 5, 5, 4, 5, 5].map((size) => Math.floor(Math.random() * size)).join("");
}

export const toneColors = ["#f4c7a2", "#dcaa82", "#bc875c", "#986445", "#6c4233"];
export const hairColors = ["#352a28", "#614334", "#a65d42", "#b89357", "#4e354c"];
export const fabricColors = ["#718164", "#74889c", "#a05f4f", "#b68c49", "#8d7392"];
