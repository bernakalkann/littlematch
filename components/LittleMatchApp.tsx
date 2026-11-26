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
import { getCharacterMatch, isTestComplete, type AnswerMap } from "@/lib/scoring";
import { ensureAnonymousUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  completeRemoteTest,
  createRemoteTestSession,
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
  const [syncState, setSyncState] = useState<SyncState>("local");
  const [activeInviteCode, setActiveInviteCode] = useState<string | null>(null);
  const [inviteRole, setInviteRole] = useState<InviteRole>(null);
  const [inviteState, setInviteState] = useState<InviteUiState>(
    isSupabaseConfigured() ? "idle" : "unavailable",
  );
  const [pairResult, setPairResult] = useState<PairResultData | null>(null);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const urlInviteCode = new URLSearchParams(window.location.search).get("invite");
      try {
        const raw = window.localStorage.getItem(storageKey);
        const saved = raw ? (JSON.parse(raw) as SavedSession) : null;

        if (saved) {
          if (saved.locale === "tr" || saved.locale === "en") {
            setLocale(saved.locale);
          }

          if (saved.phase === "game" || (saved.phase === "result" && isTestComplete(saved.answers ?? {}))) {
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
          }

          if (saved.activeInviteCode && saved.inviteRole && isSupabaseConfigured()) {
            setActiveInviteCode(saved.activeInviteCode);
            setInviteRole(saved.inviteRole);
            setInviteState("ready");
          }
        } else if (navigator.language.toLowerCase().startsWith("en")) {
          setLocale("en");
        }

        if (urlInviteCode && saved?.activeInviteCode !== urlInviteCode) {
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
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    } catch {
      // The current game can continue when browser storage is unavailable.
    }
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

  const saveCompletedTest = async (completedAnswers: AnswerMap) => {
    const session = remoteSession ?? await createRemoteTestSession(locale);
    if (!session) throw new Error("Remote test session unavailable.");

    setRemoteSession(session);
    const result = getCharacterMatch(completedAnswers);
    await completeRemoteTest(session, completedAnswers, result.character.id, result.scores);
    return session;
  };

  const handleAnswer = async (optionId: string) => {
    if (syncState === "saving") return;
    const question = questions[index];
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }

    const pendingQuestion = questions.findIndex(({ id }) => !nextAnswers[id]);
    if (pendingQuestion !== -1) {
      setIndex(pendingQuestion);
      return;
    }

    if (isSupabaseConfigured()) {
      setSyncState("saving");
      try {
        await saveCompletedTest(nextAnswers);
        setSyncState("cloud");
      } catch (error) {
        console.error(error);
        setSyncState("error");
      }
    }

    setPhase("result");
  };

  const clearInvite = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("invite");
    window.history.replaceState(window.history.state, "", url);
    setActiveInviteCode(null);
    setInviteRole(null);
    setPairResult(null);
    setInviteState(isSupabaseConfigured() ? "idle" : "unavailable");
  };

  const handleRestart = () => {
    setAnswers({});
    setIndex(0);
    setRemoteSession(null);
    clearInvite();
    setPhase("game");
    setSyncState("local");
  };

  const handleCreateInvite = async () => {
    setInviteState("creating");

    try {
      const session = await saveCompletedTest(answers);
      const invite = await createInvitation(session.id);
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
      let result;
      if (inviteRole === "invitee") {
        await ensureAnonymousUser();
        await claimInvitation(activeInviteCode);
        result = await getInvitationResult(activeInviteCode);
        if (!result.ready) {
          const session = await saveCompletedTest(answers);
          await completeInvitation(activeInviteCode, session.id);
          result = await getInvitationResult(activeInviteCode);
        }
      } else {
        result = await getInvitationResult(activeInviteCode);
      }

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
        onHome={() => {
          if (syncState !== "saving") setPhase("landing");
        }}
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
        inviteState={inviteState}
        invited={inviteRole === "invitee" && isSupabaseConfigured()}
        inviteLink={inviteLink}
        onLocaleChange={setLocale}
        onRestart={handleRestart}
        onReview={() => {
          if (activeInviteCode && inviteRole === "creator") clearInvite();
          setRemoteSession(null);
          setSyncState("local");
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
      onStart={() => setPhase(isTestComplete(answers) ? "result" : "game")}
    />
  );
}
