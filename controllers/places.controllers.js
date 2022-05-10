const path = require("path");
const HttpError = require("../model/error.model");
const { v4: uuidv4 } = require("uuid");
const Place = require("../model/product.model");
const { validationResult } = require("express-validator");
const { getGeolocation } = require("../util");
const User = require("../model/user.model");
const { default: mongoose } = require("mongoose");

exports.getPlaces = async (req, res, next) => {
	let places;
	try {
		places = await Place.find();
	} catch (error) {
		return next(new HttpError(500, "Error fetching places from database"));
	}
	res.json({ places: places.map((pl) => pl.toObject({ getters: true })) });
};

exports.postPlaces = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ message: errors.array() });
	}
	const { title, description, address, creator } = req.body;
	const place = new Place({
		title,
		description,
		location: getGeolocation(address),
		address,
		creator,
	});

	let user;
	try {
		user = await User.findById(creator);
	} catch (error) {
		return next(new HttpError(500, "Error retrieving user from server"));
	}

	if (!user) {
		return next(new HttpError(404, "User not found"));
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		const createdPlace = await place.save({ session: sess });
		user.places.push(createdPlace);
		await user.save({ session: sess });
		sess.commitTransaction();
	} catch (error) {
		console.log(error);
		return next(new HttpError(500, "Error saving to database"));
	}
	res.status(201).json({ message: "success", place });
};

exports.getPlace = async (req, res, next) => {
	let place;
	try {
		const { placeId } = req.params;
		place = await Place.findById(placeId);
	} catch (error) {
		return next(new HttpError(500, "Error getting place from server"));
	}

	if (place) {
		return res.json({ place: place.toObject({ getters: true }) });
	} else {
		const error = new HttpError(404, "place does not exist");
		return next(error);
	}
};

exports.getPlacesByUser = async (req, res, next) => {
	const userId = req.params.uid;
	// try {
	// 	const userplaces = await Place.find({ creator: userId });
	// 	if (userplaces.length > 0) {
	// 		return res.json({
	// 			places: userplaces.map((pl) => pl.toObject({ getters: true })),
	// 		});
	// 	} else {
	// 		const error = new HttpError(404, "No places availble for this user");
	// 		next(error);
	// 	}
	// } catch (error) {
	// 	next(new HttpError(500, "Error fetching data from database"));
	// }
	let user;
	try {
		user = await User.findById(userId).populate("places");
	} catch (error) {
		return next(
			new HttpError(500, "Error occurred trying to get data from server")
		);
	}
	if (!user) {
		return next(new HttpError(404, "User not found"));
	}
	res.json({
		places: user.places,
	});
};

exports.updatePlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(400).json({ message: errors.array() });
	}
	const placeId = req.params.pid;
	const { title, description } = req.body;
	let place;
	try {
		place = await Place.findById(placeId);
	} catch (error) {
		return next(new HttpError(500, "Error updating to database"));
	}
	if (place) {
		place.title = title;
		place.description = description;
		try {
			await place.save();
			res.json({
				message: "places has been updated",
				place,
			});
		} catch (error) {
			next(new HttpError(500, "Error trying to save updated data to database"));
		}
	} else {
		return next(new HttpError(422, "place does not exist"));
	}
};

exports.deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;
	try {
		await Place.deleteOne({ _id: placeId });
		res.json({ message: "place has been deleted", places });
	} catch (error) {
		return next(new HttpError(500, "Error deleting data from database"));
	}

	if (place) {
		places = places.filter((p) => p.id !== placeId);
	} else {
		next(new HttpError(422, "place does not exist"));
	}
};
