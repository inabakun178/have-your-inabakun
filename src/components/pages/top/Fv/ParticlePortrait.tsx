import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import {
  loadImage,
  sampleImageParticles,
} from "../../../../lib/particleSampler";
import { fragment, vertex } from "./shaders";

// ロゴ("Have Your Inabakun")の実寸(px)。この単位でパーティクルの目標座標を組み立てる。
const LOGO_WIDTH = 943;
const LOGO_HEIGHT = 471;

const CONVERGE_DURATION = 1.6; // 秒

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
        targetWidth: 760,
        maxPoints: 6500,
        mode: "alpha",
        threshold: 20,
      });

      const total = logoSample.points.length;
      const targets = new Float32Array(total * 2);
      const starts = new Float32Array(total * 2);
      const randoms = new Float32Array(total * 2);
      const brightness = new Float32Array(total);
      const gradient = new Float32Array(total);

      logoSample.points.forEach((point, index) => {
        const vx = (point.x / logoSample.width) * LOGO_WIDTH - LOGO_WIDTH / 2;
        const vy =
          (point.y / logoSample.height) * LOGO_HEIGHT - LOGO_HEIGHT / 2;

        const i2 = index * 2;
        targets[i2] = vx;
        targets[i2 + 1] = vy;

        const angle = Math.random() * Math.PI * 2;
        const radius = 260 + Math.random() * 480;
        starts[i2] = Math.cos(angle) * radius;
        starts[i2 + 1] = Math.sin(angle) * radius - 40;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        brightness[index] = point.brightness;
        // 上端(オレンジ)から下端(レッド)へのグラデーション位置
        gradient[index] = vy / LOGO_HEIGHT + 0.5;
      });

      const geometry = new Geometry(gl, {
        aTarget: { size: 2, data: targets },
        aStart: { size: 2, data: starts },
        aRandom: { size: 2, data: randoms },
        aBrightness: { size: 1, data: brightness },
        aGradient: { size: 1, data: gradient },
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
          uPointSize: { value: 4.6 },
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

      mouse.x += (targetMouse.x - mouse.x) * 0.18;
      mouse.y += (targetMouse.y - mouse.y) * 0.18;

      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1, elapsed / CONVERGE_DURATION);
      // ロゴはできるだけ原寸に近いサイズで、コンテナいっぱいに収める
      const scale =
        Math.min(gl.canvas.width / LOGO_WIDTH, gl.canvas.height / LOGO_HEIGHT) *
        0.92;

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
