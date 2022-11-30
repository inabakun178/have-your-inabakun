import { ReactNode } from "react";
import Head from "next/head";
import { Container } from "@chakra-ui/react";

type PageTemplateProps = {
  children: ReactNode;
};

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <Head>
        <title>Have Your Inabakun</title>
      </Head>
      <Container
        p="0 0 0 0"
        w="100%"
        maxWidth="100%"
        minHeight="100vh"
        backgroundColor="#000"
      >
        {/* TODO: Header 追加 */}
        {/* TODO: SNS 追加 */}
        {props.children}
      </Container>
    </>
  );
};

export default PageTemplate;
