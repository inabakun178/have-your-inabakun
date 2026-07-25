import TerminalWindow from "../TerminalWindow/TerminalWindow";
import TypedLines from "../TerminalWindow/TypedLines";
import type { TerminalLine } from "../TerminalWindow/useTypewriter";

const promptClass = "text-text-accent";
const commandClass = "text-white";
const jaClass = "text-[10px] text-white/30 md:text-[11px]";
const mutedClass = "text-white/50";
const legacyClass = "text-white/40";

const coreSkills = [
  { en: "UI/UX Design & Proposal", ja: "UI/UX設計・提案" },
  { en: "Scrum Development", ja: "スクラム開発" },
  { en: "Data Analysis (KPI / A-B Test / Research)", ja: "データ分析" },
  { en: "Team Management", ja: "チームマネジメント" },
];

const frontendSkills = [
  { en: "React / Next.js / TypeScript", ja: "得意な技術スタック" },
  { en: "Design System", ja: "デザインシステム構築" },
  { en: "Vue.js / Nuxt.js / GraphQL", ja: "その他の技術スタック" },
];

const skillLine = (
  skill: { en: string; ja: string },
  wrapperClassName?: string,
): TerminalLine => ({
  segments: [
    { text: `- ${skill.en}` },
    { text: ` // ${skill.ja}`, className: jaClass },
  ],
  wrapperClassName,
});

const lines: TerminalLine[] = [
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "stack --core", className: commandClass },
    ],
  },
  ...coreSkills.map((skill, index) =>
    skillLine(skill, index === 0 ? "mt-2" : undefined),
  ),
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "stack --frontend", className: commandClass },
    ],
    wrapperClassName: "mt-6",
  },
  ...frontendSkills.map((skill, index) =>
    skillLine(skill, index === 0 ? "mt-2" : undefined),
  ),
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "stack --ai", className: commandClass },
    ],
    wrapperClassName: "mt-6",
  },
  {
    segments: [
      { text: "- Claude Code, Codex" },
      { text: " // AIツール", className: jaClass },
    ],
    wrapperClassName: "mt-2",
  },
  {
    segments: [
      { text: "  └ Bringing AI into the dev workflow", className: mutedClass },
      { text: " // 開発ワークフローへのAI導入", className: jaClass },
    ],
  },
  {
    segments: [
      { text: "$ ", className: promptClass },
      { text: "stack --legacy", className: commandClass },
    ],
    wrapperClassName: "mt-6",
  },
  {
    segments: [{ text: "- WordPress (still kicking)", className: legacyClass }],
    wrapperClassName: "mt-2",
  },
];

const SkillTerminal = () => {
  return (
    <TerminalWindow title="~/skillset — stack" bootDelay={0.8}>
      <TypedLines lines={lines} startDelay={1800} />
    </TerminalWindow>
  );
};

export default SkillTerminal;
