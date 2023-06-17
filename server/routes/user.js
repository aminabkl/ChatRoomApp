const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const User = require("../models/user");
const EmailTokenDb = require("../models/emailToken");

router.post("/join", userCtrl.join);
router.post("/signin", userCtrl.signin);
router.get("/user/:id", userCtrl.getUser);

router.get("/:id/verify/:emailToken", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id }).exec();
		if (!user) {
			return res.status(400).json({ message: "Invalid link or expired" });
		}
		const newEmailToken = await EmailTokenDb.findOne({
			userId: user._id,
			emailToken: req.params.emailToken,
		}).exec();
		if (!newEmailToken) {
			return res.status(400).json({
				message: "Invalid link or expired ",
			});
		}
		await User.updateOne({ _id: user._id }, { verification: true }).exec();
		res.status(200).json({ message: "Email verified" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "An error occurred", error: error });
	}
});

module.exports = router;
