const { database } = require("../../database");

module.exports = (req, res) => {
  const allApartmentTypes = new Set();
  database.forEach((element) => {
    if (element.apartment_interest_points) {
      for (const apartmentType in element.apartment_interest_points) {
        console.log(apartmentType);
        allApartmentTypes.add(apartmentType);
      }
    }
  });

  console.log(allApartmentTypes);
  res.json(Array.from(allApartmentTypes));
};
