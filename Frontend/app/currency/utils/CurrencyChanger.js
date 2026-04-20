import React from "react";
import { useAtom } from "jotai";
import { currencyAtom } from "../data/atoms";
import { Select, Option } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const currencies = {
  CAD: {
    exchangeRate: 1,
    sign: "$",
  },
  USD: {
    exchangeRate: 0.74154,
    sign: "$",
  },
  EUR: {
    exchangeRate: 0.68,
    sign: "€",
  },
  INR: {
    exchangeRate: 61.35,
    sign: "₹",
  },
  AED: {
    exchangeRate: 2.72,
    sign: "د.إ",
  },
  RUB: {
    exchangeRate: 67.23,
    sign: "₽",
  },
  UAH: {
    exchangeRate: 28.22,
    sign: "₴",
  },
  CNY: {
    exchangeRate: 5.31,
    sign: '¥'
  },
};

const CurrencyChanger = () => {
  const [value, setValue] = useAtom(currencyAtom);
  const { i18n, t } = useTranslation();

  const translation = {
    text35: t("text35"),
  };

  const handleChange = (event) => {
    setValue(event);
  };

  const currencyNames = Object.keys(currencies);

  return (
    <Select label={translation.text35} value={value} onChange={handleChange}>
      {currencyNames.map((c) => {
        return (
          <Option key={c} value={c}>
            {c}
          </Option>
        );
      })}
    </Select>
  );
};

export function currencyConverter(amount, currency) {
  console.log(amount, currency);
  if (!currencies[currency]) {
    throw new Error("Unsupported currency or exchange rate not available.");
  }
  return `${(amount * currencies[currency].exchangeRate).toFixed(2)}${currencies[currency].sign}`;
}

export default CurrencyChanger;
