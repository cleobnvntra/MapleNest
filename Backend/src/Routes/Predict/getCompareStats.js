const PredictionService = require("../../services/PredictionService");
const { queryContainer, replaceFamilyItem } = require("../../database/cosmos");
const AIChat = require("../../services/AIChat");

module.exports = async (req, res) => {
  try {
    const { data } = await queryContainer("dataset");
    console.log("RECEIVED COMPARE REQUEST");
    console.log(req.body);

    const {
      neighbourhood1,
      neighbourhood2,
      collegeName,
      campusName,
      date,
      prompt,
    } = req.body;

    console.log('LANGUAGE PRINTING');
    console.log(req.body.lang);
    const lang = req.body.lang || "en";
    const languages = [
      {
        short: "de",
        long: "German",
      },
      {
        short: "en",
        long: "English",
      },
      {
        short: "fr",
        long: "French",
      },
      {
        short: "ar",
        long: "Arabic",
      },
      {
        short: "hi",
        long: "Hindi",
      },
      {
        short: "ru",
        long: "Russian",
      },
      {
        short: "uk",
        long: "Ukrainian",
      },
      {
        short: "zh",
        long: "Chinese",
      },
    ];

    const respondLanguage = languages.find((l) => l.short === lang);

    const stats1Promise = getStats(
      data,
      res,
      neighbourhood1.name,
      neighbourhood1.apartmentType,
      date,
      collegeName,
      campusName,
      prompt,
      respondLanguage
    );

    const stats2Promise = getStats(
      data,
      res,
      neighbourhood2.name,
      neighbourhood2.apartmentType,
      date,
      collegeName,
      campusName,
      prompt,
      respondLanguage
    );

    console.log("STARTED STATS1 PROMISE");
    console.log("STARTED STATS2 PROMISE");

    const stats1 = await stats1Promise;
    const stats2 = await stats2Promise;

    console.log("RECEIVED STATS1 PROMISE");
    console.log("RECEIVED STATS2 PROMISE");

    if (!stats1 || !stats2) {
      return;
    }

    res.status(200).json({
      neighbourhood1: stats1,
      neighbourhood2: stats2,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const findCloseTo = (neighborhoodObj, typeField) => {
  const options = neighborhoodObj.close_to.find(
    (location) => location.type === typeField
  ).options;
  return options || [];
};

const calcMean = (options, valueField) => {
  let totalTime = 0;

  options.forEach((option) => {
    totalTime += parseInt(option[valueField]);
  });

  const meanTime = totalTime / options.length;
  return meanTime;
};

const getStats = async (
  data,
  res,
  neighbourhood,
  apartmentType,
  date,
  collegeName,
  campusName,
  prompt,
  respondLanguage
) => {
  const neighborhoodObj = data.find((n) => n.name === neighbourhood);

  if (!neighborhoodObj) {
    res.status(404).send("Neighborhood not found!");
    return null;
  }

  const colleges = neighborhoodObj.college;
  const college = colleges.find((c) => c.name === collegeName);

  if (!college) {
    res.status(404).send("College not found!");
    return null;
  }

  const campus = college.campus.find((c) => c.name.name === campusName);

  if (!campus) {
    res.status(404).send("Campus not found!");
    return null;
  }

  const avgTravelTime = campus.time_to_campus;

  const key = `${neighbourhood}${apartmentType}${collegeName}${campusName}${date}`;

  // queries container based on its partition key
  let cacheData = await queryContainer("cache");

  console.log("PRINTING CACHE");
  console.log(cacheData);

  let prediction = null;

  for (let i = 0; i < cacheData.data.length; ++i) {
    if (cacheData.data[i].key === key) {
      prediction = cacheData.data[i].value;
      console.log("CACHE HIT");
    }
  }

  if (!prediction) {
    const predictionService = new PredictionService();
    prediction = await predictionService.predict(
      neighbourhood,
      apartmentType,
      date
    );
    const cachedData = {
      key: key,
      value: prediction,
    };

    cacheData.data.push(cachedData);

    await replaceFamilyItem(cacheData);
  }

  const subwayStations = findCloseTo(neighborhoodObj, "subway_station");
  const meanSubwayStationsTime = calcMean(subwayStations, "time");

  const convenienceStores = findCloseTo(neighborhoodObj, "convenience_store");
  const meanConvenienceStoreTime = calcMean(convenienceStores, "time");

  const busStations = findCloseTo(neighborhoodObj, "bus_station");
  const meanBusStationTime = calcMean(busStations, "time");

  const aiChat = new AIChat();
  const description = await aiChat.sendMessageInSpecificLanguage(prompt, neighbourhood, respondLanguage.long);

  const stats = {
    avgTravelTime: avgTravelTime || 0,
    prediction,
    subwayStations: {
      mean: meanSubwayStationsTime || 0,
      items: subwayStations,
    },
    convenienceStores: {
      mean: meanConvenienceStoreTime || 0,
      items: convenienceStores,
    },
    busStations: {
      mean: meanBusStationTime || 0,
      items: busStations,
    },
    description,
  };

  return stats;
};
