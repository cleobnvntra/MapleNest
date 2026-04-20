const fs = require("fs").promises;
const { readFileSync } = require("fs");
const path = require("path");

const DATABASE_PATH = path.join(__dirname, "./data.json");
const database = [];

function assignRandomInterestPoints(neighborhoods) {
  neighborhoods.forEach((neighborhood) => {
    neighborhood.interestPoints = 0; // Use camelCase consistently
    neighborhood.apartment_interest_points = {
      '1Bedroom': 2,
      '2Bedroom': 4,
      '3Bedroom': 2,
      'Studio': 2,
    };
  });

  let indices = new Set();
  // Ensure we select 10 unique random indices
  while (indices.size < 10) {
    let randomIndex = Math.floor(Math.random() * neighborhoods.length);
    indices.add(randomIndex);
  }

  return neighborhoods.map((neighborhood, index) => {
    if (indices.has(index)) {
      neighborhood.interestPoints = // Use camelCase consistently
        Math.floor(Math.random() * (500 - 20 + 1)) + 20;
      // Object.keys(neighborhood.apartment_interest_points).forEach((type) => {
      //   neighborhood.apartment_interest_points[type] =
      //     Math.floor(Math.random() * 481) + 20;
      // });
    }
    return neighborhood;
  });
}

async function setupDatabase() {
  console.log("Setting up the database...");
  try {
    const dbAsString = await fs.readFile(DATABASE_PATH, "utf8");
    console.log("Database file read successfully.");
    const dbAsJson = JSON.parse(dbAsString);
    const prepopulatedDB = assignRandomInterestPoints(dbAsJson);
    prepopulatedDB.forEach((element) => database.push(element));
    console.log("Database setup completed.");
  } catch (error) {
    console.error("Error setting up the database:", error);
    throw error; // Ensure any error is propagated up.
  }
}

async function saveDatabase() {
  try {
    const jsonAsText = JSON.stringify(database);
    await fs.writeFile(DATABASE_PATH, jsonAsText, "utf8");
    console.log("Write successful!");
  } catch (error) {
    console.error("Failed to save database:", error);
  }
}

module.exports = {
  database,
  setupDatabase,
  saveDatabase,
};
