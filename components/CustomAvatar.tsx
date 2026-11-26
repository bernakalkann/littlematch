import type { CSSProperties } from "react";
import { fabricColors, hairColors, toneColors } from "@/data/avatars";

export function CustomAvatar({ look }: { look: string }) {
  const [hair, tone, hairColor, clothing, fabric, accessory] = [...look].map(Number);
  const colors = {
    "--avatar-skin": toneColors[tone],
    "--avatar-hair": hairColors[hairColor],
    "--avatar-fabric": fabricColors[fabric],
  } as CSSProperties;

  return (
    <span className={`custom-avatar hair-${hair} clothing-${clothing} accessory-${accessory}`} style={colors} aria-hidden="true">
      <i className="avatar-hair-back" />
      <i className="avatar-body" />
      <i className="avatar-neck" />
      <i className="avatar-ear ear-left" />
      <i className="avatar-ear ear-right" />
      <i className="avatar-face">
        <i className="avatar-eye eye-left" />
        <i className="avatar-eye eye-right" />
        <i className="avatar-nose" />
        <i className="avatar-smile" />
      </i>
      <i className="avatar-fringe" />
      <i className="avatar-accessory" />
    </span>
  );
}
