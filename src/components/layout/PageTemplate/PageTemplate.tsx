"use client";
import { ReactNode } from "react";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import SnsList from "../SnsList/SnsList";
import ParticleBackdrop from "@/components/effects/ParticleBackdrop/ParticleBackdrop";
import { motion } from "framer-motion";

type PageTemplateProps = {
  children: ReactNode;
};

const PageTemplate = ({ children }: PageTemplateProps) => {
  return (
    // before: は背景（public/site_bg.svg）をグレースケールで画面に固定するもの。
    // その上に同じ写真からサンプリングしたパーティクルを ParticleBackdrop で重ねる。
    <div className="bg-background-main relative mx-auto min-h-screen w-full max-w-full px-[15px] before:fixed before:top-0 before:left-0 before:h-screen before:w-screen before:animate-bg-zoom before:bg-[url('/site_bg.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:content-[''] md:px-[50px]">
      <ParticleBackdrop />
      <HeaderNavigation />
      <SnsList />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }} // 初期状態
          animate={{ opacity: 1 }} // マウント時
          exit={{ opacity: 0 }} // アンマウント時
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageTemplate;
