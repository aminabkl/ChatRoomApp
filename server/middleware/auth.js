const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (!token) {
		console.log("token : ", token);
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};
