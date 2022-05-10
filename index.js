const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

// routes
const placesRoute = require("./routes/places.routes");
const userRoute = require("./routes/user.routes");

// model
const HttpError = require("./model/error.model");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// route middleware
app.use("/api/places", placesRoute);
app.use("/api/users", userRoute);

// catch all route middleware
app.use((req, res, next) => {
	next(new HttpError(404, "Could not find this route"));
});

// error middleware
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "An Unkown Error Occured" });
});

// mongoose.connect(
// 	"mongodb+srv://okpunor:<password>@cluster0.cch23.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
// 	function (error) {
// 		if (error) {
// 			console.log("error occurred trying to connect to database");
// 			return;
// 		}

// 		console.log("successfully connected to database");
// 		app.listen(PORT, () => {
// 			console.log(`Server Running on port ${PORT}`);
// 		});
// 	}
// );

mongoose
	.connect(
		"mongodb+srv://okpunor:p70kesz3V4rpfglN@cluster0.cch23.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	)
	.then((res) => {
		console.log("successfully connected to database");
		app.listen(PORT, () => {
			console.log(`Server Running on port ${PORT}`);
		});
	})
	.catch((error) => console.log(error.message));
