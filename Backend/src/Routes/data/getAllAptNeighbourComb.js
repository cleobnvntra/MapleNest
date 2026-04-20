const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  const AptNeighborComb = new Set();
  try {
    const { data } = await queryContainer("dataset");

    data.forEach((neighborhood) => {
      let comb = {
        Neighbourhood: neighborhood.name,
        colleges: [],
        image: neighborhood.images[0],
        "Apartment Type": neighborhood["Apartment Type"], // Assuming "Apartment Type" is part of each neighborhood
      };

      neighborhood.college.forEach((college) => {
        let collegeData = {
          name: college.name,
          campuses: []
        };

        college.campus.forEach((campus) => {
          collegeData.campuses.push({
            name: campus.name.name,
            time_to_campus: campus.time_to_campus
          });
        });

        comb.colleges.push(collegeData);
      });

      AptNeighborComb.add(comb);
    });

    console.log(AptNeighborComb);
    res.json(Array.from(AptNeighborComb));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
