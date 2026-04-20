"use client";
import Graphs from "./tabs/Graphs";
import Predictions from "./tabs/Predictions";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import useFetcher from "./useFetcher";
import { Spinner } from "@material-tailwind/react";
import { useState } from "react";
import Compare from "./tabs/Compare";
import useSpecificTranslation from "./translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "./translation/hooks/useCurrentLanguage";
import { useAtom } from "jotai";
import { tabAtom } from "./tabs/data/atoms";

const MainPageContainer = () => {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();

  const tab1 = translate("tab1", currentLanguage);
  const tab2 = translate("tab2", currentLanguage);
  const tab3 = translate("text56", currentLanguage);

  const { data } = useFetcher("/data/all");

  const tabs = [
    {
      label: tab1,
      value: "predictions",
      desc: <Predictions data={data} />,
    },
    {
      label: tab3,
      value: "compare",
      desc: <Compare data={data} />,
    },
    {
      label: tab2,
      value: "graphs",
      desc: <Graphs data={data} />,
    },
  ];

  const [activeTab, setActiveTab] = useAtom(tabAtom);

  const hasFinishedLoading = !!data;

  return (
    <Tabs value={activeTab} className="mt-16 !overflow-visible tabs">
      <TabsHeader indicatorProps={{ className: "bg-gray-900" }}>
        {tabs.map(({ label, value }, index) => (
          <Tab
            key={value}
            value={value}
            onClick={() => {
              setActiveTab(value);
              const graphBox = document.getElementById("graph-box");
              const predictionBox = document.getElementById("predictions-box");
              const compareBox = document.getElementById("compare-box");
              if (value === "predictions") {
                if (!graphBox.classList.contains("graph-box")) {
                  graphBox.classList.add("graph-box");
                }
                if (!compareBox.classList.contains("graph-box")) {
                  compareBox.classList.add("graph-box");
                }
                predictionBox.classList.remove("graph-box");
              } else if (value === "compare") {
                if (!predictionBox.classList.contains("graph-box")) {
                  predictionBox.classList.add("graph-box");
                }
                if (!graphBox.classList.contains("graph-box")) {
                  graphBox.classList.add("graph-box");
                }
                compareBox.classList.remove("graph-box");
              } else if (value === "graphs") {
                if (!predictionBox.classList.contains("graph-box")) {
                  predictionBox.classList.add("graph-box");
                }
                if (!compareBox.classList.contains("graph-box")) {
                  compareBox.classList.add("graph-box");
                }
                graphBox.classList.remove("graph-box");
              }
            }}
            className={`${index === 0 ? "prediction_tab_header " : ""}${
              index === 1 ? "compare_tab_header " : ""
            }${index === 2 ? "graphs_tab_header " : ""}${
              activeTab === value
                ? "transition-all delay-150 text-gray-50 font-bold text-sm md:text-lg down"
                : "transition-all delay-150 text-sm md:text-lg down"
            }`}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      {hasFinishedLoading ? (
        <TabsBody className="!overflow-visible">
          {tabs.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      ) : (
        <Spinner className="h-12 w-12 mx-auto mt-4" />
      )}
    </Tabs>
  );
};

export default MainPageContainer;
