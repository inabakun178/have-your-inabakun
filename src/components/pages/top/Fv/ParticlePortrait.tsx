import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import { loadImage, sampleImageParticles } from "./particleSampler";
import { fragment, vertex } from "./shaders";

// 実寸(px)ベースの仮想座標系。顔写真の下にロゴを配置した構図をこの単位で組み立てる。
const PORTRAIT_WIDTH = 405;
const PORTRAIT_HEIGHT = 519;
const LOGO_WIDTH = 943;
const LOGO_HEIGHT = 471;
const GAP = 70;
const VIRTUAL_WIDTH = LOGO_WIDTH;
const VIRTUAL_HEIGHT = PORTRAIT_HEIGHT + GAP + LOGO_HEIGHT;

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
      const [portraitImage, logoImage] = await Promise.all([
        loadImage("/inabakun.png"),
        loadImage("/fv_title.svg"),
      ]);
      if (destroyed) return;

      const portraitSample = sampleImageParticles(portraitImage, {
        targetWidth: 170,
        maxPoints: 5200,
        mode: "luminance",
        threshold: 246,
      });
      const logoSample = sampleImageParticles(logoImage, {
        targetWidth: 460,
        maxPoints: 2600,
        mode: "alpha",
        threshold: 40,
      });

      const total = portraitSample.points.length + logoSample.points.length;
      const targets = new Float32Array(total * 2);
      const starts = new Float32Array(total * 2);
      const randoms = new Float32Array(total * 2);
      const brightness = new Float32Array(total);
      const tint = new Float32Array(total);

      let cursor = 0;
      const pushPoint = (
        vx: number,
        vy: number,
        pointBrightness: number,
        pointTint: number,
      ) => {
        const i2 = cursor * 2;
        targets[i2] = vx;
        targets[i2 + 1] = vy;

        const angle = Math.random() * Math.PI * 2;
        const radius = 260 + Math.random() * 480;
        starts[i2] = Math.cos(angle) * radius;
        starts[i2 + 1] = Math.sin(angle) * radius - 40;

        randoms[i2] = Math.random();
        randoms[i2 + 1] = Math.random();
        brightness[cursor] = pointBrightness;
        tint[cursor] = pointTint;
        cursor += 1;
      };

      portraitSample.points.forEach((point) => {
        const vx =
          (point.x / portraitSample.width) * PORTRAIT_WIDTH -
          PORTRAIT_WIDTH / 2;
        const vy =
          (point.y / portraitSample.height) * PORTRAIT_HEIGHT -
          VIRTUAL_HEIGHT / 2;
        pushPoint(vx, vy, point.brightness, 0);
      });

      logoSample.points.forEach((point) => {
        const vx = (point.x / logoSample.width) * LOGO_WIDTH - LOGO_WIDTH / 2;
        const vy =
          PORTRAIT_HEIGHT +
          GAP +
          (point.y / logoSample.height) * LOGO_HEIGHT -
          VIRTUAL_HEIGHT / 2;
        pushPoint(vx, vy, point.brightness, 1);
      });

      const geometry = new Geometry(gl, {
        aTarget: { size: 2, data: targets },
        aStart: { size: 2, data: starts },
        aRandom: { size: 2, data: randoms },
        aBrightness: { size: 1, data: brightness },
        aTint: { size: 1, data: tint },
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
          uPointSize: { value: 2.6 },
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
      const scale =
        Math.min(
          gl.canvas.width / VIRTUAL_WIDTH,
          gl.canvas.height / VIRTUAL_HEIGHT,
        ) * 0.74;

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
      className="h-[70vh] w-full max-w-[600px] md:h-[80vh]"
    />
  );
};

export default ParticlePortrait;
