import type { NextPage } from "next";
import { Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Text
      fontSize={{ base: "120px", md: "300px" }}
      color="rgba(255,255,255, 0.5)"
      textAlign="center"
    >
      404
    </Text>
  );
};

export default Home;
