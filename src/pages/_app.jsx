import "../styles/global.css";
// import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { chakraTheme } from "../lib/chakraTheme";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const AnimatedCursor = dynamic(() => import("react-animated-cursor"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme(chakraTheme)}>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
      <AnimatedCursor
        color="255, 255, 255"
        innerSize={10}
        outerSize={20}
        hasBlendMode={true}
        outerStyle={{
          mixBlendMode: "difference",
        }}
      />
    </ChakraProvider>
  );
}

export default MyApp;
