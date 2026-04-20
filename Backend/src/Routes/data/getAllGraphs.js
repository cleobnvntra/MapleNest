const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  if (!req.body.apikey || req.body.apikey !== "potatopatato") {
    return res.status(400).send("Invalid API key.");
  }
    
  try {
    const { data } = await queryContainer("dataset");

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
