"use client";

import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import { onIntroGateReady } from "@/lib/introGate";
import { loadImage, sampleImageParticles } from "@/lib/particleSampler";
import { fragment, vertex } from "./shaders";

// ロゴ("Have Your Inabakun")の実寸(px)。この単位でパーティクルの目標座標を組み立てる。
const LOGO_WIDTH = 943;
const LOGO_HEIGHT = 471;

const CONVERGE_DURATION = 2.0; // 秒(一筆書きの描画時間)
const START_DELAY = 1.0; // 秒(背景画像を先に見せてから一筆書きを始めるまでの待ち時間)

const ParticlePortrait = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let destroyed = false;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let startTime = 0;
    let isInitDone = false;
    let isIntroReady = false;

    // 一筆書きの描画開始を、パーティクル生成完了 かつ ジャイロ許可ダイアログが
    // 閉じている(出ない端末では最初から)状態になるまで待つ
    const tryStart = () => {
      if (!isInitDone || !isIntroReady || startTime) return;
      startTime = performance.now() + START_DELAY * 1000;
    };
    const offIntroGateReady = onIntroGateReady(() => {
      isIntroReady = true;
      tryStart();
    });

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      renderer.setSize(clientWidth, clientHeight);
      if (program) {
        program.uniforms.uResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
        ];
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999 };
    const targetMouse = { x: -9999, y: -9999 };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (event.clientX - rect.left) * renderer.dpr;
      targetMouse.y = (event.clientY - rect.top) * renderer.dpr;
    };
    const handlePointerLeave = () => {
      targetMouse.x = -9999;
      targetMouse.y = -9999;
    };
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const init = async () => {
      const logoImage = await loadImage("/fv_title.svg");
      if (destroyed) return;

      const logoSample = sampleImageParticles(logoImage, {
        targetWidth: 1100,
        maxPoints: 13000,
        mode: "alpha",
        threshold: 20,
      });

      const total = logoSample.points.length;
      const targets = new Float32Array(total * 2);
      const starts = new Float32Array(total * 2);
      const randoms = new Float32Array(total * 2);
      const brightness = new Float32Array(total);
      const gradient = new Float32Array(total);
      const order = new Float32Array(total);

      // 「have your inabakun」の読み順(1行目を左→右に書き切ってから
      // 2行目を左→右)で一筆書きさせるため、y方向の密度が最も薄い箇所
      // (2行の間の谷)を境界として2行に分け、行ごとにx順で並べる。
      // 筆記体で行間に完全な空白行は無いため、隙間検出ではなく
      // ヒストグラムの谷で分離する。
      const BIN_COUNT = 60;
      const binHeight = logoSample.height / BIN_COUNT;
      const histogram = new Array(BIN_COUNT).fill(0);
      logoSample.points.forEach((point) => {
        const bin = Math.min(BIN_COUNT - 1, Math.floor(point.y / binHeight));
        histogram[bin] += 1;
      });
      const searchStart = Math.floor(BIN_COUNT * 0.25);
      const searchEnd = Math.floor(BIN_COUNT * 0.75);
      let minCount = Infinity;
      let minBin = Math.floor(BIN_COUNT / 2);
      for (let b = searchStart; b <= searchEnd; b++) {
        if (histogram[b] < minCount) {
          minCount = histogram[b];
          minBin = b;
        }
      }
      const rowBoundary = (minBin + 0.5) * binHeight;
      const rowCount = 2;
      const rowOf = (y: number) => (y < rowBoundary ? 0 : 1);
      const rowXRange = Array.from({ length: rowCount }, () => ({
        min: Infinity,
        max: -Infinity,
      }));
      logoSample.points.forEach((point) => {
        const range = rowXRange[rowOf(point.y)];
        if (point.x < range.min) range.min = point.x;
        if (point.x > range.max) range.max = point.x;
      });

      logoSample.points.forEach((point, index) => {
        const vx = (point.x / logoSample.width) * LOGO_WIDTH - LOGO_WIDTH / 2;
        const vy =
          (point.y / logoSample.height) * LOGO_HEIGHT - LOGO_HEIGHT / 2;

        const i2 = index * 2;
        targets[i2] = vx;
        targets[i2 + 1] = vy;

        // 一筆書きのように左から右へ順番にペン先が通ったところへ
        // インクが乗るイメージで、目標位置のすぐ近く・やや左後方から出現させる
        const jitterAngle = Math.random() * Math.PI * 2;
        const jitterRadius = 14 + Math.random() * 34;
        starts[i2] = vx + Math.cos(jitterAngle) * jitterRadius - 26;
        starts[i2 + 1] = vy + Math.sin(jitterAngle) * jitterRadius;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        brightness[index] = point.brightness;
        // 上端(オレンジ)から下端(レッド)へのグラデーション位置
        gradient[index] = vy / LOGO_HEIGHT + 0.5;
        // ペン先が通過する順番。「have your」を書き切ってから「inabakun」
        // に進むよう、行番号 + 行内でのx位置で決める
        const row = rowOf(point.y);
        const range = rowXRange[row];
        const xInRow =
          range.max > range.min
            ? (point.x - range.min) / (range.max - range.min)
            : 0;
        order[index] = (row + xInRow) / rowCount;
      });

      const geometry = new Geometry(gl, {
        aTarget: { size: 2, data: targets },
        aStart: { size: 2, data: starts },
        aRandom: { size: 2, data: randoms },
        aBrightness: { size: 1, data: brightness },
        aGradient: { size: 1, data: gradient },
        aOrder: { size: 1, data: order },
      });

      program = new Program(gl, {
        vertex,
        fragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          uResolution: { value: [gl.canvas.width, gl.canvas.height] },
          uScale: { value: 1 },
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uMouse: { value: [-9999, -9999] },
          uPointSize: { value: 3.1 },
          uDpr: { value: renderer.dpr },
        },
      });

      mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
      resize();
      isInitDone = true;
      tryStart();
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!program || !mesh || !startTime) return;

      mouse.x += (targetMouse.x - mouse.x) * 0.18;
      mouse.y += (targetMouse.y - mouse.y) * 0.18;

      const elapsed = Math.max(0, (now - startTime) / 1000);
      const progress = Math.min(1, elapsed / CONVERGE_DURATION);
      // ロゴはできるだけ原寸に近いサイズで、コンテナいっぱいに収める
      const scale =
        Math.min(gl.canvas.width / LOGO_WIDTH, gl.canvas.height / LOGO_HEIGHT) *
        1.12;

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uProgress.value = progress;
      program.uniforms.uScale.value = scale;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(tick);
    void init();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      offIntroGateReady();
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Have Your Inabakun"
      className="h-[70vh] w-full md:h-[80vh]"
    />
  );
};

export default ParticlePortrait;
