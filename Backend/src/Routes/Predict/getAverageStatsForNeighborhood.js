const PredictionService = require("../../services/PredictionService");
const AIChat = require("../../services/AIChat");
const { queryContainer, replaceFamilyItem } = require("../../database/cosmos");

module.exports = async (req, res) => {
  try {
    const fullData = await queryContainer("dataset");
    const data = fullData.data;
    console.log("RECEIVED PREDICITON REQUEST");
    console.log(req.body);

    const {
      neighbourhood,
      collegeName,
      campusName,
      date,
      apartmentType,
      prompt,
    } = req.body;
    const neighborhoodObj = data.find((n) => n.name === neighbourhood);
    console.log('PRINTING BODY');
    console.log(req.body);
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

    const respondLanguage = languages.find((l) => l.short === lang).long;
    console.log('SHORT LANGUAGE:');
    console.log(lang);
    console.log('LANGUAGE:');
    console.log(respondLanguage);

    if (!neighborhoodObj) {
      return res.status(404).send("Neighborhood not found!");
    }

    const colleges = neighborhoodObj.college;
    const college = colleges.find((c) => c.name === collegeName);

    if (!college) {
      return res.status(404).send("College not found!");
    }

    const campus = college.campus.find((c) => c.name.name === campusName);

    if (!campus) {
      return res.status(404).send("Campus not found!");
    }

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

    const avgTravelTime = campus.time_to_campus;

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
    const description = await aiChat.sendMessageInSpecificLanguage(prompt, neighbourhood, respondLanguage);

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

    res.status(200).json(stats);
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
