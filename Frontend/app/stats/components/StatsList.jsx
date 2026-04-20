import React from "react";
import useCurrentCurrency from "@/app/currency/hooks/useCurrentCurrency";
import useCurrentLanguage from "@/app/translation/hooks/useCurrentLanguage";
import { useTranslation } from "react-i18next";
import { List } from "@material-tailwind/react";
import StatsItem from "./StatsItem";
import useSpecificTranslation from "@/app/translation/hooks/useSpecificTranslation";
import { currencyConverter } from "@/app/currency/utils/CurrencyChanger";
import translateDuration from "@/app/translation/utils/translateDuration";
import RentLink from "@/app/rentLink/rentLink";
import useDateFormatter from "@/app/translation/hooks/useDateFormatter";
import ImageSlider from "@/app/map/Slider";

const StatsList = ({ display, stats, displaySlider }) => {
  const currentLanguage = useCurrentLanguage();
  const { t } = useTranslation();
  const translate = useSpecificTranslation();
  const currency = useCurrentCurrency()[0];
  const dateFormatter = useDateFormatter();

  return (
    <List className="w-full flex flex-col justify-between">
      <div className="flex items-stretch">
        <div
          className={`w-full ${
            !displaySlider
              ? ""
              : "2xl:w-[70%] 2xl:flex 2xl:flex-col 2xl:justify-between"
          }`}
        >
          {stats.prediction && stats.prediction.predicted_value && (
            <StatsItem
              imgSrc="https://cdn-icons-png.flaticon.com/512/6475/6475938.png"
              title={`${translate("text1", currentLanguage)} ${
                display.apartmentType
              } ${translate("text2", currentLanguage)} ${
                display.neighbourhood
              } ${translate("text3", currentLanguage)} ${dateFormatter(
                display.date
              )}`}
              subtitle={
                <>
                  <span>
                    {translate("text4", currentLanguage)}{" "}
                    <b>{translate("text10", currentLanguage)}</b>{" "}
                    {translate("text11", currentLanguage)}
                  </span>{" "}
                  <b>
                    {currencyConverter(
                      stats.prediction.range.lower.toFixed(2),
                      currency
                    )}
                  </b>{" "}
                  {translate("text5", currentLanguage)}{" "}
                  <b>
                    {currencyConverter(
                      stats.prediction.range.upper.toFixed(2),
                      currency
                    )}
                  </b>
                </>
              }
            />
          )}
          {stats.avgTravelTime && stats.avgTravelTime !== 0 && (
            <StatsItem
              imgSrc="https://media.blogto.com/articles/2017830-express-bus.jpg?w=2048&cmd=resize_then_crop&height=1365&quality=70"
              title={`${translate("text6", currentLanguage)} ${
                display.campus
              } ${translate("text7", currentLanguage)}`}
              subtitle={<b>{translateDuration(stats.avgTravelTime, t)}</b>}
            />
          )}
          {stats.subwayStations && (
            <StatsItem
              imgSrc="https://cdn.juliekinnear.com/imagesall/2017/01/bessarion4.jpg"
              title={`${translate("text12", currentLanguage)} ${
                display.neighbourhood
              }`}
              subtitle={
                stats.subwayStations.items.length !== 0 ? (
                  <span>
                    {translate("text13", currentLanguage)}{" "}
                    <b>{stats.subwayStations.items.length}</b>{" "}
                    {translate("text14", currentLanguage)}
                  </span>
                ) : (
                  translate("error1", currentLanguage)
                )
              }
              subtitle2={
                stats.subwayStations.items.length !== 0 ? (
                  <span>
                    {translate("text15", currentLanguage)}{" "}
                    <b>
                      {Math.floor(stats.subwayStations.mean)}{" "}
                      {translate("text9", currentLanguage)}
                    </b>
                  </span>
                ) : null
              }
            />
          )}
          {stats.busStations && (
            <StatsItem
              imgSrc="https://images.squarespace-cdn.com/content/v1/5bcfc8c07a1fbd730b2ba933/1556320680219-7FOLTILR3TG9HFLXHEJI/IMG_6458.JPG"
              title={`${translate("text16", currentLanguage)} ${
                display.neighbourhood
              }`}
              subtitle={
                stats.busStations.items.length !== 0 ? (
                  <span>
                    {translate("text13", currentLanguage)}{" "}
                    <b>{stats.busStations.items.length}</b>{" "}
                    {translate("text18", currentLanguage)}
                  </span>
                ) : (
                  <span>{translate("error2", currentLanguage)}</span>
                )
              }
              subtitle2={
                stats.busStations.items.length !== 0 ? (
                  <span>
                    {translate("text19", currentLanguage)}{" "}
                    <b>
                      {Math.floor(stats.busStations.mean)}{" "}
                      {translate("text9", currentLanguage)}
                    </b>
                  </span>
                ) : null
              }
            />
          )}
          {stats.convenienceStores && (
            <StatsItem
              imgSrc="https://truffle-assets.tastemadecontent.net/cdn-cgi/image/width=1200/pxqrocxwsjcc_2lD5GHUJY0qwKMKYkUsEkY_7-11-hero.JPG"
              title={`${translate("text20", currentLanguage)} ${
                display.neighbourhood
              }`}
              subtitle={
                stats.convenienceStores.items.length !== 0 ? (
                  <span>
                    {translate("text13", currentLanguage)}{" "}
                    <b>{stats.convenienceStores.items.length}</b>{" "}
                    {translate("text22", currentLanguage)}
                  </span>
                ) : (
                  translate("error3", currentLanguage)
                )
              }
              subtitle2={
                stats.convenienceStores.items.length !== 0 ? (
                  <span>
                    {translate("text23", currentLanguage)}{" "}
                    <b>
                      {Math.floor(stats.convenienceStores.mean)}{" "}
                      {translate("text9", currentLanguage)}
                    </b>
                  </span>
                ) : null
              }
            />
          )}
        </div>
        {displaySlider && (
          <div className={`2xl:block hidden w-full`}>
            <ImageSlider images={display.images} />
          </div>
        )}
      </div>

      <StatsItem
        imgSrc={null}
        title={
          <div className=" text-center">
            {`${translate("text51", currentLanguage)} ${
              display.apartmentType
            } ${translate("text2", currentLanguage)} ${display.neighbourhood}`}
          </div>
        }
        element={
          <div
            className={`w-full flex ${
              displaySlider ? "justify-center 2xl:justify-end" : ""
            }`}
          >
            <RentLink
              apartments_dot_com={display.apartments_dot_com}
              condos_dot_ca={display.condos_dot_ca}
              bed={display.apartmentType}
              high={stats.prediction.range.upper}
            />
          </div>
        }
      />

      <StatsItem
        imgSrc={null}
        title={
          <div className=" text-center">
            {translate("header1", currentLanguage)}
          </div>
        }
        subtitle={<div className=" text-justify">{stats.description}</div>}
      />

      <StatsItem
        imgSrc={null}
        title={
          <div className=" text-center">
            {translate("header2", currentLanguage)}
          </div>
        }
        subtitle={
          <div className=" text-justify">
            {translate("text39", currentLanguage)}{" "}
            <b>{display.apartmentType}</b>{" "}
            {translate("text40", currentLanguage)}{" "}
            <b>{display.neighbourhood}</b>{" "}
            {translate("text41", currentLanguage)}{" "}
            <b>
              {currencyConverter(
                (stats.prediction.range.lower + 522.68 + 167 + 82.7 + 128.15) /
                  80,
                currency
              )}
            </b>{" "}
            {translate("text42", currentLanguage)}{" "}
            <b>
              {currencyConverter(
                (stats.prediction.range.upper + 522.68 + 167 + 82.7 + 128.15) /
                  80,
                currency
              )}
            </b>
            {". "}
            {translate("text43", currentLanguage)}{" "}
            <b>
              {currencyConverter(
                stats.prediction.range.lower + 903.83,
                currency
              )}
            </b>{" "}
            {translate("text42", currentLanguage)}{" "}
            <b>
              {currencyConverter(
                stats.prediction.range.upper + 903.83,
                currency
              )}
            </b>
            , {translate("text44", currentLanguage)} (
            <b>{currencyConverter(522.68, currency)}</b>),{" "}
            {translate("text45", currentLanguage)} (
            <b>{currencyConverter(167, currency)}</b>
            ), {translate("text46", currentLanguage)} (
            <b>{currencyConverter(86, currency)}</b>),{" "}
            {translate("text47", currentLanguage)} (
            <b>{currencyConverter(128.15, currency)}</b>).{" "}
            {translate("text48", currentLanguage)}
          </div>
        }
      />

      <StatsItem
        imgSrc={null}
        title={
          <div className=" text-center">{translate("text61", currentLanguage)}</div>
        }
        subtitle={
          <div className=" text-justify">
            {translate("text59", currentLanguage)}{" "}
            <b>{currencyConverter(16.55, currency)}</b>,{" "}
            {translate("text60", currentLanguage)}{" "}
            <b>
              <a
                href="https://senecaresidence.ca/"
                className=" text-blue-gray-500"
                target="_blank"
              >
                Seneca {translate("text62", currentLanguage)}
              </a>
            </b>
            .
          </div>
        }
      />
    </List>
  );
};

export default StatsList;
