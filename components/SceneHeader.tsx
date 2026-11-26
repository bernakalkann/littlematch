import { copy } from "@/data/copy";
import type { PlayerCard } from "@/lib/supabase/player-cards";
import type { Locale } from "@/lib/types";
import { AvatarPortrait } from "./AvatarPortrait";
import { LanguageToggle } from "./LanguageToggle";

export type SceneAccount = {
  profile: PlayerCard;
  onCustomize?: () => void;
  onSignOut: () => void | Promise<void>;
  notice?: string;
};

export function SceneHeader({ locale, onLocaleChange, onHome, account, onLogin, onLogout }: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onHome?: () => void;
  account?: SceneAccount;
  onLogin?: () => void;
  onLogout?: () => void | Promise<void>;
}) {
  const t = copy[locale];
  const profile = account && <>
    <AvatarPortrait id={account.profile.avatar_id} look={account.profile.avatar_look} />
    <strong>{account.profile.nickname}</strong>
  </>;
  const logo = <>littlematch<span aria-hidden="true">✦</span></>;

  return <header className="scene-header">
    {onHome ? <button className="scene-logo" type="button" onClick={onHome} aria-label={t.home}>{logo}</button>
      : <span className="scene-logo">{logo}</span>}
    <div className="scene-top-actions">
      <LanguageToggle locale={locale} onChange={onLocaleChange} compact />
      {account && <>
        {account.onCustomize
          ? <button type="button" className="scene-profile" onClick={account.onCustomize} title={t.featureCharacter}>{profile}</button>
          : <span className="scene-profile">{profile}</span>}
      </>}
      {(account || onLogout) && <button type="button" className="scene-button scene-session" onClick={account?.onSignOut ?? onLogout}>{t.signOut}</button>}
      {!account && !onLogout && onLogin && <button type="button" className="scene-button scene-session" onClick={onLogin}>{t.signIn}</button>}
    </div>
    {account?.notice && <p className="scene-account-notice" role="status">{account.notice}</p>}
  </header>;
}
