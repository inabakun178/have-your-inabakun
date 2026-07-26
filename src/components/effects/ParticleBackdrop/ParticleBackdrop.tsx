"use client";

import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import { loadImage, sampleImageParticles } from "@/lib/particleSampler";
import { fragment, lineFragment, vertex } from "./shaders";

const FADE_IN_DURATION = 2.2; // 秒
const START_DELAY = 1.0; // 秒(出現タイミングを遅らせる待ち時間)
const AMBIENT_COUNT = 9000; // 画面全体に散らす粒子数
const CONNECT_RADIUS = 20; // 輪郭粒子どうしを線で結ぶ距離(画像座標系, px)
const MAX_NEIGHBORS_PER_POINT = 2; // 1点あたりの最大接続数(多すぎると網目が潰れる)
const MAX_LINES = 6000; // 描画する線分の上限(パフォーマンス対策)

/**
 * 輪郭粒子どうしの近傍ペアを空間グリッドで探索し、細胞膜・DNA鎖のような
 * 網目状の線分インデックスを作る。O(n^2)を避けるためグリッド分割で探索範囲を絞る。
 */
const buildConnections = (
  vx: Float32Array,
  vy: Float32Array,
  count: number,
): Array<[number, number]> => {
  const cellSize = CONNECT_RADIUS;
  const grid = new Map<string, number[]>();

  for (let i = 0; i < count; i++) {
    const cx = Math.floor(vx[i] / cellSize);
    const cy = Math.floor(vy[i] / cellSize);
    const key = `${cx},${cy}`;
    const bucket = grid.get(key);
    if (bucket) bucket.push(i);
    else grid.set(key, [i]);
  }

  const maxDistSq = CONNECT_RADIUS * CONNECT_RADIUS;
  const degree = new Uint8Array(count);
  const lines: Array<[number, number]> = [];

  for (let i = 0; i < count && lines.length < MAX_LINES; i++) {
    if (degree[i] >= MAX_NEIGHBORS_PER_POINT) continue;

    const cx = Math.floor(vx[i] / cellSize);
    const cy = Math.floor(vy[i] / cellSize);
    const candidates: Array<{ j: number; distSq: number }> = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const bucket = grid.get(`${cx + dx},${cy + dy}`);
        if (!bucket) continue;
        for (const j of bucket) {
          if (j <= i || degree[j] >= MAX_NEIGHBORS_PER_POINT) continue;
          const ddx = vx[i] - vx[j];
          const ddy = vy[i] - vy[j];
          const distSq = ddx * ddx + ddy * ddy;
          if (distSq < maxDistSq) candidates.push({ j, distSq });
        }
      }
    }

    candidates.sort((a, b) => a.distSq - b.distSq);
    for (const { j } of candidates) {
      if (degree[i] >= MAX_NEIGHBORS_PER_POINT || lines.length >= MAX_LINES)
        break;
      lines.push([i, j]);
      degree[i]++;
      degree[j]++;
    }
  }

  return lines;
};

/**
 * 背景画像(site_bg.svg)をパーティクルの浮遊メッシュとして描画する
 * 画面全体固定のWebGL背景。マウス位置に応じて視差で揺らめく。
 */
const ParticleBackdrop = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    let destroyed = false;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let lineProgram: Program | null = null;
    let lineMesh: Mesh | null = null;
    let startTime = 0;
    let imageWidth = 1;
    let imageHeight = 1;

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
      if (lineProgram) {
        lineProgram.uniforms.uResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
        ];
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const parallax = { x: 0, y: 0 };
    const targetParallax = { x: 0, y: 0 };

    // スマホ(タッチ主体の端末)ではマウス座標の代わりに端末の傾き(ジャイロ)で
    // パララックスを動かす
    const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches;

    const handlePointerMove = (event: PointerEvent) => {
      if (isCoarsePointer) return;
      targetParallax.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetParallax.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const GYRO_TILT_RANGE = 24; // deg
    // 手持ちの自然な傾き(縦持ちでやや手前に傾く)を中央として補正
    const GYRO_BETA_CENTER = 40; // deg

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) return;
      targetParallax.x = Math.max(
        -1,
        Math.min(1, event.gamma / GYRO_TILT_RANGE),
      );
      targetParallax.y = Math.max(
        -1,
        Math.min(1, (event.beta - GYRO_BETA_CENTER) / GYRO_TILT_RANGE),
      );
    };

    const enableGyro = () => {
      window.addEventListener("deviceorientation", handleOrientation);
    };

    type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    const requestGyroPermission = () => {
      const DOE = DeviceOrientationEvent as DeviceOrientationEventIOS;
      if (typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((state) => {
            if (state === "granted") enableGyro();
          })
          .catch(() => {});
      } else {
        enableGyro();
      }
    };

    if (isCoarsePointer && typeof DeviceOrientationEvent !== "undefined") {
      const DOE = DeviceOrientationEvent as DeviceOrientationEventIOS;
      if (typeof DOE.requestPermission === "function") {
        // iOSはユーザー操作(タップ)を起点にしないと許可ダイアログを出せない
        window.addEventListener("touchend", requestGyroPermission, {
          once: true,
        });
      } else {
        enableGyro();
      }
    }

    const init = async () => {
      const image = await loadImage("/site_bg.svg");
      if (destroyed) return;

      imageWidth = image.width;
      imageHeight = image.height;

      const sample = sampleImageParticles(image, {
        targetWidth: 200,
        maxPoints: 7000,
        mode: "luminance-bright",
        threshold: 26,
      });

      // 被写体の輪郭に沿う粒子 + 画面全体に散らす粒子(常に揺らめく)
      const total = sample.points.length + AMBIENT_COUNT;
      const positions = new Float32Array(total * 2);
      const depths = new Float32Array(total);
      const randoms = new Float32Array(total * 2);
      const brightness = new Float32Array(total);
      const shape = new Float32Array(total);

      sample.points.forEach((point, index) => {
        const vx = (point.x / sample.width) * imageWidth - imageWidth / 2;
        const vy = (point.y / sample.height) * imageHeight - imageHeight / 2;

        const i2 = index * 2;
        positions[i2] = vx;
        positions[i2 + 1] = vy;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        depths[index] = Math.random();
        brightness[index] = point.brightness;
        shape[index] = 1;
      });

      // 画面全体(端まで少し広め)にランダムに散らばる粒子
      // 画面解像度に対する割合(-0.5〜0.5)で配置するため、画像のアスペクト比に
      // 依存せず常に画面いっぱいに均等に散らばる
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        const index = sample.points.length + i;
        const i2 = index * 2;
        positions[i2] = (Math.random() - 0.5) * 1.15;
        positions[i2 + 1] = (Math.random() - 0.5) * 1.15;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        depths[index] = Math.random();
        brightness[index] = 0.4 + Math.random() * 0.5;
        shape[index] = 0;
      }

      const geometry = new Geometry(gl, {
        aPosition: { size: 2, data: positions },
        aDepth: { size: 1, data: depths },
        aRandom: { size: 2, data: randoms },
        aBrightness: { size: 1, data: brightness },
        aShape: { size: 1, data: shape },
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
          uParallax: { value: [0, 0] },
          uPointSize: { value: 2.7 },
          uDpr: { value: renderer.dpr },
        },
      });

      mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

      // 輪郭粒子(shape=1)どうしを近傍探索で結び、細胞膜・DNA鎖のような網目を描く
      const shapeVx = new Float32Array(sample.points.length);
      const shapeVy = new Float32Array(sample.points.length);
      for (let i = 0; i < sample.points.length; i++) {
        shapeVx[i] = positions[i * 2];
        shapeVy[i] = positions[i * 2 + 1];
      }
      const connections = buildConnections(
        shapeVx,
        shapeVy,
        sample.points.length,
      );

      if (connections.length > 0) {
        const lineTotal = connections.length * 2;
        const linePositions = new Float32Array(lineTotal * 2);
        const lineDepths = new Float32Array(lineTotal);
        const lineRandoms = new Float32Array(lineTotal * 2);
        const lineBrightness = new Float32Array(lineTotal);
        const lineShape = new Float32Array(lineTotal).fill(1);

        connections.forEach(([a, b], li) => {
          [a, b].forEach((pointIndex, endIndex) => {
            const vi = li * 2 + endIndex;
            linePositions[vi * 2] = positions[pointIndex * 2];
            linePositions[vi * 2 + 1] = positions[pointIndex * 2 + 1];
            lineRandoms[vi * 2] = randoms[pointIndex * 2];
            lineRandoms[vi * 2 + 1] = randoms[pointIndex * 2 + 1];
            lineDepths[vi] = depths[pointIndex];
            lineBrightness[vi] = brightness[pointIndex];
          });
        });

        const lineGeometry = new Geometry(gl, {
          aPosition: { size: 2, data: linePositions },
          aDepth: { size: 1, data: lineDepths },
          aRandom: { size: 2, data: lineRandoms },
          aBrightness: { size: 1, data: lineBrightness },
          aShape: { size: 1, data: lineShape },
        });

        lineProgram = new Program(gl, {
          vertex,
          fragment: lineFragment,
          transparent: true,
          depthTest: false,
          uniforms: {
            uResolution: { value: [gl.canvas.width, gl.canvas.height] },
            uScale: { value: 1 },
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uParallax: { value: [0, 0] },
            uPointSize: { value: 1 },
            uDpr: { value: renderer.dpr },
          },
        });

        lineMesh = new Mesh(gl, {
          mode: gl.LINES,
          geometry: lineGeometry,
          program: lineProgram,
        });
      }

      resize();
      startTime = performance.now() + START_DELAY * 1000;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!program || !mesh || !startTime) return;

      parallax.x += (targetParallax.x - parallax.x) * 0.05;
      parallax.y += (targetParallax.y - parallax.y) * 0.05;

      const elapsed = Math.max(0, (now - startTime) / 1000);
      const progress = Math.min(1, elapsed / FADE_IN_DURATION);
      // 画面全体を覆うcover相当のスケール
      const scale = Math.max(
        gl.canvas.width / imageWidth,
        gl.canvas.height / imageHeight,
      );

      program.uniforms.uTime.value = elapsed;
      program.uniforms.uProgress.value = progress;
      program.uniforms.uScale.value = scale;
      program.uniforms.uParallax.value = [parallax.x, parallax.y];

      if (lineProgram) {
        lineProgram.uniforms.uTime.value = elapsed;
        lineProgram.uniforms.uProgress.value = progress;
        lineProgram.uniforms.uScale.value = scale;
        lineProgram.uniforms.uParallax.value = [parallax.x, parallax.y];
      }

      // 線を先に描いてから粒子を重ねることで、粒子が網目の上に乗って見える
      // (lineWidthは環境によっては1pxに制限されるが、対応環境では少し太く見せる)
      if (lineMesh) {
        gl.lineWidth(2);
        renderer.render({ scene: lineMesh });
      }
      renderer.render({ scene: mesh, clear: false });
    };
    raf = requestAnimationFrame(tick);
    void init();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchend", requestGyroPermission);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 h-dvh w-screen"
    />
  );
};

export default ParticleBackdrop;
