const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const emailToken = require("../models/emailToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.join = (req, res, next) => {
	bcrypt.hash(req.body.password, 10, function (err, hash) {
		const user = new User({
			lastName: req.body.lastName,
			firstName: req.body.firstName,
			username: req.body.username,
			email: req.body.email,
			password: hash,
		});
		user
			.save()
			.then(() => {
				// Create a verification token
				const newEmailToken = new emailToken({
					userId: user._id,
					emailToken: crypto.randomBytes(32).toString("hex"),
				});
				return newEmailToken.save();
			})
			.then((savedEmailToken) => {
				// Send verification email
				const verificationLink = `${process.env.BASE_URL}${user._id}/verify/${savedEmailToken.emailToken}`;
				sendEmail(user.email, "Email Verification", verificationLink);
				res.status(201).json({
					emailVerification:
						"An email was sent to your account please verify it",
				});
			})
			.catch((error) => {
				res.status(500).json({
					error: error,
				});
			});
	});
};

exports.signin = (req, res, next) => {
	User.findOne({ username: req.body.username })
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					error: "Wrong credentials !",
				});
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({
							error: "Wrong credentials !",
						});
					}

					if (!user.verification) {
						let token = emailToken.findOne({ userId: user._id });
						if (!token) {
							const newEmailToken = new emailToken({
								userId: user._id,
								emailToken: crypto.randomBytes(32).toString("hex"),
							}).save();
							const verificationLink = `http://${process.env.BASE_URL}users/${user._id}/verify/${newEmailToken.emailToken}`;
							sendEmail(user.email, "Email Verification", verificationLink);
						}
						return res.status(401).json({
							error: "Please verify your email !",
						});
					}
					const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
						expiresIn: process.env.JWT_EXPIRES_IN,
					});
					res.cookie("userId", user._id, { maxAge: 259200000 });
					res.cookie("token", token, { maxAge: 259200000 });

					emailToken.deleteOne({ userId: user._id }).exec();

					res.status(200).json({
						userId: user._id,
						token: token,
					});
				})
				.catch((error) => {
					res.status(500).json({
						error: error,
					});
				});
		})
		.catch((error) => {
			res.status(500).json({
				error: error,
			});
		});
};

exports.getUser = (req, res, next) => {
	User.findById(req.params.id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};
