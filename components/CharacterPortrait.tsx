import { useId } from "react";
import type { CharacterId } from "@/lib/types";

type CharacterPortraitProps = {
  id: CharacterId;
};

export function CharacterPortrait({ id }: CharacterPortraitProps) {
  const wobbleId = "portrait-wobble-" + useId().replace(/[^\w-]/g, "");
  const pointed = id === "fox" || id === "cat" || id === "hedgehog";
  const floppy = id === "dog";
  const longEars = id === "rabbit";
  const roundEars = id === "bear" || id === "otter";
  const owl = id === "owl";

  return (
    <svg
      className={"character-portrait portrait-" + id}
      viewBox="0 0 360 360"
      role="img"
      aria-label={id}
    >
      <defs>
        <filter id={wobbleId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g
        filter={`url(#${wobbleId})`}
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse className="portrait-shadow" cx="180" cy="315" rx="103" ry="22" />

        {id === "hedgehog" && (
          <path
            className="portrait-spines"
            d="M69 239 44 218l25-15-19-28 31-5-8-33 33 7 6-34 29 18 18-31 22 27 26-25 13 32 31-16 2 35 34-6-9 33 31 7-20 28 25 18-30 14 15 29-34 1 5 34-33-9-8 33-29-18-18 29-23-26-25 24-14-31-31 15-3-34-34 5 10-32-31-8 20-27-25-19 30-13-15-30 34-1z"
          />
        )}

        {pointed && id !== "hedgehog" && (
          <>
            <path className="portrait-ear" d="M104 110 124 50l42 58z" />
            <path className="portrait-ear" d="m194 108 43-57 18 65z" />
          </>
        )}

        {floppy && (
          <>
            <path className="portrait-ear portrait-flop" d="M116 99c-47 3-65 50-43 91 15 27 46 24 55-7 8-29 6-58-12-84z" />
            <path className="portrait-ear portrait-flop" d="M239 99c46 7 61 55 36 93-17 25-47 19-53-12-6-29-2-57 17-81z" />
          </>
        )}

        {longEars && (
          <>
            <path className="portrait-ear" d="M122 118c-14-59-3-101 18-105 24-4 28 44 24 103z" />
            <path className="portrait-ear" d="M200 116c-1-62 10-105 34-101 23 5 24 51 7 107z" />
          </>
        )}

        {roundEars && (
          <>
            <circle className="portrait-ear" cx="119" cy="108" r="31" />
            <circle className="portrait-ear" cx="241" cy="108" r="31" />
          </>
        )}

        {owl ? (
          <>
            <path className="portrait-body" d="M87 172c0-70 42-117 93-117s94 47 94 117v79c0 57-37 85-94 85s-93-28-93-85z" />
            <circle className="portrait-eye-patch" cx="140" cy="164" r="39" />
            <circle className="portrait-eye-patch" cx="220" cy="164" r="39" />
            <circle className="portrait-eye-dot" cx="144" cy="164" r="8" />
            <circle className="portrait-eye-dot" cx="216" cy="164" r="8" />
            <path className="portrait-beak" d="m180 180-14 17h28z" />
            <path className="portrait-wing" d="M102 216c-21 25-21 69 4 88" fill="none" />
            <path className="portrait-wing" d="M258 216c21 25 21 69-4 88" fill="none" />
          </>
        ) : (
          <>
            <path
              className="portrait-body"
              d="M92 176c0-68 37-114 88-114 55 0 91 47 91 114v70c0 59-37 89-91 89-53 0-88-31-88-89z"
            />
            <path className="portrait-eye-line" d="M130 175c9 8 18 8 27 0" fill="none" />
            <path className="portrait-eye-line" d="M205 175c9 8 18 8 27 0" fill="none" />
            <path className="portrait-nose" d="M174 194h12l-6 7z" />
            <path className="portrait-smile" d="M180 202v9m0 0c-8 9-18 8-23 1m23-1c8 9 18 8 23 1" fill="none" />
            {id === "fox" && (
              <path className="portrait-mark" d="M112 151c18-34 39-45 68-46-9 19-20 34-35 49zm136 0c-18-34-39-45-68-46 9 19 20 34 35 49z" />
            )}
            {id === "otter" && (
              <path className="portrait-mark" d="M126 214c23 21 85 21 108 0-5 49-28 70-54 70s-49-21-54-70z" />
            )}
            {id === "hedgehog" && (
              <path className="portrait-mark" d="M112 128c36-30 102-32 136 3-10-47-41-73-72-73-32 0-58 23-64 70z" />
            )}
          </>
        )}

        <path className="portrait-scarf" d="M118 269c32 20 93 20 125-2l-7 52H123z" />
        <circle className="portrait-pin" cx="180" cy="293" r="10" />
      </g>
    </svg>
  );
}
