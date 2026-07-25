"use client";
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const AnimatedCursor = dynamic(
  () => import("@/components/effects/AnimatedCursor/AnimatedCursor"),
  { ssr: false },
);

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait">
        <div key={pathname}>{children}</div>
      </AnimatePresence>
      <AnimatedCursor />
    </>
  );
};

export default Providers;
