"use client";
import { Select, Option } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "@/i18nConfig";

const languages = [
  {
    short: "en",
    long: "English",
  },
  {
    short: "fr",
    long: "French",
  },
  {
    short: "de",
    long: "German",
  },
  {
    short: "hi",
    long: "Hindi",
  },
  {
    short: "ru",
    long: "Russian",
  },
  {
    short: "uk",
    long: "Ukrainian",
  },
  {
    short: "zh",
    long: "Chinese",
  },
];

export function getLongLanguage(short) {
  const lang = languages.find(l => l.short === short);
  return lang.long;
}

export default function LanguageChanger() {
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const translation = {
    text34: t("text34"),
  };

  const handleChange = (e) => {
    const newLocale = e;

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`)
      );
    }

    router.refresh();
  };

  languages.sort((a, b) => a.long.localeCompare(b.long));

  return (
    <Select
      label={translation.text34}
      value={currentLocale}
      onChange={handleChange}
    >
      {languages.map((lang) => {
        return (
          <Option key={lang.short} value={lang.short}>
            {lang.long}
          </Option>
        );
      })}
    </Select>
  );
}
