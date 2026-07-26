import { useEffect, useState } from "react";
import { onIntroGateReady } from "@/lib/introGate";

export type TerminalSegment = {
  text: string;
  className?: string;
};

export type TerminalLine = {
  segments: TerminalSegment[];
  // このターミナルの中で行間にスペースを開けたいときに使う (例: "mt-6")
  wrapperClassName?: string;
};

type TypingProgress = {
  lineIndex: number;
  charIndex: number;
  finished: boolean;
};

const lineLength = (line: TerminalLine) =>
  line.segments.reduce((sum, segment) => sum + segment.text.length, 0);

// 1文字ずつ表示していくタイプライター演出。lines は固定の配列を渡す前提で
// (呼び出し側で毎回同じ内容を生成する) 依存配列には含めない
export const useTypewriter = (
  lines: TerminalLine[],
  options?: { speed?: number; startDelay?: number },
) => {
  const speed = options?.speed ?? 10 / 1.5;
  const startDelay = options?.startDelay ?? 0;

  const [progress, setProgress] = useState<TypingProgress>({
    lineIndex: 0,
    charIndex: 0,
    finished: lines.length === 0,
  });

  useEffect(() => {
    if (lines.length === 0) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = (lineIndex: number, charIndex: number) => {
      if (cancelled) return;

      if (charIndex < lineLength(lines[lineIndex])) {
        setProgress({ lineIndex, charIndex: charIndex + 1, finished: false });
        timeoutId = setTimeout(() => tick(lineIndex, charIndex + 1), speed);
        return;
      }

      if (lineIndex + 1 < lines.length) {
        setProgress({
          lineIndex: lineIndex + 1,
          charIndex: 0,
          finished: false,
        });
        // 改行のタイミングだけ少し間を空けて、コマンドの区切りを感じさせる
        timeoutId = setTimeout(() => tick(lineIndex + 1, 0), speed * 3);
        return;
      }

      setProgress((prev) => ({ ...prev, finished: true }));
    };

    // ジャイロ許可ダイアログが閉じる(出ない端末では最初から)まで、
    // タイプライターの開始を待たせる
    const offIntroGateReady = onIntroGateReady(() => {
      timeoutId = setTimeout(() => tick(0, 0), startDelay);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      offIntroGateReady();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, startDelay]);

  return progress;
};
