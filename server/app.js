//mongodb connection : mongodb+srv://<username>:<password>@cluster0.uz9idlp.mongodb.net/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

// const path = require("./uploads")

// const graphqlSchema = require("./graphql/schema");
// const { graphqlHTTP } = require("express-graphql");

const uri = `mongodb+srv://Hinde:hinde2003@cluster0.uz9idlp.mongodb.net/ChatProject?retryWrites=true&w=majority`;

const userRoutes = require("./routes/user");
// const serviceRoutes = require("./routes/service");
// const categoryRoutes = require("./routes/category");
// const subCategoryRoutes = require("./routes/sub_category");
const app = express();

mongoose
	.connect(uri)
	.then(() => {
		console.log("Successfully connected to MongoDB Atlas!");
	})
	.catch((error) => {
		console.log("Unable to connect to MongoDB Atlas!");
		console.error(error);
	});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

// app.use("/images", express.static(path.join(__dirname, "images")));

// app.use("/api", serviceRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/sub-category", subCategoryRoutes);

// app.use(
// 	"/graphql",
// 	graphqlHTTP({
// 		schema: graphqlSchema,
// 		graphiql: true,
// 	})
// );

app.use("/api", userRoutes);

module.exports = app;
