const {
  updateNeighborhoodInterestPoints,
  updateNeighborhoodApartmentInterestPoints,
} = require("../database/cosmos");

module.exports = (interestPointsCB, apartmentTypePointsCB) => {
  return async (req, res, next) => {
    try {
      const neighborhoodName = interestPointsCB(req);
      await updateNeighborhoodInterestPoints(neighborhoodName);

      if (apartmentTypePointsCB) {
        const apartmentType = apartmentTypePointsCB(req);
        await updateNeighborhoodApartmentInterestPoints(
          neighborhoodName,
          apartmentType
        );
      }

      next();
    } catch (error) {
      console.log("NEIGHBORHOOD NOT FOUND!");
      res.status(404).send("Neighborhood not found!");
      return;
    }
  };
};
