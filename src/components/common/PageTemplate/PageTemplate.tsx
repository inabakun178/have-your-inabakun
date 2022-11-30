import Head from "next/head";
import { ReactNode } from "react";

type PageTemplateProps = {
  children: ReactNode;
};

const PageTemplate = (props: PageTemplateProps) => {
  return (
    <>
      <Head>
        <title>Have Your Inabakun</title>
      </Head>
      {props.children}
    </>
  );
};

export default PageTemplate;
