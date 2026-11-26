"use client";

import { fabricColors, hairColors, randomLook, toneColors } from "@/data/avatars";
import type { Locale } from "@/lib/types";
import { CustomAvatar } from "./CustomAvatar";

const tools = [
  { tr: "Saç modeli", en: "Hairstyle", names: [["Küt", "Bob"], ["Kıvırcık", "Curly"], ["Örgülü", "Braids"], ["Kısa dalgalı", "Short waves"], ["Uzun", "Long"], ["Toplu", "Bun"]] },
  { tr: "Ten tonu", en: "Skin tone", colors: toneColors },
  { tr: "Saç rengi", en: "Hair color", colors: hairColors },
  { tr: "Kıyafet", en: "Outfit", names: [["Kazak", "Knit"], ["Kapüşonlu", "Hoodie"], ["Ceket", "Jacket"], ["Tulum", "Overalls"]] },
  { tr: "Kıyafet rengi", en: "Outfit color", colors: fabricColors },
  { tr: "Aksesuar", en: "Accessory", names: [["Yok", "None"], ["Gözlük", "Glasses"], ["Bere", "Beanie"], ["Atkı", "Scarf"], ["Toka", "Clip"]] },
];

export function AvatarStudio({ locale, look, onChange }: {
  locale: Locale;
  look: string;
  onChange: (look: string) => void;
}) {
  return (
    <div className="avatar-studio">
      <div className="studio-stage">
        <CustomAvatar look={look} />
        <button className="secondary-result-action" type="button" onClick={() => onChange(randomLook())}>
          {locale === "tr" ? "✦ Sürpriz görünüm" : "✦ Surprise look"}
        </button>
      </div>
      <div className="studio-controls">
        {tools.map((tool, slot) => <fieldset key={tool.en}>
          <legend>{tool[locale]}</legend>
          <div className="studio-options">
            {(tool.colors ?? tool.names ?? []).map((_, index) => {
              const label = tool.names?.[index]?.[locale === "tr" ? 0 : 1] ?? `${tool[locale]} ${index + 1}`;
              return <button type="button" key={label} aria-label={label} title={label} aria-pressed={Number(look[slot]) === index}
                className={tool.colors ? "studio-swatch" : ""}
                style={tool.colors ? { backgroundColor: tool.colors[index] } : undefined}
                onClick={() => onChange(look.slice(0, slot) + index + look.slice(slot + 1))}>
                {!tool.colors && label}
              </button>;
            })}
          </div>
        </fieldset>)}
      </div>
    </div>
  );
}
