import "../styles/global.css";
// import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";
import { chakraTheme } from "../lib/chakraTheme";
import dynamic from "next/dynamic";

const AnimatedCursor = dynamic(() => import("react-animated-cursor"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={extendTheme(chakraTheme)}>
      <Component {...pageProps} />
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
