const fs = require("fs").promises;
const { readFileSync } = require("fs");
const path = require("path");
const { queryContainer, replaceFamilyItem } = require("../../database/cosmos");

const DATABASE_PATH = path.join(__dirname, "../../database/data.json");
const database = [];

module.exports = async (req, res) => {
  const { neighbourhood, apartment_type, date } = req.body;

  if (!neighbourhood) {
    return res.status(400).send("Bad Request: Missing neighbourhood.");
  }

  if (!apartment_type) {
    return res.status(400).send("Bad Request: Missing apartment type.");
  }

  if (!date) {
    return res.status(400).send("Bad Request: Missing date.");
  }

  console.log("Received:", req.body);

  try {
    const requestBody = {
      input_data: {
        columns: ["Neighbourhood", "Apartment Type", "Date"],
        index: [1],
        data: [[neighbourhood, apartment_type, date]],
      },
    };

    const key = `${neighborhood}${apartment_type}${date}`;

    // queries container based on its partition key
    let data = await queryContainer("cache");

    console.log("PRINTING CACHE");
    console.log(data);

    for (let i = 0; i < data.data.length; ++i) {
      if (data.data[i].key === key) {
        return res.status(200).send(data.data[i].value);
      }
    }

    // if the data is not in the cache, then we will query the model

    let rmse = 95.887;
    const z_score = 2.576;

    const requestHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ML_API_KEY}`,
    });

    const url = process.env.ML_API_ENDPOINT;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: requestHeaders,
    });

    if (!response.ok) {
      console.error("Response Headers:", Array.from(response.headers));
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const json = await response.json();
    console.log(json);

    json[0] += rmse;
    const confidence_interval_lower = json[0] - z_score * rmse;
    const confidence_interval_upper = json[0] + z_score * rmse;

    const object = {
      predicted_value: json[0],
      range: {
        lower: confidence_interval_lower,
        upper: confidence_interval_upper,
      },
    };

    const dbAsString = await fs.readFile(DATABASE_PATH, "utf8");
    console.log("Database file read successfully.");
    const dbAsJson = JSON.parse(dbAsString);

    const neighborhood = dbAsJson.find((n) => n.name === neighbourhood);

    for (let i = 0; i < dbAsJson.length; ++i) {
      if (dbAsJson[i].name === neighbourhood) {
        if (!dbAsJson[i].interestPoints) {
          dbAsJson[i].interestPoints = 0;
        }

        if (!dbAsJson[i].apartment_interest_points) {
          dbAsJson[i].apartment_interest_points = {
            "1 Bedroom": 0,
            "2 Bedroom": 0,
            "3 Bedroom": 0,
            Bachelor: 0,
          };
        }

        dbAsJson[i].interestPoints += 1;
        dbAsJson[i].apartment_interest_points[apartment_type]++;
        break;
      }
    }

    const jsonAsText = JSON.stringify(dbAsJson);
    await fs.writeFile(DATABASE_PATH, jsonAsText, "utf8");

    res.status(200).send(object);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred: " + error.message);
  }
};
