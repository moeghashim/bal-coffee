import { Fraunces, IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bal — Coffee from the seed",
    template: "%s | Bal Coffee",
  },
  description:
    "A naturally caffeine-free coffee, made from a single native seed. Hand-roasted in small lots.",
  openGraph: { type: "website" },
  robots: { follow: true, index: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} ${interTight.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
