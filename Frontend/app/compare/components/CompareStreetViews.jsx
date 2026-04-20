import React, { Suspense } from "react";

import StreetView from "@/app/map/StreetView";

const CompareStreetViews = ({ displayData }) => {
  return (
    <div className="flex flex-col tablet-xl:flex-row justify-between items-stretch gap-2 h-full">
      <div className="w-full lg:w-[48%] h-full">
          <StreetView neighborhood={displayData.neighbourhood1} />
      </div>

      <div class="p-0.5 tablet-xl:w-[2px] tablet-xl:p-0  my-3 rounded bg-[#B0BEC6]" />

      <div className="w-full lg:w-[48%] h-full">
          <StreetView neighborhood={displayData.neighbourhood2} />
      </div>
    </div>
  );
};

export default CompareStreetViews;
