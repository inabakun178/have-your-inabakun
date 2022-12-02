import { Box, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../lib/colors";

const ProfileHead = () => {
  return (
    <Box
      p={{ base: "50px 20px", md: "120px 50px" }}
      background={COLORS.background.sub}
    >
      <Text
        fontSize={{ base: "30px", md: "100px" }}
        letterSpacing="0.1em"
        color="rgba(255,255,255, 0.5)"
      >
        Hayato Inaba
      </Text>
      <Text
        mt={{ base: "15px", md: "0" }}
        fontSize={{ base: "14px", md: "18px" }}
        letterSpacing="0.1em"
        color="rgba(255,255,255, 0.5)"
      >
        稲葉 勇人 / Front-end Developer <br />
        1993.05.12 / Tokyo
      </Text>
    </Box>
  );
};

export default ProfileHead;
