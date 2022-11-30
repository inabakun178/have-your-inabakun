import { ReactNode } from "react";
import Head from "next/head";
import { Container } from "@chakra-ui/react";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import { COLORS } from "../../../lib/colors";

type PageTemplateProps = {
  children: ReactNode;
};

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <Head>
        {/* TODO: title 動的にする */}
        <title>Have Your Inabakun</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Container
        p="0 0 0 0"
        w="100%"
        maxWidth="100%"
        minHeight="100vh"
        backgroundColor={COLORS.background}
      >
        <HeaderNavigation />
        {/* TODO: SNS 追加 */}
        {props.children}
      </Container>
    </>
  );
};

export default PageTemplate;
