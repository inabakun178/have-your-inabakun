"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type TerminalWindowProps = {
  title: string;
  // タイトル横に添える日本語コメント (例: "プロフィール")
  titleJa?: string;
  children: ReactNode;
  // 複数のターミナルを起動時に少しずつずらして立ち上げるための遅延 (秒)
  bootDelay?: number;
};

// profile ページ専用のターミナル風ウィンドウ。配色は global.css の --color-cyber-* トークンから取る
const TerminalWindow = (props: TerminalWindowProps) => {
  const bootDelay = props.bootDelay ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.85, y: 12 }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      transition={{ duration: 1, delay: bootDelay, ease: "easeOut" }}
      style={{ transformOrigin: "top" }}
      className="border-text-accent/40 bg-cyber-bg relative overflow-hidden rounded-md border font-mono"
    >
      <div className="border-text-accent/30 bg-text-accent/5 flex items-center gap-2 border-b px-4 py-2 md:px-6">
        <span className="text-text-accent text-[12px] md:text-[14px]">
          {">_"}
        </span>
        <p className="text-[11px] tracking-[0.15em] text-white/50 md:text-[13px]">
          {props.title}
          {props.titleJa && (
            <span className="text-[10px] text-white/30 md:text-[11px]">
              {` // ${props.titleJa}`}
            </span>
          )}
        </p>
      </div>
      <div className="px-5 py-6 text-[13px] leading-[1.9] break-words text-white/80 md:px-8 md:py-8 md:text-[15px]">
        {props.children}
      </div>
      {/* うっすらとした走査線でブラウン管っぽさを出す */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_3px)] opacity-40"
      />
    </motion.div>
  );
};

export default TerminalWindow;
