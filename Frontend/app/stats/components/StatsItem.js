import React from "react";
import {
  ListItem,
  ListItemPrefix,
  Typography,
  Avatar,
} from "@material-tailwind/react";

const StatsItem = ({ imgSrc, title, subtitle, subtitle2, element }) => {
  return (
    <ListItem className=" min-h-[115px] flex flex-col text-center 2xl:text-left 2xl:flex-row">
      {imgSrc && (
        <ListItemPrefix className=" w-[50px]">
          <img
            className=" rounded-full object-cover w-full h-[50px]"
            src={imgSrc}
          />
        </ListItemPrefix>
      )}
      <div className=" w-full">
        <Typography variant="h5" color="blue-gray">
          {title}
        </Typography>
        {subtitle && (
          <Typography color="gray" variant="paragraph" className="font-normal">
            {subtitle}
          </Typography>
        )}
        <div>{element && element}</div>
        {subtitle2 && (
          <Typography variant="paragraph" color="gray" className="font-normal">
            {subtitle2}
          </Typography>
        )}
      </div>
    </ListItem>
  );
};

export default StatsItem;
