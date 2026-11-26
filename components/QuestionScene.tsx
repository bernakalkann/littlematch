const sceneIndex: Record<string, number> = {
  "late-night-thought": 0,
  "unplanned-day": 1,
  "small-argument": 2,
  surprise: 3,
  "time-apart": 4,
  feelings: 5,
  future: 6,
  "personal-space": 7,
  reassurance: 8,
  "new-thing": 9,
  "remembered-detail": 10,
  "quiet-moment": 11,
};

export function QuestionScene({ questionId }: { questionId: string }) {
  if (questionId === "unplanned-day") return <div className="question-scene quiz-rain" aria-hidden="true" />;

  const index = sceneIndex[questionId] ?? 0;

  return (
    <div
      className="question-scene"
      style={{ backgroundPosition: `${index % 4 * 100 / 3}% ${Math.floor(index / 4) * 50}%` }}
      aria-hidden="true"
    />
  );
}
