"use client";

import { copy } from "@/data/copy";
import type { Locale } from "@/lib/types";

type LanguageToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  compact?: boolean;
};

export function LanguageToggle({
  locale,
  onChange,
  compact = false,
}: LanguageToggleProps) {
  return (
    <div className={compact ? "language-toggle compact" : "language-toggle"} role="group" aria-label={copy[locale].languageLabel}>
      <button
        type="button"
        className={locale === "tr" ? "active" : ""}
        aria-pressed={locale === "tr"}
        onClick={() => onChange("tr")}
      >
        TR
      </button>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        aria-pressed={locale === "en"}
        onClick={() => onChange("en")}
      >
        EN
      </button>
    </div>
  );
}
