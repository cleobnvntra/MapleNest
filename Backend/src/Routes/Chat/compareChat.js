const AIChat = require("../../services/AIChat");

module.exports = async (req, res) => {
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

  console.log(respondLanguage);

  if (!req.body.prompt) {
    return res.status(400).send("Bad Request: Missing prompt.");
  }

  if (!req.body.neighbourhood1 || !req.body.neighbourhood2) {
    return res.status(400).send("Bad Request: Missing neighbourhood.");
  }

  const userPrompt = req.body.prompt;
  const neighbourhood1 = req.body.neighbourhood1;
  const neighbourhood2 = req.body.neighbourhood2;

  try {
    const aiChat = new AIChat();
    const reply = await aiChat.sendCompareMessage(
      userPrompt,
      neighbourhood1,
      neighbourhood2,
      respondLanguage.long
    );

    console.log(reply);
    res.type("text/plain");
    res.send(reply);
  } catch (err) {
    res.send("Unable to parse format!");
  }
};
