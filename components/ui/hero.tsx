import type { Hero } from "@/types";
import Image from "next/image";

interface HeroProps {
  data: Hero[];
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const img = data[0]?.imageUrl as string;
  const label = data[0]?.label;

  return (
    <div className="flex justify-center items-center mt-10">
      <svg
        style={{ backgroundImage: `url(${img})` }}
        className="h-[35vh] w-[90vw]  md:h-[70vh] md:w-[70vw] bg-contain bg-center bg-no-repeat rounded-rotate-[10deg]"
        // viewBox="24 24 24 24"
      ></svg>
    </div>
  );
};

export default Hero;
{
  /* <div className="h-full w-full text-center gap-y-8 flex items-center justify-center">
        <div className="font-bold text-3xl text-pink-400 sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
          {data?.label}
        </div>
      </div>  */
}
