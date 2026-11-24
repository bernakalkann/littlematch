"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import type { Locale } from "@/lib/types";
import type { AnswerMap } from "@/lib/scoring";
import { GameView } from "./GameView";
import { LandingView } from "./LandingView";

type Phase = "landing" | "game" | "result";

type SavedSession = {
  locale?: Locale;
  phase?: Phase;
  index?: number;
  answers?: AnswerMap;
};

const storageKey = "littlematch-session-v1";

export function LittleMatchApp() {
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocale] = useState<Locale>("tr");
  const [phase, setPhase] = useState<Phase>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as SavedSession;
        if (saved.locale === "tr" || saved.locale === "en") {
          setLocale(saved.locale);
        }
        if (saved.phase === "game" || saved.phase === "result") {
          setPhase(saved.phase);
        }
        if (
          typeof saved.index === "number" &&
          saved.index >= 0 &&
          saved.index < questions.length
        ) {
          setIndex(saved.index);
        }
        if (saved.answers && typeof saved.answers === "object") {
          setAnswers(saved.answers);
        }
      } else if (navigator.language.toLowerCase().startsWith("en")) {
        setLocale("en");
      }
    } catch {
      // A broken local session should never block the game.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (!hydrated) return;

    const session: SavedSession = { locale, phase, index, answers };
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }, [answers, hydrated, index, locale, phase]);

  const handleAnswer = (optionId: string) => {
    const question = questions[index];
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    if (index === questions.length - 1) {
      setPhase("result");
      return;
    }

    setIndex((current) => current + 1);
  };

  const handleBack = () => {
    setIndex((current) => Math.max(0, current - 1));
  };

  const handleHome = () => {
    setPhase("landing");
  };

  if (!hydrated) {
    return <div className="session-loader" aria-label="LittleMatch loading">✦</div>;
  }

  if (phase === "game") {
    return (
      <GameView
        locale={locale}
        index={index}
        selectedOption={answers[questions[index].id]}
        onAnswer={handleAnswer}
        onBack={handleBack}
        onHome={handleHome}
        onLocaleChange={setLocale}
      />
    );
  }

  if (phase === "result") {
    return (
      <main className="result-placeholder">
        <button className="game-wordmark" type="button" onClick={handleHome}>
          littlematch<span>✦</span>
        </button>
        <div>
          <span className="result-spark">✦</span>
          <p>{copyFallback(locale)}</p>
        </div>
      </main>
    );
  }

  return (
    <LandingView
      locale={locale}
      onLocaleChange={setLocale}
      onStart={() => setPhase("game")}
    />
  );
}

function copyFallback(locale: Locale) {
  return locale === "tr" ? "Karakterin hazırlanıyor..." : "Preparing your character...";
}
