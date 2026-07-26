import type { Metadata } from "next";

export const SITE_URL = "https://www.inabakun.com";
export const SITE_NAME = "Have Your Inabakun";
export const DEFAULT_DESCRIPTION =
  "フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のポートフォリオサイト「Have Your Inabakun」。伊豆出身、東京在住。経歴やスキルを紹介しています。";

type BuildMetadataOptions = {
  // 指定すると layout の title.template により "${title} | Have Your Inabakun" になる
  title?: string;
  // template を経由せず <title> を完全に上書きしたいときに使う
  absoluteTitle?: string;
  description?: string;
  // 絶対URLの組み立てに使うパス。"/profile" のように先頭は "/"
  path: string;
  // 404 など検索結果に出したくないページで true にする
  noIndex?: boolean;
};

// サイト内の主要ページ。ヘッダーナビと SiteNavigationElement JSON-LD で共有する
export const SITE_NAV_ITEMS = [
  { name: "Top", path: "/" },
  { name: "Profile", path: "/profile" },
];

// 検索エンジンにサイト構造を伝える JSON-LD（サイトリンク表示の助けになる）
export const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: SITE_NAV_ITEMS.map((item) => item.name),
  url: SITE_NAV_ITEMS.map((item) => `${SITE_URL}${item.path}`),
};

// Person の knowsAbout に載せるスキル一覧（SkillTerminal の内容と揃える）
export const PERSON_SKILLS = [
  "UI/UX Design",
  "Scrum Development",
  "Data Analysis",
  "Team Management",
  "React",
  "Next.js",
  "TypeScript",
  "Design System",
  "Vue.js",
  "Nuxt.js",
  "GraphQL",
];

// サイト全体で使い回す Person 構造化データ(JSON-LD)
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "稲葉勇人",
  alternateName: "イナバくん",
  jobTitle: "Front-end Engineer / Designer",
  url: SITE_URL,
  image: `${SITE_URL}/ogp.jpg`,
  knowsAbout: PERSON_SKILLS,
  sameAs: [
    "https://twitter.com/dev_inabakun",
    "https://github.com/inabakun178",
    "https://www.instagram.com/purupuruboy2",
  ],
};

export function buildMetadata({
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  path,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/ogp.jpg`;
  const fullTitle =
    absoluteTitle ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "ja_JP",
      type: "website",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
      site: "@dev_inabakun",
    },
  };
}
