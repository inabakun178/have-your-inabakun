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
      { text: "Tokyo, Japan" },
      { text: " // 東京", className: jaClass },
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
      {
        text: "Believes AI should redesign not only the product, but how the team builds it.",
      },
      {
        text: " // AIはプロダクトだけでなく、チームの働き方も作り変えるものだと思っている",
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
