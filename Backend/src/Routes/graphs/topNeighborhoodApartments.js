const { queryContainer } = require("../../database/cosmos");
const GraphCreator = require("../../services/GraphCreator");

module.exports = async (req, res) => {
  if (!req.body.apikey || req.body.apikey !== "potatopatato") {
    return res.status(400).send("Invalid API key.");
  }
  const topApartmentTypes = await getTopApartmentTypes(req.body.neighborhood);
  console.log(topApartmentTypes);

  if (!topApartmentTypes) {
    return res.status(400).send("Neighborhood not found!");
  }

  const imgBuffer = new GraphCreator({
    width: req.body.width,
    height: req.body.height,
    title: `Top apartment types for ${req.body.neighborhood}`,
  })
    .style({
      backgroundColor: req.body.partsColors,
      borderColor: req.body.borderColor,
      textColor: req.body.textColor,
    })
    .drawPyChart(
      topApartmentTypes,
      (elem) => elem.apartmentType,
      (elem) => elem.interestPoints
    );

  res.set("Content-Type", "image/png");
  res.send(imgBuffer);
};

async function getTopApartmentTypes(neighborhoodName) {
  const { data } = await queryContainer("dataset");
  const neighborhood = data.find((n) => n.name === neighborhoodName);
  if (!neighborhood) {
    return null;
  }

  const apartmentTypesForDisplay = [];

  for (const apartmentType in neighborhood["Apartment Type Interest Points"]) {
    console.log(`ADDING ${apartmentType}`);
    apartmentTypesForDisplay.push({
      apartmentType,
      interestPoints:
        neighborhood["Apartment Type Interest Points"][apartmentType],
    });
  }

  apartmentTypesForDisplay.sort((a, b) => b.interestPoints - a.interestPoints);
  return apartmentTypesForDisplay;
}
