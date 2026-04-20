const { Router } = require("express");
const getAllNeighborhoods = require("./getAllNeighborhoods");
const getAllColleges = require("./getAllColleges");
const getAllCampusesForCollege = require("./getAllCampusesForCollege");
const getAllApartmentTypes = require("./getAllApartmentTypes");
const getAllAptNeighbourComb = require("./getAllAptNeighbourComb");
const getClosestNeighbourhoods = require("./getClosestNeighbourhoods");
const getAllGraphs = require("./getAllGraphs");
const all = require("./all");

const router = new Router();

router.get('/all', all);
router.post('/all_graphs', getAllGraphs);
router.post("/closest_neighbourhoods", getClosestNeighbourhoods);
router.post("/campuses", getAllCampusesForCollege);
router.get("/neighborhoods", getAllNeighborhoods);
router.get("/colleges", getAllColleges);
router.get("/apartment_types", getAllApartmentTypes);
router.get("/apt_neighbourhood_comb", getAllAptNeighbourComb);

module.exports = router;
