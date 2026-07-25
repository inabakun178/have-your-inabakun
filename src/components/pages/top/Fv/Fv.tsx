// TODO: components 配下のディレクトリ構造を変えたい
const Fv = () => {
  return (
    <div className="flex min-h-[calc(100vh_-_50px)] items-center justify-center mix-blend-difference md:min-h-[calc(100vh_-_100px)]">
      {/* svg をそのまま出したいので next/image は使わない */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/fv_title.svg" alt="Have Your Inabakun" />
    </div>
  );
};

export default Fv;
