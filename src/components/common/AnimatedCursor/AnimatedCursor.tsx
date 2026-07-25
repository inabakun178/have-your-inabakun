import React from "react";

/**
 * react-animated-cursor の置き換え。
 * 本体が React 18 までしか対応しておらず（2023-10 以降更新なし）、
 * React 19 に上げるにあたって使っていた挙動だけを移植したもの。
 *
 * - inner は即座に、outer は TRAILING_SPEED 分遅れてカーソルを追う
 * - clickables にホバー中／クリック中は両方が拡大する
 * - タッチデバイスでは何も描画しない（OS のカーソルも消さない）
 *
 * 位置・サイズ・可視状態はすべて ref 経由で直接 DOM に書き込む。
 * mousemove ごとに setState すると描画が 1 フレーム遅れてカーソルがもたつくため、
 * React の再レンダリングは介在させない。
 */

const CLICKABLE_SELECTOR = [
  "a",
  'input[type="text"]',
  'input[type="email"]',
  'input[type="number"]',
  'input[type="submit"]',
  'input[type="image"]',
  "label[for]",
  "select",
  "textarea",
  "button",
  ".link",
].join(",");

const COLOR = "255, 255, 255";
const ORANGE = "242, 115, 20";
const INNER_SIZE = 10;
const OUTER_SIZE = 20;
const INNER_SCALE = 0.6;
const OUTER_SCALE = 6;
const OUTER_ALPHA = 1;
/** 1 フレームあたり残り距離の 1/TRAILING_SPEED だけ outer を進める */
const TRAILING_SPEED = 8;

const BASE_STYLE: React.CSSProperties = {
  zIndex: 999,
  position: "fixed",
  top: 0,
  left: 0,
  borderRadius: "50%",
  pointerEvents: "none",
  opacity: 0,
  transform: "translate(-50%, -50%)",
  transition:
    "opacity 0.15s ease-in-out, height 0.2s ease-in-out, width 0.2s ease-in-out",
};

const POINTER_COARSE = "(pointer: coarse)";

const subscribeToPointerType = (onChange: () => void) => {
  const query = window.matchMedia(POINTER_COARSE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const useIsTouchDevice = () =>
  React.useSyncExternalStore(
    subscribeToPointerType,
    () => window.matchMedia(POINTER_COARSE).matches,
    // タッチ判定はクライアントでしか行えないので、SSR 中は「タッチ扱い」にして
    // 何も描画しない
    () => true,
  );

const CursorCore = () => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const outerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    /** マウスの最新座標 */
    const target = { x: 0, y: 0 };
    /** outer の現在座標（target に向かって補間される） */
    const trailing = { x: 0, y: 0 };
    let isScaled = false;

    const setScaled = (next: boolean) => {
      if (next === isScaled) return;
      isScaled = next;
      const innerSize = next ? INNER_SIZE * INNER_SCALE : INNER_SIZE;
      const outerSize = next ? OUTER_SIZE * OUTER_SCALE : OUTER_SIZE;
      inner.style.width = `${innerSize}px`;
      inner.style.height = `${innerSize}px`;
      outer.style.width = `${outerSize}px`;
      outer.style.height = `${outerSize}px`;
    };

    const setVisible = (visible: boolean) => {
      const opacity = visible ? "1" : "0";
      inner.style.opacity = opacity;
      outer.style.opacity = opacity;
    };

    const isClickable = (event: Event) =>
      event.target instanceof Element &&
      event.target.closest(CLICKABLE_SELECTOR) !== null;

    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      inner.style.left = `${event.clientX}px`;
      inner.style.top = `${event.clientY}px`;
      setVisible(true);
    };
    // 要素ごとに listener を張るのではなく document に委譲することで、
    // Drawer のように後から現れる要素にも効く
    const onMouseOver = (event: MouseEvent) => {
      if (isClickable(event)) setScaled(true);
    };
    const onMouseOut = (event: MouseEvent) => {
      if (isClickable(event)) setScaled(false);
    };
    const onMouseDown = () => setScaled(true);
    const onMouseUp = () => setScaled(false);
    const onDocumentLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onDocumentLeave);

    let frame = requestAnimationFrame(function animate() {
      trailing.x += (target.x - trailing.x) / TRAILING_SPEED;
      trailing.y += (target.y - trailing.y) / TRAILING_SPEED;
      outer.style.left = `${trailing.x}px`;
      outer.style.top = `${trailing.y}px`;
      frame = requestAnimationFrame(animate);
    });

    // OS のカーソルは inline style ではなく stylesheet で消す。
    // リンクなどが自前で cursor: pointer を持っていても上書きできる
    const style = document.createElement("style");
    style.textContent = "body, body * { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        onDocumentLeave,
      );
      cancelAnimationFrame(frame);
      style.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={outerRef}
        style={{
          ...BASE_STYLE,
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          backgroundColor: `rgba(${ORANGE}, ${OUTER_ALPHA})`,
          mixBlendMode: "color",
        }}
      />
      <div
        ref={innerRef}
        style={{
          ...BASE_STYLE,
          width: INNER_SIZE,
          height: INNER_SIZE,
          backgroundColor: `rgba(${COLOR}, 1)`,
        }}
      />
    </>
  );
};

const AnimatedCursor = () => {
  const isTouchDevice = useIsTouchDevice();

  if (isTouchDevice) return null;

  return <CursorCore />;
};

export default AnimatedCursor;
