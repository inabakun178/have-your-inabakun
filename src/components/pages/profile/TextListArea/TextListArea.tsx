type TextListAreaProps = {
  title: string;
  items: string[];
};

const TextListArea = (props: TextListAreaProps) => {
  return (
    <div className="bg-background-sub block items-center px-5 py-[50px] md:px-[50px] md:py-[120px] xl:flex">
      <p className="text-[30px] text-white/50 md:min-w-[25%] md:text-[90px]">
        {props.title}
      </p>
      <ul className="mt-[20px] text-[15px] leading-[1.8] tracking-[0.1em] text-white/50 md:text-[18px] xl:mt-0 xl:pl-[100px]">
        {props.items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};

export default TextListArea;
