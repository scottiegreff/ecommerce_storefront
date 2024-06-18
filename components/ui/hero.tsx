import type { Hero } from "@/types";
import Image from "next/image";

interface HeroProps {
  data: Hero[];
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const img = data[0]?.imageUrl as string;
  const label = data[0]?.label;

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden text-white">

      <Image
        src={img}
        alt={label}
        layout="responsive"
        width={50}
        height={50}
        className="rounded-xl z-20 m-auto w-[10vw] h-[10vh]" // Ensure image covers the entire area
      />
    </div>
  );
};

export default Hero;
