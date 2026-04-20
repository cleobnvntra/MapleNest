const { queryContainer } = require("../../database/cosmos");
const GraphCreator = require("../../services/GraphCreator");

module.exports = async (req, res) => {
  if (!req.body.apikey || req.body.apikey !== "potatopatato") {
    return res.status(400).send("Invalid API key.");
  }
  const amount = req.body.amount || 5;
  const topNeighborhoods = await getTopNeighborhoods(amount);

  const imgBuffer = new GraphCreator({
    width: req.body.width,
    height: req.body.height,
    title: "Most popular neighborhoods",
  })
    .style({
      backgroundColor: [req.body.barsColor],
      borderColor: req.body.borderColor,
      textColor: req.body.textColor,
    })
    .drawHorizontalBarChart(
      topNeighborhoods,
      (elem) => elem.name,
      (elem) => elem.interestPoints
    );

  res.set("Content-Type", "image/png");
  res.send(imgBuffer);
};

async function getTopNeighborhoods(amount) {
  const { data } = await queryContainer("dataset");
  const neighborhoods = [...data];
  neighborhoods.sort((a, b) => b.interestPoints - a.interestPoints);
  const topNeighborhoods = neighborhoods.slice(0, amount);
  return topNeighborhoods;
}
