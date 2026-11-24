import { relationshipDimensions } from "@/lib/scoring";
import type { DimensionKey, DimensionScores } from "@/lib/types";

export type PairComparison = {
  overallSimilarity: number;
  answerSimilarity: number;
  dimensionSimilarity: Record<DimensionKey, number>;
  commonAnswers: string[];
  differentAnswers: string[];
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function comparePair(
  scoresA: DimensionScores,
  scoresB: DimensionScores,
  answersA: Record<string, string>,
  answersB: Record<string, string>,
): PairComparison {
  const dimensionSimilarity = {} as Record<DimensionKey, number>;

  for (const dimension of relationshipDimensions) {
    dimensionSimilarity[dimension] = clampScore(
      100 - Math.abs(scoresA[dimension] - scoresB[dimension]),
    );
  }

  const dimensionAverage =
    relationshipDimensions.reduce(
      (total, dimension) => total + dimensionSimilarity[dimension],
      0,
    ) / relationshipDimensions.length;

  const comparableQuestionIds = Object.keys(answersA).filter(
    (questionId) => typeof answersB[questionId] === "string",
  );

  const commonAnswers = comparableQuestionIds.filter(
    (questionId) => answersA[questionId] === answersB[questionId],
  );

  const differentAnswers = comparableQuestionIds.filter(
    (questionId) => answersA[questionId] !== answersB[questionId],
  );

  const answerSimilarity =
    comparableQuestionIds.length === 0
      ? 0
      : clampScore((commonAnswers.length / comparableQuestionIds.length) * 100);

  return {
    overallSimilarity: clampScore(dimensionAverage * 0.65 + answerSimilarity * 0.35),
    answerSimilarity,
    dimensionSimilarity,
    commonAnswers,
    differentAnswers,
  };
}
