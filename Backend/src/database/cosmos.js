//@ts-check
require("dotenv").config();
const CosmosClient = require("@azure/cosmos").CosmosClient;

const options = {
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
  userAgentSuffix: "CosmosDBJavascriptQuickstart",
};

const client = new CosmosClient(options);

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: process.env.COSMOS_DB,
  });
  console.log(`Created database:\n${database.id}\n`);
}

async function addDefaultInterestPoints() {
  console.log(`Updating all neighborhoods with default values for interestPoints and apartmentTypes.`);

  // Retrieve the entire document
  const { resource: document } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .read();

  // Iterate through each neighborhood to update interestPoints and apartmentTypes
  document.data.forEach(neighborhood => {
    // Add default interestPoints if it doesn't exist
      neighborhood.interestPoints = 0;  // Set your default value here
    console.log();

    // Ensure all apartmentTypes exist with a default value of 0
    const apartmentTypesInterestPoints = neighborhood['Apartment Type Interest Points'];
    const apartmentTypes = neighborhood['Apartment Type'];

    const defaultApartmentTypeInterestPoints = {};
    apartmentTypes.forEach(type => {
      defaultApartmentTypeInterestPoints[type] = 1;
    });

    neighborhood['Apartment Type Interest Points'] = {
      ...defaultApartmentTypeInterestPoints
    };
  });

  // Replace the entire document with the updated data
  await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .replace(document);

  console.log(`Updated all neighborhoods with default values.`);
}

/**
 * Updates a neighborhood by its name in the data array.
 * If the neighborhood is not found, an error is thrown.
 * @param {string} neighborhoodName - The name of the neighborhood to update.
 */
async function updateNeighborhoodInterestPoints(neighborhoodName) {
  console.log(`Updating neighborhood: ${neighborhoodName}`);

  // Retrieve the entire document
  const { resource: document } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .read();

  // Find the index of the neighborhood to be updated
  const neighborhoodIndex = document.data.findIndex(
    (neighborhood) => neighborhood.name === neighborhoodName
  );

  // If the neighborhood is not found, throw an error
  if (neighborhoodIndex === -1) {
    throw new Error(`Neighborhood ${neighborhoodName} not found.`);
  }

  const newInterestPoints = document.data[neighborhoodIndex].interestPoints
    ? document.data[neighborhoodIndex].interestPoints + 1
    : 1;
  // Update the neighborhood data
  document.data[neighborhoodIndex] = {
    ...document.data[neighborhoodIndex],
    interestPoints: newInterestPoints,
  };

  // Replace the entire document with the updated data
  await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .replace(document);

  console.log(
    `Updated neighborhood interestPoints: ${neighborhoodName} now has ${newInterestPoints} interest points`
  );
}

/**
 * Updates a neighborhood by its name in the data array.
 * If the neighborhood is not found, an error is thrown.
 * @param {string} neighborhoodName - The name of the neighborhood to update.
 */
async function updateNeighborhoodApartmentInterestPoints(
  neighborhoodName,
  apartmentType
) {
  console.log(`Updating neighborhood: ${neighborhoodName}`);

  // Retrieve the entire document
  const { resource: document } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .read();

  // Find the index of the neighborhood to be updated
  const neighborhoodIndex = document.data.findIndex(
    (neighborhood) => neighborhood.name === neighborhoodName
  );

  // If the neighborhood is not found, throw an error
  if (neighborhoodIndex === -1) {
    throw new Error(`Neighborhood ${neighborhoodName} not found.`);
  }

  const apartmentTypeInterestPoints = document.data[neighborhoodIndex]['Apartment Type Interest Points'];
  const newInterestPoints = ++apartmentTypeInterestPoints[apartmentType];

  // Update the neighborhood data
  document.data[neighborhoodIndex] = {
    ...document.data[neighborhoodIndex],
    'Apartment Type Interest Points': {
      ...apartmentTypeInterestPoints,
      [apartmentType]: newInterestPoints,
    },
  };

  // Replace the entire document with the updated data
  await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item("dataset", "dataset")
    .replace(document);

  console.log(
    `Updated ${apartmentType} interestPoints: ${neighborhoodName} now has ${newInterestPoints} interest points for ${apartmentType}`
  );
}

/**
 * Create family item if it does not exist
 */
async function createFamilyItem(itemBody) {
  const { item } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .items.upsert(itemBody);
  console.log(`Created family item with id:\n${itemBody.id}\n`);
}

/**
 * Query the container using SQL
 */
async function queryContainer(partKey) {
  console.log(`Querying container:\n${process.env.COSMOS_CONTAINER}`);

  // query to return all children in a family
  // Including the partition key value of country in the WHERE filter results in a more efficient query
  const querySpec = {
    query:
      // "SELECT VALUE r.children FROM root r WHERE r.partitionKey = @country",
      "SELECT * FROM root r WHERE r.partitionKey = @partkey",
    parameters: [
      {
        name: "@partkey",
        value: partKey,
      },
    ],
  };
  const { resources: results } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .items.query(querySpec)
    .fetchAll();

  return results[0];
}

/**
 * Replace the item by ID and [P]artitionKey.
 */
async function replaceFamilyItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  // Change property 'grade'
  // itemBody.children[0].grade = 6;
  const { item } = await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    // Select item to replace
    .item(itemBody.id, itemBody.partitionKey)
    // Replace it with anything
    .replace(itemBody);
}

/**
 * Delete the item by ID and partitionKey.
 */
async function deleteFamilyItem(itemBody) {
  await client
    .database(process.env.COSMOS_DB)
    .container(process.env.COSMOS_CONTAINER)
    .item(itemBody.id, itemBody.partitionKey)
    .delete(itemBody);
  console.log(`Deleted item:\n${itemBody.id}\n`);
}

module.exports = {
  addDefaultInterestPoints,
  createDatabase,
  createFamilyItem,
  queryContainer,
  replaceFamilyItem,
  deleteFamilyItem,
  updateNeighborhoodInterestPoints,
  updateNeighborhoodApartmentInterestPoints,
};
