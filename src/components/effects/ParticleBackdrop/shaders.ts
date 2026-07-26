export const vertex = /* glsl */ `
  attribute vec2 aPosition;
  attribute float aDepth;
  attribute vec2 aRandom;
  attribute float aBrightness;
  attribute float aShape;

  uniform vec2 uResolution;
  uniform float uScale;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uParallax;
  uniform float uPointSize;
  uniform float uDpr;

  varying float vBrightness;
  varying float vAlpha;
  varying float vShape;

  void main() {
    // 被写体の輪郭粒子(aShape=1)は画像座標系、画面全体の粒子(aShape=0)は
    // 画面解像度基準の座標系(-0.5〜0.5の割合)を使い、画像アスペクト比に
    // 依存せず常に画面全体へ均等に散らばるようにする
    vec2 imageSpace = aPosition * uScale;
    vec2 screenSpace = aPosition * uResolution;
    vec2 base = mix(screenSpace, imageSpace, aShape);

    // 奥行きに応じて視差の強さを変える(近いほど大きく動く)
    float parallaxStrength = mix(20.0, 110.0, aDepth) * uDpr;
    vec2 offset = uParallax * parallaxStrength;

    // 大きく漂う(円軌道寄りの動きで派手さを出す)
    float driftSpeed = mix(0.35, 0.75, aRandom.x);
    float driftRadius = mix(18.0, 70.0, aDepth) * (0.6 + 0.4 * aRandom.y);
    float driftAngle = uTime * driftSpeed + aRandom.y * 6.2831853;
    float driftX = cos(driftAngle) * driftRadius;
    float driftY = sin(driftAngle * 1.3) * driftRadius;

    vec2 screenPos = base + uResolution * 0.5 + offset + vec2(driftX, driftY);

    vec2 clip = (screenPos / uResolution) * 2.0 - 1.0;
    clip.y = -clip.y;

    // 明滅(twinkle)
    float twinkle = 0.5 + 0.5 * sin(uTime * (1.3 + aRandom.x * 2.2) + aRandom.y * 6.2831853);

    // 被写体の輪郭に沿う粒子は、周辺に散らす粒子より大きく・くっきり見せる
    float sizeBoost = mix(1.0, 2.2, aShape);
    // 粒子ごとの大小のばらつき(小さい粒が多く、たまに大きい粒が混ざる)
    float sizeVariance = pow(fract(aRandom.x * 37.13 + aRandom.y * 91.7), 2.0);
    float sizeRange = mix(0.35, 3.2, sizeVariance);

    gl_Position = vec4(clip, 0.0, 1.0);
    gl_PointSize = uPointSize * uDpr * mix(0.5, 1.4, aDepth) * sizeRange * uProgress * twinkle * sizeBoost;

    vBrightness = aBrightness * twinkle;
    vAlpha = uProgress;
    vShape = aShape;
  }
`;

export const fragment = /* glsl */ `
  precision highp float;

  varying float vBrightness;
  varying float vAlpha;
  varying float vShape;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // 人型の輪郭(vShape=1)を周囲の散らばり粒子(vShape=0)よりはっきり
    // 見せることで、粒子+線で人の形が読み取れるようにする
    float alphaBase =
      mix(0.11, 0.425, vShape) + vBrightness * mix(0.09, 0.5, vShape);
    float alpha = smoothstep(0.5, 0.0, d) * alphaBase * vAlpha;
    // 輪郭粒子(vShape=1)がほぼ不透明に見えていたため、PC/スマホ問わず
    // 0.6倍に抑えて透過させる(周辺の散らばり粒子(vShape=0)は変更しない)
    alpha *= mix(1.0, 0.6, vShape);

    // FVロゴ(オレンジ〜レッド)と色が競合して視認性が下がらないよう、
    // 背景粒子はグレーに統一する
    vec3 color = vec3(0.35, 0.35, 0.35);

    gl_FragColor = vec4(color, alpha);
  }
`;

// 被写体の輪郭粒子どうしを結ぶ線(細胞膜・DNA鎖のような網目を表現する)
export const lineFragment = /* glsl */ `
  precision highp float;

  varying float vBrightness;
  varying float vAlpha;

  void main() {
    vec3 gray = vec3(0.4, 0.4, 0.4);
    // 線が濃く見えすぎていたため、0.3倍に抑えて透過させる
    float alpha = (0.6 + vBrightness * 0.4) * vAlpha * 0.3;
    gl_FragColor = vec4(gray, alpha);
  }
`;
