import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "@/styles/global.css";
import Providers from "./providers";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dev_inabakun",
  },
};

// サイト全体で使い回す Person 構造化データ(JSON-LD)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "稲葉勇人",
  alternateName: "イナバくん",
  jobTitle: "Front-end Engineer / Designer",
  url: SITE_URL,
  image: `${SITE_URL}/ogp.jpg`,
  sameAs: [
    "https://twitter.com/dev_inabakun",
    "https://github.com/inabakun178",
    "https://www.instagram.com/purupuruboy2",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${playfairDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
