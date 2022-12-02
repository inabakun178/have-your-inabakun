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
        <meta property="og:image" content="https://www.inabakun.com/ogp.jpg" />
      </Head>
      <Container
        p={{ base: "0 15px", md: "0 50px" }}
        w="100%"
        maxWidth="100%"
        minHeight="100vh"
        position="relative"
        _before={{
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          backgroundColor: COLORS.background.main,
          background:
            COLORS.background.main +
            " url(/site_bg.svg) no-repeat center / cover",
          backgroundAttachment: "fixed",
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
