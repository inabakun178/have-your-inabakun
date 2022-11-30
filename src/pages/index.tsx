import type { NextPage } from "next";
import Head from "next/head";
import { Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <>
      {/* PageTemplate componentを作る */}
      <Head>
        <title>Have Your Inabakun</title>
      </Head>
      <Text fontSize="300px">イナバくん準備中</Text>
    </>
  );
};

export default Home;
