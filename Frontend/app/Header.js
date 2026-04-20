"use client";
import React from "react";
import { Typography } from "@material-tailwind/react";
import LanguageChanger from "./translation/components/LanguageChanger";
import CurrencyChanger from "./currency/utils/CurrencyChanger";
import useSpecificTranslation from "./translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "./translation/hooks/useCurrentLanguage";
import TutorialToggle from "./tutorial/TutorialToggle";

export default function Header() {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();

  return (
    <div className="bg-transparent w-full px-6 rounded-lg py-6 mt-2 mx-auto header">
      <div className="flex flex-col px-4 2xl:flex-row 2xl:justify-between">
        <div className="flex flex-col 2xl:flex-row items-center gap-4 shrink-0">
          <>
            <div className="loader flex justify-center items-center w-full h-full">
              <div className="cube">
                <div className="face">
                  <img
                    src="/image.png"
                    alt="logo-ct"
                    className="border-radius w-full h-full"
                  />
                </div>
                <div className="face">
                  <img
                    src="/image.png"
                    alt="logo-ct"
                    className="border-radius w-full h-full"
                  />
                </div>
                <div className="face">
                  <img
                    src="/image.png"
                    alt="logo-ct"
                    className="border-radius w-full h-full"
                  />
                </div>
                <div className="face">
                  <img
                    src="/image.png"
                    alt="logo-ct"
                    className="border-radius w-full h-full"
                  />
                </div>
                <div className="face">
                  <img
                    src="/image.png"
                    alt="logo-ct"
                    className="border-radius w-full h-full"
                  />
                </div>
              </div>
            </div>
          </>
          <div className=" text-center flex flex-col gap-4 items-center 2xl:items-start">
            <Typography variant="h2" color="blue-gray">
              Maple Nest
            </Typography>
            <Typography variant="h5" color="blue-gray" className="">
              {translate("text58", currentLanguage)}
            </Typography>
          </div>
        </div>
        <div className="flex justify-center items-center 2xl:flex-row flex-col mt-3 ">
          <CurrencyChanger />
          <div className="m-4" />
          <LanguageChanger />
          <div className="m-2" />
          <TutorialToggle />
        </div>
      </div>
    </div>
  );
}
