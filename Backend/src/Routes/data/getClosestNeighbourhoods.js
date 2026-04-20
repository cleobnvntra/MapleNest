const { queryContainer } = require("../../database/cosmos");

module.exports = async (req, res) => {
  const { collegeName, campusName } = req.body;

  try {
    const { data } = await queryContainer("dataset");

    const college = findCollege(collegeName, data);
    if (!college) {
      return res.status(404).json({ error: "College not found!" });
    }

    const campus = findCampus(campusName, college);
    if (!campus) {
      return res.status(404).json({ error: "Campus not found!" });
    }

    const topNeighbourhoods = getTopNeighbourhoods(
      data,
      collegeName,
      campusName
    );

    res.json(topNeighbourhoods);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

function findCollege(collegeName, data) {
  return data
    .flatMap(n => n.college)
    .find(c => c.name === collegeName);
}

function findCampus(campusName, college) {
  console.log('HERE');
  console.log(college);
  console.log(college.campus);
  if (!college || !Array.isArray(college.campus)) {
    console.error("Invalid college data:", college);
    return null;
  }

  return college.campus.find(c => c.name && c.name.name === campusName);
}

function parseTimeToMinutes(timeStr) {
  const timeParts = timeStr.split(" ");
  let timeInMinutes = 0;

  for (let i = 0; i < timeParts.length; i += 2) {
    const value = parseInt(timeParts[i], 10);
    const unit = timeParts[i + 1];

    if (unit.startsWith("min")) {
      timeInMinutes += value;
    } else if (unit.startsWith("hour")) {
      timeInMinutes += value * 60;
    }
  }

  return timeInMinutes;
}

function getTopNeighbourhoods(neighbourhoods, collegeName, campusName) {
  // Attach the original time to campus string for each neighborhood
  neighbourhoods = neighbourhoods.map((neighbourhood) => {
    let timeToCampusStr = null;

    neighbourhood.college.forEach((college) => {
      if (college.name === collegeName) {
        college.campus.forEach((campus) => {
          if (campus.name.name === campusName) {
            timeToCampusStr = campus.time_to_campus; // Keeping the original string
          }
        });
      }
    });

    return {
      image: neighbourhood.images[0],
      name: neighbourhood.name,
      time_to_campus: timeToCampusStr, // Using the original format
    };
  });

  // Filter out neighborhoods without time to campus and sort them by the time in minutes for comparison
  const topNeighbourhoods = neighbourhoods
    .filter(n => n.time_to_campus !== null)
    .sort((a, b) => parseTimeToMinutes(a.time_to_campus) - parseTimeToMinutes(b.time_to_campus))
    .slice(0, 10);

  return topNeighbourhoods;
}
