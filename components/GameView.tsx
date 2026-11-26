"use client";

import { copy } from "@/data/copy";
import { questions } from "@/data/questions";
import type { Locale } from "@/lib/types";
import { SceneHeader, type SceneAccount } from "./SceneHeader";
import { QuestionScene } from "./QuestionScene";

type SyncState = "local" | "cloud" | "saving" | "error";

export function GameView({
  locale, index, selectedOption, syncState, turnLabel, account,
  onSelect, onAnswer, onBack, onHome, onLocaleChange,
}: {
  locale: Locale;
  index: number;
  selectedOption?: string;
  syncState: SyncState;
  turnLabel?: string;
  account?: SceneAccount;
  onSelect: (optionId: string) => void;
  onAnswer: (optionId: string) => void | Promise<void>;
  onBack: () => void;
  onHome: () => void;
  onLocaleChange: (locale: Locale) => void;
}) {
  const t = copy[locale];
  const question = questions[index];
  const selection = question.options.find(({ id }) => id === selectedOption);
  const busy = syncState === "saving";
  const saveLabel = busy ? t.saving : syncState === "error" ? t.syncError : syncState === "cloud" ? t.cloudSaved : t.saved;

  return (
    <main className="painted-shell painted-quiz">
      <SceneHeader locale={locale} account={account} onHome={onHome} onLocaleChange={onLocaleChange} />
      <section className="painted-split quiz-layout">
        <figure className="quiz-illustration">
          <QuestionScene questionId={question.id} />
          <figcaption>{question.scene[locale]}</figcaption>
        </figure>
        <div className="quiz-right">
          <div className="quiz-progress">
            <span>{index + 1} / {questions.length}</span>
            <progress aria-label={t.question} value={index + 1} max={questions.length} />
          </div>
          <form className="paper-panel quiz-panel" onSubmit={(event) => {
            event.preventDefault();
            if (selection && !busy) void onAnswer(selection.id);
          }}>
            <h1 id="current-question">{question.prompt[locale]}</h1>
            <fieldset className="quiz-options" aria-labelledby="current-question" disabled={busy}>
              {question.options.map((option) => (
                <label className="quiz-option" key={option.id}>
                  <input type="radio" name="answer" value={option.id} checked={option.id === selection?.id}
                    onChange={() => onSelect(option.id)} />
                  <span>{option.label[locale]}</span>
                  {option.id === selection?.id && <i aria-hidden="true">✓</i>}
                </label>
              ))}
            </fieldset>
            <div className="quiz-actions">
              <button type="button" className="scene-button" onClick={onBack} disabled={index === 0 || busy}>{t.back}</button>
              <button type="submit" className="scene-button scene-gold" disabled={!selection || busy}>{t.next}</button>
            </div>
            <p className="quiz-save" role="status">{turnLabel ?? saveLabel}</p>
          </form>
        </div>
      </section>
    </main>
  );
}
