import { Box, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../lib/colors";

const ProfileHead = () => {
  return (
    <Box p="120px 50px" background={COLORS.background.sub}>
      <Text fontSize="100px" color="rgba(255,255,255, 0.5)">
        Hayato Inaba
      </Text>
      <Text fontSize="18px" color="rgba(255,255,255, 0.5)">
        稲葉 勇人 / Front-end developer <br />
        1993.05.12 / Tokyo
      </Text>
    </Box>
  );
};

export default ProfileHead;
