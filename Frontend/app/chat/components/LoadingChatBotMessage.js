import React from "react";
import Animate from "../../loading/components/Animate";
import { Typography } from "@material-tailwind/react";
import { Card, CardBody } from "@material-tailwind/react";

const LoadingChatBotMessage = () => {
  return (
    <Animate key={1}>
      <div className=" p-4">
        <Card className="mt-6 w-full animate-pulse bg-[#35393E]">
          <CardBody className=" flex flex-col items-start ">
            <div className=" flex gap-1 items-center ">
              <div className="grid h-full bg-[#35393E] w-full place-items-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-12 w-12 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
              <Typography
                as="div"
                variant="h6"
                className="mb-4 w-12 h-3 rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
            </div>
            <div className=" w-full">
              <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 mt-5 w-full rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
              <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-full rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
              <Typography
                as="div"
                variant="paragraph"
                className="mb-2 h-2 w-full rounded-full bg-gray-300"
              >
                &nbsp;
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </Animate>
  );
};

export default LoadingChatBotMessage;
