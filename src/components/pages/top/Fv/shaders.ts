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
    float wobble = sin(uTime * 0.3 + aRandom.y * 6.2831853) * (1.4 + aRandom.x * 1.6);
    float wobbleY = cos(uTime * 0.25 + aRandom.x * 6.2831853) * 1.2;
    pos += vec2(wobble, wobbleY) * eased;

    // 粒子ごとに軌道半径・速度をずらした螺旋運動
    float spiralSpeed = 0.2 + aRandom.x * 0.25;
    float spiralAngle = uTime * spiralSpeed + aRandom.y * 6.2831853;
    float spiralRadius = (5.0 + aRandom.y * 9.0) *
      (0.55 + 0.45 * sin(uTime * 0.15 + aRandom.x * 6.2831853));
    pos += vec2(cos(spiralAngle), sin(spiralAngle)) * spiralRadius * eased;

    // 形状全体がゆっくり収縮・拡大する呼吸運動
    float breathe = 1.0 + sin(uTime * 0.3) * 0.08 + sin(uTime * 0.75) * 0.03;
    pos *= mix(1.0, breathe, eased);

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

    // ロゴの実際の描画スケールに応じて粒のサイズも比例させる。
    // 画面が狭くロゴが小さく描かれるほど粒だけが相対的に大きくなり
    // 文字が潰れて見えるため、スケールが小さいほど粒も小さくする
    float sizeScale = clamp(uScale / 1.55, 0.55, 1.0);

    gl_Position = vec4(clip, 0.0, 1.0);
    gl_PointSize = uPointSize * uDpr * sizeScale * (0.6 + aBrightness * 0.9) * mix(0.35, 1.0, eased);

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

    float alpha = smoothstep(0.5, 0.0, d) * (0.55 + vBrightness * 0.45) * vEased;

    // 上から下にオレンジ→レッドのグラデーション
    vec3 orange = vec3(0.949, 0.451, 0.078); // #f27314
    vec3 red = vec3(0.784, 0.098, 0.078); // #c81914
    vec3 color = mix(orange, red, vGradient);

    gl_FragColor = vec4(color, alpha);
  }
`;
