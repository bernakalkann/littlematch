import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "LittleMatch — Küçük seçimler, beklenmedik karşılaşmalar",
  description:
    "12 küçük seçimle romantik karakterini keşfet. LittleMatch, cozy bir interaktif internet oyunu.",
  applicationName: "LittleMatch",
  openGraph: {
    title: "LittleMatch",
    description: "Küçük seçimler, beklenmedik karşılaşmalar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
