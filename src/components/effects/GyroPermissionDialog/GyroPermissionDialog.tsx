"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  isGyroPermissionRequired,
  requestGyroPermission,
} from "@/lib/gyroPermission";

/**
 * サイト訪問時に最初に出す、端末の傾き(ジャイロ)センサーへのアクセス許可を求めるダイアログ。
 * iOS Safariはシステム標準の許可ダイアログをタップ起点でしか出せないため、
 * サイトのトンマナに合わせたターミナル風の画面をワンクッション挟んでから
 * 実際の許可リクエスト(requestGyroPermission)を呼び出す。
 */
// ssr: falseで動的importされる(=マウント時点で常にクライアント)ため、
// 初期値の計算にwindowを直接使ってよい
const shouldOpenOnMount = () => {
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches;
  return Boolean(isCoarsePointer) && isGyroPermissionRequired();
};

const GyroPermissionDialog = () => {
  const [isOpen, setIsOpen] = useState(shouldOpenOnMount);
  const [isRequesting, setIsRequesting] = useState(false);
  const allowButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    allowButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleAllow = async () => {
    setIsRequesting(true);
    await requestGyroPermission();
    setIsRequesting(false);
    setIsOpen(false);
  };

  const handleSkip = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gyro-dialog-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scaleY: 0.85, y: 12 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.9, y: 8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="border-text-accent/40 relative w-full max-w-[360px] overflow-hidden rounded-md border bg-[rgba(1,1,1,0.92)] font-mono"
          >
            <div className="border-text-accent/30 bg-text-accent/5 flex items-center gap-2 border-b px-4 py-2">
              <span className="text-text-accent text-[12px]">{">_"}</span>
              <p
                id="gyro-dialog-title"
                className="text-[11px] tracking-[0.15em] text-white/50"
              >
                sensor_access.sh
              </p>
            </div>

            <div className="px-5 py-6 text-[13px] leading-[1.9] text-white/80">
              <p className="text-text-accent">$ request --device-orientation</p>
              <p className="mt-3 text-white/70">
                端末の傾きをパララックス演出に使用します。
                <br />
                センサーへのアクセスを許可しますか?
              </p>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-[12px] tracking-[0.1em] text-white/40 transition-colors duration-300 hover:text-white/70"
                >
                  [ skip ]
                </button>
                <button
                  type="button"
                  ref={allowButtonRef}
                  onClick={handleAllow}
                  disabled={isRequesting}
                  className="group animate-profile-pulse text-text-accent text-[13px] tracking-[0.1em] transition-colors duration-300 hover:text-white disabled:opacity-50"
                >
                  <span className="mr-1 inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
                    [
                  </span>
                  {isRequesting ? "requesting..." : "allow"}
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                    ]
                  </span>
                  <span className="animate-blink ml-1" aria-hidden="true">
                    ▌
                  </span>
                </button>
              </div>
            </div>

            {/* うっすらとした走査線でブラウン管っぽさを出す(TerminalWindowと共通の演出) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_3px)] opacity-40"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GyroPermissionDialog;
