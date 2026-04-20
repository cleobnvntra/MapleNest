import React from "react";
import StatsList from "../../stats/components/StatsList";
import Animate from "@/app/loading/components/Animate";

const CompareStats = ({ stats, displayData }) => {
  const n1Stats = stats.neighbourhood1;
  const n2Stats = stats.neighbourhood2;

  const { date, campus } = displayData;

  const { apartmentType1, neighbourhood1, images1, apartments_dot_com1, condos_dot_ca1 } = displayData;
  const { apartmentType2, neighbourhood2, images2, apartments_dot_com2, condos_dot_ca2 } = displayData;

  const displayData1 = {
    campus,
    date,
    apartmentType: apartmentType1,
    neighbourhood: neighbourhood1,
    images: images1,
    apartments_dot_com: apartments_dot_com1,
    condos_dot_ca: condos_dot_ca1
  };

  const displayData2 = {
    campus,
    date,
    apartmentType: apartmentType2,
    neighbourhood: neighbourhood2,
    images: images2,
    apartments_dot_com: apartments_dot_com2,
    condos_dot_ca: condos_dot_ca2
  };

  console.log(displayData2);

  return (
    <Animate>
      <div className="flex flex-col tablet-xl:flex-row justify-between items-stretch gap-2 h-full">
        <div className="w-full lg:w-[48%]">
          <StatsList stats={n1Stats} display={displayData1} />
        </div>

        <div class="p-0.5 tablet-xl:w-[2px] tablet-xl:p-0 shrink-0 rounded bg-[#B0BEC6]"/>

        <div className="w-full lg:w-[48%]">
          <StatsList stats={n2Stats} display={displayData2} />
        </div>
      </div>
    </Animate>
  );
};

export default CompareStats;
