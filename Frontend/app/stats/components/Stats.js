"use client";
import React, { useState } from "react";
import Animate from "@/app/loading/components/Animate";
import { Card } from "@material-tailwind/react";
import ImageSlider from "@/app/map/Slider";
import AdditionalDetails from "./AdditionalDetails";
import StatsList from "./StatsList";

const Stats = ({ stats, displayData }) => {
  const [display, setDisplay] = useState(displayData);

  console.log("display stats");
  console.log(stats);

  return (
    <Animate key={2}>
      <div className="flex flex-col gap-4">
        <Card className="shadow-black-fainted">
          <div className="flex flex-col ">
            <div className="w-full">
              <StatsList stats={stats} display={display} displaySlider={true} />
            </div>
            <div className="w-full block 2xl:hidden  predictCarousel">
              <ImageSlider images={display.images} />
            </div>
          </div>
        </Card>

        <AdditionalDetails selectedNeighborhood={display.neighbourhood} />
      </div>
    </Animate>
  );
};

export default React.memo(Stats);
