import type { NextPage } from "next";
import Head from "next/head";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";
import ProfileTerminal from "../../components/pages/profile/ProfileTerminal/ProfileTerminal";
import CareerTerminal from "../../components/pages/profile/CareerTerminal/CareerTerminal";
import SkillTerminal from "../../components/pages/profile/SkillTerminal/SkillTerminal";

const Profile: NextPage = () => {
  return (
    <PageTemplate
      pageTitle="PROFILE"
      description="フロントエンドエンジニア・デザイナー稲葉勇人(Hayato Inaba)のプロフィール紹介ページ。経歴、スキル、得意分野を掲載しています。"
      canonicalPath="/profile"
    >
      <Head>
        {/* ターミナルUI用の等幅フォント。PageTemplate の Head とマージされる */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
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
};

export default Profile;
