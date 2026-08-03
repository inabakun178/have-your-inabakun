type InabakunLogoProps = {
  className?: string;
};

// サイトロゴ。public/inabakun-logo.webp (白文字 + 黒背景) を土台に、
// 同じ画像を mask-image として使った cyan/magenta のシルエットを重ね、
// mix-blend-mode: screen で黒背景を透過させつつ色ズレを表現している。
// 動きは global.css の logo-glitch-shift キーフレームで、8秒サイクルの
// 終盤だけノイズが走るバースト構成にしている。
const InabakunLogo = ({ className }: InabakunLogoProps) => {
  return (
    <span
      className={`text-logo-glitch relative inline-block align-middle ${className ?? ""}`}
      style={{ aspectRatio: "40 / 9" }}
    >
      <span
        className="text-logo-glitch__layer text-logo-glitch__layer--cyan"
        aria-hidden="true"
      />
      <span
        className="text-logo-glitch__layer text-logo-glitch__layer--magenta"
        aria-hidden="true"
      />
      {/* mix-blend-mode を使いたいので next/image の Optimizer は挟まず、素の img で出す */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/inabakun-logo.webp"
        alt="inabakun"
        className="text-logo-glitch__layer text-logo-glitch__layer--base h-full w-full"
      />
    </span>
  );
};

export default InabakunLogo;
