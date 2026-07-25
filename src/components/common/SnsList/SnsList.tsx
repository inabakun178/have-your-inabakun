const snsLinkList = [
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

const SnsList = () => {
  return (
    <div className="fixed right-[15px] bottom-[15px] z-[1100]">
      <ul>
        {snsLinkList.map((snsLink, index) => (
          <li
            key={snsLink.name}
            className={index === 0 ? undefined : "mt-[15px]"}
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
