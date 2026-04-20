const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
    
  try {
    const { data } = await queryContainer("dataset");

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
