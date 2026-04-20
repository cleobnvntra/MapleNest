import React from "react";
import Animate from "../loading/components/Animate";
import { Button } from "@material-tailwind/react";
import downloadNeighbourhoodDetailsPDF from "../helpers/neighbourhoodDetailsPDF";
import downloadApartmentDetailsPDF from "../helpers/apartmentDetailsPDF";
import useSpecificTranslation from "../translation/hooks/useSpecificTranslation";
import useCurrentLanguage from "../translation/hooks/useCurrentLanguage";

const Graph = ({ graphSrc, graphType, apiKey, selectedNeighbourhood }) => {
  const translate = useSpecificTranslation();
  const currentLanguage = useCurrentLanguage();

  return (
    <Animate>
      <div className="" id="pdf-content">
        <a href={graphSrc} target="_blank">
          <img
            src={graphSrc}
            className="object-center object-contain w-full h-full "
            alt="Dynamic Blob Image"
          />
        </a>
      </div>
      <div className="py-5 flex justify-center mt-4">
        {graphType === "neighbourhoodDetails" ?
          <Button onClick={() => { downloadNeighbourhoodDetailsPDF(apiKey, graphSrc) }}>{translate('button7', currentLanguage)}</Button> :
          <Button onClick={() => { downloadApartmentDetailsPDF(apiKey, selectedNeighbourhood, graphSrc) }}>{translate('button7', currentLanguage)}</Button>
        }
      </div>
    </Animate>
  );
};

export default Graph;
