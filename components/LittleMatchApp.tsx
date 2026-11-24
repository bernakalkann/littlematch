"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import { getCharacterMatch, type AnswerMap } from "@/lib/scoring";
import {
  completeRemoteTest,
  createRemoteTestSession,
  saveRemoteAnswer,
  type RemoteTestSession,
} from "@/lib/supabase/test-storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Locale } from "@/lib/types";
import { GameView } from "./GameView";
import { LandingView } from "./LandingView";
import { ResultView } from "./ResultView";

type Phase = "landing" | "game" | "result";
type SyncState = "local" | "cloud" | "saving" | "error";

type SavedSession = {
  locale?: Locale;
  phase?: Phase;
  index?: number;
  answers?: AnswerMap;
  remoteSession?: RemoteTestSession | null;
};

const storageKey = "littlematch-session-v1";

export function LittleMatchApp() {
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocale] = useState<Locale>("tr");
  const [phase, setPhase] = useState<Phase>("landing");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [remoteSession, setRemoteSession] = useState<RemoteTestSession | null>(null);
  const [syncState, setSyncState] = useState<SyncState>(
    isSupabaseConfigured() ? "cloud" : "local",
  );

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
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

          if (
            saved.remoteSession?.id &&
            saved.remoteSession?.userId &&
            isSupabaseConfigured()
          ) {
            setRemoteSession(saved.remoteSession);
            setSyncState("cloud");
          }
        } else if (navigator.language.toLowerCase().startsWith("en")) {
          setLocale("en");
        }
      } catch {
        setSyncState(isSupabaseConfigured() ? "error" : "local");
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    if (!hydrated) return;

    const session: SavedSession = {
      locale,
      phase,
      index,
      answers,
      remoteSession,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }, [answers, hydrated, index, locale, phase, remoteSession]);

  const prepareRemoteSession = async () => {
    if (!isSupabaseConfigured()) {
      setSyncState("local");
      return null;
    }

    if (remoteSession) {
      setSyncState("cloud");
      return remoteSession;
    }

    setSyncState("saving");

    try {
      const session = await createRemoteTestSession(locale);
      setRemoteSession(session);
      setSyncState(session ? "cloud" : "local");
      return session;
    } catch (error) {
      console.error(error);
      setSyncState("error");
      return null;
    }
  };

  const handleStart = async () => {
    setPhase("game");
    await prepareRemoteSession();
  };

  const handleAnswer = async (optionId: string) => {
    const question = questions[index];
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    const session = remoteSession ?? (await prepareRemoteSession());

    if (session) {
      setSyncState("saving");
      try {
        await saveRemoteAnswer(session, question.id, optionId);

        if (index === questions.length - 1) {
          const result = getCharacterMatch(nextAnswers);
          await completeRemoteTest(
            session,
            result.character.id,
            result.scores,
          );
        }

        setSyncState("cloud");
      } catch (error) {
        console.error(error);
        setSyncState("error");
      }
    }

    if (index === questions.length - 1) {
      setPhase("result");
      return;
    }

    setIndex((current) => current + 1);
  };

  const handleRestart = async () => {
    setAnswers({});
    setIndex(0);
    setRemoteSession(null);
    setPhase("game");

    if (isSupabaseConfigured()) {
      setSyncState("saving");
      try {
        const session = await createRemoteTestSession(locale);
        setRemoteSession(session);
        setSyncState(session ? "cloud" : "local");
      } catch (error) {
        console.error(error);
        setSyncState("error");
      }
    } else {
      setSyncState("local");
    }
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
        syncState={syncState}
        onAnswer={handleAnswer}
        onBack={() => setIndex((current) => Math.max(0, current - 1))}
        onHome={() => setPhase("landing")}
        onLocaleChange={setLocale}
      />
    );
  }

  if (phase === "result") {
    return (
      <ResultView
        locale={locale}
        answers={answers}
        onLocaleChange={setLocale}
        onRestart={handleRestart}
        onReview={() => {
          setIndex(questions.length - 1);
          setPhase("game");
        }}
        onHome={() => setPhase("landing")}
      />
    );
  }

  return (
    <LandingView
      locale={locale}
      onLocaleChange={setLocale}
      onStart={handleStart}
    />
  );
}
