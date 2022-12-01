import type { NextPage } from "next";
import { Text } from "@chakra-ui/react";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";

const Home: NextPage = () => {
  return (
    <Text
      fontSize={{ base: "120px", md: "300px" }}
      color="rgba(255,255,255, 0.5)"
    >
      イナバくん準備中デス
    </Text>
  );
};

export default Home;
