import TerminalWindow from "../TerminalWindow/TerminalWindow";
import TypedLines from "../TerminalWindow/TypedLines";
import type { TerminalLine } from "../TerminalWindow/useTypewriter";

const promptClass = "text-text-accent";
const commandClass = "text-white";
const jaClass = "text-[10px] text-white/30 md:text-[11px]";

const lines: TerminalLine[] = [
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "whoami", className: commandClass },
    ],
  },
  {
    segments: [
      { text: "Hayato Inaba" },
      { text: " // 稲葉 勇人", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "Front-end Engineer / Designer" },
      { text: " // フロントエンドエンジニア / デザイナー", className: jaClass },
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
  return (
    <TerminalWindow title="~/profile — whoami" bootDelay={0}>
      <TypedLines lines={lines} startDelay={1000} />
    </TerminalWindow>
  );
};

export default ProfileTerminal;
