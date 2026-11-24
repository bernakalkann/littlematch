"use client";

import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import {
  claimInvitation,
  completeInvitation,
  createInvitation,
  getInvitationResult,
  type PairResultData,
} from "@/lib/invitations/client";
import { getCharacterMatch, type AnswerMap } from "@/lib/scoring";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  completeRemoteTest,
  createRemoteTestSession,
  saveRemoteAnswer,
  type RemoteTestSession,
} from "@/lib/supabase/test-storage";
import type { Locale } from "@/lib/types";
import { GameView } from "./GameView";
import { LandingView } from "./LandingView";
import { PairResultView } from "./PairResultView";
import { ResultView, type InviteUiState } from "./ResultView";

type Phase = "landing" | "game" | "result" | "pair";
type SyncState = "local" | "cloud" | "saving" | "error";
type InviteRole = "creator" | "invitee" | null;

type SavedSession = {
  locale?: Locale;
  phase?: Phase;
  index?: number;
  answers?: AnswerMap;
  remoteSession?: RemoteTestSession | null;
  activeInviteCode?: string | null;
  inviteRole?: InviteRole;
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
  const [activeInviteCode, setActiveInviteCode] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<InviteRole>(null);
  const [inviteState, setInviteState] = useState<InviteUiState>(
    isSupabaseConfigured() ? "idle" : "unavailable",
  );
  const [pairResult, setPairResult] = useState<PairResultData | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        const urlInviteCode = new URLSearchParams(window.location.search).get("invite");

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

          if (saved.activeInviteCode && saved.inviteRole === "creator") {
            setActiveInviteCode(saved.activeInviteCode);
            setInviteRole("creator");
            setInviteState("ready");
          }
        } else if (navigator.language.toLowerCase().startsWith("en")) {
          setLocale("en");
        }

        if (urlInviteCode) {
          setActiveInviteCode(urlInviteCode);
          setInviteRole("invitee");
          setInviteState(isSupabaseConfigured() ? "idle" : "unavailable");
          setPhase("landing");
          setIndex(0);
          setAnswers({});
          setRemoteSession(null);
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
      phase: phase === "pair" ? "result" : phase,
      index,
      answers,
      remoteSession,
      activeInviteCode,
      inviteRole,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(session));
  }, [
    activeInviteCode,
    answers,
    hydrated,
    index,
    inviteRole,
    locale,
    phase,
    remoteSession,
  ]);

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
    const session = await prepareRemoteSession();

    if (inviteRole === "invitee" && activeInviteCode && session) {
      try {
        await claimInvitation(activeInviteCode);
        setInviteState("ready");
      } catch (error) {
        console.error(error);
        setInviteState("error");
      }
    }
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
          await completeRemoteTest(session, result.character.id, result.scores);

          if (inviteRole === "invitee" && activeInviteCode) {
            await completeInvitation(activeInviteCode, session.id);
            const pair = await getInvitationResult(activeInviteCode);

            if (pair.ready) {
              setPairResult(pair);
              setPhase("pair");
              setSyncState("cloud");
              return;
            }
          }
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
    setActiveInviteCode(null);
    setInviteRole(null);
    setPairResult(null);
    setInviteState(isSupabaseConfigured() ? "idle" : "unavailable");
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

  const handleCreateInvite = async () => {
    if (!remoteSession || !isSupabaseConfigured()) {
      setInviteState("unavailable");
      return;
    }

    setInviteState("creating");

    try {
      const invite = await createInvitation(remoteSession.id);
      setActiveInviteCode(invite.code);
      setInviteRole("creator");
      setInviteState("ready");
    } catch (error) {
      console.error(error);
      setInviteState("error");
    }
  };

  const handleCheckPair = async () => {
    if (!activeInviteCode) return;

    setInviteState("creating");

    try {
      const result = await getInvitationResult(activeInviteCode);

      if (!result.ready) {
        setInviteState("waiting");
        return;
      }

      setPairResult(result);
      setPhase("pair");
      setInviteState("ready");
    } catch (error) {
      console.error(error);
      setInviteState("error");
    }
  };

  if (!hydrated) {
    return <div className="session-loader" aria-label="LittleMatch loading">✦</div>;
  }

  if (phase === "pair" && pairResult) {
    return (
      <PairResultView
        locale={locale}
        data={pairResult}
        onHome={() => setPhase("landing")}
      />
    );
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
    const inviteLink =
      activeInviteCode && inviteRole === "creator"
        ? `${window.location.origin}/?invite=${encodeURIComponent(activeInviteCode)}`
        : null;

    return (
      <ResultView
        locale={locale}
        answers={answers}
        inviteState={inviteRole === "invitee" ? "unavailable" : inviteState}
        inviteLink={inviteLink}
        onLocaleChange={setLocale}
        onRestart={handleRestart}
        onReview={() => {
          setIndex(questions.length - 1);
          setPhase("game");
        }}
        onHome={() => setPhase("landing")}
        onCreateInvite={handleCreateInvite}
        onCheckPair={handleCheckPair}
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
