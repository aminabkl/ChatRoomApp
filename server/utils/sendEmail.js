const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, tobject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: process.env.EMAIL_PORT,
			secure: process.env.SECURE,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: tobject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent");
		console.log(error);
	}
};
