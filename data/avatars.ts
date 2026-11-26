export type AvatarGroup = "girl" | "boy";
export type AvatarId = `${AvatarGroup}-${1 | 2 | 3 | 4 | 5}`;

export const avatarIds = [
  "girl-1", "girl-2", "girl-3", "girl-4", "girl-5",
  "boy-1", "boy-2", "boy-3", "boy-4", "boy-5",
] as const satisfies readonly AvatarId[];

export function isAvatarId(value: unknown): value is AvatarId {
  return avatarIds.some((id) => id === value);
}
