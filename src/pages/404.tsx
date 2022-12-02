import type { NextPage } from "next";
import { Text } from "@chakra-ui/react";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";

const Home: NextPage = () => {
  return (
    <PageTemplate pageTitle="404">
      <Text
        fontSize={{ base: "120px", md: "300px" }}
        color="rgba(255,255,255, 0.5)"
        textAlign="center"
      >
        404
      </Text>
    </PageTemplate>
  );
};

export default Home;
