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
    vec2 base = aPosition * uScale;

    // 奥行きに応じて視差の強さを変える(近いほど大きく動く)
    float parallaxStrength = mix(10.0, 60.0, aDepth) * uDpr;
    vec2 offset = uParallax * parallaxStrength;

    // 常時ゆっくり漂う
    float driftX = sin(uTime * 0.22 + aRandom.x * 6.2831853) * mix(4.0, 14.0, aDepth);
    float driftY = cos(uTime * 0.18 + aRandom.y * 6.2831853) * mix(4.0, 14.0, aDepth);

    vec2 screenPos = base + uResolution * 0.5 + offset + vec2(driftX, driftY);

    vec2 clip = (screenPos / uResolution) * 2.0 - 1.0;
    clip.y = -clip.y;

    // 明滅(twinkle)
    float twinkle = 0.65 + 0.35 * sin(uTime * (0.8 + aRandom.x * 1.4) + aRandom.y * 6.2831853);

    // 被写体の輪郭に沿う粒子は、周辺に散らす粒子より大きく・くっきり見せる
    float sizeBoost = mix(1.0, 2.2, aShape);

    gl_Position = vec4(clip, 0.0, 1.0);
    gl_PointSize = uPointSize * uDpr * mix(0.6, 1.6, aDepth) * uProgress * twinkle * sizeBoost;

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

    float alphaBase = mix(0.25, 0.55, vShape) + vBrightness * mix(0.55, 0.9, vShape);
    float alpha = smoothstep(0.5, 0.0, d) * alphaBase * vAlpha;

    vec3 dust = vec3(1.0, 1.0, 1.0);
    vec3 accent = vec3(0.949, 0.451, 0.078); // #f27314 (FVのグラデーションと揃える)
    vec3 color = mix(dust, accent, vShape * 0.8);

    gl_FragColor = vec4(color, alpha);
  }
`;
