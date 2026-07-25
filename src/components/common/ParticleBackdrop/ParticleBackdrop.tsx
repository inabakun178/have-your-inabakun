import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import { loadImage, sampleImageParticles } from "../../../lib/particleSampler";
import { fragment, vertex } from "./shaders";

const FADE_IN_DURATION = 2.2; // 秒
const AMBIENT_COUNT = 4200; // 画面全体に散らす粒子数

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
    };
    resize();
    window.addEventListener("resize", resize);

    const parallax = { x: 0, y: 0 };
    const targetParallax = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      targetParallax.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetParallax.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const init = async () => {
      const image = await loadImage("/site_bg.svg");
      if (destroyed) return;

      imageWidth = image.width;
      imageHeight = image.height;

      const sample = sampleImageParticles(image, {
        targetWidth: 260,
        maxPoints: 11000,
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

      // 画面全体(cover領域より少し広め)にランダムに散らばる粒子
      for (let i = 0; i < AMBIENT_COUNT; i++) {
        const index = sample.points.length + i;
        const i2 = index * 2;
        positions[i2] = (Math.random() - 0.5) * imageWidth * 1.2;
        positions[i2 + 1] = (Math.random() - 0.5) * imageHeight * 1.2;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        depths[index] = Math.random();
        brightness[index] = 0.15 + Math.random() * 0.35;
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
          uPointSize: { value: 2.2 },
          uDpr: { value: renderer.dpr },
        },
      });

      mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
      resize();
      startTime = performance.now();
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!program || !mesh || !startTime) return;

      parallax.x += (targetParallax.x - parallax.x) * 0.05;
      parallax.y += (targetParallax.y - parallax.y) * 0.05;

      const elapsed = (now - startTime) / 1000;
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

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(tick);
    void init();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
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
      className="pointer-events-none fixed top-0 left-0 h-screen w-screen"
    />
  );
};

export default ParticleBackdrop;
