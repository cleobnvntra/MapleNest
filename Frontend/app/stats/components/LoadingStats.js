import Skeleton from "@/app/loading/components/Skeleton";
import { TextSkeleton } from "@/app/loading/components/TextSkeleton";
import ImageSkeleton from "@/app/loading/components/ImageSkeleton";
import Animate from "@/app/loading/components/Animate";

const LoadingStats = () => {
  return (
    <Animate key={1}>
      <div className=" flex flex-col md:flex-row justify-between items-stretch h-[800px] gap-4">
        <div className="w-full md:w-[55%] flex flex-col justify-between">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>
        <div className="w-full md:w-[45%]">
          <ImageSkeleton />
        </div>
      </div>
    </Animate>
  );
};

export default LoadingStats;
