const HttpError = require("../model/error.model");
const { body, validationResult } = require("express-validator");
const User = require("../model/user.model");

exports.getAllUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (error) {
		return next(new HttpError(500, "could not get users from database"));
	}

	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.getSingleUser = async (req, res, next) => {
	const userId = req.params.uid;
	let user;
	try {
		user = await User.findById(userId);
	} catch (error) {
		return next(new HttpError(500, "Error finding user in database"));
	}

	if (!user) {
		return next(new HttpError(404, "User not found"));
	}
	res.json({ user: user.toObject({ getters: true }) });
};

exports.signInUser = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		let errs = errors.array().map((e) => ({ [e.param]: e.msg }));
		return res
			.status(400)
			.json({ errors: errs, message: "invalid input field" });
	}

	const { email, password } = req.body;
	let user;
	try {
		user = await User.findOne({ email });
	} catch (error) {
		return next(
			new HttpError(500, "Error occurred trying to get user from database")
		);
	}

	if (!user || user.password !== password) {
		return next(new HttpError(403, "Unauthorized access"));
	}
	res.json({ message: "signed in successfully" });
};

exports.createUser = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		let errs = errors.array().map((e) => ({ [e.param]: e.msg }));
		return res
			.status(400)
			.json({ errors: errs, message: "invalid input field" });
	}
	const { email, password, name, image } = req.body;

	const user = new User({
		email,
		password,
		name,
		image,
		places: [],
	});
	try {
		await user.save();
		res.status(201).json({ message: "User has been added" });
	} catch (error) {
		return next(new HttpError(500, "Error creating new user"));
	}
};

exports.updateUser = (req, res, next) => {
	const errors = validationResult(req);
	const { email, name, password } = req.body;
	const userId = req.params.uid;
	const user = users.find((u) => u.id === userId);
	if (user) {
		const userIndex = users.findIndex((u) => u.id === userId);
		const updatedUser = { ...user };
		updatedUser.email = email;
		updatedUser.name = name;
		updatedUser.password = password;
		users[userIndex] = updatedUser;
		res.json({ user: updatedUser });
	} else {
		next(new HttpError(404, "User not found"));
	}
};
