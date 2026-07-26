import type { Metadata } from "next";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import ProfileTerminal from "@/components/profile/ProfileTerminal/ProfileTerminal";
import CareerTerminal from "@/components/profile/CareerTerminal/CareerTerminal";
import SkillTerminal from "@/components/profile/SkillTerminal/SkillTerminal";
import { buildMetadata, SITE_URL, SITE_NAME, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "PROFILE",
  description:
    "フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のプロフィール紹介ページ。経歴、スキル、得意分野を掲載しています。",
  path: "/profile",
});

// パンくずリスト（Home > Profile）の JSON-LD
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Profile",
      item: `${SITE_URL}/profile`,
    },
  ],
};

// ページ全体を ProfilePage として Person に紐付ける JSON-LD
const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/profile`,
  mainEntity: personJsonLd,
};

export default function Profile() {
  return (
    <PageTemplate>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageJsonLd),
        }}
      />
      {/* ターミナルのプロンプト風見出し。他ページに h1 が無いのでここで補う */}
      <h1 className="mt-[50px] flex items-center gap-3 font-mono text-[28px] tracking-[0.2em] text-white md:mt-[100px] md:gap-4 md:text-[40px]">
        <span className="text-text-accent" aria-hidden="true">
          {"> "}
        </span>
        {/* favicon と同じイナバくんの顔写真をターミナルのアバター風に添える */}
        {/* png をそのまま出したいので next/image は使わない */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/inabakun-face.png"
          alt=""
          aria-hidden="true"
          className="border-text-accent/50 bg-cyber-bg h-8 w-8 rounded-full border object-cover grayscale md:h-11 md:w-11"
        />
        PROFILE
        <span className="animate-blink text-text-accent" aria-hidden="true">
          ▌
        </span>
      </h1>
      {/* md:pr は PC のみ右下固定表示される SnsList (幅40px + right-15px) とターミナルの枠線が被らないための余白。SP は SnsList をメニュー内に出すので不要 */}
      <div className="mt-6 flex flex-col gap-[30px] md:mt-10 md:gap-[50px] md:pr-[90px]">
        <ProfileTerminal />
        <CareerTerminal />
        <SkillTerminal />
      </div>
      <div className="mt-[50px] flex justify-center md:mt-[100px]">
        {/* png をそのまま出したいので next/image は使わない */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/inabakun.png"
          alt="イナバくん"
          className="w-1/2 grayscale md:w-auto"
        />
      </div>
    </PageTemplate>
  );
}
