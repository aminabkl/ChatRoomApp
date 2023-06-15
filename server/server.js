const http = require("http");
const express = require("express");
// const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors()); // Enable CORS with the provided options
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000", // Allow requests from this origin
		methods: ["GET", "POST"], // Allow specific HTTP methods
		credentials: true, // Enable credentials (e.g., cookies, authorization headers)
	},
});
const PORT = 8000;

io.on("connection", (socket) => {
	console.log(socket.id);
});

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
