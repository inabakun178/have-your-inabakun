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

export function buildMetadata({
  title,
  absoluteTitle,
  description = DEFAULT_DESCRIPTION,
  path,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImageUrl = `${SITE_URL}/ogp.jpg`;
  const fullTitle = absoluteTitle ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME);

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
