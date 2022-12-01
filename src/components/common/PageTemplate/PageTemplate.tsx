import { ReactNode } from "react";
import Head from "next/head";
import { Container } from "@chakra-ui/react";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import { COLORS } from "../../../lib/colors";
import SnsList from "../SnsList/SnsList";

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
        <meta property="og:image" content="https://www.inabakun.com/ogp.jpg" />
      </Head>
      <Container
        p={{ base: "0 15px", md: "0 100px" }}
        w="100%"
        maxWidth="100%"
        minHeight="100vh"
        backgroundColor={COLORS.background}
      >
        <HeaderNavigation />
        <SnsList />
        {props.children}
      </Container>
    </>
  );
};

export default PageTemplate;
