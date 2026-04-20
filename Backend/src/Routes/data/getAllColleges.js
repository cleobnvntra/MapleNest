const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  const allColleges = new Set();

  try {
    const { data } = await queryContainer("dataset");

    data.forEach((element) => {
      const colleges = element.college;
      colleges.forEach((college) => {
        allColleges.add(college.name);
      });
    });

    res.json(Array.from(allColleges));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
