import type { NextPage } from "next";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";

const Home: NextPage = () => {
  return (
    <PageTemplate
      pageTitle="404 Not Found"
      description="お探しのページは見つかりませんでした。"
      canonicalPath="/404"
      noIndex
    >
      <p className="text-center text-[120px] text-white/50 md:text-[300px]">
        404
      </p>
    </PageTemplate>
  );
};

export default Home;
