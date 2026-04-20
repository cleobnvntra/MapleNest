"use client";
import { useState } from "react";
import React from "react";
import { Select, Option, Button, Typography } from "@material-tailwind/react";
import fetchData from "../utils/fetchJSONData";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { getLongLanguage } from "../translation/components/LanguageChanger";
import useSpecificTranslation from "../translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "../translation/hooks/useCurrentLanguage";
import useDateFormatter from "../translation/hooks/useDateFormatter";
import formatShortWeekday from "../translation/utils/formatShortWeekday";
import LoadingStats from "../stats/components/LoadingStats";
import Stats from "../stats/components/Stats";
import getAllCampuses from "../helpers/getAllCampusesByCollege";
import getAllColleges from "../helpers/getAllColleges";
import getCollegeByName from "../helpers/getCollegeByName";
import getCampusByName from "../helpers/getCampusByName";
import sortDataByTimeToCampus from "../helpers/sortDataByTimeToCampus";
import getApartmentTypesForNeighbourhoodName from "../helpers/getApartmentTypesForNeighbourhoodName";
import LoadingWrapper from "../loading/components/LoadingWrapper";
import getAllNeighbourhoodsNames from "../helpers/getAllNeighbourhoodsNames";
import useTranslateDuration from "../translation/hooks/useTranslateDuration";

const Predictions = ({ data }) => {
  const currentLanguage = useCurrentLanguage();
  const dateFormatter = useDateFormatter();
  const translate = useSpecificTranslation();
  const translateDuration = useTranslateDuration();

  const today = new Date();
  const october2025 = new Date();
  october2025.setFullYear(2025);
  october2025.setMonth(9); // For October
  october2025.setDate(1); // Assuming you want the 1st of October

  const [selected, setSelected] = useState({
    college: "",
    campus: "",
    date: today,
    neighborhood: null,
    apartmentType: null,
  });

  const [isValid, setIsValid] = useState("invalid");

  const [stats, setStats] = useState({
    data: null,
    status: "chilling",
    display: {},
  });

  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [neighborhoodNames, setNeighbourhoodNames] = useState(
    getAllNeighbourhoodsNames(data),
  );

  const [englishApartmentTypes, setEnglishApartmentTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const campuses = getAllCampuses(data, selected.college);
  const colleges = getAllColleges(data);

  const toggleOpen = () => setOpen((cur) => !cur);

  const changeDateHandler = (e) => {
    setSelected({
      ...selected,
      date: e,
    });
  };

  const changeCollegeHandler = (e) => {
    setIsValid("valid");
    setSelected({
      ...selected,
      college: e,
    });
  };

  const changeNeighborhoodHandler = (e) => {
    const apartmentTypes = getApartmentTypesForNeighbourhoodName(data, e);
    const translatedApartmentTypes = apartmentTypes.map((t) =>
      translate(t, currentLanguage),
    );
    setIsValid("valid");

    // Need this later when sending request to backend,
    // cause we want to translate the selected apartment type back to english
    const engTypes = {};
    for (let i = 0; i < translatedApartmentTypes.length; ++i) {
      engTypes[translatedApartmentTypes[i]] = apartmentTypes[i];
    }
    setEnglishApartmentTypes(engTypes);

    setApartmentTypes(translatedApartmentTypes);

    setSelected((prevState) => ({
      ...prevState,
      neighborhood: e,
      apartmentType: translatedApartmentTypes[0] || null,
    }));
  };

  const changeCampusHandler = (e) => {
    const sortedData = sortDataByTimeToCampus(data, selected.college, e);
    setIsValid("valid");

    setNeighbourhoodNames(getAllNeighbourhoodsNames(sortedData));
    const matchedNeighborhood = sortedData[0];

    setSelected((prevSelected) => ({
      ...prevSelected,
      campus: e,
    }));

    changeNeighborhoodHandler(matchedNeighborhood.name);
  };

  const changeApartmentTypeHandler = (e) => {
    setIsValid("valid");
    setSelected({
      ...selected,
      apartmentType: e,
    });
  };

  const seePredictionsHandler = async () => {
    if (!selected.college) {
      setIsValid("invalid college");
      return;
    }
    if (!selected.campus) {
      setIsValid("invalid campus");
      return;
    }
    if (!selected.neighborhood) {
      setIsValid("invalid neighbourhood");
      return;
    }
    if (!selected.apartmentType) {
      setIsValid("invalid apartmentType");
      return;
    }
    setStats({
      ...stats,
      status: "sent",
    });

    const year = selected.date.getFullYear() + 1;
    // Get the month and add 1 because getMonth() returns 0-11. Also, add a leading zero if necessary.
    const month = ("0" + (selected.date.getMonth() + 1)).slice(-2);
    // Get the day and add a leading zero if necessary.
    const day = ("0" + selected.date.getDate()).slice(-2);

    const formattedDate = `${month}-${day}-${year}`;

    const n = data.find((n) => n.name === selected.neighborhood);
    const images = n.images;
    const apartments_dot_com = n.apartments_dot_com;
    const condos_dot_ca = n.condos_dot_ca;

    const engApartmentType = englishApartmentTypes[selected.apartmentType];

    try {
      const json = await fetchData("/predict/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collegeName: selected.college,
          neighbourhood: selected.neighborhood,
          campusName: selected.campus,
          date: formattedDate,
          apartmentType: engApartmentType,
          lang: currentLanguage,
          prompt: `In this language ${getLongLanguage(
            currentLanguage,
          )}, Can you please do the following, generate a small paragraph discussing these things about this neighbourhood: 1- Safety of neighbourhood for international students -2- How appropriate is it for international students -3- Does it provide easy access to all essentials for international students -4- If applicable mention the majority of the nationalities in this neighbourhood`,
        }),
      });

      setStats((s) => ({
        data: json,
        status: "received",
        displayData: {
          images,
          apartmentType: translate(selected.apartmentType, "en"),
          neighbourhood: selected.neighborhood,
          campus: selected.campus,
          date: selected.date,
          apartments_dot_com,
          condos_dot_ca,
        },
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  console.log(getLongLanguage(currentLanguage));

  return (
    <div className=" flex flex-col gap-4 h-full mb-24">
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <div className=" flex-1">
          <Select
            className="college_select"
            variant="outlined"
            value={selected.college}
            onChange={changeCollegeHandler}
            label={translate("select3", currentLanguage)}
            error={isValid === "invalid college"}
          >
            {colleges.map((college, index) => (
              <Option key={college} value={college}>
                {college}
              </Option>
            ))}
          </Select>
        </div>

        <div className=" flex-1">
          <Select
            key={selected.college || "campus"} // Change key based on selected college
            variant="outlined"
            disabled={!selected.college}
            value={selected.campus}
            onChange={changeCampusHandler}
            className="campus_select"
            label={translate("select4", currentLanguage)}
            error={isValid === "invalid campus"}
          >
            {campuses.map((campus, index) => (
              <Option key={campus.campusName} value={campus.campusName}>
                {campus.campusName}
              </Option>
            ))}
          </Select>
        </div>

        <div className=" flex-auto">
          <Select
            disabled={!selected.campus || !selected.college}
            variant="outlined"
            key={selected.college + selected.campus} // Ensuring reactivity to changes in college or campus
            size="md"
            value={selected.neighborhood}
            className="neighbourhood_select"
            onChange={changeNeighborhoodHandler}
            label={translate("select1", currentLanguage)}
            error={isValid === "invalid neighbourhood"}
          >
            {neighborhoodNames.map((neighbourhoodName, index) => {
              const neighbourhood = data.find(
                (n) => n.name === neighbourhoodName,
              );
              const college = getCollegeByName(neighbourhood, selected.college);
              const campus = getCampusByName(college, selected.campus);
              const time_to_campus = campus?.time_to_campus;

              return (
                <Option key={neighbourhoodName} value={neighbourhoodName}>
                  {neighbourhoodName} (
                  <b>{translateDuration(time_to_campus)}</b>{" "}
                  {translate("text63", currentLanguage)}{" "}
                  <b>{translate("text64", currentLanguage)}</b>)
                </Option>
              );
            })}
          </Select>
        </div>

        <div className=" flex-1">
          <Select
            disabled={!selected.neighborhood}
            key={selected.neighborhood || "apartmentType"}
            variant="outlined"
            className="apartment_select"
            onChange={changeApartmentTypeHandler}
            value={selected.apartmentType}
            label={translate("select2", currentLanguage)}
            error={isValid === "invalid apartmentType"}
          >
            {apartmentTypes.map((type, index) => {
              return (
                <Option key={index} value={type}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>

        <div style={{ position: "relative" }} className="shrink-0 flex-1">
          <Button
            onClick={toggleOpen}
            variant="outlined"
            className={`date_select w-full flex whitespace-nowrap h-10 justify-center gap-2 items-center border border-[#B0BEC5] text-[#6E5A7C]`}
          >
            <FaCalendarAlt />
            {dateFormatter(selected.date)}
          </Button>
          {open && (
            <div className="absolute z-40 mt-1 left-0 right-0 bg-transparent sm:w-full transform -translate-x-0 shrink-0">
              <Calendar
                onChange={changeDateHandler}
                value={selected.date}
                locale={currentLanguage}
                formatShortWeekday={(locale, date) =>
                  formatShortWeekday(currentLanguage, date)
                }
                className="customCalendar"
                minDate={new Date()}
                maxDate={new Date(2028, 9, 10)}
              />
            </div>
          )}
        </div>
      </div>
      <div className=" flex justify-between items-center gap-4">
        <Button
          className="w-full text-sm md:text-lg"
          onClick={seePredictionsHandler}
          disabled={
            !selected.apartmentType ||
            !selected.campus ||
            !selected.college ||
            !selected.date ||
            !selected.neighborhood
          }
        >
          {translate("button1", currentLanguage)}
        </Button>
      </div>
      <div id="predictions-box">
        <LoadingWrapper
          loadingComponent={<LoadingStats />}
          finishedComponent={
            <Stats stats={stats.data} displayData={stats.displayData} />
          }
          status={stats.status}
        />
      </div>
    </div>
  );
};

export default React.memo(Predictions);
