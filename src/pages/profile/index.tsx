import type { NextPage } from "next";
import { Box, Text, Image, Flex } from "@chakra-ui/react";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";
import ProfileHead from "../../components/pages/profile/ProfileHead/ProfileHead";

const Profile: NextPage = () => {
  return (
    <PageTemplate pageTitle="Profile">
      <Box mt="100px">
        <ProfileHead />
        <Flex mt="100px" justifyContent="center">
          <Image
            src="/inabakun.png"
            alt="イナバくん"
            filter="grayscale(100%)"
          />
        </Flex>
        {/* TODO: SKILL 書く */}
      </Box>
    </PageTemplate>
  );
};

export default Profile;
