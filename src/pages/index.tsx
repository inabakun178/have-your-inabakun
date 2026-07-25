import type { NextPage } from "next";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";
import Fv from "../components/pages/top/Fv/Fv";

// TODO: パッケージのアプデ
// TODO: import のパスをエイリアスにしたい
const Home: NextPage = () => {
  return (
    <PageTemplate
      title="Have Your Inabakun | 稲葉勇人（イナバくん）のポートフォリオサイト"
      description="フロントエンドエンジニア・デザイナー稲葉勇人（イナバくん）のポートフォリオサイト。伊豆出身、東京在住。UI/UXデザインとフロントエンド開発の実績、経歴、スキルを紹介しています。"
      canonicalPath="/"
    >
      <Fv />
      {/* TODO: scroll button置く */}
      {/* TODO: 実績リスト置く */}
    </PageTemplate>
  );
};

export default Home;
