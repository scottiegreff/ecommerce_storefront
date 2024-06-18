import type { Billboard } from "@/types";

interface BillboardProps {
  data: Billboard;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="flex justify-center items-center pt-10 mb-20 rounded-xl overflow-hidden">
      <div
        style={{ backgroundImage: `url(${data?.imageUrl})` }}
        className="h-[35vh] w-[90vw]  md:h-[70vh] md:w-[70vw] bg-contain bg-center bg-no-repeat rounded"
      >
         {/* <div className="h-full w-full text-center gap-y-8 flex items-center justify-center">
          <div className="font-bold text-3xl text-pink-400 sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs">
            {data?.label}
          </div>
        </div>  */}
      </div>
    </div>
  );
};

export default Billboard;

