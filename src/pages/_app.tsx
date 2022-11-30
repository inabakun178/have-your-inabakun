import "../styles/global.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";
import { chakraTheme } from "../lib/chakraTheme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={extendTheme(chakraTheme)}>
      <PageTemplate>
        <Component {...pageProps} />
      </PageTemplate>
    </ChakraProvider>
  );
}

export default MyApp;
