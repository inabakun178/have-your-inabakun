import { ReactNode } from "react";
import Head from "next/head";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import SnsList from "../SnsList/SnsList";
import ParticleBackdrop from "../ParticleBackdrop/ParticleBackdrop";
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
      {/*
       * before: は背景（public/site_bg.svg）をグレースケールで画面に固定するもの。
       * その上に同じ写真からサンプリングしたパーティクルを ParticleBackdrop で重ねる。
       */}
      <div className="bg-background-main relative mx-auto min-h-screen w-full max-w-full px-[15px] before:fixed before:top-0 before:left-0 before:h-screen before:w-screen before:animate-bg-zoom before:bg-[url('/site_bg.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-30 before:grayscale before:content-[''] md:px-[50px]">
        <ParticleBackdrop />
        <HeaderNavigation />
        <SnsList />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }} // 初期状態
            animate={{ opacity: 1 }} // マウント時
            exit={{ opacity: 0 }} // アンマウント時
          >
            {props.children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PageTemplate;
