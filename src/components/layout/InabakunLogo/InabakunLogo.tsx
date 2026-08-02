type InabakunLogoProps = {
  className?: string;
};

// サイトロゴ。cyan/magenta の色ズレレイヤーを白テキストに重ね、
// glitch アニメーションで断続的にノイズが走るようにしている。
// data-text で同じ文字列を3重に持たせ、疑似要素ではなく実要素の
// stacking で RGB 分離を表現する（::before/::after だと Tailwind の
// content 制御が煩雑になるため）。
const InabakunLogo = ({ className }: InabakunLogoProps) => {
  return (
    <span
      className={`text-logo-glitch relative inline-block font-mono font-bold tracking-[0.02em] whitespace-nowrap ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="text-logo-glitch__layer text-logo-glitch__layer--cyan">
        inabakun_
      </span>
      <span className="text-logo-glitch__layer text-logo-glitch__layer--magenta">
        inabakun_
      </span>
      <span className="text-logo-glitch__layer text-logo-glitch__layer--base">
        inabakun_
      </span>
    </span>
  );
};

export default InabakunLogo;
