import type { Metadata } from "next";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";
import ProfileTerminal from "../../components/pages/profile/ProfileTerminal/ProfileTerminal";
import CareerTerminal from "../../components/pages/profile/CareerTerminal/CareerTerminal";
import SkillTerminal from "../../components/pages/profile/SkillTerminal/SkillTerminal";
import { buildMetadata } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "PROFILE",
  description:
    "フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のプロフィール紹介ページ。経歴、スキル、得意分野を掲載しています。",
  path: "/profile",
});

export default function Profile() {
  return (
    <PageTemplate>
      {/* md:pr は PC のみ右下固定表示される SnsList (幅40px + right-15px) とターミナルの枠線が被らないための余白。SP は SnsList をメニュー内に出すので不要 */}
      <div className="mt-[50px] flex flex-col gap-[30px] md:mt-[100px] md:gap-[50px] md:pr-[90px]">
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
