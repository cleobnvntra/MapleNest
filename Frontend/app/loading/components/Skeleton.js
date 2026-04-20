import React from "react";
import { Typography } from "@material-tailwind/react";

const Skeleton = ({ isChat }) => {
  const headingWidth = !isChat ? "w-56" : "w-5";

  return (
    <div className="flex animate-pulse rounded-lg flex-wrap items-center gap-8 w-full bg-[#35393E] py-2 px-3 mb-3">
      <div className="grid -mr-5 h-12 w-12 place-items-center rounded-lg bg-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
      <div className="w-max">
        <Typography
          as="div"
          variant="h1"
          className={`mb-4 h-3 w-52 ${headingWidth} rounded-full bg-gray-300`}
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className="mb-2 h-2 w-80 rounded-full bg-gray-300"
        >
          &nbsp;
        </Typography>
      </div>
    </div>
  );
};

export default Skeleton;
