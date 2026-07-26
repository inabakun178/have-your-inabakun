"use client";
import { ReactNode, useEffect, useState } from "react";
import HeaderNavigation from "../HeaderNavigation/HeaderNavigation";
import SnsList from "../SnsList/SnsList";
import ParticleBackdrop from "@/components/effects/ParticleBackdrop/ParticleBackdrop";
import { motion } from "framer-motion";
import { onIntroGateReady } from "@/lib/introGate";

type PageTemplateProps = {
  children: ReactNode;
};

const PageTemplate = ({ children }: PageTemplateProps) => {
  // ジャイロ許可ダイアログが閉じる(出ない端末では即座)までは、背景ズームを
  // keyframesの開始状態(scale(1)・ぼかしあり)のまま止めておく
  const [isBgReady, setIsBgReady] = useState(false);
  useEffect(() => onIntroGateReady(() => setIsBgReady(true)), []);

  return (
    // before: は背景（public/site_bg.svg）をグレースケールで画面に固定するもの。
    // その上に同じ写真からサンプリングしたパーティクルを ParticleBackdrop で重ねる。
    <div
      className={`bg-background-main relative mx-auto min-h-dvh w-full max-w-full px-[15px] before:fixed before:top-0 before:left-0 before:h-dvh before:w-screen before:bg-[url('/site_bg.svg')] before:bg-cover before:bg-center before:bg-no-repeat before:content-[''] md:px-[50px] ${
        isBgReady
          ? "before:animate-bg-zoom"
          : "before:opacity-25 before:blur-[6px] before:grayscale"
      }`}
    >
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
