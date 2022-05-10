const express = require("express");
const { body } = require("express-validator");
const {
	getPlaces,
	postPlaces,
	getPlace,
	getPlacesByUser,
	updatePlace,
	deletePlace,
} = require("../controllers/places.controllers");

const router = express.Router();

// router.route("/").get(getPlaces).post(postPlaces);

router.get("/", getPlaces); //all places
router.get("/user/:uid", getPlacesByUser); //get place by userID
router.get("/:placeId", getPlace); // get  single place
router.post(
	"/",
	[
		body("title").notEmpty().withMessage("title cannot be empty"),
		body("description")
			.notEmpty()
			.withMessage("description cannot be empty")
			.isLength({ min: 6 })
			.withMessage("description is too short"),
		body("address").notEmpty(),
	],
	postPlaces
); //add places
router.patch(
	"/:pid",
	[
		body("title").notEmpty().withMessage("title cannot be empty"),
		body("description")
			.notEmpty()
			.withMessage("description cannot be empty")
			.isLength({ min: 6 })
			.withMessage("description is too short"),
	],
	updatePlace
); //update places
router.delete("/:pid", deletePlace); //delete place

module.exports = router;
