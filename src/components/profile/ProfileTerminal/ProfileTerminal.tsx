"use client";

import { useState } from "react";
import TerminalWindow from "../TerminalWindow/TerminalWindow";
import TypedLines from "../TerminalWindow/TypedLines";
import ShuffledYear from "./ShuffledYear";
import type { TerminalLine } from "../TerminalWindow/useTypewriter";

const promptClass = "text-text-accent";
const commandClass = "text-white";
const jaClass = "text-[10px] text-white/30 md:text-[11px]";

// whoami プロンプト直後、氏名の行までを先に打ち込む
const introLines: TerminalLine[] = [
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "whoami", className: commandClass },
      { text: " // 自己紹介", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "Hayato Inaba" },
      { text: " // 稲葉 勇人", className: jaClass },
    ],
  },
];

// 氏名の下に生年月日 (誕生日) を挟んだあと、続きを打ち込む
const restLines: TerminalLine[] = [
  {
    segments: [
      { text: "Front-end Engineer / Designer" },
      {
        text: " // フロントエンドエンジニア / デザイナー",
        className: jaClass,
      },
    ],
  },
  {
    segments: [
      { text: "Izu → Tokyo, Japan" },
      { text: " // 伊豆出身、東京在住", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "cat about.md", className: commandClass },
      { text: " // 自己紹介文", className: jaClass },
    ],
    wrapperClassName: "mt-6",
  },
  {
    segments: [
      { text: "Frontend engineer who also designs UI/UX." },
      {
        text: " // UI/UXも手がけるフロントエンドエンジニア",
        className: jaClass,
      },
    ],
  },
  {
    segments: [
      { text: "Loves AI and solving problems." },
      { text: " // AIと課題解決が好き", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "cat motto.md", className: commandClass },
      { text: " // 座右の銘", className: jaClass },
    ],
    wrapperClassName: "mt-6",
  },
  {
    segments: [
      { text: "Don't push yourself too hard." },
      { text: " // 無理しない", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "cat hobbies.md", className: commandClass },
      { text: " // 趣味", className: jaClass },
    ],
    wrapperClassName: "mt-6",
  },
  {
    segments: [
      {
        text: "Sauna, live shows, camping, photography, weight training, cooking.",
      },
      {
        text: " // サウナ・ライブ観戦・キャンプ・カメラ・筋トレ・料理",
        className: jaClass,
      },
    ],
  },
];

const ProfileTerminal = () => {
  const [showBirthday, setShowBirthday] = useState(false);

  return (
    <TerminalWindow
      title="~/profile — whoami"
      titleJa="プロフィール"
      bootDelay={0}
    >
      <TypedLines
        lines={introLines}
        startDelay={1000}
        onFinished={() => setShowBirthday(true)}
        hideTrailingPrompt
      />
      {/* 生まれ年は非公開にしたいので、年の部分だけシャッフルし続ける */}
      {showBirthday && (
        <>
          <p>
            <span className="text-white">{"Birthday: "}</span>
            <ShuffledYear />
            <span className="text-white">.05.12</span>
          </p>
          <TypedLines lines={restLines} startDelay={400} />
        </>
      )}
    </TerminalWindow>
  );
};

export default ProfileTerminal;