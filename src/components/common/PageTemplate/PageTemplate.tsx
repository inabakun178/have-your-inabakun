import { ReactNode } from "react";
import Head from "next/head";
import { Box, Container } from "@chakra-ui/react";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import { COLORS } from "../../../lib/colors";
import SnsList from "../SnsList/SnsList";
import { motion } from "framer-motion";

type PageTemplateProps = {
  pageTitle?: string;
  children: ReactNode;
};

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <Head>
        <title>
          {props.pageTitle && `${props.pageTitle} | `}Have Your Inabakun
        </title>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
          rel="stylesheet"
        ></link>
        <meta
          name="description"
          content="Have Your Inabakun. イナバくんのポートフォリオサイトです。 稲葉勇人"
        />
        <meta property="og:title" content={"Have Your Inabakun"} />
        <meta
          name="og:description"
          content="Have Your Inabakun. イナバくんのポートフォリオサイトです。 稲葉勇人"
        />
        <meta property="og:image" content="https://www.inabakun.com/ogp.jpg" />
      </Head>
      <Container
        p={{ base: "0 15px", md: "0 50px" }}
        w="100%"
        maxWidth="100%"
        minHeight="100vh"
        position="relative"
        backgroundColor={COLORS.background.main}
        _before={{
          content: '""',
          position: "fixed",
          width: "100vw",
          height: "100vh",
          top: "0",
          left: "0",
          background: " url(/site_bg.svg) no-repeat center / cover",
          filter: "grayscale(100%)",
        }}
      >
        <HeaderNavigation />
        <SnsList />

        <Box position="relative">
          <motion.div
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
          >
            {props.children}
          </motion.div>
        </Box>
      </Container>
    </>
  );
};

export default PageTemplate;
