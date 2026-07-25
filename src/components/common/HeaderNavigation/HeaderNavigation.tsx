import NextLink from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const pageList = [
  {
    name: "Profile",
    link: "/profile",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

const HeaderNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onOpen = () => setIsOpen(true);

  // Chakra の Drawer は finalFocusRef で閉じたあとのフォーカスを戻していたので合わせる
  const onClose = useCallback(() => {
    setIsOpen(false);
    openButtonRef.current?.focus();
  }, []);

  // Chakra の Drawer の closeOnEsc 相当
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Chakra の Drawer の blockScrollOnMount 相当
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
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-[1100] h-[50px] w-full md:h-[100px]">
        <div className="flex h-full items-center justify-between text-white">
          {/* TODO: ロゴを置く */}
          {/* Chakra の Heading が持っていた太字は Tailwind の preflight で消えるので明示する */}
          <h1 className="leading-none font-bold">
            <NextLink
              href="/"
              className="block text-[20px] tracking-[0.15em] transition-opacity duration-[400ms] hover:opacity-60 md:text-[40px]"
            >
              H.Inaba
            </NextLink>
          </h1>

          <ul className="hidden md:flex">
            {pageList.map((page, index) => (
              <li
                key={page.name}
                className={index === 0 ? undefined : "ml-[60px]"}
              >
                <NextLink
                  href={page.link}
                  className="text-[18px] tracking-[0.1em] transition-opacity duration-[400ms] hover:opacity-60"
                >
                  {page.name}
                </NextLink>
              </li>
            ))}
          </ul>

          {/* h-10 w-10 は Chakra の Button (size md) の既定サイズを引き継いだもの */}
          <button
            type="button"
            ref={openButtonRef}
            onClick={onOpen}
            aria-label="メニューを開く"
            aria-expanded={isOpen}
            className="relative block h-10 w-10 md:hidden"
          >
            <span className="absolute top-[10px] left-0 h-0.5 w-full bg-white" />
            <span className="absolute bottom-[10px] left-0 h-0.5 w-full bg-white" />
          </button>
        </div>
      </header>

      {/*
       * ドロワーを <header> の外に出しているのは、sticky + z-index を持つ <header> が
       * 重ね合わせコンテキストを作ってしまい、中に置くと z-[1400] が効かず
       * SnsList (z-[1100]) の下に潜ってしまうため。Chakra は Portal で回避していた。
       */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="メニュー"
          className="bg-background-main fixed inset-0 z-[1400] flex flex-col"
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

          <div className="flex flex-1 items-center justify-center p-6">
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
                    className="block p-5 text-[25px] tracking-[0.1em] hover:opacity-60"
                  >
                    {page.name}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNavigation;
