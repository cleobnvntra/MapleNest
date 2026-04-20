"use client";
import { useTranslation } from "react-i18next";
import translateDuration from "../utils/translateDuration";

const useTranslateDuration = () => {
  const { t } = useTranslation();
  return (duration) => {
    return translateDuration(duration, t);
  };
};

export default useTranslateDuration;
