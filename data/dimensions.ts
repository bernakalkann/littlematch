import type { DimensionKey, LocalizedText } from "@/lib/types";

export const dimensionLabels: Record<DimensionKey, LocalizedText> = {
  depth: { tr: "Duygusal derinlik", en: "Emotional depth" },
  communication: { tr: "İletişim", en: "Communication" },
  romance: { tr: "Romantik yaklaşım", en: "Romantic expression" },
  trust: { tr: "Güven & bağlılık", en: "Trust & commitment" },
  space: { tr: "Kişisel alan", en: "Personal space" },
  adventure: { tr: "Yenilik & macera", en: "Novelty & adventure" },
  future: { tr: "Gelecek odağı", en: "Future focus" },
};
