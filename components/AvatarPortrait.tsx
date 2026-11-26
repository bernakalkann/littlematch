import type { AvatarId } from "@/data/avatars";

type AvatarPortraitProps = {
  id: AvatarId;
};

export function AvatarPortrait({ id }: AvatarPortraitProps) {
  const [group, slot] = id.split("-");
  const left = (Number(slot) - 1) * 25;
  return (
    <span
      className="avatar-portrait"
      style={{ backgroundPosition: `${left}% ${group === "girl" ? 0 : 100}%` }}
      aria-hidden="true"
    />
  );
}
