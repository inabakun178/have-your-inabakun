import type { NextPage } from "next";
import { Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Text
      fontSize={{ base: "80px", md: "200px" }}
      color="rgba(255,255,255, 0.5)"
      textAlign="center"
    >
      イナバくん
      <br />
      準備中デス
    </Text>
  );
};

export default Home;
