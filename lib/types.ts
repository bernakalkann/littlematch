export type Locale = "tr" | "en";

export type LocalizedText = {
  tr: string;
  en: string;
};

export type DimensionKey =
  | "depth"
  | "communication"
  | "romance"
  | "trust"
  | "space"
  | "adventure"
  | "future";

export type DimensionScores = Record<DimensionKey, number>;

export type QuestionOption = {
  id: string;
  label: LocalizedText;
  weights: Partial<Record<DimensionKey, number>>;
};

export type Question = {
  id: string;
  scene: LocalizedText;
  prompt: LocalizedText;
  options: QuestionOption[];
};

export type CharacterId =
  | "fox"
  | "cat"
  | "dog"
  | "rabbit"
  | "owl"
  | "bear"
  | "otter"
  | "hedgehog";

export type CharacterProfile = {
  id: CharacterId;
  animal: LocalizedText;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  strengths: LocalizedText[];
  values: LocalizedText[];
  communication: LocalizedText;
  habitat: LocalizedText;
  target: DimensionScores;
};
