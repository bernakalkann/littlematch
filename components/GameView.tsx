"use client";

import { copy } from "@/data/copy";
import { questions } from "@/data/questions";
import type { Locale } from "@/lib/types";
import { LanguageToggle } from "./LanguageToggle";
import { QuestionScene } from "./QuestionScene";

type SyncState = "local" | "cloud" | "saving" | "error";

type GameViewProps = {
  locale: Locale;
  index: number;
  selectedOption?: string;
  syncState: SyncState;
  onAnswer: (optionId: string) => void | Promise<void>;
  onBack: () => void;
  onHome: () => void;
  onLocaleChange: (locale: Locale) => void;
};

export function GameView({
  locale,
  index,
  selectedOption,
  syncState,
  onAnswer,
  onBack,
  onHome,
  onLocaleChange,
}: GameViewProps) {
  const t = copy[locale];
  const question = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);
  const saveLabel =
    syncState === "saving"
      ? t.saving
      : syncState === "error"
        ? t.syncError
        : syncState === "cloud"
          ? t.cloudSaved
          : t.saved;

  return (
    <main className="game-shell">
      <header className="game-topbar">
        <button type="button" className="game-wordmark" onClick={onHome}>
          littlematch<span>✦</span>
        </button>
        <LanguageToggle locale={locale} onChange={onLocaleChange} compact />
      </header>

      <div className="game-progress-wrap" aria-label={progress + "%"}>
        <div className="progress-meta">
          <span>{t.question} {index + 1} {t.of} {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-track">
          <span style={{ width: progress + "%" }} />
        </div>
      </div>

      <section className="game-layout">
        <div className="question-art">
          <QuestionScene index={index} />
          <p className="scene-caption">{question.scene[locale]}</p>
        </div>

        <div className="question-copy">
          <p className="question-kicker">{t.choose}</p>
          <h1>{question.prompt[locale]}</h1>

          <div className="answer-stack">
            {question.options.map((option, optionIndex) => (
              <button
                key={option.id}
                type="button"
                disabled={syncState === "saving"}
                className={
                  "answer-choice " +
                  (selectedOption === option.id ? "selected" : "")
                }
                onClick={() => onAnswer(option.id)}
              >
                <span className="choice-letter">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span>{option.label[locale]}</span>
              </button>
            ))}
          </div>

          <div className="game-footer">
            <button
              type="button"
              className="text-action"
              onClick={onBack}
              disabled={index === 0 || syncState === "saving"}
            >
              ← {t.back}
            </button>
            <span className={"save-note sync-" + syncState}>✦ {saveLabel}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
