export type ParticlePoint = {
  x: number;
  y: number;
  brightness: number;
};

type SampleMode = "luminance" | "luminance-bright" | "alpha";

type SampleOptions = {
  /** サンプリング用に画像を描画するオフスクリーンcanvasの幅(px) */
  targetWidth: number;
  /** 間引き後に残す最大点数 */
  maxPoints: number;
  mode: SampleMode;
  /**
   * luminance モード: これより暗い(背景でない)ピクセルを採用する閾値(0-255)。白背景の写真向け。
   * luminance-bright モード: これより明るいピクセルを採用する閾値(0-255)。黒背景の写真向け。
   * alpha モード: これより不透明なピクセルを採用する閾値(0-255)
   */
  threshold: number;
};

export type SampleResult = {
  points: ParticlePoint[];
  width: number;
  height: number;
};

export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`画像の読み込みに失敗しました: ${src}`));
    image.src = src;
  });

/**
 * 画像をオフスクリーンcanvasに描画し、ピクセルを間引きながら
 * パーティクルの元になる座標と明るさをサンプリングする。
 */
export const sampleImageParticles = (
  image: HTMLImageElement,
  { targetWidth, maxPoints, mode, threshold }: SampleOptions,
): SampleResult => {
  const width = targetWidth;
  const height = Math.round(targetWidth * (image.height / image.width));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { points: [], width, height };

  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);

  const candidates: ParticlePoint[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (mode === "alpha") {
        if (a > threshold) {
          candidates.push({ x, y, brightness: a / 255 });
        }
        continue;
      }

      const luminance = r * 0.299 + g * 0.587 + b * 0.114;

      if (mode === "luminance-bright") {
        if (a > 128 && luminance > threshold) {
          const brightness = Math.min(1, Math.max(0.25, luminance / 255));
          candidates.push({ x, y, brightness });
        }
        continue;
      }

      if (a > 128 && luminance < threshold) {
        // 暗いピクセルほど黒背景の上で目立つよう明るさを反転させる
        const brightness = Math.min(1, Math.max(0.25, 1 - luminance / 255));
        candidates.push({ x, y, brightness });
      }
    }
  }

  const step = Math.max(1, Math.ceil(candidates.length / maxPoints));
  const points = candidates.filter((_, index) => index % step === 0);

  return { points, width, height };
};
