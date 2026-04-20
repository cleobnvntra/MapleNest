"use client";
import { useTranslation } from "react-i18next";

export default () => {
  const { i18n } = useTranslation();

  return (key, lang) => {
    const resource = i18n.getResource(lang, "default", key);
    return resource || key;
  };
};
