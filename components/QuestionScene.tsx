export function QuestionScene({ index }: { index: number }) {
  return (
    <div
      className="question-scene"
      style={{ backgroundPosition: `${index % 4 * 100 / 3}% ${Math.floor(index / 4) * 50}%` }}
      aria-hidden="true"
    />
  );
}
