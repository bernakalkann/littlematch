import { readLook, type AvatarId } from "@/data/avatars";
import { CustomAvatar } from "./CustomAvatar";

type AvatarPortraitProps = {
  id: AvatarId;
  look?: string | null;
};

export function AvatarPortrait({ id, look }: AvatarPortraitProps) {
  const [group, slot] = id.split("-");
  const left = (Number(slot) - 1) * 25;
  const custom = readLook(look);
  if (custom) return <CustomAvatar look={custom} />;
  return (
    <span
      className="avatar-portrait"
      style={{ backgroundPosition: `${left}% ${group === "girl" ? 0 : 100}%` }}
      aria-hidden="true"
    />
  );
}
