"use client";
import { useState } from "react";
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
import getAllCampuses from "../helpers/getAllCampusesByCollege";
import getAllColleges from "../helpers/getAllColleges";
import getCollegeByName from "../helpers/getCollegeByName";
import getCampusByName from "../helpers/getCampusByName";
import sortDataByTimeToCampus from "../helpers/sortDataByTimeToCampus";
import getApartmentTypesForNeighbourhoodName from "../helpers/getApartmentTypesForNeighbourhoodName";
import LoadingWrapper from "../loading/components/LoadingWrapper";
import getAllNeighbourhoodsNames from "../helpers/getAllNeighbourhoodsNames";
import LoadingCompare from "../compare/components/LoadingCompare";
import PredictionStepper from "../compare/components/PredictionStepper";
import getAllNeighbourhoodNames from "../helpers/getAllNeighbourhoodsNames";
import React from "react";
import useTranslateDuration from "../translation/hooks/useTranslateDuration";

const Compare = ({ data }) => {
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
    neighborhood1: {
      name: null,
      apartmentType: null,
    },
    neighborhood2: {
      name: null,
      apartmentType: null,
    },
  });

  const [isValid, setIsValid] = useState("invalid");
  const [isApt1Valid, setIsApt1Valid] = useState("invalid");
  const [isApt2Valid, setIsApt2Valid] = useState("invalid");

  const [stats, setStats] = useState({
    data: null,
    status: "chilling",
    display: {},
  });

  const [apartmentTypes, setApartmentTypes] = useState({
    neighborhood1: [],
    neighborhood2: [],
  });

  const [neighborhoodNames, setNeighbourhoodNames] = useState({
    neighborhood1: getAllNeighbourhoodsNames(data),
    neighborhood2: getAllNeighbourhoodsNames(data),
  });

  const [englishApartmentTypes, setEnglishApartmentTypes] = useState({
    neighborhood1: {},
    neighborhood2: {},
  });
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

  const changeNeighborhoodHandler = (e, neighborhoodIndex) => {
    const types = getApartmentTypesForNeighbourhoodName(data, e);
    setIsValid("valid");

    const translatedApartmentTypes = types.map((t) =>
      translate(t, currentLanguage)
    );

    // Need this later when sending request to backend,
    // cause we want to translate the selected apartment type back to english
    const engTypes = {
      neighborhood1: {},
      neighborhood2: {},
    };

    for (let i = 0; i < translatedApartmentTypes.length; ++i) {
      engTypes[neighborhoodIndex][translatedApartmentTypes[i]] = types[i];
    }
    setEnglishApartmentTypes((prevTypes) => ({
      ...prevTypes,
      [neighborhoodIndex]: engTypes[neighborhoodIndex],
    }));

    setApartmentTypes((prev) => ({
      ...prev,
      [neighborhoodIndex]: translatedApartmentTypes,
    }));

    setSelected((prevState) => ({
      ...prevState,
      [neighborhoodIndex]: {
        name: e,
        apartmentTypes: translatedApartmentTypes[0] || null,
      },
    }));
  };

  const changeCampusHandler = (e) => {
    const sortedData = sortDataByTimeToCampus(data, selected.college, e);
    setIsValid("valid");

    setNeighbourhoodNames({
      neighborhood1: getAllNeighbourhoodsNames(sortedData),
      neighborhood2: getAllNeighbourhoodNames(sortedData),
    });

    const matchedNeighborhood = sortedData[0];

    setSelected((prevSelected) => ({
      ...prevSelected,
      campus: e,
    }));

    changeNeighborhoodHandler(matchedNeighborhood.name, "neighborhood1");
    changeNeighborhoodHandler(matchedNeighborhood.name, "neighborhood2");
  };

  const changeApartmentTypeHandler = (e, neighbourhoodIndex) => {
    if (neighbourhoodIndex === "neighborhood1") {
      setIsApt1Valid("valid");
    }
    if (neighbourhoodIndex === "neighborhood2") {
      setIsApt2Valid("valid");
    }
    setSelected({
      ...selected,
      [neighbourhoodIndex]: {
        ...selected[neighbourhoodIndex],
        apartmentType: e,
      },
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
    if (
      !selected.neighborhood1.apartmentType &&
      !selected.neighborhood2.apartmentType
    ) {
      setIsApt1Valid("invalid aptTypes");
      setIsApt2Valid("invalid aptTypes");
      return;
    }
    if (!selected.neighborhood1.name) {
      setIsValid("invalid neighbourhood1name");
      return;
    }
    if (!selected.neighborhood1.apartmentType) {
      setIsApt1Valid("invalid aptTypes");
      return;
    }
    if (!selected.neighborhood2.name) {
      setIsValid("invalid neighbourhood2name");
      return;
    }
    if (!selected.neighborhood2.apartmentType) {
      setIsApt2Valid("invalid aptTypes");
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

    const n1 = data.find((n) => n.name === selected.neighborhood1.name);
    const n2 = data.find((n) => n.name === selected.neighborhood2.name);

    const images1 = n1.images;
    const images2 = n2.images;

    const apartments_dot_com1 = n1.apartments_dot_com;
    const condos_dot_ca1 = n1.condos_dot_ca;

    const apartments_dot_com2 = n2.apartments_dot_com;
    const condos_dot_ca2 = n2.condos_dot_ca;

    const engApartmentType1 =
      englishApartmentTypes["neighborhood1"][
        selected.neighborhood1.apartmentType
      ];
    const engApartmentType2 =
      englishApartmentTypes["neighborhood2"][
        selected.neighborhood2.apartmentType
      ];

    try {
      const json = await fetchData("/predict/stats/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          neighbourhood1: {
            name: selected.neighborhood1.name,
            apartmentType: engApartmentType1,
          },
          neighbourhood2: {
            name: selected.neighborhood2.name,
            apartmentType: engApartmentType2,
          },
          collegeName: selected.college,
          campusName: selected.campus,
          date: formattedDate,
          lang: currentLanguage,
          prompt: `In this language ${getLongLanguage(
            currentLanguage
          )}, Can you please do the following, generate a small paragraph discussing these things about this neighbourhood: 1- Safety of neighbourhood for international students -2- How appropriate is it for international students -3- Does it provide easy access to all essentials for international students -4- If applicable mention the majority of the nationalities in this neighbourhood`,
        }),
      });

      setStats((s) => ({
        data: json,
        status: "received",
        displayData: {
          images1,
          images2,
          apartmentType1: translate(selected.neighborhood1.apartmentType, "en"),
          apartmentType2: translate(selected.neighborhood2.apartmentType, "en"),
          apartments_dot_com1,
          apartments_dot_com2,
          condos_dot_ca1,
          condos_dot_ca2,
          neighbourhood1: selected.neighborhood1.name,
          neighbourhood2: selected.neighborhood2.name,
          campus: selected.campus,
          date: selected.date,
        },
      }));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className=" flex flex-col gap-4 h-full mb-24">
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <div className=" flex-1">
          <Select
            variant="outlined"
            value={selected.college}
            onChange={changeCollegeHandler}
            label={translate("select3", currentLanguage)}
            error={isValid === "invalid college"}
            className="college_select_compare"
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
            label={translate("select4", currentLanguage)}
            error={isValid === "invalid campus"}
            className="campus_select_compare"
          >
            {campuses.map((campus, index) => (
              <Option key={campus.campusName} value={campus.campusName}>
                {campus.campusName}
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ position: "relative" }} className=" flex-1">
          <Button
            onClick={toggleOpen}
            variant="outlined"
            className={`w-full date_compare flex whitespace-nowrap h-10 justify-center gap-2 items-center border border-[#B0BEC5] text-[#6E5A7C]`}
          >
            <FaCalendarAlt />
            {dateFormatter(selected.date)}
          </Button>
          {open && (
            <div
              style={{
                position: "absolute",
                zIndex: 1000,
                marginTop: "4px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "transparent",
              }}
            >
              <Calendar
                onChange={changeDateHandler}
                value={selected.date}
                locale={currentLanguage}
                formatShortWeekday={(locale, date) =>
                  formatShortWeekday(currentLanguage, date)
                }
                className="customCalendar"
                minDate={new Date()}
                maxDate={new Date(2025, 9, 10)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <div className=" flex-auto">
          <Select
            disabled={!selected.campus || !selected.college}
            variant="outlined"
            key={selected.college + selected.campus} // Ensuring reactivity to changes in college or campus
            size="md"
            value={selected.neighborhood1.name}
            onChange={(e) => changeNeighborhoodHandler(e, "neighborhood1")}
            label={`${translate("select1", currentLanguage)} 1`}
            error={isValid === "invalid neighbourhood1name"}
            className="neighbourhood_select_1"
          >
            {neighborhoodNames.neighborhood1.map((neighbourhoodName, index) => {
              const neighbourhood = data.find(
                (n) => n.name === neighbourhoodName
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

        <div className=" flex-auto">
          <Select
            disabled={!selected.campus || !selected.college}
            variant="outlined"
            key={selected.college + selected.campus} // Ensuring reactivity to changes in college or campus
            size="md"
            className="neighbourhood_select_2"
            value={selected.neighborhood2.name}
            onChange={(e) => changeNeighborhoodHandler(e, "neighborhood2")}
            label={`${translate("select1", currentLanguage)} 2`}
            error={isValid === "invalid neighbourhood2name"}
          >
            {neighborhoodNames.neighborhood2.map((neighbourhoodName, index) => {
              const neighbourhood = data.find(
                (n) => n.name === neighbourhoodName
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
      </div>
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <div className=" flex-1">
          <Select
            disabled={!selected.neighborhood1.name}
            key={selected.neighborhood1.name || "apartmentType"}
            variant="outlined"
            className="apartment_select_1"
            onChange={(e) => changeApartmentTypeHandler(e, "neighborhood1")}
            value={selected.neighborhood1.apartmentType}
            label={`${translate("select2", currentLanguage)} 1`}
            error={isApt1Valid === "invalid aptTypes"}
          >
            {apartmentTypes.neighborhood1.map((type, index) => {
              return (
                <Option key={index} value={type}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>

        <div className=" flex-1">
          <Select
            disabled={!selected.neighborhood2.name}
            key={selected.neighborhood2.name || "apartmentType"}
            variant="outlined"
            className="apartment_select_2"
            onChange={(e) => changeApartmentTypeHandler(e, "neighborhood2")}
            value={selected.neighborhood2.apartmentType}
            label={`${translate("select2", currentLanguage)} 2`}
            error={isApt2Valid === "invalid aptTypes"}
          >
            {apartmentTypes.neighborhood2.map((type, index) => {
              return (
                <Option key={index} value={type}>
                  {type}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      <div className=" flex justify-between items-center gap-4">
        <Button
          className="w-full text-sm md:text-lg"
          onClick={seePredictionsHandler}
          disabled={isValid === "invalid"}
        >
          {translate("text57", currentLanguage)}
        </Button>
      </div>
      <div id="compare-box">
        <LoadingWrapper
          loadingComponent={<LoadingCompare />}
          finishedComponent={<PredictionStepper stats={stats} />}
          status={stats.status}
        />
      </div>
    </div>
  );
};

export default React.memo(Compare);
