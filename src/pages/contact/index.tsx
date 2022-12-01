import type { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Box pt={{ base: "150px", md: "200px" }}>
      <Text
        fontSize={{ base: "18px", md: "30px" }}
        color="rgba(255,255,255, 0.5)"
        textAlign="center"
      >
        フォーム制作中。
        <br />
        ご連絡はTwitterのDMにお願い致します。
      </Text>
    </Box>
  );
};

export default Home;
