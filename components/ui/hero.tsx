import type { Hero } from "@/types";

interface HeroProps {
  data: Hero[];
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const img = data[0]?.imageUrl as string;
  const label = data[0]?.label;

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden text-white">
      <div
       
        style={{ backgroundImage: `url(${img})`}}
        className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
      >
        <div className="h-full w-full flex flex-col justify-center items-center text-center gap-y-8">
          <div className="font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
