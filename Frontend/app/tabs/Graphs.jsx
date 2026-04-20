"use client";
import React from "react";
import {
  Select,
  Option,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import fetchIMGData from "../utils/fetchIMGData";
import useSpecificTranslation from "../translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "../translation/hooks/useCurrentLanguage";
import getApartmentTypesForNeighbourhoodName from "../helpers/getApartmentTypesForNeighbourhoodName";
import LoadingWrapper from "../loading/components/LoadingWrapper";
import { LoadingGraph } from "../graphs/LoadingGraph";
import Graph from "../graphs/Graph";

const Graphs = ({ data }) => {
  const currentLanguage = useCurrentLanguage();
  const translate = useSpecificTranslation();

  const [selected, setSelected] = useState({
    neighborhood: "",
    apartmentType: "",
  });

  const [graph, setGraph] = useState({
    data: null,
    status: "chilling",
    graphType: null,
  });

  const [isValid, setIsValid] = useState("invalid");

  const [apartmentTypes, setApartmentTypes] = useState([]);
  const [apiKey, setAPIKey] = useState("");
  const [badKey, setBadKey] = useState(false);

  const neighborhoods = data.map((item) => item.name);

  const neighbourhoodChangedHandler = (e) => {
    setIsValid("valid");
    const apartmentTypes = getApartmentTypesForNeighbourhoodName(
      data,
      e
    ).sort();

    const translatedApartmentTypes = apartmentTypes.map((t) =>
      translate(t, currentLanguage)
    );

    setApartmentTypes(translatedApartmentTypes);
    setSelected({
      neighborhood: e,
      apartmentType: translatedApartmentTypes[0],
    });
  };

  const apartmentTypeChangedHandler = (e) => {
    setSelected({
      ...selected,
      apartmentType: e,
    });
  };

  const getApartmentsInNeighbourhoodGraph = async () => {
    try {
      console.log(apiKey);
      setGraph({
        data: null,
        status: "sent",
        graphType: null,
      });

      if (apiKey.length === 0) {
        setIsValid("invalid password");
        setBadKey(true);
        alert("Please enter an API key");
        return;
      }
      if (!selected.neighborhood) {
        setBadKey(true);
        setIsValid("invalid neighborhood");
        return;
      }
      setBadKey(false);

      const response = await fetchIMGData("/graphs/popular/apartmentTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apikey: apiKey,
          neighborhood: selected.neighborhood,
          partsColors: ["#FF851B", "#0074D9", "#2ECC40", "#FFDC00", "#B10DC9"],
          textColor: "black",
          borderColor: "red",
          width: 1680,
          height: 1050,
        }),
      });

      if (response.ok) {
        const imgBlob = await response.blob(); // Process as a blob
        setGraph({
          data: URL.createObjectURL(imgBlob),
          status: "received",
          graphType: "apartmentDetails",
        });
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      setIsValid("invalid password");
      setBadKey(true);
      console.log(error);
    }
  };

  const getTopDemandedNeighbourhoodsGraph = async () => {
    setGraph({
      data: null,
      status: "sent",
      graphType: null,
    });
    if (apiKey.length === 0) {
      setIsValid("invalid password");
      setBadKey(true);
      alert("Please enter an API key");
      return;
    }
    setBadKey(false);
    const translatedApartmentType = translate(
      selected.apartmentType,
      currentLanguage
    );

    try {
      const response = await fetchIMGData("/graphs/popular/neighborhoods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apikey: apiKey,
          neighborhood: translatedApartmentType,
          barsColor: "#2980B9",
          textColor: "#FF0000",
          amount: 10,
          width: 1680,
          height: 1050,
        }),
      });

      if (response.ok) {
        const imgBlob = await response.blob(); // Process as a blob
        setGraph({
          data: URL.createObjectURL(imgBlob),
          status: "received",
          graphType: "neighbourhoodDetails",
        });
      } else {
        console.error("Network response was not ok.");
      }
    } catch (error) {
      setIsValid("invalid password");
      setBadKey(true);
      console.log(error);
    }
  };

  const handleApiKey = (e) => {
    setIsValid("valid");
    setAPIKey(e.target.value);
  }

  return (
    <div className=" flex flex-col gap-4 h-full ">

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="flex-grow">
          <Select
            variant="outlined"
            value={selected.neighborhood}
            onChange={neighbourhoodChangedHandler}
            label={translate("text29", currentLanguage)}
            error={isValid === "invalid neighborhood"}
            className="neighbourhood_graph"
          >
            {neighborhoods.map((neighborhood, index) => (
              <Option key={index} value={neighborhood}>
                {neighborhood}
              </Option>
            ))}
          </Select>
        </div>

        <div className="flex-grow">
          <Input
            type="password"
            label={translate("text31", currentLanguage)}
            onChange={handleApiKey}
            error={isValid === "invalid password"}
            className="neighbourhood_password"
          />
          <>
            <Typography
              variant="small"
              color="gray"
              className="mt-2 flex items-center gap-1 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-px h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              {translate("text32", currentLanguage)}
            </Typography>
          </>
        </div>

      </div>



      <div>
        <Button
          className="w-full text-sm md:text-lg"
          onClick={getTopDemandedNeighbourhoodsGraph}
          disabled={isValid === "invalid"}
        >
          {translate("button3", currentLanguage)}
        </Button>
      </div>
      <div>
        <Button
          className="w-full text-sm md:text-lg"
          onClick={getApartmentsInNeighbourhoodGraph}
          disabled={isValid === "invalid"}
        >
          {translate("button4", currentLanguage)}
        </Button>
      </div>

      <div className="mt-6 lg:w-[800px] lg:h-[600px] lg:mx-auto" id="graph-box">
        {badKey == false ? (
          <LoadingWrapper
            status={graph.status}
            loadingComponent={<LoadingGraph />}
            finishedComponent={<Graph graphSrc={graph.data} graphType={graph.graphType} apiKey={apiKey} selectedNeighbourhood={selected.neighborhood} />}
          />
        ) : (
          <Typography variant="h3" className=" text-center mb-4 ">
            {translate("text33", currentLanguage)}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default React.memo(Graphs);
