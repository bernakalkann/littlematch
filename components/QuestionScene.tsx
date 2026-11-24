type QuestionSceneProps = {
  index: number;
};

const sceneDetails = [
  ["moon", "tiny-phone"],
  ["sun", "road-sign"],
  ["rain-cloud", "two-cups"],
  ["gift", "spark"],
  ["far-lights", "paper-plane"],
  ["lamp", "letter"],
  ["stars", "little-house"],
  ["books", "plant"],
  ["window", "tea"],
  ["campfire", "trail"],
  ["flower", "notebook"],
  ["lake-moon", "bench"],
] as const;

export function QuestionScene({ index }: QuestionSceneProps) {
  const details = sceneDetails[index % sceneDetails.length];

  return (
    <div className={"question-scene scene-" + (index + 1)} aria-hidden="true">
      <span className="scene-sky" />
      <span className="scene-ground" />
      <span className={"scene-detail detail-" + details[0]} />
      <span className={"scene-detail detail-" + details[1]} />
      <span className="scene-character scene-character-left">
        <i className="ear ear-a" />
        <i className="ear ear-b" />
        <i className="eye eye-a" />
        <i className="eye eye-b" />
        <i className="smile" />
      </span>
      <span className="scene-character scene-character-right">
        <i className="ear ear-a" />
        <i className="ear ear-b" />
        <i className="eye eye-a" />
        <i className="eye eye-b" />
        <i className="smile" />
      </span>
    </div>
  );
}
