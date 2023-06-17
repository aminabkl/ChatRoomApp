const mongoose = require("mongoose");

const emailTokenSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	emailToken: { type: String, required: true },
	createAt: { type: Date, default: Date.now(), expires: 10800 }, //expires in 3h
});

module.exports = mongoose.model("EmailToken", emailTokenSchema);
