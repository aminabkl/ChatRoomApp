// chat.js
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const chatSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	socketId: { type: Number, required: true },
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

chatSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Chat", chatSchema);
