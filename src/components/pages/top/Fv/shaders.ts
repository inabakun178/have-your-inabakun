export const vertex = /* glsl */ `
  attribute vec2 aTarget;
  attribute vec2 aStart;
  attribute vec2 aRandom;
  attribute float aBrightness;
  attribute float aGradient;

  uniform vec2 uResolution;
  uniform float uScale;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uPointSize;
  uniform float uDpr;

  varying float vBrightness;
  varying float vGradient;
  varying float vEased;

  void main() {
    vec2 target = aTarget * uScale;
    vec2 start = aStart * uScale;

    // 粒子ごとにランダムな遅延を付けて収束させる
    float local = clamp((uProgress - aRandom.x * 0.5) / (1.0 - aRandom.x * 0.5), 0.0, 1.0);
    float eased = local * local * (3.0 - 2.0 * local);

    vec2 pos = mix(start, target, eased);

    // 常時のゆらぎ
    float wobble = sin(uTime * 0.6 + aRandom.y * 6.2831853) * (1.4 + aRandom.x * 1.6);
    float wobbleY = cos(uTime * 0.5 + aRandom.x * 6.2831853) * 1.2;
    pos += vec2(wobble, wobbleY) * eased;

    vec2 screenPos = pos + uResolution * 0.5;

    // マウス反発
    vec2 toMouse = screenPos - uMouse;
    float dist = length(toMouse);
    float radius = 130.0 * uDpr;
    float force = smoothstep(radius, 0.0, dist) * eased;
    vec2 dir = dist > 0.0001 ? normalize(toMouse) : vec2(0.0, 0.0);
    screenPos += dir * force * 70.0;

    vec2 clip = (screenPos / uResolution) * 2.0 - 1.0;
    clip.y = -clip.y;

    gl_Position = vec4(clip, 0.0, 1.0);
    gl_PointSize = uPointSize * uDpr * (0.6 + aBrightness * 0.9) * mix(0.35, 1.0, eased);

    vBrightness = aBrightness;
    vGradient = aGradient;
    vEased = eased;
  }
`;

export const fragment = /* glsl */ `
  precision highp float;

  varying float vBrightness;
  varying float vGradient;
  varying float vEased;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, d) * (0.3 + vBrightness * 0.7) * vEased;

    // 上から下にオレンジ→レッドのグラデーション
    vec3 orange = vec3(0.949, 0.451, 0.078); // #f27314
    vec3 red = vec3(0.784, 0.098, 0.078); // #c81914
    vec3 color = mix(orange, red, vGradient);

    gl_FragColor = vec4(color, alpha);
  }
`;
