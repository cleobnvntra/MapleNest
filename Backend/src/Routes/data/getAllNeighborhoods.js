const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  const allNeighborhoods = new Set();

  try {
    const { data } = await queryContainer("dataset");

    data.forEach((element) => {
      allNeighborhoods.add({
        Neighbourhood: element.name,
        images: element.images,
      });
    });

    res.json(Array.from(allNeighborhoods));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
