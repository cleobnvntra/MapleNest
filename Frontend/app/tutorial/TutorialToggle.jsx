"use client";
import { driver } from "driver.js";
import { FaQuestion } from "react-icons/fa";
import useSpecificTranslation from "../translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "../translation/hooks/useCurrentLanguage";
import { useAtom } from "jotai";
import { tabAtom } from "../tabs/data/atoms";

const TutorialToggle = () => {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();
  const [tab] = useAtom(tabAtom);

  const stepsCollection = {
    graphs: {
      showProgress: true,
      steps: [
        {
          element: ".graphs_tab_header",
          popover: {
            title: translate("tutorial_header_3", currentLanguage),
            description: translate("tutorial9", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_graph",
          popover: {
            description: translate("tutorial15", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_password",
          popover: {
            description: translate("tutorial16", currentLanguage),
          },
        },
        {
          element: ".prediction_tab_header",
          popover: {
            title: translate("tutorial_header_1", currentLanguage),
            description: translate("tutorial1", currentLanguage),
          },
        },
        {
          element: ".compare_tab_header",
          popover: {
            title: translate("tutorial_header_2", currentLanguage),
            description: translate("tutorial8", currentLanguage),
          },
        },
        {
          popover: {
            title: translate("tutorial_header_4", currentLanguage),
            description: translate("tutorial10", currentLanguage),
          },
        },
      ],
    },
    compare: {
      showProgress: true,
      steps: [
        {
          element: ".compare_tab_header",
          popover: {
            title: translate("tutorial_header_2", currentLanguage),
            description: translate("tutorial8", currentLanguage),
          },
        },
        {
          element: ".college_select_compare",
          popover: {
            description: translate("tutorial2", currentLanguage),
          },
        },
        {
          element: ".campus_select_compare",
          popover: {
            description: translate("tutorial3", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_select_1",
          popover: {
            description: translate("tutorial11", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_select_2",
          popover: {
            description: translate("tutorial12", currentLanguage),
          },
        },
        {
          popover: {
            description: translate("tutorial5", currentLanguage),
          },
        },
        {
          element: ".apartment_select_1",
          popover: {
            description: translate("tutorial13", currentLanguage),
          },
        },
        {
          element: ".apartment_select_2",
          popover: {
            description: translate("tutorial14", currentLanguage),
          },
        },
        {
          element: ".date_compare",
          popover: {
            description: translate("tutorial7", currentLanguage),
          },
        },
        {
          element: ".prediction_tab_header",
          popover: {
            title: translate("tutorial_header_1", currentLanguage),
            description: translate("tutorial1", currentLanguage),
          },
        },
        {
          element: ".graphs_tab_header",
          popover: {
            title: translate("tutorial_header_3", currentLanguage),
            description: translate("tutorial9", currentLanguage),
          },
        },
        {
          popover: {
            title: translate("tutorial_header_4", currentLanguage),
            description: translate("tutorial10", currentLanguage),
          },
        },
      ],
    },
    predictions: {
      showProgress: true,
      steps: [
        {
          element: ".prediction_tab_header",
          popover: {
            title: translate("tutorial_header_1", currentLanguage),
            description: translate("tutorial1", currentLanguage),
          },
        },
        {
          element: ".college_select",
          popover: {
            description: translate("tutorial2", currentLanguage),
          },
        },
        {
          element: ".campus_select",
          popover: {
            description: translate("tutorial3", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_select",
          popover: {
            description: translate("tutorial4", currentLanguage),
          },
        },
        {
          element: ".neighbourhood_select",
          popover: {
            description: translate("tutorial5", currentLanguage),
          },
        },
        {
          element: ".apartment_select",
          popover: {
            description: translate("tutorial6", currentLanguage),
          },
        },
        {
          element: ".date_select",
          popover: {
            description: translate("tutorial7", currentLanguage),
          },
        },
        {
          element: ".compare_tab_header",
          popover: {
            title: translate("tutorial_header_2", currentLanguage),
            description: translate("tutorial8", currentLanguage),
          },
        },
        {
          element: ".graphs_tab_header",
          popover: {
            title: translate("tutorial_header_3", currentLanguage),
            description: translate("tutorial9", currentLanguage),
          },
        },
        {
          popover: {
            title: translate("tutorial_header_4", currentLanguage),
            description: translate("tutorial10", currentLanguage),
          },
        },
      ],
    },
  };

  console.log(tab);
  console.log(stepsCollection);
  console.log(stepsCollection[tab]);

  const driverObj = driver(stepsCollection[tab]);

  return (
    <button
      onClick={() => {
        driverObj.drive();
      }}
      className=" rounded-full bg-[#111827] text-white p-3"
    >
      <FaQuestion />
    </button>
  );
};

export default TutorialToggle;
