import type { Metadata } from "next";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Fv from "@/components/top/Fv/Fv";
import { buildMetadata } from "@/lib/seo";

// TODO: パッケージのアプデ
export const metadata: Metadata = buildMetadata({
  absoluteTitle:
    "Have Your Inabakun | 稲葉勇人（イナバくん）のポートフォリオサイト",
  description:
    "フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のポートフォリオサイト。伊豆出身、東京在住。UI/UXデザインとフロントエンド開発の実績、経歴、スキルを紹介しています。",
  path: "/",
});

export default function Home() {
  return (
    <PageTemplate>
      {/* ファーストビューはcanvas演出のみで本文テキストが無いため、SEO用にh1を視覚上は隠して補う */}
      <h1 className="sr-only">
        稲葉勇人（イナバくん） / Have Your Inabakun -
        フロントエンドエンジニア・デザイナーのポートフォリオサイト
      </h1>
      <Fv />
      {/* TODO: scroll button置く */}
      {/* TODO: 実績リスト置く */}
    </PageTemplate>
  );
}
