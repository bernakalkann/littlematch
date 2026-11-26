"use client";

import { useState } from "react";
import { fabricColors, hairColors, toneColors } from "@/data/avatars";
import type { Locale } from "@/lib/types";
import { CustomAvatar } from "./CustomAvatar";

const categories = [
  { tr: "Görünüm", en: "Appearance", slots: [0] },
  { tr: "Renk", en: "Colors", slots: [1, 2, 4] },
  { tr: "Kıyafet", en: "Outfit", slots: [3] },
  { tr: "Aksesuar", en: "Accessories", slots: [5] },
];

const tools = [
  { tr: "Saç modeli", en: "Hairstyle", names: [["Küt", "Bob"], ["Kıvırcık", "Curly"], ["Örgülü", "Braids"], ["Kısa dalgalı", "Short waves"], ["Uzun", "Long"], ["Toplu", "Bun"]] },
  { tr: "Ten tonu", en: "Skin tone", colors: toneColors },
  { tr: "Saç rengi", en: "Hair color", colors: hairColors },
  { tr: "Kıyafet", en: "Outfit", names: [["Kazak", "Knit"], ["Kapüşonlu", "Hoodie"], ["Ceket", "Jacket"], ["Tulum", "Overalls"]] },
  { tr: "Kıyafet rengi", en: "Outfit color", colors: fabricColors },
  { tr: "Aksesuar", en: "Accessory", names: [["Yok", "None"], ["Gözlük", "Glasses"], ["Bere", "Beanie"], ["Atkı", "Scarf"], ["Toka", "Clip"]] },
];

export function AvatarStudio({ locale, look, active, onChange }: {
  locale: Locale;
  look: string;
  active: boolean;
  onChange: (look: string) => void;
}) {
  const [category, setCategory] = useState(0);

  return (
    <div className="wardrobe">
      <div className="wardrobe-tabs" role="group" aria-label={locale === "tr" ? "Avatar kategorileri" : "Avatar categories"}>
        {categories.map((entry, index) => <button type="button" key={entry.en}
          aria-pressed={category === index} onClick={() => setCategory(index)}>{entry[locale]}</button>)}
      </div>
      <div className="wardrobe-options">
        {categories[category].slots.map((slot) => {
          const tool = tools[slot];
          return <fieldset key={slot}>
            <legend>{tool[locale]}</legend>
            <div className={tool.colors ? "wardrobe-swatches" : "wardrobe-tiles"}>
              {(tool.colors ?? tool.names ?? []).map((_, index) => {
                const label = tool.names?.[index]?.[locale === "tr" ? 0 : 1] ?? `${tool[locale]} ${index + 1}`;
                const optionLook = look.slice(0, slot) + index + look.slice(slot + 1);
                const selected = active && Number(look[slot]) === index;

                return <button type="button" key={label} aria-label={label} title={label} aria-pressed={selected}
                  style={tool.colors ? { backgroundColor: tool.colors[index] } : undefined} onClick={() => onChange(optionLook)}>
                  {!tool.colors && <><span className={slot === 3 ? "outfit-sample" : "wardrobe-sample"}>
                    <CustomAvatar look={optionLook} />
                  </span><span>{label}</span></>}
                  {selected && <i aria-hidden="true">✓</i>}
                </button>;
              })}
            </div>
          </fieldset>;
        })}
      </div>
    </div>
  );
}
