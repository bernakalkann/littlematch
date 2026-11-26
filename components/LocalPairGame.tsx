"use client";

import { useState } from "react";
import { questions } from "@/data/questions";
import { comparePair } from "@/lib/comparison";
import type { PairResultData } from "@/lib/invitations/client";
import { getCharacterMatch, type AnswerMap } from "@/lib/scoring";
import type { Locale } from "@/lib/types";
import { GameView } from "./GameView";
import { LanguageToggle } from "./LanguageToggle";
import { PairResultView } from "./PairResultView";

const copy = {
  tr: {
    title: "Uyumunuzu keşfedin",
    intro: "Aynı cihazda sırayla 12 soruyu cevaplayın. Her oyuncu kendi cevaplarını görür, uyum haritanız ikinci tur bitince açılır.",
    start: "İlk oyuncu başlasın",
    pass: "Sıra ikinci oyuncuda",
    handoff: "Cihazı ikinci oyuncuya ver. Hazır olunca o da 12 soruyu kendi cevaplasın.",
    next: "İkinci oyuncu başlasın",
    first: "1. oyuncu",
    second: "2. oyuncu",
  },
  en: {
    title: "Discover your match",
    intro: "Take turns answering 12 questions on the same device. Each player sees their own answers, and your match map opens after the second round.",
    start: "Start player one's turn",
    pass: "Player two's turn",
    handoff: "Pass the device to player two. When they're ready, they'll answer the same 12 questions.",
    next: "Start player two's turn",
    first: "Player one",
    second: "Player two",
  },
};

export function LocalPairGame({ locale, onLocaleChange, onHome }: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onHome: () => void;
}) {
  const [step, setStep] = useState<"intro" | "first" | "handoff" | "second">("intro");
  const [index, setIndex] = useState(0);
  const [firstAnswers, setFirstAnswers] = useState<AnswerMap>({});
  const [currentAnswers, setCurrentAnswers] = useState<AnswerMap>({});
  const [result, setResult] = useState<PairResultData | null>(null);
  const t = copy[locale];

  function answer(optionId: string) {
    const nextAnswers = { ...currentAnswers, [questions[index].id]: optionId };
    setCurrentAnswers(nextAnswers);

    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    if (step === "first") {
      setFirstAnswers(nextAnswers);
      setCurrentAnswers({});
      setIndex(0);
      setStep("handoff");
      return;
    }

    const first = getCharacterMatch(firstAnswers);
    const second = getCharacterMatch(nextAnswers);
    const comparison = comparePair(first.scores, second.scores, firstAnswers, nextAnswers);
    setResult({
      ready: true,
      overall_similarity: comparison.overallSimilarity,
      dimension_similarity: comparison.dimensionSimilarity,
      common_answers: comparison.commonAnswers,
      different_answers: comparison.differentAnswers,
      character_a: first.character.id,
      character_b: second.character.id,
    });
  }

  if (result) return <PairResultView locale={locale} data={result} onHome={onHome} />;

  if (step === "first" || step === "second") {
    return (
      <GameView
        locale={locale}
        index={index}
        selectedOption={currentAnswers[questions[index].id]}
        syncState="local"
        turnLabel={step === "first" ? t.first : t.second}
        onAnswer={answer}
        onBack={() => setIndex(Math.max(0, index - 1))}
        onHome={onHome}
        onLocaleChange={onLocaleChange}
      />
    );
  }

  return (
    <main className="pair-result-shell">
      <header className="game-topbar">
        <button type="button" className="game-wordmark" onClick={onHome}>
          littlematch<span>✦</span>
        </button>
        <LanguageToggle locale={locale} onChange={onLocaleChange} compact />
      </header>
      <section className="pair-hero pair-intro">
        <h1>{step === "intro" ? t.title : t.pass}</h1>
        <p>{step === "intro" ? t.intro : t.handoff}</p>
        <button type="button" className="primary-result-action" onClick={() => setStep(step === "intro" ? "first" : "second")}>
          {step === "intro" ? t.start : t.next}
        </button>
      </section>
    </main>
  );
}
