import type { NextPage } from "next";
import { Box, Image, Flex } from "@chakra-ui/react";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";
import ProfileHead from "../../components/pages/profile/ProfileHead/ProfileHead";
import TextListArea from "../../components/pages/profile/TextListArea/TextListArea";

const Profile: NextPage = () => {
  const skillList = [
    "JavaScript (TypeScript, React, Vue.js, jQuery)",
    "API (REST, GraphQL)",
    "WordPress Customize",
    "MarkUp (HTML, CSS, Pug, SCSS)",
    "Web Design (Figma, Adobe XD, PhotoShop)",
    "Team Management",
  ];

  const HistoryList = [
    "2021.11- NIJIBOX (Front-end Developer)",
    "2017.01 - 2021.10 COMMU:DE (Front-end Developer + Technical Manager)",
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
        {/* TODO: SKILL 書く */}
      </Box>
    </PageTemplate>
  );
};

export default Profile;
