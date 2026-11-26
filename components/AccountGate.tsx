"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { isAvatarId, nicknamePattern } from "@/data/avatars";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { loadPlayerCard, savePlayerCard, updatePlayerAppearance, type PlayerCard } from "@/lib/supabase/player-cards";
import type { Locale } from "@/lib/types";
import { AvatarEditView } from "./AvatarEditView";
import { SceneHeader } from "./SceneHeader";
import { LittleMatchApp } from "./LittleMatchApp";

type Mode = "login" | "register" | "forgot" | "recover";
const previewKey = "littlematch-preview-card-v1";

const words = {
  tr: {
    welcome: "LittleMatch’e hoş geldin",
    login: "Oturum aç", register: "Kayıt ol", forgot: "Şifremi unuttum", recover: "Yeni şifre belirle",
    email: "E-posta", password: "Şifre", newPassword: "Yeni şifren", nickname: "Takma ad",
    nicknameHelp: "3–20 harf, rakam veya alt çizgi.",
    confirmation: "Kayıt bağlantısı geldiyse e-postanı açıp hesabını doğrula.",
    reset: "Hesabın varsa şifre sıfırlama bağlantısı e-postana gönderilir.",
    resetAction: "Sıfırlama bağlantısı gönder",
    updated: "Şifren güncellendi. Yeni şifrenle giriş yap.",
    failed: "İşlem tamamlanamadı. Bilgilerini kontrol edip tekrar dene.",
    busy: "Bir saniye…",
    profileFailed: "Profil yüklenemedi. Tekrar dene.", retry: "Tekrar dene",
    preview: "Yerel önizleme. Burada takma ad ve görünüm seçerek oyunu deneyebilirsin.",
    unavailable: "E-posta ile giriş ve şifre sıfırlama, Supabase’e bağlı web sürümünde çalışır.",
  },
  en: {
    welcome: "Welcome to LittleMatch",
    login: "Log in", register: "Sign up", forgot: "Forgot password", recover: "Choose a new password",
    email: "Email", password: "Password", newPassword: "New password", nickname: "Nickname",
    nicknameHelp: "3–20 letters, numbers, or underscores.",
    confirmation: "Open the sign-up email to confirm your account.",
    reset: "If you have an account, you will receive a password reset email.",
    resetAction: "Send password reset link",
    updated: "Password updated. Log in with your new password.",
    failed: "Something went wrong. Check your details and try again.",
    busy: "One moment…",
    profileFailed: "Your profile could not be loaded. Try again.", retry: "Try again",
    preview: "Local preview. Choose a nickname and a look to play on this device.",
    unavailable: "Email login and password resets work in the web version connected to Supabase.",
  },
};

function Scene({ locale, onLocaleChange, onLogin, onLogout, children }: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onLogin?: () => void;
  onLogout?: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <main className="painted-shell painted-account">
      <SceneHeader locale={locale} onLocaleChange={onLocaleChange} onLogin={onLogin} onLogout={onLogout} />
      <div className="painted-split auth-layout">
        <div className="painted-art auth-art" aria-hidden="true" />
        <section className="paper-panel auth-panel">{children}</section>
      </div>
    </main>
  );
}

export function AccountGate() {
  const client = getSupabaseBrowserClient();
  const [locale, setLocale] = useState<Locale>("tr");
  const [mode, setMode] = useState<Mode>("register");
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [previewCard, setPreviewCard] = useState<PlayerCard | null>(null);
  const [previewOnboarding, setPreviewOnboarding] = useState(false);
  const [previewStartsQuiz, setPreviewStartsQuiz] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const t = words[locale];

  useEffect(() => {
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setMode("recover");
          setNotice("");
        }
        setUser(session?.user && !session.user.is_anonymous ? session.user : null);
        setReady(true);
      });
      return () => subscription.unsubscribe();
    }

    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(previewKey);
        if (raw) {
          const card = JSON.parse(raw) as PlayerCard;
          if (card.user_id && typeof card.nickname === "string" && isAvatarId(card.avatar_id)) setPreviewCard(card);
        }
      } catch {
        // Storage can be disabled in a local preview.
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [client]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function open(nextMode: Mode) {
    setMode(nextMode);
    setNotice("");
    setPassword("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    if (!client && mode === "register" && !nicknamePattern.test(nickname.trim())) {
      setNotice(t.nicknameHelp);
      return;
    }
    if (!client) {
      if (mode === "register") setPreviewOnboarding(true);
      return;
    }

    const redirectTo = new URL(window.location.pathname, window.location.origin);
    const invite = new URLSearchParams(window.location.search).get("invite");
    if (invite) redirectTo.searchParams.set("invite", invite);
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await client.auth.signUp({
          email: email.trim(), password, options: { emailRedirectTo: redirectTo.href },
        });
        if (error) throw error;
        if (!data.session) {
          open("login");
          setNotice(t.confirmation);
        }
      } else if (mode === "forgot") {
        redirectTo.searchParams.set("recover", "1");
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectTo.href });
        if (error) throw error;
        setNotice(t.reset);
      } else if (mode === "recover") {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        const { error: signOutError } = await client.auth.signOut({ scope: "local" });
        if (signOutError) throw signOutError;
        redirectTo.searchParams.delete("recover");
        window.history.replaceState(window.history.state, "", redirectTo);
        open("login");
        setNotice(t.updated);
      } else {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
      setPassword("");
    } catch {
      setNotice(t.failed);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <div className="session-loader" aria-label="LittleMatch">✦</div>;

  if (user && client && mode !== "recover") {
    return <RegisteredPlayer key={user.id} user={user} initialNickname={nickname} locale={locale} onLocaleChange={setLocale} />;
  }

  if (previewCard) {
    return <LittleMatchApp key={previewCard.user_id} profile={previewCard} startQuiz={previewStartsQuiz}
      initialLocale={locale} onSaveProfile={async (nickname, avatar_look) => {
        const next = { ...previewCard, nickname, avatar_look };
        window.localStorage.setItem(previewKey, JSON.stringify(next));
        setPreviewCard(next);
      }} onSignOut={() => {
        try { window.localStorage.removeItem(previewKey); } catch { /* Storage may be unavailable. */ }
        setPreviewCard(null);
        setPreviewOnboarding(false);
        setNickname("");
        open("login");
      }} />;
  }

  if (previewOnboarding) {
    return <AvatarEditView locale={locale} onLocaleChange={setLocale} initialNickname={nickname}
      onLogin={() => { setPreviewOnboarding(false); open("login"); }}
      onLeave={() => setPreviewOnboarding(false)}
      onSave={async (name, avatar_id, avatar_look) => {
        const localId = window.crypto.randomUUID?.() ?? String(Date.now());
        const card: PlayerCard = { user_id: localId, nickname: name, avatar_id, avatar_look, listed: false };
        try { window.localStorage.setItem(previewKey, JSON.stringify(card)); } catch { /* Storage may be unavailable. */ }
        setPreviewStartsQuiz(true);
        setPreviewCard(card);
      }} />;
  }

  const showForm = Boolean(client) || mode === "register";
  return (
    <Scene locale={locale} onLocaleChange={setLocale} onLogin={mode !== "recover" ? () => { if (!busy && mode !== "login") open("login"); } : undefined}>
      <h1>{mode === "recover" ? t.recover : t.welcome}</h1>
      {mode !== "recover" && <>
        {!client && <p>{t.preview}</p>}
        <nav className="account-tabs" aria-label="LittleMatch">
          <button type="button" aria-pressed={mode === "register"} onClick={() => open("register")} disabled={busy}>{t.register}</button>
          <button type="button" aria-pressed={mode === "login"} onClick={() => open("login")} disabled={busy}>{t.login}</button>
        </nav>
      </>}
      {showForm ? <form className="account-form" onSubmit={submit}>
        {!client && mode === "register" && <label>{t.nickname}
          <input required minLength={3} maxLength={20} value={nickname} onChange={(event) => setNickname(event.target.value)} autoComplete="nickname" />
        </label>}
        {client && mode !== "recover" && <label>{t.email}
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </label>}
        {client && mode !== "forgot" && <label>{mode === "recover" ? t.newPassword : t.password}
          <input required type="password" minLength={mode === "login" ? undefined : 8} value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"} />
        </label>}
        <button className="scene-button scene-gold" type="submit" disabled={busy}>
          {busy ? t.busy : mode === "forgot" ? t.resetAction : t[mode]}
        </button>
      </form> : <p>{t.unavailable}</p>}
      {client && mode === "login" &&
        <button type="button" className="account-link" onClick={() => open("forgot")} disabled={busy}>{t.forgot}</button>}
      {mode === "forgot" &&
        <button type="button" className="account-link" onClick={() => open("login")} disabled={busy}>{t.login}</button>}
      {notice && <p role="status" className="account-message">{notice}</p>}
    </Scene>
  );
}

function RegisteredPlayer({ user, initialNickname, locale, onLocaleChange }: {
  user: User;
  initialNickname: string;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const client = getSupabaseBrowserClient()!;
  const [card, setCard] = useState<PlayerCard | null>();
  const [loadFailed, setLoadFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [startQuiz, setStartQuiz] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);
  const t = words[locale];

  useEffect(() => {
    let active = true;
    loadPlayerCard(client, user.id).then((profile) => {
      if (active) setCard(profile);
    }).catch(() => {
      if (active) setLoadFailed(true);
    });
    return () => { active = false; };
  }, [attempt, client, user.id]);

  async function signOut() {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) setSignOutFailed(true);
  }

  if (card) return <LittleMatchApp profile={card} startQuiz={startQuiz} initialLocale={locale} onSaveProfile={async (nickname, avatar_look) => {
    await updatePlayerAppearance(client, user.id, nickname, avatar_look);
    setCard({ ...card, nickname, avatar_look });
  }}
    onSignOut={signOut} accountNotice={signOutFailed ? t.failed : undefined} />;

  if (card === null && !loadFailed) return <AvatarEditView
    locale={locale} onLocaleChange={onLocaleChange} initialNickname={initialNickname || String(user.user_metadata?.nickname ?? "")}
    onLogout={signOut} online
    onSave={async (nickname, avatar_id, avatar_look) => {
      const saved = await savePlayerCard(client, { user_id: user.id, nickname, avatar_id, avatar_look });
      setStartQuiz(true);
      setCard(saved);
    }} />;

  return <Scene locale={locale} onLocaleChange={onLocaleChange} onLogout={signOut}>
    {loadFailed ? <>
      <h1>{t.profileFailed}</h1>
      <button className="scene-button scene-gold" type="button" onClick={() => { setLoadFailed(false); setAttempt(attempt + 1); }}>{t.retry}</button>
    </> : <p role="status">{t.busy}</p>}
    {signOutFailed && <p role="status">{t.failed}</p>}
  </Scene>;
}
