import Animate from "@/app/loading/components/Animate";
import ImageSlider from "../../map/Slider";

const CompareImages = ({ displayData }) => {
  return (
    <Animate>
      <div className="flex flex-col tablet-xl:flex-row justify-between items-stretch gap-2 h-full">
        <div className="w-full lg:w-[48%] carousel h-full compareCarousel">
          <ImageSlider images={displayData.images1} />
        </div>

        <div class="p-0.5 tablet-xl:w-[2px] tablet-xl:p-0 shrink-0 my-3 rounded bg-[#B0BEC6]"/>


        <div className="w-full lg:w-[48%] carousel h-full compareCarousel">
          <ImageSlider images={displayData.images2} />
        </div>
      </div>
    </Animate>
  );
};

export default CompareImages;
