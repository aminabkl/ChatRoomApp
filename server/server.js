const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

const errorHandler = (error) => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind =
		typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});
let socketsConnected = new Set();

const io = require("socket.io")(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

io.on("connection", onConnected);
function onConnected(socket) {
	console.log("CON => ", socket.id);
	socketsConnected.add(socket.id);

	io.emit("client-total", socketsConnected.size);

	socket.on("disconnect", () => {
		console.log("DISCON => ", socket.id);
		socketsConnected.delete(socket.id);
		io.emit("client-total", socketsConnected.size);
	});
	socket.on("message", (data) => {
		socket.broadcast.emit("chat-message", data);
	});
	socket.on("feedback", (data) => {
		socket.broadcast.emit("feedback", data);
	});
}

server.listen(port);




// const http = require("http");
// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: ["GET", "POST"],
// 		credentials: true,
// 	},
// });
// const PORT = 8000;

// let socketsConnected = new Set();

// io.on("connection", onConnected);
// function onConnected(socket) {
// 	console.log("CON => ", socket.id);
// 	socketsConnected.add(socket.id);

// 	io.emit("client-total", socketsConnected.size);

// 	socket.on("disconnect", () => {
// 		console.log("DISCON => ", socket.id);
// 		socketsConnected.delete(socket.id);
// 		io.emit("client-total", socketsConnected.size);
// 	});
// 	socket.on("message", (data) => {
// 		socket.broadcast.emit("chat-message", data);
// 	});
// 	socket.on("feedback", (data) => {
// 		socket.broadcast.emit("feedback", data);
// 	});
// }

// server.listen(PORT, () => {
// 	console.log(`Server started on port ${PORT}`);
// });
