const { Router } = require("express");
const interestMiddleware = require("../middleware/interestMiddleware");
const graphsRouter = require("./graphs/");
const dataRouter = require("./data/");

const router = new Router();

router.post("/chat", require("./Chat"));
router.post("/chat/compare", require("./Chat/compareChat"));

router.post("/predict", require("./Predict"));
router.post(
  "/predict/stats",
  interestMiddleware(
    (req) => req.body.neighbourhood,
    (req) => req.body.apartmentType
  ),
  require("./Predict/getAverageStatsForNeighborhood")
);
router.post(
  "/predict/stats/compare",
  interestMiddleware(
    (req) => req.body.neighbourhood1.name,
    (req) => req.body.neighbourhood1.apartmentType
  ),
  interestMiddleware(
    (req) => req.body.neighbourhood2.name,
    (req) => req.body.neighbourhood2.apartmentType
  ),
  require("./Predict/getCompareStats")
);

// Joining graphs and data routes
router.use("/data", dataRouter);
router.use("/graphs", graphsRouter);

module.exports = router;
