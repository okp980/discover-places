const express = require("express");
const { body, check } = require("express-validator");

const {
	signInUser,
	createUser,
	getAllUsers,
	getSingleUser,
	updateUser,
} = require("../controllers/user.controller");

const route = express.Router();

route.get("/", getAllUsers);
route.get("/:uid", getSingleUser);
route.post(
	"/login",
	body("email").isEmail(),
	body("password").isLength({
		min: 4,
	}),
	signInUser
);
route.post(
	"/register",
	[
		body("email").isEmail(),
		body("password").isLength({
			min: 6,
		}),
		body("image").isLength({
			min: 4,
		}),
		body("name").isLength({
			min: 4,
		}),
	],
	createUser
);
route.patch(
	"/:uid",
	body("email").isEmail(),
	body("password").isLength({
		min: 4,
	}),
	updateUser
);

module.exports = route;
