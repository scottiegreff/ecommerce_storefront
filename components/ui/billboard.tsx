import type { Billboard } from "@/types";

interface BillboardProps {
  data: Billboard;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
      <div
        style={{ backgroundImage: `url(${data?.imageUrl})` }}
        className="rounded-xl relative overflow-hidden bg-center bg-no-repeat h-screen md:h-[60vh] md:w-auto "
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

