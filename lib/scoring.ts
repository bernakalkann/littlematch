import { characters } from "@/data/characters";
import { questions } from "@/data/questions";
import type {
  CharacterProfile,
  DimensionKey,
  DimensionScores,
} from "@/lib/types";

const dimensions: DimensionKey[] = [
  "depth",
  "communication",
  "romance",
  "trust",
  "space",
  "adventure",
  "future",
];

export type AnswerMap = Record<string, string>;

export type CharacterMatch = {
  character: CharacterProfile;
  scores: DimensionScores;
  distance: number;
};

function emptyScores(): DimensionScores {
  return {
    depth: 0,
    communication: 0,
    romance: 0,
    trust: 0,
    space: 0,
    adventure: 0,
    future: 0,
  };
}

function calculateMaximums(): DimensionScores {
  const maximums = emptyScores();

  for (const question of questions) {
    for (const dimension of dimensions) {
      const maxForQuestion = Math.max(
        ...question.options.map((option) => option.weights[dimension] ?? 0),
      );
      maximums[dimension] += maxForQuestion;
    }
  }

  return maximums;
}

const maximums = calculateMaximums();

export function calculateDimensionScores(answers: AnswerMap): DimensionScores {
  const raw = emptyScores();

  for (const question of questions) {
    const selectedId = answers[question.id];
    if (!selectedId) continue;

    const option = question.options.find((item) => item.id === selectedId);
    if (!option) continue;

    for (const dimension of dimensions) {
      raw[dimension] += option.weights[dimension] ?? 0;
    }
  }

  const normalized = emptyScores();

  for (const dimension of dimensions) {
    const maximum = maximums[dimension];
    normalized[dimension] =
      maximum === 0 ? 0 : Math.round((raw[dimension] / maximum) * 100);
  }

  return normalized;
}

export function getCharacterMatch(answers: AnswerMap): CharacterMatch {
  const scores = calculateDimensionScores(answers);

  const ranked = characters
    .map((character, index) => {
      const squaredDistance = dimensions.reduce((sum, dimension) => {
        const difference = scores[dimension] - character.target[dimension];
        return sum + difference * difference;
      }, 0);

      return {
        character,
        scores,
        distance: Math.sqrt(squaredDistance),
        index,
      };
    })
    .sort((a, b) => a.distance - b.distance || a.index - b.index);

  return ranked[0];
}

export function isTestComplete(answers: AnswerMap): boolean {
  return questions.every((question) => Boolean(answers[question.id]));
}

export const relationshipDimensions = dimensions;
