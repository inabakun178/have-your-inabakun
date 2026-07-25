"use client";

import { useEffect } from "react";
import {
  useTypewriter,
  type TerminalLine,
  type TerminalSegment,
} from "./useTypewriter";

type TypedLinesProps = {
  lines: TerminalLine[];
  speed?: number;
  startDelay?: number;
  // 全行の入力が完了した瞬間に1度だけ呼ばれる
  onFinished?: () => void;
  // true のとき、入力完了後の「次のコマンド待ち」プロンプトを表示しない
  // (呼び出し側で入力完了後に追加のコンテンツを差し込みたい場合に使う)
  hideTrailingPrompt?: boolean;
};

// 表示済み文字数 (charLimit) の分だけ、セグメントを前から切り出す
const sliceSegments = (
  segments: TerminalSegment[],
  charLimit: number,
): TerminalSegment[] => {
  const result: TerminalSegment[] = [];
  let remaining = charLimit;

  for (const segment of segments) {
    if (remaining <= 0) break;
    const text = segment.text.slice(0, remaining);
    result.push({ ...segment, text });
    remaining -= text.length;
  }

  return result;
};

const TypedLines = (props: TypedLinesProps) => {
  const progress = useTypewriter(props.lines, {
    speed: props.speed,
    startDelay: props.startDelay,
  });

  useEffect(() => {
    if (progress.finished) props.onFinished?.();
    // onFinished は毎レンダー新しい関数が渡される可能性があるため依存配列に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.finished]);

  return (
    <>
      {props.lines.map((line, index) => {
        if (!progress.finished && index > progress.lineIndex) return null;

        const isTypingLine = !progress.finished && index === progress.lineIndex;
        const segments = isTypingLine
          ? sliceSegments(line.segments, progress.charIndex)
          : line.segments;

        return (
          <p key={index} className={line.wrapperClassName}>
            {segments.map((segment, segmentIndex) => (
              <span key={segmentIndex} className={segment.className}>
                {segment.text}
              </span>
            ))}
            {isTypingLine && (
              <span className="text-text-accent animate-blink">▌</span>
            )}
          </p>
        );
      })}
      {/* 全行の入力が終わったら、次のコマンドを待つプロンプトを表示する */}
      {progress.finished && !props.hideTrailingPrompt && (
        <p className="mt-6">
          <span className="text-text-accent">$</span>{" "}
          <span className="text-text-accent animate-blink">▌</span>
        </p>
      )}
    </>
  );
};

export default TypedLines;
