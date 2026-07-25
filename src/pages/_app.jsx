import "../styles/global.css";
// import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { chakraTheme } from "../lib/chakraTheme";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const AnimatedCursor = dynamic(
  () => import("../components/common/AnimatedCursor/AnimatedCursor"),
  { ssr: false },
);

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme(chakraTheme)}>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
      <AnimatedCursor />
    </ChakraProvider>
  );
}

export default MyApp;
