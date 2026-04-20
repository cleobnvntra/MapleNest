const { Router } = require("express");
const topNeighborhoodApartmentTypes = require("./topNeighborhoodApartments");
const topNeighborhoods = require("./topNeighborhoods");

const router = new Router();

router.post("/popular/neighborhoods", topNeighborhoods);
router.post("/popular/apartmentTypes", topNeighborhoodApartmentTypes);

module.exports = router;
