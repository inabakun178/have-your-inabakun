import type { NextPage } from "next";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";
import ProfileHead from "../../components/pages/profile/ProfileHead/ProfileHead";
import TextListArea from "../../components/pages/profile/TextListArea/TextListArea";

const Profile: NextPage = () => {
  const skillList = [
    "React(Next.js)",
    "Vue.js(Nuxt.js)",
    "TypeScript",
    "GraphQL",
    "スクラム開発",
    "チームマネジメント",
    "マークアップ (HTML, CSS)",
    "WordPress テーマカスタマイズ",
  ];

  const HistoryList = [
    "2024.06~: ???",
    "2021.11~2024.06: NIJIBOX (ZOZO に常駐しプロダクト開発)",
    "2017.01~2021.10: COMMU:DE (FEのグループMgr)",
  ];

  return (
    <PageTemplate pageTitle="Profile">
      <div className="mt-[50px] md:mt-[100px]">
        <ProfileHead />
        <div className="mt-[50px] md:mt-[100px]">
          <TextListArea title="Skill" items={skillList} />
        </div>
        <div className="mt-[50px] md:mt-[100px]">
          <TextListArea title="History" items={HistoryList} />
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
      </div>
    </PageTemplate>
  );
};

export default Profile;
