"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import SnsList from "../SnsList/SnsList";

const pageList = [
  {
    name: "Profile",
    link: "/profile",
  },
];

// メニューの背景を組み立てる黒い帯の本数と、1本ごとのアニメーション設定。
// 帯は奇数番目/偶数番目で左右どちらから出てくるかを切り替え、開くときは
// 端から中央へ向かって順番に、閉じるときは逆順で退場させて「集まって消える」
// 動きにする。
const BAR_COUNT = 9;
const BAR_TRANSITION_MS = 450;
const BAR_STAGGER_MS = 45;
const OPEN_DURATION_MS = BAR_TRANSITION_MS + BAR_STAGGER_MS * (BAR_COUNT - 1);
const CLOSE_DURATION_MS = OPEN_DURATION_MS;
const CONTENT_DELAY_MS = 350;
const CONTENT_IN_MS = 350;
const CONTENT_OUT_MS = 150;

type MenuState = "closed" | "open" | "closing";

const HeaderNavigation = () => {
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // 各ページの h1 が重複しないよう、ロゴを見出しにするのは TOP ページのみにする
  const isHome = usePathname() === "/";
  const LogoTag = isHome ? "h1" : "p";

  // ダイアログは常に DOM に置いたままにし、状態を CSS トランジションで
  // 出し引きする。閉じた状態からの再マウントを挟まないことで、開閉どちらの
  // 向きでも同じトランジションが安定して発火する。
  const isOpen = menuState !== "closed";

  const onOpen = () => setMenuState("open");

  // Chakra の Drawer は finalFocusRef で閉じたあとのフォーカスを戻していたので合わせる
  const onClose = useCallback(() => {
    setMenuState((current) => (current === "open" ? "closing" : current));
  }, []);

  // 閉じるアニメーションが終わったタイミングで完全に閉じた状態にし、
  // 開くボタンへフォーカスを戻す。
  useEffect(() => {
    if (menuState !== "closing") return;

    const timer = setTimeout(() => {
      setMenuState("closed");
      openButtonRef.current?.focus();
    }, CLOSE_DURATION_MS);

    return () => clearTimeout(timer);
  }, [menuState]);

  // Chakra の Drawer の closeOnEsc 相当
  useEffect(() => {
    if (menuState !== "open") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuState, onClose]);

  // Chakra の Drawer の blockScrollOnMount 相当。閉じるアニメーション中も
  // 画面はまだ覆われているのでスクロールはロックし続ける。
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Chakra の Drawer が開いた直後に閉じるボタンへフォーカスしていたのに合わせる
  useEffect(() => {
    if (menuState === "open") closeButtonRef.current?.focus();
  }, [menuState]);

  return (
    <>
      <header className="sticky top-0 z-[1100] h-[50px] w-full border-b border-white/10 md:h-[100px]">
        <div className="flex h-full items-center justify-between text-white">
          {/* TODO: ロゴを置く */}
          {/* Chakra の Heading が持っていた太字は Tailwind の preflight で消えるので明示する */}
          <LogoTag className="leading-none font-bold">
            <NextLink
              href="/"
              className="block text-[20px] tracking-[0.15em] transition-opacity duration-[400ms] hover:opacity-60 md:text-[40px]"
            >
              H.Inaba
            </NextLink>
          </LogoTag>

          {/* 右側グループ: PC ではナビ + ステータス、SP では [ MENU ] だけを出し分ける */}
          <div className="flex items-center gap-x-[40px] md:gap-x-[60px]">
            <ul className="hidden md:flex">
              {pageList.map((page, index) => (
                <li
                  key={page.name}
                  className={index === 0 ? undefined : "ml-[60px]"}
                >
                  {/* クリックを誘いたいので角括弧のコマンド表記 + グロウ点滅にする */}
                  <NextLink
                    href={page.link}
                    className="group animate-profile-pulse font-mono text-[17px] tracking-[0.15em] text-text-accent transition-colors duration-300 hover:text-white"
                  >
                    <span className="mr-1 inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
                      [
                    </span>
                    {page.name.toLowerCase()}
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      ]
                    </span>
                  </NextLink>
                </li>
              ))}
            </ul>

            {/* 端末のステータスバー風の演出。SP では場所が狭いので出さない */}
            <div className="hidden items-center gap-x-2 font-mono text-[11px] tracking-[0.2em] text-white/50 md:flex">
              <span
                className="bg-text-accent h-[6px] w-[6px] animate-status-blink rounded-full"
                aria-hidden="true"
              />
              ONLINE
            </div>

            <button
              type="button"
              ref={openButtonRef}
              onClick={onOpen}
              aria-label="メニューを開く"
              aria-expanded={isOpen}
              className="group text-text-accent animate-profile-pulse font-mono text-[13px] tracking-[0.15em] transition-colors duration-300 hover:text-white md:hidden"
            >
              {/* コマンドプロンプト風に "$ " を添える */}
              <span className="text-white/40" aria-hidden="true">
                ${" "}
              </span>
              <span className="mr-1 inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
                [
              </span>
              MENU
              <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                ]
              </span>
              {/* ターミナルのキャレット点滅 */}
              <span className="animate-blink ml-1" aria-hidden="true">
                ▌
              </span>
            </button>
          </div>
        </div>
      </header>

      {/*
       * ドロワーを <header> の外に出しているのは、sticky + z-index を持つ <header> が
       * 重ね合わせコンテキストを作ってしまい、中に置くと z-[1400] が効かず
       * SnsList (z-[1100]) の下に潜ってしまうため。Chakra は Portal で回避していた。
       *
       * 開閉トランジションを両方向で発火させたいので closed でも DOM からは
       * 外さず、inert + invisible で見た目と操作だけを無効化する。
       */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-0 z-[1400] flex flex-col ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* 黒い帯が左右から交互に出てきて集まり、メニューの背景になる演出。
         * 閉じるときは同じ帯が来た側へ逆順で退場し、隙間から元の画面が見える。 */}
        <div className="absolute inset-0 flex" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }).map((_, index) => {
            const fromLeft = index % 2 === 0;
            const barIn = menuState === "open";
            const delay = barIn
              ? index * BAR_STAGGER_MS
              : (BAR_COUNT - 1 - index) * BAR_STAGGER_MS;

            return (
              <div
                key={index}
                className={`h-full flex-1 ${
                  index % 2 === 0 ? "bg-black" : "bg-[#0a0a0a]"
                } ${index === 0 ? "" : "border-l border-white/5"}`}
                style={{
                  transform: barIn
                    ? "translateX(0)"
                    : `translateX(${fromLeft ? "-110%" : "110%"})`,
                  transition: `transform ${BAR_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                }}
              />
            );
          })}
        </div>

        {/* 帯が完全に揃ってから少し遅れて中身をフェードイン、閉じるときは
         * 先に素早くフェードアウトさせてから帯を退場させる。 */}
        <div
          className="relative z-10 flex flex-1 flex-col"
          style={
            menuState === "open"
              ? {
                  opacity: 1,
                  transform: "translateY(0)",
                  transition: `opacity ${CONTENT_IN_MS}ms ease-out ${CONTENT_DELAY_MS}ms, transform ${CONTENT_IN_MS}ms ease-out ${CONTENT_DELAY_MS}ms`,
                }
              : {
                  opacity: 0,
                  transform: "translateY(12px)",
                  transition: `opacity ${CONTENT_OUT_MS}ms ease-in, transform ${CONTENT_OUT_MS}ms ease-in`,
                }
          }
        >
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="absolute top-2 right-3 flex h-10 w-10 items-center justify-center text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>

          {/* px-6 py-2 は Chakra の DrawerBody の既定 padding (8px 24px) に合わせたもの */}
          <div className="flex flex-1 items-center justify-center px-6 py-2">
            <ul>
              {pageList.map((page, index) => (
                <li
                  key={page.name}
                  className={
                    index === 0 ? "text-center" : "mt-[60px] text-center"
                  }
                >
                  <NextLink
                    href={page.link}
                    onClick={onClose}
                    className="group animate-profile-pulse text-text-accent block p-5 font-mono text-[25px] tracking-[0.1em] transition-colors duration-300 hover:text-white"
                  >
                    <span className="mr-1 inline-block transition-transform duration-300 group-hover:-translate-x-0.5">
                      [
                    </span>
                    {page.name.toLowerCase()}
                    <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      ]
                    </span>
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* SNS リンク: PC では右下固定 (SnsList variant="fixed") だが、SP はスペースが狭いのでメニュー内にまとめる */}
          <div className="pb-8">
            <SnsList variant="inline" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderNavigation;
