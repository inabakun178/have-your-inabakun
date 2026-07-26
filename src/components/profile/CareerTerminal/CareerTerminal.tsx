"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import TerminalWindow from "../TerminalWindow/TerminalWindow";
import TypedLines from "../TerminalWindow/TypedLines";
import type { TerminalLine } from "../TerminalWindow/useTypewriter";

const promptClass = "text-text-accent";
const commandClass = "text-white";
const tagClass = "text-text-accent";
const nameClass = "text-white";
const detailClass = "text-white/50";
const jaClass = "text-[10px] text-white/30 md:text-[11px]";

const careerList = [
  {
    tag: "[03]",
    name: "SIMPLEX / Alceo",
    detail: "Gov-tech UX improvement — Scrum, AI-DLC, Design Harness",
    ja: "行政系プロダクトのUX改善（スクラム開発・スクラムイベント運営・AI-DLC・デザインハーネス導入）",
  },
  {
    tag: "[02]",
    name: "NIJIBOX",
    detail: "Embedded at apparel client, product 0→1",
    ja: "アパレル系企業に常駐・新規プロダクト開発（スクラム開発）",
  },
  {
    tag: "[01]",
    name: "COMMU:DE",
    detail: "Frontend dev → tech manager (1yr in Philippines)",
    ja: "フィリピン駐在含むマネージャー経験（チームビルディング・採用・広報）",
  },
];

const lines: TerminalLine[] = [
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "history --career", className: commandClass },
      { text: " // 職務経歴", className: jaClass },
    ],
  },
  ...careerList.flatMap((career, index): TerminalLine[] => [
    {
      segments: [
        { text: `${career.tag} `, className: tagClass },
        { text: career.name, className: nameClass },
        { text: ` — ${career.detail}`, className: detailClass },
      ],
      wrapperClassName: index === 0 ? "mt-4" : "mt-3",
    },
    {
      segments: [{ text: `      // ${career.ja}`, className: jaClass }],
    },
  ]),
];

const CareerTerminal = () => {
  const ref = useRef<HTMLDivElement>(null);
  // 画面内に入るまでタイプライターの開始を待たせる (一度入ったら戻しても再開しない)
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref}>
      <TerminalWindow title="~/career — history" titleJa="経歴" bootDelay={0.4}>
        <TypedLines lines={lines} startDelay={1400} active={isInView} />
      </TerminalWindow>
    </div>
  );
};

export default CareerTerminal;
