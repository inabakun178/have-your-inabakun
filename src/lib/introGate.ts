// ジャイロ許可ダイアログが閉じる(または最初から出ない)まで、背景演出の開始を
// 待たせるためのゲート。ダイアログの裏で粒子アニメーションや背景ズームが
// 先走って始まってしまうのを防ぐ。

export const INTRO_GATE_READY_EVENT = "intro-gate-ready";

declare global {
  interface Window {
    __introGateReady?: boolean;
  }
}

export const isIntroGateReady = () =>
  typeof window !== "undefined" && window.__introGateReady === true;

export const markIntroGateReady = () => {
  if (typeof window === "undefined" || window.__introGateReady) return;
  window.__introGateReady = true;
  window.dispatchEvent(new Event(INTRO_GATE_READY_EVENT));
};

/** 既に開放済みなら即座にcallbackを呼ぶ。未開放ならイベントを待つ。 */
export const onIntroGateReady = (callback: () => void): (() => void) => {
  if (isIntroGateReady()) {
    callback();
    return () => {};
  }
  window.addEventListener(INTRO_GATE_READY_EVENT, callback);
  return () => window.removeEventListener(INTRO_GATE_READY_EVENT, callback);
};
