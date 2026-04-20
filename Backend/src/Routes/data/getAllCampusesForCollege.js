const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  if (!req.body.collegeName)
    return res.status(400).json({ error: "collegeName is required" });
  const collegeName = req.body.collegeName;
  const allCampuses = new Set();
  console.log(collegeName);

  try {
    const { data } = await queryContainer("dataset");

    data.forEach((element) => {
      const colleges = element.college;
      colleges.forEach((college) => {
        if (college.name === collegeName) {
          const campuses = college.campus;
          campuses.forEach((campus) => {
            const campusName = campus.name.name;
            if (!allCampuses.has(campusName)) {
              allCampuses.add(campusName);
            }
          });
        }
      });
    });

    res.json(Array.from(allCampuses));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
