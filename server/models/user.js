const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
	lastName: { type: String, Required: true },
	firstName: { type: String, Required: true },
	username: { type: String, Required: true, unique: true },
	email: { type: String, Required: true, unique: true },
	password: { type: String, Required: true },
	verification: { type: Boolean, default: false },
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
