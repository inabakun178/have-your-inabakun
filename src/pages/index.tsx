import type { NextPage } from "next";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";
import Fv from "../components/pages/top/Fv/Fv";

const Home: NextPage = () => {
  return (
    <PageTemplate>
      <Fv />
      {/* TODO: scroll button置く */}
      {/* TODO: 実績リスト置く */}
    </PageTemplate>
  );
};

export default Home;
