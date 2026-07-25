import "../styles/global.css";
// import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const AnimatedCursor = dynamic(
  () => import("../components/common/AnimatedCursor/AnimatedCursor"),
  { ssr: false },
);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
      <AnimatedCursor />
    </>
  );
}

export default MyApp;
