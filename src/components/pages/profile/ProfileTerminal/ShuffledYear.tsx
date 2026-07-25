import { useEffect, useState } from "react";

const randomDigits = () =>
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");

// 生まれ年は非公開にしたいので、4桁の数字をランダムに回し続けて隠す演出
const ShuffledYear = () => {
  const [digits, setDigits] = useState(randomDigits);

  useEffect(() => {
    const intervalId = setInterval(() => setDigits(randomDigits()), 90);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span aria-label="year: redacted" className="tabular-nums">
      {digits}
    </span>
  );
};

export default ShuffledYear;
