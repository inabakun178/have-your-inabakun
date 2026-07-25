export const snsLinkList = [
  {
    link: "https://www.instagram.com/purupuruboy2?igsh=dDB0cDd2dGN2bHEw&utm_source=qr",
    image: "icon-instagram.svg",
    name: "Instagram",
  },
  {
    link: "https://twitter.com/dev_inabakun",
    image: "icon-twitter.svg",
    name: "Twitter",
  },
  {
    link: "https://github.com/inabakun178",
    image: "icon-github.svg",
    name: "GitHub",
  },
];

type SnsListProps = {
  // "fixed": PC で画面右下に固定表示するレイアウト (SP は HeaderNavigation のメニュー内に出すのでここでは隠す)
  // "inline": メニュードロワーなど、別の場所に横並びで埋め込むレイアウト
  variant?: "fixed" | "inline";
};

const SnsList = ({ variant = "fixed" }: SnsListProps) => {
  const isFixed = variant === "fixed";

  return (
    <div
      className={
        isFixed
          ? "fixed right-[15px] bottom-[15px] z-[1100] hidden md:block"
          : undefined
      }
    >
      <ul className={isFixed ? undefined : "flex justify-center gap-x-6"}>
        {snsLinkList.map((snsLink, index) => (
          <li
            key={snsLink.name}
            className={isFixed && index !== 0 ? "mt-[15px]" : undefined}
          >
            {/* target / rel は Chakra の Link isExternal が付けていたものを引き継ぐ */}
            <a href={snsLink.link} target="_blank" rel="noopener noreferrer">
              {/* svg をそのまま出したいので next/image は使わない */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/${snsLink.image}`}
                alt={snsLink.name}
                className="w-10"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnsList;
