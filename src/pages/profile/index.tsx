import type { NextPage } from "next";
import { Box, Image, Flex } from "@chakra-ui/react";
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
      <Box mt={{ base: "50px", md: "100px" }}>
        <ProfileHead />
        <Box mt={{ base: "50px", md: "100px" }}>
          <TextListArea title="Skill" items={skillList} />
        </Box>
        <Box mt={{ base: "50px", md: "100px" }}>
          <TextListArea title="History" items={HistoryList} />
        </Box>
        <Flex mt={{ base: "50px", md: "100px" }} justifyContent="center">
          <Image
            src="/inabakun.png"
            alt="イナバくん"
            filter="grayscale(100%)"
            w={{ base: "50%", md: "auto" }}
          />
        </Flex>
      </Box>
    </PageTemplate>
  );
};

export default Profile;
