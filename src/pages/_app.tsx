import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import PageTemplate from "../components/common/PageTemplate/PageTemplate";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <PageTemplate>
        <Component {...pageProps} />
      </PageTemplate>
    </ChakraProvider>
  );
}

export default MyApp;
